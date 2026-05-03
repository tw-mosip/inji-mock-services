import React, {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_URL} from "../../constants/mockui-constants";
import {prettyScanResult} from "../../utility/jsonHelper";
import {Section} from "../common/Section";
import Button from "../common/Button";
import Toggle from "../common/Toggle";
import {font, Palette} from "../../styles/palette";

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
            console.log('Scan result type:', typeof scanResult);
            console.log('Scan result content:', scanResult);

            // Enhanced JWE token extraction with better debugging
            let jweToken = null;

            if (typeof scanResult === 'string') {
                // Direct string case
                jweToken = scanResult;
                console.log('Extracted token from direct string');
            } else if (scanResult && typeof scanResult === 'object') {
                // Object case - try multiple extraction methods
                console.log('Scan result keys:', Object.keys(scanResult));

                // Try common JWT/JWE fields first
                jweToken = scanResult.response; // Keep the response field as one option

                if (!jweToken) {
                    // Try to find any string value that looks like a JWE token (has dots)
                    const allValues = Object.values(scanResult);
                    console.log('All values in scan result:', allValues);

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
                                console.log(`Found token in nested object: ${key}`);
                                break;
                            }
                        }
                    }
                }
            }

            console.log('Extracted token:', jweToken ? `${jweToken.substring(0, 50)}...` : 'null');

            if (!jweToken || typeof jweToken !== 'string') {
                throw new Error(`No JWE token found in scan result. Available keys: ${scanResult && typeof scanResult === 'object' ? Object.keys(scanResult).join(', ') : 'N/A'}`);
            }

            // Additional validation to ensure we have a valid token
            if (jweToken.trim().length === 0) {
                throw new Error('JWE token is empty string');
            }

            // Check if it looks like a JWE token (5 parts)
            const parts = jweToken.split('.');
            console.log(`Token has ${parts.length} parts`);

            if (parts.length !== 5) {
                throw new Error(`Invalid JWE format. Expected 5 parts separated by dots, got ${parts.length}. Token preview: ${jweToken.substring(0, 100)}...`);
            }

            console.log('Attempting to decrypt JWE token...');
            console.log('Request body to be sent:', JSON.stringify({ jweToken }, null, 2));

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
                console.log('JWE decrypted successfully:', response.data.decryptedPayload);
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
        return typeof scanResult === 'string' && scanResult.includes('.') && scanResult.split('.').length === 5;
    }

    return <div style={{flex: 1}}>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
        }}>
            <h2 style={{margin: 0}}>Scan Result</h2>
        </div>

        {scanResult ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'}}>
                    <div style={{display: 'flex', justifyContent: 'flex-start'}}>
                        {
                          isEncodedData() && (
                            <Toggle options={[
                                {
                                    name: 'Decoded',
                                    selected: isDecoded,
                                    onChange: handleDecrypt
                                },
                                {
                                    name: 'Encoded',
                                    selected: !isDecoded,
                                    onChange: () => setIsDecoded(false)
                                }
                            ]}/>
                          )
                        }
                        {decryptedResult && (
                          <div style={{
                              background: Palette.success,
                              padding: '12px 16px',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '14px'
                          }}>
                              ✓ JWE successfully decrypted {viewMode === 'decoded' ? '(showing decoded payload)' : ''}
                          </div>
                        )}

                        {decryptError && (
                          <div style={{
                              background: Palette.danger,
                              padding: '12px 16px',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '14px'
                          }}>
                              ✗ Decryption error: {decryptError}
                          </div>
                        )}
                    </div>
                    <Button
                      variant={"tertiary"}
                      onClick={() => setScanResult(null)}
                    >
                        Clear
                    </Button>
                </div>
                <div
                    style={{
                        background: displayedPayload?.error ? Palette.danger : Palette.success,
                        padding: "16px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontFamily: "monospace",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        width: "100%",
                        overflow: "hidden",
                    }}
                >
                    <Section value={JSON.stringify(prettyScanResult(displayedPayload), null, 2)}/>
                </div>
            </div>
        ) : (
            <div
                style={{
                    background: Palette.warning,
                    color: Palette.invertedText,
                    padding: "16px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontFamily: font.primary,
                    textAlign: "center",
                    width: "100%",
                    boxSizing: "border-box"
                }}
            >
                Waiting for scan result...
            </div>
        )}
    </div>;
}