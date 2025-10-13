import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationPage } from '../pages/driverRegistration/ConfirmationPage';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            if (options?.driverName)
                return `Driver Name: ${options.driverName}`;
            return key;
        },
    }),
}));
jest.mock('../../assets/confirmation_icon.png', () => 'mocked_confirmation_icon.png');
jest.mock('../../components/SuccessPopup', () => ({
    SuccessPopup: () => _jsx("div", { children: "SuccessPopup" }),
}));
describe('ConfirmationPage', () => {
    const mockedNavigate = useNavigate();
    beforeEach(() => {
        localStorage.clear();
        mockedNavigate.mockReset();
    });
    const renderComponent = () => render(_jsx(BrowserRouter, { children: _jsx(ConfirmationPage, {}) }));
    it('renders component with no localStorage data (empty case)', () => {
        renderComponent();
        expect(screen.getByTestId('confirmation-page')).toBeInTheDocument();
        expect(screen.getByTestId('driver-summary')).toBeInTheDocument();
        expect(screen.getByTestId('new-registration-btn')).toBeInTheDocument();
    });
    it('renders component with valid localStorage data', () => {
        localStorage.setItem('driverDetails', JSON.stringify({
            fullName: 'John Doe',
            uin: 'UIN123',
            gender: 'Male',
            emailId: 'john@example.com',
            phoneNumber: '1234567890',
            city: 'New York',
            driverLicenseNum: 'DL12345',
            passportNum: 'P123456',
            transportCompany: 'XYZ Logistics',
        }));
        localStorage.setItem('driverAdditionalFiles', JSON.stringify({
            driverPicture: 'mocked_driver_picture.png',
            cpcFile: 'mocked_cpc.pdf',
        }));
        renderComponent();
        expect(screen.getByText('confirmationPage.registrationCompleted')).toBeInTheDocument();
        expect(screen.getByText('confirmationPage.SuccessFullySubmitText')).toBeInTheDocument();
        expect(screen.getByText('Driver Name: John Doe')).toBeInTheDocument();
        expect(screen.getByAltText('driver_user_icon')).toBeInTheDocument();
        expect(screen.getByText('confirmationPage.fullName')).toBeInTheDocument();
    });
    it('handles missing additionalInfo.driverPicture gracefully', () => {
        localStorage.setItem('driverDetails', JSON.stringify({
            fullName: 'Jane Doe',
        }));
        localStorage.setItem('driverAdditionalFiles', JSON.stringify({
            driverPicture: '', // Missing image
            cpcFile: 'file.pdf',
        }));
        renderComponent();
        expect(screen.queryByAltText('driver_user_icon')).not.toBeInTheDocument();
    });
    it('handles missing driverAdditionalFiles in localStorage', () => {
        localStorage.setItem('driverDetails', JSON.stringify({
            fullName: 'Alice',
        }));
        renderComponent();
        expect(screen.getByText('Driver Name: Alice')).toBeInTheDocument();
    });
    it('handles invalid JSON in localStorage gracefully', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        localStorage.setItem('driverDetails', '{invalid_json');
        renderComponent();
        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
    it('navigates to /landingPage on button click', () => {
        renderComponent();
        const button = screen.getByTestId('new-registration-btn');
        fireEvent.click(button);
        expect(mockedNavigate).toHaveBeenCalledWith('/landingPage');
    });
    it('renders SuccessPopup when showSuccessPopup is toggled', () => {
        renderComponent();
        const popupButton = screen.getByTestId('show-success-popup-btn');
        fireEvent.click(popupButton);
        expect(screen.getByText('SuccessPopup')).toBeInTheDocument(); // Based on component mock
    });
});
