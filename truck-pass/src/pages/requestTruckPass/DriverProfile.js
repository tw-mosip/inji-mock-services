import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import magnifierIcon from '../../assets/magnifier_icon.png';
import userPhoto from '../../assets/user_photo.png';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
export const DriverProfile = () => {
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const [driverProfileStatus, setDriverProfileStatus] = useState(false);
    const [driverInformation, setDriverInformation] = useState(null);
    useEffect(() => {
        const data = localStorage.getItem('selectedDriver');
        if (data) {
            const storedData = JSON.parse(data);
            setDriverInformation(storedData);
        }
    }, []);
    const backToSearchDriver = () => {
        setDriverProfileStatus(false);
        navigate('/requestTruckpassProcess/searchDriver');
    };
    const moveToConsignmentDetails = () => {
        setDriverProfileStatus(true);
        navigate('/requestTruckpassProcess/consignmentDetails');
    };
    return (_jsxs("div", { className: 'flex flex-col gap-y-10 bg-transparent font-inter', children: [_jsx(TruckpassRequestStepper, { searchDriverStatus: true, driverProfileStatus: driverProfileStatus, consignmentDetailsStatus: false, vehicleDetailsStatus: false, journeyDetailsStatus: false, reviewAndSubmitStatus: false }), _jsxs("div", { className: 'bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4', children: [_jsxs("div", { className: 'flex space-x-5 items-center', children: [_jsx("img", { src: magnifierIcon, className: 'h-4.5' }), _jsx("h1", { className: 'font-[600] text-[18px]', children: t('driverProfilePage.header') })] }), _jsxs("div", { className: 'flex bg-[#EFFDF5] h-[94px] items-center px-6 gap-x-2 border border-[#B3F6D2] rounded-md', children: [_jsx("img", { src: userPhoto, className: 'h-16 w-16 bg-blue-400 rounded-xl' }), _jsxs("div", { className: 'flex flex-col gap-y-2', children: [_jsx("p", { className: 'font-[600] text-[#007F41] text-[14px]', children: t('driverProfilePage.driverFound') }), _jsx("p", { className: 'font-[400] text-[#007F41] text-[14px]', children: t('driverProfilePage.driverProfileSuccessMsg') })] })] }), _jsxs("div", { className: 'flex flex-wrap justify-between gap-x-4', children: [_jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.fullName') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.fullName })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2  my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.gender') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.gender })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.uin') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.uin })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.phoneNumber') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.phoneNumber })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.emailID') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.emailId })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.city') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.city })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.driverLicenseNum') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.driverLicenseNumber })] }), _jsxs("div", { className: 'flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3', children: [_jsx("p", { className: 'font-[500] text-[#717680] text-xs', children: t('driverProfilePage.passportNum') }), _jsx("p", { className: 'font-[500] text-[#000000] text-sm', children: driverInformation?.passportNumber })] })] }), _jsxs("div", { className: "flex space-x-6 justify-end my-6", children: [_jsx("button", { onClick: () => backToSearchDriver(), className: "bg-transparent w-[172px] h-[39px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer", children: t('commans.goBack') }), _jsx("button", { onClick: () => moveToConsignmentDetails(), className: "bg-[#006DE7] w-[172px] h-[39px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer", children: t('commans.continue') })] })] })] }));
};
;
