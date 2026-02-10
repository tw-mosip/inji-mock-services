import { useEffect, useState } from 'react';
import locationIcon from '../../assets/location_icon.png';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import tickIcon from '../../assets/confirmation_icon.png';
import relyingPartyService from '../../services/relyingPartyService';

export const ReviewPage = () => {
  const { t } = useTranslation('');
  const navigate = useNavigate();
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [reviewAndSubmitStatus, setReviewAndSubmitStatus] = useState(false);
  const [driverInformation, setDriverInformation] = useState<DriverInfo | null>(null);
  const [consignmentDetails, setConsignmentDetails] = useState<ConsigmentDetailsInfo | null>(null);
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetailsInfo | null>(null);
  const [journeyDetails, setJourneyDetails] = useState<JourneyDetailsInfo | null>(null);


  const { post_truckpass_details } = { ...relyingPartyService };

  const setLocalStoredData = (key: string, setItemDetails: (item: any) => void) => {
    const data = localStorage.getItem(key);
    if (data) {
      const storedData = JSON.parse(data);
      setItemDetails(storedData)
    }
  };

  useEffect(() => {
    setLocalStoredData('selectedDriver', setDriverInformation);
    setLocalStoredData('consignmentDetails', setConsignmentDetails);
    setLocalStoredData('vehicleDetails', setVehicleDetails);
    setLocalStoredData('journeyDetails', setJourneyDetails);
  }, []);

  const backToJourneyDetails = () => {
    navigate('/requestTruckpassProcess/journeyDetails');
    setReviewAndSubmitStatus(false);
    setShowSuccessScreen(false);
  }

  const confirmAndSubmit = async () => {
    const payload = {
      // Driver
      driverUin: driverInformation?.uin,
      driverName: driverInformation?.fullName,
      phoneNumber: driverInformation?.phoneNumber,
      gender: driverInformation?.gender,
      emailId: driverInformation?.driverEmailId,
      city: driverInformation?.city,
      faceImagePath: driverInformation?.faceImagePath,
      driverLicenseNumber: driverInformation?.driverLicenseNumber,
      passportNumber: driverInformation?.passportNumber,

      // Consignment
      invoiceNumber: consignmentDetails?.inVoiceNumber,
      cmrWaybill: consignmentDetails?.waybillNumber,
      customsDocumentation: consignmentDetails?.customDocument
          ? consignmentDetails.customDocument
          : "",
      weightCertificatePath: consignmentDetails?.weightCertificate
          ? consignmentDetails.weightCertificate
          : "",

      // Vehicle
      vehicleType: vehicleDetails?.vehicleType,
      axleSize: vehicleDetails?.axleSize,
      vehicleRegistrationDocsPath: vehicleDetails?.vehicleRegistrationDocsPath
          ? vehicleDetails.vehicleRegistrationDocsPath
          : "",
      truckLicensePlate: vehicleDetails?.truckLicensePlate,

      // Journey
      exporterName: journeyDetails?.exporterName,
      importerName: journeyDetails?.importerName,
      entryExitPoint: journeyDetails?.entryExitPoint,
      countryOrigin: journeyDetails?.countryOrigin,
      countryDestination: journeyDetails?.countryDestination,
      dateDeparture: journeyDetails?.dateDeparture,
      dateReturn: journeyDetails?.dateReturn,
    };

    try {
      const response = await post_truckpass_details(payload);

      if (response.status === 200 || response.status === 201) {
        setReviewAndSubmitStatus(false);
        setShowSuccessScreen(true);
      } else {
        console.error('Submission failed:', response.status, response.statusText);
      }
    } catch (error: any) {
      console.error('Error during submission:', error.message);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  const submitAnotherApplication = () => {
    navigate('/requestTruckpassProcess/requestedPassesDashboard')
  };

  const RegistrationSuccessPage = () => {
    return (
      <div className='flex flex-col gap-y-5 place-self-center items-center py-6 w-[40%]'>
        <img src={tickIcon} className='h-14 w-14' />
        <h1 className='text-xl font-semibold text-center'>{t('registrationSuccessPage.header')}</h1>
        <p className='text-sm font-[400] text-center'>{t('registrationSuccessPage.desc1')}</p>
        <p className='text-sm font-[400] text-center'>{t('registrationSuccessPage.desc2')}</p>
        <button onClick={submitAnotherApplication}
          className="bg-[#006DE7] px-3 py-2.5 text-sm font-[500] text-center rounded-[5px] text-white cursor-pointer my-9">
          {t('registrationSuccessPage.submitAnotherApplication')}
        </button>
      </div>
    )
  };

  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper
        searchDriverStatus={true}
        driverProfileStatus={true}
        consignmentDetailsStatus={true}
        vehicleDetailsStatus={true}
        journeyDetailsStatus={true}
        reviewAndSubmitStatus={reviewAndSubmitStatus}
      />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        {showSuccessScreen
          ? <RegistrationSuccessPage />
          : <>
            <div className='flex flex-col space-y-2'>
              <div className='flex space-x-3'>
                <img src={locationIcon} className='h-6 w-6' />
                <h1 className='font-[600] text-[18px]'>{t('reviewPage.journeyDetails')}</h1>
              </div>
              <p className='font-[400] text-[13px] text-[#000000]'>{t('reviewPage.subHead')}</p>
            </div>

            <div className='flex flex-col gap-y-9 mt-[2.5%]'>
              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('reviewPage.driverInformation')}</h1>
                  <div className='flex flex-row gap-x-[370px]'>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.fullName')}</span>{driverInformation?.fullName}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.uin')}</span>{driverInformation?.uin}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.email')}</span>{driverInformation?.driverEmailId}
                      </p>
                    </div>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.gender')}</span>{driverInformation?.gender}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.license')}</span>{driverInformation?.driverLicenseNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('reviewPage.consignmentDetails')}</h1>
                  <div className='flex flex-row gap-x-[370px]'>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.inVoiceNum')}</span>{consignmentDetails?.inVoiceNumber}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.weightCertificate')}</span>{consignmentDetails?.weightCertificate ? t('reviewPage.uploaded') : t('reviewPage.pending')}
                      </p>
                    </div>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.wayBill')}</span>{consignmentDetails?.waybillNumber}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.customsCertificate')}</span>{consignmentDetails?.customDocument ? t('reviewPage.uploaded') : t('reviewPage.pending')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('reviewPage.vehicleDetails')}</h1>
                  <div className='flex flex-row gap-x-[370px]'>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.type')}</span>{vehicleDetails?.vehicleType}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.licensePlate')}</span>{vehicleDetails?.truckLicensePlate}
                      </p>
                    </div>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.axleSize')}</span>{vehicleDetails?.axleSize}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.registrationDocs')}</span>{vehicleDetails?.vehicleRegistrationDocsPath ? t('reviewPage.uploaded') : t('reviewPage.pending')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('reviewPage.journeyDetails')}</h1>
                  <div className='flex flex-row gap-x-[350px]'>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.exporter')}</span>{journeyDetails?.exporterName}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.countryOfOrigin')}</span>{journeyDetails?.countryOrigin}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.departureDate')}</span>{journeyDetails?.dateDeparture}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.arrivalDate')}</span>{journeyDetails?.dateReturn}
                      </p>
                    </div>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.importer')}</span>{journeyDetails?.importerName}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.destination')}</span>{journeyDetails?.countryDestination}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.borderPoint')}</span>{journeyDetails?.dateReturn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-[#FFFBEC] border border-[#FFEDA7] rounded-md p-3 px-9'>
                <p className='text-xs text-[#E7711A]'>{t('reviewPage.warningInfo')}</p>
              </div>

              <div className="flex space-x-6 justify-end mb-6 mt-[3%]">
                <button onClick={() => backToJourneyDetails()}
                  className="bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer">
                  {t('commans.goBack')}
                </button>
                <button onClick={confirmAndSubmit}
                  className="bg-[#006DE7] w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer">
                  {t('commans.confirmAndSubmit')}
                </button>
              </div>
            </div>
          </>
        }

      </div>
    </div>
  )
}

interface DriverInfo {
  id?: number;
  fullName: string;
  gender?: string;
  uin?: string;
  phoneNumber?: string;
  driverEmailId?: string;
  city?: string
  passportNumber?: string;
  driverLicenseNumber?: string;
  faceImagePath?: string
};

interface ConsigmentDetailsInfo {
  inVoiceNumber?: string;
  waybillNumber?: string;
  weightCertificate?: string;
  customDocument?: string
};

interface VehicleDetailsInfo {
  vehicleType?: string;
  axleSize?: string;
  truckLicensePlate?: string;
  vehicleRegistrationDocsPath?: string;
};

interface JourneyDetailsInfo {
  countryOrigin?: string;
  exporterName?: string;
  dateDeparture?: string;
  entryExitPoint?: string;
  countryDestination?: string;
  importerName?: string;
  dateReturn?: string;
}

