import React, { useEffect, useState, type FormEvent } from 'react';
import registering_process from "../../assets/registering_process.gif";
// import { QRCodeVerification } from "@mosip/react-inji-verify-sdk";
import poweredby_inji_icon from "../../assets/poweredby_inji_icon.png";
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import relyingPartyService from '../../services/relyingPartyService';
import { ErrorPopup } from '../../components/ErrorPopup';
import { DriverRegistrationStepper } from './DriverRegistrationStepper';
import { base64ToFile } from '../../commans/AppUtilities';
import Tooltip from '../../components/Tooltip';


export const Registration: React.FC<RegistrationProps> = ({ }) => {

    type EntryOption = 'manualEntry' | 'shareViaInjiVerify'

    const [selectedOpt, setSelectedOpt] = useState<EntryOption | 'manualEntry'>('manualEntry');
    const [driverLicenceNum, setDriverLicenceNum] = useState('');
    const [licenseShared, setLicenseShared] = useState(false);
    const [passportNum, setPassportNum] = useState('');
    const [certificateUploaded, setCertificateUploaded] = useState(false);

    const [selectedCompany, setSelectedCompany] = useState<CompanyInfo | null>(null);
    const [driverInfo, setDriverInfo] = useState<DriverInfo | null>(null);
    const [registrationScreen, setRegistrationScreen] = useState(true);
    const [showCertificateUploading, setShowCertificateUploading] = useState(false);
    const [fileData, setFileData] = useState<string | null>(null);
    const [registrationSubmitBtn, setRegistrationSubmitBtn] = useState(false);
    const [confirmationBtn, setConfirmationBtn] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);

    const [licenceNumErrorMsg, setLicenceNumErrorMsg] = useState('');
    const [cpcUploadErrorMsg, setCpcUploadErrorMsg] = useState('');


    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const data = localStorage.getItem('driverInformation');
        const selectedCompany = localStorage.getItem('companySelected');

        if (data) {
            try {
                const information = JSON.parse(data);
                setDriverInfo(information);
            } catch (e) {
                console.error("Invalid Information JSON:", e);
            }
        }
        if (selectedCompany) {
            const company = JSON.parse(selectedCompany);
            setSelectedCompany(company);
        }
    }, []);

    const { post_driver_registration } = { ...relyingPartyService }

    const moveToVerifyUinPage = () => {
        navigate('/driverRegistrationProcessPage/verifyUINPage');
        setRegistrationSubmitBtn(false);
        location.reload();
    }

    const registrationStatus = (status: boolean) => {
        setTimeout(() => {
            if (status) {
                setRegistrationSubmitBtn(true);
                setConfirmationBtn(true);
                navigate('/driverRegistrationProcessPage/confirmationPagePage');
            }
            else {
                setRegistrationScreen(true);
                setRegistrationSubmitBtn(false);
                setConfirmationBtn(false);
                setShowErrorPopup(true);
                setShowCertificateUploading(false);
                setCertificateUploaded(false);
                setPassportNum('');
                setDriverLicenceNum('');
                setFileData(null);
                setLicenceNumErrorMsg('');
                setCpcUploadErrorMsg('');
            }
        }, 3000);
    };

    const RegistrationLoader = () => {
        return (
            <div className={`flex flex-col bg-[#FFFFFF] pt-16 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-center font-inter`}>
                <div className="flex flex-col items-center">
                    <h1 className="font-semibold text-[22px]">{t('registration.registering')}</h1>
                    <img src={registering_process} alt="registering_process" className='w-[36%]' />
                    <p>{t('registration.pleaseWait')}</p>
                </div>
            </div>
        )
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!driverLicenceNum.includes('-')) {
            setLicenceNumErrorMsg(t('registration.drivingLicenseErrorMsg'));
            return;
        }

        const driverRegistrationFormData = {
            full_name: driverInfo?.name ?? '',
            uin: '198765432123',
            gender: driverInfo?.gender ?? '',
            emailId: driverInfo?.email ?? '',
            phone_number: driverInfo?.phone_number ?? '',
            city: driverInfo?.address?.locality ?? '',
            drivers_license_number: driverLicenceNum,
            passport_number: passportNum,
            transportCompany: selectedCompany?.companyName,
            face_image: driverInfo?.picture ? base64ToFile(driverInfo.picture, 'driverPhoto.jpeg') : '',
            cpc_certificate: fileData ? base64ToFile(fileData, 'CPC-Certificate.pdf') : '',
        };

        try {
            setRegistrationScreen(false);
            setRegistrationSubmitBtn(true);
            const response = await post_driver_registration('/drivers/register', driverRegistrationFormData);
            if (response) {
                const driverAdditionalFiles = {
                    driverPicture: driverInfo?.picture,
                    cpcFile: fileData
                }
                localStorage.setItem('driverDetails', JSON.stringify(driverRegistrationFormData));
                localStorage.setItem('driverAdditionalFiles', JSON.stringify(driverAdditionalFiles));
            }
            registrationStatus(true);
        } catch (error: any) {
            console.error('Error registering driver:', error.response?.data || error.message || error);
            registrationStatus(false);
        }
    }

    const handleEntryOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOpt(e.target.value as EntryOption);
        setDriverLicenceNum('');
        setPassportNum('');
        setShowCertificateUploading(false);
        setCpcUploadErrorMsg('');
    }

    const handleLicenceNumChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setDriverLicenceNum(e.target.value);
    }

    const handlePassportNumChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassportNum(e.target.value);
    }

    const shareViaInjiVerify = () => {
        setLicenseShared(true);
    }


    return (
        <>
            {showErrorPopup && <ErrorPopup showErrorPopup={showErrorPopup} setShowErrorPopup={setShowErrorPopup} />}

            <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
                <DriverRegistrationStepper
                    consentStatus={true}
                    selectCompanyStatus={true}
                    uinVerificationStatus={true}
                    registrationStatus={registrationSubmitBtn}
                    confirmationStatus={confirmationBtn}
                />
                {!registrationScreen
                    ? <RegistrationLoader />
                    : <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
                        <div className="space-y-4">
                            <h1 className="font-semibold text-[22px] pt-8">{t('registration.personalInformation')}</h1>
                            <img itemType='file' src={driverInfo?.picture ?? ''} alt="driver_user_icon" className='h-24 pt-2' />
                            <form className='flex flex-col gap-y-4'>
                                <div className='space-y-1'>
                                    <label className='flex items-center'>
                                        <p className='text-sm'>{t('registration.fullName')} </p>
                                    </label>
                                    <input type='text' disabled value={driverInfo?.name ?? ''} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='flex items-center'>
                                        <p className='text-sm'>{t('registration.uin')} </p>
                                    </label>
                                    <input type='text' disabled value={'198765432123'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='flex items-center'>
                                        <p className='text-sm'>{t('registration.gender')} </p>
                                    </label>
                                    <input type='text' disabled value={driverInfo?.gender ?? ''} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='flex items-center'>
                                        <p className='text-sm'>{t('registration.eMailId')} </p>
                                    </label>
                                    <input type='text' disabled value={driverInfo?.email ?? ''} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                                </div>
                                <div className='space-y-1'>
                                    <label className='flex items-center'>
                                        <p className='text-sm'>{t('registration.phNum')} </p>
                                    </label>
                                    <input type='text' disabled value={driverInfo?.phone_number ?? ''} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                                </div>
                                {driverInfo?.address?.locality &&
                                    (<div className='space-y-1'>
                                        <label className='flex items-center'>
                                            <p className='text-sm'>{t('registration.city')} </p>
                                        </label>
                                        <input type='text' disabled value={driverInfo?.address?.locality ?? ''} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                                    </div>)
                                }
                                <div className='py-3 space-y-6'>
                                    <div className='space-y-1.5'>
                                        <h1 className='text-2xl font-[600]'>{t('registration.additionalInfo')}</h1>
                                        <p className='text-sm'>{t('registration.provideInfo')}</p>
                                    </div>

                                    <div className='space-y-3'>
                                        <label className='flex items-center'>
                                            <p className='text-xs text-[#414651]'>{t('registration.driverLicenseNum')}<span className='text-[#006DE7]'>*</span> </p>
                                            <Tooltip helpText={t('registration.driverLicenseTooltip')} />
                                        </label>

                                        <div className='flex gap-x-10'>
                                            <div className='flex items-center'>
                                                <input
                                                    id="manualEntry"
                                                    type="radio"
                                                    value="manualEntry"
                                                    checked={selectedOpt === 'manualEntry'}
                                                    className='cursor-pointer'
                                                    onChange={handleEntryOptionChange}
                                                />
                                                <label htmlFor='manualEntry' className='px-1 text-sm'>{t('registration.manualEntry')}</label>
                                            </div>
                                            <div className='flex items-center'>
                                                <input
                                                    disabled
                                                    id="shareViaInjiVerify"
                                                    type="radio"
                                                    value="shareViaInjiVerify"
                                                    checked={selectedOpt === 'shareViaInjiVerify'}
                                                    className='cursor-pointer'
                                                    onChange={handleEntryOptionChange}
                                                />
                                                <label htmlFor='shareViaInjiVerify' className={`text-[#D5D7DA] px-1 text-sm`}>{t('registration.shareViaInjiVerify')}</label>
                                            </div>
                                        </div>
                                        <input
                                            type='text'
                                            placeholder='e.g., DL-9876543210'
                                            value={driverLicenceNum}
                                            onChange={handleLicenceNumChange}
                                            className={`${!driverLicenceNum ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 w-full border ${licenceNumErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                                        />
                                        {licenceNumErrorMsg && <p className='text-xs text-[#D92D20]'>{licenceNumErrorMsg}</p>}

                                        {/* Share through Inji-Verify block*/}
                                        {selectedOpt === 'shareViaInjiVerify' &&
                                            <div className={`flex flex-col ${licenseShared ? 'bg-[#EFFDF5] border-[#B3F6D2]' : 'bg-[#EEF7FF] border-[#B9DDFD]'} space-y-2 h-auto border rounded-lg p-4`}>
                                                <h2 className={`text-sm font-semibold ${licenseShared ? 'text-[#007F41]' : 'text-[#006DE7]'}`}>{licenseShared ? t('registration.fetchedSuccessfully') : t('registration.shareLicenseViaInjiVerify')}</h2>
                                                <p className={`text-[12px] ${licenseShared ? 'text-[#007F41]' : 'text-[#0059D4]'} font-[500]`}>
                                                    {licenseShared ? t('registration.authenticatedSuccessfully') : t('registration.shareLicenseViaInjiVerifyInfo')}
                                                </p>
                                                {!licenseShared &&
                                                    // <QRCodeVerification
                                                    //     verifyServiceUrl="https://0358-223-185-132-139.ngrok-free.app/v1/verify"
                                                    //     onVCProcessed={(vpResult) => { console.log("VC + Status:", vpResult) }}
                                                    //     onError={handleError}
                                                    //     isEnableScan={false}
                                                    //     triggerElement={
                                                    //         <button onClick={shareViaInjiVerify}
                                                    //             className={`bg-[#006DE7] cursor-pointer"} w-[33%] text-[12px] font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                                                    //             {t('registration.shareBtn')}
                                                    //         </button>
                                                    //     }
                                                    // />
                                                    <button onClick={shareViaInjiVerify}
                                                        className={`bg-[#006DE7] cursor-pointer"} w-[33%] text-[12px] font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                                                        {t('registration.shareBtn')}
                                                    </button>
                                                }
                                                <img src={poweredby_inji_icon} alt="poweredBy_logo" className='h-7 w-[34%] pt-1' />
                                            </div>
                                        }
                                        {/* Share through Inji-Verify block*/}

                                        <div className='space-y-1 py-4'>
                                            <label className='flex items-center'>
                                                <p className='text-sm'>{t('registration.passportNum')}</p>
                                                <Tooltip helpText={t('registration.paassportNumTooltip')} />
                                            </label>
                                            <input
                                                type='text'
                                                placeholder='e.g., Z7654321'
                                                value={passportNum}
                                                onChange={handlePassportNumChange}
                                                className={`${!passportNum ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px]  p-1.5 w-full border border-[#D5D7DA] rounded-md outline-none`}
                                            />
                                            {/* {passportNumErrorMsg && <p className='text-xs text-[#D92D20]'>{passportNumErrorMsg}</p>} */}
                                        </div>
                                        <label className='flex items-center'>
                                            <p className='text-sm text-[#414651]'>{t('registration.cpc')}<span className='text-[#006DE7]'>*</span> </p>
                                            <Tooltip helpText={t('registration.cpcTooltip')} />
                                        </label>
                                        <CertificateUploadingSection
                                            driverRegistrationCpc={true}
                                            showUploadingBlock={showCertificateUploading}
                                            setShowUploadingBlock={setShowCertificateUploading}
                                            clickableText={t('certificationUploadSec.cpc')}
                                            setFileUploaded={setCertificateUploaded}
                                            setDataInFile={setFileData}
                                            fileUploadErrorMsg={cpcUploadErrorMsg}
                                            setFileUploadErrorMsg={setCpcUploadErrorMsg}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className='flex space-x-2 justify-end mt-5'>
                            <button onClick={moveToVerifyUinPage}
                                className={`bg-transparent w-[23%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`}>
                                {t('commans.goBack')}
                            </button>
                            {selectedOpt !== 'shareViaInjiVerify' ?
                                <button type='submit' disabled={!passportNum || !driverLicenceNum || !certificateUploaded} onClick={(e) => onSubmit(e)}
                                    className={`${(passportNum && driverLicenceNum && certificateUploaded) ? 'bg-[#006DE7] cursor-pointer' : 'bg-[#C2C2C2]'} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF]`}>
                                    {t('commans.submit')}
                                </button>
                                : <button type='submit' disabled={!passportNum || !driverLicenceNum || !licenseShared || !certificateUploaded} onClick={(e) => onSubmit(e)}
                                    className={`${(passportNum && driverLicenceNum && licenseShared && certificateUploaded) ? 'bg-[#006DE7] cursor-pointer' : 'bg-[#C2C2C2]'} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF]`}>
                                    {t('commans.submit')}
                                </button>
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

type RegistrationProps = {

}

type CompanyInfo = {
    companyName?: string;
}

type DriverInfo = {
    name?: string;
    picture?: string;
    gender?: string;
    email?: string;
    phone_number?: string;
    city?: string;
    address?: { locality?: string };
};
