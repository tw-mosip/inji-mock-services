import { useState } from "react";
import consent_terms_icon from "../../assets/terms_icon.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Stepper } from "../../commans/Stepper";

export const ConsentAndAgreementPage: React.FC<ConsentAndAgreementPageProps> = ({ }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [checkBox, setCheckBox] = useState(false);
    const [getStartedBtn, setGetStartedBtn] = useState(false);


    const movetoSelectCompany = () => {
        setGetStartedBtn(true);
        navigate('/driverRegistrationProcessPage/selectCompanyPage');
    }

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            <Stepper
                consentStatus={getStartedBtn}
                selectCompanyStatus={false}
                uinVerificationStatus={false}
                registrationStatus={false}
                confirmationStatus={false}
            />

            <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
                <div className="space-y-4 ">
                    <h1 className="font-semibold text-[22px]">{t('consentAndAgreementPage.consentAndAgreementTitle')}</h1>
                    <p className="text-[15px]">{t('consentAndAgreementPage.consentAndAgreementDesc')}</p>

                    <div className="h-auto border border-[#E2E8F0] rounded-lg p-4">
                        <div className="flex gap-x-2">
                            <img src={consent_terms_icon} alt="consent_terms_icon" className="h-5.5" />
                            <p className="font-semibold text-normal">{t('consentAndAgreementPage.termsAndConditions')}</p>
                        </div>
                        <p className="text-[13px] text-[#64748B] pt-1.5 pb-4">{t('consentAndAgreementPage.termsAndConditionsInfo')}</p>
                        <div className="flex items-start gap-x-2">
                            <input type="checkbox" className="border mt-1 cursor-pointer" onClick={() => setCheckBox(!checkBox)} />
                            <div className="flex flex-col gap-y-6">
                                <p className="text-[10px] text-[#020817]">
                                    {t('consentAndAgreementPage.consentPara1')}
                                </p>
                                <p className="text-[10px] text-[#020817]">
                                    {t('consentAndAgreementPage.consentPara2')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <button disabled={!checkBox} onClick={movetoSelectCompany}
                    className={`${checkBox ? "bg-[#006DE7] cursor-pointer" : "bg-[#B0B0B0] cursor-default"} w-[54%] text-sm font-[600] place-self-end align-bottom py-2 text-center rounded-[5px] text-[#FFFFFF] `}>
                    {t('consentAndAgreementPage.getStarted')}
                </button>
            </div>
        </div>
    )
}

interface ConsentAndAgreementPageProps {

}

