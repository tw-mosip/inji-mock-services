import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './commans/LandingPage';
import DriverRegistrationProcess from './pages/driverRegistration/DriverRegistrationProcess';
import AppMainLayout from './shared/AppMainLayout';
import './styles/main.css'
import './i18';
import { VerifyUIN } from './pages/driverRegistration/VerifyUIN';
import { ConsentAndAgreementPage } from './pages/driverRegistration/ConsentAndAgreementPage';
import { SelectCompany } from './pages/driverRegistration/SelectCompany';
import { Registration } from './pages/driverRegistration/Registration';
import { ConfirmationPage } from './pages/driverRegistration/ConfirmationPage';
import { DriverRegistrationFlow } from './shared/DriverRegistrationFlow';
import { Dashboard } from './pages/requestTruckPass/Dashboard';
import { NewTruckPassRequest } from './pages/requestTruckPass/NewTruckpassRequest';
import { ConsignmentDetails } from './pages/requestTruckPass/ConsignmentDetails';
import { VehicleDetails } from './pages/requestTruckPass/VehicleDetails';
import { JourneyDetails } from './pages/requestTruckPass/JourneyDetails';
import { ReviewPage } from './pages/requestTruckPass/ReviewPage';
import { DriverProfile } from './pages/requestTruckPass/DriverProfile';
import OtpVerificationPage from './pages/requestTruckPass/OtpVerificationPage';
import LoginPage from './pages/requestTruckPass/LoginPage';
import { SearchDriver } from './pages/requestTruckPass/SearchDriver';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={'/landingPage'} replace />} />
        <Route path={'/landingPage'} element={<AppMainLayout> <LandingPage /> </AppMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/consentAndAgreementPage'} element={<AppMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <ConsentAndAgreementPage /> </DriverRegistrationFlow>  </DriverRegistrationProcess> </AppMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/selectCompanyPage'} element={<AppMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <SelectCompany /> </DriverRegistrationFlow> </DriverRegistrationProcess> </AppMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/verifyUINPage'} element={<AppMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <VerifyUIN /> </DriverRegistrationFlow> </DriverRegistrationProcess> </AppMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/registrationPage'} element={<AppMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <Registration /> </DriverRegistrationFlow> </DriverRegistrationProcess> </AppMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/confirmationPagePage'} element={<AppMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <ConfirmationPage /> </DriverRegistrationFlow> </DriverRegistrationProcess> </AppMainLayout>} />

        <Route path={'/requestTruckpassProcess/loginPage'} element={<AppMainLayout> <LoginPage /> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/otpVerification'} element={<AppMainLayout> <OtpVerificationPage /> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/requestedPassesDashboard'} element={<AppMainLayout> <Dashboard /> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/searchDriver'} element={<AppMainLayout> <NewTruckPassRequest> <SearchDriver /> </NewTruckPassRequest> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/driverProfile'} element={<AppMainLayout> <NewTruckPassRequest> <DriverProfile /> </NewTruckPassRequest> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/consignmentDetails'} element={<AppMainLayout> <NewTruckPassRequest> <ConsignmentDetails /> </NewTruckPassRequest> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/vehicleDetails'} element={<AppMainLayout> <NewTruckPassRequest> <VehicleDetails /> </NewTruckPassRequest> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/journeyDetails'} element={<AppMainLayout> <NewTruckPassRequest> <JourneyDetails /> </NewTruckPassRequest> </AppMainLayout>} />
        <Route path={'/requestTruckpassProcess/reviewPage'} element={<AppMainLayout> <NewTruckPassRequest> <ReviewPage /> </NewTruckPassRequest> </AppMainLayout>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
