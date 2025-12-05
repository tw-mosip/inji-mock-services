import { ISSUER } from "../issuer-metadata.js";

// src/as/metadata.js
const AS_ISSUER = `${ISSUER}/as`;

export default function authServerMetadata(req, res) {
  res.json({
    // The "issuer" of this Authorization Server
    issuer: AS_ISSUER,

    // Where the wallet will send the user for interactive authorization
    authorization_endpoint: `${AS_ISSUER}/authorize`,

    // Where the wallet will later exchange the code for tokens
    token_endpoint: `${AS_ISSUER}/token`,

    // Optional PAR (you can wire this later if you want)
    // pushed_authorization_request_endpoint: `${AS_ISSUER}/par`,

    // For our simple IAR flow we just support the classic OAuth code flow
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],

    // We want wallets to use PKCE S256
    code_challenge_methods_supported: ["S256"],

    interactive_authorization_endpoint: `${AS_ISSUER}/interactive-authorization`,
    // Nice to have: helps debuggers & wallet UIs
    scopes_supported: ["degree.read", "openid"],
    token_endpoint_auth_methods_supported: ["none"],

    // For OpenID4VCI, authorization_details will be used
    authorization_details_types_supported: ["openid_credential"]
  });
}
