import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const QrScreen = () => {
    const { state } = useLocation();
    const [qrData, setQrData] = useState(null);
    const [qrCodeData, setQrCodeData] = useState(null);
    const [scanResult, setScanResult] = useState(null);

    // Fetch QR on mount
    useEffect(() => {
        const fetchQr = async () => {
            try {
                const response = await axios.get(`http://localhost:3000${state.endpoint}`);
                setQrCodeData(response.data.qrCodeData);
                setQrData(response.data.qrData);
            } catch (err) {
                console.error('Failed to fetch QR code:', err);
            }
        };

        fetchQr();
    }, [state]);

    // Poll for scan result
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get('http://localhost:3000/verifier/check-response');
                if (response.data.responseReceived) {
                    const scanRes = await axios.get('http://localhost:3000/verifier/vp-response');
                    setScanResult(scanRes.data);
                }
            } catch (err) {
                console.error('Error checking scan result:', err);
            }
        }, 3000); // poll every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex', padding: '40px' }}>
            {/* Left Section: QR and Payload */}
            <div style={{ flex: 1, marginRight: '40px', maxWidth: '50%' }}>
                <h2>QR Result</h2>

                {qrCodeData ? (
                    <img
                        src={qrCodeData}
                        alt="QR Code"
                        style={{ width: '300px', height: '300px', marginBottom: '20px' }}
                    />
                ) : (
                    <p>Loading...</p>
                )}

                {qrData && (
                    <>
                        <h4>Authorization Request Payload</h4>
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
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(qrData, null, 2)
                                    .replace(/"([^"]+)":/g, '$1:') // remove quotes from keys
                                    .replace(/"/g, ''),            // remove all remaining quotes
                            }}
                        />
                    </>
                )}
            </div>

            {/* Right Section: Scan Result */}
            <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '40px' }}>
                <h3>Scan Result Area</h3>
                {scanResult ? (
                    <div
                        style={{
                            background: '#e9ffe9',
                            padding: '16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                    >
                        {JSON.stringify(scanResult, null, 2)}
                    </div>
                ) : (
                    <p>Waiting for scan result...</p>
                )}
            </div>
        </div>
    );
};

export default QrScreen;
