import React from 'react';
import {AccordionSection} from '../common/Section';
import {Image} from '../common/Image';
import {Code} from '../common/Code';
import Button from '../common/Button';
import DecoderEncoderView from '../DecoderEncoderView';
import DownloadQRButton from './DownloadQRButton';

const renderDecoderAccordion = (sectionTitle, value, actualSignedData) => (
    <AccordionSection title={sectionTitle}>
        <DecoderEncoderView input={value} actualSignedData={actualSignedData}/>
    </AccordionSection>
);

const QrCodeDisplay = ({
    qrData,
    qrCodeData,
    inputData,
    actualAuthorizationRequestObject,
    isRequestSigned,
    onDownloadDebugDetails,
    onOpenInjiWeb,
}) => (
    <div style={{maxWidth: '100%'}}>
        <a href={qrData} target="_blank" rel="noopener noreferrer">
            <Image src={qrCodeData} alt={'QR code'}/>
        </a>
        <div style={{display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center'}}>
            <DownloadQRButton qrCodeData={qrCodeData}/>
            <Button
                onClick={onDownloadDebugDetails}
                variant={'secondary'}
                style={{padding: '8px 16px', fontSize: '14px'}}
            >
                ⬇ Download Debug Details
            </Button>
            <Button
                onClick={onOpenInjiWeb}
                variant={'primary'}
                style={{padding: '8px 16px', fontSize: '14px'}}
            >
                Open InjiWeb
            </Button>
        </div>
        {inputData && (
            isRequestSigned
                ? renderDecoderAccordion('Input Data', inputData, inputData['request'])
                : <AccordionSection title={'Input Data'}><Code value={inputData}/></AccordionSection>
        )}
        {qrData && <AccordionSection title={'Payload'} value={qrData}/>}
        {actualAuthorizationRequestObject &&
            renderDecoderAccordion('Actual Authorization Request Object', actualAuthorizationRequestObject)}
    </div>
);

export default QrCodeDisplay;
