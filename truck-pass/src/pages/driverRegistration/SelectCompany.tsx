import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import help_icon from "../../assets/help_icon.png";
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../commans/Stepper';


export const SelectCompany: React.FC<SelectCompanyProps> = ({ }) => {

    const navigate = useNavigate();

    const companies: Company[] = [
        { id: '1', name: 'TransGlobal Company 1', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
        { id: '2', name: 'TransGlobal Logistics Ltd.', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
        { id: '3', name: 'TransGlobal Company 2', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
        { id: '4', name: 'TransGlobal Company 3', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
        { id: '5', name: 'TransGlobal Company 4', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
        { id: '6', name: 'Global Express Transport', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
        { id: '7', name: 'International Freight Solutions', licenseStatus: 'Active and Valid', registrationType: 'Commercial Transport' },
    ];

    const registrationSteps = [
        { step: 1, title: 'Consent & Agreement', status: 'completed' },
        { step: 2, title: 'Select Company', status: 'current' },
        { step: 3, title: 'UNI Verification', status: 'pending' },
        { step: 4, title: 'Additional Information', status: 'pending' },
        { step: 5, title: 'Submit Application', status: 'pending' },
        { step: 6, title: 'Confirmation', status: 'pending' },
    ];
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [selectionPageContinueBtn, setSelectionPageContinueBtn] = useState(false);

    const moveToVerifyUinPage = () => {
        setSelectionPageContinueBtn(true);
        navigate('/driverRegistrationProcessPage/verifyUINPage');
    }

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCompanySelect = (company: Company) => {
        setSelectedCompany(company);
        setSearchTerm(company.name);
        setShowDropdown(false);
        setIsSearchFocused(false);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
        setShowDropdown(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setIsSearchFocused(false);
        }, 150);
    };

    return (
        <div className="flex w-[63%] shadow-lg rounded-2xl place-self-center">
            <Stepper
                consentStatus={true}
                selectCompanyStatus={selectionPageContinueBtn}
                uinVerificationStatus={false}
                registrationStatus={false}
                confirmationStatus={false}
            />

            <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>

                <div className="space-y-4">
                    <h1 className="font-semibold text-[22px]">{t('selectCompany.selectRegisteredTransportCompany')}</h1>
                    <p className="text-[15px]">{t('selectCompany.chooseCompanyDesc')}</p>

                    <div className="relative mb-6">
                        <label htmlFor="company-search" className="flex items-center text-[13px] font-medium text-gray-700 mb-2">
                            Search Transport Company
                            <span className="text-[#006DE7] pl-1">*</span>
                            <img src={help_icon} className="h-3 cursor-pointer px-1" />
                        </label>

                        <div className="relative">
                            <input
                                id="company-search"
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                                placeholder="Start typing to search companies"
                                className="w-full p-2.5 border border-[#D5D7DA] rounded-lg text-sm outline-none focus:shadow-sm focus:shadow-[#D5D7DA] transition-all"
                            />
                        </div>

                        {/* Dropdown */}
                        {showDropdown && (searchTerm || isSearchFocused) && filteredCompanies.length > 0 && (
                            <div className="absolute z-10 w-full mt-3 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredCompanies.map((company) => (
                                    <button
                                        key={company.id}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => handleCompanySelect(company)}
                                        className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-50"
                                    >
                                        <div className="text-sm font-medium text-gray-900">
                                            {company.name}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Company Details */}
                    {selectedCompany && (
                        <div className="bg-[#EFFDF5] border border-green-200 rounded-lg p-4 mb-4">
                            <h4 className="text-base font-semibold text-[#007F41] mb-3">Company Details</h4>
                            <div>
                                <div>
                                    <span className="text-[12px] font-semibold text-[#007F41]">Selected: </span>
                                    <span className="text-[12px] text-[#007F41]">{selectedCompany.name}</span>
                                </div>
                                <div>
                                    <span className="text-[12px] font-semibold text-[#007F41]">License Status: </span>
                                    <span className="text-[12px] text-[#007F41]">{selectedCompany.licenseStatus}</span>
                                </div>
                                <div>
                                    <span className="text-[12px] font-semibold text-[#007F41]">Registration Type: </span>
                                    <span className="text-[12px] text-[#007F41]">{selectedCompany.registrationType}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <button disabled={!selectedCompany} onClick={() => moveToVerifyUinPage()}
                    className={`${selectedCompany ? "bg-[#006DE7] cursor-pointer" : "bg-[#B0B0B0] "} w-[21%] text-xs font-[600] place-self-end align-bottom py-2.5 text-center rounded-[5px] text-[#FFFFFF]`}>
                    {t('commans.continue')}
                </button>
            </div>
        </div>
    )
}

interface Company {
    id: string;
    name: string;
    licenseStatus: string;
    registrationType: string;
}

interface SelectCompanyProps {

}
