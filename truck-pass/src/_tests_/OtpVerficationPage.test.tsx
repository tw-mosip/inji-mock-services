import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import OtpVerificationPage from '../pages/requestTruckPass/OtpVerificationPage';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      const translations: Record<string, string> = {
        'otpVerification.checkYourEmail': 'Check your email',
        'otpVerification.otpDesc': 'Enter the 6-digit OTP sent to your email',
        'otpVerification.otpErrMsg1': 'Please enter the full OTP',
        'otpVerification.otpErrMsg2': 'Incorrect OTP',
        'otpVerification.verifying': 'Verifying...',
        'otpVerification.verifyEmail': 'Verify Email',
        'otpVerification.notReciveEmail': 'Didn’t receive the email?',
        'otpVerification.resendOtpTime': `Resend OTP in ${options?.timer}s`,
        'otpVerification.clickToResend': 'Click to resend',
        'otpVerification.backToLogin': 'Back to login',
        'footer.footerText': 'Some footer text',
      };
      return translations[key] || key;
    },
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('OtpVerificationPage', () => {
  const setup = () =>
    render(
      <MemoryRouter initialEntries={[{ pathname: '/otp', state: { email: 'test@example.com' } }]}>
        <Routes>
          <Route path="/otp" element={<OtpVerificationPage />} />
        </Routes>
      </MemoryRouter>
    );

  test('renders all 6 OTP input fields and shows email', () => {
    setup();

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Check your email')).toBeInTheDocument();
  });

  test('allows typing only digits and auto-focuses next input', async () => {
    setup();

    const inputs = screen.getAllByRole('textbox');
    await userEvent.type(inputs[0], '1');
    expect(inputs[0]).toHaveValue('1');
    expect(document.activeElement).toBe(inputs[1]);

    // Try non-digit input
    await userEvent.type(inputs[1], 'a');
    expect(inputs[1]).toHaveValue('');
  });

  test('shows error when OTP is incomplete', async () => {
    setup();

    const button = screen.getByRole('button', { name: 'Verify Email' });
    fireEvent.click(button);

    expect(await screen.findByText('Please enter the full OTP')).toBeInTheDocument();
  });

  test('shows error when OTP is incorrect', async () => {
    setup();

    const inputs = screen.getAllByRole('textbox');
    const invalidOtp = ['1', '2', '3', '4', '5', '6'];
    for (let i = 0; i < 6; i++) {
      await userEvent.type(inputs[i], invalidOtp[i]);
    }

    const button = screen.getByRole('button', { name: 'Verify Email' });
    fireEvent.click(button);

    expect(await screen.findByText('Incorrect OTP')).toBeInTheDocument();
  });

  test('navigates on correct OTP entry after 1s delay', async () => {
    jest.useFakeTimers();
    setup();

    const inputs = screen.getAllByRole('textbox');
    const correctOtp = ['1', '1', '1', '1', '1', '1'];
    for (let i = 0; i < 6; i++) {
      await userEvent.type(inputs[i], correctOtp[i]);
    }

    const button = screen.getByRole('button', { name: 'Verify Email' });
    fireEvent.click(button);

    expect(button).toHaveTextContent('Verifying...');
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/searchDriver');
    });

    jest.useRealTimers();
  });

  test('resend button is disabled initially and becomes enabled after timer', async () => {
    jest.useFakeTimers();
    setup();

    const resendButton = screen.getByRole('button', { name: /Resend OTP in/i });
    expect(resendButton).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(5000); // fast forward timer
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Click to resend' })).toBeEnabled();
    });

    jest.useRealTimers();
  });

  test('resend button resets OTP and timer', async () => {
    jest.useFakeTimers();
    setup();

    const inputs = screen.getAllByRole('textbox');
    for (let i = 0; i < 3; i++) {
      await userEvent.type(inputs[i], (i + 1).toString());
    }

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    const resendButton = await screen.findByRole('button', { name: 'Click to resend' });
    fireEvent.click(resendButton);

    const resetInputs = screen.getAllByRole('textbox');
    for (let input of resetInputs) {
      expect(input).toHaveValue('');
    }

    expect(resendButton).toBeDisabled();
    jest.useRealTimers();
  });

  test('back button navigates to login page', () => {
    setup();

    const backButton = screen.getByRole('button', { name: /Back to login/i });
    fireEvent.click(backButton);

    expect(mockedNavigate).toHaveBeenCalledWith('requestTruckpassProcess/loginPage');
  });
});
