import React, { useState } from 'react';
import user_photo from "../../assets/user_photo.png";
import help_icon from "../../assets/help_icon.png";
import poweredby_inji_icon from "../../assets/poweredby_inji_icon.png";
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import { useTranslation } from 'react-i18next';

export const Registration: React.FC<RegistrationProps> = ({ setUinVerificationContinueBtn, setRegistrationSubmitBtn }) => {

    type EntryOption = 'manualEntry' | 'shareViaInjiVerify'

    const [selectedOpt, setSelectedOpt] = useState<EntryOption | 'manualEntry'>('manualEntry');
    const [driverLicenceNum, setDriverLicenceNum] = useState('');
    const [licenseShared, setLicenseShared] = useState(false);
    const [passportNum, setPassportNum] = useState('');
    const [showCertificateUploading, setShowCertificateUploading] = useState(false);
    const [certificateUploaded, setCertificateUploaded] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { t } = useTranslation();

    const goBackToUinVerfication = () => {
        setUinVerificationContinueBtn(false);
        setRegistrationSubmitBtn(false);
    }

    const handleEntryOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOpt(e.target.value as EntryOption);
    }

    const handleLicenceNumChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setDriverLicenceNum(e.target.value)
    }

    const handlePassportNumChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassportNum(e.target.value)
    }


    return (
        <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
            <div className="space-y-4">
                <h1 className="font-semibold text-[22px] pt-8">{t('registration.personalInformation')}</h1>
                <img src={user_photo} alt="user_photo" className='h-24 pt-2' />
                <form className='flex flex-col gap-y-4'>
                    <div className='space-y-1'>
                        <label className='flex items-center'>
                            <p className='text-sm'>{t('registration.fullName')}<span className='text-[#006DE7]'>*</span> </p>
                            <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
                        </label>
                        <input disabled value={'Rajesh Singh'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                    </div>
                    <div className='space-y-1'>
                        <label className='flex items-center'>
                            <p className='text-sm'>{t('registration.uin')}<span className='text-[#006DE7]'>*</span> </p>
                            <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
                        </label>
                        <input disabled value={'198765432123'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                    </div>
                    <div className='space-y-1'>
                        <label className='flex items-center'>
                            <p className='text-sm'>{t('registration.gender')}<span className='text-[#006DE7]'>*</span> </p>
                            <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
                        </label>
                        <input disabled value={'Male'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                    </div>
                    <div className='space-y-1'>
                        <label className='flex items-center'>
                            <p className='text-sm'>{t('registration.eMailId')}<span className='text-[#006DE7]'>*</span> </p>
                            <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
                        </label>
                        <input disabled value={'myemail@gmail.com'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                    </div>
                    <div className='space-y-1'>
                        <label className='flex items-center'>
                            <p className='text-sm'>{t('registration.phNum')}<span className='text-[#006DE7]'>*</span> </p>
                            <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
                        </label>
                        <input disabled value={'+91 9876543210'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                    </div>
                    <div className='space-y-1'>
                        <label className='flex items-center'>
                            <p className='text-sm'>{t('registration.city')}<span className='text-[#006DE7]'>*</span> </p>
                            <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
                        </label>
                        <input disabled value={'Chandigarh'} className='bg-[#FAFAFA] text-[15px] text-[#717680] p-1.5 w-full border border-[#D5D7DA] rounded-md' />
                    </div>

                    <div className='py-3 space-y-6'>
                        <div className='space-y-1.5'>
                            <h1 className='text-2xl font-[600]'>{t('registration.additionalInfo')}</h1>
                            <p className='text-sm'>{t('registration.provideInfo')}</p>
                        </div>

                        <div className='space-y-3'>
                            <label className='flex items-center'>
                                <p className='text-xs text-[#414651]'>{t('registration.driverLicenseNum')}<span className='text-[#006DE7]'>*</span> </p>
                                <img src={help_icon} alt='help_icon' className='h-3 cursor-pointer' />
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
                                        id="shareViaInjiVerify"
                                        type="radio"
                                        value="shareViaInjiVerify"
                                        checked={selectedOpt === 'shareViaInjiVerify'}
                                        className='cursor-pointer'
                                        onChange={handleEntryOptionChange}
                                    />
                                    <label htmlFor='shareViaInjiVerify' className={`px-1 text-sm`}>{t('registration.shareViaInjiVerify')}</label>
                                </div>
                            </div>
                            <input
                                placeholder='e.g., DL-9876543210'
                                value={driverLicenceNum}
                                onChange={handleLicenceNumChange}
                                className={`${!driverLicenceNum ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 w-full border ${errorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                            />
                            {errorMsg && <p className='text-xs text-[#D92D20]'>Please fill all required fields correctly before submitting.</p>}

                            {/* Share through Inji-Verify block*/}
                            {selectedOpt === 'shareViaInjiVerify' &&
                                <div className={`flex flex-col ${licenseShared ? 'bg-[#EFFDF5] border-[#B3F6D2]' : 'bg-[#EEF7FF] border-[#B9DDFD]'} space-y-2 h-auto border rounded-lg p-4`}>
                                    <h2 className={`text-sm font-semibold ${licenseShared ? 'text-[#007F41]' : 'text-[#006DE7]'}`}>{licenseShared ? t('registration.fetchedSuccessfully') : t('registration.shareLicenseViaInjiVerify')}</h2>
                                    <p className={`text-[12px] ${licenseShared ? 'text-[#007F41]' : 'text-[#0059D4]'} font-[500]`}>
                                        {licenseShared ? t('registration.authenticatedSuccessfully') : t('registration.shareLicenseViaInjiVerifyInfo')}
                                    </p>
                                    {!licenseShared &&
                                        <button onClick={() => setLicenseShared(true)}
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
                                    <img src={help_icon} alt='help_icon' className='h-3.5 cursor-pointer' />
                                </label>
                                <input
                                    placeholder='e.g., Z7654321'
                                    value={passportNum}
                                    onChange={handlePassportNumChange}
                                    className={`${!passportNum ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px]  p-1.5 w-full border ${errorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                                />
                                {errorMsg && <p className='text-xs text-[#D92D20]'>Please fill all required fields correctly before submitting.</p>}
                            </div>
                            <label className='flex items-center'>
                                <p className='text-sm text-[#414651]'>{t('registration.cpc')}<span className='text-[#006DE7]'>*</span> </p>
                                <img src={help_icon} alt='help_icon' className='h-3.5 cursor-pointer' />
                            </label>
                            <CertificateUploadingSection
                                showUploadingBlock={showCertificateUploading}
                                setShowUploadingBlock={setShowCertificateUploading}
                                setFileUploaded={setCertificateUploaded}
                                errorMsg={errorMsg}
                                setErrorMsg={setErrorMsg}
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className='flex space-x-2 justify-end mt-5'>
                <button onClick={() => goBackToUinVerfication()}
                    className={`bg-transparent w-[23%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`}>
                    {t('commans.goBack')}
                </button>
                <button disabled={!passportNum && !driverLicenceNum && !certificateUploaded} onClick={() => setRegistrationSubmitBtn(true)}
                    className={`${(passportNum && driverLicenceNum && certificateUploaded) ? 'bg-[#006DE7]' : 'bg-[#C2C2C2]'} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                    {t('commans.submit')}
                </button>
            </div>
        </div>
    )
}

interface RegistrationProps {
    setUinVerificationContinueBtn: (status: boolean) => void;
    setRegistrationSubmitBtn: (status: boolean) => void
}
