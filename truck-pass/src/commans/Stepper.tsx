import React, { useEffect, useState } from 'react';
import connector_icon from "../assets/connector_icon.png";
import tick_icon from "../assets/tick_icon.png";
import { useTranslation } from 'react-i18next';

export const Stepper: React.FC<StepperProps> = ({ consentStatus, selectCompanyStatus, uinVerificationStatus, registrationStatus, confirmationStatus }) => {
    
    const { t } = useTranslation();
    const consentAgreed = consentStatus;
    const companySelected = selectCompanyStatus;
    const uinVerified = uinVerificationStatus;
    const registrationCompleted = registrationStatus;
    const confirmed = confirmationStatus;

    const registrationProcessItems = [
        { id: 1, title: t('stepper.consentAndAgreement'), inProgress: !consentAgreed, completed: consentAgreed },
        { id: 2, title: t('stepper.selectCompany'), inProgress: (consentAgreed && !companySelected), completed: companySelected },
        { id: 3, title: t('stepper.uinVerification'), inProgress: (companySelected && !uinVerified), completed: uinVerified },
        { id: 4, title: t('stepper.registration'), inProgress: (uinVerified && !registrationCompleted), completed: registrationCompleted },
        { id: 5, title: t('stepper.submitApplication'), inProgress: (registrationCompleted && !confirmed), completed: confirmed },
        { id: 6, title: t('stepper.confirmation'), inProgress: false, completed: confirmed },
    ]
    return (
        <div className='flex flex-col bg-[#F9FAFB] h-auto w-[48%] px-9 pt-5 pb-14 rounded-bl-2xl rounded-tl-2xl'>
            <h3 className='font-[500] text-[22px] mb-8'>{t('stepper.registrationProcess')}</h3>
            {registrationProcessItems.map((item, i) => {
                return (
                    <div key={i} className=' flex gap-x-3'>
                        <div className='flex flex-col items-center'>
                            {item.completed
                                ? <img src={tick_icon} alt="tick_icon" className='h-6' />
                                : <p className={`text-sm px-2.5 py-0.5 rounded-4xl ${item.inProgress ? "bg-[#006DE7] text-white" : "bg-[#E5E7EB] text-[#747D89]"} `}>{item.id}</p>
                            }
                            <img src={connector_icon} alt="connector_icon" className={`h-14 w-0.5 ${item.id === 6 && "hidden"}`} />
                        </div>
                        <div className='flex flex-col'>
                            <p className={`text-sm font-[600] ${item.inProgress ? "text-[#006DE7]" : (item.completed ? "text-[#079455]" : "text-[#747D89]")}`}>{item.title}</p>

                            {item.inProgress
                                ? <p className={`text-[#535862] text-xs font-[300]`}>{t('commans.inProgress')}</p>
                                : (item.completed ? <p className={`text-[#535862] text-xs font-[300]`}>{t('commans.completed')}</p> : <p></p>)

                            }
                        </div>
                    </div>
                )
            })
            }

        </div>
    )
}

interface StepperProps {
    consentStatus: boolean,
    selectCompanyStatus: boolean,
    uinVerificationStatus: boolean,
    registrationStatus: boolean,
    confirmationStatus: boolean
}
