import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import Tooltip from '../components/Tooltip'; // adjust the path accordingly
import userEvent from '@testing-library/user-event';
// Mock the image import
jest.mock('../assets/help_icon.png', () => 'help_icon.png');
describe('Tooltip component', () => {
    const helpText = 'This is a tooltip';
    it('renders the help icon', () => {
        render(_jsx(Tooltip, { helpText: helpText }));
        const icon = screen.getByAltText('help_icon');
        expect(icon).toBeInTheDocument();
    });
    it('hides tooltip by default', () => {
        render(_jsx(Tooltip, { helpText: helpText }));
        const tooltipText = screen.queryByText(helpText);
        expect(tooltipText).not.toBeVisible(); // tooltip is hidden initially
    });
    it('shows tooltip on hover', async () => {
        render(_jsx(Tooltip, { helpText: helpText }));
        const icon = screen.getByAltText('help_icon');
        const user = userEvent.setup();
        await user.hover(icon);
        const tooltipText = screen.getByText(helpText);
        expect(tooltipText).toBeVisible();
    });
    it('hides tooltip on unhover', async () => {
        render(_jsx(Tooltip, { helpText: helpText }));
        const icon = screen.getByAltText('help_icon');
        const user = userEvent.setup();
        await user.hover(icon);
        await user.unhover(icon);
        const tooltipText = screen.getByText(helpText);
        expect(tooltipText).not.toBeVisible(); // still in DOM but hidden
    });
});
