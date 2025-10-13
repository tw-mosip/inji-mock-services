import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import cubeIcon from '../../assets/cube_icon.png';
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import Tooltip from '../../components/Tooltip';
export const ConsignmentDetails = () => {
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const [inVoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceNumErrorMsg, setInvoiceNumErrorMsg] = useState('');
    const [waybillNumber, setWaybillNumber] = useState('');
    const [waybillNumErrorMsg, setWaybillNumErrorMsg] = useState('');
    const [showWeightCertficateUploading, setShowWeightCertficateUploading] = useState(false);
    const [weightCertificateUploaded, setWeightCertificateUploaded] = useState(false);
    const [weightCertificateData, setWeightCertificateData] = useState(null);
    const [weightCertUploadErrorMsg, setWeightCertUploadErrorMsg] = useState('');
    const [showCustomDocumentUploading, setCustomDocumentUploading] = useState(false);
    const [customDocumentUploaded, setCustomDocumentUploaded] = useState(false);
    const [customDocumentData, setCustomDocumentData] = useState(null);
    const [customDocUploadErrorMsg, setCustomDocUploadErrorMsg] = useState('');
    const [consignmentDetailsStatus, setConsignmentDetailsStatus] = useState(false);
    const handleInVoiceNumber = (e) => {
        setInvoiceNumber(e.target.value);
    };
    const handleWaybillNumber = (e) => {
        setWaybillNumber(e.target.value);
    };
    const backToDriverProfile = () => {
        setConsignmentDetailsStatus(false);
        navigate('/requestTruckpassProcess/driverProfile');
    };
    const moveToVehicleDetails = () => {
        if (!inVoiceNumber.includes('-') || !waybillNumber.includes('-')) {
            if (!inVoiceNumber.includes('-')) {
                setInvoiceNumErrorMsg(t('consignmentDetails.invoiceNumErrorMsg'));
            }
            else {
                setInvoiceNumErrorMsg('');
            }
            if (!waybillNumber.includes('-')) {
                setWaybillNumErrorMsg(t('consignmentDetails.waybillNumErrorMsg'));
            }
            else {
                setWaybillNumErrorMsg('');
            }
            return;
        }
        ;
        const consignmentDetails = {
            inVoiceNumber: inVoiceNumber,
            waybillNumber: waybillNumber,
            weightCertificate: weightCertificateData || '',
            customDocument: customDocumentData || ''
        };
        localStorage.setItem('consignmentDetails', JSON.stringify(consignmentDetails));
        setConsignmentDetailsStatus(true);
        navigate('/requestTruckpassProcess/vehicleDetails');
    };
    return (_jsxs("div", { className: 'flex flex-col gap-y-10 bg-transparent font-inter', children: [_jsx(TruckpassRequestStepper, { searchDriverStatus: true, driverProfileStatus: true, consignmentDetailsStatus: consignmentDetailsStatus, vehicleDetailsStatus: false, journeyDetailsStatus: false, reviewAndSubmitStatus: false }), _jsxs("div", { className: 'bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4', children: [_jsxs("div", { className: 'flex space-x-3 items-center', children: [_jsx("img", { src: cubeIcon, className: 'h-4.5' }), _jsx("h1", { className: 'font-[600] text-[18px]', children: t('consignmentDetails.header') })] }), _jsxs("div", { className: 'flex flex-wrap justify-between', children: [_jsxs("div", { className: 'flex flex-col w-[570px] mb-6', children: [_jsxs("label", { className: 'flex items-center', children: [_jsxs("p", { className: 'text-sm text-[#414651]', children: [t('consignmentDetails.inVoiceNumber'), _jsx("span", { className: 'text-[#006DE7]', children: " *" }), " "] }), _jsx(Tooltip, { helpText: t('consignmentDetails.inVoiceNumTooltip') })] }), _jsx("input", { type: 'text', placeholder: t('consignmentDetails.inVoiceNumPlaceHolder'), value: inVoiceNumber, onChange: handleInVoiceNumber, className: `${!inVoiceNumber ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-2 mt-2 border ${invoiceNumErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none` }), invoiceNumErrorMsg && _jsx("p", { className: 'text-xs text-[#D92D20]', children: invoiceNumErrorMsg })] }), _jsxs("div", { className: 'flex flex-col w-[570px] mb-6', children: [_jsxs("label", { className: 'flex items-center', children: [_jsxs("p", { className: 'text-sm text-[#414651]', children: [t('consignmentDetails.waybillNumber'), _jsx("span", { className: 'text-[#006DE7]', children: " *" }), " "] }), _jsx(Tooltip, { helpText: t('consignmentDetails.waybillNumTooltip') })] }), _jsx("input", { type: 'text', placeholder: t('consignmentDetails.waybillNumPlaceHolder'), value: waybillNumber, onChange: handleWaybillNumber, className: `${!waybillNumber ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-2 mt-2 border ${waybillNumErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none` }), waybillNumErrorMsg && _jsx("p", { className: 'text-xs text-[#D92D20]', children: waybillNumErrorMsg })] }), _jsxs("div", { className: 'flex flex-col w-[570px]', children: [_jsxs("label", { className: 'flex gap-x-1 items-center mb-3', children: [_jsx("p", { className: 'text-sm text-[#414651]', children: t('consignmentDetails.weightCertificate') }), _jsx(Tooltip, { helpText: t('consignmentDetails.weightCertTooltip') })] }), _jsx(CertificateUploadingSection, { showUploadingBlock: showWeightCertficateUploading, setShowUploadingBlock: setShowWeightCertficateUploading, clickableText: t('consignmentDetails.uploadweightcertificate'), setFileUploaded: setWeightCertificateUploaded, setDataInFile: setWeightCertificateData, fileUploadErrorMsg: weightCertUploadErrorMsg, setFileUploadErrorMsg: setWeightCertUploadErrorMsg })] }), _jsxs("div", { className: 'flex flex-col w-[570px]', children: [_jsxs("label", { className: 'flex gap-x-1 items-center mb-3', children: [_jsx("p", { className: 'text-sm text-[#414651]', children: t('consignmentDetails.customsDocuments') }), _jsx(Tooltip, { helpText: t('consignmentDetails.customsDocTooltip') })] }), _jsx(CertificateUploadingSection, { showUploadingBlock: showCustomDocumentUploading, setShowUploadingBlock: setCustomDocumentUploading, clickableText: t('consignmentDetails.uploadCustomDocument'), setFileUploaded: setCustomDocumentUploaded, setDataInFile: setCustomDocumentData, fileUploadErrorMsg: customDocUploadErrorMsg, setFileUploadErrorMsg: setCustomDocUploadErrorMsg })] })] }), _jsxs("div", { className: "flex space-x-6 justify-end mb-6 mt-[15%]", children: [_jsx("button", { onClick: () => backToDriverProfile(), className: "bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer", children: t('commans.goBack') }), _jsx("button", { onClick: () => moveToVehicleDetails(), className: `${(inVoiceNumber && waybillNumber && weightCertificateUploaded && customDocumentUploaded) ? "bg-[#006DE7]" : "bg-[#C2C2C2]"} 
            w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer`, children: t('commans.continue') })] })] })] }));
};
