import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import helpIcon from '../../assets/help_icon.png';
import vehicleIcon from '../../assets/truck_icon.png';
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import { DropDownSelection } from '../../components/DropDownSelection';
import Tooltip from '../../components/Tooltip';

export const VehicleDetails = () => {
  const { t } = useTranslation('');
  const navigate = useNavigate();
  const [selectedVehicleType, setSelectedVehicleType] = useState<any>(null);
  const [selectedAxleSize, setSelectedAxleSize] = useState<any>(null);
  const [truckLicensePlate, setTruckLicensePlate] = useState('');
  const [truckLicensePlateErrorMsg, setTruckLicensePlateErrorMsg] = useState('');
  const [vehicleRegDocumentUploading, setVehicleRegDocumentUploading] = useState(false);
  const [vehicleRegDocumentUploaded, setVehicleRegDocumentUploaded] = useState(false);
  const [vehicleRegDocumentData, setVehicleRegDocumentData] = useState<string | null>(null);
  const [vehicleRegDocUploadErrorMsg, setvehicleRegDocErrorMsg] = useState('')
  const [vehicleDetailsStatus, setVehicleDetailsStatus] = useState(false);

  const vehicleTypes = [
    { id: 0, type: 'Light Commercial Vehicle' },
    { id: 1, type: 'Medium Commercial Vehicle' },
    { id: 2, type: 'Heavy Commercial Vehicle' },
    { id: 3, type: 'Trailer' },
    { id: 4, type: 'Container Truck' }
  ];
  const axleSizes = [
    { id: 0, size: '2 axle', },
    { id: 1, size: '3 axle' },
    { id: 2, size: '4 axle' },
    { id: 3, size: '5 axle' },
    { id: 4, size: '6+ axle' }
  ];

  const handleTruckLicensePlate = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setTruckLicensePlate(e.target.value);
  };

  const backToConsignmentDetails = () => {
    setVehicleDetailsStatus(false);
    navigate('/requestTruckpassProcess/consignmentDetails');
  }

  const moveToJourneyDetails = () => {
    const vehicleDetails = {
      vehicleType: selectedVehicleType?.type,
      axleSize: selectedAxleSize?.size,
      truckLicensePlate: truckLicensePlate,
      vehicleRegistrationDocument: vehicleRegDocumentData || ''
    }
    localStorage.setItem('vehicleDetails', JSON.stringify(vehicleDetails))
    setVehicleDetailsStatus(true);
    navigate('/requestTruckpassProcess/journeyDetails');
  }

  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper
        searchDriverStatus={true}
        driverProfileStatus={true}
        consignmentDetailsStatus={true}
        vehicleDetailsStatus={vehicleDetailsStatus}
        journeyDetailsStatus={false}
        reviewAndSubmitStatus={false}
      />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        <div className='flex space-x-3 items-center'>
          <img src={vehicleIcon} className='h-6' />
          <h1 className='font-[600] text-[18px]'>{t('vehicleDetails.header')}</h1>
        </div>

        <div className='flex flex-wrap justify-between'>
          <div className="relative w-[48%]">
            <label className='flex items-center mb-2'>
              <p className='text-sm text-[#414651]'>{t('vehicleDetails.vehicleType')}<span className='text-[#006DE7]'> *</span> </p>
              <Tooltip helpText={t('vehicleDetails.vehicleTypeTooltip')} />
            </label>
            <DropDownSelection
              selectingVehicleType={true}
              data={vehicleTypes}
              setItemSelected={setSelectedVehicleType}
              placeHolder={t('vehicleDetails.selectVehicleType')}
            />
          </div>

          <div className="relative w-[48%]">
            <label className='flex items-center mb-2'>
              <p className='text-sm text-[#414651]'>{t('vehicleDetails.axleSize')}<span className='text-[#006DE7]'> *</span> </p>
              <Tooltip helpText={t('vehicleDetails.axleSizeTooltip')} />
            </label>
            <DropDownSelection
              selectingAxelSize={true}
              data={axleSizes}
              setItemSelected={setSelectedAxleSize}
              placeHolder={t('vehicleDetails.selectAxleSize')}
            />
          </div>
        </div>

        <div className='flex flex-col w-full mb-6'>
          <label className='flex items-center'>
            <p className='text-sm text-[#414651]'>{t('vehicleDetails.truckLicensePlate')}<span className='text-[#006DE7]'> *</span> </p>
            <Tooltip helpText={t('vehicleDetails.truckLicensePlateTooltip')} />
          </label>
          <input
            type='text'
            placeholder='e.g., ABC-1223'
            value={truckLicensePlate}
            onChange={handleTruckLicensePlate}
            className={`${!truckLicensePlate ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${truckLicensePlateErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
          />
          {truckLicensePlateErrorMsg && <p className='text-xs text-[#D92D20]'>{truckLicensePlateErrorMsg}</p>}
        </div>

        <div className='flex flex-col w-full'>
          <label className='flex gap-x-1 items-center mb-3'>
            <p className='text-sm text-[#414651]'>{t('vehicleDetails.vehicleRegistrationDocuments')}</p>
            <Tooltip helpText={t('vehicleDetails.vehicleRegistrationDocTooltip')} />
          </label>
          <CertificateUploadingSection
            vehicleRegistrationDocument={true}
            showUploadingBlock={vehicleRegDocumentUploading}
            setShowUploadingBlock={setVehicleRegDocumentUploading}
            clickableText={t('vehicleDetails.uploadRegistrationDocument')}
            setFileUploaded={setVehicleRegDocumentUploaded}
            setDataInFile={setVehicleRegDocumentData}
            fileUploadErrorMsg={vehicleRegDocUploadErrorMsg}
            setFileUploadErrorMsg={setvehicleRegDocErrorMsg}
          />
        </div>
        <div className="flex space-x-6 justify-end mb-6 mt-[10%]">
          <button onClick={() => backToConsignmentDetails()}
            className="bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer"
          >
            {t('commans.goBack')}
          </button>
          <button disabled={!selectedVehicleType || !selectedAxleSize || !truckLicensePlate || !vehicleRegDocumentUploaded} onClick={() => moveToJourneyDetails()}
            className={`${(selectedVehicleType && selectedAxleSize && truckLicensePlate && vehicleRegDocumentUploaded) ? "bg-[#006DE7] cursor-pointer" : "bg-[#C2C2C2] cursor-default"} 
             w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white`}
          >
            {t('commans.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
