import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mailIcon from '../../assets/mail_button_icon.png';
import arrowLeft from '../../assets/arrow_left_icon.png';
import { useTranslation } from 'react-i18next';
const OtpVerificationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('');
    const location = useLocation();
    const email = location.state.email || '';
    // OTP state for 6 digits
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(5); // Changed initial timer to 30s
    const [canResend, setCanResend] = useState(false);
    const [hoverResend, setHoverResend] = useState(false);
    const [hoverBack, setHoverBack] = useState(false);
    // Refs array for inputs
    const inputRefs = useRef([]);
    // Dummy OTP for illustration
    const DUMMY_OTP = '111111';
    // Start countdown on mount and on resend
    useEffect(() => {
        if (!canResend) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [canResend]);
    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);
    // Handle digit input
    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value))
            return;
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        setError('');
        // Auto-advance
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };
    // Handle Backspace navigation
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    // Verify OTP
    const handleVerify = (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            setError(t('otpVerification.otpErrMsg1'));
            return;
        }
        if (code !== DUMMY_OTP) {
            setError(t('otpVerification.otpErrMsg2'));
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/requestTruckpassProcess/searchDriver');
        }, 1000);
    };
    // Resend OTP
    const handleResend = () => {
        if (!canResend)
            return;
        setOtp(Array(6).fill(''));
        setTimer(5);
        setCanResend(false);
        setError('');
        inputRefs.current[0]?.focus();
    };
    // Back to login
    const handleBack = () => navigate('/requestTruckpassProcess/loginPage');
    const isFormValid = otp.every(digit => digit !== '');
    return (_jsxs("div", { className: "font-inter flex flex-col min-h-screen px-4 py-8 bg-[#ECF5FF]", children: [_jsx("div", { className: "flex-grow flex justify-center items-center", children: _jsx("div", { className: "bg-white rounded-2xl flex items-center justify-center shadow-md", style: { width: '550px', height: '550px' }, children: _jsxs("div", { className: "rounded-xl p-8 w-[90%] bg-white", children: [_jsx("div", { className: "flex justify-center mb-3", children: _jsx("img", { src: mailIcon, alt: "Mail Icon", className: "w-15 h-15 object-contain" }) }), _jsx("h1", { className: "text-2xl font-semibold mb-4 text-center", style: { color: '#181D27' }, children: t('otpVerification.checkYourEmail') }), _jsx("p", { className: "text-sm text-center mb-2", style: { color: '#181D27', opacity: 0.7 }, children: t('otpVerification.otpDesc') }), _jsx("p", { className: "text-sm font-medium text-center mb-8", style: { color: '#006DE7' }, children: email }), _jsxs("form", { onSubmit: handleVerify, className: "space-y-6", children: [_jsx("div", { className: "flex justify-center space-x-3", children: otp.map((digit, idx) => (_jsx("input", { ref: el => { inputRefs.current[idx] = el; }, type: "text", inputMode: "numeric", value: digit, onChange: e => handleOtpChange(idx, e.target.value), onKeyDown: e => handleKeyDown(idx, e), maxLength: 1, disabled: isLoading, className: `font-mono w-14 h-14 text-center text-4xl font-semibold rounded-lg focus:outline-none transition border-2 bg-white text-[#006DE7] ${digit ? 'border-[#7CB3F1]' : 'border-[#D3D3D3]'} focus:border-[#006DE7]` }, idx))) }), error && (_jsx("p", { className: "text-sm text-center", style: { color: '#FF4D4F' }, children: error })), _jsx("div", { className: "flex justify-center", children: _jsx("button", { type: "submit", disabled: !isFormValid || isLoading, className: `w-60 h-12 rounded-lg font-medium text-white transition ${!isFormValid || isLoading ? 'bg-[#A0C3FF]' : 'bg-[#006DE7] hover:bg-[#0050B3] cursor-pointer'}`, children: isLoading ? t('otpVerification.verifying') : t('otpVerification.verifyEmail') }) })] }), _jsxs("div", { className: "text-center mt-4 hidden", children: [_jsx("span", { className: "text-sm", style: { color: '#181D27', opacity: 0.7 }, children: t('otpVerification.notReciveEmail') }), _jsx("button", { onClick: handleResend, disabled: !canResend, onMouseEnter: () => setHoverResend(true), onMouseLeave: () => setHoverResend(false), className: "text-sm font-semibold bg-transparent border-none", style: {
                                            color: canResend ? (hoverResend ? '#8A2BE2' : '#006DE7') : '#A0A0A0',
                                            cursor: canResend ? 'pointer' : 'not-allowed',
                                            textDecoration: 'none',
                                        }, children: canResend ? t('otpVerification.clickToResend') : t('otpVerification.resendOtpTime', { timer: timer }) })] }), _jsx("div", { className: "flex justify-center mt-4", children: _jsxs("button", { onClick: handleBack, onMouseEnter: () => setHoverBack(true), onMouseLeave: () => setHoverBack(false), className: "text-sm flex items-center font-semibold justify-center bg-transparent border-none transition", style: {
                                        color: hoverBack ? '#006DE7' : '#535862',
                                        cursor: 'pointer',
                                        gap: '6px',
                                    }, children: [_jsx("img", { src: arrowLeft, alt: "Back Arrow", className: "w-3.5 h-3 justify-center" }), t('otpVerification.backToLogin')] }) })] }) }) }), _jsx("footer", { className: "text-sm text-center pt-6 pb-4 font-inter", style: { color: '#717171' }, children: t('footer.footerText') })] }));
};
export default OtpVerificationPage;
