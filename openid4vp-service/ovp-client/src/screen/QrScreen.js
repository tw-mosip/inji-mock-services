import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BACKEND_URL, INJIWEB_URL} from "../constants/mockui-constants";
import {AccordionSection} from "../components/common/Section";
import {Loader} from "../components/common/Loader";
import {font} from "../styles/palette";
import {DRAFT_VERSIONS, REQUEST_MODES, RESPONSE_MODES} from "../constants/constants";
import {ScanResult} from "../components/scan/ScanResult";
import {Image} from "../components/common/Image";
import Error from "../components/common/Error";
import {Code} from "../components/common/Code";
import Button from "../components/common/Button";
import DecoderEncoderView from '../components/DecoderEncoderView';
import {DCQL_PRESETS} from "../constants/dcql-presets";
import {cloneQuery, ensureDcqlShape} from "../utility/dcqlHelper";
import QrScreenHeader from "../components/qr/QrScreenHeader";
import DownloadQRButton from "../components/qr/DownloadQRButton";
import QrControls from "../components/qr/QrControls";
import PresentationRequestModal from "../components/qr/PresentationRequestModal";

const presentationDefinitionMock = {
    "id": "c4822b58-7fb4-454e-b827-f8758fe27f9a",
    "purpose": "Relying party is requesting your digital ID for the purpose of Self-Authentication",
    "input_descriptors": [
      {
        "id": "Mock Identity card credential",
        "format": {
          "vc+sd-jwt": {
            "sd-jwt_alg_values": [
              "ES256"
            ]
          }
        },
        "constraints": {
          "fields": [
            {
              "path": [
                "$.vct"
              ],
              "filter": {
                "type": "string",
                "pattern": "MockVerifiableCredential_SD_JWT"
              }
            }
          ]
        }
      }
    ]
  }


const EMPTY_QUERY = { credentials: [], credential_sets: [] };
const EMPTY_PRESENTATION_DEFINITION = { id: "", purpose: "", input_descriptors: [] };
const DEFAULT_PRESENTATION_DEFINITION = JSON.parse(JSON.stringify(presentationDefinitionMock));
const emptyPreset = DCQL_PRESETS.find((preset) => preset.value === "empty");

