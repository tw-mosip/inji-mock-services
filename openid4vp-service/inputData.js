const {nonce, state, responseUri, baseUrl, didDocumentUrl, requestUri, clientId, presentationDefinitionUri} = require("./constants");
const clientMetadata = require('./clientMetadataMock.json');

const client_metadata = JSON.stringify(clientMetadata);

const preRegisteredAuthorizationRequestDraft23 = {
    "client_id": "pre-registered:mock-client",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const preRegisteredAuthorizationRequestDraft21 = {
    "client_id": "mock-client",
    "client_id_scheme": "pre-registered",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const redirectAuthorizationRequestDraft23 = {
    "client_id": `redirect_uri:${responseUri}`,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post.jwt",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const redirectAuthorizationRequestDrat21 = {
    "client_id": responseUri,
    "client_id_scheme": "redirect_uri",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post.jwt",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const didAuthorizationRequestDraft23 = {
    "client_id": didDocumentUrl,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const didAuthorizationRequestDraft21 = {
    "client_id": didDocumentUrl,
    "client_id_scheme": "did",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const authorizationRequestParamsDraft23 = {
    "client_id":didDocumentUrl,
    "request_uri": requestUri,
    "request_uri_method": "post"
}

const authorizationRequestParamsDraft21 = {
    "client_id":didDocumentUrl,
    "client_id_scheme": "did",
    "request_uri": requestUri,
    "request_uri_method": "post"
}


module.exports = {
    preRegisteredAuthorizationRequest: preRegisteredAuthorizationRequestDraft23,
    didAuthorizationRequest: didAuthorizationRequestDraft23,
    redirectAuthorizationRequest: redirectAuthorizationRequestDraft23,
    authorizationRequestParams: authorizationRequestParamsDraft23,
    preRegisteredAuthorizationRequestDraft21: preRegisteredAuthorizationRequestDraft21,
    didAuthorizationRequestDraft21: didAuthorizationRequestDraft21,
    redirectAuthorizationRequestDraft21: redirectAuthorizationRequestDrat21,
    authorizationRequestParamsDraft21: authorizationRequestParamsDraft21
}


