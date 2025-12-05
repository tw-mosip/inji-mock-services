import crypto from "crypto";
import { ISSUER } from "../issuer-metadata.js";

export default function credentialOfferHandler(req, res) {
  const issuer = ISSUER;

  // random issuer_state for this issuance session
  const issuerState = crypto.randomBytes(8).toString("hex");

  // The credential_configuration_id that your mock issuer supports
  const credentialConfigurations = [
    "UniversityDegreeCredential",
  ];

  const response = {
    credential_issuer: issuer,

    // NEW 1.1 field
    issuer_state: issuerState,

    // as per spec: can be array or single object
    credential_configuration_ids: credentialConfigurations,

    grants: {
      "authorization_code": {
        issuer_state: issuerState
      }
    }
  };

  return res.json(response);
}
