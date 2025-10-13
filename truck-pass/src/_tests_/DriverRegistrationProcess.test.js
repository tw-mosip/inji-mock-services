import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DriverRegistrationProcess from '../pages/driverRegistration/DriverRegistrationProcess';
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // Mock translation keys to return themselves
    }),
}));
jest.mock('../shared/DriverRegistrationFlow', () => ({
    DriverRegistrationFlow: ({ children }) => (_jsx("div", { "data-testid": "driver-registration-flow", className: "bg-[url('../assets/landingPage_bg.png')] w-full", children: children })),
}));
describe('DriverRegistrationProcess Component', () => {
    test('renders layout with title, description, flow, and footer', () => {
        const testChild = _jsx("div", { "data-testid": "test-child", children: "Test Content" });
        render(_jsx(MemoryRouter, { children: _jsx(DriverRegistrationProcess, { children: testChild }) }));
        expect(screen.getByText(/driverRegistrationProcess\.processMainTitle/i)).toBeInTheDocument();
        expect(screen.getByText(/driverRegistrationProcess\.respDescription/i)).toBeInTheDocument();
        expect(screen.getByTestId('driver-registration-flow')).toBeInTheDocument();
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
        expect(screen.getByText(/footer\.footerText/i)).toBeInTheDocument();
        expect(screen.getByTestId('driver-registration-flow')).toHaveClass('bg-[url(\'../assets/landingPage_bg.png\')] w-full');
    });
});
