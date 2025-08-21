import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SelectCompany } from "../pages/driverRegistration/SelectCompany";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18";

const mockGetCompaniesList = jest.fn();
jest.mock("../../services/relyingPartyService", () => ({
  __esModule: true,
  default: {
    get_companiesList: () => mockGetCompaniesList(),
  },
}));

describe("SelectCompany Page", () => {
  beforeEach(() => {
    mockGetCompaniesList.mockResolvedValue([
      { id: "1", companyName: "ABC Transport", registrationType: "Type A", registrationStatus: "Active", name: "ABC", licenseStatus: "Valid" },
      { id: "2", companyName: "XYZ Logistics", registrationType: "Type B", registrationStatus: "Inactive", name: "XYZ", licenseStatus: "Expired" }
    ]);
  });

  it("renders and selects a company", async () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <SelectCompany />
        </I18nextProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("Start typing to search companies");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "ABC" } });

    await waitFor(() => expect(screen.getByText("ABC Transport")).toBeInTheDocument());

    fireEvent.mouseDown(screen.getByText("ABC Transport"));
    fireEvent.click(screen.getByText("ABC Transport"));

    expect(await screen.findByText("Type A")).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    mockGetCompaniesList.mockRejectedValueOnce(new Error("Network error"));
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <SelectCompany />
        </I18nextProvider>
      </BrowserRouter>
    );
    await waitFor(() => expect(mockGetCompaniesList).toHaveBeenCalled());
  });
});
