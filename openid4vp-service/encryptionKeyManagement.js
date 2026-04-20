const crypto = require('crypto');
const { x25519 } = require('@noble/curves/ed25519');

// jose will be loaded dynamically since it's ESM-only
let jose = null;
async function getJose() {
    if (!jose) {
        jose = await import('jose');
    }
    return jose;
}

// Default verifier key pair for X25519 ECDH-ES
const defaultVerifierKeys = {
    publicKeyBase64: "Z5a2OjR7a6rOqBdApvDaqR7mBV+OD3VT2UgCdKQScwI=",
    privateKeyBase64: "Mjxgl/YAh11IxsTZ6b6TD63BGc1FPWe+yAhD96S0IC0="
};

/**
 * Convert base64 to base64url format
 * @param {string} base64 - Standard base64 string
 * @returns {string} Base64url encoded string
 */
function base64ToBase64Url(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Convert base64url to base64 format
 * @param {string} base64url - Base64url encoded string
 * @returns {string} Standard base64 string
 */
function base64UrlToBase64(base64url) {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    if (padding) {
        base64 += '='.repeat(4 - padding);
    }
    return base64;
}

/**
 * Initialize encryption keys for the verifier
 * @param {Object} verifierMetadata - The verifier metadata object to update
 * @returns {Object} Object containing the encryption key info
 */
async function initializeEncryptionKeys(verifierMetadata) {
    const publicKeyB64Url = base64ToBase64Url(defaultVerifierKeys.publicKeyBase64);
    const privateKeyB64Url = base64ToBase64Url(defaultVerifierKeys.privateKeyBase64);

    const encryptionKey = {
        jwk: {
            kty: "OKP",
            crv: "X25519",
            use: "enc",
            x: publicKeyB64Url,
            d: privateKeyB64Url,
            alg: "ECDH-ES",
            kid: "verifier-static-key"
        },
        keyId: "verifier-static-key",
        algorithm: "ECDH-ES",
        encryptionMethods: ["A128GCM", "A128CBC-HS256", "A256GCM"],
        publicKeyBase64: defaultVerifierKeys.publicKeyBase64,
        privateKeyBase64: defaultVerifierKeys.privateKeyBase64
    };

    return { encryptionKey };
}

/**
 * Export key information for logging (without exposing private key)
 * @param {Object} encryptionKey - The encryption key object
 * @returns {string} Human readable key info
 */
function exportKeyInfo(encryptionKey) {
    return `
=== Encryption Key Info ===
Key ID: ${encryptionKey.keyId}
Algorithm: ${encryptionKey.algorithm}
Curve: X25519
Encryption Methods: ${encryptionKey.encryptionMethods.join(', ')}
===========================`;
}

/**
 * Decrypt a JWE token using ECDH-ES with X25519 via jose library
 * @param {string} jweToken - The JWE token string (compact serialization)
 * @param {Object} encryptionKey - The encryption key object with private key
 * @returns {Object} Decrypted payload
 */
async function decryptJwe(jweToken, encryptionKey) {
    if (!jweToken || typeof jweToken !== 'string') {
        throw new Error('Invalid JWE token: must be a non-empty string');
    }

    if (!encryptionKey || !encryptionKey.privateKeyBase64) {
        throw new Error('Invalid encryption key: private key required');
    }

    // Create a JWK object for the jose library
    const privateJwk = {
        kty: 'OKP',
        crv: 'X25519',
        x: base64ToBase64Url(encryptionKey.publicKeyBase64),
        d: base64ToBase64Url(encryptionKey.privateKeyBase64)
    };

    try {
        // Load jose dynamically (ESM module)
        const jose = await getJose();

        // Import the private key for decryption
        const privateKey = await jose.importJWK(privateJwk, 'ECDH-ES');

        // Decrypt the JWE token
        const { plaintext, protectedHeader } = await jose.compactDecrypt(jweToken, privateKey);

        console.log('JWE Header:', JSON.stringify(protectedHeader, null, 2));

        // Convert plaintext to string
        const payloadString = new TextDecoder().decode(plaintext);

        // Try to parse as JSON
        try {
            return JSON.parse(payloadString);
        } catch {
            // Return as string if not valid JSON
            return payloadString;
        }
    } catch (error) {
        console.error('Jose decryption error:', error);
        throw new Error(`Failed to decrypt JWE: ${error.message}`);
    }
}

/**
 * Concat KDF as per RFC 7518 (JOSE)
 * @param {Uint8Array} sharedSecret - ECDH shared secret
 * @param {number} keyLengthBits - Desired key length in bits
 * @param {string} algorithm - Algorithm identifier (e.g., "A256GCM")
 * @param {string} apu - Agreement PartyU Info (base64url encoded, optional)
 * @param {string} apv - Agreement PartyV Info (base64url encoded, optional)
 * @returns {Buffer} Derived key
 */
function concatKdf(sharedSecret, keyLengthBits, algorithm, apu, apv) {
    const keyLengthBytes = keyLengthBits / 8;

    // AlgorithmID = algorithm name in UTF-8
    const algId = Buffer.from(algorithm, 'utf8');
    const algIdLength = Buffer.alloc(4);
    algIdLength.writeUInt32BE(algId.length, 0);

    // PartyUInfo - apu is base64url encoded in the header
    // Some implementations may include padding (=), so handle both cases
    let apuData = Buffer.alloc(0);
    if (apu) {
        // Normalize: remove padding and convert to proper base64url if needed
        const normalizedApu = apu.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        apuData = Buffer.from(normalizedApu, 'base64url');
    }
    const apuLength = Buffer.alloc(4);
    apuLength.writeUInt32BE(apuData.length, 0);

    // PartyVInfo - apv is base64url encoded in the header
    // Some implementations may include padding (=), so handle both cases
    let apvData = Buffer.alloc(0);
    if (apv) {
        // Normalize: remove padding and convert to proper base64url if needed
        const normalizedApv = apv.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        apvData = Buffer.from(normalizedApv, 'base64url');
    }
    const apvLength = Buffer.alloc(4);
    apvLength.writeUInt32BE(apvData.length, 0);

    // SuppPubInfo = keydatalen in bits as 4 bytes big endian
    const suppPubInfo = Buffer.alloc(4);
    suppPubInfo.writeUInt32BE(keyLengthBits, 0);

    // SuppPrivInfo = empty
    const suppPrivInfo = Buffer.alloc(0);

    // OtherInfo = AlgorithmID || PartyUInfo || PartyVInfo || SuppPubInfo || SuppPrivInfo
    const otherInfo = Buffer.concat([
        algIdLength, algId,
        apuLength, apuData,
        apvLength, apvData,
        suppPubInfo,
        suppPrivInfo
    ]);

    // Single-pass KDF for keys <= 256 bits
    // round1 = Hash(counter || Z || OtherInfo)
    const counter = Buffer.alloc(4);
    counter.writeUInt32BE(1, 0);

    const hash = crypto.createHash('sha256');
    hash.update(counter);
    hash.update(Buffer.from(sharedSecret));
    hash.update(otherInfo);

    const derivedKey = hash.digest();

    return derivedKey.slice(0, keyLengthBytes);
}

module.exports = {
    initializeEncryptionKeys,
    exportKeyInfo,
    decryptJwe,
    base64ToBase64Url,
    base64UrlToBase64
};

