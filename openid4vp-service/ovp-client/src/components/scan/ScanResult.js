import React, {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_URL} from "../../constants/mockui-constants";
import {prettyScanResult} from "../../utility/jsonHelper";
import {Section} from "../common/Section";
import Button from "../common/Button";
import Toggle from "../common/Toggle";
import {font, Palette, spacing, cardStyles} from "../../styles/palette";

// bundle scan result display with copy button +  auth result checker
export function ScanResult() {
    const [scanResult, setScanResult] = useState(null);
    const [decryptedResult, setDecryptedResult] = useState(null);
    const [viewMode, setViewMode] = useState('encoded');
    const [isDecoded, setIsDecoded] = useState(false);
    const [isDecrypting, setIsDecrypting] = useState(false);
    const [decryptError, setDecryptError] = useState(null);

    useEffect(() => {
        setScanResult(null);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/verifier/vp-result`, {
                    headers: {
                        'ngrok-skip-browser-warning': 'true'
                    }
                });
                if (response.data && response.data !== false) {
                    setScanResult(response.data);
                    setDecryptedResult(null);
                    setDecryptError(null);
                    setViewMode('encoded');
                }
            } catch (err) {
                console.error('Error checking scan result:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const handleDecrypt = async () => {
        if (!scanResult) return;

        setIsDecrypting(true);
        setDecryptError(null);

        try {
            // Enhanced JWE token extraction with better debugging
            let jweToken = null;

            if (typeof scanResult === 'string') {
                // Direct string case
                jweToken = scanResult;
                console.log('Extracted token from direct string');
            } else if (scanResult && typeof scanResult === 'object') {
                // Object case - try multiple extraction methods

                // Try common JWT/JWE fields first
                jweToken = scanResult.response; // Keep the response field as one option

                if (!jweToken) {
                    // Try to find any string value that looks like a JWE token (has dots)
                    const allValues = Object.values(scanResult);

                    jweToken = allValues.find(value =>
                        typeof value === 'string' &&
                        value.includes('.') &&
                        value.length > 50 // Reasonable minimum length for JWE
                    );

                    if (jweToken) {
                        console.log('Found potential JWE token in object values');
                    }
                }

                // If still not found, try nested objects
                if (!jweToken) {
                    for (const [key, value] of Object.entries(scanResult)) {
                        if (value && typeof value === 'object') {
                            const nestedToken = value.vp || value.presentation || value.vp_token || value.token || value.response;
                            if (nestedToken && typeof nestedToken === 'string') {
                                jweToken = nestedToken;
                                break;
                            }
                        }
                    }
                }
            }

            if (!jweToken || typeof jweToken !== 'string') {
                throw new Error(`No JWE token found in scan result. Available keys: ${scanResult && typeof scanResult === 'object' ? Object.keys(scanResult).join(', ') : 'N/A'}`);
            }

            // Additional validation to ensure we have a valid token
            if (jweToken.trim().length === 0) {
                throw new Error('JWE token is empty string');
            }

            // Check if it looks like a JWE token (5 parts)
            const parts = jweToken.split('.');

            if (parts.length !== 5) {
                throw new Error(`Invalid JWE format. Expected 5 parts separated by dots, got ${parts.length}. Token preview: ${jweToken.substring(0, 100)}...`);
            }

            // Call backend to decrypt the JWE
            const response = await axios.post(`${BACKEND_URL}/verifier/decrypt-jwe`,
                { jweToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true'
                    }
                }
            );

            if (response.data.success) {
                setDecryptedResult(JSON.parse(JSON.stringify(response.data.decryptedPayload)));
                console.log('JWE decrypted successfully');
            } else {
                throw new Error(response.data.error || 'Decryption failed');
            }
            setIsDecoded(true)
        } catch (error) {
            console.error('Decryption error:', error);
            let errorMessage = error.message || 'Unknown error occurred';

            // Handle axios error response
            if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error;
            }

            setDecryptError(errorMessage);
        } finally {
            setIsDecrypting(false);
        }
    };

    const showDecoded = isDecoded && !!decryptedResult;
    const displayedPayload = showDecoded ? decryptedResult : scanResult;

    function isEncodedData() {
        let vpResponse = scanResult["response"]
        return typeof vpResponse === 'string' && vpResponse.includes('.') && vpResponse.split('.').length === 5;
    }

    const howItWorksSteps = [
        'Scan the QR code with your wallet app',
        'Approve the presentation request',
        'Result appears here automatically',
    ];

    return (
        <div style={{
            ...cardStyles.base,
            ...cardStyles.padding,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
        }}>
            <h2 style={{...cardStyles.sectionTitle, marginBottom: spacing.lg}}>
                Scan Result
            </h2>

            {scanResult ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: spacing.md}}>
                    <div style={{fontSize: '14px', color: Palette.tertiaryText}}>
                        Timestamp: {new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata', hour12: true})}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md}}>
                        <div style={{display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: spacing.sm}}>
                            {isEncodedData() && (
                                <Toggle options={[
                                    {name: 'Decoded', selected: isDecoded, onChange: handleDecrypt},
                                    {name: 'Encoded', selected: !isDecoded, onChange: () => setIsDecoded(false)},
                                ]}/>
                            )}
                            {decryptedResult && (
                                <div style={{
                                    background: Palette.success,
                                    padding: `${spacing.md}px ${spacing.lg}px`,
                                    borderRadius: '6px',
                                    color: Palette.invertedText,
                                    fontSize: '14px',
                                }}>
                                    ✓ JWE successfully decrypted {viewMode === 'decoded' ? '(showing decoded payload)' : ''}
                                </div>
                            )}
                            {decryptError && (
                                <div style={{
                                    background: Palette.danger,
                                    padding: `${spacing.md}px ${spacing.lg}px`,
                                    borderRadius: '6px',
                                    color: Palette.invertedText,
                                    fontSize: '14px',
                                }}>
                                    ✗ Decryption error: {decryptError}
                                </div>
                            )}
                        </div>
                        <Button variant={'tertiary'} onClick={() => setScanResult(null)}>
                            Clear
                        </Button>
                    </div>
                    <div style={{
                        background: displayedPayload?.error ? Palette.danger : Palette.success,
                        padding: spacing.lg,
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontFamily: font.code,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        width: '100%',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                    }}>
                        <Section value={JSON.stringify(prettyScanResult(displayedPayload), null, 2)}/>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{
                        background: Palette.warning,
                        color: Palette.invertedText,
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: 500,
                        padding: `${spacing.sm + 2}px ${spacing.lg}px`,
                        borderRadius: '8px',
                        marginBottom: spacing.xxl,
                    }}>
                        Waiting for scan result...
                    </div>

                    <div style={{
                        marginTop: 'auto',
                        borderTop: `1px solid ${Palette.borderLight}`,
                        paddingTop: spacing.lg,
                    }}>
                        <p style={{...cardStyles.sectionTitle, marginBottom: spacing.md}}>
                            How it works
                        </p>
                        <div style={{display: 'flex', flexDirection: 'column', gap: spacing.sm + 2}}>
                            {howItWorksSteps.map((label, i) => (
                                <div key={label} style={{display: 'flex', alignItems: 'center', gap: spacing.md}}>
                                    <div style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: '50%',
                                        background: Palette.mutedSurface,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        fontSize: '12px',
                                        color: Palette.tertiaryText,
                                    }}>
                                        {i + 1}
                                    </div>
                                    <span style={{fontSize: '12px', color: Palette.tertiaryText}}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: `${spacing.xxxl + 8}px 0`,
                        gap: spacing.md,
                        flex: 1,
                    }}>
                        <div style={{position: 'relative'}}>
                            <div style={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: Palette.mutedSurface,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                color: Palette.tertiaryText,
                            }}>
                                ▦
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: -4,
                                right: -4,
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: Palette.mutedSurface,
                                border: `2px solid ${Palette.surface}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '10px',
                                color: Palette.tertiaryText,
                            }}>
                                ◷
                            </div>
                        </div>

                        <div style={{textAlign: 'center'}}>
                            <p style={{
                                margin: `0 0 ${spacing.xs}px`,
                                fontSize: '14px',
                                fontWeight: 500,
                                color: Palette.tertiaryText,
                            }}>
                                Awaiting wallet response
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '12px',
                                color: Palette.disabledText,
                            }}>
                                Point your wallet app at the QR code to begin
                            </p>
                        </div>

                        <div style={{display: 'flex', gap: 6, marginTop: spacing.xs}}>
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        background: Palette.disabledText,
                                        animation: `qrScanPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <style>{`
                        @keyframes qrScanPulse {
                            0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                            40% { opacity: 1; transform: scale(1); }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
}