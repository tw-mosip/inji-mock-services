import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './commans/LandingPage';
import DriverRegistrationProcess from './pages/driverRegistration/DriverRegistrationProcess';
import AppMainLayout from './shared/AppMainLayout';
import './styles/main.css';
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
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsx(Navigate, { to: '/landingPage', replace: true }) }), _jsx(Route, { path: '/landingPage', element: _jsxs(AppMainLayout, { children: [" ", _jsx(LandingPage, {}), " "] }) }), _jsx(Route, { path: '/driverRegistrationProcessPage/consentAndAgreementPage', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(DriverRegistrationProcess, { children: [" ", _jsxs(DriverRegistrationFlow, { children: [" ", _jsx(ConsentAndAgreementPage, {}), " "] }), "  "] }), " "] }) }), _jsx(Route, { path: '/driverRegistrationProcessPage/selectCompanyPage', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(DriverRegistrationProcess, { children: [" ", _jsxs(DriverRegistrationFlow, { children: [" ", _jsx(SelectCompany, {}), " "] }), " "] }), " "] }) }), _jsx(Route, { path: '/driverRegistrationProcessPage/verifyUINPage', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(DriverRegistrationProcess, { children: [" ", _jsxs(DriverRegistrationFlow, { children: [" ", _jsx(VerifyUIN, {}), " "] }), " "] }), " "] }) }), _jsx(Route, { path: '/driverRegistrationProcessPage/registrationPage', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(DriverRegistrationProcess, { children: [" ", _jsxs(DriverRegistrationFlow, { children: [" ", _jsx(Registration, {}), " "] }), " "] }), " "] }) }), _jsx(Route, { path: '/driverRegistrationProcessPage/confirmationPagePage', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(DriverRegistrationProcess, { children: [" ", _jsxs(DriverRegistrationFlow, { children: [" ", _jsx(ConfirmationPage, {}), " "] }), " "] }), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/loginPage', element: _jsxs(AppMainLayout, { children: [" ", _jsx(LoginPage, {}), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/otpVerification', element: _jsxs(AppMainLayout, { children: [" ", _jsx(OtpVerificationPage, {}), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/requestedPassesDashboard', element: _jsxs(AppMainLayout, { children: [" ", _jsx(Dashboard, {}), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/searchDriver', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(NewTruckPassRequest, { children: [" ", _jsx(SearchDriver, {}), " "] }), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/driverProfile', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(NewTruckPassRequest, { children: [" ", _jsx(DriverProfile, {}), " "] }), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/consignmentDetails', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(NewTruckPassRequest, { children: [" ", _jsx(ConsignmentDetails, {}), " "] }), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/vehicleDetails', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(NewTruckPassRequest, { children: [" ", _jsx(VehicleDetails, {}), " "] }), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/journeyDetails', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(NewTruckPassRequest, { children: [" ", _jsx(JourneyDetails, {}), " "] }), " "] }) }), _jsx(Route, { path: '/requestTruckpassProcess/reviewPage', element: _jsxs(AppMainLayout, { children: [" ", _jsxs(NewTruckPassRequest, { children: [" ", _jsx(ReviewPage, {}), " "] }), " "] }) })] }) }));
}
export default App;
