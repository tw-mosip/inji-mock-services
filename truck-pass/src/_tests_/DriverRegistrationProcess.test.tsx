import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DriverRegistrationProcess from '../pages/driverRegistration/DriverRegistrationProcess';
import { useTranslation } from 'react-i18next';
import { DriverRegistrationFlow } from '../shared/DriverRegistrationFlow';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Mock translation keys to return themselves
  }),
}));

jest.mock('../shared/DriverRegistrationFlow', () => ({
  DriverRegistrationFlow: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="driver-registration-flow" className="bg-[url('../assets/landingPage_bg.png')] w-full">{children}</div>
  ),
}));

describe('DriverRegistrationProcess Component', () => {
  test('renders layout with title, description, flow, and footer', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;
    render(
      <MemoryRouter>
        <DriverRegistrationProcess>{testChild}</DriverRegistrationProcess>
      </MemoryRouter>
    );

    expect(screen.getByText(/driverRegistrationProcess\.processMainTitle/i)).toBeInTheDocument();
    expect(screen.getByText(/driverRegistrationProcess\.respDescription/i)).toBeInTheDocument();
    expect(screen.getByTestId('driver-registration-flow')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText(/footer\.footerText/i)).toBeInTheDocument();
    expect(screen.getByTestId('driver-registration-flow')).toHaveClass('bg-[url(\'../assets/landingPage_bg.png\')] w-full');
  });
});