import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { DriverRegistrationFlow } from "../../shared/DriverRegistrationFlow";
import { useTranslation } from "react-i18next";
const DriverRegistrationProcess = ({ children }) => {
    const { t, i18n } = useTranslation();
    useEffect(() => {
        const savedLng = localStorage.getItem("appLanguage");
        if (savedLng) {
            i18n.changeLanguage(savedLng);
        }
    }, []);
    return (_jsxs("div", { className: "flex flex-col bg-[#ECF5FF] w-full items-center pt-12 gap-y-10 font-inter h-auto", children: [_jsxs("div", { className: "flex  flex-col space-y-2 items-center place-self-center", children: [_jsx("h1", { className: "text-3xl font-semibold", children: t('driverRegistrationProcess.processMainTitle') }), _jsx("p", { className: "text-base", children: t('driverRegistrationProcess.respDescription') })] }), _jsxs("div", { className: "bg-[url('../assets/landingPage_bg.png')] w-full", children: [_jsx(DriverRegistrationFlow, { children: children }), _jsx("footer", { className: 'text-sm text-[#717171] place-self-center bg-transparent py-16 font-inter', children: t('footer.footerText') })] })] }));
};
export default DriverRegistrationProcess;
