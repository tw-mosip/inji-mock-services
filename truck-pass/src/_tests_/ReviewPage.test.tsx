import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReviewPage } from '../pages/requestTruckPass/ReviewPage';
import relyingPartyService from '../services/relyingPartyService';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock relyingPartyService
jest.mock('../../services/relyingPartyService', () => ({
  post_driver_details: jest.fn(),
}));

// Mock base64ToFile utility if necessary
jest.mock('../../commans/AppUtilities', () => ({
  base64ToFile: jest.fn(( filename) => filename),
}));

describe('ReviewPage Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // Setup localStorage mock
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Seed localStorage with test data
    localStorage.setItem('selectedDriver', JSON.stringify({
      uin: '123456',
      fullName: 'John Doe',
      phoneNumber: '1234567890',
      gender: 'Male',
      emailId: 'john@example.com',
      city: 'CityX',
      faceImagePath: 'faceImageBase64',
      driverLicenseNumber: 'DL123456',
      passportNumber: 'P123456',
    }));

    localStorage.setItem('consignmentDetails', JSON.stringify({
      inVoiceNumber: 'INV123',
      waybillNumber: 'WB123',
      weightCertificate: 'weightCertBase64',
      customDocument: 'customDocBase64',
    }));

    localStorage.setItem('vehicleDetails', JSON.stringify({
      vehicleType: 'Truck',
      axleSize: '4',
      truckLicensePlate: 'ABC-123',
      vehicleRegistrationDocument: 'regDocBase64',
    }));

    localStorage.setItem('journeyDetails', JSON.stringify({
      originCountry: 'CountryA',
      exporterCompany: 'Exporter Inc.',
      dateOfDeparture: '2024-01-01',
      borderOfDeparture: 'BorderA',
      destinationCountry: 'CountryB',
      importerCompany: 'Importer LLC',
      dateOfArrival: '2024-01-05',
      borderOfArrival: 'BorderB',
    }));
  });

  test('renders review page with loaded localStorage data', async () => {
    render(<ReviewPage />);

    // Wait for the data to render
    expect(await screen.findByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/INV123/)).toBeInTheDocument();
    expect(screen.getByText(/Truck/)).toBeInTheDocument();
    expect(screen.getByText(/CountryA/)).toBeInTheDocument();

    // Check buttons exist
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirm and submit/i })).toBeInTheDocument();
  });

  test('back button navigates to journey details page', () => {
    render(<ReviewPage />);

    const backButton = screen.getByRole('button', { name: /go back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/journeyDetails');
  });

  test('confirm and submit button calls post_driver_details and shows success screen', async () => {
    (relyingPartyService.post_driver_details as jest.Mock).mockResolvedValue({
      status: 201,
    });

    render(<ReviewPage />);

    const submitButton = screen.getByRole('button', { name: /confirm and submit/i });
    fireEvent.click(submitButton);

    // Wait for async submission to finish
    await waitFor(() => {
      expect(relyingPartyService.post_driver_details).toHaveBeenCalledTimes(1);
    });

    // Check that success screen shows up
    expect(screen.getByText(/registration success/i)).toBeInTheDocument();
  });

  test('disables submit button while submitting', async () => {
    let resolvePromise: (value?: unknown) => void;
    const promise = new Promise((resolve) => { resolvePromise = resolve });

    (relyingPartyService.post_driver_details as jest.Mock).mockReturnValue(promise);

    render(<ReviewPage />);
    const submitButton = screen.getByRole('button', { name: /confirm and submit/i });
    
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();

    resolvePromise!();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('logs error when submission fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (relyingPartyService.post_driver_details as jest.Mock).mockRejectedValue(new Error('Network Error'));

    render(<ReviewPage />);

    const submitButton = screen.getByRole('button', { name: /confirm and submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error during submission:', 'Network Error');
    });

    consoleErrorSpy.mockRestore();
  });

  test('submit another application button navigates to dashboard', async () => {
    (relyingPartyService.post_driver_details as jest.Mock).mockResolvedValue({
      status: 201,
    });

    render(<ReviewPage />);

    // Submit to show success screen
    const submitButton = screen.getByRole('button', { name: /confirm and submit/i });
    fireEvent.click(submitButton);

    // Wait for success screen
    await waitFor(() => {
      expect(screen.getByText(/registration success/i)).toBeInTheDocument();
    });

    const anotherAppButton = screen.getByRole('button', { name: /submit another application/i });
    fireEvent.click(anotherAppButton);

    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/requestedPassesDashboard');
  });
});
