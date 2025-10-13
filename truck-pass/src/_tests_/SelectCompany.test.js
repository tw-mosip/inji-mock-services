import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SelectCompany } from '../pages/driverRegistration/SelectCompany';
import relyingPartyService from '../services/relyingPartyService';
// Mocks
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
jest.mock('../../components/Tooltip', () => () => _jsx("div", { "data-testid": "tooltip" }));
jest.mock('./DriverRegistrationStepper', () => ({
    DriverRegistrationStepper: () => _jsx("div", { "data-testid": "stepper" }),
}));
describe('SelectCompany Component', () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders search input and placeholder text', () => {
        render(_jsx(SelectCompany, {}));
        const input = screen.getByPlaceholderText('selectCompany.searchCompanies');
        expect(input).toBeInTheDocument();
    });
    it('shows dropdown and selects a company', async () => {
        const mockCompany = {
            id: '1',
            company_name: 'Test Transport Inc',
            registration_type: 'Private',
            registration_status: 'Active',
            registered_email: 'test@example.com',
            name: 'Test Transport',
            licenseStatus: 'Active',
        };
        // Mock API call
        jest.spyOn(relyingPartyService, 'search_company').mockResolvedValue([mockCompany]);
        render(_jsx(SelectCompany, {}));
        const input = screen.getByPlaceholderText('selectCompany.searchCompanies');
        fireEvent.change(input, { target: { value: 'Te' } });
        // Wait for debounce and API call
        await waitFor(() => expect(relyingPartyService.search_company).toHaveBeenCalledWith('Te'));
        // Should show the company name in dropdown
        expect(await screen.findByText('Test Transport Inc')).toBeInTheDocument();
        // Select the company
        fireEvent.click(screen.getByText('Test Transport Inc'));
        // Check selected company details are rendered
        expect(await screen.findByText('selectCompany.companyDetails')).toBeInTheDocument();
        expect(screen.getByText('Test Transport Inc')).toBeInTheDocument();
        expect(screen.getByText('selectCompany.licenseStatus')).toBeInTheDocument();
    });
    it('enables continue button and navigates on click when company is active', async () => {
        const mockCompany = {
            id: '1',
            company_name: 'Active Co',
            registration_type: 'Private',
            registration_status: 'Active',
            registered_email: 'active@example.com',
            name: 'Active Co',
            licenseStatus: 'Active',
        };
        jest.spyOn(relyingPartyService, 'search_company').mockResolvedValue([mockCompany]);
        render(_jsx(SelectCompany, {}));
        const input = screen.getByPlaceholderText('selectCompany.searchCompanies');
        fireEvent.change(input, { target: { value: 'Ac' } });
        await waitFor(() => expect(screen.getByText('Active Co')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Active Co'));
        const continueButton = screen.getByRole('button', { name: 'commans.continue' });
        expect(continueButton).toBeEnabled();
        fireEvent.click(continueButton);
        expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/verifyUINPage');
    });
    it('disables continue button for inactive companies', async () => {
        const mockCompany = {
            id: '2',
            company_name: 'Inactive Co',
            registration_type: 'Private',
            registration_status: 'Inactive',
            registered_email: 'inactive@example.com',
            name: 'Inactive Co',
            licenseStatus: 'Inactive',
        };
        jest.spyOn(relyingPartyService, 'search_company').mockResolvedValue([mockCompany]);
        render(_jsx(SelectCompany, {}));
        const input = screen.getByPlaceholderText('selectCompany.searchCompanies');
        fireEvent.change(input, { target: { value: 'In' } });
        await waitFor(() => expect(screen.getByText('Inactive Co')).toBeInTheDocument());
        fireEvent.click(screen.getByText('Inactive Co'));
        const continueButton = screen.getByRole('button', { name: 'commans.continue' });
        expect(continueButton).toBeDisabled();
    });
});
