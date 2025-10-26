import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import line_pattern_left from "../assets/Line_Pattern_Left.png";
import line_pattern_right from "../assets/Line_Pattern_Right.png";
import driver_user_icon from "../assets/driver_user_icon.png";
import request_truck_pass_icon from "../assets/request_truck_pass_icon.png";
import application_submit_icon from "../assets/application_submit_icon.png";
import verfication_icon from "../assets/verfication_icon.png";
import approval_issuance_icon from "../assets/approval_issuance_icon.png";
import truck_icon from "../assets/truck_icon.png";
import { useTranslation } from "react-i18next";
const LandingPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const moveToDriverRegistration = () => {
        navigate('/driverRegistrationProcessPage/consentAndAgreementPage');
    };
    const moveToRequestTruckPass = () => {
        navigate('/requestTruckpassProcess/loginPage');
    };
    const streamlinedProcess = [
        { id: 1, icon: application_submit_icon, title: t('landingPage.subApplication'), subTitle: t('landingPage.subApplicationInfo') },
        { id: 2, icon: verfication_icon, title: t('landingPage.securityVerification'), subTitle: t('landingPage.securityVerificationInfo') },
        { id: 3, icon: approval_issuance_icon, title: t('landingPage.approvalAndIssuance'), subTitle: t('landingPage.approvalAndIssuanceInfo') },
        { id: 4, icon: truck_icon, title: t('landingPage.crossBorder'), subTitle: t('landingPage.crossBorderInfo') }
    ];
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex flex-col font-inter items-center space-y-11", children: [_jsxs("div", { className: "flex items-center justify-between bg-[#004DA3] rounded-[12px] text-center w-[85%] h-auto", children: [_jsx("img", { src: line_pattern_left, className: "h-[290px] w-[15%] -ml-[100px] mb-[3%]" }), _jsxs("div", { className: "flex flex-col text-center w-[50%] gap-y-10", children: [_jsx("p", { className: "text-4xl text-[#FFFFFF] font-[500] px-20", children: t('landingPage.landingPageTitle') }), _jsx("p", { className: "text-[15px] text-[#E1EFFF]", children: t('landingPage.landingPageSubTitle') })] }), _jsx("img", { src: line_pattern_right, className: "h-[290px] w-[15%] -mr-[100px] -mb-[7%]" })] }), _jsx("div", { className: "bg-[#ECF5FF] w-full h-[480px]", children: _jsxs("div", { className: "flex flex-col w-full items-center mt-14 pb-[38px] space-y-8 bg-[url('../assets/landingPage_bg.png')] h-[400px]", children: [_jsx("p", { className: "text-2xl text-[#181D27] font-[500]", children: t('landingPage.getStartedToday') }), _jsxs("div", { className: "flex place-self-center space-x-10", children: [_jsxs("div", { className: "flex flex-col bg-[#FFFFFF] w-[380px] h-auto border-0 rounded-xl items-center py-7 shadow-2xl space-y-5 text-center justify-between", children: [_jsx("img", { src: driver_user_icon, alt: "Driver Registration Icon", className: "h-10 border-0 p-2 rounded-md shadow-lg" }), _jsx("p", { className: "font-[600]", children: t('landingPage.driverRegistration') }), _jsx("p", { className: "text-[12px]", children: t('landingPage.driverRegSubTitle') }), _jsx("button", { onClick: moveToDriverRegistration, className: "bg-[#006DE7] w-[90%] text-[10px] font-[600] py-[2%] text-center rounded-[5px] text-[#FFFFFF] cursor-pointer", children: t('landingPage.registerAsDriver') })] }), _jsxs("div", { className: "flex flex-col bg-[#FFFFFF] w-[380px] h-auto border-0 rounded-xl items-center py-7 shadow-2xl space-y-5 justify-between", children: [_jsx("img", { src: request_truck_pass_icon, className: "h-10 border-0 p-2 rounded-md shadow-lg" }), _jsx("p", { className: "font-[600]", children: t('landingPage.requestTruckPass') }), _jsx("p", { className: "text-[12px]", children: t('landingPage.requestTruckPassSubTitle') }), _jsx("button", { onClick: moveToRequestTruckPass, className: "bg-[#006DE7] w-[90%] text-[10px] font-[600] py-[2%] text-center rounded-[5px] text-[#FFFFFF] cursor-pointer", children: t('landingPage.login') })] })] })] }) }), _jsxs("div", { className: "flex flex-col items-center w-full space-y-4", children: [_jsx("p", { className: "text-[20px] text-[#181D27] font-[600]", children: t('landingPage.howItWorks') }), _jsx("p", { className: "text-[13px]", children: t('landingPage.landingPageInfo') }), _jsx("div", { className: "flex space-x-[4%] mt-[3%] justify-evenly px-[14%]", children: streamlinedProcess.map((item) => {
                                    return (_jsxs("div", { className: "flex flex-col space-y-4 items-center w-[18%] text-center", children: [_jsx("img", { src: item.icon, className: "h-10 border-0 p-2 rounded-md shadow-lg" }), _jsx("p", { className: "text-[13px] font-[700]", children: item.title }), _jsx("p", { className: "text-[11px]", children: item.subTitle })] }, item.id));
                                }) })] })] }), _jsx("footer", { className: 'text-sm text-[#717171] place-self-center pt-12 pb-6 bg-transparent font-inter', children: t('footer.footerText') })] }));
};
export default LandingPage;
