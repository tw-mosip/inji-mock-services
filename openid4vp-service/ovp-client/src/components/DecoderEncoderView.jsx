import React, { useState } from 'react';
import Toggle from '../components/common/Toggle';
import { Code } from "./common/Code";
import { decodeJwt } from '../utility/util';

/**
 * DecoderEncoderView
 * Props:
 * - input: string (raw data)
 * - actualSignedData: string (optional, signed JWT) if not provided, input is used
 */
const DecoderEncoderView = ({ input, actualSignedData = null }) => {
    const [isDecoded, setIsDecoded] = useState(false);
    const [decodedJwt, setDecodedJwt] = useState('');

    const handleDecode = () => {
        const dataToDecode = actualSignedData || input;
        const decoded = decodeJwt(dataToDecode);
        setDecodedJwt(decoded !== null ? decoded.payload : 'Invalid JWT');
        setIsDecoded(true);
    };

    return (
        <div>
            {actualSignedData && <Toggle options={[
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
            ]} />}
            <div style={{ marginTop: 10 }}>
                {isDecoded ? <Code value={decodedJwt} /> : <Code value={input} />}
            </div>
        </div>
    );
};

export default DecoderEncoderView;

