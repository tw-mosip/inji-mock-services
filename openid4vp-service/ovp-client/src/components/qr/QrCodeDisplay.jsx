import React from 'react';
import Button from '../common/Button';
import DataAccordionSection from '../common/DataAccordionSection';
import DownloadQRButton from './DownloadQRButton';
import { Palette, spacing, cardStyles } from '../../styles/palette';
import { isMobileLayout } from '../../utility/util';

export function QrDataSections({ qrData, inputData, actualAuthorizationRequestObject }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
            {inputData && (
                <DataAccordionSection title="QR Data (Decoded)" value={inputData} actualSignedData={inputData["request"]}/>
            )}
            {qrData && (
                <DataAccordionSection title="QR Data" value={qrData} actualSignedData={undefined}/>
            )}
            {actualAuthorizationRequestObject && (
                <DataAccordionSection
                    title="Actual Authorization Request Object"
                    value={actualAuthorizationRequestObject}
                    actualSignedData={actualAuthorizationRequestObject}
                />
            )}
        </div>
    );
}

export function QrCodeCard({ qrData, qrCodeData, onDownloadDebugDetails, onOpenInjiWeb, qrSize }) {
    return (
        <div style={{ ...cardStyles.base, ...cardStyles.padding }}>
            <h2 style={{ ...cardStyles.sectionTitle, marginBottom: spacing.lg }}>
                Presentation QR Code
            </h2>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing.lg }}>
                <a href={qrData} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <div style={{
                        border: `1px solid ${Palette.border}`,
                        borderRadius: '8px',
                        padding: spacing.sm,
                    }}>
                        <img
                            src={qrCodeData}
                            alt="QR code"
                            style={{
                                display: 'block',
                                width: isMobileLayout() ? '100%' : 'auto',
                                height: isMobileLayout() ? 'auto' : 320,
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                </a>
            </div>
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                <DownloadQRButton qrCodeData={qrCodeData} />
                <Button
                    onClick={onDownloadDebugDetails}
                    variant={'secondary'}
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                    🔧 Download Debug Details
                </Button>
                <Button
                    onClick={onOpenInjiWeb}
                    variant={'secondary'}
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                >
                    🌐 Open InjiWeb
                </Button>
            </div>
            {/* <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap', color: Palette.disabledText, justifyContent: 'center', padding: 10 }}>QR Size: {qrSize} bytes</div> */}
        </div>
    );
}

const QrCodeDisplay = (props) => (
    <>
        <QrCodeCard
            qrData={props.qrData}
            qrCodeData={props.qrCodeData}
            onDownloadDebugDetails={props.onDownloadDebugDetails}
            onOpenInjiWeb={props.onOpenInjiWeb}
            qrSize={props.qrSize}
        />
        <QrDataSections
            qrData={props.qrData}
            inputData={props.inputData}
            actualAuthorizationRequestObject={props.actualAuthorizationRequestObject}
        />
    </>
);

export default QrCodeDisplay;
