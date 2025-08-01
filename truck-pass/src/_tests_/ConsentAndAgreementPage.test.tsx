import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConsentAndAgreementPage } from '../pages/driverRegistration/ConsentAndAgreementPage'; 
import { Stepper } from '../commans/Stepper'; 

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/driverRegistrationProcessPage/consentAndAgreementPage' }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, 
  }),
}));

jest.mock('../commans/Stepper', () => ({
  Stepper: jest.fn((props) => <div data-testid="stepper" />), 
}));

describe('ConsentAndAgreementPage', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  });

  test('renders initial UI elements', () => {
    render(
      <MemoryRouter>
        <ConsentAndAgreementPage />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <ConsentAndAgreementPage />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <ConsentAndAgreementPage />
      </MemoryRouter>
    );

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
    render(
      <MemoryRouter>
        <ConsentAndAgreementPage />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /consentAndAgreementPage.getStarted/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('passes correct props to Stepper', () => {
    render(
      <MemoryRouter>
        <ConsentAndAgreementPage />
      </MemoryRouter>
    );

    expect(require('../commans/Stepper').Stepper).toHaveBeenCalledWith(
      expect.objectContaining({
        consentStatus: false,
        selectCompanyStatus: false,
        uinVerificationStatus: false,
        registrationStatus: false,
        confirmationStatus: false,
      }),
      undefined 
    );

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

// Test1: Checks if the page shows all the initial parts like title, description, and buttons when it loads
// Test2: Tests if checking the box changes the button color and enables it
// Test3: Checks if clicking the button takes you to the next page when the box is checked
// Test4: Verifies that clicking the button does nothing when the box is not checked
// Test5: Ensures the Stepper component gets the right settings when the page starts