import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NavBar from '../commans/NavBar';
describe('NavBar', () => {
    test('renders logo and navigation links', () => {
        render(_jsx(MemoryRouter, { children: _jsx(NavBar, {}) }));
        const logoImages = screen.getAllByAltText('truckpassTitle');
        expect(logoImages[0]).toBeInTheDocument();
        expect(screen.getByText('navbar.home')).toBeInTheDocument();
        expect(screen.getByText('navbar.help')).toBeInTheDocument();
    });
    test('renders language selector and toggles dropdown', () => {
        render(_jsx(MemoryRouter, { children: _jsx(NavBar, {}) }));
        expect(screen.getByAltText('globe_icon')).toBeInTheDocument();
        const languageDisplay = screen.getByText('English', { selector: 'div:not(button)' });
        expect(languageDisplay).toBeInTheDocument();
        const dropdownIcons = screen.getAllByAltText('truckpassTitle');
        const dropdownIcon = dropdownIcons[1];
        fireEvent.click(dropdownIcon);
        expect(languageDisplay).toBeInTheDocument();
        expect(screen.getByText('French')).toBeInTheDocument();
    });
    test('changes language and closes dropdown on selection', async () => {
        render(_jsx(MemoryRouter, { children: _jsx(NavBar, {}) }));
        const dropdownIcons = screen.getAllByAltText('truckpassTitle');
        const dropdownIcon = dropdownIcons[1];
        fireEvent.click(dropdownIcon);
        const frenchButton = screen.getByText('French');
        fireEvent.click(frenchButton);
        await waitFor(() => {
            expect(screen.getByText('French', { selector: 'div:not(button)' })).toBeInTheDocument();
        }, { timeout: 1000 });
        const englishInDisplay = screen.queryByText('English', { selector: 'div:not(button)' });
        expect(englishInDisplay).toBeNull();
        expect(screen.queryByText('French', { selector: 'button' })).not.toBeInTheDocument();
    });
    test('navigation links have correct href and id attributes', () => {
        render(_jsx(MemoryRouter, { children: _jsx(NavBar, {}) }));
        const homeLink = screen.getByText('navbar.home');
        const helpLink = screen.getByText('navbar.help');
        expect(homeLink).toHaveAttribute('href', '/');
        expect(homeLink).toHaveAttribute('id', 'home');
        expect(helpLink).not.toHaveAttribute('href');
        expect(helpLink).toHaveAttribute('id', 'help');
    });
});
