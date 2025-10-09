import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VehicleDetails } from '../pages/requestTruckPass/VehicleDetails';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock assets
jest.mock('../../assets/help_icon.png', () => 'help_icon.png');
jest.mock('../../assets/truck_icon.png', () => 'truck_icon.png');

// Mock Tooltip
jest.mock('../../components/Tooltip', () => ({ helpText }: any) => <span>{helpText}</span>);

// Mock Dropdown component
jest.mock('../../components/DropDownSelection', () => ({
  DropDownSelection: ({ setItemSelected, data, placeHolder }: any) => {
    return (
      <select
        data-testid={placeHolder}
        onChange={(e) => {
          const selected = data.find((d: any) => d.type === e.target.value || d.size === e.target.value);
          setItemSelected(selected);
        }}
      >
        <option>{placeHolder}</option>
        {data.map((item: any) => (
          <option key={item.id} value={item.type || item.size}>
            {item.type || item.size}
          </option>
        ))}
      </select>
    );
  },
}));

// Mock certificate upload
jest.mock('../../components/CertificateUploadSection', () => ({
  CertificateUploadingSection: ({ setFileUploaded, setDataInFile }: any) => {
    React.useEffect(() => {
      setFileUploaded(true);
      setDataInFile('mock-file-data');
    }, []);
    return <div data-testid="mock-upload-section">Mock Upload</div>;
  },
}));

describe('VehicleDetails component', () => {
  const setup = () => render(
    <MemoryRouter>
      <VehicleDetails />
    </MemoryRouter>
  );

  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
  });

  it('renders all key inputs and buttons', () => {
    setup();
    expect(screen.getByText('vehicleDetails.header')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., ABC-1223')).toBeInTheDocument();
    expect(screen.getByText('commans.continue')).toBeInTheDocument();
    expect(screen.getByText('commans.goBack')).toBeInTheDocument();
  });

  it('shows error message if license plate is invalid', async () => {
    setup();

    const continueButton = screen.getByText('commans.continue');
    fireEvent.click(continueButton);

    expect(await screen.findByText('vehicleDetails.truckNumberErrorMsg')).toBeInTheDocument();
  });

  it('submits form with valid data and stores in localStorage', async () => {
    setup();

    // Fill dropdowns
    fireEvent.change(screen.getByTestId('vehicleDetails.selectVehicleType'), {
      target: { value: 'Light Commercial Vehicle' }
    });

    fireEvent.change(screen.getByTestId('vehicleDetails.selectAxleSize'), {
      target: { value: '2 axle' }
    });

    // Type valid license plate
    await userEvent.type(screen.getByPlaceholderText('e.g., ABC-1223'), 'TRK-2024');

    // Click continue
    const continueButton = screen.getByText('commans.continue');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(localStorage.getItem('vehicleDetails')).not.toBeNull();
      const stored = JSON.parse(localStorage.getItem('vehicleDetails')!);
      expect(stored.vehicleType).toBe('Light Commercial Vehicle');
      expect(stored.axleSize).toBe('2 axle');
      expect(stored.truckLicensePlate).toBe('TRK-2024');
      expect(stored.vehicleRegistrationDocument).toBe('mock-file-data');
    });

    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/journeyDetails');
  });

  it('goes back to consignment details on Go Back button click', () => {
    setup();
    fireEvent.click(screen.getByText('commans.goBack'));
    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/consignmentDetails');
  });
});
