import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import connector_icon from "../../assets/connector_icon.png";
import tick_icon from "../../assets/tick_icon.png";
import { useTranslation } from 'react-i18next';
export const DriverRegistrationStepper = ({ consentStatus, selectCompanyStatus, uinVerificationStatus, registrationStatus, confirmationStatus }) => {
    const { t } = useTranslation();
    const consentAgreed = consentStatus;
    const companySelected = selectCompanyStatus;
    const uinVerified = uinVerificationStatus;
    const registrationCompleted = registrationStatus;
    const confirmed = confirmationStatus;
    const registrationProcessItems = [
        { id: 1, title: t('stepper.consentAndAgreement'), inProgress: !consentAgreed, completed: consentAgreed },
        { id: 2, title: t('stepper.selectCompany'), inProgress: (consentAgreed && !companySelected), completed: companySelected },
        { id: 3, title: t('stepper.uinVerification'), inProgress: (companySelected && !uinVerified), completed: uinVerified },
        { id: 4, title: t('stepper.registration'), inProgress: (uinVerified && !registrationCompleted), completed: registrationCompleted },
        { id: 5, title: t('stepper.submitApplication'), inProgress: (registrationCompleted && !confirmed), completed: confirmed },
        { id: 6, title: t('stepper.confirmation'), inProgress: false, completed: confirmed },
    ];
    return (_jsxs("div", { className: 'flex flex-col bg-[#F9FAFB] h-auto w-[48%] px-9 pt-5 pb-14 rounded-bl-2xl rounded-tl-2xl', children: [_jsx("h3", { className: 'font-[500] text-[22px] mb-8', children: t('stepper.registrationProcess') }), registrationProcessItems.map((item, i) => {
                return (_jsxs("div", { className: ' flex gap-x-3', children: [_jsxs("div", { className: 'flex flex-col items-center', children: [item.completed
                                    ? _jsx("img", { src: tick_icon, alt: "tick_icon", className: 'h-6' })
                                    : _jsx("p", { className: `text-sm px-2.5 py-0.5 rounded-4xl ${item.inProgress ? "bg-[#006DE7] text-white" : "bg-[#E5E7EB] text-[#747D89]"} `, children: item.id }), _jsx("img", { src: connector_icon, alt: "connector_icon", className: `h-14 w-0.5 ${item.id === 6 && "hidden"}` })] }), _jsxs("div", { className: 'flex flex-col', children: [_jsx("p", { className: `text-sm font-[600] ${item.inProgress ? "text-[#006DE7]" : (item.completed ? "text-[#079455]" : "text-[#747D89]")}`, children: item.title }), item.inProgress
                                    ? _jsx("p", { className: `text-[#535862] text-xs font-[300]`, children: t('commans.inProgress') })
                                    : (item.completed ? _jsx("p", { className: `text-[#535862] text-xs font-[300]`, children: t('commans.completed') }) : _jsx("p", {}))] })] }, i));
            })] }));
};