const styles = {
    container: {
        padding: '20px 30px',
        color: font.primary,
    },
    content: {
        paddingLeft: 40,
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        justifyItems: 'flex-start',
    },
};
const QrScreen = () => {
    const {state} = useLocation();
    const navigate = useNavigate();

    const [qrData, setQrData] = useState(null);
    const [inputData, setInputData] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [actualAuthorizationRequestObject, setActualAuthorizationRequestObject] = useState(null);
    const [isByValue, setIsByValue] = useState(true);
    const [isByReference, setIsByReference] = useState(false);
    const [selectedDraft, setSelectedDraft] = useState(Object.values(DRAFT_VERSIONS)[0]);
    const [selectedResponseMode, setSelectedResponseMode] = useState(Object.values(RESPONSE_MODES)[0]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isRequestSigned, setIsRequestSigned] = useState(false);
    const [showPresentationRequestDetails, setShowPresentationRequestDetails] = useState(false);
    const [dcqlQueryValue, setDcqlQueryValue] = useState(cloneQuery(emptyPreset?.query || EMPTY_QUERY));
    const [draftDcqlQueryValue, setDraftDcqlQueryValue] = useState(cloneQuery(emptyPreset?.query || EMPTY_QUERY));
    const [hasSubmittedDcqlQuery, setHasSubmittedDcqlQuery] = useState(false);
    const [allowInvalidDcqlRequest, setAllowInvalidDcqlRequest] = useState(false);
    const [presentationDefinitionValue, setPresentationDefinitionValue] = useState(DEFAULT_PRESENTATION_DEFINITION);
    const [draftPresentationDefinitionValue, setDraftPresentationDefinitionValue] = useState(DEFAULT_PRESENTATION_DEFINITION);
    const [hasSubmittedPresentationDefinition, setHasSubmittedPresentationDefinition] = useState(false);

    const selectedDraftIsV10 = selectedDraft === DRAFT_VERSIONS.V_1_0;

    const fetchQrCodeData = useCallback(async (clientIdScheme, requestMode, draftVersion, isRequestSigned = false, responseMode = "direct_post", dcqlQueryOverride, presentationDefinitionOverride) => {
        try {
            const qrRequestBody = {
                signed: isRequestSigned,
                response_mode: responseMode,
            };

            if (dcqlQueryOverride !== undefined) {
                qrRequestBody.dcql_query = dcqlQueryOverride;
            }

            if (presentationDefinitionOverride !== undefined) {
                qrRequestBody.presentation_definition = presentationDefinitionOverride;
            }

            // draft is intentionally kept as query param for backend compatibility
            const qrResponse = await axios.post(`${BACKEND_URL}/verifier/${clientIdScheme}/${requestMode}?draft=${draftVersion}`, qrRequestBody, {
                headers: {
                    'ngrok-skip-browser-warning': 'true'
                }
            });

            if (qrResponse.status !== 200) {
                setErrorMessage("Error fetching QR code data");
            }

            setQrCodeData(qrResponse.data.qrCodeData);
            setQrData(qrResponse.data.qrData);
            const inputDataValue = qrResponse.data.inputData;
            setInputData(inputDataValue)

            if (requestMode === REQUEST_MODES.BY_REFERENCE) {
                const requestUri = inputDataValue?.request_uri;
                const requestUriMethod = inputDataValue?.request_uri_method ?? "get";
                const uriResponse = await axios({
                    method: requestUriMethod,
                    url: requestUri,
                    data: (dcqlQueryOverride !== undefined || presentationDefinitionOverride !== undefined) ? { 
                        ...(dcqlQueryOverride !== undefined ? { dcql_query: dcqlQueryOverride } : {}),
                        ...(presentationDefinitionOverride !== undefined ? { presentation_definition: presentationDefinitionOverride } : {})
                    } : undefined,
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                })

                setActualAuthorizationRequestObject(uriResponse.data);
            }
            setErrorMessage(null)
        } catch (error) {
            resetValues()
            console.error("Error fetching QR code data:", error);
            if (error?.response?.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage(error?.message ?? "Error fetching QR code data");
            }
        }
    }, []);

    const normalizeDcqlForSubmission = (query, allowInvalid = false) => {
        if (allowInvalid) {
            return cloneQuery(query && typeof query === 'object' ? query : {});
        }

        const normalized = ensureDcqlShape(query);
        const result = {
            credentials: normalized.credentials,
        };

        if (Array.isArray(normalized.credential_sets) && normalized.credential_sets.length > 0) {
            result.credential_sets = normalized.credential_sets;
        }

        return result;
    }

    const getDcqlQueryOverride = () => {
        if (!selectedDraftIsV10 || !hasSubmittedDcqlQuery) {
            return undefined;
        }

        return normalizeDcqlForSubmission(dcqlQueryValue, allowInvalidDcqlRequest);
    }

    const getPresentationDefinitionOverride = () => {
        if (selectedDraftIsV10 || !hasSubmittedPresentationDefinition) {
            return undefined;
        }

        return presentationDefinitionValue && typeof presentationDefinitionValue === 'object' ? presentationDefinitionValue : {};
    }

    const fetchQr = async () => {
        const dcqlQueryOverride = getDcqlQueryOverride();
        const presentationDefinitionOverride = getPresentationDefinitionOverride();
        if (dcqlQueryOverride === null) {
            return;
        }

        await fetchQrCodeData(
            state.name,
            isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE,
            selectedDraft,
            isRequestSigned,
            selectedResponseMode,
            dcqlQueryOverride,
            presentationDefinitionOverride
        );
    };

    useEffect(() => {
        void fetchQr();
    }, [state, isByValue, isByReference, selectedDraft, fetchQrCodeData, isRequestSigned, selectedResponseMode]);

    useEffect(() => {
        document.title = 'Scan';
    }, []);


    const resetValues = () => {
        setErrorMessage(null)
        setQrData(null)
        setQrCodeData(null)
        setActualAuthorizationRequestObject(null)
    }

    const handleDcqlQueryChange = (value) => {
        setDraftDcqlQueryValue(value);
    }

    const handlePresentationDefinitionChange = (value) => {
        setDraftPresentationDefinitionValue(value);
    }

    const openPresentationRequestDetails = () => {
        if (selectedDraftIsV10) {
            setDraftDcqlQueryValue(cloneQuery(dcqlQueryValue));
        } else {
            setDraftPresentationDefinitionValue(JSON.parse(JSON.stringify(presentationDefinitionValue)));
        }
        setShowPresentationRequestDetails(true);
    }

    const closePresentationRequestDetails = () => {
        setDraftDcqlQueryValue(cloneQuery(dcqlQueryValue));
        setDraftPresentationDefinitionValue(JSON.parse(JSON.stringify(presentationDefinitionValue)));
        setShowPresentationRequestDetails(false);
    }

    const submitPresentationRequestDetails = async () => {
        if (selectedDraftIsV10) {
            // Handle DCQL submission
            const nextQuery = normalizeDcqlForSubmission(draftDcqlQueryValue, allowInvalidDcqlRequest);
            setDcqlQueryValue(cloneQuery(nextQuery));
            setHasSubmittedDcqlQuery(true);
        } else {
            // Handle presentation definition submission
            setPresentationDefinitionValue(JSON.parse(JSON.stringify(draftPresentationDefinitionValue)));
            setHasSubmittedPresentationDefinition(true);
        }
        setShowPresentationRequestDetails(false);

        const dcqlQueryOverride = selectedDraftIsV10 ? normalizeDcqlForSubmission(draftDcqlQueryValue, allowInvalidDcqlRequest) : undefined;
        const presentationDefinitionOverride = !selectedDraftIsV10 ? draftPresentationDefinitionValue : undefined;

        await fetchQrCodeData(
            state.name,
            isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE,
            selectedDraft,
            isRequestSigned,
            selectedResponseMode,
            dcqlQueryOverride,
            presentationDefinitionOverride
        );
    }

    const handleOpenInjiWeb = () => {
        const strippedRequest = qrData.split('?')[1] || '';
        window.open(`${INJIWEB_URL}?${strippedRequest}`, '_blank');
    }

    const handleRequestModeChange = async (mode) => {
        if ((mode === REQUEST_MODES.BY_VALUE && isByValue) || (mode === REQUEST_MODES.BY_REFERENCE && isByReference)) return;
        setIsByValue(mode === REQUEST_MODES.BY_VALUE);
        setIsByReference(mode === REQUEST_MODES.BY_REFERENCE);
        resetValues();
        const dcqlQueryOverride = getDcqlQueryOverride();
        if (dcqlQueryOverride === null) return;
        await fetchQrCodeData(state.name, mode, selectedDraft, isRequestSigned, selectedResponseMode, dcqlQueryOverride);
    };

    const handleDraftVersionChange = async (version) => {
        if (version === selectedDraft) return;
        setSelectedDraft(version);
        resetValues();
        const dcqlQueryOverride = (version === DRAFT_VERSIONS.V_1_0 && hasSubmittedDcqlQuery) ? getDcqlQueryOverride() : undefined;
        if (dcqlQueryOverride === null) return;
        await fetchQrCodeData(state.name, isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE, version, isRequestSigned, selectedResponseMode, dcqlQueryOverride);
    };

    const handleResponseModeChange = (mode) => {
        if (mode === selectedResponseMode) return;
        setSelectedResponseMode(mode);
        resetValues();
    };

    const title = `${state?.name || 'QR Code Image'} - ${selectedDraft}`;

    const renderDecoderAccordion = (sectionTitle, value, actualSignedData) => (
        <AccordionSection title={sectionTitle}>
            <DecoderEncoderView input={value} actualSignedData={actualSignedData}/>
        </AccordionSection>
    );

    const renderInputData = () => (
        isRequestSigned
            ? renderDecoderAccordion("Input Data", inputData, inputData["request"])
            : <AccordionSection title={"Input Data"}><Code value={inputData}/></AccordionSection>
    );

    const renderActualAuthorizationObject = () =>
        renderDecoderAccordion("Actual Authorization Request Object", actualAuthorizationRequestObject);

    const renderPayload = () => <AccordionSection title={"Payload"} value={qrData}/>;

    const sharedControls = (
        <QrControls
            isByValue={isByValue}
            isByReference={isByReference}
            selectedDraft={selectedDraft}
            selectedResponseMode={selectedResponseMode}
            isRequestSigned={isRequestSigned}
            onRequestModeChange={handleRequestModeChange}
            onDraftVersionChange={handleDraftVersionChange}
            onResponseModeChange={handleResponseModeChange}
            onSignedChange={(isChecked) => setIsRequestSigned(isChecked)}
            onOpenPresentationDetails={openPresentationRequestDetails}
        />
    );

    const presentationModal = (
        <PresentationRequestModal
            isOpen={showPresentationRequestDetails}
            onClose={closePresentationRequestDetails}
            onSubmit={submitPresentationRequestDetails}
            draftDcqlQueryValue={draftDcqlQueryValue}
            onDcqlQueryChange={handleDcqlQueryChange}
            draftPresentationDefinitionValue={draftPresentationDefinitionValue}
            onPresentationDefinitionChange={handlePresentationDefinitionChange}
            selectedDraftIsV10={selectedDraftIsV10}
            allowInvalidRequest={allowInvalidDcqlRequest}
            onAllowInvalidRequestChange={setAllowInvalidDcqlRequest}
        />
    );

    if (errorMessage) {
        return (
            <div style={{padding: '20px 30px'}}>
                <QrScreenHeader title={title} onBack={() => navigate('/')}/>
                <div style={{paddingLeft: 40}}>
                    {sharedControls}
                    <Error message={errorMessage}/>
                </div>
                {presentationModal}
            </div>
        );
    }

    if (!(qrData && qrCodeData)) {
        return (
            <Fragment>
                <QrScreenHeader title={title} onBack={() => navigate('/')}/>
                <Loader>Loading...</Loader>
            </Fragment>
        );
    }

    return (
        <div style={styles.container}>
            <QrScreenHeader title={title} onBack={() => navigate('/')}/>
            <div style={styles.content}>
                <div style={{flex: 1}}>
                    {sharedControls}
                    <div style={{maxWidth: '100%'}}>
                        <a href={qrData} target="_blank" rel="noopener noreferrer">
                            <Image src={qrCodeData} alt={"QR code"}/>
                        </a>
                        <div style={{display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center'}}>
                            <DownloadQRButton qrCodeData={qrCodeData}/>
                            <Button
                                onClick={handleOpenInjiWeb}
                                variant={"primary"}
                                style={{padding: '8px 16px', fontSize: '14px'}}
                            >
                                Open InjiWeb
                            </Button>
                        </div>
                        {inputData && renderInputData()}
                        {qrData && renderPayload()}
                        {actualAuthorizationRequestObject && renderActualAuthorizationObject()}
                    </div>
                </div>
                <ScanResult/>
            </div>
            {presentationModal}
        </div>
    );
};

export default QrScreen;
