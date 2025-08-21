import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import helpIcon from '../../assets/help_icon.png';
import vehicleIcon from '../../assets/truck_icon.png';
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';

export const VehicleDetails = () => {
  const { t } = useTranslation('');
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleTypeErrorMsg, setVehicleTypeErrorMsg] = useState('');
  const [axleSize, setAxleSize] = useState('');
  const [axleSizeErrorMsg, setAxleSizeErrorMsg] = useState('');
  const [truckLicensePlate, setTruckLicensePlate] = useState('');
  const [truckLicensePlateErrorMsg, setTruckLicensePlateErrorMsg] = useState('');
  const [vehicleRegDocumentUploading, setVehicleRegDocumentUploading] = useState(false);
  const [vehicleRegDocumentUploaded, setVehicleRegDocumentUploaded] = useState(false);
  const [vehicleRegDocumentData, setVehicleRegDocumentData] = useState<string | null>(null);
  const [vehicleRegDocUploadErrorMsg, setvehicleRegDocErrorMsg] = useState('')

  const vehicleTypes = ['Light Commercial Vehicle', 'Medium Commercial Vehicle', 'Heavy Commercial Vehicle', 'Trailer', 'Container Truck'];
  const axleSizes = ['2 axle', '3 axle', '4 axle', '5 axle', '6+ axle'];

  const handleVehicleType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVehicleType(e.target.value);
  };

  const handleAxleSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAxleSize(e.target.value);
  };

  const handleTruckLicensePlate = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setTruckLicensePlate(e.target.value);
  };

  const backToConsignmentDetails = () => {
    navigate('/requestTruckpassProcess/consignmentDetails');
  }

  const moveToJourneyDetails = () => {
    if (!vehicleType || !axleSize || !truckLicensePlate.includes('-')) {
      if (!vehicleType) {
        setVehicleTypeErrorMsg(t('*Please select any Vehicle Type'));
      }
      else { setVehicleTypeErrorMsg('') }
      if (!axleSize) {
        setAxleSizeErrorMsg(t('*Please select any Axle Size'));
      }
      else { setAxleSizeErrorMsg('') }
      if (!truckLicensePlate.includes('-')) {
        setTruckLicensePlateErrorMsg(t("*Truck License Plate  must include a '-' (e.g., INV-2024-001)."));
      }
      else { setTruckLicensePlateErrorMsg('') }
      return;
    };
    navigate('/requestTruckpassProcess/journeyDetails');
  }


  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        <div className='flex space-x-3 items-center'>
          <img src={vehicleIcon} className='h-6' />
          <h1 className='font-[600] text-[18px]'>{t('Vehicle Details')}</h1>
        </div>

        <div className='flex flex-wrap justify-between'>
          <div className='flex flex-col w-[570px] mb-6'>
            <label htmlFor='vehicle-type' className='flex items-center'>
              <p className='text-sm text-[#414651]'>{t('Vehicle Type')}<span className='text-[#006DE7]'> *</span> </p>
              <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
            </label>
            <select
              id="vehicle-type"
              name="vehicle-type"
              value={vehicleType}
              onChange={handleVehicleType}
              className={`${!vehicleType ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${vehicleTypeErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
            >
              <option value="" disabled>{t('Select Vehicle Type')}</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type} className='text-[#000000] text-[15px] bg-[#FFFFFF]' onClick={() => setVehicleType(type)}>
                  {type}
                </option>
              ))}
            </select>
            {vehicleTypeErrorMsg && <p className='text-xs text-[#D92D20]'>{vehicleTypeErrorMsg}</p>}
          </div>

          <div className='flex flex-col w-[570px] mb-6'>
            <label htmlFor='axle-size' className='flex items-center'>
              <p className='text-sm text-[#414651]'>{t('Axle Size')}<span className='text-[#006DE7]'> *</span> </p>
              <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
            </label>
            <select
              id="axle-size"
              name="axle-size"
              value={axleSize}
              onChange={handleAxleSize}
              className={`${!axleSize ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${axleSizeErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
            >
              <option value="" disabled>{t('Select axle size')}</option>
              {axleSizes.map((axleSize) => (
                <option key={axleSize} value={axleSize} className='text-[#000000] text-[15px] bg-[#FFFFFF]' onClick={() => setAxleSize(axleSize)}>
                  {axleSize}
                </option>
              ))}
            </select>
            {axleSizeErrorMsg && <p className='text-xs text-[#D92D20]'>{axleSizeErrorMsg}</p>}
          </div>
        </div>

        <div className='flex flex-col w-full mb-6'>
          <label className='flex items-center'>
            <p className='text-sm text-[#414651]'>{t('Truck License Plate')}<span className='text-[#006DE7]'> *</span> </p>
            <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
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
          <label className='flex items-center mb-3'>
            <p className='text-sm text-[#414651]'>{t('Vehicle Registration Documents ')}</p>
            <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
          </label>
          <CertificateUploadingSection
            vehicleRegistrationDocument={true}
            showUploadingBlock={vehicleRegDocumentUploading}
            setShowUploadingBlock={setVehicleRegDocumentUploading}
            clickableText={t('Upload registration document')}
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
          <button disabled={!vehicleType || !axleSize || !truckLicensePlate || !vehicleRegDocumentUploaded} onClick={() => moveToJourneyDetails()}
            className={`${(vehicleType && axleSize && truckLicensePlate && vehicleRegDocumentUploaded) ? "bg-[#006DE7] cursor-pointer" : "bg-[#C2C2C2] cursor-default"} 
             w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white`}
          >
            {t('commans.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
