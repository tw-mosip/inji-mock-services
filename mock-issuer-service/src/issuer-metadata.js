export const ISSUER = "https://e4845fb4e9e7.ngrok-free.app";

export default function issuerMetadata(req, res) {
  res.json({
    credential_issuer: ISSUER,

    authorization_servers: [
      `${ISSUER}/as`
    ],

    credential_endpoint: `${ISSUER}/credential`,

    credential_configurations_supported: {
      "UniversityDegreeCredential": {
        format: "ldp_vc",
        scope: "degree.read",
        cryptographic_binding_methods_supported: ["jwk"],
        proof_types_supported: {
          jwt: {
            proof_signing_alg_values_supported: ["RS256"]
          }
        },
        credential_definition: {
            type: ["VerifiableCredential", "UniversityDegreeCredential"],
            context: [
              "https://www.w3.org/2018/credentials/v1",
              
            ]
        }
      }
    },

    grants: {
      authorization_code: {
        issuer_state: true
      },
    },
  });
}
