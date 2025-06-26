import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import clientDetails from '../../constants/clientDetails';
import { useExternalScript } from '../../hooks/useExternalScript';
import poweredBy_logo from '../../assets/poweredby_esignet_logo.png';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../commans/Stepper';

export const VerifyUIN: React.FC<VerifyUinProps> = ({ }) => {

    const [verified, setVerified] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [uinVerificationContinueBtn, setUinVerificationContinueBtn] = useState(false);



    const moveToSelectCompanyPage = () => {
        navigate('/driverRegistrationProcessPage/selectCompanyPage');
        setUinVerificationContinueBtn(false);
    };

    const moveToRegistrationPage = () => {
        navigate('/driverRegistrationProcessPage/registrationPage');
        setUinVerificationContinueBtn(true);
    };

    const LoadingIndicator: React.FC = () => {
        return (
            <div className="flex justify-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-600"></div>
            </div>
        );
    };

    // const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
    // const state = useExternalScript(signInButtonScript);

    // useEffect(() => {
    //     renderSignInButton();
    // }, [state])

    // if (!window._env_) return <LoadingIndicator />;

    // const renderSignInButton = () => {

    //     const oidcConfig = {
    //         authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
    //         redirect_uri: clientDetails.redirect_uri_userprofile,
    //         client_id: clientDetails.clientId,
    //         scope: clientDetails.scopeUserProfile,
    //         nonce: clientDetails.nonce,
    //         state: clientDetails.state,
    //         acr_values: clientDetails.acr_values,
    //         claims_locales: clientDetails.claims_locales,
    //         display: clientDetails.display,
    //         prompt: clientDetails.prompt,
    //         max_age: clientDetails.max_age,
    //         ui_locales: 'en',
    //         claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
    //     };

    //     (window as any).SignInWithEsignetButton?.init({
    //         oidcConfig: oidcConfig,
    //         buttonConfig: {
    //             shape: "soft_edges",
    //             labelText: t('uinVerification.verifyBtn'),
    //         },
    //         signInElement: document.getElementById("sign-in-with-esignet"),
    //     });
    // }

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            <Stepper
                consentStatus={true}
                selectCompanyStatus={true}
                uinVerificationStatus={uinVerificationContinueBtn}
                registrationStatus={false}
                confirmationStatus={false}
            />
            <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
                <div className="space-y-4">
                    <h1 className="font-semibold text-[22px]">{t('uinVerification.uinVerification')}</h1>

                    <div className={`flex flex-col ${verified ? 'bg-[#EFFDF5] border-[#B3F6D2]' : 'bg-[#EEF7FF] border-[#B9DDFD]'} space-y-2 h-auto border rounded-lg p-4`}>
                        <h2 className={`text-sm font-semibold ${verified ? 'text-[#007F41]' : 'text-[#006DE7]'}`}>{verified ? t('uinVerification.verifiedSuccessFully') : t('uinVerification.readyForVerfication')}</h2>
                        <p className={`text-[12px] ${verified ? 'text-[#007F41]' : 'text-[#0059D4]'} font-[500]`}>
                            {verified ? t('uinVerification.verifiedInfo') : t('uinVerification.verificationReadyInfo')}
                        </p>
                        {/* {!verified &&
                            <div id='sign-in-with-esignet' className='w-full item-center'></div>
                        } */}
                        <img src={poweredBy_logo} alt="poweredBy_logo" className='h-7 w-[20%] pt-1' />
                    </div>

                </div>
                <div className='flex space-x-2 justify-end'>
                    <button onClick={moveToSelectCompanyPage}
                        className={`bg-transparent w-[21%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`}>
                        {t('commans.goBack')}
                    </button>
                    <button disabled={false} onClick={moveToRegistrationPage}
                        className={`${verified ? "bg-[#006DE7] cursor-pointer" : "bg-[#B0B0B0] focus:shadow-md cursor-pointer"}} w-[33%] text-xs font-[600] py-2.5 text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                        {t('commans.continue')}
                    </button>
                </div>
            </div>
        </div>
    )
}

interface VerifyUinProps {

}
