import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DriverRegistrationMainLayout from '../shared/DriverRegistrationMainLayout';

jest.mock('../components/NavBar', () => () => <div data-testid="navbar">NavBar</div>);

describe('DriverRegistrationMainLayout Component', () => {
  test('renders NavBar and children with correct classes', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;
    render(
      <MemoryRouter>
        <DriverRegistrationMainLayout>{testChild}</DriverRegistrationMainLayout>
      </MemoryRouter>
    );

    const mainLayout = screen.getByTestId('test-child').closest('[class*="font-inter"]'); // Target element with font-inter class
    expect(mainLayout).toHaveClass('h-full w-full font-inter');
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});