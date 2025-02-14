const crypto = require('crypto');

const ed25519PublicKey = "IKXhA7W1HD1sAl+OfG59VKAqciWrrOL1Rw5F+PGLhi4="
const ed25519PrivateKey = "vlo/0lVUn4oCEFo/PiPi3FyqSBSdZ2JDSBJJcvbf6o0="
//update this baseurl with the ngrok url
const baseUrl = "https://5b55-27-57-80-57.ngrok-free.app"
const requestUri = `${baseUrl}/verifier/get-auth-request-obj`
const responseUri = `${baseUrl}/verifier/vp-response`
const didDocumentUrl = "did:web:mosip.github.io:inji-mock-services:openid4vp-service:docs"
const publicKeyId = "did:web:mosip.github.io:inji-mock-services:openid4vp-service:docs#key-0"
const nonce = crypto.randomBytes(16).toString('base64');
const state = crypto.randomBytes(16).toString('base64');

module.exports = {
    baseUrl,
    nonce,
    state,
    ed25519PublicKey,
    ed25519PrivateKey,
    requestUri,
    responseUri,
    didDocumentUrl,
    publicKeyId
};
