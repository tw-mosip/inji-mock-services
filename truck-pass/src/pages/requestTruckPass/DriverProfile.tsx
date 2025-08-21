import React from 'react';
import magnifierIcon from '../../assets/magnifier_icon.png';
import userPhoto from '../../assets/user_photo.png';
import { TruckpassRequestStepper } from './TruckpassRequestStepper'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const DriverProfile = () => {

  const { t } = useTranslation('');
  const navigate = useNavigate();

  const backToDashboard = () => {
    navigate('/requestTruckpassProcess/requestedPassesDashboard');
  }

  const moveToConsignmentDetails = () => {
    navigate('/requestTruckpassProcess/consignmentDetails');
  }

  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        <div className='flex space-x-5 items-center'>
          <img src={magnifierIcon} className='h-4.5' />
          <h1 className='font-[600] text-[18px]'>{t('driverProfilePage.header')}</h1>
        </div>
        <div className='flex bg-[#EFFDF5] h-[94px] items-center px-6 gap-x-2 border border-[#B3F6D2] rounded-md'>
          <img src={userPhoto} className='h-16 w-16' />
          <div className='flex flex-col gap-y-2'>
            <p className='font-[600] text-[#007F41] text-[14px]'>{t('driverProfilePage.driverFound')}</p>
            <p className='font-[400] text-[#007F41] text-[14px]'>{t('driverProfilePage.driverProfileSuccessMsg')}</p>
          </div>
        </div>

        <div className='flex flex-wrap justify-between gap-x-4'>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.fullName')}</p>
            <p className='font-[500] text-[#000000] text-sm'>Rajesh Singh</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2  my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.gender')}</p>
            <p className='font-[500] text-[#000000] text-sm'>Male</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.uin')}</p>
            <p className='font-[500] text-[#000000] text-sm'>43643534646</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.phoneNumber')}</p>
            <p className='font-[500] text-[#000000] text-sm'>+91 9876543211</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.emailID')}</p>
            <p className='font-[500] text-[#000000] text-sm'>myemail@gmail.com</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.city')}</p>
            <p className='font-[500] text-[#000000] text-sm'>Bangalore</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.driverLicenseNum')}</p>
            <p className='font-[500] text-[#000000] text-sm'>DL-283762391</p>
          </div>
          <div className='flex flex-col w-[580px] bg-[#FAFAFA] border border-[#D5D7DA] shadow-xs rounded-md px-4 py-2 my-3'>
            <p className='font-[500] text-[#717680] text-xs'>{t('driverProfilePage.passportNum')}</p>
            <p className='font-[500] text-[#000000] text-sm'>NP-27321</p>
          </div>
        </div>

        <div className="flex space-x-6 justify-end my-6">
          <button onClick={() => backToDashboard()}
            className="bg-transparent w-[172px] h-[39px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer">
            {t('commans.goBack')}
          </button>
          <button onClick={() => moveToConsignmentDetails()}
            className="bg-[#006DE7] w-[172px] h-[39px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer">
            {t('commans.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
