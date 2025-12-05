import { STATIC_LDP_VC } from "./static-vc.js";
// import { accessTokenStore } from "../as/authz-store.js";

export default function credentialEndpoint(req, res) {
  const {format, proof } = req.body;

  

//   const tokenData = accessTokenStore.get(access_token);
//   if (!tokenData) {
//     return res.status(401).json({ error: "invalid_token" });
//   }

  // ---- Validate format ----
  if (format !== "ldp_vc") {
    return res.status(400).json({
      error: "unsupported_credential_format"
    });
  }

  // ---- Validate proof (mock) ----
  if (!proof || !proof.jwt) {
    return res.status(400).json({
      error: "invalid_proof",
      error_description: "proof.jwt missing"
    });
  }

  // ---- Return STATIC VC ----
  return res.json({
    format: "ldp_vc",
    credential: STATIC_LDP_VC
  });
}
