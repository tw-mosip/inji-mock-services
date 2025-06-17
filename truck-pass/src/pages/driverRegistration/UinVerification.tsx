import React, { useState } from 'react';
import poweredBy_logo from "../../assets/poweredby_esignet_logo.png";
import { useTranslation } from 'react-i18next';

export const UinVerification: React.FC<UinVerificationProps> = ({ setSelectionPageContinueBtn, setUinVerificationContinueBtn }) => {


    const [verified, setVerified] = useState(false);
    const { t } = useTranslation();

    const goBackToSelectCompany = () => {
        setSelectionPageContinueBtn(false);
        setUinVerificationContinueBtn(false);
    }

    return (
        <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
            <div className="space-y-4">
                <h1 className="font-semibold text-[22px]">{t('uinVerification.uinVerification')}</h1>

                <div className={`flex flex-col ${verified ? 'bg-[#EFFDF5] border-[#B3F6D2]' : 'bg-[#EEF7FF] border-[#B9DDFD]'} space-y-2 h-auto border rounded-lg p-4`}>
                    <h2 className={`text-sm font-semibold ${verified ? 'text-[#007F41]' : 'text-[#006DE7]'}`}>{verified ? t('uinVerification.verifiedSuccessFully') : t('uinVerification.readyForVerfication')}</h2>
                    <p className={`text-[12px] ${verified ? 'text-[#007F41]' : 'text-[#0059D4]'} font-[500]`}>
                        {verified ? t('uinVerification.verifiedInfo') : t('uinVerification.verificationReadyInfo')}
                    </p>
                    {!verified &&
                        <button onClick={() => setVerified(true)}
                            className={`bg-[#006DE7] cursor-pointer"} w-[33%] text-[12px] font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                            {t('uinVerification.verifyBtn')}
                        </button>
                    }
                    <img src={poweredBy_logo} alt="poweredBy_logo" className='h-7 w-[20%] pt-1' />
                </div>

            </div>
            <div className='flex space-x-2 justify-end'>
                <button onClick={() => goBackToSelectCompany()}
                    className={`bg-transparent w-[21%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`}>
                    {t('commans.goBack')}
                </button>
                <button disabled={!verified} onClick={() => setUinVerificationContinueBtn(true)}
                    className={`${verified ? "bg-[#006DE7] cursor-pointer": "bg-[#B0B0B0] focus:shadow-md cursor-pointer"}} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                    {t('commans.continue')}
                </button>
            </div>
        </div>
    )
}

interface UinVerificationProps {
    setSelectionPageContinueBtn: (status: boolean) => void;
    setUinVerificationContinueBtn: (status: boolean) => void
}
