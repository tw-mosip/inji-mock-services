import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Stepper } from '../commans/Stepper'; 

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, 
  }),
}));

describe('Stepper', () => {
  const defaultProps = {
    consentStatus: false,
    selectCompanyStatus: false,
    uinVerificationStatus: false,
    registrationStatus: false,
    confirmationStatus: false,
  };

  test('renders initial UI elements with default props', () => {
    render(<Stepper {...defaultProps} />);

    expect(screen.getByText(/stepper.registrationProcess/i, { selector: 'h3' })).toBeInTheDocument(); 
    expect(screen.getByText(/stepper.consentAndAgreement/i, { selector: 'p' })).toBeInTheDocument(); 
    expect(screen.getByText(/stepper.selectCompany/i, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText(/stepper.uinVerification/i, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText(/stepper.registration/i, { selector: 'p' })).toBeInTheDocument(); 
    expect(screen.getByText(/stepper.submitApplication/i, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText(/stepper.confirmation/i, { selector: 'p' })).toBeInTheDocument();
    expect(screen.getAllByRole('img', { name: /connector_icon/i }).length).toBe(6); 
    expect(screen.getAllByText(/\d/).length).toBe(6); 
  });

  test('updates step states based on props', () => {
    const props = {
      ...defaultProps,
      consentStatus: true,
      selectCompanyStatus: true,
      uinVerificationStatus: true,
      registrationStatus: false,
      confirmationStatus: false,
    };

    render(<Stepper {...props} />);

    expect(screen.getByText(/stepper.consentAndAgreement/i, { selector: 'p' })).toHaveClass('text-[#079455]');
    expect(screen.getByText(/stepper.selectCompany/i, { selector: 'p' })).toHaveClass('text-[#079455]');
    expect(screen.getByText(/stepper.uinVerification/i, { selector: 'p' })).toHaveClass('text-[#079455]');
    expect(screen.getAllByRole('img', { name: /tick_icon/i }).length).toBe(3); 

    expect(screen.getByText(/stepper.registration/i, { selector: 'p' })).toHaveClass('text-[#006DE7]');
    expect(screen.getByText(/commans.inProgress/i)).toBeInTheDocument();

    expect(screen.getByText(/stepper.submitApplication/i, { selector: 'p' })).toHaveClass('text-[#747D89]');
    expect(screen.getByText(/stepper.confirmation/i, { selector: 'p' })).toHaveClass('text-[#747D89]');
  });

  test('hides connector for last step', () => {
    render(<Stepper {...defaultProps} />);

    const connectors = screen.getAllByRole('img', { name: /connector_icon/i });
    expect(connectors.length).toBe(6); 
    expect(connectors[5]).toHaveClass('hidden'); 
  });

  test('handles all true props', () => {
    const allTrueProps = {
      consentStatus: true,
      selectCompanyStatus: true,
      uinVerificationStatus: true,
      registrationStatus: true,
      confirmationStatus: true,
    };

    render(<Stepper {...allTrueProps} />);

    expect(screen.getAllByRole('img', { name: /tick_icon/i }).length).toBe(6); 
    expect(screen.queryByText(/commans.inProgress/i)).not.toBeInTheDocument();
    expect(screen.getByText(/stepper.confirmation/i, { selector: 'p' })).toHaveClass('text-[#079455]');
  });
});

// Test1: Checks if the stepper shows all steps and connectors with default settings
// Test2: Verifies that step colors and ticks update based on which steps are completed or in progress
// Test3: Ensures the connector line is hidden for the last step
// Test4: Confirms that all steps show as completed with ticks when all props are true