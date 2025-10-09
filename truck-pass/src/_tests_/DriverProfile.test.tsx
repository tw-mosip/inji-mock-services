import { render, screen, fireEvent } from '@testing-library/react';
import { DriverProfile } from '../pages/requestTruckPass/DriverProfile';

// Mocking translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mocking navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mocking stepper
jest.mock('../path-to-component/TruckpassRequestStepper', () => ({
  TruckpassRequestStepper: () => <div data-testid="stepper" />,
}));

describe('DriverProfile Component', () => {
  const mockDriver = {
    fullName: 'John Doe',
    gender: 'Male',
    uin: 'UIN123456',
    phoneNumber: '1234567890',
    emailId: 'john.doe@example.com',
    city: 'New York',
    passportNumber: 'P1234567',
    driverLicenseNumber: 'DL1234567',
  };

  beforeEach(() => {
    localStorage.setItem('selectedDriver', JSON.stringify(mockDriver));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders driver info from localStorage', () => {
    render(<DriverProfile />);

    expect(screen.getByText('driverProfilePage.driverFound')).toBeInTheDocument();
    expect(screen.getByText('driverProfilePage.driverProfileSuccessMsg')).toBeInTheDocument();
    expect(screen.getByText(mockDriver.fullName)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.gender)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.uin)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.phoneNumber)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.emailId)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.city)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.driverLicenseNumber)).toBeInTheDocument();
    expect(screen.getByText(mockDriver.passportNumber)).toBeInTheDocument();
  });

  it('navigates back to search driver on "Go Back" click', () => {
    render(<DriverProfile />);
    const goBackButton = screen.getByRole('button', { name: 'commans.goBack' });
    fireEvent.click(goBackButton);

    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/searchDriver');
  });

  it('navigates to consignment details on "Continue" click', () => {
    render(<DriverProfile />);
    const continueButton = screen.getByRole('button', { name: 'commans.continue' });
    fireEvent.click(continueButton);

    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/consignmentDetails');
  });
});
