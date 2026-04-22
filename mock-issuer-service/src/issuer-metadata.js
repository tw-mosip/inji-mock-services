import {
  ISSUER,
  authServerBaseUrl,
  hasExplicitVersion,
  issuerBaseUrl,
  resolveRequestVersion,
} from "./issuer-profile.js";

const BASE_CREDENTIAL_CONFIGURATIONS = {
  UniversityDegreeCredential: {
    format: "ldp_vc",
    scope: "degree.read",
    cryptographic_binding_methods_supported: ["jwk"],
    proof_types_supported: {
      jwt: {
        proof_signing_alg_values_supported: ["RS256"],
      },
    },
    credential_definition: {
      type: ["VerifiableCredential", "FarmerCredential"],
      "@context": ["https://www.w3.org/2018/credentials/v1"],
    },
    credential_metadata: {
      "display": [
        {
          "logo": {
            "url": "https://inji.github.io/inji-config/logos/mosipid-logo.png",
            "alt_text": "a square logo of a MOSIP"
          },
          "name": "Mock Issuer Local",
          "locale": "en",
          "text_color": "#FFFFFF",
          "background_color": "#12107c",
          "background_image": {
            "uri": "https://inji.github.io/inji-config/vcbackground/default-background.png"
          }
        }
      ],
      claims: [
        {
          path: ["credentialSubject", "fullName"],
          display: [
            { name: "Full Name", locale: "en" },
            { name: "पूरा नाम", locale: "hi" },
          ],
        },
        {
          path: ["credentialSubject", "mobileNumber"],
          display: [{ name: "Mobile Number", locale: "en" }],
        },
        {
          path: ["credentialSubject", "dateOfBirth"],
          display: [{ name: "Date of Birth", locale: "en" }],
        },
        {
          path: ["credentialSubject", "landArea"],
          display: [{ name: "Land Area (acres)", locale: "en" }],
        },
        {
          path: ["credentialSubject", "landOwnershipType"],
          display: [{ name: "Land Ownership", locale: "en" }],
        },
        {
          path: ["credentialSubject", "address", "village"],
          display: [{ name: "Village", locale: "en" }],
        },
        {
          path: ["credentialSubject", "farmProfile", "landRecord", "surveyNumber"],
          display: [{ name: "Survey Number", locale: "en" }],
        },
        {
          path: ["credentialSubject", "farmProfile", "landRecord", "registry", "office"],
          display: [{ name: "Registry Office", locale: "en" }],
        },
        {
          path: ["credentialSubject", "farmProfile", "irrigation", "source", "type"],
          display: [{ name: "Irrigation Source Type", locale: "en" }],
        },
        {
          path: ["credentialSubject", "cooperative", "membership", "membershipNumber"],
          display: [{ name: "Cooperative Membership Number", locale: "en" }],
        },
        {
          path: ["credentialSubject", "crops", null],
          display: [{ name: "Crops", locale: "en" }],
        },
        {
          path: ["credentialSubject", "plots", 0, "soilType"],
          display: [{ name: "Primary Plot Soil", locale: "en" }],
        },
      ],
    },
  }
};

function toDraft13Configuration(configuration) {
  const { credential_metadata, ...rest } = configuration;

  return {
    ...rest,
    display: credential_metadata?.display || [],
    claims: credential_metadata?.claims || [],
  };
}

function buildCredentialConfigurations(version) {
  const isV1 = version === "v1";

  return Object.fromEntries(
    Object.entries(BASE_CREDENTIAL_CONFIGURATIONS).map(([id, configuration]) => [
      id,
      isV1 ? configuration : toDraft13Configuration(configuration),
    ]),
  );
}

export { ISSUER };

export default function issuerMetadata(req, res) {
  const version = resolveRequestVersion(req);
  const explicitVersion = hasExplicitVersion(req);
  const flow = req.params?.flow === "pdi" ? "pdi" : null;
  const credentialIssuer = issuerBaseUrl(version, explicitVersion, flow);
  const authorizationServer = authServerBaseUrl(version, explicitVersion, flow);
  const isV1 = version === "v1";

  const response = {
    credential_issuer: credentialIssuer,
    authorization_servers: [authorizationServer],
    credential_endpoint: `${credentialIssuer}/credential`,
    credential_configurations_supported: buildCredentialConfigurations(version),
    grants: {
      authorization_code: {
        issuer_state: true,
      },
      "urn:ietf:params:oauth:grant-type:pre-authorized_code": {},
    },
  };

  if (isV1) {
    response.nonce_endpoint = `${credentialIssuer}/nonce`;
  }

  res.json(response);
}
