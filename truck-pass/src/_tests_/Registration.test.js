import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Registration } from '../pages/driverRegistration/Registration';
import * as reactRouter from 'react-router-dom';
import relyingPartyService from '../services/relyingPartyService';
// Mock i18n
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));
// Mock subcomponents
jest.mock('../../components/CertificateUploadSection', () => ({
    CertificateUploadingSection: (props) => {
        // Simulate a simple UI for upload
        return (_jsx("div", { "data-testid": "cert-upload-section", children: _jsx("button", { onClick: () => {
                    props.setFileUploaded(true);
                    props.setDataInFile('dummybase64data');
                }, children: "upload" }) }));
    },
}));
jest.mock('../../components/ErrorPopup', () => ({
    ErrorPopup: () => {
        return _jsx("div", { "data-testid": "error-popup", children: "ErrorPopup visible" });
    },
}));
jest.mock('./DriverRegistrationStepper', () => ({
    DriverRegistrationStepper: () => _jsx("div", { "data-testid": "stepper", children: "Stepper" }),
}));
// Optionally mock base64ToFile to a simple pass-through or stub
jest.mock('../../commans/AppUtilities', () => ({
    base64ToFile: (b64, name) => {
        // return a fake File object (or just the string) for testing
        return new File([b64], name, { type: 'application/pdf' });
    },
}));
describe('Registration component', () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        // Mock react-router useNavigate
        jest.spyOn(reactRouter, 'useNavigate').mockReturnValue(mockNavigate);
        // Clear localStorage
        localStorage.clear();
    });
    afterEach(() => {
        jest.useRealTimers(); // Restore timers after each test if we used fake timers
        jest.clearAllMocks();
    });
    it('renders initial form fields from localStorage info', () => {
        // Pre-populate localStorage with driverInformation and companySelected
        const driverInfo = {
            name: 'John Doe',
            gender: 'Male',
            email: 'john@example.com',
            phone_number: '1234567890',
            address: { locality: 'CityX' },
            picture: 'someBase64String',
        };
        localStorage.setItem('driverInformation', JSON.stringify(driverInfo));
        const company = { companyName: 'MyCo' };
        localStorage.setItem('companySelected', JSON.stringify(company));
        render(_jsx(Registration, {}));
        // Check that disabled inputs show the localStorage data
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Male')).toBeInTheDocument();
        expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
        expect(screen.getByDisplayValue('CityX')).toBeInTheDocument();
    });
    it('shows licence error if licence number not containing hyphen', async () => {
        render(_jsx(Registration, {}));
        // upload certificate (click upload)
        fireEvent.click(screen.getByText('upload'));
        // fill in driver licence (without hyphen) and passport
        const licenceInput = screen.getByPlaceholderText('e.g., DL-9876543210');
        fireEvent.change(licenceInput, { target: { value: 'INVALID123' } });
        const passportInput = screen.getByPlaceholderText('e.g., Z7654321');
        fireEvent.change(passportInput, { target: { value: 'Z123' } });
        // Submit button should still be disabled because licence is invalid
        const submitBtn = screen.getByRole('button', { name: 'commans.submit' });
        expect(submitBtn).toBeDisabled();
        // Now click it and expect the error message to appear
        fireEvent.click(submitBtn);
        expect(await screen.findByText('registration.drivingLicenseErrorMsg')).toBeInTheDocument();
    });
    it('submits form when valid and navigates on success', async () => {
        // Use fake timers to manage the internal setTimeout in registrationStatus
        jest.useFakeTimers();
        // Mock the post_driver_registration service call
        const mockResponse = { success: true };
        jest.spyOn(relyingPartyService, 'post_driver_registration').mockResolvedValue(mockResponse);
        const driverInfo = {
            name: 'Jane Smith',
            gender: 'Female',
            email: 'jane@example.com',
            phone_number: '9876543210',
            address: { locality: 'TownY' },
            picture: 'someBase64String',
        };
        localStorage.setItem('driverInformation', JSON.stringify(driverInfo));
        localStorage.setItem('companySelected', JSON.stringify({ companyName: 'MyCo' }));
        render(_jsx(Registration, {}));
        // Simulate filling valid inputs
        fireEvent.click(screen.getByText('upload')); // upload certificate sets certificateUploaded and fileData
        const licenceInput = screen.getByPlaceholderText('e.g., DL-9876543210');
        fireEvent.change(licenceInput, { target: { value: 'DL-12345' } });
        const passportInput = screen.getByPlaceholderText('e.g., Z7654321');
        fireEvent.change(passportInput, { target: { value: 'Z7654321' } });
        // Now the submit button should be enabled
        const submitBtn = screen.getByRole('button', { name: 'commans.submit' });
        expect(submitBtn).toBeEnabled();
        // Submit the form
        act(() => {
            fireEvent.click(submitBtn);
        });
        // After submission, UI should show loader. Check for “registering” text.
        expect(await screen.findByText('registration.registering')).toBeInTheDocument();
        // Move time forward to allow setTimeout inside registrationStatus to execute
        act(() => {
            jest.advanceTimersByTime(3000);
        });
        await waitFor(() => {
            // navigate to confirmation page should be called
            expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/confirmationPagePage');
        });
    });
    it('shows error popup when registration fails', async () => {
        jest.useFakeTimers();
        // Mock failed post
        jest.spyOn(relyingPartyService, 'post_driver_registration').mockRejectedValue(new Error('fail'));
        const driverInfo = {
            name: 'Alice',
            gender: 'Female',
            email: 'alice@example.com',
            phone_number: '1122334455',
            address: { locality: 'LocZ' },
            picture: 'someBase64',
        };
        localStorage.setItem('driverInformation', JSON.stringify(driverInfo));
        localStorage.setItem('companySelected', JSON.stringify({ companyName: 'MyCo' }));
        render(_jsx(Registration, {}));
        // Fill valid fields
        fireEvent.click(screen.getByText('upload'));
        fireEvent.change(screen.getByPlaceholderText('e.g., DL-9876543210'), {
            target: { value: 'DL-67890' },
        });
        fireEvent.change(screen.getByPlaceholderText('e.g., Z7654321'), {
            target: { value: 'Z000' },
        });
        const submitBtn = screen.getByRole('button', { name: 'commans.submit' });
        fireEvent.click(submitBtn);
        expect(await screen.findByText('registration.registering')).toBeInTheDocument();
        act(() => {
            jest.advanceTimersByTime(3000);
        });
        // After failure, error popup should be visible
        expect(await screen.findByTestId('error-popup')).toBeInTheDocument();
    });
});
