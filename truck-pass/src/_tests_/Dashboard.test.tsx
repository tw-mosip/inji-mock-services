import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from '../pages/requestTruckPass/Dashboard';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

// Mock react-i18next useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'dashBoard.activeRequest': 'Active Request',
        'dashBoard.approvedPasses': 'Approved Passes',
        'dashBoard.pendingReview': 'Pending Review',
        'dashBoard.totalTrucks': 'Total Trucks',
        'dashBoard.requestId': 'Request ID',
        'dashBoard.driverName': 'Driver Name',
        'dashBoard.licenceNumber': 'Licence Number',
        'dashBoard.status': 'Status',
        'dashBoard.date': 'Date',
        'dashBoard.myDashBoard': 'My Dashboard',
        'dashBoard.newTruckPassRequest': 'New Truck Pass Request',
        'dashBoard.requestTruckPass': 'Request Truck Pass',
        'footer.footerText': '© 2025 Truck Pass System',
      };
      return translations[key] || key;
    },
  }),
}));

describe('Dashboard Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('renders all metric items correctly', () => {
    render(<Dashboard />);

    // Check metric names and counts
    expect(screen.getByText('Active Request')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('Approved Passes')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();

    expect(screen.getByText('Pending Review')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByText('Total Trucks')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  test('renders table headers correctly', () => {
    render(<Dashboard />);

    expect(screen.getByText('Request ID')).toBeInTheDocument();
    expect(screen.getByText('Driver Name')).toBeInTheDocument();
    expect(screen.getByText('Licence Number')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  test('renders table rows with correct data and status badges', () => {
    render(<Dashboard />);

    // Check a row's data
    expect(screen.getByText('TP-2024-001')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getAllByText('Approved')[0]).toBeInTheDocument();
    expect(screen.getByText('20-08-2025')).toBeInTheDocument();

    // Check a 'Pending' status badge exists
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);

    // Check a long driver name is rendered
    expect(screen.getByText('Raja Vijaya Venkatesh pratap rana Singh')).toBeInTheDocument();
  });

  test('clicking New Truck Pass Request button navigates correctly', () => {
    render(<Dashboard />);

    const button = screen.getByRole('button', { name: /New Truck Pass Request/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/requestTruckpassProcess/searchDriver');
  });

  test('footer text renders correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('© 2025 Truck Pass System')).toBeInTheDocument();
  });

  test('statusBg returns correct classes and labels', () => {
    // We can test the exported statusBg function if we export it,
    // but since it's internal, you can test via rendered class names.
    render(<Dashboard />);
    
    // Example: check that approved badge has the right class name snippet
    const approvedBadge = screen.getAllByText('Approved')[0];
    expect(approvedBadge.parentElement).toHaveClass('text-[#067647]');
  });
});
