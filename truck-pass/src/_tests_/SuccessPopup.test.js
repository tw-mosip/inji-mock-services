import { jsx as _jsx } from "react/jsx-runtime";
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
        render(_jsx(SuccessPopup, { ...defaultProps }));
        expect(screen.getByText('successPopUp.header')).toBeInTheDocument();
        expect(screen.getByText('successPopUp.desc')).toBeInTheDocument();
    });
    test('renders tick and close icons', () => {
        render(_jsx(SuccessPopup, { ...defaultProps }));
        expect(screen.getByAltText('tick_icon')).toBeInTheDocument();
        const images = screen.getAllByRole('img');
        expect(images[1]).toHaveClass('cursor-pointer');
    });
    test('calls setShowSuccessPopup with false when close icon is clicked', () => {
        render(_jsx(SuccessPopup, { ...defaultProps }));
        const images = screen.getAllByRole('img');
        const closeIcon = images[1];
        fireEvent.click(closeIcon);
        expect(mockSetShowSuccessPopup).toHaveBeenCalledWith(false);
        expect(mockSetShowSuccessPopup).toHaveBeenCalledTimes(1);
    });
    test('applies correct visibility classes based on showSuccessPopup', () => {
        const { rerender } = render(_jsx(SuccessPopup, { ...defaultProps }));
        const popup = screen.getByText('successPopUp.header').parentElement.parentElement.parentElement;
        expect(popup).toHaveClass('-translate-x-0');
        rerender(_jsx(SuccessPopup, { ...defaultProps, showSuccessPopup: false }));
        expect(popup).toHaveClass('-translate-x-full');
    });
});
