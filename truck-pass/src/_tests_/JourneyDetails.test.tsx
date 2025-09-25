import { render, screen, fireEvent } from '@testing-library/react';
import { JourneyDetails } from '../pages/requestTruckPass/JourneyDetails';
import { BrowserRouter } from 'react-router-dom';

// Mock useNavigate from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock useTranslation hook to return keys as strings
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock DropDownSelection component
jest.mock('../../components/DropDownSelection', () => ({
  DropDownSelection: ({ setItemSelected, placeHolder }: any) => (
    <select
      aria-label={placeHolder}
      onChange={(e) => setItemSelected(JSON.parse(e.target.value))}
      data-testid={placeHolder}
    >
      <option value="">Select</option>
      <option value={JSON.stringify({ country: 'India' })}>India</option>
      <option value={JSON.stringify({ country: 'China' })}>China</option>
      <option value={JSON.stringify({ departurePoint: 'Attari(Punjab)' })}>Attari(Punjab)</option>
      <option value={JSON.stringify({ arrivalPoint: 'Petrapole' })}>Petrapole</option>
    </select>
  ),
}));

// Mock Tooltip to just render children
jest.mock('../../components/Tooltip', () => () => <div data-testid="tooltip" />);

describe('JourneyDetails', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    localStorage.clear();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <JourneyDetails />
      </BrowserRouter>
    );

  test('renders JourneyDetails form', () => {
    setup();
    expect(screen.getByText('journeyDetails.header')).toBeInTheDocument();
  });

  test('disables continue button initially', () => {
    setup();
    const continueBtn = screen.getByText('commans.continue') as HTMLButtonElement;
    expect(continueBtn).toBeDisabled();
  });

  test('enables continue button when all required fields are filled', () => {
    setup();

    // Select origin country
    fireEvent.change(screen.getByLabelText('journeyDetails.selectCountry'), {
      target: { value: JSON.stringify({ country: 'India' }) },
    });

    // Type exporter company
    fireEvent.change(screen.getByPlaceholderText('journeyDetails.exporterPlaceHolder'), {
      target: { value: 'Exporter Inc.' },
    });

    // Set departure date
    fireEvent.change(screen.getByLabelText('journeyDetails.plannedDepartureDate *'), {
      target: { value: '2025-09-25' },
    });

    // Select departure crossing point
    fireEvent.change(screen.getByLabelText('journeyDetails.selectBorderCrossing'), {
      target: { value: JSON.stringify({ departurePoint: 'Attari(Punjab)' }) },
    });

    // Select destination country
    fireEvent.change(screen.getAllByLabelText('journeyDetails.selectCountry')[1], {
      target: { value: JSON.stringify({ country: 'China' }) },
    });

    // Type importer company
    fireEvent.change(screen.getByPlaceholderText('journeyDetails.importerPlaceHolder'), {
      target: { value: 'Importer LLC' },
    });

    // Set arrival date after departure date
    fireEvent.change(screen.getByLabelText('journeyDetails.expectedArrivalDate *'), {
      target: { value: '2025-09-26' },
    });

    // Select arrival crossing point
    fireEvent.change(screen.getAllByLabelText('journeyDetails.selectBorderCrossing')[1], {
      target: { value: JSON.stringify({ arrivalPoint: 'Petrapole' }) },
    });

    const continueBtn = screen.getByText('commans.continue') as HTMLButtonElement;
    expect(continueBtn).toBeEnabled();
  });

  test('shows error if arrival date is before departure date', () => {
    setup();

    const departureDateInput = screen.getByLabelText('journeyDetails.plannedDepartureDate *');
    const arrivalDateInput = screen.getByLabelText('journeyDetails.expectedArrivalDate *');

    // Set departure date
    fireEvent.change(departureDateInput, { target: { value: '2025-09-26' } });

    // Set arrival date before departure
    fireEvent.change(arrivalDateInput, { target: { value: '2025-09-25' } });

    expect(screen.getByText('Arrival date cannot be before departure date')).toBeInTheDocument();

    // Continue button should be disabled
    expect(screen.getByText('commans.continue')).toBeDisabled();
  });

  test('clicking Go Back navigates to vehicleDetails', () => {
    setup();
    fireEvent.click(screen.getByText('commans.goBack'));
    expect(mockedNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/vehicleDetails');
  });

  test('clicking Continue with valid form saves to localStorage and navigates to reviewPage', () => {
    setup();

    // Fill all required fields
    fireEvent.change(screen.getByLabelText('journeyDetails.selectCountry'), {
      target: { value: JSON.stringify({ country: 'India' }) },
    });
    fireEvent.change(screen.getByPlaceholderText('journeyDetails.exporterPlaceHolder'), {
      target: { value: 'Exporter Inc.' },
    });
    fireEvent.change(screen.getByLabelText('journeyDetails.plannedDepartureDate *'), {
      target: { value: '2025-09-25' },
    });
    fireEvent.change(screen.getByLabelText('journeyDetails.selectBorderCrossing'), {
      target: { value: JSON.stringify({ departurePoint: 'Attari(Punjab)' }) },
    });
    fireEvent.change(screen.getAllByLabelText('journeyDetails.selectCountry')[1], {
      target: { value: JSON.stringify({ country: 'China' }) },
    });
    fireEvent.change(screen.getByPlaceholderText('journeyDetails.importerPlaceHolder'), {
      target: { value: 'Importer LLC' },
    });
    fireEvent.change(screen.getByLabelText('journeyDetails.expectedArrivalDate *'), {
      target: { value: '2025-09-26' },
    });
    fireEvent.change(screen.getAllByLabelText('journeyDetails.selectBorderCrossing')[1], {
      target: { value: JSON.stringify({ arrivalPoint: 'Petrapole' }) },
    });

    // Click continue
    fireEvent.click(screen.getByText('commans.continue'));

    // Check localStorage
    const stored = JSON.parse(localStorage.getItem('journeyDetails') || '{}');
    expect(stored.originCountry).toBe('India');
    expect(stored.exporterCompany).toBe('Exporter Inc.');
    expect(stored.dateOfDeparture).toBe('2025-09-25');
    expect(stored.borderOfDeparture).toBe('Attari(Punjab)');
    expect(stored.destinationCountry).toBe('China');
    expect(stored.importerCompany).toBe('Importer LLC');
    expect(stored.dateOfArrival).toBe('2025-09-26');
    expect(stored.borderOfArrival).toBe('Petrapole');

    // Check navigation to reviewPage
    expect(mockedNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/reviewPage');
  });

  test('shows error messages when required fields are empty on Continue click', async () => {
    setup();

    // Click continue without filling anything
    fireEvent.click(screen.getByText('commans.continue'));

    expect(await screen.findByText('journeyDetails.exportCompanyErrorMsg')).toBeInTheDocument();
    expect(screen.getByText('journeyDetails.departureDateErrorMsg')).toBeInTheDocument();
    expect(screen.getByText('journeyDetails.importCompanyErrorMsg')).toBeInTheDocument();
  });
});
