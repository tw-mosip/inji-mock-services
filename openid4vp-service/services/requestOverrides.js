const { DRAFT_VERSIONS } = require('../constants');

function extractDcqlQueryOverride(req) {
    if (req.body && req.body.dcql_query !== undefined) {
        return req.body.dcql_query;
    }

    const rawQueryDcql = req.query?.dcql_query;
    if (rawQueryDcql === undefined) {
        return undefined;
    }

    if (typeof rawQueryDcql === 'string') {
        try {
            return JSON.parse(rawQueryDcql);
        } catch (error) {
            throw new Error('INVALID_DCQL_QUERY');
        }
    }

    return rawQueryDcql;
}

function isValidDcqlOverride(dcql) {
    return !!dcql && typeof dcql === 'object' && !Array.isArray(dcql);
}

function extractPresentationDefinitionOverride(req) {
    if (req.body && req.body.presentation_definition !== undefined) {
        return req.body.presentation_definition;
    }

    const rawQueryPd = req.query?.presentation_definition;
    if (rawQueryPd === undefined) {
        return undefined;
    }

    if (typeof rawQueryPd === 'string') {
        try {
            return JSON.parse(rawQueryPd);
        } catch (error) {
            throw new Error('INVALID_PRESENTATION_DEFINITION');
        }
    }

    return rawQueryPd;
}

function isValidPresentationDefinitionOverride(pd) {
    return !!pd && typeof pd === 'object' && !Array.isArray(pd);
}

function applyPresentationDefinitionOverride(inputData, draftVersion, presentationDefinitionOverride, defaultPresentationDefinition) {
    if (!inputData || draftVersion === DRAFT_VERSIONS.V_1_0 || !('presentation_definition' in inputData)) {
        return inputData;
    }

    const updatedInputData = JSON.parse(JSON.stringify(inputData));
    const nextPresentationDefinition = presentationDefinitionOverride !== undefined
        ? presentationDefinitionOverride
        : defaultPresentationDefinition;

    updatedInputData.presentation_definition = nextPresentationDefinition;
    return updatedInputData;
}

function applyDcqlQueryOverride(inputData, draftVersion, dcqlOverride, defaultDcqlQuery) {
    if (!inputData || draftVersion !== DRAFT_VERSIONS.V_1_0 || !('dcql_query' in inputData)) {
        return inputData;
    }

    const updatedInputData = JSON.parse(JSON.stringify(inputData));
    updatedInputData.dcql_query = dcqlOverride !== undefined ? dcqlOverride : defaultDcqlQuery;
    return updatedInputData;
}

function setPresentationDefinitionUriWithSessionId(inputData, baseUrl, sessionId) {
    if (!sessionId || !inputData?.presentation_definition_uri) {
        return inputData;
    }

    inputData.presentation_definition_uri = `${baseUrl}/verifier/presentation-definition-uri/${sessionId}`;
    return inputData;
}

module.exports = {
    extractDcqlQueryOverride,
    isValidDcqlOverride,
    extractPresentationDefinitionOverride,
    isValidPresentationDefinitionOverride,
    applyPresentationDefinitionOverride,
    applyDcqlQueryOverride,
    setPresentationDefinitionUriWithSessionId,
};
