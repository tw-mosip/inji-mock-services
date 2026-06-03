import React from 'react';
import PropTypes from 'prop-types';

export default function QrScreenHeader({ title, onBack }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
            borderRadius: '4px',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginBottom: 20,
        }}>
            <div
                style={{ cursor: 'pointer', fontSize: 'xx-large', padding: '8px' }}
                onClick={onBack}
            >
                ←
            </div>
            <h1>Scan screen</h1>
            <h2>({title})</h2>
        </div>
    );
}

QrScreenHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
};
