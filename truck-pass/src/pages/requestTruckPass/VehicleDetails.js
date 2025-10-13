import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import vehicleIcon from '../../assets/truck_icon.png';
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import { DropDownSelection } from '../../components/DropDownSelection';
import Tooltip from '../../components/Tooltip';
export const VehicleDetails = () => {
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const [selectedVehicleType, setSelectedVehicleType] = useState(null);
    const [selectedAxleSize, setSelectedAxleSize] = useState(null);
    const [truckLicensePlate, setTruckLicensePlate] = useState('');
    const [truckLicensePlateErrorMsg] = useState('');
    const [vehicleRegDocumentUploading, setVehicleRegDocumentUploading] = useState(false);
    const [vehicleRegDocumentUploaded, setVehicleRegDocumentUploaded] = useState(false);
    const [vehicleRegDocumentData, setVehicleRegDocumentData] = useState(null);
    const [vehicleRegDocUploadErrorMsg, setvehicleRegDocErrorMsg] = useState('');
    const [vehicleDetailsStatus, setVehicleDetailsStatus] = useState(false);
    const vehicleTypes = [
        { id: 0, type: 'Light Commercial Vehicle' },
        { id: 1, type: 'Medium Commercial Vehicle' },
        { id: 2, type: 'Heavy Commercial Vehicle' },
        { id: 3, type: 'Trailer' },
        { id: 4, type: 'Container Truck' }
    ];
    const axleSizes = [
        { id: 0, size: '2 axle', },
        { id: 1, size: '3 axle' },
        { id: 2, size: '4 axle' },
        { id: 3, size: '5 axle' },
        { id: 4, size: '6+ axle' }
    ];
    const handleTruckLicensePlate = (e) => {
        setTruckLicensePlate(e.target.value);
    };
    const backToConsignmentDetails = () => {
        setVehicleDetailsStatus(false);
        navigate('/requestTruckpassProcess/consignmentDetails');
    };
    const moveToJourneyDetails = () => {
        const vehicleDetails = {
            vehicleType: selectedVehicleType?.type,
            axleSize: selectedAxleSize?.size,
            truckLicensePlate: truckLicensePlate,
            vehicleRegistrationDocument: vehicleRegDocumentData || ''
        };
        localStorage.setItem('vehicleDetails', JSON.stringify(vehicleDetails));
        setVehicleDetailsStatus(true);
        navigate('/requestTruckpassProcess/journeyDetails');
    };
    return (_jsxs("div", { className: 'flex flex-col gap-y-10 bg-transparent font-inter', children: [_jsx(TruckpassRequestStepper, { searchDriverStatus: true, driverProfileStatus: true, consignmentDetailsStatus: true, vehicleDetailsStatus: vehicleDetailsStatus, journeyDetailsStatus: false, reviewAndSubmitStatus: false }), _jsxs("div", { className: 'bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4', children: [_jsxs("div", { className: 'flex space-x-3 items-center', children: [_jsx("img", { src: vehicleIcon, className: 'h-6' }), _jsx("h1", { className: 'font-[600] text-[18px]', children: t('vehicleDetails.header') })] }), _jsxs("div", { className: 'flex flex-wrap justify-between', children: [_jsxs("div", { className: "relative w-[48%]", children: [_jsxs("label", { className: 'flex items-center mb-2', children: [_jsxs("p", { className: 'text-sm text-[#414651]', children: [t('vehicleDetails.vehicleType'), _jsx("span", { className: 'text-[#006DE7]', children: " *" }), " "] }), _jsx(Tooltip, { helpText: t('vehicleDetails.vehicleTypeTooltip') })] }), _jsx(DropDownSelection, { selectingVehicleType: true, data: vehicleTypes, setItemSelected: setSelectedVehicleType, placeHolder: t('vehicleDetails.selectVehicleType') })] }), _jsxs("div", { className: "relative w-[48%]", children: [_jsxs("label", { className: 'flex items-center mb-2', children: [_jsxs("p", { className: 'text-sm text-[#414651]', children: [t('vehicleDetails.axleSize'), _jsx("span", { className: 'text-[#006DE7]', children: " *" }), " "] }), _jsx(Tooltip, { helpText: t('vehicleDetails.axleSizeTooltip') })] }), _jsx(DropDownSelection, { selectingAxelSize: true, data: axleSizes, setItemSelected: setSelectedAxleSize, placeHolder: t('vehicleDetails.selectAxleSize') })] })] }), _jsxs("div", { className: 'flex flex-col w-full mb-6', children: [_jsxs("label", { className: 'flex items-center', children: [_jsxs("p", { className: 'text-sm text-[#414651]', children: [t('vehicleDetails.truckLicensePlate'), _jsx("span", { className: 'text-[#006DE7]', children: " *" }), " "] }), _jsx(Tooltip, { helpText: t('vehicleDetails.truckLicensePlateTooltip') })] }), _jsx("input", { type: 'text', placeholder: 'e.g., ABC-1223', value: truckLicensePlate, onChange: handleTruckLicensePlate, className: `${!truckLicensePlate ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${truckLicensePlateErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none` }), truckLicensePlateErrorMsg && _jsx("p", { className: 'text-xs text-[#D92D20]', children: truckLicensePlateErrorMsg })] }), _jsxs("div", { className: 'flex flex-col w-full', children: [_jsxs("label", { className: 'flex gap-x-1 items-center mb-3', children: [_jsx("p", { className: 'text-sm text-[#414651]', children: t('vehicleDetails.vehicleRegistrationDocuments') }), _jsx(Tooltip, { helpText: t('vehicleDetails.vehicleRegistrationDocTooltip') })] }), _jsx(CertificateUploadingSection, { vehicleRegistrationDocument: true, showUploadingBlock: vehicleRegDocumentUploading, setShowUploadingBlock: setVehicleRegDocumentUploading, clickableText: t('vehicleDetails.uploadRegistrationDocument'), setFileUploaded: setVehicleRegDocumentUploaded, setDataInFile: setVehicleRegDocumentData, fileUploadErrorMsg: vehicleRegDocUploadErrorMsg, setFileUploadErrorMsg: setvehicleRegDocErrorMsg })] }), _jsxs("div", { className: "flex space-x-6 justify-end mb-6 mt-[10%]", children: [_jsx("button", { onClick: () => backToConsignmentDetails(), className: "bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer", children: t('commans.goBack') }), _jsx("button", { disabled: !selectedVehicleType || !selectedAxleSize || !truckLicensePlate || !vehicleRegDocumentUploaded, onClick: () => moveToJourneyDetails(), className: `${(selectedVehicleType && selectedAxleSize && truckLicensePlate && vehicleRegDocumentUploaded) ? "bg-[#006DE7] cursor-pointer" : "bg-[#C2C2C2] cursor-default"} 
             w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white`, children: t('commans.continue') })] })] })] }));
};
