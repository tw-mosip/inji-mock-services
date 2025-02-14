const ed = require('@noble/ed25519');
const forge = require('node-forge');
const presentationDefinition = require('./presentationDefinitionMock.json');

const clientMetadata = require('./clientMetadataMock.json');
const {baseUrl, state, nonce, ed25519PrivateKey, responseUri, didDocumentUrl, publicKeyId} = require("./constants");

const client_metadata = clientMetadata

const jwtPayload = {
    "presentation_definition_uri": `${baseUrl}/verifier/presentation_definition_uri`,
    "client_metadata": JSON.stringify(client_metadata),
    "state": state,
    "nonce": nonce,
    "client_id": `${didDocumentUrl}`,
    "response_mode": "direct_post",
    "response_type": "vp_token",
    "response_uri": responseUri
}

const jwtHeader =   {
    "typ": "oauth-authz-req+jwt",
    "alg": "EdDSA",
    "kid": publicKeyId
}

function replaceCharactersInB64(encodedB64) {
    return encodedB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function encodeB64(str) {
    const encodedB64 = forge.util.encode64(str);
    return replaceCharactersInB64(encodedB64);
}

async function createSignatureED(privateKey, prehash) {
    const messageBytes = new TextEncoder().encode(prehash);
    const privateKeyUint8 = Uint8Array.from(privateKey);
    const sign = await ed.sign(messageBytes, privateKeyUint8);
    return replaceCharactersInB64(Buffer.from(sign).toString('base64'));
}


async function createJWT() {

    const header64 = encodeB64(JSON.stringify(jwtHeader));
    const payLoad64 = encodeB64(JSON.stringify(jwtPayload));
    const preHash = header64 + '.' + payLoad64;
    const privateKey = Uint8Array.from(Buffer.from(ed25519PrivateKey, 'base64'));
    const signature64 = await createSignatureED(privateKey, preHash)
    return header64 + '.' + payLoad64 + '.' + signature64;

}

module.exports = {
    createJWT,
    client_metadata,
    jwtPayload
};
