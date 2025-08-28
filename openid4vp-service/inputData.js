const {nonce, state, responseUri, baseUrl, didDocumentUrl, requestUri, clientId, presentationDefinitionUri} = require("./constants");
const clientMetadata = require('./clientMetadataMock.json');

const client_metadata = JSON.stringify(clientMetadata);

// For Pre-registered client, client metadata is known to the Wallet in advance of the authorization request
const preRegisteredAuthorizationRequestDraft23 = {
    "client_id": "mock-client",
    "presentation_definition_uri": presentationDefinitionUri,
    "response_type": "vp_token",
    "response_mode": "direct_post",
    "nonce": nonce,
    "state": state,
    "response_uri": responseUri
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

// enum for client_id_schemes
const CLIENT_ID_SCHEMES = {
    PRE_REGISTERED: "pre-registered",
    REDIRECT_URI: "redirect_uri",
    DID: "did"
}

// enum for draft versions
const DRAFT_VERSIONS = {
    DRAFT_21: "draft-21",
    DRAFT_23: "draft-23"
}

// enum for request modes
const REQUEST_MODES = {
    BY_VALUE: "by_value",
    BY_REFERENCE: "by_reference"
}

// enum for support types
const SUPPORT_TYPES = {
    SUPPORTS_BY_VALUE: "supports_by_value",
    SUPPORTS_BY_REFERENCE: "supports_by_reference"
}


// Final map of all combinations
const finalAuthRequestMap = {
    [CLIENT_ID_SCHEMES.PRE_REGISTERED]: {
        [SUPPORT_TYPES.SUPPORTS_BY_REFERENCE]: true,
        [SUPPORT_TYPES.SUPPORTS_BY_VALUE]: true,
        [REQUEST_MODES.BY_REFERENCE]: {
            [DRAFT_VERSIONS.DRAFT_23]: authorizationRequestParamsDraft23,
            [DRAFT_VERSIONS.DRAFT_21]: authorizationRequestParamsDraft23,
        },
        [REQUEST_MODES.BY_VALUE]: {
            [DRAFT_VERSIONS.DRAFT_23]: preRegisteredAuthorizationRequestDraft23,
            [DRAFT_VERSIONS.DRAFT_21]: preRegisteredAuthorizationRequestDraft21,
        }
    },
    [CLIENT_ID_SCHEMES.REDIRECT_URI]: {
        [SUPPORT_TYPES.SUPPORTS_BY_REFERENCE]: false,
        [SUPPORT_TYPES.SUPPORTS_BY_VALUE]: true,
        [REQUEST_MODES.BY_REFERENCE]: {
            [DRAFT_VERSIONS.DRAFT_23]: authorizationRequestParamsDraft23,
            [DRAFT_VERSIONS.DRAFT_21]: authorizationRequestParamsDraft23,
        },
        [REQUEST_MODES.BY_VALUE]: {
            [DRAFT_VERSIONS.DRAFT_23]: redirectAuthorizationRequestDraft23,
            [DRAFT_VERSIONS.DRAFT_21]: redirectAuthorizationRequestDrat21,
        }
    },
    [CLIENT_ID_SCHEMES.DID]: {
        [SUPPORT_TYPES.SUPPORTS_BY_REFERENCE]: true,
        [SUPPORT_TYPES.SUPPORTS_BY_VALUE]: false,
        [REQUEST_MODES.BY_REFERENCE]: {
            [DRAFT_VERSIONS.DRAFT_23]: authorizationRequestParamsDraft23,
            [DRAFT_VERSIONS.DRAFT_21]: authorizationRequestParamsDraft23,
        },
        [REQUEST_MODES.BY_VALUE]: {
            [DRAFT_VERSIONS.DRAFT_23]: didAuthorizationRequestDraft23,
            [DRAFT_VERSIONS.DRAFT_21]: didAuthorizationRequestDraft21,
        }
    }
}

module.exports = {
    preRegisteredAuthorizationRequest: preRegisteredAuthorizationRequestDraft23,
    didAuthorizationRequest: didAuthorizationRequestDraft23,
    redirectAuthorizationRequest: redirectAuthorizationRequestDraft23,
    authorizationRequestParams: authorizationRequestParamsDraft23,
    preRegisteredAuthorizationRequestDraft21: preRegisteredAuthorizationRequestDraft21,
    didAuthorizationRequestDraft21: didAuthorizationRequestDraft21,
    redirectAuthorizationRequestDraft21: redirectAuthorizationRequestDrat21,
    authorizationRequestParamsDraft21: authorizationRequestParamsDraft21,

    SUPPORT_TYPES,
    REQUEST_MODES,
    CLIENT_ID_SCHEMES,
    DRAFT_VERSIONS,
    finalAuthRequestMap
}


