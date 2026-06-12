import React from 'react';
import PropTypes from 'prop-types';
import { Palette } from '../../styles/palette';

export default function DownloadQRButton({ qrCodeData }) {
    return (
        <a
            href={qrCodeData}
            download="qr-code.png"
            style={{
                display: 'inline-block',
                padding: '8px 16px',
                fontSize: '14px',
                borderRadius: '4px',
                border: `1px solid ${Palette.tertiaryText}`,
                background: Palette.success,
                textDecoration: 'none',
                color: Palette.textDark,
                cursor: 'pointer',
            }}
        >
            ⬇️ Download QR
        </a>
    );
}

DownloadQRButton.propTypes = {
    qrCodeData: PropTypes.string.isRequired,
};
