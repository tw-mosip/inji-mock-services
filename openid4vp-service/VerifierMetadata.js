const clientMetadata = require('./clientMetadataMock.json');
const {DRAFT_VERSIONS, ResponseModes} = require("./constants");
const { defaultVerifierKeys } = require('./encryptionKeyManagement');

// Convert base64 to base64url format (just character replacement, no re-encoding)
function base64ToBase64Url(base64) {
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const publicKeyB64Url = base64ToBase64Url(defaultVerifierKeys.publicKeyBase64);
const privateKeyB64Url = base64ToBase64Url(defaultVerifierKeys.privateKeyBase64);

const staticJWK = {
  "kty": "OKP",
  "crv": "X25519",
  "use": "enc",
  "x": publicKeyB64Url,     // Public key
  "alg": "ECDH-ES",
  "kid": "verifier-static-key"
};

const VerifierMetadata = {
  "draft-23": {
    "client_name": "Inji Mock Verifier",
    "logo_uri": "https://mosip.github.io/inji-config/logos/StayProtectedInsurance.png",
    "authorization_encrypted_response_alg": "ECDH-ES",
    "authorization_encrypted_response_enc": "A256GCM",
    "jwks": {
      "keys": [
        staticJWK
      ]
    },
    "vp_formats": {
      "mso_mdoc": {
        "alg": [
          "ES256"
        ]
      },
      "ldp_vp": {
        "proof_type": [
          "Ed25519Signature2018",
          "Ed25519Signature2020",
          "RsaSignature2018"
        ]
      }
    }
  },
  "version-1.0": {
    "client_name": "Inji Mock Verifier",
    "logo_uri": "https://mosip.github.io/inji-config/logos/StayProtectedInsurance.png",
    "authorization_encrypted_response_alg": "ECDH-ES",
    "encrypted_response_enc_values_supported": ["A128GCM", "A128CBC-HS256", "A256GCM"],
    "jwks": {
      "keys": [staticJWK]
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
      delete metadata["authorization_encrypted_response_enc"];
      delete metadata["authorization_encrypted_response_alg"];
    }
  }

  return metadata;
}

/**
 * Update VerifierMetadata with new encryption key information
 * @param {Object} encryptionKeyMetadata - Encryption key metadata from encryptionKeyManagement module
 */
function updateWithEncryptionKey(encryptionKeyMetadata) {
  if (VerifierMetadata['version-1.0'] && encryptionKeyMetadata.jwk) {
    VerifierMetadata['version-1.0'].jwks = {
      keys: [encryptionKeyMetadata.jwk]
    };
    VerifierMetadata['version-1.0'].encrypted_response_enc_values_supported =
      encryptionKeyMetadata.encryptionMethods;

    console.log(`✓ VerifierMetadata updated with encryption key: ${encryptionKeyMetadata.keyId}`);
    return true;
  }
  return false;
}

/**
 * Get the active encryption key from VerifierMetadata
 * @param {string} version - Metadata version ('version-1.0' or 'draft-23')
 * @returns {Object|null} JWK object or null if not found
 */
function getActiveEncryptionKeyFromMetadata(version = 'version-1.0') {
  const metadata = VerifierMetadata[version];
  if (metadata && metadata.jwks && metadata.jwks.keys && metadata.jwks.keys.length > 0) {
    return metadata.jwks.keys[0];
  }
  return null;
}

/**
 * Get all encryption key IDs from VerifierMetadata
 * @param {string} version - Metadata version ('version-1.0' or 'draft-23')
 * @returns {Array} Array of key IDs
 */
function getEncryptionKeyIds(version = 'version-1.0') {
  const metadata = VerifierMetadata[version];
  if (metadata && metadata.jwks && metadata.jwks.keys) {
    return metadata.jwks.keys.map(key => key.kid);
  }
  return [];
}

module.exports = {
  VerifierMetadata,
  getVerifierMetadata,
  updateWithEncryptionKey,
};
