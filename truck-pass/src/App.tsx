import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/driverRegistration/LandingPage';
import DriverRegistrationProcess from './pages/driverRegistration/DriverRegistrationProcess';
import DriverRegistrationMainLayout from './shared/DriverRegistrationMainLayout';
import './styles/main.css';
import './i18';

import { ConsentAndAgreementPage } from './pages/driverRegistration/ConsentAndAgreementPage';
import { SelectCompany } from './pages/driverRegistration/SelectCompany';
import { Registration } from './pages/driverRegistration/Registration';
import { ConfirmationPage } from './pages/driverRegistration/ConfirmationPage';
import { DriverRegistrationFlow } from './shared/DriverRegistrationFlow';
import { VerifyUIN } from './pages/driverRegistration/VerifyUIN';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={'/landingPage'} replace/>} />
        <Route path={'/landingPage'} element={<DriverRegistrationMainLayout> <LandingPage /> </DriverRegistrationMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/consentAndAgreementPage'} element={<DriverRegistrationMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <ConsentAndAgreementPage/> </DriverRegistrationFlow>  </DriverRegistrationProcess> </DriverRegistrationMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/selectCompanyPage'} element={<DriverRegistrationMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <SelectCompany/> </DriverRegistrationFlow> </DriverRegistrationProcess> </DriverRegistrationMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/verifyUINPage'} element={<DriverRegistrationMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <VerifyUIN/> </DriverRegistrationFlow> </DriverRegistrationProcess> </DriverRegistrationMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/registrationPage'} element={<DriverRegistrationMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <Registration/> </DriverRegistrationFlow> </DriverRegistrationProcess> </DriverRegistrationMainLayout>} />
        <Route path={'/driverRegistrationProcessPage/confirmationPagePage'} element={<DriverRegistrationMainLayout> <DriverRegistrationProcess> <DriverRegistrationFlow> <ConfirmationPage/> </DriverRegistrationFlow> </DriverRegistrationProcess> </DriverRegistrationMainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
