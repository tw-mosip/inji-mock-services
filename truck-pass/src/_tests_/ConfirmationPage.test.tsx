import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ConfirmationPage } from '../pages/driverRegistration/ConfirmationPage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../commans/Stepper';
import { SuccessPopup } from '../components/SuccessPopup';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../commans/Stepper', () => ({
  Stepper: jest.fn(() => <div data-testid="stepper">Stepper Component</div>),
}));

jest.mock('../components/SuccessPopup', () => ({
  SuccessPopup: jest.fn(({ showSuccessPopup, setShowSuccessPopup }) => (
    showSuccessPopup ? (
      <div data-testid="success-popup">Success Popup</div>
    ) : null
  )),
}));

jest.mock('../../assets/confirmation_icon.png', () => 'confirmation_icon.png');
jest.mock('../../assets/user_photo.png', () => 'user_photo.png');
jest.mock('../../assets/Hide_Details.png', () => 'Hide_Details.png');
jest.mock('../../assets/Show_Details.png', () => 'Show_Details.png');

describe('ConfirmationPage Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.useFakeTimers();
    (Stepper as jest.Mock).mockClear();
    (SuccessPopup as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders confirmation page elements correctly', async () => {
    render(<ConfirmationPage />);

    expect(screen.getByText('confirmationPage.registrationCompleted')).toBeInTheDocument();
    expect(screen.getByText('confirmationPage.SuccessFullySubmitText')).toBeInTheDocument();
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.getByAltText('confirmation_icon')).toBeInTheDocument();
    expect(screen.getByAltText('user_photo')).toBeInTheDocument();
    expect(screen.getByText('confirmationPage.driverSummary')).toBeInTheDocument();
  });

  test('shows success popup on mount and hides after 5 seconds', async () => {
    render(<ConfirmationPage />);

    expect(screen.getByTestId('success-popup')).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(5000);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('success-popup')).not.toBeInTheDocument();
    });
  });

  test('toggles driver summary details visibility', async () => {
    render(<ConfirmationPage />);

    const hideDetailsButton = screen.getByText('Hide Details');
    expect(screen.getByText('Rajesh Singh')).toBeInTheDocument();
    expect(screen.getByText('198765432123')).toBeInTheDocument();
    expect(screen.getByText('myemail@gmail.com')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(hideDetailsButton);
      jest.advanceTimersByTime(500);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('19********23')).toBeInTheDocument(); 
      expect(screen.getByText('my*************om')).toBeInTheDocument();
      expect(screen.getByText('Show Details')).toBeInTheDocument();
    });

    const showDetailsButton = screen.getByText('Show Details');
    await act(async () => {
      fireEvent.click(showDetailsButton);
      jest.advanceTimersByTime(500);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Rajesh Singh')).toBeInTheDocument();
      expect(screen.getByText('198765432123')).toBeInTheDocument();
      expect(screen.getByText('myemail@gmail.com')).toBeInTheDocument();
    });
  });

  test('displays driver summary items correctly', async () => {
    render(<ConfirmationPage />);

    const items = [
      'confirmationPage.fullName',
      'confirmationPage.uin',
      'confirmationPage.gender',
      'confirmationPage.email',
      'confirmationPage.phoneNumber',
      'confirmationPage.city',
      'confirmationPage.transportCompany',
      'confirmationPage.licenseNum',
      'confirmationPage.passportNumber',
      'confirmationPage.cpcCertificate',
    ];

    items.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    expect(screen.getByText('Rajesh Singh')).toBeInTheDocument();
    expect(screen.getByText('198765432123')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('myemail@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('+91 9876543210')).toBeInTheDocument();
    expect(screen.getByText('Chandigarh')).toBeInTheDocument();
    expect(screen.getByText('TransGlobal Logistics Ltd.')).toBeInTheDocument();
    expect(screen.getByText('DL-9876543210')).toBeInTheDocument();
    expect(screen.getByText('Z7654321')).toBeInTheDocument();
    expect(screen.getByText('File Uploaded')).toBeInTheDocument();
  });

  test('navigates to LandingPage on start new registration button click', async () => {
    render(<ConfirmationPage />);

    const startNewButton = screen.getByText('confirmationPage.startNewRegistrationBtn');
    await act(async () => {
      fireEvent.click(startNewButton);
      jest.advanceTimersByTime(500);
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/LandingPage');
    });
  });
});

// Test1: Checks if the confirmation page shows all its main parts when it loads
// Test2: Tests if a success popup appears when the page loads and disappears after 5 seconds
// Test3: Checks if clicking buttons can hide or show the driver’s details
// Test4: Verifies that all driver summary items are displayed with the right information
// Test5: Tests if clicking the "Start New Registration" button takes you to the LandingPage