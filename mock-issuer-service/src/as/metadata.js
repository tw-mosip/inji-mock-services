import { authServerBaseUrl, hasExplicitVersion, resolveRequestVersion } from "../issuer-profile.js";

export default function authServerMetadata(req, res) {
  const version = resolveRequestVersion(req);
  const flow = req.params?.flow === "pdi" ? "pdi" : null;
  const asIssuer = authServerBaseUrl(version, hasExplicitVersion(req), flow);

  const response = {
    // The "issuer" of this Authorization Server
    issuer: asIssuer,

    // Where the wallet will send the user for interactive authorization
    authorization_endpoint: `${asIssuer}/authorize`,

    // Where the wallet will later exchange the code for tokens
    token_endpoint: `${asIssuer}/token`,

    // Optional PAR (you can wire this later if you want)
    // pushed_authorization_request_endpoint: `${AS_ISSUER}/par`,

    // For our simple IAR flow we just support the classic OAuth code flow
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code"],

    // We want wallets to use PKCE S256
    code_challenge_methods_supported: ["S256"],

    // Nice to have: helps debuggers & wallet UIs
    scopes_supported: ["degree.read", "jwt_vc_json.read", "openid"],
    token_endpoint_auth_methods_supported: ["none"],

    // For OpenID4VCI, authorization_details will be used
    authorization_details_types_supported: ["openid_credential"]
  };

  if (flow === "pdi") {
    response.interactive_authorization_endpoint = `${asIssuer}/interactive-authorization`;
  }

  res.json(response);
}
