import React, { useState } from 'react';
import { Stepper } from '../commans/Stepper';
import { ConsentAndAgreementPage } from '../pages/driverRegistration/ConsentAndAgreementPage';
import { SelectCompany } from '../pages/driverRegistration/SelectCompany';
import { UinVerification } from '../pages/driverRegistration/UinVerification';
import { Registration } from '../pages/driverRegistration/Registration';
import { RegistrationLoader } from '../pages/driverRegistration/RegistrationLoader';
import { ConfirmationPage } from '../pages/driverRegistration/ConfirmationPage';

export const DriverRegistrationFlow: React.FC = () => {
    const [getStartedBtn, setGetStartedBtn] = useState(false);
    const [selectionPageContinueBtn, setSelectionPageContinueBtn] = useState(false);
    const [uinVerificationContinueBtn, setUinVerificationContinueBtn] = useState(false);
    const [registrationSubmitBtn, setRegistrationSubmitBtn] = useState(false);
    const [confirmationBtn, setConfirmationBtn] = useState(false);

    return (
        <div className="flex w-[72%] shadow-lg place-self-center rounded-2xl">
            <Stepper
                consentStatus={getStartedBtn}
                selectCompanyStatus={selectionPageContinueBtn}
                uinVerificationStatus={uinVerificationContinueBtn}
                registrationStatus={registrationSubmitBtn}
                confirmationStatus={confirmationBtn}
            />

            {!getStartedBtn &&
                <ConsentAndAgreementPage setGetStartedBtn={setGetStartedBtn} />
            }

            {getStartedBtn && !selectionPageContinueBtn &&
                <SelectCompany setSelectionPageContinueBtn={setSelectionPageContinueBtn} />
            }

            {selectionPageContinueBtn && !uinVerificationContinueBtn &&
                <UinVerification
                    setSelectionPageContinueBtn = {setSelectionPageContinueBtn}
                    setUinVerificationContinueBtn={setUinVerificationContinueBtn}
                />
            }

            {uinVerificationContinueBtn && !registrationSubmitBtn &&
                <Registration 
                setUinVerificationContinueBtn={setUinVerificationContinueBtn}
                setRegistrationSubmitBtn={setRegistrationSubmitBtn} 
                />
            }

            {registrationSubmitBtn && !confirmationBtn &&
                <RegistrationLoader setConfirmationBtn={setConfirmationBtn} />
            }

            {confirmationBtn &&
                <ConfirmationPage />
            }

        </div>
    )
}
