import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import { useTranslation } from 'react-i18next';
import { SuccessPopup } from '../../components/SuccessPopup';
import { DriverRegistrationStepper } from './DriverRegistrationStepper';

export const ConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [confirmationDetails, setConfirmationDetails] = useState<ConfirmationDetails | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<AdditionalInfo | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    try {
      const details = localStorage.getItem('driverDetails');
      const additionalFiles = localStorage.getItem('driverAdditionalFiles');
      const companySelected = localStorage.getItem('companySelected')

      if (details) {
        const driverDetails = JSON.parse(details);

        setConfirmationDetails(driverDetails);

      }
      if(companySelected) {
        const companyDetails = JSON.parse(companySelected);
        setCompany(companyDetails);
      }


      if (additionalFiles) {
        const additionalDetails = JSON.parse(additionalFiles);
        setAdditionalInfo(additionalDetails);
      }
    } catch (error) {
      console.error('Error parsing localStorage data:', error);
    }
  }, []);

  const onStartNewRegistration = () => {
    navigate('/landingPage');
  };

  return (
    <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center" data-testid="confirmation-page">
      {showSuccessPopup && (
        <SuccessPopup
          showSuccessPopup={showSuccessPopup}
          setShowSuccessPopup={setShowSuccessPopup}
        />
      )}

      <DriverRegistrationStepper
        consentStatus
        selectCompanyStatus
        uinVerificationStatus
        registrationStatus
        confirmationStatus
      />

      <div className="flex flex-col bg-[#FFFFFF] w-full pt-5 pb-9 px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter">
        <div className="flex flex-col items-center space-y-4">
          <img src={confirmation_icon} alt="confirmation_icon" className="h-14" />
          <h1 className="font-semibold text-[20px]">
            {t('confirmationPage.registrationCompleted')}
          </h1>
          <p className="text-[13px]">
            {t('confirmationPage.SuccessFullySubmitText')}
          </p>

          <div className="w-[90%] border border-[#E2E8F0] rounded-lg p-6" data-testid="driver-summary">
            <div className="flex gap-x-3 items-center">
              {additionalInfo?.driverPicture && (
                <img
                  src={additionalInfo?.driverPicture}
                  alt="driver_user_icon"
                  className="h-20 pt-2"
                />
              )}
              <div className="flex flex-col space-y-2 items-start">
                <h1 className="font-bold">
                  {t('confirmationPage.driverSummary')}
                </h1>
                <p className="text-xs text-[#6B6B6B] font-[500]">
                  {t('confirmationPage.registrationDetailsInfo', {
                    driverName: confirmationDetails?.fullName || '',
                  })}
                </p>
              </div>
            </div>
            <hr className="w-full border border-[#E5E5E5] my-4" />

            <div className="flex flex-col">
              <ol className="pb-2">
                {[
                  ['fullName', confirmationDetails?.fullName],
                  ['uin', confirmationDetails?.uin],
                  ['gender', confirmationDetails?.gender],
                  ['email', confirmationDetails?.driverEmailId],
                  ['phoneNumber', confirmationDetails?.phoneNumber],
                  ['city', confirmationDetails?.city],
                  ['transportCompany', company?.company_name],
                  ['licenseNum', confirmationDetails?.driverLicenseNumber],
                  ['passportNumber', confirmationDetails?.passportNumber],
                  ['cpcCertificate', t('confirmationPage.fileUploaded')],
                ].map(([labelKey, value], id) => (
                  <li key={id} className="flex justify-between py-2.5">
                    <p className="font-semibold text-sm">
                      {t(`confirmationPage.${labelKey}`)}
                    </p>
                    <p className="text-sm font-[500]">{value || '-'}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <button
            onClick={onStartNewRegistration}
            data-testid="new-registration-btn"
            className="bg-[#006DE7] w-[31%] text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer"
          >
            {t('confirmationPage.startNewRegistrationBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdditionalInfo {
  driverPicture: string;
  cpcFile: string;
}

interface ConfirmationDetails {
  picture?: string;
  fullName?: string;
  uin?: string;
  gender?: string;
  driverEmailId?: string;
  city?: string;
  phoneNumber?: string;
  driverLicenseNumber?: string;
  passportNumber?: string;
}

interface Company {
  id: string;
  company_name: string;
  registration_type?: string;
  registration_status?: string;
  registered_email?: string;
  name?: string;
  license_status?: string;
}