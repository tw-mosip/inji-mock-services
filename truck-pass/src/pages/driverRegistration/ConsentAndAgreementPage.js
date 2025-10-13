import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import consent_terms_icon from "../../assets/terms_icon.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DriverRegistrationStepper } from "./DriverRegistrationStepper";
export const ConsentAndAgreementPage = ({}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [checkBox, setCheckBox] = useState(false);
    const [getStartedBtn, setGetStartedBtn] = useState(false);
    const movetoSelectCompany = () => {
        setGetStartedBtn(true);
        navigate('/driverRegistrationProcessPage/selectCompanyPage');
    };
    return (_jsxs("div", { className: "flex w-[63%] shadow-lg rounded-2xl place-self-center", children: [_jsx(DriverRegistrationStepper, { consentStatus: getStartedBtn, selectCompanyStatus: false, uinVerificationStatus: false, registrationStatus: false, confirmationStatus: false }), _jsxs("div", { className: `flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`, children: [_jsxs("div", { className: "space-y-4 ", children: [_jsx("h1", { className: "font-semibold text-[22px]", children: t('consentAndAgreementPage.consentAndAgreementTitle') }), _jsx("p", { className: "text-[15px]", children: t('consentAndAgreementPage.consentAndAgreementDesc') }), _jsxs("div", { className: "h-auto border border-[#E2E8F0] rounded-lg p-4", children: [_jsxs("div", { className: "flex gap-x-2", children: [_jsx("img", { src: consent_terms_icon, alt: "consent_terms_icon", className: "h-5.5" }), _jsx("p", { className: "font-semibold text-normal", children: t('consentAndAgreementPage.termsAndConditions') })] }), _jsx("p", { className: "text-[13px] text-[#64748B] pt-1.5 pb-4", children: t('consentAndAgreementPage.termsAndConditionsInfo') }), _jsxs("div", { className: "flex items-start gap-x-2", children: [_jsx("input", { type: "checkbox", className: "border mt-1 cursor-pointer", onClick: () => setCheckBox(!checkBox) }), _jsxs("div", { className: "flex flex-col gap-y-6", children: [_jsx("p", { className: "text-[10px] text-[#020817]", children: t('consentAndAgreementPage.consentPara1') }), _jsx("p", { className: "text-[10px] text-[#020817]", children: t('consentAndAgreementPage.consentPara2') })] })] })] })] }), _jsx("button", { disabled: !checkBox, onClick: movetoSelectCompany, className: `${checkBox ? "bg-[#006DE7] cursor-pointer" : "bg-[#B0B0B0] cursor-default"} w-[54%] text-sm font-[600] place-self-end align-bottom py-2 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`, children: t('consentAndAgreementPage.getStarted') })] })] }));
};
