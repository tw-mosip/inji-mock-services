import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {prettyScanResult} from "./jsonHelper";
import {BACKEND_URL} from "./mockui-constants";

const QrScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [qrData, setQrData] = useState(null);
    const [inputData, setInputData] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [copiedResult, setCopiedResult] = useState(false);
    const [showInputData, setShowInputData] = useState(false);


    useEffect(() => {
        const fetchQr = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}${state.endpoint}`);
                setQrCodeData(response.data.qrCodeData);
                setQrData(response.data.qrData);
                setInputData(response.data.inputData)
            } catch (err) {
                console.error('Failed to fetch QR code:', err);
            }
        };

        fetchQr();
    }, [state]);

    useEffect(() => {
        setScanResult(null);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/verifier/vp-result`);
                if (response.data && response.data !== false) {
                    setScanResult(response.data);
                }
            } catch (err) {
                console.error('Error checking scan result:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        document.title = 'Scan';
    }, []);

    const handleCopy = (textSetter, setToast) => {
        navigator.clipboard.writeText(textSetter);
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };

    return (
        <div style={{ padding: '40px' }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    marginBottom: '20px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    background: '#f8f8f8',
                    cursor: 'pointer',
                }}
            >
                ← Back
            </button>
            <h1 style={{ marginBottom: '20px' }}>Scan screen</h1>
            <div style={{ display: 'flex' }}>

                <div style={{flex: 1, marginRight: '40px', maxWidth: '50%'}}>


                    {qrCodeData && qrData ? (
                        <div>
                            <a href={qrData} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={qrCodeData}
                                    alt="QR Code"
                                    style={{
                                        width: '400px',
                                        height: '400px',
                                        marginBottom: '10px',
                                        cursor: 'pointer',
                                        display: 'block',
                                    }}
                                />
                            </a>

                            <a
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
                            </a>
                        </div>


                    ) : (
                        <p>Loading...</p>
                    )}
                    <h2>{state?.name || 'QR Code Image'}</h2>

                    <button
                        onClick={() => setShowInputData(!showInputData)}
                        style={{
                            marginTop: '10px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            background: '#eee',
                            cursor: 'pointer',
                        }}
                    >
                        {showInputData ? 'Hide Description' : 'Show Description'}
                    </button>

                    {showInputData && (
                        <div
                            style={{
                                background: '#f4f4f4',
                                padding: '16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                marginTop: '10px',
                                maxWidth: '600px',
                                overflowX: 'auto'
                            }}
                        >
                            <pre style={{ margin: 0 }}>
                              {JSON.stringify(inputData, null, 2)}
                            </pre>
                        </div>
                    )}


                    {qrData && (
                        <div style={{position: 'relative', marginTop: '16px'}}>
                            <h4 style={{marginBottom: '8px'}}>Payload</h4>

                            {copied && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '80px',
                                        top: '10px',
                                        padding: '6px 12px',
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    Copied!
                                </div>
                            )}

                            <button
                                onClick={() =>
                                    handleCopy(
                                        typeof qrData === 'string' ? qrData : JSON.stringify(qrData, null, 2),
                                        setCopied
                                    )
                                }
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    backgroundColor: '#eee',
                                    cursor: 'pointer',
                                }}
                            >
                                Copy
                            </button>

                            <div
                                style={{
                                    background: '#f4f4f4',
                                    padding: '16px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontFamily: 'monospace',
                                    maxHeight: '400px',
                                    overflow: 'auto',
                                    maxWidth: '100%',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                                    {typeof qrData === 'string' ? qrData : JSON.stringify(qrData, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>

                <div style={{flex: 1, marginLeft: '40px'}}>
                <h2>Scan Result</h2>
                    {scanResult ? (
                        <div style={{ position: 'relative' }}>
                            {copiedResult && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: '80px',
                                        top: '10px',
                                        padding: '6px 12px',
                                        backgroundColor: '#4caf50',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                        zIndex: 1,
                                    }}
                                >
                                    Copied!
                                </div>
                            )}

                            <div
                                style={{
                                    position: 'relative',
                                    background: scanResult?.error ? '#ffe6e6' : '#e9ffe9',
                                    padding: '16px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontFamily: 'monospace',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    width: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                <button
                                    onClick={() =>
                                        handleCopy(
                                            JSON.stringify(prettyScanResult(scanResult), null, 2),
                                            setCopiedResult
                                        )
                                    }
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        padding: '4px 8px',
                                        fontSize: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        backgroundColor: '#eee',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Copy
                                </button>
                                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {JSON.stringify(prettyScanResult(scanResult), null, 2)}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                background: '#fffacc',
                                padding: '16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'monospace',
                            }}
                        >
                            Waiting for scan result...
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default QrScreen;
