import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/driverRegistration/LandingPage';
import DriverRegistrationProcess from './pages/driverRegistration/DriverRegistrationProcess';
import DriverRegistrationMainLayout from './shared/DriverRegistrationMainLayout';
import './styles/main.css';
import './i18';

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={'/LandingPage'} replace/>} />
        <Route path={'/LandingPage'} element={<DriverRegistrationMainLayout> <LandingPage /> </DriverRegistrationMainLayout>} />
        <Route path={'/DriverRegistrationProcessPage'} element={<DriverRegistrationMainLayout> <DriverRegistrationProcess /> </DriverRegistrationMainLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
