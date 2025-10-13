import { render, screen, fireEvent } from '@testing-library/react';
import { SuccessPopup } from '../components/SuccessPopup';
import './mocks/i18n';

describe('SuccessPopup', () => {
  const mockSetShowSuccessPopup = jest.fn();
  const defaultProps = {
    showSuccessPopup: true,
    setShowSuccessPopup: mockSetShowSuccessPopup,
  };

  test('renders header and description when visible', () => {
    render(<SuccessPopup {...defaultProps} />);
    expect(screen.getByText('successPopUp.header')).toBeInTheDocument();
    expect(screen.getByText('successPopUp.desc')).toBeInTheDocument();
  });

  test('renders tick and close icons', () => {
    render(<SuccessPopup {...defaultProps} />);
    expect(screen.getByAltText('tick_icon')).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images[1]).toHaveClass('cursor-pointer'); 
  });

  test('calls setShowSuccessPopup with false when close icon is clicked', () => {
    render(<SuccessPopup {...defaultProps} />);
    const images = screen.getAllByRole('img');
    const closeIcon = images[1]; 
    fireEvent.click(closeIcon);
    expect(mockSetShowSuccessPopup).toHaveBeenCalledWith(false);
    expect(mockSetShowSuccessPopup).toHaveBeenCalledTimes(1);
  });

  test('applies correct visibility classes based on showSuccessPopup', () => {
    const { rerender } = render(<SuccessPopup {...defaultProps} />);
    const popup = screen.getByText('successPopUp.header').parentElement!.parentElement!.parentElement!;
    expect(popup).toHaveClass('-translate-x-0');

    rerender(<SuccessPopup {...defaultProps} showSuccessPopup={false} />);
    expect(popup).toHaveClass('-translate-x-full');
  });
});

// Test1: Checks if the popup shows the header and description when it’s visible
// Test2: Verifies that the tick icon and clickable close icon are displayed
// Test3: Ensures clicking the close icon triggers the function to hide the popup
// Test4: Confirms the popup slides in or out based on the showSuccessPopup setting