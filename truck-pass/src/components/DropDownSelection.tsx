import selectionDropDown from "../assets/selection_Dropdown_icon.png"
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const DropDownSelection: React.FC<DropDownSelectionProps> = ({ data, setItemSelected, placeHolder, selectingDriverName, selectingVehicleType, selectingAxelSize, selectingOriginCountry, selectingDestinationCountry, selectOriginBorder, selectDestinationBorder }) => {
    const { t } = useTranslation("");
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [errorMsg, seterrorMsg] = useState("");

    const selectedItem = (item: any) => {
        setSelected(item);
        setItemSelected(item);
        setOpen(false);
        seterrorMsg("");
    };

    return (
        <div className="relative">
            <div
                onClick={() => setOpen(!open)}
                className={`flex items-center justify-between border border-[#D5D7DA] text-sm ${selected ? 'text-[#1a1a1b]' : 'text-[#717680]'} rounded-md px-3 py-2 cursor-pointer bg-[#FFFFFF]`}
            >
                {selected
                    ? (selected.fullName || selected.type || selected.size || selected.country || selected.departurePoint || selected.arrivalPoint)
                    : placeHolder
                }
                <img src={selectionDropDown} className={`h-4 w-4 ${open ? "rotate-180 duration-500" : "duration-500"}`} />
            </div>

            {open && (
                (selectingDriverName) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((driver: any) => (
                            <div
                                key={driver.id}
                                onClick={() => {
                                    selectedItem(driver);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{driver.fullName}</span>
                                <span className="text-base text-gray-500 font-[500]">{t('searchDriver.uin')} {driver.uin} </span>
                                <span className="text-base text-gray-500 font-[500]">{t('searchDriver.licenseNum')}{driver.driverLicenseNumber} </span>
                            </div>
                        ))}
                    </div>
                )
                || (selectingVehicleType) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((vehicle: any) => (
                            <div
                                key={vehicle.id}
                                onClick={() => selectedItem(vehicle)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{vehicle.type}</span>
                            </div>
                        ))
                        }
                    </div>
                )
                || (selectingAxelSize) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((axel: any) => (
                            <div
                                key={axel.id}
                                onClick={() => selectedItem(axel)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{axel.size}</span>
                            </div>
                        ))
                        }
                    </div>
                )
                || (selectingOriginCountry) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((country: any) => (
                            <div
                                key={country.id}
                                onClick={() => selectedItem(country)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{country.country}</span>
                            </div>
                        ))
                        }
                    </div>
                )
                || (selectingDestinationCountry) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((country: any) => (
                            <div
                                key={country.id}
                                onClick={() => selectedItem(country)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{country.country}</span>
                            </div>
                        ))
                        }
                    </div>
                )
                || (selectOriginBorder) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((borderPoint: any) => (
                            <div
                                key={borderPoint.id}
                                onClick={() => selectedItem(borderPoint)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{borderPoint.departurePoint}</span>
                            </div>
                        ))
                        }
                    </div>
                )
                || (selectDestinationBorder) && (
                    <div className="absolute mt-1 w-full bg-white border border-[#D5D7DA] rounded-md shadow-lg z-10 max-h-40 overflow-auto duration-700">
                        {data.map((borderPoint: any) => (
                            <div
                                key={borderPoint.id}
                                onClick={() => selectedItem(borderPoint)}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-row items-center justify-between"
                            >
                                <span className="text-base text-[#181D27] font-[500] w-[280px] break-words">{borderPoint.arrivalPoint}</span>
                            </div>
                        ))
                        }
                    </div>
                )
            )}
            {errorMsg && (
                <p className="text-xs text-[#D92D20] mt-1">{errorMsg}</p>
            )}
        </div>
    )
};

interface DropDownSelectionProps {
    data: any;
    setItemSelected: (value: any) => void;
    placeHolder: string;
    selectingDriverName?: boolean;
    selectingVehicleType?: boolean;
    selectingAxelSize?: boolean;
    selectingOriginCountry?: boolean;
    selectingDestinationCountry?: boolean;
    selectOriginBorder?: boolean;
    selectDestinationBorder?: boolean;
}
