import React from "react";
import { DriverRegistrationFlow } from "../../shared/DriverRegistrationFlow";
import { useTranslation } from "react-i18next";

const DriverRegistrationProcess: React.FC<DriverRegistrationProcessProps> = ({ children }) => {

  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-[#ECF5FF] w-full items-center pt-12 gap-y-10 font-inter h-auto">

      <div className="flex  flex-col space-y-2 items-center place-self-center">
        <h1 className="text-3xl font-semibold">{t('driverRegistrationProcess.processMainTitle')}</h1>
        <p className="text-base">{t('driverRegistrationProcess.respDescription')}</p>
      </div>

      <div className="bg-[url('../assets/landingPage_bg.png')] w-full">
        <DriverRegistrationFlow
          children={children}
        />

        {/* Footer */}
        <footer className='text-sm text-[#717171] place-self-center bg-transparent py-16 font-inter'>
          {t('footer.footerText')}
        </footer>
        {/* Footer */}
      </div>
    </div>
  )
}

export default DriverRegistrationProcess;

interface DriverRegistrationProcessProps {
  children: any;
}