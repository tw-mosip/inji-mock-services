import React, { useState } from 'react';
import { TruckpassRequestStepper } from './TruckpassRequestStepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import locationIcon from '../../assets/location_icon.png';
import helpIcon from '../../assets/help_icon.png';

export const JourneyDetails = () => {

  const { t } = useTranslation('');
  const navigate = useNavigate();

  const [countryOfOrigin, setCountryOfOrigin] = useState('');
  const [exporterCompany, setExporterCompany] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureCrossingPoint, setDepartureCrossingPoint] = useState('');

  const [countryOfDestination, setCountryOfDestination] = useState('');
  const [importerCompany, setImporterCompany] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalCrossingPoint, setArrivalCrossingPoint] = useState('');

  const [countryOfOriginErrorMsg, setCountryOfOriginErrorMsg] = useState('');
  const [exporterCompanyErrorMsg, setExporterCompanyErrorMsg] = useState('');
  const [departureDateErrorMsg, setDepartureDateErrorMsg] = useState('');
  const [departureCrossingPointErrorMsg, setDepartureCrossingPointErrorMsg] = useState('');

  const [countryOfDestinationErrorMsg, setCountryOfDestinationErrorMsg] = useState('');
  const [importerCompanyErrorMsg, setImporterCompanyErrorMsg] = useState('');
  const [arrivalDateErrorMsg, setArrivalDateErrorMsg] = useState('');
  const [arrivalCrossingPointErrorMsg, setArrivalCrossingPointErrorMsg] = useState('');


  const originCountriesList = ['India', 'China', 'Pakistan', 'Bangladesh', 'Afghanistan', 'Nepal'];
  const destinationCountriesList = ['India', 'China', 'Pakistan', 'Bangladesh', 'Afghanistan', 'Nepal'];
  const departurBordereCrossingPoints = ['Attari(Punjab)', 'Nathu La Pass (India-China)', 'Benapole (West Bengal)', 'Durand Line (Afghanistan)', 'Kakarbhitta (Nepal)']
  const arrivalBorderCrossingPoints = ['Petrapole', 'Attari', 'Raxaul', 'Moreh', 'Kakarvitta', 'Heishantou'];

  const handleCountryOfOrigin = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCountryOfOrigin(e.target.value);
  };

  const handleExporterCompany = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setExporterCompany(e.target.value);
  };

  const handleDepartureDate = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setDepartureDate(e.target.value);
  };

  const handleDepartureCrossingPoint = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setDepartureCrossingPoint(e.target.value);
  };

  const handleCountryOfDestination = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setCountryOfDestination(e.target.value);
  };

  const handleImporterCompany = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setImporterCompany(e.target.value);
  };

  const handleArrivalDate = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setArrivalDate(e.target.value);
  };

  const handleArrivalCrossingPoint = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setArrivalCrossingPoint(e.target.value);
  };


  const backToVehicleDetails = () => {
    navigate('/requestTruckpassProcess/vehicleDetails');
  }

  const moveToReviewPage = () => {
    if (!countryOfOrigin || !exporterCompany || !departureDate || !departureCrossingPoint || !countryOfDestination || !importerCompany || !arrivalDate || !arrivalCrossingPoint) {

      if (!countryOfOrigin) {
        setCountryOfOriginErrorMsg(t('*Please select origin country in the dropdown'));
      }
      else { setCountryOfOriginErrorMsg('') }

      if (!exporterCompany) {
        setExporterCompanyErrorMsg(t('*Please enter the exporter company'));
      }
      else { setExporterCompanyErrorMsg('') }

      if (!departureDate) {
        setDepartureDateErrorMsg(t('*Please select the departure date'));
      }
      else { setDepartureDateErrorMsg('') }

      if (!departureCrossingPoint) {
        setDepartureCrossingPointErrorMsg(t('*Please select departure crossing point in the dropdown'));
      }
      else { setDepartureCrossingPointErrorMsg('') }

      if (!countryOfDestination) {
        setCountryOfDestinationErrorMsg(t('*Please select destination country in the dropdown'));
      }
      else { setCountryOfDestinationErrorMsg('') }

      if (!importerCompany) {
        setImporterCompanyErrorMsg(t('*Please enter the importer company'));
      }
      else { setImporterCompanyErrorMsg('') }

      if (!arrivalDate) {
        setArrivalDateErrorMsg(t('*Please select the departure date'));
      }
      else { setArrivalDateErrorMsg('') }

      if (!arrivalCrossingPoint) {
        setArrivalCrossingPointErrorMsg(t('*Please select arrival crossing point in the dropdown'));
      }
      else { setArrivalCrossingPointErrorMsg('') }

      return;
    };
    navigate('/requestTruckpassProcess/reviewPage');
  }

  return (
    <div className='flex flex-col gap-y-10 bg-transparent font-inter'>
      <TruckpassRequestStepper />
      <div className='bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-4'>
        <div className='flex space-x-3 items-center'>
          <img src={locationIcon} className='h-6' />
          <h1 className='font-[600] text-[18px]'>{t('Journey Details')}</h1>
        </div>
        <div className='flex flex-col gap-y-6 mt-[2.5%]'>
          <>
            <h1 className='font-[600] text-[15px] mb-2'>{t('Depature Details')}</h1>
            <div className="flex flex-wrap justify-between">
              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='origin-country' className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Country of Origin')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <select
                  id="origin-country"
                  name="origin-country"
                  value={countryOfOrigin}
                  onChange={handleCountryOfOrigin}
                  className={`${!countryOfOrigin ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${countryOfOriginErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                >
                  <option value="" disabled>{t('Select Country')}</option>
                  {originCountriesList.map((country) => (
                    <option key={country} value={country} className='text-[#000000] text-[15px] bg-[#FFFFFF]' onClick={() => setCountryOfOrigin(country)}>
                      {country}
                    </option>
                  ))}
                </select>
                {countryOfOriginErrorMsg && <p className='text-xs text-[#D92D20]'>{countryOfOriginErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Exporter Company')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <input
                  type='text'
                  placeholder='e.g,ABC Trading Co'
                  value={exporterCompany}
                  onChange={handleExporterCompany}
                  className={`${!exporterCompany ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${exporterCompanyErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {exporterCompanyErrorMsg && <p className='text-xs text-[#D92D20]'>{exporterCompanyErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Planned Departure Date')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
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
                <label htmlFor='departure-crossing-point' className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Border Crossing Point')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <select
                  id="departure-crossing-point"
                  name="departure-crossing-point"
                  value={departureCrossingPoint}
                  onChange={handleDepartureCrossingPoint}
                  className={`${!departureCrossingPoint ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${departureCrossingPointErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                >
                  <option value="" disabled>{t('Select Border Crossing')}</option>
                  {departurBordereCrossingPoints.map((departureCrossPoint) => (
                    <option key={departureCrossPoint} value={departureCrossPoint} className='text-[#000000] text-[15px] bg-[#FFFFFF]' onClick={() => setDepartureCrossingPoint(departureCrossPoint)}>
                      {departureCrossPoint}
                    </option>
                  ))}
                </select>
                {departureCrossingPointErrorMsg && <p className='text-xs text-[#D92D20]'>{departureCrossingPointErrorMsg}</p>}
              </div>
            </div>
          </>
          <>
            <h1 className='font-[600] text-[15px] mb-2'>{t('Arrival Details')}</h1>
            <div className="flex flex-wrap justify-between">
              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='destination-country' className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Country of Destination')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <select
                  id="destination-country"
                  name="destination-country"
                  value={countryOfDestination}
                  onChange={handleCountryOfDestination}
                  className={`${!countryOfDestination ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${countryOfDestinationErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                >
                  <option value="" disabled>{t('Select Country')}</option>
                  {destinationCountriesList.map((country) => (
                    <option key={country} value={country} className='text-[#000000] text-[15px] bg-[#FFFFFF]' onClick={() => setCountryOfDestination(country)}>
                      {country}
                    </option>
                  ))}
                </select>
                {countryOfDestinationErrorMsg && <p className='text-xs text-[#D92D20]'>{countryOfDestinationErrorMsg}</p>}
              </div>
              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Importer Company')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <input
                  type='text'
                  placeholder='e.g,ABC Imports Ltd.'
                  value={importerCompany}
                  onChange={handleImporterCompany}
                  className={`${!importerCompany ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${importerCompanyErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {importerCompanyErrorMsg && <p className='text-xs text-[#D92D20]'>{importerCompanyErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Expected Arrival Date ')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <input
                  type='date'
                  value={arrivalDate}
                  onChange={handleArrivalDate}
                  className={`${!arrivalDate ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${arrivalDateErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                />
                {arrivalDateErrorMsg && <p className='text-xs text-[#D92D20]'>{arrivalDateErrorMsg}</p>}
              </div>

              <div className='flex flex-col w-[570px] mb-6'>
                <label htmlFor='arrival-crossing-point' className='flex items-center'>
                  <p className='text-sm text-[#414651]'>{t('Border Crossing Point ')}<span className='text-[#006DE7]'> *</span> </p>
                  <img src={helpIcon} alt='help_icon' className='h-3 cursor-pointer px-1' />
                </label>
                <select
                  id="arrival-crossing-point"
                  name="arrival-crossing-point"
                  value={arrivalCrossingPoint}
                  onChange={handleArrivalCrossingPoint}
                  className={`${!arrivalCrossingPoint ? 'bg-[#FAFAFA] text-[#717680]' : 'bg-[#FFFFFF]'} text-[15px] p-1.5 mt-2 border ${arrivalCrossingPointErrorMsg ? 'border-[#FDA29B]' : 'border-[#D5D7DA]'} rounded-md outline-none`}
                >
                  <option value="" disabled>{t('Select Border Crossing')}</option>
                  {arrivalBorderCrossingPoints.map((country) => (
                    <option key={country} value={country} className='text-[#000000] text-[15px] bg-[#FFFFFF]' onClick={() => setArrivalCrossingPoint(country)}>
                      {country}
                    </option>
                  ))}
                </select>
                {arrivalCrossingPointErrorMsg && <p className='text-xs text-[#D92D20]'>{arrivalCrossingPointErrorMsg}</p>}
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
          <button disabled={!countryOfOrigin || !exporterCompany || !departureDate || !departureCrossingPoint || !countryOfDestination || !importerCompany || !arrivalDate || !arrivalCrossingPoint} onClick={() => moveToReviewPage()}
            className={`${(countryOfOrigin && exporterCompany && departureDate && departureCrossingPoint && countryOfDestination && importerCompany && arrivalDate && arrivalCrossingPoint) ? 'bg-[#006DE7] cursor-pointer' : 'bg-[#C2C2C2]'}
            w-[183px] h-[42px] text-sm font-[600] py-2.5 text-center rounded-[5px] text-white cursor-pointer`}
          >
            {t('commans.continue')}
          </button>
        </div>
      </div>
    </div>
  )
}
