import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SelectCompany } from '../pages/driverRegistration/SelectCompany';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../commans/Stepper';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../commans/Stepper', () => ({
  Stepper: jest.fn(() => <div data-testid="stepper">Stepper Component</div>),
}));

jest.mock('../../assets/help_icon.png', () => 'help_icon.png');

describe('SelectCompany Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('renders select company section correctly', () => {
    render(<SelectCompany />);

    expect(screen.getByText('selectCompany.selectRegisteredTransportCompany')).toBeInTheDocument();
    expect(screen.getByText('selectCompany.chooseCompanyDesc')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Search Transport Company/i })).toBeInTheDocument();
    expect(screen.getByTestId('stepper')).toBeInTheDocument();
    expect(screen.queryByText('Company Details')).not.toBeInTheDocument();
    expect(screen.getByText('commans.continue')).toBeInTheDocument();
    expect(screen.getByText('commans.continue')).toBeDisabled();
  });

  test('filters companies based on search input', async () => {
    render(<SelectCompany />);

    const searchInput = screen.getByRole('textbox', { name: /Search Transport Company/i });
    await act(async () => {
      fireEvent.focus(searchInput);
      fireEvent.change(searchInput, { target: { value: 'TransGlobal' } });
      jest.advanceTimersByTime(0);
    });

    await waitFor(() => {
      expect(screen.getAllByText(/TransGlobal/).length).toBeGreaterThan(0);
      expect(screen.queryByText('Global Express Transport')).not.toBeInTheDocument();
    });
  });

  test('selects a company and displays details', async () => {
    render(<SelectCompany />);

    const searchInput = screen.getByRole('textbox', { name: /Search Transport Company/i });
    await act(async () => {
      fireEvent.focus(searchInput);
      fireEvent.change(searchInput, { target: { value: 'TransGlobal Company 1' } });
      jest.advanceTimersByTime(0);
    });

    const companyOption = screen.getByText('TransGlobal Company 1');
    await act(async () => {
      fireEvent.click(companyOption);
      jest.advanceTimersByTime(150);
    });

    await waitFor(() => {
      expect(screen.getByText('Company Details')).toBeInTheDocument();
      expect(screen.getByText('TransGlobal Company 1')).toBeInTheDocument();
      expect(screen.getByText('Active and Valid')).toBeInTheDocument();
      expect(screen.getByText('Commercial Transport')).toBeInTheDocument();
      expect(searchInput).toHaveValue('TransGlobal Company 1');
    });
  });

  test('enables continue button when company is selected', async () => {
    render(<SelectCompany />);

    const searchInput = screen.getByRole('textbox', { name: /Search Transport Company/i });
    const continueButton = screen.getByText('commans.continue');

    expect(continueButton).toBeDisabled();

    await act(async () => {
      fireEvent.focus(searchInput);
      fireEvent.change(searchInput, { target: { value: 'TransGlobal Company 1' } });
      jest.advanceTimersByTime(0);
      fireEvent.click(screen.getByText('TransGlobal Company 1'));
      jest.advanceTimersByTime(150); 
    });

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });
  });

  test('navigates to verify UIN page on continue button click', async () => {
    render(<SelectCompany />);

    const searchInput = screen.getByRole('textbox', { name: /Search Transport Company/i });
    const continueButton = screen.getByText('commans.continue');

    await act(async () => {
      fireEvent.focus(searchInput);
      fireEvent.change(searchInput, { target: { value: 'TransGlobal Company 1' } });
      jest.advanceTimersByTime(0);
      fireEvent.click(screen.getByText('TransGlobal Company 1'));
      jest.advanceTimersByTime(150); 
    });

    await waitFor(() => {
      expect(continueButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(continueButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/driverRegistrationProcessPage/verifyUINPage');
  });
});

// Test1: Checks if the select company section displays the title, description, search box, stepper, and disabled continue button
// Test2: Tests if searching for a company like 'TransGlobal' filters the list correctly
// Test3: Verifies that selecting a company shows its details like name and status
// Test4: Ensures the continue button becomes enabled after a company is selected
// Test5: Checks if clicking the continue button navigates to the verify UIN page