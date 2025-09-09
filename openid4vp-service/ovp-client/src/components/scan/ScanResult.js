import React, {useEffect, useState} from "react";
import axios from "axios";
import {BACKEND_URL} from "../../constants/mockui-constants";
import {prettyScanResult} from "../../utility/jsonHelper";
import {Section} from "../common/Section";
import {font, Palette} from "../../styles/palette";

// bundle scan result display with copy button +  auth result checker
export function ScanResult() {
    const [scanResult, setScanResult] = useState(null);

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
                }
            } catch (err) {
                console.error('Error checking scan result:', err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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
            <div
                style={{
                    background: scanResult?.error ? Palette.danger : Palette.success,
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
                <Section value={JSON.stringify(prettyScanResult(scanResult), null, 2)}/>
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