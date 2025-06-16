import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {BACKEND_PORT} from "./Home";

const QrScreen = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [qrData, setQrData] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        const fetchQr = async () => {
            try {
                const response = await axios.get(`http://localhost:${BACKEND_PORT}${state.endpoint}`);
                setQrCodeData(response.data.qrCodeData);
                setQrData(response.data.qrData);
            } catch (err) {
                console.error('Failed to fetch QR code:', err);
            }
        };

        fetchQr();
    }, [state]);


    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`http://localhost:${BACKEND_PORT}/verifier/vp-result`);
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

    return (
        <div style={{padding: '40px'}}>


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
            <h1 style={{marginBottom: '20px'}}>Scan screen</h1>
            <div style={{display: 'flex'}}>

                <div style={{flex: 1, marginRight: '40px', maxWidth: '50%'}}>
                    <h2>QR Code Image</h2>

                    {qrCodeData && qrData ? (
                        <a href={qrData} style={{display: 'inline-block'}}>
                            <img
                                src={qrCodeData}
                                alt="QR Code"
                                style={{
                                    width: '400px',
                                    height: '400px',
                                    marginBottom: '20px',
                                    cursor: 'pointer',
                                }}
                            />
                        </a>
                    ) : (
                        <p>Loading...</p>
                    )}

                    {qrData && (
                        <>
                            <h4>Payload</h4>
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
                                    wordBreak: 'break-word',
                                }}
                            >
                                <pre>{JSON.stringify(qrData, null, 2)}</pre>
                            </div>
                        </>
                    )}
                </div>


                <div style={{flex: 1, marginLeft: '40px'}}>
                    <h2>Scan Result</h2>
                    {scanResult ? (
                        <div
                            style={{
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
                            <pre style={{margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>
                                {JSON.stringify(scanResult, null, 2)}
                            </pre>
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
