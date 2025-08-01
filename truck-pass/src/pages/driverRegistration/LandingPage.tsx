import { useNavigate } from "react-router-dom";
import { useState } from "react";
import line_pattern_left from "../../assets/Line_Pattern_Left.png";
import line_pattern_right from "../../assets/Line_Pattern_Right.png";
import driver_user_icon from "../../assets/driver_user_icon.png";
import user_01 from "../../assets/user_01.png";
import credit_card_02 from "../../assets/credit_card_02.png";
import request_truck_pass_icon from "../../assets/request_truck_pass_icon.png";
import application_submit_icon from "../../assets/application_submit_icon.png";
import verfication_icon from "../../assets/verfication_icon.png";
import approval_issuance_icon from "../../assets/approval_issuance_icon.png";
import truck_icon from "../../assets/truck_icon.png";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isHovered, setIsHovered] = useState(false);
  const [isTruckPassHovered, setIsTruckPassHovered] = useState(false);

  const moveToDriverRegistration = () => {
    navigate('/driverRegistrationProcessPage/consentAndAgreementPage');
  };

  const streamlinedProcess = [
    {
      id: 1,
      icon: application_submit_icon,
      title: t('landingPage.subApplication'),
      subTitle: t('landingPage.subApplicationInfo'),
      testId: 'step-sub-application',
    },
    {
      id: 2,
      icon: verfication_icon,
      title: t('landingPage.securityVerification'),
      subTitle: t('landingPage.securityVerificationInfo'),
      testId: 'step-security-verification',
    },
    {
      id: 3,
      icon: approval_issuance_icon,
      title: t('landingPage.approvalAndIssuance'),
      subTitle: t('landingPage.approvalAndIssuanceInfo'),
      testId: 'step-approval-and-issuance',
    },
    {
      id: 4,
      icon: truck_icon,
      title: t('landingPage.crossBorder'),
      subTitle: t('landingPage.crossBorderInfo'),
      testId: 'step-cross-border',
    }
  ];

  return (
    <>
      <div className="flex flex-col font-inter items-center space-y-11 font-inter">
        <div className="flex items-center justify-between bg-[#004DA3] rounded-[12px] text-center w-[85%] h-auto">
          <img src={line_pattern_left} className="h-[290px] w-[15%] -ml-[100px] mb-[3%]" alt="Line Pattern Left" />
          <div className="flex flex-col text-center w-[50%] gap-y-10">
            <p className="text-4xl text-[#FFFFFF] font-[500] px-20">{t('landingPage.landingPageTitle')}</p>
            <p className="text-[15px] text-[#E1EFFF]">{t('landingPage.landingPageSubTitle')}</p>
          </div>
          <img src={line_pattern_right} className="h-[290px] w-[15%] -mr-[100px] -mb-[7%]" alt="Line Pattern Right" />
        </div>

        <div className="bg-[#ECF5FF] w-full h-[480px]">
          <div className="flex flex-col w-full items-center mt-14 pb-[38px] space-y-8 bg-[url('../assets/landingPage_bg.png')] h-[400px]">
            <p className="text-2xl text-[#181D27] font-[500]">{t('landingPage.getStartedToday')}</p>
            <div className="flex place-self-center space-x-10">
              <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="flex flex-col bg-[#FFFFFF] w-[380px] h-auto border border-transparent hover:border-[#006DE7] rounded-xl items-center py-7 shadow-2xl space-y-5 text-center justify-between transition duration-300 ease-in-out"
              >
                <img
                  src={isHovered ? user_01 : driver_user_icon}
                  className={`h-10 border border-[#D3E8FF] p-2 rounded-md shadow-lg transition duration-300 ease-in-out ${isHovered ? 'bg-[#006DE7]' : 'bg-[#F5F7FA]'}`}
                  alt="Driver Icon"
                />
                <p className="font-[600]">{t('landingPage.driverRegistration')}</p>
                <p className="text-[12px]">{t('landingPage.driverRegSubTitle')}</p>
                <p
                  onClick={moveToDriverRegistration}
                  className="bg-[#006DE7] w-[90%] text-[10px] font-[600] py-[2%] text-center rounded-[5px] text-[#FFFFFF] cursor-pointer"
                >
                  {t('landingPage.registerAsDriver')}
                </p>
              </div>

              <div
                onMouseEnter={() => setIsTruckPassHovered(true)}
                onMouseLeave={() => setIsTruckPassHovered(false)}
                className="flex flex-col bg-[#FFFFFF] w-[380px] h-auto border border-transparent hover:border-[#006DE7] rounded-xl items-center py-7 shadow-2xl space-y-5 text-center justify-between transition duration-300 ease-in-out"
              >
                <img
                  src={isTruckPassHovered ? credit_card_02 : request_truck_pass_icon}
                  className={`h-10 border border-[#D3E8FF] p-2 rounded-md shadow-lg transition duration-300 ease-in-out ${isTruckPassHovered ? 'bg-[#006DE7]' : 'bg-[#F5F7FA]'}`}
                  alt="Truck Pass Icon"
                />
                <p className="font-[600]" data-testid="request-truck-pass-title">{t('landingPage.requestTruckPass')}</p>
                <p className="text-[12px]">{t('landingPage.requestTruckPassSubTitle')}</p>
                <p
                  onClick={() => navigate('/truckpasslogin')}
                  className="bg-[#006DE7] w-[90%] text-[10px] font-[600] py-[2%] text-center rounded-[5px] text-[#FFFFFF] cursor-pointer"
                >
                  {t('landingPage.login')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full space-y-4">
          <p className="text-[20px] text-[#181D27] font-[600]">{t('landingPage.howItWorks')}</p>
          <p className="text-[13px]">{t('landingPage.landingPageInfo')}</p>

          <div className="flex space-x-[4%] mt-[3%] justify-evenly px-[14%]">
            {streamlinedProcess.map((item, index) => (
              <div key={index} className="flex flex-col space-y-4 items-center w-[18%] text-center">
                <img src={item.icon} className="h-10 border-0 p-2 rounded-md shadow-lg" alt={`Step ${index + 1}`} />
                <p className="text-[13px] font-[700]" data-testid={item.testId}>{item.title}</p>
                <p className="text-[11px]">{item.subTitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-sm text-[#717171] place-self-center pt-12 pb-6 bg-transparent font-inter">
        {t('footer.footerText')}
      </footer>
      {/* Footer */}
    </>
  );
};

export default LandingPage;
