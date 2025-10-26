import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DriverRegistrationStepper } from './DriverRegistrationStepper';
import Tooltip from '../../components/Tooltip';
export const SelectCompany = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const loading = false;
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectionPageContinueBtn, setSelectionPageContinueBtn] = useState(false);
    const companies = [
        { id: '1', company_name: 'TransGlobal Company 1', license_status: 'Active and Valid', registration_status: 'Active', registration_type: 'Commercial Transport' },
        { id: '2', company_name: 'TransGlobal Logistics Ltd.', license_status: 'Active and Valid', registration_status: 'Inactive', registration_type: 'Commercial Transport' },
        { id: '3', company_name: 'TransGlobal Company 2', license_status: 'Active and Valid', registration_status: 'Active', registration_type: 'Commercial Transport' },
        { id: '4', company_name: 'TransGlobal Company 3', license_status: 'Active and Valid', registration_status: 'Active', registration_type: 'Commercial Transport' },
        { id: '5', company_name: 'TransGlobal Company 4', license_status: 'Active and Valid', registration_status: 'Inactive', registration_type: 'Commercial Transport' },
        { id: '6', company_name: 'Global Express Transport', license_status: 'Active and Valid', registration_status: 'Active', registration_type: 'Commercial Transport' },
        { id: '7', company_name: 'International Freight Solutions', license_status: 'Active and Valid', registration_status: 'Inactive', registration_type: 'Commercial Transport' },
    ];
    // const { search_company } = 
    //     ...relyingPartyService,
    // };
    // useEffect(() => {
    //     const fetchCompanies = async () => {
    //         if (query.trim().length < 2) {
    //             setCompanies([]);
    //             return;
    //         }
    //         setLoading(true);
    //         try {
    //             const filteredList = await search_company(query);
    //             if (filteredList) {
    //                 setCompanies(filteredList);
    //             }
    //         } catch (error) {
    //             console.log("Getting failed to fetch the companies");
    //             setCompanies([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     const timeout = setTimeout(fetchCompanies, 400);
    //     return () => clearTimeout(timeout);
    // }, [query]);
    const moveToVerifyUinPage = () => {
        setSelectionPageContinueBtn(true);
        navigate('/driverRegistrationProcessPage/verifyUINPage');
    };
    const filteredCompanies = companies.filter(company => company.company_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleCompanySelect = (company) => {
        setSelectedCompany(company);
        setSearchTerm(company.company_name);
        setShowDropdown(false);
        localStorage.setItem('companySelected', JSON.stringify(company));
    };
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value) {
            setSelectedCompany(null);
        }
        setShowDropdown(true);
    };
    const handleSearchBlur = () => {
        setTimeout(() => {
            setShowDropdown(false);
        }, 150);
    };
    return (_jsxs("div", { className: "flex w-[63%] shadow-lg rounded-2xl place-self-center", children: [_jsx(DriverRegistrationStepper, { consentStatus: true, selectCompanyStatus: selectionPageContinueBtn, uinVerificationStatus: false, registrationStatus: false, confirmationStatus: false }), _jsxs("div", { className: `flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`, children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h1", { className: "font-semibold text-[22px]", children: t('selectCompany.selectRegisteredTransportCompany') }), _jsx("p", { className: "text-[15px]", children: t('selectCompany.chooseCompanyDesc') }), _jsxs("div", { className: "relative mb-6", children: [_jsxs("label", { htmlFor: "company-search", className: "flex items-center text-[13px] font-medium text-gray-700 mb-2", children: [t('selectCompany.searchTransportCompany'), _jsx(Tooltip, { helpText: t('selectCompany.searchCompanyTooltip') })] }), _jsx("div", { className: "relative", children: _jsx("input", { id: "company-search", type: "text", value: searchTerm, onChange: handleSearchChange, onBlur: handleSearchBlur, placeholder: t('selectCompany.searchCompanies'), className: "w-full p-2.5 border border-[#D5D7DA] rounded-lg text-sm outline-none focus:shadow-sm focus:shadow-[#D5D7DA] transition-all" }) }), loading && _jsx("p", { className: "text-sm text-gray-500 mt-2", children: t('selectCompany.loading') }), !loading && showDropdown && searchTerm && filteredCompanies.length > 0 && (_jsx("div", { className: "absolute z-10 w-full mt-3 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto", children: filteredCompanies.map((company) => (_jsx("button", { onMouseDown: (e) => e.preventDefault(), onClick: () => handleCompanySelect(company), className: "w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: company.company_name }) }, company.id))) }))] }), selectedCompany && (_jsxs("div", { className: `${selectedCompany.registration_status === 'Active' ? "bg-[#EFFDF5] border-green-200" : "bg-[#ee9595] border-red-200"} border  rounded-lg p-4 mb-4`, children: [_jsx("h4", { className: `text-base font-semibold ${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"} mb-3`, children: t('selectCompany.companyDetails') }), _jsxs("div", { children: [_jsxs("div", { children: [_jsx("span", { className: `${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"} text-[12px] font-semibold`, children: t('selectCompany.selected') }), _jsx("span", { className: `text-[12px] ${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"}`, children: selectedCompany.company_name })] }), _jsxs("div", { children: [_jsx("span", { className: `text-[12px] font-semibold ${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"}`, children: t('selectCompany.licenseStatus') }), _jsx("span", { className: `text-[12px] ${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"}`, children: selectedCompany.registration_status === 'Active' ? t('selectCompany.activeText') : t('selectCompany.inActiveText') })] }), _jsxs("div", { children: [_jsx("span", { className: `text-[12px] font-semibold ${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"}`, children: t('selectCompany.registrationType') }), _jsx("span", { className: `text-[12px] ${selectedCompany.registration_status === 'Active' ? " text-[#007F41]" : "text-[#ea1e14]"}`, children: selectedCompany.registration_type })] })] })] }))] }), _jsx("button", { disabled: !selectedCompany || selectedCompany.registration_status === 'Inactive', onClick: () => moveToVerifyUinPage(), className: `${selectedCompany && selectedCompany.registration_status === 'Active' ? "bg-[#006DE7] cursor-pointer" : "bg-[#B0B0B0] focus:shadow-md cursor-default"}} w-[21%] text-xs font-[600] place-self-end align-bottom py-2.5 text-center rounded-[5px] text-[#FFFFFF]`, children: t('commans.continue') })] })] }));
};
