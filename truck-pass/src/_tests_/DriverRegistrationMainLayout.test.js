import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppMainLayout from '../shared/AppMainLayout';
jest.mock('../components/NavBar', () => () => _jsx("div", { "data-testid": "navbar", children: "NavBar" }));
describe('AppMainLayout Component', () => {
    test('renders NavBar and children with correct classes', () => {
        const testChild = _jsx("div", { "data-testid": "test-child", children: "Test Content" });
        render(_jsx(MemoryRouter, { children: _jsx(AppMainLayout, { children: testChild }) }));
        const mainLayout = screen.getByTestId('test-child').closest('[class*="font-inter"]'); // Target element with font-inter class
        expect(mainLayout).toHaveClass('h-full w-full font-inter');
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
});
