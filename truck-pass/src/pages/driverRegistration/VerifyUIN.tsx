/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useExternalScript } from '../../hooks/useExternalScript';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import relyingPartyService from '../../services/relyingPartyService';
import eye_icon from "../../assets/eye_icon.png";
import eye_off from "../../assets/eye_off.png";
import poweredBy_logo from '../../assets/poweredby_esignet_logo.png';
import clientDetails from '../../constants/clientDetails';
import { DriverRegistrationStepper } from './DriverRegistrationStepper';

export const VerifyUIN: React.FC<VerifyUINProps> = ({ }) => {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [uinVerificationContinueBtn, setUinVerificationContinueBtn] = useState(false);
    const signInButtonScript = window._env_.SIGN_IN_BUTTON_PLUGIN_URL;
    const state = useExternalScript(signInButtonScript);
    const [searchParams] = useSearchParams();
    // const [uin, setUin] = useState('');
    const [showUIN, setShowUIN] = useState(false);
    const [verified] = useState(false);
    // const [errorCode, setErrorCode] = useState("");
    // const [errorMsg, setErrorMsg] = useState('');
    const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'already-registered' | 'unable-to-fetch-data'>('pending');

    const { post_fetchUserInfo } = {
        ...relyingPartyService,
    };

    // const navigateToLogin = (errorCode: string, errorDescription: string) => {
    //     let params = "?";
    //     if (errorDescription) {
    //         params = params + "error_description=" + errorDescription + "&";
    //     }

    //     //REQUIRED
    //     params = params + "error=" + errorCode;

    //     navigate(process.env.PUBLIC_URL + "/" + params, { replace: true });
    // };

    useEffect(() => {
        const getsearchparams = async () => {
            let authCode = searchParams.get("code");
            let errorCode = searchParams.get("error");
            // let error_desc = searchParams.get("error_description");
            const savedLang = localStorage.getItem("appLanguage");

            if (savedLang) {
                i18n.changeLanguage(savedLang);
            }
            
            if (errorCode) {
                // navigateToLogin(errorCode || '', error_desc || '');
                return;
            }

            if (authCode) {
                getUserDetails(authCode);
            } else {
                // setErrorCode("authCode_missing");
                return;
            }
        };
        getsearchparams();
    }, []);

    const getUserDetails = async (authCode: string) => {
        // setErrorMsg("");
        try {
            let client_id = clientDetails.clientId;
            let redirect_uri = clientDetails.redirect_uri_userprofile;
            let grant_type = clientDetails.grant_type;
            var userInfo = await post_fetchUserInfo(
                authCode,
                client_id,
                redirect_uri,
                grant_type
            )
            if (userInfo) {
                setVerificationStatus('verified');
            }
            else {
                setVerificationStatus('unable-to-fetch-data');
            }

            localStorage.setItem('driverInformation', JSON.stringify(userInfo));
        }
        catch (error) {
            console.error("Error in fetching the user details: ", error);
            if (error instanceof Error) {
                // setErrorMsg(error.message);
            } else {
                // setErrorMsg(String(error));
            }
        }
    };

    useEffect(() => {
        renderSignInButton();
    }, [state])

    const verifyAgain = () => {
        setVerificationStatus('pending');
        window.location.reload();
    };

    const renderSignInButton = () => {

        const oidcConfig = {
            authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
            redirect_uri: clientDetails.redirect_uri_userprofile,
            client_id: clientDetails.clientId,
            scope: clientDetails.scopeUserProfile,
            nonce: clientDetails.nonce,
            state: clientDetails.state,
            acr_values: clientDetails.acr_values,
            claims_locales: clientDetails.claims_locales,
            display: clientDetails.display,
            prompt: clientDetails.prompt,
            max_age: clientDetails.max_age,
            ui_locales: 'en',
            claims: JSON.parse(decodeURIComponent(clientDetails.userProfileClaims)),
        };

        (window as any).SignInWithEsignetButton?.init({
            oidcConfig: oidcConfig,
            buttonConfig: {
                shape: "soft_edges",
                labelText: t('uinVerification.verifyBtn'),
            },
            signInElement: document.getElementById("sign-in-with-esignet"),
        });
    }

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


    const renderStatusBlock = () => {
        switch (verificationStatus) {
            case 'pending':
                return (
                    <div className="flex flex-col bg-[#EEF7FF] border border-[#B9DDFD] space-y-2 rounded-lg p-4">
                        <h2 className="text-sm font-semibold text-[#006DE7]">{t('uinVerification.readyForVerfication')}</h2>
                        <p className="text-[12px] text-[#0059D4] font-[500]">{t('uinVerification.verificationReadyInfo')}</p>
                        {!verified &&
                            <div id='sign-in-with-esignet' className='w-full item-center'></div>
                        }
                        <img src={poweredBy_logo} alt="poweredBy_logo" className="h-7 w-[20%] pt-1" />
                    </div>
                );
            case 'verified':
                const uin = "8769123460";
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
                                {t('uinVerification.uinFetched')}&nbsp;{displayValue(uin, showUIN)}
                                <img
                                    src={showUIN ? eye_off : eye_icon}
                                    alt={showUIN ? "Hide UIN" : "Show UIN"}
                                    className={`ml-2 ${showUIN ? 'h-4 cursor-pointer' : 'h-3 cursor-pointer'}`}
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

            //The case when  already driver was registered with the same UIN 
            case 'already-registered':
                return (
                    <div className="flex flex-col bg-[#FFF7E8] border border-[#FFE7B7] space-y-2 rounded-lg p-4">
                        <h2 className="text-sm font-semibold text-[#C4320A]">{t('uinVerification.uinAlreadyRegistered')}</h2>
                        <div className="bg-white border border-[#FFE7B7] rounded-md px-3 py-2 flex justify-between items-center text-sm text-[#C4320A] font-semibold">
                            {t('')} <span className="text-[#0059D4] flex items-center">
                                {t('uinVerification.uinFetched')}&nbsp;{displayValue("276301076687", showUIN)}
                                <img
                                    src={showUIN ? eye_off : eye_icon}
                                    alt={showUIN ? "Hide UIN" : "Show UIN"}
                                    className={`ml-2 ${showUIN ? 'h-4 cursor-pointer' : 'h-3 cursor-pointer'}`}
                                    onClick={() => setShowUIN(prev => !prev)}
                                />
                            </span>
                        </div>
                        <p className="text-[12px] text-[#C4320A] font-[500]">{t('uinVerification.alreadyRegisteredInfo')}</p>
                        <img src={poweredBy_logo} alt="poweredBy_logo" className="h-7 w-[20%] pt-1" />
                    </div>
                );

            //The case when unable-to-fetch-data UI for the useCase of now for our convience
            case 'unable-to-fetch-data':
                return (
                    <div className="flex flex-col bg-[#f87373] border border-[#fbb7b7] space-y-2 rounded-lg p-4">
                        <h2 className="text-sm font-semibold text-[#a80414]">{t('Unable to fetch the data')}</h2>
                        <div className="bg-pink-600 border border-[#FFE7B7] rounded-md px-3 py-2 flex justify-between items-center text-sm text-[#ee8263] font-semibold">
                            {t('')} <span className="text-[#f62d63] flex items-center">
                            </span>
                        </div>
                        <p className="text-[12px] text-[#ea9e89] font-[500]">{t('uinVerification.unableToFetchInfo')}</p>
                        <img src={poweredBy_logo} alt="poweredBy_logo" className="h-7 w-[20%] pt-1" />
                    </div>
                )

            default:
                return null;
        }
    };

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            <DriverRegistrationStepper
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
                    {(verificationStatus === 'already-registered' || verificationStatus === 'unable-to-fetch-data') ? (
                        <button
                            onClick={verifyAgain}
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