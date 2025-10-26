import { render, screen } from '@testing-library/react';
import { DriverRegistrationFlow } from '../shared/DriverRegistrationFlow';

describe('DriverRegistrationFlow Component', () => {
  test('renders children correctly', () => {
    const testChild = <div data-testid="test-child">Test Content</div>;
    render(<DriverRegistrationFlow>{testChild}</DriverRegistrationFlow>);

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});