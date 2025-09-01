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

    const fetchQrCodeData = async (clientIdScheme: string, requestMode: string, draftVersion: string = DRAFT_VERSIONS.DRAFT_23) => {
        try {
            // /verifier/<client_id_scheme>/<request_mode>-qr?draft=<draft_version>
            const response = await axios.get(`${BACKEND_URL}/verifier/${clientIdScheme}/${requestMode}?draft=${draftVersion}`);

            if (response.status !== 200) {
                setErrorMessage("Error fetching QR code data");
            }

            setQrCodeData(response.data.qrCodeData);
            setQrData(response.data.qrData);
            setInputData(response.data.inputData)

            if (requestMode === REQUEST_MODES.BY_REFERENCE) {
                const response = await axios.get(`${BACKEND_URL}/verifier/get-auth-request-obj/${clientIdScheme}?draft=${draftVersion}`);
                setActualAuthorizationRequestObject(response.data);
            }
        } catch (error) {
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

    const handleByValueAuthRequest = async () => {
        if (isByValue)
            return;

        setIsByValue((prev) => !prev);
        setIsByReference(false);

        setErrorMessage(null)
        setQrData(null)
        setQrCodeData(null)
        setActualAuthorizationRequestObject(null)

        await fetchQrCodeData(state.name, REQUEST_MODES.BY_VALUE)
    }

    const handleByReferenceAuthRequest = async () => {
        if (isByReference)
            return;

        setIsByReference((prev) => !prev);
        setIsByValue(false);

        setErrorMessage(null)
        setQrData(null)
        setQrCodeData(null)
        setActualAuthorizationRequestObject(null)

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
            <div style={{padding: '20px 30px', color: font.primary}}>
                {header()}
                {requestToggle()}
                <Error message={errorMessage}/>
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
        <div style={{padding: '20px 30px', color: font.primary}}>
            {header()}
            <div style={{
                paddingLeft: 40,
                display: 'flex',
                flexDirection: 'row',
                font: font.primary,
                gap: 20,
                justifyItems: 'flex-start'
            }}>

                <div style={{flex: 1}}>
                    {requestToggle()}

                    <div style={{maxWidth: '50%'}}>
                        <div>
                            <a href={qrData} target="_blank" rel="noopener noreferrer">
                                <Image src={qrCodeData} alt={"QR code"}/>
                            </a>

                            {downloadQRCode()}

                            {
                                inputData && (
                                    <AccordionSection title={"Input Data"} value={JSON.stringify(inputData, null, 2)}/>
                                )
                            }

                            {qrData && (
                                <AccordionSection title={"Payload"} value={qrData}/>
                            )}

                            {actualAuthorizationRequestObject && (
                                <AccordionSection title={"Actual Authorization Request Object"}
                                                  value={actualAuthorizationRequestObject}/>
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
