import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import locationIcon from '../../assets/location_icon.png';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import tickIcon from '../../assets/confirmation_icon.png';
// import { base64ToFile } from '../../commans/AppUtilities';
// import relyingPartyService from '../../services/relyingPartyService';
export const ReviewPage = () => {
    const { t } = useTranslation('');
    const navigate = useNavigate();
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [reviewAndSubmitStatus, setReviewAndSubmitStatus] = useState(false);
    const [driverInformation, setDriverInformation] = useState(null);
    const [consignmentDetails, setConsignmentDetails] = useState(null);
    const [vehicleDetails, setVehicleDetails] = useState(null);
    const [journeyDetails, setJourneyDetails] = useState(null);
    // const { post_driver_details } = { ...relyingPartyService };
    const setLocalStoredData = (key, setItemDetails) => {
        const data = localStorage.getItem(key);
        if (data) {
            const storedData = JSON.parse(data);
            setItemDetails(storedData);
        }
    };
    useEffect(() => {
        setLocalStoredData('selectedDriver', setDriverInformation);
        setLocalStoredData('consignmentDetails', setConsignmentDetails);
        setLocalStoredData('vehicleDetails', setVehicleDetails);
        setLocalStoredData('journeyDetails', setJourneyDetails);
    }, []);
    const backToJourneyDetails = () => {
        navigate('/requestTruckpassProcess/journeyDetails');
        setReviewAndSubmitStatus(false);
        setShowSuccessScreen(false);
    };
    const confirmAndSubmit = async () => {
        // const payload = {
        //   driverUin: driverInformation?.uin,
        //   driverName: driverInformation?.fullName,
        //   phoneNumber: driverInformation?.phoneNumber,
        //   gender: driverInformation?.gender,
        //   emailId: driverInformation?.emailId,
        //   city: driverInformation?.city,
        //   faceImagePath: driverInformation?.faceImagePath,  //Convert into actual file using base64ToFile before posting as like other documents.
        //   driverLicenseNumber: vehicleDetails?.truckLicensePlate,
        //   passportNumber: driverInformation?.passportNumber,
        //
        //   invoiceNumber: consignmentDetails?.inVoiceNumber,
        //   cmrWaybill: consignmentDetails?.waybillNumber,
        //   customsDocumentation: consignmentDetails?.customDocument ? base64ToFile(consignmentDetails?.customDocument, 'customDocument.pdf') : '',
        //   weightCertificatePath: consignmentDetails?.weightCertificate ? base64ToFile(consignmentDetails?.weightCertificate, 'weightCertificate.pdf') : '',
        //
        //   vehicleType: vehicleDetails?.vehicleType,
        //   axleSize: vehicleDetails?.axleSize,
        //   vehicleRegistrationDocsPath: vehicleDetails?.vehicleRegistrationDocument ? base64ToFile(vehicleDetails?.vehicleRegistrationDocument, 'vehicleRegistrationDocument.pdf') : '',
        //   truckLicensePlate: vehicleDetails?.truckLicensePlate,
        //
        //   exporterName: journeyDetails?.exporterCompany,
        //   importerName: journeyDetails?.importerCompany,
        //   entryExitPoint: journeyDetails?.borderOfArrival,
        //   countryOrigin: journeyDetails?.originCountry,
        //   countryDestination: journeyDetails?.destinationCountry,
        //   dateDeparture: journeyDetails?.dateOfDeparture,
        //   dateReturn: journeyDetails?.dateOfArrival,
        // };
        // try {
        //   const response = await post_driver_details(payload);
        //   if (response.status === 200 || response.status === 201) {
        //     setReviewAndSubmitStatus(false);
        //     setShowSuccessScreen(true);
        //   } else {
        //     console.error('Submission failed:', response.status, response.statusText);
        //   }
        // } catch (error: any) {
        //   console.error('Error during submission:', error.message);
        //   if (error.response) {
        //     console.error('Server response:', error.response.data);
        //   }
        // }
        setReviewAndSubmitStatus(false);
        setShowSuccessScreen(true);
    };
    const submitAnotherApplication = () => {
        navigate('/requestTruckpassProcess/requestedPassesDashboard');
    };
    const RegistrationSuccessPage = () => {
        return (_jsxs("div", { className: 'flex flex-col gap-y-5 place-self-center items-center py-6 w-[40%]', children: [_jsx("img", { src: tickIcon, className: 'h-14 w-14' }), _jsx("h1", { className: 'text-xl font-semibold text-center', children: t('registrationSuccessPage.header') }), _jsx("p", { className: 'text-sm font-[400] text-center', children: t('registrationSuccessPage.desc1') }), _jsx("p", { className: 'text-sm font-[400] text-center', children: t('registrationSuccessPage.desc2') }), _jsx("button", { onClick: submitAnotherApplication, className: "bg-[#006DE7] px-3 py-2.5 text-sm font-[500] text-center rounded-[5px] text-white cursor-pointer my-9", children: t('registrationSuccessPage.submitAnotherApplication') })] }));
    };
    return (_jsxs("div", { className: 'flex flex-col gap-y-10 bg-transparent font-inter', children: [_jsx(TruckpassRequestStepper, { searchDriverStatus: true, driverProfileStatus: true, consignmentDetailsStatus: true, vehicleDetailsStatus: true, journeyDetailsStatus: true, reviewAndSubmitStatus: reviewAndSubmitStatus }), _jsx("div", { className: 'bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4', children: showSuccessScreen
                    ? _jsx(RegistrationSuccessPage, {})
                    : _jsxs(_Fragment, { children: [_jsxs("div", { className: 'flex flex-col space-y-2', children: [_jsxs("div", { className: 'flex space-x-3', children: [_jsx("img", { src: locationIcon, className: 'h-6 w-6' }), _jsx("h1", { className: 'font-[600] text-[18px]', children: t('reviewPage.journeyDetails') })] }), _jsx("p", { className: 'font-[400] text-[13px] text-[#000000]', children: t('reviewPage.subHead') })] }), _jsxs("div", { className: 'flex flex-col gap-y-9 mt-[2.5%]', children: [_jsx("div", { className: 'h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6', children: _jsxs("div", { className: "flex flex-col gap-y-4", children: [_jsx("h1", { className: 'font-[600] text-[15px]', children: t('reviewPage.driverInformation') }), _jsxs("div", { className: 'flex flex-row gap-x-[370px]', children: [_jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.fullName') }), driverInformation?.fullName] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.uin') }), driverInformation?.uin] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.email') }), driverInformation?.emailId] })] }), _jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.gender') }), driverInformation?.gender] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.license') }), driverInformation?.driverLicenseNumber] })] })] })] }) }), _jsx("div", { className: 'h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6', children: _jsxs("div", { className: "flex flex-col gap-y-4", children: [_jsx("h1", { className: 'font-[600] text-[15px]', children: t('reviewPage.consignmentDetails') }), _jsxs("div", { className: 'flex flex-row gap-x-[370px]', children: [_jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.inVoiceNum') }), consignmentDetails?.inVoiceNumber] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.weightCertificate') }), consignmentDetails?.weightCertificate ? t('reviewPage.uploaded') : t('reviewPage.pending')] })] }), _jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.wayBill') }), consignmentDetails?.waybillNumber] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.customsCertificate') }), consignmentDetails?.customDocument ? t('reviewPage.uploaded') : t('reviewPage.pending')] })] })] })] }) }), _jsx("div", { className: 'h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6', children: _jsxs("div", { className: "flex flex-col gap-y-4", children: [_jsx("h1", { className: 'font-[600] text-[15px]', children: t('reviewPage.vehicleDetails') }), _jsxs("div", { className: 'flex flex-row gap-x-[370px]', children: [_jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.type') }), vehicleDetails?.vehicleType] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.licensePlate') }), vehicleDetails?.truckLicensePlate] })] }), _jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.axleSize') }), vehicleDetails?.axleSize] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.registrationDocs') }), vehicleDetails?.vehicleRegistrationDocument ? t('reviewPage.uploaded') : t('reviewPage.pending')] })] })] })] }) }), _jsx("div", { className: 'h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6', children: _jsxs("div", { className: "flex flex-col gap-y-4", children: [_jsx("h1", { className: 'font-[600] text-[15px]', children: t('reviewPage.journeyDetails') }), _jsxs("div", { className: 'flex flex-row gap-x-[350px]', children: [_jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.exporter') }), journeyDetails?.exporterCompany] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.countryOfOrigin') }), journeyDetails?.originCountry] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.departureDate') }), journeyDetails?.dateOfDeparture] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.arrivalDate') }), journeyDetails?.dateOfArrival] })] }), _jsxs("div", { className: 'flex flex-col space-y-4', children: [_jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.importer') }), journeyDetails?.importerCompany] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.destination') }), journeyDetails?.destinationCountry] }), _jsxs("p", { className: 'text-[14px]', children: [_jsx("span", { className: 'font-[600]', children: t('reviewPage.borderPoint') }), journeyDetails?.borderOfArrival] })] })] })] }) }), _jsx("div", { className: 'bg-[#FFFBEC] border border-[#FFEDA7] rounded-md p-3 px-9', children: _jsx("p", { className: 'text-xs text-[#E7711A]', children: t('reviewPage.warningInfo') }) }), _jsxs("div", { className: "flex space-x-6 justify-end mb-6 mt-[3%]", children: [_jsx("button", { onClick: () => backToJourneyDetails(), className: "bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer", children: t('commans.goBack') }), _jsx("button", { onClick: confirmAndSubmit, className: "bg-[#006DE7] w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer", children: t('commans.confirmAndSubmit') })] })] })] }) })] }));
};
;
;
;
