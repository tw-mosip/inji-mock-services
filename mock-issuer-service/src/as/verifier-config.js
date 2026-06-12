export const verifierConfig = {
  specVersion: "draft-23", // draft-23 or version-1.0
  responseMode: "iar-post", // keep as iar-post or iar-post.jwt (encrypted response)
  clientIdScheme: "did", 
  requestMode: "by_reference", // by_value or by_reference
  verifierBaseUrl: "http://localhost:3000", // Verifier backend service URL
  signedRequest: true, // Set to true if you want the request to be signed by the verifier or keep as false
  presentationDefinition: { // Presentation defintion will be used for draft 23
    "id": "c4822b58-7fb4-454e-b827-f8758fe27f9a",
    "purpose": "Relying party is requesting your digital ID for the purpose of Self-Authentication",
    "input_descriptors": [
      {
        "id": "Mock Identity card credential",
        "format": {
          "vc+sd-jwt": {
            "sd-jwt_alg_values": [
              "ES256"
            ]
          }
        },
        "constraints": {
          "fields": [
            {
              "path": [
                "$.vct"
              ]
            }
          ]
        }
      }
    ]
  },
  dcqlQuery: { // dcql query will be used for v1.0
    credentials: [
      {
        id: "id-card-query",
        format: "ldp_vc",
        meta:{},
        claims: [
          {
            path: ["credentialSubject", "email"],
          },
        ],
      },
    ],
  },
};
