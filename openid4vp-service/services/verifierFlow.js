const { SPEC_VERSIONS: SPEC_VERSIONS } = require('../constants');
const {
    extractDcqlQueryOverride,
    isValidDcqlOverride,
    extractPresentationDefinitionOverride,
    isValidPresentationDefinitionOverride,
    applyPresentationDefinitionOverride,
    applyDcqlQueryOverride,
    setPresentationDefinitionUriWithSessionId,
} = require('./requestOverrides');

function resolveOverrides(req, providedDcqlQuery = undefined, providedPresentationDefinition = undefined) {
    let queryDcqlOverride;
    let queryPresentationDefinitionOverride;

    try {
        queryDcqlOverride = extractDcqlQueryOverride(req);
        queryPresentationDefinitionOverride = extractPresentationDefinitionOverride(req);
    } catch (error) {
        if (error.message === 'INVALID_DCQL_QUERY') {
            return { errorMessage: 'Bad Request: dcql_query should be a valid JSON object' };
        }
        if (error.message === 'INVALID_PRESENTATION_DEFINITION') {
            return { errorMessage: 'Bad Request: presentation_definition should be a valid JSON object' };
        }

        throw error;
    }

    const dcqlOverride = providedDcqlQuery !== undefined ? providedDcqlQuery : queryDcqlOverride;
    const presentationDefinitionOverride = providedPresentationDefinition !== undefined
        ? providedPresentationDefinition
        : queryPresentationDefinitionOverride;

    if (dcqlOverride !== undefined && !isValidDcqlOverride(dcqlOverride)) {
        return { errorMessage: 'Bad Request: dcql_query should be a valid JSON object' };
    }

    if (presentationDefinitionOverride !== undefined && !isValidPresentationDefinitionOverride(presentationDefinitionOverride)) {
        return { errorMessage: 'Bad Request: presentation_definition should be a valid JSON object' };
    }

    return { dcqlOverride, presentationDefinitionOverride };
}

function applyDraftOverrides({
    inputData,
    specVersion,
    dcqlOverride,
    presentationDefinitionOverride,
    defaultDcqlQuery,
    defaultPresentationDefinition,
    baseUrl,
    sessionId,
}) {
    if (specVersion === SPEC_VERSIONS.V_1_0) {
        return applyDcqlQueryOverride(inputData, specVersion, dcqlOverride, defaultDcqlQuery);
    }

    const updatedInputData = applyPresentationDefinitionOverride(
        inputData,
        specVersion,
        presentationDefinitionOverride,
        defaultPresentationDefinition
    );

    if (sessionId && updatedInputData?.presentation_definition_uri) {
        setPresentationDefinitionUriWithSessionId(updatedInputData, baseUrl, sessionId);
    }

    return updatedInputData;
}

module.exports = {
    resolveOverrides,
    applyDraftOverrides,
};
