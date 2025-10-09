import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/requestTruckPass/LoginPage';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Mock useNavigate
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'loginPage.header': 'Welcome',
        'loginPage.desc': 'Please enter your email',
        'loginPage.enterYourEmail': 'Enter your email',
        'loginPage.eailErrorMsg': 'Invalid email address',
        'loginPage.continueWithEmail': 'Continue with Email',
        'loginPage.pleaseWait': 'Please wait...',
      };
      return translations[key] || key;
    },
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the login form', () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    expect(screen.getByText('Welcome')).toBeInTheDocument();
    expect(screen.getByText('Please enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue with Email' })).toBeInTheDocument();
  });

  test('shows error message on invalid email', async () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button', { name: 'Continue with Email' });

    await userEvent.type(input, 'invalid-email');
    fireEvent.submit(button);

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test('submits form and navigates on valid email', async () => {
    jest.useFakeTimers(); // for handling setTimeout
    render(<LoginPage />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button', { name: 'Continue with Email' });

    await userEvent.type(input, 'user@example.com');
    fireEvent.submit(button);

    // Button shows loading text
    expect(screen.getByRole('button')).toHaveTextContent('Please wait...');

    // Fast-forward the timeout
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/otpVerification', {
        state: { email: 'user@example.com' },
      });
    });

    jest.useRealTimers();
  });

  test('disables button when email is empty or invalid', async () => {
    render(<LoginPage />, { wrapper: MemoryRouter });

    const input = screen.getByPlaceholderText('Enter your email');
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();

    await userEvent.type(input, 'invalid-email');
    expect(button).not.toBeDisabled();

    fireEvent.submit(button);

    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(button).toBeDisabled(); // Disabled due to error
  });
});
