import { useEffect, useState } from 'react';
import locationIcon from '../../assets/location_icon.png';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import tickIcon from '../../assets/confirmation_icon.png';
import { base64ToFile } from '../../commans/AppUtilities';
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


  const { post_driver_details } = { ...relyingPartyService };

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
      driverUin: driverInformation?.uin,
      driverName: driverInformation?.fullName,
      phoneNumber: driverInformation?.phoneNumber,
      gender: driverInformation?.gender,
      emailId: driverInformation?.emailId,
      city: driverInformation?.city,
      faceImagePath: driverInformation?.faceImagePath,  //Convert into actual file using base64ToFile before posting as like other documents.
      driverLicenseNumber: vehicleDetails?.truckLicensePlate,
      passportNumber: driverInformation?.passportNumber,

      invoiceNumber: consignmentDetails?.inVoiceNumber,
      cmrWaybill: consignmentDetails?.waybillNumber,
      customsDocumentation: consignmentDetails?.customDocument ? base64ToFile(consignmentDetails?.customDocument, 'customDocument.pdf') : '',
      weightCertificatePath: consignmentDetails?.weightCertificate ? base64ToFile(consignmentDetails?.weightCertificate, 'weightCertificate.pdf') : '',

      vehicleType: vehicleDetails?.vehicleType,
      axleSize: vehicleDetails?.axleSize,
      vehicleRegistrationDocsPath: vehicleDetails?.vehicleRegistrationDocument ? base64ToFile(vehicleDetails?.vehicleRegistrationDocument, 'vehicleRegistrationDocument.pdf') : '',
      truckLicensePlate: vehicleDetails?.truckLicensePlate,

      exporterName: journeyDetails?.exporterCompany,
      importerName: journeyDetails?.importerCompany,
      entryExitPoint: journeyDetails?.borderOfArrival,
      countryOrigin: journeyDetails?.originCountry,
      countryDestination: journeyDetails?.destinationCountry,
      dateDeparture: journeyDetails?.dateOfDeparture,
      dateReturn: journeyDetails?.dateOfArrival,
    };

    // try {
    //   const response = await post_driver_details(payload);

    //   if (response.status === 200 || response.status === 201) {
    //     setReviewAndSubmitStatus(false);
    //     setShowSuccessScreen(true);
    //   } else {
    //     console.error('Submission failed:', response.status, response.statusText);
    //   }
    // } catch (error: any) {
    //   console.error('Error during submission:', error.message);
    //   if (error.response) {
    //     console.error('Server response:', error.response.data);
    //   }
    // }

    setReviewAndSubmitStatus(false);
    setShowSuccessScreen(true);
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
                        <span className='font-[600]'>{t('reviewPage.email')}</span>{driverInformation?.emailId}
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
                        <span className='font-[600]'>{t('reviewPage.registrationDocs')}</span>{vehicleDetails?.vehicleRegistrationDocument ? t('reviewPage.uploaded') : t('reviewPage.pending')}
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
                        <span className='font-[600]'>{t('reviewPage.exporter')}</span>{journeyDetails?.exporterCompany}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.countryOfOrigin')}</span>{journeyDetails?.originCountry}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.departureDate')}</span>{journeyDetails?.dateOfDeparture}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.arrivalDate')}</span>{journeyDetails?.dateOfArrival}
                      </p>
                    </div>
                    <div className='flex flex-col space-y-4'>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.importer')}</span>{journeyDetails?.importerCompany}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.destination')}</span>{journeyDetails?.destinationCountry}
                      </p>
                      <p className='text-[14px]'>
                        <span className='font-[600]'>{t('reviewPage.borderPoint')}</span>{journeyDetails?.borderOfArrival}
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
  emailId?: string;
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
  vehicleRegistrationDocument?: string;
};

interface JourneyDetailsInfo {
  originCountry?: string;
  exporterCompany?: string;
  dateOfDeparture?: string;
  borderOfDeparture?: string;
  destinationCountry?: string;
  importerCompany?: string;
  dateOfArrival?: string;
  borderOfArrival?: string;
}

