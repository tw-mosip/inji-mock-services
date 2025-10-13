import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import tick_icon from '../assets/tick_icon.png';
import close_icon from '../assets/close_icon.png';
import { useTranslation } from 'react-i18next';
export const SuccessPopup = ({ showSuccessPopup, setShowSuccessPopup }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: `absolute bg-[#FFFFFF] w-[30%] p-8 top-24 right-10 z-50 transform transition-all duration-500 ${showSuccessPopup ? '-translate-x-0' : '-translate-x-full'} rounded-lg shadow`, children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex gap-x-2', children: [_jsx("img", { src: tick_icon, alt: "tick_icon", className: 'h-5' }), _jsx("h2", { className: 'text-[16px]', children: t('successPopUp.header') })] }), _jsx("img", { src: close_icon, className: 'cursor-pointer', onClick: () => setShowSuccessPopup(false) })] }), _jsx("p", { className: 'text-[12px] px-1.5 pt-2', children: t('successPopUp.desc') })] }));
};
