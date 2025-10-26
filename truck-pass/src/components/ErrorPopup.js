import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import cross_circle_icon from '../assets/cross_circle_icon.png';
import close_icon from '../assets/close_icon.png';
import { useTranslation } from 'react-i18next';
export const ErrorPopup = ({ showErrorPopup, setShowErrorPopup }) => {
    const { t } = useTranslation();
    return (_jsxs("div", { className: `absolute bg-[#FFFFFF] w-[30%] p-8 top-24 right-10 z-50 transform transition-all duration-500 ${showErrorPopup ? '-translate-x-0' : '-translate-x-full'} rounded-lg shadow`, children: [_jsxs("div", { className: 'flex items-center justify-between', children: [_jsxs("div", { className: 'flex gap-x-2', children: [_jsx("img", { src: cross_circle_icon, alt: "cross_icon", className: 'h-5' }), _jsx("h2", { className: 'text-[16px]', children: t('errorPopUp.header') })] }), _jsx("img", { src: close_icon, className: 'cursor-pointer', onClick: () => setShowErrorPopup(false) })] }), _jsx("p", { className: 'text-[12px] px-1.5 pt-2', children: t('errorPopUp.desc') })] }));
};
