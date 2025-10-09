import React, { useState } from 'react';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import locationIcon from '../../assets/location_icon.png';
import { DropDownSelection } from '../../components/DropDownSelection';
import Tooltip from '../../components/Tooltip';

export const JourneyDetails = () => {

  const { t } = useTranslation('');
  const navigate = useNavigate();

  const [countryOfOrigin, setCountryOfOrigin] = useState<any>(null);
  const [exporterCompany, setExporterCompany] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureCrossingPoint, setDepartureCrossingPoint] = useState<any>(null);

  const [countryOfDestination, setCountryOfDestination] = useState<any>(null);
  const [importerCompany, setImporterCompany] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalCrossingPoint, setArrivalCrossingPoint] = useState<any>(null);

  const [exporterCompanyErrorMsg, setExporterCompanyErrorMsg] = useState('');
  const [departureDateErrorMsg, setDepartureDateErrorMsg] = useState('');

  const [importerCompanyErrorMsg, setImporterCompanyErrorMsg] = useState('');

  const [journeyDetailsStatus, setJourneyDetailsStatus] = useState(false);
  const [arrivalBeforeDepartureError, setArrivalBeforeDepartureError] = useState("");

  const originCountriesList = [
    { id: 0, country: 'India' }, { id: 1, country: 'China' }, { id: 2, country: 'Pakistan' }, { id: 3, country: 'Bangladesh' }, { id: 4, country: 'Afghanistan' }, { id: 5, country: 'Nepal' }
  ];
  const departurBordereCrossingPoints = [
    { id: 0, departurePoint: 'Attari(Punjab)' }, { id: 1, departurePoint: 'Nathu La Pass (India-China)' }, { id: 2, departurePoint: 'Benapole (West Bengal)' }, { id: 3, departurePoint: 'Durand Line (Afghanistan)' }, { id: 4, departurePoint: 'Kakarbhitta (Nepal)' }
  ];
  const destinationCountriesList = [
    { id: 0, country: 'India' }, { id: 1, country: 'China' }, { id: 2, country: 'Pakistan' }, { id: 3, country: 'Bangladesh' }, { id: 4, country: 'Afghanistan' }, { id: 5, country: 'Nepal' }
  ];
  const arrivalBorderCrossingPoints = [
    { id: 0, arrivalPoint: 'Petrapole' }, { id: 1, arrivalPoint: 'Attari' }, { id: 2, arrivalPoint: 'Raxaul' }, { id: 3, arrivalPoint: 'Moreh' }, { id: 4, arrivalPoint: 'Kakarvitta' }, { id: 5, arrivalPoint: 'Heishantou' },
  ];

  const handleExporterCompany = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setExporterCompany(e.target.value);
  };

  const handleDepartureDate = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    const selectedDepartureDate = e.target.value as string;
    setDepartureDate(selectedDepartureDate);
    if (arrivalDate && new Date(arrivalDate) < new Date(selectedDepartureDate)) {
      setArrivalBeforeDepartureError('Arrival date cannot be before departure date');
    } else {
      setArrivalBeforeDepartureError('');
    }
  };

  const handleImporterCompany = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setImporterCompany(e.target.value);
  };

  const handleArrivalDate = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    const selectedArrivalDate = e.target.value as string;
    setArrivalDate(selectedArrivalDate);
    if (departureDate && new Date(selectedArrivalDate) < new Date(departureDate)) {
      setArrivalBeforeDepartureError('Arrival date cannot be before departure date');
    } else {
      setArrivalBeforeDepartureError('');
    }
    setArrivalDate(e.target.value);
  };

  const backToVehicleDetails = () => {
    setJourneyDetailsStatus(false);
    navigate('/requestTruckpassProcess/vehicleDetails');
  }

  const moveToReviewPage = () => {
    if (!countryOfOrigin || !exporterCompany || !departureDate || !departureCrossingPoint || !countryOfDestination || !importerCompany || !arrivalDate || !arrivalCrossingPoint) {

      if (!exporterCompany) {
        setExporterCompanyErrorMsg(t('journeyDetails.exportCompanyErrorMsg'));
      }
      else { setExporterCompanyErrorMsg('') }

      if (!departureDate) {
        setDepartureDateErrorMsg(t('journeyDetails.departureDateErrorMsg'));
      }
      else { setDepartureDateErrorMsg('') }

      if (!importerCompany) {
        setImporterCompanyErrorMsg(t('journeyDetails.importCompanyErrorMsg'));
      }
      else { setImporterCompanyErrorMsg('') }

      return;
    };

    const journeyDetails = {
      originCountry: countryOfOrigin?.country,
      exporterCompany: exporterCompany,
      dateOfDeparture: departureDate,
      borderOfDeparture: departureCrossingPoint?.departurePoint,
      destinationCountry: countryOfDestination?.country,
      importerCompany: importerCompany,
      dateOfArrival: arrivalDate,
      borderOfArrival: arrivalCrossingPoint?.arrivalPoint,
    }
    localStorage.setItem('journeyDetails', JSON.stringify(journeyDetails));
    setJourneyDetailsStatus(false);
    navigate('/requestTruckpassProcess/reviewPage');
  }

  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper
        searchDriverStatus={true}
        driverProfileStatus={true}
        consignmentDetailsStatus={true}
        vehicleDetailsStatus={true}
        journeyDetailsStatus={journeyDetailsStatus}
        reviewAndSubmitStatus={false}
      />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        <div className='flex space-x-3 items-center'>
          <img src={locationIcon} className='h-6' />
          <h1 className='font-[600] text-[18px]'>{t('journeyDetails.header')}</h1>
        </div>
        <div className='flex flex-col gap-y-6 mt-[2.5%]'>
          <>
            <h1 className='font-[600] text-[15px] mb-2'>{t('journeyDetails.depatureDetails')}</h1>
            <div className="flex flex-wrap justify-between">
              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='origin-country' className='flex items-center mb-2'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.countryOfOrigin')}<span className='text-[#006DE7]'> *</span> </p>
                  <Tooltip helpText={t('consignmentDetails.countryOfOriginTooltip')} />
                </label>
                <DropDownSelection
                  selectingOriginCountry={true}
                  data={originCountriesList}
                  setItemSelected={setCountryOfOrigin}
                  placeHolder={t('journeyDetails.selectCountry')}
                />
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.exporterCompany')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.exporterCompanyTooltip')} />
                </label>
                <input
                  type='text'
                  placeholder={t('journeyDetails.exporterPlaceHolder')}
                  value={exporterCompany}
                  onChange={handleExporterCompany}
                  className={`${!exporterCompany ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${exporterCompanyErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {exporterCompanyErrorMsg && <p className='text-xs text-[#D92D20]'>{exporterCompanyErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.plannedDepartureDate')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.departureDateTooltip')} />
                </label>
                <input
                  type='date'
                  value={departureDate}
                  onChange={handleDepartureDate}
                  className={`${!departureDate ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${departureDateErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {departureDateErrorMsg && <p className='text-xs text-[#D92D20]'>{departureDateErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='departure-crossing-point' className='flex items-center mb-2'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.borderCrossingPoint')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.originCrossingPointTooltip')} />
                </label>
                <DropDownSelection
                  selectOriginBorder={true}
                  data={departurBordereCrossingPoints}
                  setItemSelected={setDepartureCrossingPoint}
                  placeHolder={t('journeyDetails.selectBorderCrossing')}
                />
              </div>
            </div>
          </>
          <>
            <h1 className='font-[600] text-[15px] mb-2'>{t('journeyDetails.arrivalDetails')}</h1>
            <div className="flex flex-wrap justify-between">
              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='destination-country' className='flex items-center mb-2'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.countryOfDestination')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.countryOfDestinationTooltip')} />
                </label>
                <DropDownSelection
                  selectingDestinationCountry={true}
                  data={destinationCountriesList}
                  setItemSelected={setCountryOfDestination}
                  placeHolder={t('journeyDetails.selectCountry')}
                />
              </div>
              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.importerCompany')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.importerCompanyTooltip')} />
                </label>
                <input
                  type='text'
                  placeholder={t('journeyDetails.importerPlaceHolder')}
                  value={importerCompany}
                  onChange={handleImporterCompany}
                  className={`${!importerCompany ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${importerCompanyErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {importerCompanyErrorMsg && <p className='text-xs text-[#D92D20]'>{importerCompanyErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.expectedArrivalDate')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.expectedArrivalDateTooltip')} />
                </label>
                <input
                  type='date'
                  value={arrivalDate}
                  onChange={handleArrivalDate}
                  className={`${!arrivalDate ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${arrivalBeforeDepartureError ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {arrivalBeforeDepartureError && <p className='text-xs text-[#D92D20]'>{arrivalBeforeDepartureError}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='arrival-crossing-point' className='flex items-center mb-2'>
                  <p className='text-sm text-[#414651]'>{t('journeyDetails.borderCrossingPoint')}<span className='text-[#006DE7]'> *</span> </p>
                 <Tooltip helpText={t('consignmentDetails.destinationCrossingPointTooltip')} />
                </label>
                <DropDownSelection
                  selectDestinationBorder={true}
                  data={arrivalBorderCrossingPoints}
                  setItemSelected={setArrivalCrossingPoint}
                  placeHolder={t('journeyDetails.selectBorderCrossing')}
                />
              </div>
            </div>
          </>
        </div>
        <div className="flex space-x-6 justify-end mb-6 mt-[3%]">
          <button onClick={() => backToVehicleDetails()}
            className="bg-transparent w-[183px] h-[42px] text-sm text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer"
          >
            {t('commans.goBack')}
          </button>
          <button disabled={!countryOfOrigin || !exporterCompany || !departureDate || !departureCrossingPoint || !countryOfDestination || !importerCompany || !arrivalDate || !!arrivalBeforeDepartureError || !arrivalCrossingPoint} onClick={() => moveToReviewPage()}
            className={`${(countryOfOrigin && exporterCompany && departureDate && departureCrossingPoint && countryOfDestination && importerCompany && arrivalDate && arrivalCrossingPoint && !arrivalBeforeDepartureError) ? 'bg-[#006DE7] cursor-pointer' : 'bg-[#C2C2C2]'}
            w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer`}
          >
            {t('commans.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}