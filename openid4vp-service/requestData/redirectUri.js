const {
    nonce, state, responseUri, baseUrl, presentationDefinitionUri,REQUEST_MODES, DRAFT_VERSIONS, REQUEST_SIGNING_SUPPORT_MODES, ResponseModes
} = require("../constants");
const clientMetadata = require('../clientMetadataMock.json');
const {getVerifierMetadata} = require("../VerifierMetadata");
const {dcqlQuery} = require("../presentation-request/DCQLQuery");

const client_metadata = JSON.stringify(clientMetadata);

const redirectAuthorizationRequestVersion1 = {
    "client_id": `redirect_uri:${responseUri}`,
    "dcql_query": dcqlQuery,
    "response_type": "vp_token",
    "response_mode": ResponseModes.DIRECT_POST,
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": JSON.stringify(getVerifierMetadata(ResponseModes.DIRECT_POST, DRAFT_VERSIONS.V_1_0)),
}

const redirectAuthorizationRequestDraft23 = {
    "client_id": `redirect_uri:${responseUri}`,
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": ResponseModes.DIRECT_POST_JWT,
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const redirectAuthorizationRequestDraft21 = {
    "client_id": responseUri,
    "client_id_scheme": "redirect_uri",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": ResponseModes.DIRECT_POST,
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri,
    "client_metadata": client_metadata,
}

const redirectUriAuthorizationRequestParamsDraft23 = {
    "client_id": redirectAuthorizationRequestDraft23.client_id,
    "request_uri_method": "post"
}

const redirectUriAuthorizationRequestParamsDraft21 = {
    "client_id": redirectAuthorizationRequestDraft21.client_id,
    "client_id_scheme": "redirect_uri",
    "request_uri_method": "post"
}

const map = {
    [REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED] : false,
    [REQUEST_SIGNING_SUPPORT_MODES.UNSIGNED_REQUEST_SUPPORTED] : true,
    [REQUEST_MODES.BY_REFERENCE]: {
        [DRAFT_VERSIONS.V_1_0]: redirectUriAuthorizationRequestParamsDraft23,
        [DRAFT_VERSIONS.DRAFT_23]: redirectUriAuthorizationRequestParamsDraft23,
        [DRAFT_VERSIONS.DRAFT_21]: redirectUriAuthorizationRequestParamsDraft21,
    },
    [REQUEST_MODES.BY_VALUE]: {
        [DRAFT_VERSIONS.V_1_0]: redirectAuthorizationRequestVersion1,
        [DRAFT_VERSIONS.DRAFT_23]: redirectAuthorizationRequestDraft23,
        [DRAFT_VERSIONS.DRAFT_21]: redirectAuthorizationRequestDraft21,
    }
};

module.exports = {
    redirectAuthorizationRequestDraft23,
    redirectAuthorizationRequestDraft21,
    map
};
