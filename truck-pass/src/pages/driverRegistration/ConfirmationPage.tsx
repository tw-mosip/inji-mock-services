import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import user_photo from "../../assets/user_photo.png";
import { useTranslation } from 'react-i18next';
import Hide_Details from "../../assets/Hide_Details.png";
import Show_Details from "../../assets/Show_Details.png";
import { SuccessPopup } from '../../components/SuccessPopup';
import { Stepper } from '../../commans/Stepper';

export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [showDetails, setShowDetails] = useState(true);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const driverSummaryItems = [
        { id: 0, title: t('confirmationPage.fullName'), value: 'Rajesh Singh' },
        { id: 1, title: t('confirmationPage.uin'), value: '198765432123' },
        { id: 2, title: t('confirmationPage.gender'), value: 'Male' },
        { id: 3, title: t('confirmationPage.email'), value: 'myemail@gmail.com' },
        { id: 4, title: t('confirmationPage.phoneNumber'), value: '+91 9876543210' },
        { id: 5, title: t('confirmationPage.city'), value: 'Chandigarh' },
        { id: 6, title: t('confirmationPage.transportCompany'), value: 'TransGlobal Logistics Ltd.' },
        { id: 7, title: t('confirmationPage.licenseNum'), value: 'DL-9876543210' },
        { id: 8, title: t('confirmationPage.passportNumber'), value: 'Z7654321' },
        { id: 9, title: t('confirmationPage.cpcCertificate'), value: 'File Uploaded' }
    ]
    useEffect(() => {
        setShowSuccessPopup(true);
        const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const displayValue = (value: string, alwaysVisible = false) =>
        showDetails || alwaysVisible
            ? value
            : value.length <= 4
                ? '*'.repeat(value.length)
                : value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);

    const onStartNewRegistration = () => {
        navigate('/LandingPage');
    };

    return (
        <div className="flex max-w-[1100px] w-full shadow-lg rounded-2xl place-self-center">
            {showSuccessPopup && (
                <SuccessPopup showSuccessPopup={showSuccessPopup} setShowSuccessPopup={setShowSuccessPopup} />
            )}

            <Stepper
                consentStatus={true}
                selectCompanyStatus={true}
                uinVerificationStatus={true}
                registrationStatus={true}
                confirmationStatus={true}
            />

            <div className="flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-1 rounded-br-2xl rounded-tr-2xl justify-between font-inter">
                <div className="flex flex-col items-center space-y-4">
                    <img src={confirmation_icon} alt="confirmation_icon" className="h-14" />
                    <h1 className="font-semibold text-[20px]">{t('confirmationPage.registrationCompleted')}</h1>
                    <p className="text-[15px] text-centerr">{t('confirmationPage.SuccessFullySubmitText')}</p>

                    <div className="w-[90%] border border-[#E2E8F0] rounded-lg p-6">
                        <div className="flex gap-x-3 items-center">
                            <img src={user_photo} alt="user_photo" className="h-20 pt-2" />
                            <div className="flex flex-col space-y-2 items-start">
                                <h1 className="font-bold">{t('confirmationPage.driverSummary')}</h1>
                                <p className="text-xs text-[#6B6B6B] font-[500]">
                                    {t('confirmationPage.registrationDetailsInfo', { driverName: "Rajesh Singh" })}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDetails(prev => !prev)}
                                className="text-sm font-medium text-[#414651] border border-[#FFFFFF] px-3 py-1 rounded-md ml-auto cursor-pointer"
                            >
                                {showDetails ? (
                                    <>
                                        <img src={Show_Details} alt="eye_icon" className="h-3 inline-block mr-1" />
                                        Hide Details
                                    </>
                                ) : (
                                    <>
                                        <img src={Hide_Details} alt="eye_off" className="h-4 inline-block mr-1" />
                                        Show Details
                                    </>
                                )}
                            </button>
                        </div>

                        <hr className="w-full border border-[#E5E5E5] my-4" />


                        {driverSummaryItems.map((item, i) => {
                            return (
                                <div key={i} className="flex flex-col">
                                    <ol className="pb-[28px] flex justify-between">
                                        <p className='font-[600] text-[15px]'>{item.title}</p>
                                        <p className='font-[500] text-[15px]'>{displayValue(item.value)}</p>
                                    </ol>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        onClick={onStartNewRegistration}
                        className="bg-[#006DE7] w-[31%] text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer   "
                    >
                        {t('confirmationPage.startNewRegistrationBtn')}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ConfirmationPageProps { }
