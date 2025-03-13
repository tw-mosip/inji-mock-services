const {nonce, state, responseUri, baseUrl, didDocumentUrl, requestUri, clientId, presentationDefinitionUri} = require("./constants");
const clientMetadata = require('./clientMetadataMock.json');

const client_metadata = JSON.stringify(clientMetadata);

const preRegisteredAuthorizationRequest = {
    "client_id": "mock-client",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const redirectAuthorizationRequest = {
    "client_id": `redirect_uri:${responseUri}`,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post.jwt",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const didAuthorizationRequest = {
    "client_id": didDocumentUrl,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post.jwt",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const authorizationRequestParams = {
    "client_id":didDocumentUrl,
    "request_uri": requestUri,
    "request_uri_method": "get"
}


module.exports = {
    preRegisteredAuthorizationRequest,
    didAuthorizationRequest,
    redirectAuthorizationRequest,
    authorizationRequestParams
}


