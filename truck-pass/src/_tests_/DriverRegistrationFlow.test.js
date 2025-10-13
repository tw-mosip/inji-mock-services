import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { DriverRegistrationFlow } from '../shared/DriverRegistrationFlow';
describe('DriverRegistrationFlow Component', () => {
    test('renders children correctly', () => {
        const testChild = _jsx("div", { "data-testid": "test-child", children: "Test Content" });
        render(_jsx(DriverRegistrationFlow, { children: testChild }));
        expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
});
