import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor } from "@testing-library/react";
import { VerifyUIN } from "../pages/driverRegistration/VerifyUIN";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18";
const mockFetchUserInfo = jest.fn();
jest.mock("../../services/relyingPartyService", () => ({
    __esModule: true,
    default: {
        post_fetchUserInfo: (...args) => mockFetchUserInfo(...args),
    },
}));
describe("VerifyUIN Page", () => {
    beforeEach(() => {
        localStorage.setItem("appLanguage", "en");
        mockFetchUserInfo.mockResolvedValue({ name: "John Doe" });
        window._env_ = { SIGN_IN_BUTTON_PLUGIN_URL: "" };
    });
    it("renders without crashing", async () => {
        render(_jsx(BrowserRouter, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(VerifyUIN, {}) }) }));
        expect(await screen.findByText(/UIN Verification/i)).toBeInTheDocument();
    });
    it("handles API failure", async () => {
        mockFetchUserInfo.mockRejectedValueOnce(new Error("Failed to fetch user info"));
        render(_jsx(BrowserRouter, { children: _jsx(I18nextProvider, { i18n: i18n, children: _jsx(VerifyUIN, {}) }) }));
        await waitFor(() => expect(mockFetchUserInfo).toHaveBeenCalled());
    });
});
