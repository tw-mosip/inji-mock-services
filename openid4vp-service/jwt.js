const ed = require('@noble/ed25519');
const forge = require('node-forge');
const presentationDefinition = require('./presentationDefinitionMock.json');

const {ed25519PrivateKey, publicKeyId} = require("./constants");

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


async function createJWT(payload) {

    const header64 = encodeB64(JSON.stringify(jwtHeader));
    const payLoad64 = encodeB64(JSON.stringify(payload));
    const preHash = header64 + '.' + payLoad64;
    const privateKey = Uint8Array.from(Buffer.from(ed25519PrivateKey, 'base64'));
    const signature64 = await createSignatureED(privateKey, preHash)
    return header64 + '.' + payLoad64 + '.' + signature64;

}

module.exports = {
    createJWT
};
