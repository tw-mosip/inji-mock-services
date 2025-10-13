import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18';
import LandingPage from '../commans/LandingPage';
// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));
describe('LandingPage', () => {
    it('renders LandingPage and its main sections', () => {
        render(_jsx(BrowserRouter, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(LandingPage, {}) }) }));
        // Headings
        expect(screen.getByText(i18n.t('landingPage.landingPageTitle'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landingPage.getStartedToday'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landingPage.howItWorks'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('footer.footerText'))).toBeInTheDocument();
    });
    it('renders "Register as Driver" and triggers navigation', () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
        render(_jsx(BrowserRouter, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(LandingPage, {}) }) }));
        const registerButton = screen.getByText(i18n.t('landingPage.registerAsDriver'));
        expect(registerButton).toBeInTheDocument();
        fireEvent.click(registerButton);
        expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/consentAndAgreementPage');
    });
    it('renders all streamlined process items', () => {
        render(_jsx(BrowserRouter, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(LandingPage, {}) }) }));
        expect(screen.getByText(i18n.t('landingPage.subApplication'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landingPage.securityVerification'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landingPage.approvalAndIssuance'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landingPage.crossBorder'))).toBeInTheDocument();
    });
    it('renders truck pass section with login button', () => {
        render(_jsx(BrowserRouter, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(LandingPage, {}) }) }));
        expect(screen.getByText(i18n.t('landingPage.requestTruckPass'))).toBeInTheDocument();
        expect(screen.getByText(i18n.t('landingPage.login'))).toBeInTheDocument();
    });
});
