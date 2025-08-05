import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import { useTranslation } from 'react-i18next';
import { SuccessPopup } from '../../components/SuccessPopup';
import { Stepper } from '../../commans/Stepper';


export const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ }) => {

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [conformationDetails, setConformationDetails] = useState<ConformationDetails | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);

    useEffect(() => {
        const details = localStorage.getItem('driverDetails');
        const additonalFiles = localStorage.getItem('driverAdditionalFiles')

        if (details) {
            const driverDetails = JSON.parse(details);
            if (driverDetails) {
                setConformationDetails(driverDetails);
            }
        }
        if (additonalFiles) {
            const additionalDetails = JSON.parse(additonalFiles);
            if (additionalDetails) {
                setAdditionalInfo(additionalDetails);
            }
        }
    }, []);

    const onStartNewRegistration = () => {
        navigate('/landingPage')
    }

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            {showSuccessPopup && <SuccessPopup showSuccessPopup={showSuccessPopup} setShowSuccessPopup={setShowSuccessPopup} />}
            <Stepper
                consentStatus={true}
                selectCompanyStatus={true}
                uinVerificationStatus={true}
                registrationStatus={true}
                confirmationStatus={true}
            />
            <div className={`flex flex-col bg-[#FFFFFF] w-full pt-5 pb-9 px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
                <div className="flex flex-col items-center space-y-4">
                    <img src={confirmation_icon} alt="confirmation_icon" className='h-14' />
                    <h1 className="font-semibold text-[20px]">{t('confirmationPage.registrationCompleted')}</h1>
                    <p className="text-[13px]">{t('confirmationPage.SuccessFullySubmitText')}</p>

                    <div className="w-[90%] border border-[#E2E8F0] rounded-lg p-6">
                        <div className='flex gap-x-3 items-center'>
                            <img src={additionalInfo?.driverPicture} alt="driver_user_icon" className='h-20 pt-2' />
                            <div className='flex flex-col space-y-2 items-start'>
                                <h1 className='font-bold'>{t('confirmationPage.driverSummary')}</h1>
                                <p className='text-xs text-[#6B6B6B] font-[500]'>
                                    {t('confirmationPage.registrationDetailsInfo', { driverName: conformationDetails?.fullName })}
                                </p>
                            </div>
                        </div>
                        <hr className='w-full border border-[#E5E5E5] my-4' />

                        <div className='flex flex-col'>
                            <ol className='pb-2'>
                                <li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.fullName')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.fullName}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.uin')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.uin}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.gender')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.gender}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.email')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.emailId}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.phoneNumber')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.phoneNumber}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.city')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.city}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.transportCompany')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.transportCompany}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.licenseNum')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.driverLicenseNum}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.passportNumber')}</p>
                                    <p className='text-sm font-[500]'>{conformationDetails?.passportNum}</p>
                                </li><li className='flex justify-between py-2.5'>
                                    <p className='font-semibold text-sm'>{t('confirmationPage.cpcCertificate')}</p>
                                    <p className='text-sm font-[500]'>{t('confirmationPage.fileUploaded')}</p>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <button onClick={onStartNewRegistration}
                        className={`bg-[#006DE7] w-[31%] cursor-pointer"} text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                        {t('confirmationPage.startNewRegistrationBtn')}
                    </button>
                </div>

            </div>
        </div>
    )
}

interface ConfirmationPageProps {

}

type AdditionalInfo = {
    driverPicture: string;
    cpcFile: string
};

type ConformationDetails = {
    picture?: string;
    fullName?: string;
    uin?: string,
    gender?: string,
    emailId?: string;
    city?: string;
    phoneNumber?: string;
    driverLicenseNum?: string,
    passportNum?: string,
    transportCompany?: string
};