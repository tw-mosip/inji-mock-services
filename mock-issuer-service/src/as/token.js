import crypto from "crypto";
import {
  accessTokenStore,
  authCodeStore,
  preAuthCodeStore,
  stageTestErrorStore,
  generateDPoPNonce,
  isDPoPNonceValid,
} from "./authz-store.js";
import { envTestError, sendTestError } from "../test-errors.js";
import { verifyDPoPProof, buildHtu, DPoPError } from "./dpop.js";

function base64url(str) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// USE_DPOP_NONCE=true  → AS requires a server-issued nonce in the DPoP proof (tests retry flow)
// USE_DPOP_NONCE=false → AS accepts proofs without a nonce (default, simpler happy-path test)
const REQUIRE_DPOP_NONCE = String(process.env.USE_DPOP_NONCE ?? "false").toLowerCase() === "true";

export default async function tokenHandler(req, res) {
  const {
    grant_type,
    code,
    "pre-authorized_code": preAuthorizedCode,
    tx_code: txCodeInput,
    redirect_uri,
    client_id
  } = req.body;
  console.log("Token Request:", grant_type, code || preAuthorizedCode);

  let scope;
  let testError = envTestError("token") || stageTestErrorStore.get("token") || null;
  let credentialTestError =
    envTestError("credential") || stageTestErrorStore.get("credential") || null;

  if (grant_type === "authorization_code") {
    const entry = authCodeStore.get(code);
    if (!entry) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired authorization code"
      });
    }
    if (redirect_uri !== entry.redirect_uri) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "redirect_uri mismatch"
      });
    }
    if (client_id !== entry.client_id) {
      return res.status(400).json({
        error: "invalid_client",
        error_description: "client_id mismatch"
      });
    }
    scope = entry.scope;
    testError ||= entry.testError?.stage === "token" ? entry.testError : null;
    credentialTestError ||= entry.testError?.stage === "credential" ? entry.testError : null;
    authCodeStore.delete(code);
  } else if (grant_type === "urn:ietf:params:oauth:grant-type:pre-authorized_code") {
    if (!preAuthorizedCode) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "pre-authorized_code missing"
      });
    }
    const entry = preAuthCodeStore.get(preAuthorizedCode);
    if (!entry) {
      return res.status(400).json({
        error: "invalid_grant",
        error_description: "Invalid or expired pre-authorized code"
      });
    }
    if (entry.txCode) {
      if (txCodeInput === undefined || txCodeInput === null || txCodeInput === "") {
        return res.status(400).json({
          error: "invalid_request",
          error_description: "tx_code is REQUIRED for this pre-authorized_code"
        });
      }
      if (txCodeInput !== entry.txCode) {
        return res.status(400).json({
          error: "invalid_grant",
          error_description: "Invalid tx_code"
        });
      }
    }
    scope = entry.scope;
    testError ||= entry.testError?.stage === "token" ? entry.testError : null;
    credentialTestError ||= entry.testError?.stage === "credential" ? entry.testError : null;
    preAuthCodeStore.delete(preAuthorizedCode);
  } else {
    return res.status(400).json({
      error: "unsupported_grant_type",
      error_description: "Only authorization_code and pre-authorized_code grants are supported"
    });
  }

  if (testError) stageTestErrorStore.delete("token");
  if (sendTestError(res, testError)) return;

  // ── DPoP handling ──────────────────────────────────────────────────────────
  const dpopProof = req.headers["dpop"];
  let dpopThumbprint = null;
  let tokenType = "Bearer";

  if (dpopProof) {
    // Fresh nonce for proactive use (always issued so wallet can include it next time)
    const freshNonce = generateDPoPNonce();

    // Determine which nonce to enforce
    const proofNonce = REQUIRE_DPOP_NONCE ? freshNonce : undefined;

    // If nonce is required, first check whether the proof carries a VALID existing nonce
    let nonceToEnforce;
    if (REQUIRE_DPOP_NONCE) {
      // Accept any unexpired nonce from the store (not just the one we just generated)
      // We'll let verifyDPoPProof handle it — just pass undefined to skip the check here,
      // then manually verify the nonce claim is present and valid.
      nonceToEnforce = undefined; // checked below
    }

    try {
      const htu = buildHtu(req);
      const result = await verifyDPoPProof(dpopProof, "POST", htu, {
        nonce: nonceToEnforce,
      });

      // Manual nonce enforcement (any valid nonce in store is acceptable)
      if (REQUIRE_DPOP_NONCE) {
        // Extract nonce from proof payload (already decoded inside verifyDPoPProof —
        // re-decode header to get at payload)
        const { decodeJwt } = await import("jose");
        const proofPayload = decodeJwt(dpopProof);
        if (!proofPayload.nonce || !isDPoPNonceValid(proofPayload.nonce)) {
          res.setHeader("DPoP-Nonce", freshNonce);
          return res.status(400).json({
            error: "use_dpop_nonce",
            error_description: "Authorization server requires nonce in DPoP proof",
          });
        }
      }

      dpopThumbprint = result.thumbprint;
      tokenType = "DPoP";
      console.log(`DPoP proof valid (alg: ${result.jwk?.crv || "RSA"}, thumbprint: ${dpopThumbprint})`);
    } catch (err) {
      if (err instanceof DPoPError && err.code === "use_dpop_nonce") {
        res.setHeader("DPoP-Nonce", freshNonce);
        return res.status(400).json({
          error: "use_dpop_nonce",
          error_description: err.description,
        });
      }
      console.warn("DPoP proof validation failed:", err.message);
      res.setHeader("DPoP-Nonce", freshNonce);
      return res.status(400).json({
        error: "invalid_dpop_proof",
        error_description: err.message,
      });
    }
  }
  // ── End DPoP handling ──────────────────────────────────────────────────────

  // Issue access_token + c_nonce
  const accessToken = base64url(crypto.randomBytes(32).toString("base64"));
  const cNonce = base64url(crypto.randomBytes(16).toString("base64"));
  accessTokenStore.set(accessToken, {
    created_at: Date.now(),
    scope,
    tokenType,
    dpopThumbprint,   // null for Bearer tokens
    testError: credentialTestError,
  });
  if (credentialTestError) stageTestErrorStore.delete("credential");

  res.setHeader("Cache-Control", "no-store");

  // Always include a fresh DPoP-Nonce so the wallet can proactively bind it
  // to the credential-endpoint proof (recommended by RFC 9449 §8.1)
  if (dpopProof) {
    res.setHeader("DPoP-Nonce", generateDPoPNonce());
  }

  res.json({
    access_token: accessToken,
    token_type: tokenType,
    expires_in: 3600,
    c_nonce: cNonce,
    c_nonce_expires_in: 300,
    scope,
  });
}
