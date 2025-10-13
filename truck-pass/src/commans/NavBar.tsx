import { Link } from "react-router-dom";
import truckpass_title from "../assets/truck_pass_title.png";
import globe_icon from "../assets/globe_icon.png";
import dropdown_icon from "../assets/dropdown_icon.png";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const NavBar = () => {

  const [dropdown, setDropdown] = useState(false);
  const [language, setLanguage] = useState('English');

  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string, language: string) => {
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


  return (
    <nav className="flex justify-between items-center h-auto my-5 bg-[#FFFFFF] px-[5%] text-black font-inter">
      <img src={truckpass_title} alt="truckpassTitle" className="h-4 lg:h-[20px]" />
      <div className="flex space-x-8 items-center text-[15px]">
        <Link to={'/'} id='home' className='cursor-pointer font-[400] text-sm'>{t('navbar.home')}</Link>
        <p id='help' className='cursor-pointer font-[400] text-sm'>{t('navbar.help')}</p>
        <div className="flex gap-x-1.5 items-center">
          <img src={globe_icon} alt="globe_icon" className="h-4.5" />
          {language}
          <div className="flex flex-col items-center">
            <img src={dropdown_icon} alt="truckpassTitle" className={`h-[6px] ${dropdown && 'rotate-180'} cursor-pointer duration-700`} onClick={() => setDropdown(!dropdown)} />
            {dropdown &&
              (
                <div className="flex flex-col absolute w-auo p-3 mt-4.5 right-[69px] bg-[#FFFFFF] space-y-2 rounded-b-md shadow-2xl duration-700">
                  <button className="cursor-pointer" onClick={() => changeLanguage('en', "English")}>{t('navbar.english')}</button>
                  <button className="cursor-pointer" onClick={() => changeLanguage('fr', "French")}>{t('navbar.french')}</button>
                </div>
              )}
          </div>
        </div>

      </div>
    </nav>
  )
}

export default NavBar;