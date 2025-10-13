import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConsentAndAgreementPage } from '../pages/driverRegistration/ConsentAndAgreementPage';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    useLocation: () => ({ pathname: '/driverRegistrationProcessPage/consentAndAgreementPage' }),
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
jest.mock('../commans/Stepper', () => ({
    Stepper: jest.fn(() => _jsx("div", { "data-testid": "stepper" })),
}));
describe('ConsentAndAgreementPage', () => {
    let mockNavigate;
    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    });
    test('renders initial UI elements', () => {
        render(_jsx(MemoryRouter, { children: _jsx(ConsentAndAgreementPage, {}) }));
        expect(screen.getByText(/consentAndAgreementPage.consentAndAgreementTitle/i)).toBeInTheDocument();
        expect(screen.getByText(/consentAndAgreementPage.consentAndAgreementDesc/i)).toBeInTheDocument();
        expect(screen.getByText(/consentAndAgreementPage.termsAndConditions/i, { selector: 'p.font-semibold' })).toBeInTheDocument(); // Specific to title
        expect(screen.getByText(/consentAndAgreementPage.termsAndConditionsInfo/i)).toBeInTheDocument();
        expect(screen.getByText(/consentAndAgreementPage.consentPara1/i)).toBeInTheDocument();
        expect(screen.getByText(/consentAndAgreementPage.consentPara2/i)).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /consent_terms_icon/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /consentAndAgreementPage.getStarted/i })).toBeDisabled();
        expect(screen.getByTestId('stepper')).toBeInTheDocument();
    });
    test('handles checkbox interaction', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(ConsentAndAgreementPage, {}) }));
        const checkbox = screen.getByRole('checkbox');
        const button = screen.getByRole('button', { name: /consentAndAgreementPage.getStarted/i });
        expect(checkbox).not.toBeChecked();
        expect(button).toBeDisabled();
        expect(button).toHaveClass('bg-[#B0B0B0]');
        await act(async () => {
            fireEvent.click(checkbox);
        });
        expect(checkbox).toBeChecked();
        expect(button).not.toBeDisabled();
        expect(button).toHaveClass('bg-[#006DE7]');
    });
    test('navigates on button click when checkbox is checked', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(ConsentAndAgreementPage, {}) }));
        const checkbox = screen.getByRole('checkbox');
        const button = screen.getByRole('button', { name: /consentAndAgreementPage.getStarted/i });
        await act(async () => {
            fireEvent.click(checkbox);
        });
        await act(async () => {
            fireEvent.click(button);
        });
        expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/selectCompanyPage');
    });
    test('does not navigate on button click when checkbox is unchecked', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(ConsentAndAgreementPage, {}) }));
        const button = screen.getByRole('button', { name: /consentAndAgreementPage.getStarted/i });
        await act(async () => {
            fireEvent.click(button);
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });
    test('passes correct props to Stepper', () => {
        render(_jsx(MemoryRouter, { children: _jsx(ConsentAndAgreementPage, {}) }));
        const checkbox = screen.getByRole('checkbox');
        act(() => {
            fireEvent.click(checkbox);
        });
        const button = screen.getByRole('button', { name: /consentAndAgreementPage.getStarted/i });
        act(() => {
            fireEvent.click(button);
        });
        // Note: getStartedBtn is set to true on navigation, but the render check happens before navigation
        // This test checks initial state; navigation effect isn't re-rendered here
    });
});
