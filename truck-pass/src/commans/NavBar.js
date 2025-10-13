import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import truckpass_title from "../assets/truck_pass_title.png";
import globe_icon from "../assets/globe_icon.png";
import dropdown_icon from "../assets/Dropdown_icon.png";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
const NavBar = () => {
    const [dropdown, setDropdown] = useState(false);
    const [language, setLanguage] = useState('English');
    const { t, i18n } = useTranslation();
    const changeLanguage = (lng, language) => {
        i18n.changeLanguage(lng);
        setLanguage(language);
        localStorage.setItem('languageOpt', language);
        localStorage.setItem("appLanguage", lng);
        setDropdown(false);
    };
    useEffect(() => {
        const savedLng = localStorage.getItem("appLanguage");
        const languageOpt = localStorage.getItem('languageOpt');
        if (savedLng && languageOpt) {
            i18n.changeLanguage(savedLng);
            setLanguage(languageOpt);
        }
    }, []);
    return (_jsxs("nav", { className: "flex justify-between items-center h-auto my-5 bg-[#FFFFFF] px-[5%] text-black font-inter", children: [_jsx("img", { src: truckpass_title, alt: "truckpassTitle", className: "h-4 lg:h-[20px]" }), _jsxs("div", { className: "flex space-x-8 items-center text-[15px]", children: [_jsx(Link, { to: '/', id: 'home', className: 'cursor-pointer font-[400] text-sm', children: t('navbar.home') }), _jsx("p", { id: 'help', className: 'cursor-pointer font-[400] text-sm', children: t('navbar.help') }), _jsxs("div", { className: "flex gap-x-1.5 items-center", children: [_jsx("img", { src: globe_icon, alt: "globe_icon", className: "h-4.5" }), language, _jsxs("div", { className: "flex flex-col items-center", children: [_jsx("img", { src: dropdown_icon, alt: "truckpassTitle", className: `h-[6px] ${dropdown && 'rotate-180'} cursor-pointer duration-700`, onClick: () => setDropdown(!dropdown) }), dropdown &&
                                        (_jsxs("div", { className: "flex flex-col absolute w-auo p-3 mt-4.5 right-[69px] bg-[#FFFFFF] space-y-2 rounded-b-md shadow-2xl duration-700", children: [_jsx("button", { className: "cursor-pointer", onClick: () => changeLanguage('en', "English"), children: t('navbar.english') }), _jsx("button", { className: "cursor-pointer", onClick: () => changeLanguage('fr', "French"), children: t('navbar.french') })] }))] })] })] })] }));
};
export default NavBar;
