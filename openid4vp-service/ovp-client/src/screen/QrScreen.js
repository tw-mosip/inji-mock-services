import React, {Fragment, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {BACKEND_URL} from "../constants/mockui-constants";
import {AccordionSection} from "../components/common/Section";
import {Loader} from "../components/common/Loader";
import Toggle from "../components/common/Toggle";
import {font} from "../styles/palette";
import {DRAFT_VERSIONS, REQUEST_MODES} from "../constants/constants";
import {ScanResult} from "../components/scan/ScanResult";
import {Image} from "../components/common/Image";
import Error from "../components/common/Error";
import {Code} from "../components/common/Code";

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
    const [errorMessage, setErrorMessage] = useState(null);
    const [decodedJwt, setDecodedJwt] = useState(null);
    const [isDecoded, setIsDecoded] = useState(false);

    const handleDecodeJwt = () => {

        const parts = actualAuthorizationRequestObject.split('.');
        if (parts.length !== 3) {
            setErrorMessage("Invalid JWT format");
            return;
        }

        try {
            // decode both header and payload
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[0].length + (4 - parts[0].length % 4) % 4, '=')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(parts[1].length + (4 - parts[1].length % 4) % 4, '=')));
            setDecodedJwt({header,payload});
            setIsDecoded(true);
        } catch (error) {
            console.error("Error decoding JWT:", error);
            setErrorMessage("Error decoding JWT: " + error.message);
            setIsDecoded(false)
        }
    }

    const fetchQrCodeData = async (clientIdScheme: string, requestMode: string, draftVersion: string = DRAFT_VERSIONS.DRAFT_23) => {
        try {
            // /verifier/<client_id_scheme>/<request_mode>-qr?draft=<draft_version>
            const response = await axios.get(`${BACKEND_URL}/verifier/${clientIdScheme}/${requestMode}?draft=${draftVersion}`);

            if (response.status !== 200) {
                setErrorMessage("Error fetching QR code data");
            }

            setQrCodeData(response.data.qrCodeData);
            setQrData(response.data.qrData);
            const inputDataValue = response.data.inputData;
            setInputData(inputDataValue)

            if (requestMode === REQUEST_MODES.BY_REFERENCE) {
                const requestUri = inputDataValue["request_uri"];
                console.log("Fetching actual authorization request object from ", requestUri)
                const requestUriMethod = inputDataValue["request_uri_method"] ?? "get";
                const response = await axios({
                    method: requestUriMethod,
                    url: requestUri,
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                })

                setActualAuthorizationRequestObject(response.data);
            }
        } catch (error) {
            resetValues()
            console.error("Error fetching QR code data:", error);
            if (error?.response?.data) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage(error?.message ?? "Error fetching QR code data");
            }
        }
    }

    useEffect(() => {
        const fetchQr = async () => {
            await fetchQrCodeData(state.name, isByValue ? REQUEST_MODES.BY_VALUE : REQUEST_MODES.BY_REFERENCE);
        };

        void fetchQr();
    }, [state]);

    useEffect(() => {
        document.title = 'Scan';
    }, []);

    const resetValues = () => {
        setErrorMessage(null)
        setQrData(null)
        setQrCodeData(null)
        setActualAuthorizationRequestObject(null)
    }
    const handleByValueAuthRequest = async () => {
        if (isByValue)
            return;

        setIsByValue((prev) => !prev);
        setIsByReference(false);

        resetValues();

        await fetchQrCodeData(state.name, REQUEST_MODES.BY_VALUE)
    }

    const handleByReferenceAuthRequest = async () => {
        if (isByReference)
            return;

        setIsByReference((prev) => !prev);
        setIsByValue(false);

        resetValues()

        await fetchQrCodeData(state.name, REQUEST_MODES.BY_REFERENCE)
    }

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

    const header = () => {
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
            <h2> ({state?.name || 'QR Code Image'})</h2>
        </div>;
    }

    const requestToggle = () => {
        return <Toggle
            options={[
                {
                    name: "By Value",
                    selected: isByValue,
                    onChange: handleByValueAuthRequest
                }, {
                    name: "By Reference",
                    selected: isByReference,
                    onChange: handleByReferenceAuthRequest
                }
            ]}
        />;
    }

    if (errorMessage) {
        return (
            <div style={{padding: '20px 30px'}}>
                {header()}
                <div style={{paddingLeft: 40}}>
                    {requestToggle()}
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
                    {requestToggle()}
                    <div style={{maxWidth: '100%'}}>
                        <div>
                            <a href={qrData} target="_blank" rel="noopener noreferrer">
                                <Image src={qrCodeData} alt={"QR code"}/>
                            </a>
                            {downloadQRCode()}
                            {inputData && (
                                <AccordionSection title={"Input Data"} value={JSON.stringify(inputData, null, 2)}/>
                            )}
                            {qrData && (
                                <AccordionSection title={"Payload"} value={qrData}/>
                            )}
                            {actualAuthorizationRequestObject && (
                                <AccordionSection title={"Actual Authorization Request Object"}>
                                    <Toggle options={[
                                        {
                                            name: "Decoded",
                                            selected: isDecoded,
                                            onChange: handleDecodeJwt
                                        }, {
                                            name: "Encoded",
                                            selected: !isDecoded,
                                            onChange: () => setIsDecoded(false)
                                        }
                                    ]}/>
                                    <div style={{marginTop: 10}}>
                                        {isDecoded ? <Code value={decodedJwt}/> :
                                            <Code value={actualAuthorizationRequestObject}/>}
                                    </div>
                                </AccordionSection>
                            )}
                        </div>
                    </div>
                </div>
                <ScanResult/>
            </div>
        </div>
    );
};

export default QrScreen;
