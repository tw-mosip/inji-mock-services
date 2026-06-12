import React from 'react';
import PropTypes from 'prop-types';
import {Palette, font, spacing} from '../../styles/palette';

export default function QrScreenHeader({subtitle, onBack}) {
    return (
        <header style={{
            background: Palette.surface,
            borderBottom: `1px solid ${Palette.border}`,
            padding: `${spacing.lg}px ${spacing.xxl}px`,
            display: 'flex',
            alignItems: 'center',
            gap: spacing.md,
        }}>
            <button
                type="button"
                onClick={onBack}
                aria-label="Go back"
                style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: Palette.tertiaryText,
                    fontSize: '20px',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                ←
            </button>
            <div>
                <h1 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: 600,
                    color: Palette.headingText,
                    fontFamily: font.primary,
                }}>
                    Scan screen
                </h1>
                {subtitle && (
                    <span style={{
                        fontSize: '12px',
                        color: Palette.tertiaryText,
                        fontFamily: font.code,
                    }}>
                        {subtitle}
                    </span>
                )}
            </div>
        </header>
    );
}

QrScreenHeader.propTypes = {
    subtitle: PropTypes.string,
    onBack: PropTypes.func.isRequired,
};
