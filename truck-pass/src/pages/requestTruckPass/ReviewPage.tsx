import React, { useState } from 'react';
import locationIcon from '../../assets/location_icon.png';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import tickIcon from '../../assets/confirmation_icon.png';

export const ReviewPage = () => {

  const { t } = useTranslation('');
  const navigate = useNavigate();
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const backToJourneyDetails = () => {
    navigate('/requestTruckpassProcess/journeyDetails');
    setShowSuccessScreen(false);
  }

  const confirmAndSubmit = () => {
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
      <TruckpassRequestStepper />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        {showSuccessScreen
          ? <RegistrationSuccessPage />
          : <>
            <div className='flex flex-col space-y-2'>
              <div className='flex space-x-3'>
                <img src={locationIcon} className='h-6 w-6' />
                <h1 className='font-[600] text-[18px]'>{t('Journey Details')}</h1>
              </div>
              <p className='font-[400] text-[13px] text-[#000000]'>{t('Please review all information below before submitting your truck pass request.')}</p>
            </div>

            <div className='flex flex-col gap-y-9 mt-[2.5%]'>
              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col w-[50%] gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('Driver Information')}</h1>
                  <div className='flex justify-between'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Full Name: ')}</span>{'Rajesh Singh'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Gender: ')}</span>{'Male'}
                    </p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('UIN: ')}</span>{'34234242542524'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('License: ')}</span>{'ABC'}
                    </p>
                  </div>
                  <p className='text-[14px]'>
                    <span className='font-[600]'>{t('Email: ')}</span>{'myemail@gmail.com'}
                  </p>
                </div>
              </div>

              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col w-[69%] gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('Consignment Details')}</h1>
                  <div className='flex gap-x-[300px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Invoice Number: ')}</span>{'INV-4234'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Waybill: ')}</span>{'WF-232322'}
                    </p>
                  </div>
                  <div className='flex gap-x-[280px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Weight Certificate: ')}</span>{'Uploaded'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Customs Documents: ')}</span>{'Uploaded'}
                    </p>
                  </div>
                </div>
              </div>

              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col w-[69%] gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('Vehicle Details')}</h1>
                  <div className='flex gap-x-[270px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('type: ')}</span>{'Heavy Commercial Vehicle'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Axle Size: ')}</span>{'4 Axle'}
                    </p>
                  </div>
                  <div className='flex gap-x-[290px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('License Plate: ')}</span>{'434342122121'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Registration Docs: ')}</span>{'Uploaded'}
                    </p>
                  </div>
                </div>
              </div>

              <div className='h-auto border-0 border-t-[#cac0c0] rounded-xl shadow-md p-6'>
                <div className="flex flex-col w-[63%] gap-y-4">
                  <h1 className='font-[600] text-[15px]'>{t('Journey Details')}</h1>
                  <div className='flex gap-x-[315px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Exporter: ')}</span>{'Exporter Name'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Importer: ')}</span>{'Importer Name'}
                    </p>
                  </div>
                  <div className='flex gap-x-[260px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Country of Origin: ')}</span>{'Country Name'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Destination: ')}</span>{'Destination Name'}
                    </p>
                  </div>
                  <div className='flex gap-x-[280px]'>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Departure Date: ')}</span>{'DD/MM/YYYY'}
                    </p>
                    <p className='text-[14px]'>
                      <span className='font-[600]'>{t('Border Point: ')}</span>{'Gate Two Bridge'}
                    </p>
                  </div>
                  <p className='text-[14px]'>
                    <span className='font-[600]'>{t('Arrival Date: ')}</span>{'DD/MM/YYYY'}
                  </p>
                </div>
              </div>

              <div className='bg-[#FFFBEC] border border-[#FFEDA7] rounded-md p-3 px-9'>
                <p className='text-xs text-[#E7711A]'>{t('By submitting this request, you confirm that all information provided is accurate and complete.')}</p>
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
