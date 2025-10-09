import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchDriver } from "../pages/requestTruckPass/SearchDriver";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock i18n
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock icons (avoid errors)
jest.mock("../../assets/magnifier_icon.png", () => "magnifier_icon.png");

// Mock Tooltip component
jest.mock("../../components/Tooltip", () => (props: any) => (
  <span>{props.helpText}</span>
));

// Mock relyingPartyService.get_driver_information
const mockGetDriverInformation = jest.fn();
jest.mock("../../services/relyingPartyService", () => ({
  __esModule: true,
  default: {
    get_driver_information: (...args: any[]) => mockGetDriverInformation(...args),
  },
}));

describe("SearchDriver component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const setup = () =>
    render(
      <MemoryRouter>
        <SearchDriver />
      </MemoryRouter>
    );

  it("renders UI elements and tabs correctly", () => {
    setup();

    // Header texts
    expect(screen.getByText("searchDriver.header")).toBeInTheDocument();
    expect(screen.getByText("searchDriver.subHeader")).toBeInTheDocument();

    // Tabs
    expect(screen.getByText("searchDriver.searchByUin")).toBeInTheDocument();
    expect(screen.getByText("searchDriver.searchByName")).toBeInTheDocument();

    // Input for UIN initially visible
    expect(screen.getByPlaceholderText("searchDriver.uinPlaceHolder")).toBeInTheDocument();

    // Search button disabled initially (UIN empty)
    expect(screen.getByText("searchDriver.searchBtn")).toBeDisabled();
  });

  it("switches tabs correctly and updates UI", () => {
    setup();

    // Click on 'Search By Name' tab
    fireEvent.click(screen.getByText("searchDriver.searchByName"));

    // UIN input should disappear, name input should appear
    expect(screen.queryByPlaceholderText("searchDriver.uinPlaceHolder")).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText("searchDriver.driverName")).toBeInTheDocument();

    // Search button is disabled because no driver selected yet
    expect(screen.getByText("searchDriver.searchBtn")).toBeDisabled();

    // Click back to 'Search By UIN'
    fireEvent.click(screen.getByText("searchDriver.searchByUin"));
    expect(screen.getByPlaceholderText("searchDriver.uinPlaceHolder")).toBeInTheDocument();
  });

  it("validates UIN input to allow only digits and max length 12", async () => {
    setup();

    const uinInput = screen.getByPlaceholderText("searchDriver.uinPlaceHolder");

    // Type letters - should be filtered out
    await userEvent.type(uinInput, "abc123def456");

    expect(uinInput).toHaveValue("123456"); // only digits remain

    // Type more than 12 digits (maxLength is 12)
    await userEvent.clear(uinInput);
    await userEvent.type(uinInput, "1234567890123456");

    // Value should be truncated to 12 digits by input maxLength attribute
    expect(uinInput).toHaveValue("123456789012");
  });

  it("shows error message if UIN length is less than 12 when searching", async () => {
    setup();

    const uinInput = screen.getByPlaceholderText("searchDriver.uinPlaceHolder");
    await userEvent.type(uinInput, "12345");

    const searchBtn = screen.getByText("searchDriver.searchBtn");

    fireEvent.click(searchBtn);

    expect(await screen.findByText("searchDriver.uinErrorMsg1")).toBeInTheDocument();

    // Clear input and test empty input error
    await userEvent.clear(uinInput);
    fireEvent.click(searchBtn);
    expect(await screen.findByText("searchDriver.uinErrorMsg2")).toBeInTheDocument();
  });

  it("calls API and navigates on successful UIN search", async () => {
    setup();

    // Mock API response for driver info
    const mockDriver = {
      id: 1,
      fullName: "John Doe",
      emailId: "john@example.com",
      city: "City",
      passportNumber: "P123456",
      driverLicenseNumber: "DL12345",
      uin: "123456789012",
    };

    mockGetDriverInformation.mockResolvedValueOnce({ data: [mockDriver] });

    const uinInput = screen.getByPlaceholderText("searchDriver.uinPlaceHolder");
    await userEvent.type(uinInput, mockDriver.uin);

    const searchBtn = screen.getByText("searchDriver.searchBtn");
    fireEvent.click(searchBtn);

    // Wait for API call and navigation
    await waitFor(() => {
      expect(mockGetDriverInformation).toHaveBeenCalledWith("driverUin", mockDriver.uin);
    });

    // selectedDriver should be saved in localStorage
    const savedDriver = JSON.parse(localStorage.getItem("selectedDriver")!);
    expect(savedDriver.fullName).toBe(mockDriver.fullName);

    expect(mockNavigate).toHaveBeenCalledWith("/requestTruckpassProcess/driverProfile");
  });

  it("shows error if no driver found by UIN", async () => {
    setup();

    mockGetDriverInformation.mockResolvedValueOnce({ data: [] });

    const uinInput = screen.getByPlaceholderText("searchDriver.uinPlaceHolder");
    await userEvent.type(uinInput, "123456789012");

    fireEvent.click(screen.getByText("searchDriver.searchBtn"));

    expect(await screen.findByText("No driver found with this UIN.")).toBeInTheDocument();
  });

  it("fetches and displays drivers list when searching by name", async () => {
    setup();

    fireEvent.click(screen.getByText("searchDriver.searchByName"));

    const mockDrivers = [
      { id: 1, fullName: "Alice Smith", emailId: "", city: "", passportNumber: "", driverLicenseNumber: "DL1", uin: "111111111111" },
      { id: 2, fullName: "Bob Johnson", emailId: "", city: "", passportNumber: "", driverLicenseNumber: "DL2", uin: "222222222222" },
    ];

    mockGetDriverInformation.mockResolvedValueOnce({ data: mockDrivers });

    const nameInput = screen.getByPlaceholderText("searchDriver.driverName");

    // Type 3 characters to trigger fetchDriversByName
    await userEvent.type(nameInput, "Ali");

    // Wait for API call
    await waitFor(() => {
      expect(mockGetDriverInformation).toHaveBeenCalledWith("fullname", "Ali");
    });

    // List items should be visible
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();

    // Click a driver
    fireEvent.click(screen.getByText("Alice Smith"));

    // Now the search button should be enabled because a driver is selected
    expect(screen.getByText("searchDriver.searchBtn")).toBeEnabled();

    // Click search button navigates and saves localStorage
    fireEvent.click(screen.getByText("searchDriver.searchBtn"));

    await waitFor(() => {
      const savedDriver = JSON.parse(localStorage.getItem("selectedDriver")!);
      expect(savedDriver.fullName).toBe("Alice Smith");
      expect(mockNavigate).toHaveBeenCalledWith("/requestTruckpassProcess/driverProfile");
    });
  });

  it("shows error if API call by name fails", async () => {
    setup();

    fireEvent.click(screen.getByText("searchDriver.searchByName"));

    mockGetDriverInformation.mockRejectedValueOnce(new Error("API error"));

    const nameInput = screen.getByPlaceholderText("searchDriver.driverName");

    await userEvent.type(nameInput, "Alice");

    await waitFor(() => {
      expect(mockGetDriverInformation).toHaveBeenCalledWith("fullname", "Alice");
    });

    // Error message should appear
    expect(await screen.findByText("Error fetching drivers by name.")).toBeInTheDocument();
  });

  it("disables search button when inputs are invalid", async () => {
    setup();

    // Initially UIN input empty, button disabled
    expect(screen.getByText("searchDriver.searchBtn")).toBeDisabled();

    // Type valid 12-digit UIN, button enabled
    const uinInput = screen.getByPlaceholderText("searchDriver.uinPlaceHolder");
    await userEvent.type(uinInput, "123456789012");
    expect(screen.getByText("searchDriver.searchBtn")).toBeEnabled();

    // Switch to search by name, no driver selected => button disabled
    fireEvent.click(screen.getByText("searchDriver.searchByName"));
    expect(screen.getByText("searchDriver.searchBtn")).toBeDisabled();
  });
});
