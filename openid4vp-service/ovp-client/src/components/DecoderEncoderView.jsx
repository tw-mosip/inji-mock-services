import React, { useState } from 'react';
import Toggle from '../components/common/Toggle';
import {Code} from "./common/Code";

/**
 * DecoderEncoderView
 * Props:
 * - input: string (raw data)
 * - actualSignedData: string (optional, signed JWT) if not provided, input is used
 */
const DecoderEncoderView = ({ input, actualSignedData = null }) => {
    const [isDecoded, setIsDecoded] = useState(false);
    const [decodedJwt, setDecodedJwt] = useState('');

    // Decodes JWT (simple base64 decode, customize as needed)
    const decodeJwt = (jwt) => {
        try {
            const parts = jwt.split('.');
            if (parts.length < 2) return jwt;
            const payload = parts[1];
            return JSON.stringify(JSON.parse(atob(payload)), null, 2);
        } catch (e) {
            return 'Invalid JWT';
        }
    };

    const handleDecode = () => {
        const dataToDecode = actualSignedData || input;
        setDecodedJwt(decodeJwt(dataToDecode));
        setIsDecoded(true);
    };

    return (
        <div>
            <Toggle options={[
                {
                    name: 'Decoded',
                    selected: isDecoded,
                    onChange: handleDecode
                },
                {
                    name: 'Encoded',
                    selected: !isDecoded,
                    onChange: () => setIsDecoded(false)
                }
            ]} />
            <div style={{ marginTop: 10 }}>
                {isDecoded ? <Code value={decodedJwt} /> : <Code value={input} />}
            </div>
        </div>
    );
};

export default DecoderEncoderView;

