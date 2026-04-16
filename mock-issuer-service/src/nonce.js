import { randomUUID } from 'node:crypto';
import { hasExplicitVersion, resolveRequestVersion } from "./issuer-profile.js";

export default function nonceHandler(req, res) {
  if (hasExplicitVersion(req) && resolveRequestVersion(req) === "draft13") {
    return res.status(404).json({
      error: "unsupported_endpoint",
      error_description: "nonce endpoint is not available for the draft13 issuer profile",
    });
  }

  res.setHeader('Cache-Control', 'no-store');
  res.json({
    c_nonce: randomUUID(),
    c_nonce_expires_in: 300,
  });
}
