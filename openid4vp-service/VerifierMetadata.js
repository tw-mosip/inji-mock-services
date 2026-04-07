const clientMetadata = require('./clientMetadataMock.json');
const {DRAFT_VERSIONS, ResponseModes} = require("./constants");

const VerifierMetadata = {
  "draft-23": JSON.stringify(clientMetadata),
  "version-1.0": {
    "client_name": "Requester name",
    "logo_uri": "https://mosip.github.io/inji-config/logos/StayProtectedInsurance.png",
    "authorization_encrypted_response_alg": "ECDH-ES",
    "encrypted_response_enc_values_supported": ["A128GCM", "A128CBC-HS256", "A256GCM"],
    "jwks": {
      "keys": [
        {
          "kty": "OKP",
          "crv": "X25519",
          "use": "enc",
          "x": "BVNVdqorpxCCnTOkkw8S2NAYXvfEvkC-8RDObhrAUA4",
          "alg": "ECDH-ES",
          "kid": "verifier-key-id"
        }
      ]
    },
    "vp_formats_supported": {
      "mso_mdoc": {
        "issuerauth_alg_values": [-7, -9, -50, -65537],
        "deviceauth_alg_values": [-7, -9, -50, -65537]
      },
      "ldp_vc": {
        "proof_type_values": [
          "Ed25519Signature2018",
          "Ed25519Signature2020",
          "RsaSignature2018",
          "DataIntegrityProof"
        ],
        "cryptosuite_values": [
          "ecdsa-rdfc-2019",
          "ecdsa-sd-2023",
          "ecdsa-jcs-2019",
          "bbs-2023"
        ]
      },
      "dc+sd-jwt": {
        "sd-jwt_alg_values": ["ES256", "ES384"],
        "kb-jwt_alg_values": ["ES256", "ES384"]
      }
    }
  }
}


function getVerifierMetadata(responseMode, version) {
  let metadata = JSON.parse(JSON.stringify(VerifierMetadata[version] || {}));

  if (responseMode === ResponseModes.DIRECT_POST) {
    if (version === DRAFT_VERSIONS.V_1_0) {
      delete metadata["encrypted_response_enc_values_supported"];
    }
    if (version === DRAFT_VERSIONS.DRAFT_23) {
      delete metadata["encrypted_response_enc"];
    }
  }

  return metadata;
}

module.exports = { VerifierMetadata, getVerifierMetadata };
