const FLOW_OPTIONS = new Set(["normal", "pdi", "pre-auth", "pre-auth-tx"]);
const VERSION_OPTIONS = new Set(["v1", "draft13"]);
const CREDENTIAL_OPTIONS = new Set(["farmer", "employee", "sd-jwt", "mdoc"]);

export const DEFAULT_ISSUANCE_OPTIONS = Object.freeze({
  flow: "normal",
  version: "v1",
  credential: "farmer",
});

const CREDENTIAL_MAP = {
  farmer: {
    configurationId: "UniversityDegreeCredential",
    format: "ldp_vc",
    label: "Farmer Credential",
    scope: "degree.read",
    description: "LDP VC payload backed by the mock farmer dataset.",
  },
  employee: {
    configurationId: "JwtVerifiableCredential",
    format: "jwt_vc_json",
    label: "Employee Credential",
    scope: "jwt_vc_json.read",
    description: "JWT VC payload backed by the mock employee dataset.",
  },
  "sd-jwt": {
    configurationId: "SdJwtVerifiableCredential",
    format: "vc+sd-jwt",
    label: "SD-JWT Employee",
    scope: "sd_jwt_vc.read",
    description: "Selective Disclosure JWT VC for Employee.",
  },
  mdoc: {
    configurationId: "MdocVerifiableCredential",
    format: "mso_mdoc",
    label: "Mobile Driving License",
    scope: "mdoc.read",
    description: "ISO 18013-5 Mobile Driving License (mDL) as mdoc.",
  },
};

export function resolveIssuanceOptions(query = {}) {
  const flow = FLOW_OPTIONS.has(query.flow) ? query.flow : DEFAULT_ISSUANCE_OPTIONS.flow;
  const version = VERSION_OPTIONS.has(query.version)
    ? query.version
    : DEFAULT_ISSUANCE_OPTIONS.version;
  const credential = CREDENTIAL_OPTIONS.has(query.credential)
    ? query.credential
    : DEFAULT_ISSUANCE_OPTIONS.credential;

  return {
    flow,
    version,
    credential,
    credentialDetails: CREDENTIAL_MAP[credential],
  };
}

export function buildOfferUrl(issuer, options) {
  const params = new URLSearchParams({
    flow: options.flow,
    version: options.version,
    credential: options.credential,
  });

  return `${issuer}/credential-offer?${params.toString()}`;
}
