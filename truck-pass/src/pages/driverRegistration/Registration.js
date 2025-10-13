import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import registering_process from "../../assets/registering_process.gif";
// import { QRCodeVerification } from "@mosip/react-inji-verify-sdk";
import poweredby_inji_icon from "../../assets/poweredby_inji_icon.png";
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import relyingPartyService from '../../services/relyingPartyService';
import { ErrorPopup } from '../../components/ErrorPopup';
import { DriverRegistrationStepper } from './DriverRegistrationStepper';
import { base64ToFile } from '../../commans/AppUtilities';
import Tooltip from '../../components/Tooltip';
export const Registration = ({}) => {
    const [selectedOpt, setSelectedOpt] = useState('manualEntry');
    const [driverLicenceNum, setDriverLicenceNum] = useState('');
    const [licenseShared, setLicenseShared] = useState(false);
    const [passportNum, setPassportNum] = useState('');
    const [certificateUploaded, setCertificateUploaded] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [driverInfo, setDriverInfo] = useState(null);
    const [registrationScreen, setRegistrationScreen] = useState(true);
    const [showCertificateUploading, setShowCertificateUploading] = useState(false);
    const [fileData, setFileData] = useState(null);
    const [registrationSubmitBtn, setRegistrationSubmitBtn] = useState(false);
    const [confirmationBtn, setConfirmationBtn] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [licenceNumErrorMsg, setLicenceNumErrorMsg] = useState('');
    const [cpcUploadErrorMsg, setCpcUploadErrorMsg] = useState('');
    const { t } = useTranslation();
    const navigate = useNavigate();
    useEffect(() => {
        const data = localStorage.getItem('driverInformation');
        const selectedCompany = localStorage.getItem('companySelected');
        if (data) {
            try {
                const information = JSON.parse(data);
                setDriverInfo(information);
            }
            catch (e) {
                console.error("Invalid Information JSON:", e);
            }
        }
        if (selectedCompany) {
            const company = JSON.parse(selectedCompany);
            setSelectedCompany(company);
        }
    }, []);
    const { post_driver_registration } = { ...relyingPartyService };
    const moveToVerifyUinPage = () => {
        navigate('/driverRegistrationProcessPage/verifyUINPage');
        setRegistrationSubmitBtn(false);
        location.reload();
    };
    const registrationStatus = (status) => {
        setTimeout(() => {
            if (status) {
                setRegistrationSubmitBtn(true);
                setConfirmationBtn(true);
                navigate('/driverRegistrationProcessPage/confirmationPagePage');
            }
            else {
                setRegistrationScreen(true);
                setRegistrationSubmitBtn(false);
                setConfirmationBtn(false);
                setShowErrorPopup(true);
                setShowCertificateUploading(false);
                setCertificateUploaded(false);
                setPassportNum('');
                setDriverLicenceNum('');
                setFileData(null);
                setLicenceNumErrorMsg('');
                setCpcUploadErrorMsg('');
            }
        }, 3000);
    };
    const RegistrationLoader = () => {
        return (_jsx("div", { className: `flex flex-col bg-[#FFFFFF] pt-16 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-center font-inter`, children: _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("h1", { className: "font-semibold text-[22px]", children: t('registration.registering') }), _jsx("img", { src: registering_process, alt: "registering_process", className: 'w-[36%]' }), _jsx("p", { children: t('registration.pleaseWait') })] }) }));
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!driverLicenceNum.includes('-')) {
            setLicenceNumErrorMsg(t('registration.drivingLicenseErrorMsg'));
            return;
        }
        const driverRegistrationFormData = {
            full_name: driverInfo?.name ?? '',
            uin: '198765432123',
            gender: driverInfo?.gender ?? '',
            emailId: driverInfo?.email ?? '',
            phone_number: driverInfo?.phone_number ?? '',
            city: driverInfo?.address?.locality ?? '',
            drivers_license_number: driverLicenceNum,
            passport_number: passportNum,
            transportCompany: selectedCompany?.companyName,
            face_image: driverInfo?.picture ? base64ToFile(driverInfo.picture, 'driverPhoto.jpeg') : '',
            cpc_certificate: fileData ? base64ToFile(fileData, 'CPC-Certificate.pdf') : '',
        };
        try {
            setRegistrationScreen(false);
            setRegistrationSubmitBtn(true);
            const response = await post_driver_registration('/drivers/register', driverRegistrationFormData);
            if (response) {
                const driverAdditionalFiles = {
                    driverPicture: driverInfo?.picture,
                    cpcFile: fileData
                };
                localStorage.setItem('driverDetails', JSON.stringify(driverRegistrationFormData));
                localStorage.setItem('driverAdditionalFiles', JSON.stringify(driverAdditionalFiles));
            }
            registrationStatus(true);
        }
        catch (error) {
            console.error('Error registering driver:', error.response?.data || error.message || error);
            registrationStatus(false);
        }
    };
    const handleEntryOptionChange = (e) => {
        setSelectedOpt(e.target.value);
        setDriverLicenceNum('');
        setPassportNum('');
        setShowCertificateUploading(false);
        setCpcUploadErrorMsg('');
    };
    const handleLicenceNumChange = (e) => {
        setDriverLicenceNum(e.target.value);
    };
    const handlePassportNumChange = (e) => {
        setPassportNum(e.target.value);
    };
    const shareViaInjiVerify = () => {
        setLicenseShared(true);
    };
    return (_jsxs(_Fragment, { children: [showErrorPopup && _jsx(ErrorPopup, { showErrorPopup: showErrorPopup, setShowErrorPopup: setShowErrorPopup }), _jsxs("div", { className: "flex w-[63%] shadow-lg rounded-2xl place-self-center", children: [_jsx(DriverRegistrationStepper, { consentStatus: true, selectCompanyStatus: true, uinVerificationStatus: true, registrationStatus: registrationSubmitBtn, confirmationStatus: confirmationBtn }), !registrationScreen
                        ? _jsx(RegistrationLoader, {})
                        : _jsxs("div", { className: `flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`, children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "font-semibold text-[22px] pt-8", children: t('registration.personalInformation') }), _jsx("img", { itemType: 'file', src: driverInfo?.picture ?? '', alt: "driver_user_icon", className: 'h-24 pt-2' }), _jsxs("form", { className: 'flex flex-col gap-y-4', children: [_jsxs("div", { className: 'space-y-1', children: [_jsx("label", { className: 'flex items-center', children: _jsxs("p", { className: 'text-sm', children: [t('registration.fullName'), " "] }) }), _jsx("input", { type: 'text', disabled: true, value: driverInfo?.name ?? '', className: 'bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' })] }), _jsxs("div", { className: 'space-y-1', children: [_jsx("label", { className: 'flex items-center', children: _jsxs("p", { className: 'text-sm', children: [t('registration.uin'), " "] }) }), _jsx("input", { type: 'text', disabled: true, value: '198765432123', className: 'bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' })] }), _jsxs("div", { className: 'space-y-1', children: [_jsx("label", { className: 'flex items-center', children: _jsxs("p", { className: 'text-sm', children: [t('registration.gender'), " "] }) }), _jsx("input", { type: 'text', disabled: true, value: driverInfo?.gender ?? '', className: 'bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' })] }), _jsxs("div", { className: 'space-y-1', children: [_jsx("label", { className: 'flex items-center', children: _jsxs("p", { className: 'text-sm', children: [t('registration.eMailId'), " "] }) }), _jsx("input", { type: 'text', disabled: true, value: driverInfo?.email ?? '', className: 'bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' })] }), _jsxs("div", { className: 'space-y-1', children: [_jsx("label", { className: 'flex items-center', children: _jsxs("p", { className: 'text-sm', children: [t('registration.phNum'), " "] }) }), _jsx("input", { type: 'text', disabled: true, value: driverInfo?.phone_number ?? '', className: 'bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' })] }), driverInfo?.address?.locality &&
                                                    (_jsxs("div", { className: 'space-y-1', children: [_jsx("label", { className: 'flex items-center', children: _jsxs("p", { className: 'text-sm', children: [t('registration.city'), " "] }) }), _jsx("input", { type: 'text', disabled: true, value: driverInfo?.address?.locality ?? '', className: 'bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' })] })), _jsxs("div", { className: 'py-3 space-y-6', children: [_jsxs("div", { className: 'space-y-1.5', children: [_jsx("h1", { className: 'text-2xl font-[600]', children: t('registration.additionalInfo') }), _jsx("p", { className: 'text-sm', children: t('registration.provideInfo') })] }), _jsxs("div", { className: 'space-y-3', children: [_jsxs("label", { className: 'flex items-center', children: [_jsxs("p", { className: 'text-xs text-[#414651]', children: [t('registration.driverLicenseNum'), _jsx("span", { className: 'text-[#006DE7]', children: "*" }), " "] }), _jsx(Tooltip, { helpText: t('registration.driverLicenseTooltip') })] }), _jsxs("div", { className: 'flex gap-x-10', children: [_jsxs("div", { className: 'flex items-center', children: [_jsx("input", { id: "manualEntry", type: "radio", value: "manualEntry", checked: selectedOpt === 'manualEntry', className: 'cursor-pointer', onChange: handleEntryOptionChange }), _jsx("label", { htmlFor: 'manualEntry', className: 'px-1 text-sm', children: t('registration.manualEntry') })] }), _jsxs("div", { className: 'flex items-center', children: [_jsx("input", { disabled: true, id: "shareViaInjiVerify", type: "radio", value: "shareViaInjiVerify", checked: selectedOpt === 'shareViaInjiVerify', className: 'cursor-pointer', onChange: handleEntryOptionChange }), _jsx("label", { htmlFor: 'shareViaInjiVerify', className: `text-[#D5D7DA] px-1 text-sm`, children: t('registration.shareViaInjiVerify') })] })] }), _jsx("input", { type: 'text', placeholder: 'e.g., DL-9876543210', value: driverLicenceNum, onChange: handleLicenceNumChange, className: `${!driverLicenceNum ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 w-full border ${licenceNumErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none` }), licenceNumErrorMsg && _jsx("p", { className: 'text-xs text-[#D92D20]', children: licenceNumErrorMsg }), selectedOpt === 'shareViaInjiVerify' &&
                                                                    _jsxs("div", { className: `flex flex-col ${licenseShared ? 'bg-[#EFFDF5] border-[#B3F6D2]' : 'bg-[#EEF7FF] border-[#B9DDFD]'} space-y-2 h-auto border rounded-lg p-4`, children: [_jsx("h2", { className: `text-sm font-semibold ${licenseShared ? 'text-[#007F41]' : 'text-[#006DE7]'}`, children: licenseShared ? t('registration.fetchedSuccessfully') : t('registration.shareLicenseViaInjiVerify') }), _jsx("p", { className: `text-[12px] ${licenseShared ? 'text-[#007F41]' : 'text-[#0059D4]'} font-[500]`, children: licenseShared ? t('registration.authenticatedSuccessfully') : t('registration.shareLicenseViaInjiVerifyInfo') }), !licenseShared &&
                                                                                // <QRCodeVerification
                                                                                //     verifyServiceUrl="https://0358-223-185-132-139.ngrok-free.app/v1/verify"
                                                                                //     onVCProcessed={(vpResult) => { console.log("VC + Status:", vpResult) }}
                                                                                //     onError={handleError}
                                                                                //     isEnableScan={false}
                                                                                //     triggerElement={
                                                                                //         <button onClick={shareViaInjiVerify}
                                                                                //             className={`bg-[#006DE7] cursor-pointer"} w-[33%] text-[12px] font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                                                                                //             {t('registration.shareBtn')}
                                                                                //         </button>
                                                                                //     }
                                                                                // />
                                                                                _jsx("button", { onClick: shareViaInjiVerify, className: `bg-[#006DE7] cursor-pointer"} w-[33%] text-[12px] font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`, children: t('registration.shareBtn') }), _jsx("img", { src: poweredby_inji_icon, alt: "poweredBy_logo", className: 'h-7 w-[34%] pt-1' })] }), _jsxs("div", { className: 'space-y-1 py-4', children: [_jsxs("label", { className: 'flex items-center', children: [_jsx("p", { className: 'text-sm', children: t('registration.passportNum') }), _jsx(Tooltip, { helpText: t('registration.paassportNumTooltip') })] }), _jsx("input", { type: 'text', placeholder: 'e.g., Z7654321', value: passportNum, onChange: handlePassportNumChange, className: `${!passportNum ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px]  p-1.5 w-full border border-[#D5D7DA] rounded-md outline-none` })] }), _jsxs("label", { className: 'flex items-center', children: [_jsxs("p", { className: 'text-sm text-[#414651]', children: [t('registration.cpc'), _jsx("span", { className: 'text-[#006DE7]', children: "*" }), " "] }), _jsx(Tooltip, { helpText: t('registration.cpcTooltip') })] }), _jsx(CertificateUploadingSection, { driverRegistrationCpc: true, showUploadingBlock: showCertificateUploading, setShowUploadingBlock: setShowCertificateUploading, clickableText: t('certificationUploadSec.cpc'), setFileUploaded: setCertificateUploaded, setDataInFile: setFileData, fileUploadErrorMsg: cpcUploadErrorMsg, setFileUploadErrorMsg: setCpcUploadErrorMsg })] })] })] })] }), _jsxs("div", { className: 'flex space-x-2 justify-end mt-5', children: [_jsx("button", { onClick: moveToVerifyUinPage, className: `bg-transparent w-[23%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`, children: t('commans.goBack') }), selectedOpt !== 'shareViaInjiVerify' ?
                                            _jsx("button", { type: 'submit', disabled: !passportNum || !driverLicenceNum || !certificateUploaded, onClick: (e) => onSubmit(e), className: `${(passportNum && driverLicenceNum && certificateUploaded) ? 'bg-[#006DE7] cursor-pointer' : 'bg-[#C2C2C2]'} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF]`, children: t('commans.submit') })
                                            : _jsx("button", { type: 'submit', disabled: !passportNum || !driverLicenceNum || !licenseShared || !certificateUploaded, onClick: (e) => onSubmit(e), className: `${(passportNum && driverLicenceNum && licenseShared && certificateUploaded) ? 'bg-[#006DE7] cursor-pointer' : 'bg-[#C2C2C2]'} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF]`, children: t('commans.submit') })] })] })] })] }));
};
