import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { TruckpassRequestStepper } from "./TruckpassRequestStepper";
import magnifierIcon from "../../assets/magnifier_icon.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import relyingPartyService from "../../services/relyingPartyService";
import Tooltip from "../../components/Tooltip";
import { DropDownSelection } from "../../components/DropDownSelection";
export const SearchDriver = () => {
    const { t } = useTranslation("");
    const navigate = useNavigate();
    const [searchDriverStatus, setSearchDriverStatus] = useState(false);
    const [searchByUin, setSearchByUin] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [uin, setUin] = useState("");
    const [uinErrorMsg, setUinErrorMsg] = useState("");
    const [searchByName, setSearchByName] = useState(false);
    const [error, setError] = useState("");
    // const { get_driver_information } = {
    //   ...relyingPartyService,
    // };
    useEffect(() => {
        setUinErrorMsg("");
    }, [uin]);
    const driversList = [
        { id: 1, fullName: "Rajesh Singh", uin: "342342425425", driverLicenseNumber: "DL-9876543210", gender: "Male", phoneNumber: "+91-9823456789", emailId: "rajesh.singh@example.com", city: "Delhi", passportNumber: "P1234567" },
        { id: 2, fullName: "Priya Sharma", uin: "842756932178", driverLicenseNumber: "MH-4567832109", gender: "Female", phoneNumber: "+91-9876543210", emailId: "priya.sharma@example.com", city: "Mumbai", passportNumber: "R8765432" },
        { id: 3, fullName: "Amit Verma", uin: "675483920176", driverLicenseNumber: "UP-1234598760", gender: "Male", phoneNumber: "+91-9811122233", emailId: "amit.verma@example.com", city: "Lucknow", passportNumber: "S6543219" },
        { id: 4, fullName: "Neha Kapoor", uin: "562734891203", driverLicenseNumber: "HR-2345610987", gender: "Female", phoneNumber: "+91-9785612345", emailId: "neha.kapoor@example.com", city: "Gurugram", passportNumber: "T9081723" },
        { id: 5, fullName: "Sandeep Mehta", uin: "903412657890", driverLicenseNumber: "RJ-3456721098", gender: "Male", phoneNumber: "+91-9823123456", emailId: "sandeep.mehta@example.com", city: "Jaipur", passportNumber: "U7654301" },
        { id: 6, fullName: "Kavita Nair", uin: "782345129067", driverLicenseNumber: "KL-9087654321", gender: "Female", phoneNumber: "+91-9945678123", emailId: "kavita.nair@example.com", city: "Kochi", passportNumber: "V8906543" },
        { id: 7, fullName: "Anil Deshmukh", uin: "890712345621", driverLicenseNumber: "MH-5678901234", gender: "Male", phoneNumber: "+91-9756432180", emailId: "anil.deshmukh@example.com", city: "Pune", passportNumber: "W1239087" },
        { id: 8, fullName: "Sunita Reddy", uin: "678934501276", driverLicenseNumber: "TS-7654321098", gender: "Female", phoneNumber: "+91-9845098765", emailId: "sunita.reddy@example.com", city: "Hyderabad", passportNumber: "X9087654" },
        { id: 9, fullName: "Rohit Das", uin: "456789023145", driverLicenseNumber: "WB-2345678901", gender: "Male", phoneNumber: "+91-9830012345", emailId: "rohit.das@example.com", city: "Kolkata", passportNumber: "Y7890345" }
    ];
    const selectSearchByName = () => {
        setSearchByName(true);
        setSearchByUin(false);
    };
    const selectSearchByUin = () => {
        setSearchByName(false);
        setSearchByUin(true);
    };
    const handleUinChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setUin(value);
        e.preventDefault();
    };
    // const fetchDriversByUin = async () => {
    //   try {
    //     setLoading(true);
    //     setError("");
    //     const response = await get_driver_information("driverUin", uin);
    //     if (response.data && response.data.length > 0) {
    //       setSelectedDriver(response.data[0]);
    //     } else {
    //       setError("No driver found with this UIN.");
    //     }
    //   } catch (err) {
    //     setError("Error fetching driver by UIN.");
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // const fetchDriversByName = async () => {
    //   try {
    //     setLoading(true);
    //     setError("");
    //     const response = await get_driver_information("fullname", search)
    //     setDriversList(response.data || []);
    //   } catch (err) {
    //     setError("Error fetching drivers by name.");
    //     console.error(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // useEffect(() => {
    //   if (searchByName && search.length > 2) {
    //     fetchDriversByName();
    //   }
    // }, []);
    const moveToDriverProfile = () => {
        setUinErrorMsg("");
        setError("");
        if (searchByUin) {
            if (uin.length < 12) {
                setUinErrorMsg(t("searchDriver.uinErrorMsg1"));
                return;
            }
            const foundDriver = driversList.find((driver) => driver.uin === uin.trim());
            if (!foundDriver) {
                setUinErrorMsg(t("searchDriver.uinErrorMsg2"));
                return;
            }
            setSelectedDriver(foundDriver);
            localStorage.setItem("selectedDriver", JSON.stringify(foundDriver));
            navigate("/requestTruckpassProcess/driverProfile");
            setSearchDriverStatus(true);
        }
        else if (searchByName) {
            if (!selectedDriver) {
                setError(t("searchDriver.nameErrorMsg"));
                return;
            }
            localStorage.setItem("selectedDriver", JSON.stringify(selectedDriver));
            navigate("/requestTruckpassProcess/driverProfile");
            setSearchDriverStatus(true);
        }
    };
    return (_jsxs("div", { className: "flex flex-col gap-y-10 bg-transparent font-inter", children: [_jsx(TruckpassRequestStepper, { searchDriverStatus: searchDriverStatus, driverProfileStatus: false, consignmentDetailsStatus: false, vehicleDetailsStatus: false, journeyDetailsStatus: false, reviewAndSubmitStatus: false }), _jsxs("div", { className: "bg-[#FFFFFF] h-auto px-8 py-3 rounded-lg shadow-md space-y-16", children: [_jsxs("div", { className: "flex flex-col gap-y-2", children: [_jsxs("div", { className: "flex space-x-5 items-center", children: [_jsx("img", { src: magnifierIcon, className: "h-4.5" }), _jsx("h1", { className: "font-[600] text-[18px]", children: t("searchDriver.header") })] }), _jsx("p", { className: "text-sm", children: t("searchDriver.subHeader") })] }), _jsxs("div", { className: "flex justify-around bg-[#FAFAFA] border border-[#E9EAEB] py-1 rounded-lg", children: [_jsx("div", { onClick: selectSearchByUin, className: `${searchByUin
                                    ? "bg-[#ECF5FF] border border-[#006DE7]"
                                    : "border border-[#E4E7EC]"} text-center py-[8px] w-[49.5%] rounded-sm hover:shadow-md cursor-pointer`, children: _jsx("p", { className: "font-[600] text-[14px] text-[#414651]", children: t("searchDriver.searchByUin") }) }), _jsx("div", { onClick: selectSearchByName, className: `${searchByName
                                    ? "bg-[#ECF5FF] border border-[#006DE7]"
                                    : "border border-[#E4E7EC]"} text-center py-[8px] w-[49.5%] rounded-sm hover:shadow-md cursor-pointer`, children: _jsx("p", { className: "font-[600] text-[14px] text-[#414651]", children: t("searchDriver.searchByName") }) })] }), searchByUin && (_jsxs("div", { className: "space-y-3", children: [_jsxs("label", { className: "flex items-center gap-1", children: [_jsxs("p", { className: "text-sm text-[#414651]", children: [t("searchDriver.enterDriverUin"), _jsx("span", { className: "text-[#006DE7]", children: "*" })] }), _jsx(Tooltip, { helpText: t('searchDriver.searchByUinToolTip') })] }), _jsx("input", { type: "text", inputMode: "numeric", placeholder: t("searchDriver.uinPlaceHolder"), maxLength: 12, value: uin, onChange: handleUinChange, className: `${!uin ? "bg-[#FAFAFA] text-[#717680]" : "bg-[#FFFFFF]"} text-[15px] p-2 w-full border ${uinErrorMsg ? "border-[#FDA29B]" : "border-[#D5D7DA]"} rounded-md outline-none select-text` }), uinErrorMsg && (_jsx("p", { className: "text-xs text-[#D92D20]", children: uinErrorMsg })), error && _jsx("p", { className: "text-xs text-[#D92D20]", children: error })] })), searchByName && (_jsxs("div", { className: "space-y-3 relative", children: [_jsxs("label", { className: "flex items-center gap-1", children: [_jsxs("p", { className: "text-sm text-[#414651]", children: [t("searchDriver.enterDriverName"), _jsx("span", { className: "text-[#006DE7]", children: "*" })] }), _jsx(Tooltip, { helpText: t('searchDriver.searchByNameToolTip') })] }), _jsx(DropDownSelection, { selectingDriverName: true, data: driversList, setItemSelected: setSelectedDriver, placeHolder: t('searchDriver.driverName') })] })), _jsx("div", { className: "flex space-x-6 justify-end my-6", children: _jsx("button", { disabled: (searchByUin && uin.length === 0) ||
                                (searchByName && !selectedDriver), onClick: moveToDriverProfile, className: `bg-[#006DE7] text-white w-[221px] h-[35px] text-sm font-[600] py-2.5 text-center rounded-[5px] cursor-pointer disabled:opacity-50 disabled:cursor-default`, children: t("searchDriver.searchBtn") }) })] })] }));
};
