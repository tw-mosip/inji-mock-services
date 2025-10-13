import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConsignmentDetails } from '../pages/requestTruckPass/ConsignmentDetails';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // returns the key for simplicity
    }),
}));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));
jest.mock('../../components/CertificateUploadSection', () => ({
    CertificateUploadingSection: ({ setFileUploaded, setDataInFile }) => {
        // Simulate immediate upload success
        React.useEffect(() => {
            setFileUploaded(true);
            setDataInFile('fake-file-data');
        }, []);
        return _jsx("div", { "data-testid": "mock-upload-section", children: "Mock Upload Section" });
    },
}));
jest.mock('../../assets/cube_icon.png', () => 'cube_icon.png');
jest.mock('../../assets/help_icon.png', () => 'help_icon.png');
jest.mock('../../components/Tooltip', () => ({ helpText }) => _jsx("span", { children: helpText }));
describe('ConsignmentDetails component', () => {
    const setup = () => render(_jsx(MemoryRouter, { children: _jsx(ConsignmentDetails, {}) }));
    beforeEach(() => {
        localStorage.clear();
    });
    it('renders inputs and buttons', () => {
        setup();
        expect(screen.getByPlaceholderText('consignmentDetails.inVoiceNumPlaceHolder')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('consignmentDetails.waybillNumPlaceHolder')).toBeInTheDocument();
        expect(screen.getByText('commans.continue')).toBeInTheDocument();
        expect(screen.getByText('commans.goBack')).toBeInTheDocument();
        expect(screen.getAllByTestId('mock-upload-section')).toHaveLength(2);
    });
    it('shows error messages when required inputs are invalid', async () => {
        setup();
        const continueButton = screen.getByText('commans.continue');
        fireEvent.click(continueButton);
        expect(await screen.findByText('consignmentDetails.invoiceNumErrorMsg')).toBeInTheDocument();
        expect(screen.getByText('consignmentDetails.waybillNumErrorMsg')).toBeInTheDocument();
    });
    it('accepts valid inputs and stores data in localStorage', async () => {
        setup();
        const invoiceInput = screen.getByPlaceholderText('consignmentDetails.inVoiceNumPlaceHolder');
        const waybillInput = screen.getByPlaceholderText('consignmentDetails.waybillNumPlaceHolder');
        const continueButton = screen.getByText('commans.continue');
        await userEvent.type(invoiceInput, 'INV-123');
        await userEvent.type(waybillInput, 'WAY-456');
        fireEvent.click(continueButton);
        await waitFor(() => {
            const stored = localStorage.getItem('consignmentDetails');
            expect(stored).not.toBeNull();
            const parsed = JSON.parse(stored);
            expect(parsed.inVoiceNumber).toBe('INV-123');
            expect(parsed.waybillNumber).toBe('WAY-456');
            expect(parsed.weightCertificate).toBe('fake-file-data');
            expect(parsed.customDocument).toBe('fake-file-data');
        });
    });
    it('navigates to driver profile on "Go Back"', () => {
        const mockNavigate = jest.fn();
        require('react-router-dom').useNavigate = () => mockNavigate;
        setup();
        const goBackButton = screen.getByText('commans.goBack');
        fireEvent.click(goBackButton);
        expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/driverProfile');
    });
});
