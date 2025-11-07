import React, {Fragment, useCallback, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BACKEND_URL, INJIWEB_URL} from "../constants/mockui-constants";
import {AccordionSection} from "../components/common/Section";
import {Loader} from "../components/common/Loader";
import Toggle from "../components/common/Toggle";
import {font} from "../styles/palette";
import {DRAFT_VERSIONS, REQUEST_MODES} from "../constants/constants";
import {ScanResult} from "../components/scan/ScanResult";
import {Image} from "../components/common/Image";
import Error from "../components/common/Error";
import {Code} from "../components/common/Code";
import Button from "../components/common/Button";
import CheckBox from "../components/common/checkBox";
import DecoderEncoderView from '../components/DecoderEncoderView';

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
    // Media query styles for mobile
    '@media (max-width: 768px)': {
        container: {
            padding: '10px 5px',
        },
        content: {
            flexDirection: 'column',
            paddingLeft: 0,
            gap: 4,
        },
        header: {
            flexDirection: 'column',
            gap: '10px',
            fontSize: 'large',
        },
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
    const [isDraft23, setIsDraft23] = useState(true);
    const [isDraft21, setIsDraft21] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isRequestSigned, setIsRequestSigned] = useState(false);

    const fetchQrCodeData = useCallback(async (clientIdScheme, requestMode, draftVersion, isRequestSigned = false) => {
        try {
            // /verifier/<client_id_scheme>/<request_mode>-qr?draft=<draft_version>
            const qrResponse = await axios.get(`${BACKEND_URL}/verifier/${clientIdScheme}/${requestMode}?draft=${draftVersion}&signed=${isRequestSigned}`, {
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

    useEffect(() => {
        const fetchQr = async () => {
            await fetchQrCodeData(state.name, isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE, isDraft23 ? DRAFT_VERSIONS.DRAFT_23 : DRAFT_VERSIONS.DRAFT_21, isRequestSigned);
        };

        void fetchQr();
    }, [state, isByValue, isByReference, isDraft23, isDraft21, fetchQrCodeData, isRequestSigned]);

    useEffect(() => {
        document.title = 'Scan';
    }, []);

    const resetValues = () => {
        setErrorMessage(null)
        setQrData(null)
        setQrCodeData(null)
        setActualAuthorizationRequestObject(null)
    }

    const handleToggle = async (type: "requestMode" | "draftVersion", value) => {
        if (type === 'requestMode') {
            if ((value === REQUEST_MODES.BY_VALUE && isByValue) || (value === REQUEST_MODES.BY_REFERENCE && isByReference)) return;
            setIsByValue(value === REQUEST_MODES.BY_VALUE);
            setIsByReference(value === REQUEST_MODES.BY_REFERENCE);
            resetValues();
            await fetchQrCodeData(state.name, value, isDraft23 ? DRAFT_VERSIONS.DRAFT_23 : DRAFT_VERSIONS.DRAFT_21);
        } else if (type === 'draftVersion') {
            if ((value === DRAFT_VERSIONS.DRAFT_23 && isDraft23) || (value === DRAFT_VERSIONS.DRAFT_21 && isDraft21)) return;
            setIsDraft23(value === DRAFT_VERSIONS.DRAFT_23);
            setIsDraft21(value === DRAFT_VERSIONS.DRAFT_21);
            resetValues();
            await fetchQrCodeData(state.name, isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE, value);
        }
    };

    const downloadQRCode = () => {
        return <a
            href={qrCodeData}
            download="qr-code.png"
            style={{
                display: 'inline-block',
                padding: '8px 16px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                background: '#e0f7fa',
                textDecoration: 'none',
                color: '#000',
                cursor: 'pointer',
            }}
        >
            ⬇ Download QR
        </a>;
    }

    const handleOpenInjiWeb = () => {
        let encodedRequest = '';

        if (actualAuthorizationRequestObject) {
            // For "By Reference" mode, use the fetched authorization request object
            encodedRequest = actualAuthorizationRequestObject;
        } else if (qrData) {
            // For "By Value" mode, use the qrData (URL string) as the authorization request
            encodedRequest = qrData;
        }

        const strippedRequest = encodedRequest.split('?')[1] || '';
        window.open(`${INJIWEB_URL}?${strippedRequest}`, '_blank');
    }

    const header = () => {
        const currentDraft = isDraft23 ? 'draft-23' : 'draft-21';
        const title = `${state?.name || 'QR Code Image'} - ${currentDraft}`;

        return <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            borderRadius: '4px',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 20,
        }}>
            <div
                style={{
                    cursor: 'pointer',
                    fontSize: 'xx-large',
                    padding: ' 8px'
                }}
                onClick={() => navigate('/')}

            >
                ←
            </div>
            <h1>Scan screen</h1>
            <h2> ({title})</h2>
        </div>;
    }

    const requestModeToggleOptions = [
        {
            name: "By Value",
            selected: isByValue,
            onChange: () => handleToggle('requestMode', REQUEST_MODES.BY_VALUE)
        },
        {
            name: "By Reference",
            selected: isByReference,
            onChange: () => handleToggle('requestMode', REQUEST_MODES.BY_REFERENCE)
        }
    ];

    const draftVersionOptions = [
        {
            name: "Draft 23",
            selected: isDraft23,
            onChange: () => handleToggle('draftVersion', DRAFT_VERSIONS.DRAFT_23)
        },
        {
            name: "Draft 21",
            selected: isDraft21,
            onChange: () => handleToggle('draftVersion', DRAFT_VERSIONS.DRAFT_21)
        }
    ];

    const draftToggle = () => <Toggle options={draftVersionOptions}/>
    const requestToggle = () => <Toggle options={requestModeToggleOptions}/>

    const signRequestToggle = () =>
        isByValue ? (
            <CheckBox
                onClick={(isChecked) => setIsRequestSigned(isChecked)}
                checked={isRequestSigned}
                label={"Sign the request"}
                id={"signed"}
            />
        ) : null;

    const renderDecoderAccordion = (title, value, actualSignedData) => (
        <AccordionSection title={title}>
            <DecoderEncoderView input={value} actualSignedData={actualSignedData}/>
        </AccordionSection>
    );

    const renderInputData = () => (
        isRequestSigned
            ? renderDecoderAccordion("Input Data", inputData, inputData["request"])
            : <AccordionSection title={"Input Data"}><Code value={inputData}/></AccordionSection>
    );

    const renderActualAuthorizationObject = () => renderDecoderAccordion("Actual Authorization Request Object", actualAuthorizationRequestObject);

    const renderPayload = () => {
        return <AccordionSection title={"Payload"} value={qrData}/>;
    }
    if (errorMessage) {
        return (
            <div style={{padding: '20px 30px'}}>
                {header()}
                <div style={{paddingLeft: 40}}>
                    {requestToggle()}
                    {draftToggle()}
                    {signRequestToggle()}
                    <Error message={errorMessage}/>
                </div>
            </div>
        )
    }

    if (!(qrData && qrCodeData)) {
        return (
            <Fragment>
                {header()}
                <Loader>Loading...</Loader>
            </Fragment>
        )
    }

    return (
        <div style={styles.container}>
            {header()}
            <div style={styles.content}>
                <div style={{flex: 1}}>
                    <div style={{
                        paddingBottom: 20,
                    }}>
                        {requestToggle()}
                        {draftToggle()}
                        {signRequestToggle()}
                    </div>
                    <div style={{maxWidth: '100%'}}>
                        <div>
                            <a href={qrData} target="_blank" rel="noopener noreferrer">
                                <Image src={qrCodeData} alt={"QR code"}/>
                            </a>
                            <div style={{display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center'}}>
                                {downloadQRCode()}
                                <Button
                                    onClick={handleOpenInjiWeb}
                                    variant={"primary"}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                    }}
                                >
                                    Open InjiWeb
                                </Button>
                            </div>
                            {inputData && renderInputData()}
                            {qrData && renderPayload()}
                            {actualAuthorizationRequestObject && renderActualAuthorizationObject()}
                        </div>
                    </div>
                </div>
                <ScanResult/>
            </div>
        </div>
    );
};

export default QrScreen;
