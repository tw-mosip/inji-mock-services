const {
    nonce, state, responseUri, baseUrl, presentationDefinitionUri,
    CLIENT_ID_SCHEMES, REQUEST_MODES, DRAFT_VERSIONS, REQUEST_SIGNING_SUPPORT_MODES, ResponseModes
} = require("../constants");
const clientMetadata = require('../clientMetadataMock.json');
const {getVerifierMetadata} = require("../VerifierMetadata");
const {dcqlQuery} = require("../presentation-request/DCQLQuery");

const client_metadata = JSON.stringify(clientMetadata);

const preRegisteredAuthorizationRequestVersion1 = {
    "client_id": "mock-client",
    "dcql_query": dcqlQuery,
    "response_type": "vp_token",
    "response_mode": "direct_post.jwt",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": JSON.stringify(getVerifierMetadata(ResponseModes.DIRECT_POST_JWT, DRAFT_VERSIONS.V_1_0)),
}

const preRegisteredAuthorizationRequestDraft23 = {
    "client_id": "mock-client",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post.jwt",
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

const preRegisteredAuthorizationRequestParamsDraft23 = {
    "client_id": preRegisteredAuthorizationRequestDraft23.client_id,
    "request_uri_method": "post"
}

const preRegisteredAuthorizationRequestParamsDraft21 = {
    "client_id": preRegisteredAuthorizationRequestDraft21.client_id,
    "client_id_scheme": "pre-registered",
    "request_uri_method": "post"
}

const map = {
    [REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED] : true,
    [REQUEST_SIGNING_SUPPORT_MODES.UNSIGNED_REQUEST_SUPPORTED] : true,
    [REQUEST_MODES.BY_REFERENCE]: {
        [DRAFT_VERSIONS.V_1_0]: preRegisteredAuthorizationRequestParamsDraft23,
        [DRAFT_VERSIONS.DRAFT_23]: preRegisteredAuthorizationRequestParamsDraft23,
        [DRAFT_VERSIONS.DRAFT_21]: preRegisteredAuthorizationRequestParamsDraft21,
    },
    [REQUEST_MODES.BY_VALUE]: {
        [DRAFT_VERSIONS.V_1_0]: preRegisteredAuthorizationRequestVersion1,
        [DRAFT_VERSIONS.DRAFT_23]: preRegisteredAuthorizationRequestDraft23,
        [DRAFT_VERSIONS.DRAFT_21]: preRegisteredAuthorizationRequestDraft21,
    }
};

module.exports = {
    preRegisteredAuthorizationRequestDraft23,
    preRegisteredAuthorizationRequestDraft21,
    map
};

