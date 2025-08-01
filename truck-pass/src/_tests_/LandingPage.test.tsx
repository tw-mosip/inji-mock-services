import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../pages/driverRegistration/LandingPage';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

describe('LandingPage', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
  });

  test('renders initial UI elements', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/landingPage.landingPageTitle/i)).toBeInTheDocument();
    expect(screen.getByText(/landingPage.landingPageSubTitle/i)).toBeInTheDocument();
    expect(screen.getByAltText('Line Pattern Left')).toBeInTheDocument();
    expect(screen.getByAltText('Line Pattern Right')).toBeInTheDocument();

    expect(screen.getByText(/landingPage.getStartedToday/i)).toBeInTheDocument();
    expect(screen.getByText(/landingPage.driverRegistration/i)).toBeInTheDocument();
    expect(screen.getByTestId('request-truck-pass-title')).toBeInTheDocument();
    expect(screen.getByAltText('Driver Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Truck Pass Icon')).toBeInTheDocument();

    expect(screen.getByText(/landingPage.howItWorks/i)).toBeInTheDocument();
    expect(screen.getByText(/landingPage.landingPageInfo/i)).toBeInTheDocument();
    expect(screen.getAllByText(/landingPage.subApplication/i)[0]).toBeInTheDocument(); // First occurrence
    expect(screen.getByTestId('step-security-verification')).toBeInTheDocument();
    expect(screen.getByTestId('step-approval-and-issuance')).toBeInTheDocument();
    expect(screen.getByTestId('step-cross-border')).toBeInTheDocument();

    expect(screen.getByText(/footer.footerText/i)).toBeInTheDocument();
  });

  test('handles driver registration card hover and navigation', async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const driverCard = screen.getByText(/landingPage.driverRegistration/i).closest('div');
    expect(driverCard).toHaveClass('border-transparent');

    await act(async () => {
      fireEvent.mouseEnter(driverCard!);
    });
    await waitFor(() => {
      expect(screen.getByAltText('Driver Icon')).toHaveClass('bg-[#006DE7]');
    }, { timeout: 500 });

    const registerButton = screen.getByText(/landingPage.registerAsDriver/i);
    await act(async () => {
      fireEvent.click(registerButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/consentAndAgreementPage');
  });

  test('handles truck pass card hover and navigation', async () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const truckPassCard = screen.getByRole('img', { name: /Truck Pass Icon/ }).closest('div');
    expect(truckPassCard).toHaveClass('border-transparent');

    await act(async () => {
      fireEvent.mouseEnter(truckPassCard!);
    });
    await waitFor(() => {
      expect(screen.getByAltText('Truck Pass Icon')).toHaveClass('bg-[#006DE7]');
    }, { timeout: 500 });

    const loginButton = screen.getByText(/landingPage.login/i);
    await act(async () => {
      fireEvent.click(loginButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith('/truckpasslogin');
  });

  test('renders streamlined process steps correctly', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const steps = screen.getAllByRole('img', { name: /Step [1-4]/i });
    expect(steps.length).toBe(4);
    expect(screen.getByText(/landingPage.subApplicationInfo/i)).toBeInTheDocument();
    expect(screen.getByText(/landingPage.securityVerificationInfo/i)).toBeInTheDocument();
    expect(screen.getByText(/landingPage.approvalAndIssuanceInfo/i)).toBeInTheDocument();
    expect(screen.getByText(/landingPage.crossBorderInfo/i)).toBeInTheDocument();
  });
});

// Test1: Checks if the page shows all its main parts like the header, get started section, how it works section, and footer when it loads
// Test2: Tests if hovering over the driver registration card changes the icon color and clicking the register button navigates to the consent page
// Test3: Tests if hovering over the truck pass card changes the icon color and clicking the login button navigates to the login page
// Test4: Verifies that the streamlined process steps with their images and descriptions are displayed correctly