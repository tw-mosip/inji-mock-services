import React from 'react';
export declare const CertificateUploadingSection: React.FC<CertificateUploadingSectionProps>;
interface CertificateUploadingSectionProps {
    driverRegistrationCpc?: boolean;
    vehicleRegistrationDocument?: boolean;
    showUploadingBlock: boolean;
    setShowUploadingBlock: (value: boolean) => void;
    clickableText: string;
    setFileUploaded: (value: boolean) => void;
    setDataInFile: (value: string) => void;
    fileUploadErrorMsg?: string;
    setFileUploadErrorMsg: (value: string) => void;
}
export {};
