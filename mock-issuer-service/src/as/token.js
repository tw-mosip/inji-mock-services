import crypto from "crypto";
import { authCodeStore } from "./authz-store.js";

function base64url(str) {
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function tokenHandler(req, res) {
  const {
    grant_type,
    code,
    redirect_uri,
    client_id
  } = req.body;
  console.log("Token Request:", grant_type, code);
  // 1. Only authorization_code supported
  if (grant_type !== "authorization_code") {
    return res.status(400).json({
      error: "unsupported_grant_type",
      error_description: "Only authorization_code grant is supported"
    });
  }

  // 2. Authorization code must exist
  const entry = authCodeStore.get(code);
  if (!entry) {
    return res.status(400).json({
      error: "invalid_grant",
      error_description: "Invalid or expired authorization code"
    });
  }

  // 3. Validate redirect_uri
  if (redirect_uri !== entry.redirect_uri) {
    return res.status(400).json({
      error: "invalid_grant",
      error_description: "redirect_uri mismatch"
    });
  }

  // 4. Validate client_id
  if (client_id !== entry.client_id) {
    return res.status(400).json({
      error: "invalid_client",
      error_description: "client_id mismatch"
    });
  }

  // 5. Issue access_token + c_nonce
  const accessToken = base64url(crypto.randomBytes(32).toString("base64"));
  const cNonce = base64url(crypto.randomBytes(16).toString("base64"));

  // 6. Delete code after use
  authCodeStore.delete(code);

  // 7. Return OAuth Token Response
  res.setHeader("Cache-Control", "no-store");
  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 3600,

    // c_nonce for proof signing
    c_nonce: cNonce,
    c_nonce_expires_in: 300,

    scope: entry.scope
  });
}
