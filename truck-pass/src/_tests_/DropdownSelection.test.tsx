import { render, screen, fireEvent } from '@testing-library/react';
import { DropDownSelection } from '../components/DropDownSelection';
import '@testing-library/jest-dom';

// Mock image import (since it's not relevant for tests)
jest.mock('../assets/selection_Dropdown_icon.png', () => 'dropdown-icon.png');

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DropDownSelection Component', () => {
  const mockSetItemSelected = jest.fn();

  const baseProps = {
    setItemSelected: mockSetItemSelected,
    placeHolder: 'Select an option',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders placeholder text', () => {
    render(
      <DropDownSelection
        {...baseProps}
        data={[]}
        selectingVehicleType
      />
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('opens dropdown on click and shows vehicle types', () => {
    const data = [
      { id: 1, type: 'Truck' },
      { id: 2, type: 'Van' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectingVehicleType
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('Truck')).toBeInTheDocument();
    expect(screen.getByText('Van')).toBeInTheDocument();
  });

  test('calls setItemSelected when an option is clicked', () => {
    const data = [
      { id: 1, type: 'Truck' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectingVehicleType
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    fireEvent.click(screen.getByText('Truck'));

    expect(mockSetItemSelected).toHaveBeenCalledWith({ id: 1, type: 'Truck' });
  });

  test('renders axel sizes when selectingAxelSize is true', () => {
    const data = [
      { id: 1, size: '2-Axle' },
      { id: 2, size: '3-Axle' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectingAxelSize
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('2-Axle')).toBeInTheDocument();
    expect(screen.getByText('3-Axle')).toBeInTheDocument();
  });

  test('renders origin countries when selectingOriginCountry is true', () => {
    const data = [
      { id: 1, country: 'USA' },
      { id: 2, country: 'Canada' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectingOriginCountry
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  test('renders destination countries when selectingDestinationCountry is true', () => {
    const data = [
      { id: 1, country: 'Mexico' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectingDestinationCountry
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('Mexico')).toBeInTheDocument();
  });

  test('renders origin borders when selectOriginBorder is true', () => {
    const data = [
      { id: 1, departurePoint: 'Border A' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectOriginBorder
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('Border A')).toBeInTheDocument();
  });

  test('renders destination borders when selectDestinationBorder is true', () => {
    const data = [
      { id: 1, arrivalPoint: 'Border B' },
    ];

    render(
      <DropDownSelection
        {...baseProps}
        data={data}
        selectDestinationBorder
      />
    );

    fireEvent.click(screen.getByText('Select an option'));
    expect(screen.getByText('Border B')).toBeInTheDocument();
  });
});
