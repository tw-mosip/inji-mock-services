import React, { useState } from 'react';
import poweredBy_logo from "../../assets/poweredby_esignet_logo.png";
import { useTranslation } from 'react-i18next';
import eye_icon from "../../assets/eye_icon.png";
import eye_off from "../../assets/eye_off.png";
import { Stepper } from '../../commans/Stepper';
import { useNavigate } from 'react-router-dom';

export const VerifyUIN: React.FC<VerifyUINProps> = ({ }) => {

  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'already-registered'>('pending');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [uinVerificationContinueBtn, setUinVerificationContinueBtn] = useState(false);
  const [showUIN, setShowUIN] = useState(false); //
  const eyeIconClass = "h-3 cursor-pointer";
  const eyeOffIconClass = "h-4 cursor-pointer";


  const moveToSelectCompanyPage = () => {
    navigate('/driverRegistrationProcessPage/selectCompanyPage');
    setUinVerificationContinueBtn(false);
  };

  const moveToRegistrationPage = () => {
    navigate('/driverRegistrationProcessPage/registrationPage');
    setUinVerificationContinueBtn(true);
  };

  const displayValue = (value: string, showDetails: boolean, alwaysVisible = false) =>
    showDetails || alwaysVisible
      ? value
      : value.length <= 4
        ? '*'.repeat(value.length)
        : value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);


  const LoadingIndicator: React.FC = () => {
    return (
      <div className="flex justify-center space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-600"></div>
      </div>
    );
  };

  // This is a placeholder to simulate verification logic
  const handleVerify = () => {
    // Simulate different cases; update logic here to connect with API
    const isAlreadyRegistered = false; // simulate flag
    if (isAlreadyRegistered) {
      setVerificationStatus('already-registered');
    } else {
      setVerificationStatus('verified');
    }
  };

  const renderStatusBlock = () => {
    switch (verificationStatus) {
      case 'pending':
        return (
          <div className="flex flex-col bg-[#EEF7FF] border border-[#B9DDFD] space-y-2 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-[#006DE7]">{t('uinVerification.readyForVerfication')}</h2>
            <p className="text-[12px] text-[#0059D4] font-[500]">{t('uinVerification.verificationReadyInfo')}</p>
            <button
              onClick={handleVerify}
              className="bg-[#006DE7] w-[33%] text-[12px] font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer"
            >
              {t('uinVerification.verifyBtn')}
            </button>
            <img src={poweredBy_logo} alt="poweredBy_logo" className="h-7 w-[20%] pt-1" />
          </div>
        );
      case 'verified':
        const uin = "276301076687";
        const toggleUIN = () => {
          setShowUIN(prev => !prev);
        };

        return (
          <div className="flex flex-col bg-[#EFFDF5] border border-[#B3F6D2] space-y-2 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-[#007F41]">
              {t('uinVerification.verifiedSuccessFully')}
            </h2>

            <div className="bg-[#EEF7FF] border border-[#B9DDFD] rounded-md px-3 py-2 flex items-center text-sm text-[#007F41] font-semibold">
              <span className="text-[#0059D4] flex items-center">
                UIN Fetched:&nbsp;{displayValue(uin, showUIN)}
                <img
                  src={showUIN ? eye_off : eye_icon}
                  alt={showUIN ? "Hide UIN" : "Show UIN"}
                  className={`ml-2 ${showUIN ? eyeOffIconClass : eyeIconClass}`}
                  onClick={toggleUIN}
                />
              </span>
            </div>


            <p className="text-[12px] text-[#007F41] font-[500]">
              {t('uinVerification.verifiedInfo')}
            </p>

            <img src={poweredBy_logo} alt="poweredBy_logo" className="h-7 w-[20%] pt-1" />
          </div>
        );
      case 'already-registered':
        return (
          <div className="flex flex-col bg-[#FFF7E8] border border-[#FFE7B7] space-y-2 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-[#C4320A]">{t('uinVerification.uinAlreadyRegistered')}</h2>
            <div className="bg-white border border-[#FFE7B7] rounded-md px-3 py-2 flex justify-between items-center text-sm text-[#C4320A] font-semibold">
              {t('')} <span className="text-[#0059D4] flex items-center">
                UIN Fetched:&nbsp;{displayValue("276301076687", showUIN)}
                <img
                  src={showUIN ? eye_off : eye_icon}
                  alt={showUIN ? "Hide UIN" : "Show UIN"}
                  className={`ml-2 ${showUIN ? eyeOffIconClass : eyeIconClass}`}
                  onClick={() => setShowUIN(prev => !prev)}
                />
              </span>
            </div>
            <p className="text-[12px] text-[#C4320A] font-[500]">{t('uinVerification.alreadyRegisteredInfo',)}</p>
            {/* <p className="text-[12px] text-[#ff0004] font-[500]">{t('uinVerification.alreadyRegisteredInfoTryAgain',)}</p> */}
            <img src={poweredBy_logo} alt="poweredBy_logo" className="h-7 w-[20%] pt-1" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
      <Stepper
        consentStatus={true}
        selectCompanyStatus={true}
        uinVerificationStatus={uinVerificationContinueBtn}
        registrationStatus={false}
        confirmationStatus={false}
      />
      <div className="flex flex-col bg-white pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter">
        <div className="space-y-4">
          <h1 className="font-semibold text-[22px] ">{t('uinVerification.uinVerification')}</h1>
          {renderStatusBlock()}
        </div>

        <div className="flex space-x-2 justify-end mt-6">
          <button
            onClick={moveToSelectCompanyPage}
            className="bg-transparent w-[21%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer"
          >
            {t('commans.goBack')}
          </button>
          {verificationStatus === 'already-registered' ? (
            <button
              onClick={() => setVerificationStatus('pending')}
              className="bg-[#006DE7] w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer"
            >
              {t('commans.tryAgain')}
            </button>
          ) : (
            <button
              disabled={verificationStatus !== 'verified'}
              onClick={moveToRegistrationPage}
              className={`w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] ${verificationStatus === 'verified' ? 'bg-[#006DE7] text-white cursor-pointer' : 'bg-[#B0B0B0] text-white'
                }`}
            >
              {t('commans.continue')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface VerifyUINProps {
}
