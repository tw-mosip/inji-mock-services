import {useState} from 'react';
import {DRAFT_VERSIONS} from '../constants/constants';
import {DCQL_PRESETS} from '../constants/dcql-presets';
import {cloneQuery, ensureDcqlShape} from '../utility/dcqlHelper';

const EMPTY_QUERY = {credentials: [], credential_sets: []};

const DEFAULT_PRESENTATION_DEFINITION = {
    id: 'c4822b58-7fb4-454e-b827-f8758fe27f9a',
    purpose: 'Relying party is requesting your digital ID for the purpose of Self-Authentication',
    input_descriptors: [
        {
            id: 'Mock Identity card credential',
            format: {
                'vc+sd-jwt': {
                    'sd-jwt_alg_values': ['ES256'],
                },
            },
            constraints: {
                fields: [
                    {
                        path: ['$.vct'],
                        filter: {
                            type: 'string',
                            pattern: 'MockVerifiableCredential_SD_JWT',
                        },
                    },
                ],
            },
        },
    ],
};

const emptyPreset = DCQL_PRESETS.find((preset) => preset.value === 'empty');

/**
 * Manages DCQL / presentation-definition state and the presentation request modal.
 *
 * @param {boolean}  selectedDraftIsV10 - whether draft V1.0 is active
 * @param {function} onFetch            - (dcqlQueryOverride, presentationDefinitionOverride) => Promise
 */
export const usePresentationRequest = ({selectedDraftIsV10, onFetch}) => {
    const [showPresentationRequestDetails, setShowPresentationRequestDetails] = useState(false);
    const [dcqlQueryValue, setDcqlQueryValue] = useState(cloneQuery(emptyPreset?.query || EMPTY_QUERY));
    const [draftDcqlQueryValue, setDraftDcqlQueryValue] = useState(cloneQuery(emptyPreset?.query || EMPTY_QUERY));
    const [hasSubmittedDcqlQuery, setHasSubmittedDcqlQuery] = useState(false);
    const [allowInvalidDcqlRequest, setAllowInvalidDcqlRequest] = useState(false);
    const [presentationDefinitionValue, setPresentationDefinitionValue] = useState(DEFAULT_PRESENTATION_DEFINITION);
    const [draftPresentationDefinitionValue, setDraftPresentationDefinitionValue] = useState(DEFAULT_PRESENTATION_DEFINITION);
    const [hasSubmittedPresentationDefinition, setHasSubmittedPresentationDefinition] = useState(false);

    const normalizeDcqlForSubmission = (query, allowInvalid = false) => {
        if (allowInvalid) {
            return cloneQuery(query && typeof query === 'object' ? query : {});
        }
        const normalized = ensureDcqlShape(query);
        const result = {credentials: normalized.credentials};
        if (Array.isArray(normalized.credential_sets) && normalized.credential_sets.length > 0) {
            result.credential_sets = normalized.credential_sets;
        }
        return result;
    };

    const getDcqlQueryOverride = () => {
        if (!selectedDraftIsV10 || !hasSubmittedDcqlQuery) return undefined;
        return normalizeDcqlForSubmission(dcqlQueryValue, allowInvalidDcqlRequest);
    };

    const getPresentationDefinitionOverride = () => {
        if (selectedDraftIsV10 || !hasSubmittedPresentationDefinition) return undefined;
        return presentationDefinitionValue && typeof presentationDefinitionValue === 'object'
            ? presentationDefinitionValue
            : {};
    };

    const handleDcqlQueryChange = (value) => setDraftDcqlQueryValue(value);

    const handlePresentationDefinitionChange = (value) => setDraftPresentationDefinitionValue(value);

    const openPresentationRequestDetails = () => {
        if (selectedDraftIsV10) {
            setDraftDcqlQueryValue(cloneQuery(dcqlQueryValue));
        } else {
            setDraftPresentationDefinitionValue(JSON.parse(JSON.stringify(presentationDefinitionValue)));
        }
        setShowPresentationRequestDetails(true);
    };

    const closePresentationRequestDetails = () => {
        setDraftDcqlQueryValue(cloneQuery(dcqlQueryValue));
        setDraftPresentationDefinitionValue(JSON.parse(JSON.stringify(presentationDefinitionValue)));
        setShowPresentationRequestDetails(false);
    };

    const submitPresentationRequestDetails = async () => {
        const dcqlQueryOverride = selectedDraftIsV10
            ? normalizeDcqlForSubmission(draftDcqlQueryValue, allowInvalidDcqlRequest)
            : undefined;
        const presentationDefinitionOverride = !selectedDraftIsV10 ? draftPresentationDefinitionValue : undefined;

        if (selectedDraftIsV10) {
            setDcqlQueryValue(cloneQuery(dcqlQueryOverride));
            setHasSubmittedDcqlQuery(true);
        } else {
            setPresentationDefinitionValue(JSON.parse(JSON.stringify(draftPresentationDefinitionValue)));
            setHasSubmittedPresentationDefinition(true);
        }
        setShowPresentationRequestDetails(false);

        await onFetch(dcqlQueryOverride, presentationDefinitionOverride);
    };

    return {
        showPresentationRequestDetails,
        draftDcqlQueryValue,
        draftPresentationDefinitionValue,
        allowInvalidDcqlRequest,
        setAllowInvalidDcqlRequest,
        hasSubmittedDcqlQuery,
        getDcqlQueryOverride,
        getPresentationDefinitionOverride,
        handleDcqlQueryChange,
        handlePresentationDefinitionChange,
        openPresentationRequestDetails,
        closePresentationRequestDetails,
        submitPresentationRequestDetails,
    };
};
