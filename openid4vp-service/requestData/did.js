const {
  nonce, state, responseUri, baseUrl, presentationDefinitionUri, didDocumentUrl,REQUEST_MODES, DRAFT_VERSIONS, REQUEST_SIGNING_SUPPORT_MODES, ResponseModes
} = require("../constants");
const clientMetadata = require('../clientMetadataMock.json');
const {getVerifierMetadata} = require("../VerifierMetadata");
const {dcqlQuery} = require("../presentation-request/DCQLQuery");

const client_metadata = JSON.stringify(clientMetadata);

const didAuthorizationRequestVersion1 = {
  "client_id": `decentralized_identifier:${didDocumentUrl}`,
  "response_type": "vp_token",
  "response_mode": "direct_post",
  "dcql_query": dcqlQuery,
  "nonce": nonce,
  "state": state,
  "response_uri": responseUri,
  "client_metadata": getVerifierMetadata(ResponseModes.DIRECT_POST, DRAFT_VERSIONS.V_1_0),
}

const didAuthorizationRequestDraft23 = {
  "client_id": didDocumentUrl,
  // "dcql_query": dcqlQuery,
  "presentation_definition_uri": presentationDefinitionUri,
  "response_type": "vp_token",
  "response_mode": "direct_post",
  "nonce": nonce,
  // "state": state,
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

const didAuthorizationRequestParamsVersion1 = {
  "client_id": `decentralized_identifier:${didDocumentUrl}`,
  "request_uri": `${baseUrl}/verifier/get-auth-request-obj/did?draft=version-1.0`,
  "request_uri_method": "post"
}

const didAuthorizationRequestParamsDraft23 = {
  "client_id": didDocumentUrl,
  "request_uri_method": "post"
}

const didAuthorizationRequestParamsDraft21 = {
  "client_id": didDocumentUrl,
  "client_id_scheme": "did",
  "request_uri_method": "post"
}

const map = {
  [REQUEST_SIGNING_SUPPORT_MODES.SIGNED_REQUEST_SUPPORTED]: true,
  [REQUEST_SIGNING_SUPPORT_MODES.UNSIGNED_REQUEST_SUPPORTED]: false,
  [REQUEST_MODES.BY_REFERENCE]: {
    [DRAFT_VERSIONS.V_1_0]: didAuthorizationRequestParamsVersion1,
    [DRAFT_VERSIONS.DRAFT_23]: didAuthorizationRequestParamsDraft23,
    [DRAFT_VERSIONS.DRAFT_21]: didAuthorizationRequestParamsDraft21,
  },
  [REQUEST_MODES.BY_VALUE]: {
    [DRAFT_VERSIONS.V_1_0]: didAuthorizationRequestVersion1,
    [DRAFT_VERSIONS.DRAFT_23]: didAuthorizationRequestDraft23,
    [DRAFT_VERSIONS.DRAFT_21]: didAuthorizationRequestDraft21,
  },
};

module.exports = {
  didAuthorizationRequestDraft23,
  didAuthorizationRequestDraft21,
  didAuthorizationRequestParamsDraft23,
  didAuthorizationRequestParamsDraft21,
  map
};
