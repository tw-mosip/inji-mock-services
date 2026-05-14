const { CLIENT_ID_SCHEMES } = require("./constants");
const preRegistered = require("./requestData/preRegistered");
const redirectUri = require("./requestData/redirectUri");
const did = require("./requestData/did");

// Final map of all combinations
const finalAuthRequestMap = {
    [CLIENT_ID_SCHEMES.PRE_REGISTERED]: preRegistered.map,
    [CLIENT_ID_SCHEMES.REDIRECT_URI]: redirectUri.map,
    [CLIENT_ID_SCHEMES.DID]: did.map,
}

module.exports = {
    preRegisteredAuthorizationRequest: preRegistered.preRegisteredAuthorizationRequestDraft23,
    didAuthorizationRequest: did.didAuthorizationRequestDraft23,
    redirectAuthorizationRequest: redirectUri.redirectAuthorizationRequestDraft23,
    authorizationRequestParams: did.didAuthorizationRequestParamsDraft23,

    finalAuthRequestMap
}




