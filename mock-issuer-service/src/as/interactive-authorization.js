import crypto from "crypto";
import { iarSessions } from "./iar-store.js";
import { authCodeStore } from "./authz-store.js";
import { ISSUER } from "../issuer-metadata.js";
function randomSession() {
  return crypto.randomBytes(10).toString("hex");
}

function randomCode() {
  return crypto.randomBytes(16).toString("hex");
}

export default function interactiveAuthorizationHandler(req, res) {
  // --------------------------
  // CASE 1: PHASE 2 (wallet returns VP)
  // --------------------------
  if (req.body.auth_session) {
    const sessionId = req.body.auth_session;
    const session = iarSessions.get(sessionId);

    if (!session) {
      return res.status(400).json({ error: "invalid_session" });
    }

    const openid4vp_response = req.body;
    console.log("Received openid4vp_response:", openid4vp_response);
    if (!openid4vp_response) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "openid4vp_response missing",
      });
    }

    // MOCK validation: accept any VP
    // real-world: validate signature, proof, etc.

    // Create authorization code
    const code = randomCode();

    authCodeStore.set(code, {
      client_id: session.client_id,
      redirect_uri: session.redirect_uri,
      scope: "openid",
      created_at: Date.now(),
    });

    // Clean session
    iarSessions.delete(sessionId);

    return res.json({
      status: "authorization_code_issued",
      code: code,
      state: session.state || null,
      iss: `${ISSUER}/as`,
    });
  }

  // --------------------------
  // CASE 2: PHASE 1 (start IAR flow)
  // --------------------------

  const {
    client_id,
    redirect_uri,
    state,
    issuer_state,
    authorization_details,
  } = req.body;

  // Create presentation definition / DCQL query
  const pd = {
    id: "vp token example",
    purpose:
      "Relying party is requesting your digital ID for the purpose of Self-Authentication",
    format: {
      ldp_vc: {
        proof_type: ["RsaSignature2018"],
      },
    },
    input_descriptors: [
      {
        id: "id card credential",
        format: {
          ldp_vc: {
            proof_type: ["Ed25519Signature2020", "RsaSignature2018"],
          },
        },
        constraints: {
          fields: [
            {
              path: ["$.credentialSubject.email"],
              filter: {
                type: "string",
                pattern: "@gmail.com",
              },
            },
          ],
        },
      },
    ],
  };

  const sessionId = randomSession();

  iarSessions.set(sessionId, {
    client_id,
    redirect_uri,
    state,
    issuer_state,
    authorization_details,
    pd,
  });
  const requestObject = {
    client_id:
      "redirect_uri:https://129e4f0672b6.ngrok-free.app/verifier/vp-response",
    presentation_definition_uri:
      "https://129e4f0672b6.ngrok-free.app/verifier/presentation_definition_uri",
    response_type: "vp_token",
    response_mode: "iar-post",
    nonce: "9OKP62PdHCD71Z04LfXthA==",
    state: "0jKDA07LVeVoMznct2gJZg==",
    response_uri: "https://129e4f0672b6.ngrok-free.app/verifier/vp-response",
    client_metadata: {
      client_name: "Requester name",
      logo_uri:
        "https://mosip.github.io/inji-config/logos/StayProtectedInsurance.png",
      authorization_encrypted_response_alg: "ECDH-ES",
      authorization_encrypted_response_enc: "A256GCM",
      jwks: {
        keys: [
          {
            kty: "OKP",
            crv: "X25519",
            use: "enc",
            x: "BVNVdqorpxCCnTOkkw8S2NAYXvfEvkC-8RDObhrAUA4",
            alg: "ECDH-ES",
            kid: "verifier-key-id",
          },
        ],
      },
      vp_formats: {
        mso_mdoc: {
          alg: ["ES256"],
        },
        ldp_vp: {
          proof_type: [
            "Ed25519Signature2018",
            "Ed25519Signature2020",
            "RsaSignature2018",
          ],
        },
      },
    },
  };
  // Respond with a presentation request
  return res.json({
    status: "require_interaction",
    type: "openid4vp_presentation",
    auth_session: sessionId,
    openid4vp_request: requestObject,
  });
}
