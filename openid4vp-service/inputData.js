const {nonce, state, responseUri, baseUrl, didDocumentUrl, requestUri, clientId, presentationDefinitionUri} = require("./constants");
const clientMetadata = require('./clientMetadataMock.json');

const client_metadata = JSON.stringify(clientMetadata);

const preRegisteredAuthorizationRequest = {
    "client_id": "https://injiverify.dev1.mosip.net",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
    "client_id_scheme": "pre-registered"
}

const redirectAuthorizationRequest = {
    "client_id": responseUri,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
    "client_id_scheme": "pre-registered"
}

const didAuthorizationRequest = {
    "client_id": didDocumentUrl,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
    "client_id_scheme": "did"
}

const authorizationRequestParams = {
    "client_id":didDocumentUrl,
    "client_id_scheme": "did",
    "request_uri": requestUri,
    "request_uri_method": "get"
}


module.exports = {
    preRegisteredAuthorizationRequest,
    didAuthorizationRequest,
    redirectAuthorizationRequest,
    authorizationRequestParams
}


