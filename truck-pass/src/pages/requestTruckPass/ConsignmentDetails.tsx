import React, { useState } from 'react';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import cubeIcon from '../../assets/cube_icon.png';
import { CertificateUploadingSection } from '../../components/CertificateUploadSection';
import Tooltip from '../../components/Tooltip';

export const ConsignmentDetails = () => {

  const { t } = useTranslation('');
  const navigate = useNavigate();
  const [inVoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceNumErrorMsg, setInvoiceNumErrorMsg] = useState('');
  const [waybillNumber, setWaybillNumber] = useState('');
  const [waybillNumErrorMsg, setWaybillNumErrorMsg] = useState('');

  const [showWeightCertficateUploading, setShowWeightCertficateUploading] = useState(false);
  const [weightCertificateUploaded, setWeightCertificateUploaded] = useState(false);
  const [weightCertificateData, setWeightCertificateData] = useState<string | null>(null);
  const [weightCertUploadErrorMsg, setWeightCertUploadErrorMsg] = useState('')

  const [showCustomDocumentUploading, setCustomDocumentUploading] = useState(false);
  const [customDocumentUploaded, setCustomDocumentUploaded] = useState(false);
  const [customDocumentData, setCustomDocumentData] = useState<string | null>(null);
  const [customDocUploadErrorMsg, setCustomDocUploadErrorMsg] = useState('');
  const [consignmentDetailsStatus, setConsignmentDetailsStatus] = useState(false);

  const handleInVoiceNumber = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInvoiceNumber(e.target.value);
  };

  const handleWaybillNumber = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setWaybillNumber(e.target.value);
  };

  const backToDriverProfile = () => {
    setConsignmentDetailsStatus(false);
    navigate('/requestTruckpassProcess/driverProfile');
  }

  const moveToVehicleDetails = () => {
    if (!inVoiceNumber.includes('-') || !waybillNumber.includes('-')) {
      if (!inVoiceNumber.includes('-')) {
        setInvoiceNumErrorMsg(t('consignmentDetails.invoiceNumErrorMsg'));
      }
      else { setInvoiceNumErrorMsg('') }
      if (!waybillNumber.includes('-')) {
        setWaybillNumErrorMsg(t('consignmentDetails.waybillNumErrorMsg'));
      }
      else { setWaybillNumErrorMsg('') }
      return;
    };
    const consignmentDetails = {
      inVoiceNumber: inVoiceNumber,
      waybillNumber: waybillNumber,
      weightCertificate: weightCertificateData || '',
      customDocument: customDocumentData || ''
    }
    localStorage.setItem('consignmentDetails', JSON.stringify(consignmentDetails))
    setConsignmentDetailsStatus(true);
    navigate('/requestTruckpassProcess/vehicleDetails');
  }

  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper
        searchDriverStatus={true}
        driverProfileStatus={true}
        consignmentDetailsStatus={consignmentDetailsStatus}
        vehicleDetailsStatus={false}
        journeyDetailsStatus={false}
        reviewAndSubmitStatus={false}
      />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        <div className='flex space-x-3 items-center'>
          <img src={cubeIcon} className='h-4.5' />
          <h1 className='font-[600] text-[18px]'>{t('consignmentDetails.header')}</h1>
        </div>
        <div className='flex flex-wrap justify-between'>
          <div className='flex flex-col w-[570px] mb-6'>
            <label className='flex items-center'>
              <p className='text-sm text-[#414651]'>{t('consignmentDetails.inVoiceNumber')}<span className='text-[#006DE7]'> *</span> </p>
              <Tooltip helpText={t('consignmentDetails.inVoiceNumTooltip')} />
            </label>
            <input
              type='text'
              placeholder={t('consignmentDetails.inVoiceNumPlaceHolder')}
              value={inVoiceNumber}
              onChange={handleInVoiceNumber}
              className={`${!inVoiceNumber ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-2 mt-2 border ${invoiceNumErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
            />
            {invoiceNumErrorMsg && <p className='text-xs text-[#D92D20]'>{invoiceNumErrorMsg}</p>}
          </div>

          <div className='flex flex-col w-[570px] mb-6'>
            <label className='flex items-center'>
              <p className='text-sm text-[#414651]'>{t('consignmentDetails.waybillNumber')}<span className='text-[#006DE7]'> *</span> </p>
              <Tooltip helpText={t('consignmentDetails.waybillNumTooltip')} />
            </label>
            <input
              type='text'
              placeholder={t('consignmentDetails.waybillNumPlaceHolder')}
              value={waybillNumber}
              onChange={handleWaybillNumber}
              className={`${!waybillNumber ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-2 mt-2 border ${waybillNumErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
            />
            {waybillNumErrorMsg && <p className='text-xs text-[#D92D20]'>{waybillNumErrorMsg}</p>}
          </div>

          <div className='flex flex-col w-[570px]'>
            <label className='flex items-center mb-3'>
              <p className='text-sm text-[#414651]'>{t('consignmentDetails.weightCertificate')}</p>
              <Tooltip helpText={t('consignmentDetails.weightCertTooltip')} />
            </label>
            <CertificateUploadingSection
              showUploadingBlock={showWeightCertficateUploading}
              setShowUploadingBlock={setShowWeightCertficateUploading}
              clickableText={t('consignmentDetails.uploadweightcertificate')}
              setFileUploaded={setWeightCertificateUploaded}
              setDataInFile={setWeightCertificateData}
              fileUploadErrorMsg={weightCertUploadErrorMsg}
              setFileUploadErrorMsg={setWeightCertUploadErrorMsg}
            />
          </div>

          <div className='flex flex-col w-[570px]'>
            <label className='flex items-center mb-3'>
              <p className='text-sm text-[#414651]'>{t('consignmentDetails.customsDocuments')}</p>
              <Tooltip helpText={t('consignmentDetails.customsDocTooltip')} />
            </label>
            <CertificateUploadingSection
              showUploadingBlock={showCustomDocumentUploading}
              setShowUploadingBlock={setCustomDocumentUploading}
              clickableText={t('consignmentDetails.uploadCustomDocument')}
              setFileUploaded={setCustomDocumentUploaded}
              setDataInFile={setCustomDocumentData}
              fileUploadErrorMsg={customDocUploadErrorMsg}
              setFileUploadErrorMsg={setCustomDocUploadErrorMsg}
            />
          </div>
        </div>

        <div className="flex space-x-6 justify-end mb-6 mt-[15%]">
          <button onClick={() => backToDriverProfile()}
            className="bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer">
            {t('commans.goBack')}
          </button>
          <button onClick={() => moveToVehicleDetails()}
            className={`${(inVoiceNumber && waybillNumber && weightCertificateUploaded && customDocumentUploaded) ? "bg-[#006DE7]" : "bg-[#C2C2C2]"} 
            w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer`}>
            {t('commans.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
