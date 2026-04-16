import crypto from "crypto";
import { resolveIssuanceOptions } from "../issuance-options.js";
import { authServerBaseUrl, issuerBaseUrl } from "../issuer-profile.js";
import { preAuthCodeStore } from "../as/authz-store.js";

export default function credentialOfferHandler(req, res) {
  const options = resolveIssuanceOptions(req.query);
  const flow = options.flow === "pdi" ? "pdi" : null;
  const issuer = issuerBaseUrl(options.version, true, flow);
  const authServer = authServerBaseUrl(
    options.version,
    true,
    flow,
  );

  // random issuer_state for this issuance session
  const issuerState = crypto.randomBytes(8).toString("hex");

  let grantResponse = {};

  if (options.flow === "pdi") {
    grantResponse = {
      authorization_code: {
        issuer_state: issuerState,
        authorization_server: authServer,
      },
      interaction_required: {
        mode: "presentation_during_issuance",
        endpoint: `${authServer}/interactive-authorization`,
      },
    };
  } else if (options.flow === "pre-auth" || options.flow === "pre-auth-tx") {
    const preAuthorizedCode = crypto.randomBytes(16).toString("hex");
    let txCode = null;
    
    const grant = {
      "pre-authorized_code": preAuthorizedCode,
    };

    if (options.flow === "pre-auth-tx") {
      // Use the tx_code passed from the UI/Console
      txCode = req.query.tx_code || "0000"; 
      grant.tx_code = {
        length: txCode.length,
        input_mode: "numeric",
        description: "Please enter the PIN displayed on the issuer console"
      };
    }

    preAuthCodeStore.set(preAuthorizedCode, {
      txCode,
      configurationId: options.credentialDetails.configurationId,
      scope: options.credentialDetails.scope
    });

    grantResponse = {
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": grant
    };
  } else {
    grantResponse = {
      authorization_code: {
        issuer_state: issuerState,
      },
    };
  }

  const response = {
    credential_issuer: issuer,
    issuer_state: issuerState,
    credential_configuration_ids: [options.credentialDetails.configurationId],
    grants: grantResponse,
  };

  return res.json(response);
}
