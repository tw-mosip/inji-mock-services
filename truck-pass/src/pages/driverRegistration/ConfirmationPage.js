import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import { useTranslation } from 'react-i18next';
import { SuccessPopup } from '../../components/SuccessPopup';
import { DriverRegistrationStepper } from './DriverRegistrationStepper';
export const ConfirmationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [confirmationDetails, setConfirmationDetails] = useState(null);
    const [additionalInfo, setAdditionalInfo] = useState(null);
    useEffect(() => {
        try {
            const details = localStorage.getItem('driverDetails');
            const additionalFiles = localStorage.getItem('driverAdditionalFiles');
            if (details) {
                const driverDetails = JSON.parse(details);
                setConfirmationDetails(driverDetails);
            }
            if (additionalFiles) {
                const additionalDetails = JSON.parse(additionalFiles);
                setAdditionalInfo(additionalDetails);
            }
        }
        catch (error) {
            console.error('Error parsing localStorage data:', error);
        }
    }, []);
    const onStartNewRegistration = () => {
        navigate('/landingPage');
    };
    return (_jsxs("div", { className: "flex w-[63%] shadow-lg rounded-2xl place-self-center", "data-testid": "confirmation-page", children: [showSuccessPopup && (_jsx(SuccessPopup, { showSuccessPopup: showSuccessPopup, setShowSuccessPopup: setShowSuccessPopup })), _jsx(DriverRegistrationStepper, { consentStatus: true, selectCompanyStatus: true, uinVerificationStatus: true, registrationStatus: true, confirmationStatus: true }), _jsx("div", { className: "flex flex-col bg-[#FFFFFF] w-full pt-5 pb-9 px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx("img", { src: confirmation_icon, alt: "confirmation_icon", className: "h-14" }), _jsx("h1", { className: "font-semibold text-[20px]", children: t('confirmationPage.registrationCompleted') }), _jsx("p", { className: "text-[13px]", children: t('confirmationPage.SuccessFullySubmitText') }), _jsxs("div", { className: "w-[90%] border border-[#E2E8F0] rounded-lg p-6", "data-testid": "driver-summary", children: [_jsxs("div", { className: "flex gap-x-3 items-center", children: [additionalInfo?.driverPicture && (_jsx("img", { src: additionalInfo?.driverPicture, alt: "driver_user_icon", className: "h-20 pt-2" })), _jsxs("div", { className: "flex flex-col space-y-2 items-start", children: [_jsx("h1", { className: "font-bold", children: t('confirmationPage.driverSummary') }), _jsx("p", { className: "text-xs text-[#6B6B6B] font-[500]", children: t('confirmationPage.registrationDetailsInfo', {
                                                        driverName: confirmationDetails?.fullName || '',
                                                    }) })] })] }), _jsx("hr", { className: "w-full border border-[#E5E5E5] my-4" }), _jsx("div", { className: "flex flex-col", children: _jsx("ol", { className: "pb-2", children: [
                                            ['fullName', confirmationDetails?.fullName],
                                            ['uin', confirmationDetails?.uin],
                                            ['gender', confirmationDetails?.gender],
                                            ['email', confirmationDetails?.emailId],
                                            ['phoneNumber', confirmationDetails?.phoneNumber],
                                            ['city', confirmationDetails?.city],
                                            ['transportCompany', confirmationDetails?.transportCompany],
                                            ['licenseNum', confirmationDetails?.driverLicenseNum],
                                            ['passportNumber', confirmationDetails?.passportNum],
                                            ['cpcCertificate', t('confirmationPage.fileUploaded')],
                                        ].map(([labelKey, value], id) => (_jsxs("li", { className: "flex justify-between py-2.5", children: [_jsx("p", { className: "font-semibold text-sm", children: t(`confirmationPage.${labelKey}`) }), _jsx("p", { className: "text-sm font-[500]", children: value || '-' })] }, id))) }) })] }), _jsx("button", { onClick: onStartNewRegistration, "data-testid": "new-registration-btn", className: "bg-[#006DE7] w-[31%] text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer", children: t('confirmationPage.startNewRegistrationBtn') })] }) })] }));
};
