import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import helpIcon from "../assets/help_icon.png";
const Tooltip = ({ helpText }) => {
    return (_jsxs("div", { className: "relative inline-block group font-inter", children: [_jsx("div", { className: "absolute left-32 -translate-x-1/2 bottom-6 hidden group-hover:block z-10 w-max max-w-[250px] sm:max-w-[250px] md:max-w-[300px]", children: _jsxs("div", { className: "relative bg-white border border-gray-300 px-3 py-2 rounded-md shadow-lg font-semibold break-words", children: [_jsx("p", { className: "font-[500] text-gray-800 text-xs leading-tight", children: helpText }), _jsx("div", { className: "absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300" }), _jsx("div", { className: "absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-7 border-r-7 border-t-7 border-transparent border-t-white" })] }) }), _jsx("img", { src: helpIcon, alt: "help_icon", className: "h-3.5 w-3.5 cursor-pointer" })] }));
};
export default Tooltip;
