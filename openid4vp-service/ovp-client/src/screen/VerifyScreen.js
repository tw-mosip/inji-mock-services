import React, { useMemo, useState } from "react";
import Button from "../components/common/Button";
import { Code } from "../components/common/Code";
import ErrorMessage from "../components/common/Error";
import { Palette, font } from "../styles/palette";

const decodeBase64Url = (value) => {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(padLength);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
};

const parseJwtPayload = (compactJws) => {
    const parts = compactJws.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid compact JWS format");
    }
    const payload = decodeBase64Url(parts[1]);
    const payloadText = new TextDecoder().decode(payload);
    return JSON.parse(payloadText);
};

const parseSdJwtStructure = (credential) => {
    const parts = credential.split("~").filter(Boolean);
    if (parts.length < 2) {
        throw new Error("Expected SD-JWT with KB-JWT (using '~' separators)");
    }

    const kbJwt = parts[parts.length - 1];
    const kbJwtSegments = kbJwt.split(".");
    if (kbJwtSegments.length !== 3) {
        throw new Error("Invalid KB-JWT in SD-JWT structure");
    }

    return { kbJwt };
};

const encodeBase64Url = (bytes) => {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const decodeBase58 = (input) => {
    const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const base = 58;
    const bytes = [0];

    for (let i = 0; i < input.length; i += 1) {
        const char = input[i];
        const value = alphabet.indexOf(char);
        if (value < 0) {
            throw new Error("Invalid base58 character in did:key");
        }

        let carry = value;
        for (let j = 0; j < bytes.length; j += 1) {
            const x = bytes[j] * base + carry;
            bytes[j] = x & 0xff;
            carry = x >> 8;
        }

        while (carry > 0) {
            bytes.push(carry & 0xff);
            carry >>= 8;
        }
    }

    for (let i = 0; i < input.length && input[i] === "1"; i += 1) {
        bytes.push(0);
    }

    return new Uint8Array(bytes.reverse());
};

const resolveJwkFromDidKid = (kid) => {
    if (!kid || typeof kid !== "string") {
        throw new Error("cnf.kid must be a string");
    }

    if (kid.startsWith("did:jwk:")) {
        const encoded = kid.slice("did:jwk:".length);
        const jwkJson = new TextDecoder().decode(decodeBase64Url(encoded));
        return JSON.parse(jwkJson);
    }

    if (kid.startsWith("did:key:")) {
        const methodSpecificId = kid.slice("did:key:".length);
        if (!methodSpecificId.startsWith("z")) {
            throw new Error("Unsupported did:key encoding; expected multibase base58btc (z...)");
        }

        const multicodec = decodeBase58(methodSpecificId.slice(1));

        // Ed25519 public key multicodec prefix: 0xED 0x01
        if (multicodec.length === 34 && multicodec[0] === 0xed && multicodec[1] === 0x01) {
            const publicKey = multicodec.slice(2);
            return {
                kty: "OKP",
                crv: "Ed25519",
                x: encodeBase64Url(publicKey),
            };
        }

        throw new Error("Unsupported did:key codec. Currently only Ed25519 is supported");
    }

    throw new Error("Unsupported cnf.kid format. Supported: did:jwk, did:key");
};

const getWebCryptoAlgorithm = (jwk) => {
    if (jwk.kty === "EC") {
        const map = {
            "P-256": { name: "ECDSA", namedCurve: "P-256", hash: "SHA-256" },
            "P-384": { name: "ECDSA", namedCurve: "P-384", hash: "SHA-384" },
            "P-521": { name: "ECDSA", namedCurve: "P-521", hash: "SHA-512" },
        };
        return map[jwk.crv];
    }

    if (jwk.kty === "RSA") {
        return { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" };
    }

    if (jwk.kty === "OKP" && jwk.crv === "Ed25519") {
        return { name: "Ed25519" };
    }

    throw new Error(`Unsupported key type: ${jwk.kty}`);
};

const verifyKbJwtWithCnf = async (kbJwt, cnf) => {
    if (!cnf?.jwk && !cnf?.kid) {
        throw new Error("cnf.jwk or cnf.kid is required in KB-JWT payload for verification");
    }

    const parts = kbJwt.split(".");
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const jwk = cnf.jwk || resolveJwkFromDidKid(cnf.kid);
    const algo = getWebCryptoAlgorithm(jwk);

    const importParams = jwk.kty === "EC"
        ? { name: algo.name, namedCurve: algo.namedCurve }
        : (jwk.kty === "RSA"
            ? { name: algo.name, hash: algo.hash }
            : { name: algo.name });

    const key = await window.crypto.subtle.importKey(
        "jwk",
        jwk,
        importParams,
        false,
        ["verify"]
    );

    const signature = decodeBase64Url(encodedSignature);
    const data = new TextEncoder().encode(signingInput);

    const verifyParams = jwk.kty === "EC"
        ? { name: "ECDSA", hash: { name: algo.hash } }
        : { name: algo.name };

    const verified = await window.crypto.subtle.verify(
        verifyParams,
        key,
        signature,
        data
    );

    return verified;
};

const CREDENTIAL_FORMATS = {
    LDP_VP: "ldp_vp",
    LDP_VC: "ldp_vc",
    SD_JWT: "sd_jwt",
    MSO_MDOC: "mso_mdoc",
};

const VerifyScreen = () => {
    const [credentialFormat, setCredentialFormat] = useState(CREDENTIAL_FORMATS.SD_JWT);
    const [credentialInput, setCredentialInput] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);
    const [error, setError] = useState("");

    const canVerify = useMemo(() => credentialInput.trim().length > 0 && !isVerifying, [credentialInput, isVerifying]);

    const verifySdJwt = async (normalizedCredential) => {
        const { kbJwt } = parseSdJwtStructure(normalizedCredential);
        const kbPayload = parseJwtPayload(kbJwt);
        const isValid = await verifyKbJwtWithCnf(kbJwt, kbPayload.cnf);

        return {
            format: CREDENTIAL_FORMATS.SD_JWT,
            supportedType: "sd_jwt",
            kbJwt,
            kbJwtPayload: kbPayload,
            signatureVerified: isValid,
        };
    };

    const verifyLdpWithUniverifier = async (normalizedCredential) => {
        const url = "https://univerifier.io/1.0/verify";
        const body = {
            options: {
                returnMetadata: true,
                credentialFormatOptions: {
                    documentLoaderEnableHttps: true,
                },
            },
            verifiableCredentialOrVerifiablePresentation: normalizedCredential,
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const contentType = response.headers.get("content-type") || "";
        const payload = contentType.includes("application/json") ? await response.json() : await response.text();

        if (!response.ok) {
            const message = typeof payload === "string" ? payload : JSON.stringify(payload);
            throw new Error(`Univerifier verify API failed (${response.status}): ${message}`);
        }

        return {
            format: credentialFormat,
            univerifierResponse: payload,
        };
    };

    const startVerification = async () => {
        setIsVerifying(true);
        setError("");
        setVerificationResult(null);

        try {
            const normalizedCredential = credentialInput.trim();

            if (credentialFormat === CREDENTIAL_FORMATS.SD_JWT) {
                const result = await verifySdJwt(normalizedCredential);
                setVerificationResult(result);
                if (!result.signatureVerified) {
                    setError("KB-JWT signature verification failed against cnf.jwk/cnf.kid");
                }
                return;
            }

            if (credentialFormat === CREDENTIAL_FORMATS.LDP_VP || credentialFormat === CREDENTIAL_FORMATS.LDP_VC) {
                const result = await verifyLdpWithUniverifier(normalizedCredential);
                setVerificationResult(result);
                return;
            }

            if (credentialFormat === CREDENTIAL_FORMATS.MSO_MDOC) {
                throw new Error("mso_mdoc verification is not implemented yet");
            }

            throw new Error(`Unsupported credential format: ${credentialFormat}`);
        } catch (e) {
            setError(e?.message || "Verification failed");
        } finally {
            setIsVerifying(false);
        }
    };

    const noteText = useMemo(() => {
        if (credentialFormat === CREDENTIAL_FORMATS.SD_JWT) {
            return (
                <>
                    Note: This verifier currently supports only <code>sd_jwt</code> for local verification.
                </>
            );
        }
        if (credentialFormat === CREDENTIAL_FORMATS.LDP_VP || credentialFormat === CREDENTIAL_FORMATS.LDP_VC) {
            return (
                <>
                    Note: <code>{credentialFormat}</code> is verified via Univerifier (<code>https://univerifier.io/1.0/verify</code>).
                </>
            );
        }
        return (
            <>
                Note: <code>{credentialFormat}</code> is not implemented yet.
            </>
        );
    }, [credentialFormat]);

    return (
        <div className="verify-screen" style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
            <h1 style={{ marginBottom: "8px" }}>Credential Verification</h1>
            <p style={{ marginTop: 0, color: Palette.secondaryText, fontFamily: font.primary }}>{noteText}</p>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    alignItems: "start",
                }}
            >
                {/* Left: Input */}
                <div
                    style={{
                        border: `1px solid ${Palette.surfaceDark}`,
                        borderRadius: "12px",
                        padding: "16px",
                        background: Palette.surface,
                    }}
                >
                    <label style={{ display: "block", marginBottom: "8px", color: Palette.secondaryText, fontFamily: font.primary }}>
                        Credential format
                    </label>
                    <select
                        value={credentialFormat}
                        onChange={(e) => setCredentialFormat(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            border: `1px solid ${Palette.surfaceDark}`,
                            background: Palette.surface,
                            color: Palette.secondaryText,
                            fontFamily: font.primary,
                            marginBottom: "12px",
                        }}
                    >
                        <option value={CREDENTIAL_FORMATS.LDP_VP}>ldp_vp</option>
                        <option value={CREDENTIAL_FORMATS.LDP_VC}>ldp_vc</option>
                        <option value={CREDENTIAL_FORMATS.SD_JWT}>sd_jwt</option>
                        <option value={CREDENTIAL_FORMATS.MSO_MDOC}>mso_mdoc</option>
                    </select>

                    <textarea
                        value={credentialInput}
                        onChange={(event) => setCredentialInput(event.target.value)}
                        placeholder={
                            credentialFormat === CREDENTIAL_FORMATS.SD_JWT
                                ? "Paste SD-JWT credential here"
                                : "Paste credential / presentation here"
                        }
                        rows={14}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            border: `1px solid ${Palette.surfaceDark}`,
                            padding: "12px",
                            fontFamily: "Courier New, monospace",
                            boxSizing: "border-box",
                            marginBottom: "12px",
                            background: Palette.surface,
                            color: Palette.secondaryText,
                        }}
                    />

                    <Button onClick={startVerification} style={{ minWidth: "180px" }}>
                        {isVerifying ? "Verifying..." : "Start Verification"}
                    </Button>

                    {!canVerify && !isVerifying && credentialInput.trim().length === 0 && (
                        <p style={{ marginTop: "8px", color: Palette.tertiaryText, fontFamily: font.primary }}>
                            Enter a credential to enable verification.
                        </p>
                    )}

                    {error && (
                        <div style={{ marginTop: "16px" }}>
                            <ErrorMessage title="Verification failed" message={error} compact />
                        </div>
                    )}
                </div>

                {/* Right: Result */}
                <div
                    style={{
                        border: `1px solid ${Palette.surfaceDark}`,
                        borderRadius: "12px",
                        padding: "16px",
                        background: Palette.surface,
                        minHeight: "220px",
                    }}
                >
                    <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Verification Result</h3>

                    {!verificationResult && !error && (
                        <p style={{ marginTop: 0, color: Palette.tertiaryText, fontFamily: font.primary }}>
                            Results will appear here after verification.
                        </p>
                    )}

                    {verificationResult && (
                        <Code
                            value={
                                credentialFormat === CREDENTIAL_FORMATS.LDP_VP || credentialFormat === CREDENTIAL_FORMATS.LDP_VC
                                    ? verificationResult.univerifierResponse
                                    : {
                                        supportedType: verificationResult.supportedType,
                                        signatureVerified: verificationResult.signatureVerified,
                                        kbJwtPayload: verificationResult.kbJwtPayload,
                                    }
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyScreen;

