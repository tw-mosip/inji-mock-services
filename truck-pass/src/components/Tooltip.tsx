import React from "react";
import helpIcon from "../assets/help_icon.png";

const Tooltip: React.FC<TooltipProps> = ({ helpText }) => {
    return (
        <div className="relative inline-block group">
            <div className="absolute left-36 -translate-x-1/2 hidden group-hover:block z-10 bottom-5">
                <div className="relative bg-white border border-[#bdb4b4] px-4 py-2 rounded-md shadow-lg font-bold whitespace-nowrap">
                    <p className="text-[#272323] text-xs">{helpText}</p>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-900"></div>
                    <div className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-7 border-r-7 border-t-7 border-transparent border-t-white"></div>
                </div>
            </div>
            <img src={helpIcon} alt="help_icon" className="h-3 w-3 cursor-pointer" />
        </div>
    );
};

export default Tooltip;

interface TooltipProps {
    helpText: string;
}
