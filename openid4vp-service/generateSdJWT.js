const crypto = require('crypto');

// Helper function to base64url encode
function base64url(buffer) {
    return Buffer.from(buffer)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

// Helper function to create disclosure
function createDisclosure(salt, key, value) {
    const disclosure = JSON.stringify([salt, key, value]);
    return base64url(disclosure);
}

// Helper function to hash disclosure
function hashDisclosure(disclosure) {
    const hash = crypto.createHash('sha256').update(disclosure).digest();
    return base64url(hash);
}

// Generate secp256k1 key pair for holder binding
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'prime256v1',
    publicKeyEncoding: {
        type: 'spki',
        format: 'der'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der'
    }
});

// Extract public key coordinates for JWK
const pubKeyObj = crypto.createPublicKey({
    key: publicKey,
    format: 'der',
    type: 'spki'
});

const jwk = pubKeyObj.export({ format: 'jwk' });

// Create JWK with EcdsaSecp256k1VerificationKey2019 type
const cnfJwk = {
    kty: jwk.kty,
    crv: jwk.crv,
    x: jwk.x,
    y: jwk.y,
    kid: 'holder-key-1'
};

console.log('=== Holder Public Key (JWK) ===');
console.log(JSON.stringify(cnfJwk, null, 2));
console.log();

// Generate issuer key pair (for signing the SD-JWT)
const issuerKeyPair = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256k1'
});

// Create disclosures for selective disclosure claims
const salt1 = base64url(crypto.randomBytes(16));
const salt2 = base64url(crypto.randomBytes(16));
const salt3 = base64url(crypto.randomBytes(16));

const disclosure1 = createDisclosure(salt1, 'given_name', 'John');
const disclosure2 = createDisclosure(salt2, 'family_name', 'Doe');
const disclosure3 = createDisclosure(salt3, 'email', 'john.doe@example.com');

console.log('=== Disclosures ===');
console.log('Disclosure 1 (given_name):', disclosure1);
console.log('Disclosure 2 (family_name):', disclosure2);
console.log('Disclosure 3 (email):', disclosure3);
console.log();

// Create SD-JWT payload
const sdJwtPayload = {
    iss: 'https://issuer.example.com',
    vct: "urn:eudi:pid:de:1",
    iat: Math.floor(Date.now() / 1000),
    exp: 254172941000, // Far future expiration
    sub: 'user123',
    _sd: [
        hashDisclosure(disclosure1),
        hashDisclosure(disclosure2),
        hashDisclosure(disclosure3)
    ],
    cnf: {
        // jku: "https://attacker.com/jwks.json"
        kid: "https://holder.example.com/keys/1",
        // jwk: cnfJwk
    },
    _sd_alg: 'sha-256'
};

// Create SD-JWT header
const sdJwtHeader = {
    alg: 'ES256K',
    typ: 'vc+sd-jwt'
};

// Sign SD-JWT
const sdJwtHeaderB64 = base64url(JSON.stringify(sdJwtHeader));
const sdJwtPayloadB64 = base64url(JSON.stringify(sdJwtPayload));
const sdJwtSigningInput = `${sdJwtHeaderB64}.${sdJwtPayloadB64}`;

const sdJwtSignature = crypto.sign(
    null,
    Buffer.from(sdJwtSigningInput),
    issuerKeyPair.privateKey
);
const sdJwtSignatureB64 = base64url(sdJwtSignature);

const sdJwt = `${sdJwtSigningInput}.${sdJwtSignatureB64}`;
const onlySdJwt = `${sdJwt}~${disclosure1}~${disclosure2}~${disclosure3}~`

console.log('=== SD-JWT (Issuer-Signed) ===');
console.log(sdJwt);
console.log();

// Create Key Binding JWT (KB-JWT)
const kbJwtHeader = {
    alg: 'ES256K',
    typ: 'kb+jwt'
};

const kbJwtPayload = {
    iat: Math.floor(Date.now() / 1000),
    aud: 'https://verifier.example.com',
    nonce: 'random-nonce-' + base64url(crypto.randomBytes(16)),
    sd_hash: base64url(crypto.createHash('sha256').update(onlySdJwt).digest())
};

const kbJwtHeaderB64 = base64url(JSON.stringify(kbJwtHeader));
const kbJwtPayloadB64 = base64url(JSON.stringify(kbJwtPayload));
const kbJwtSigningInput = `${kbJwtHeaderB64}.${kbJwtPayloadB64}`;

// Sign KB-JWT with holder's private key
const privKeyObj = crypto.createPrivateKey({
    key: privateKey,
    format: 'der',
    type: 'pkcs8'
});

const kbJwtSignature = crypto.sign(
    null,
    Buffer.from(kbJwtSigningInput),
    privKeyObj
);
const kbJwtSignatureB64 = base64url(kbJwtSignature);

const kbJwt = `${kbJwtSigningInput}.${kbJwtSignatureB64}`;

console.log('=== Key Binding JWT (KB-JWT) ===');
console.log(kbJwt);
console.log();

// Construct complete SD-JWT with disclosures and KB-JWT
const completeSdJwt = `${sdJwt}~${disclosure1}~${disclosure2}~${disclosure3}~${kbJwt}`;

console.log('=== Complete SD-JWT Presentation ===');
console.log(completeSdJwt);
console.log();

// Decode and display for verification
console.log('=== Decoded SD-JWT Payload ===');
console.log(JSON.stringify(sdJwtPayload, null, 2));
console.log();

console.log('=== Decoded KB-JWT Payload ===');
console.log(JSON.stringify(kbJwtPayload, null, 2));
console.log();

console.log('=== Verification Information ===');
console.log('To verify this SD-JWT:');
console.log('1. Parse the SD-JWT format: <issuer-jwt>~<disclosure>~...~<kb-jwt>');
console.log('2. Verify the issuer signature on the SD-JWT');
console.log('3. Verify each disclosure hash matches the _sd array');
console.log('4. Verify the KB-JWT signature using the public key from cnf.jwk');
console.log('5. Verify the sd_hash in KB-JWT matches the hash of the SD-JWT');
console.log('6. Check that the cnf claim contains the holder\'s public key');
console.log();

console.log('=== Decoded Disclosures ===');
console.log('1.', Buffer.from(disclosure1, 'base64').toString());
console.log('2.', Buffer.from(disclosure2, 'base64').toString());
console.log('3.', Buffer.from(disclosure3, 'base64').toString());