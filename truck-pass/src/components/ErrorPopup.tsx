import React from 'react';
import cross_circle_icon from '../assets/cross_circle_icon.png';
import close_icon from '../assets/close_icon.png';
import { useTranslation } from 'react-i18next';

export const ErrorPopup: React.FC<ErrorPopupProps> = ({ showErrorPopup, setShowErrorPopup }) => {
 
    const { t } = useTranslation();

    return (
        <div className={`absolute bg-[#FFFFFF] w-[30%] p-8 top-24 right-10 z-50 transform transition-all duration-500 ${showErrorPopup ? '-translate-x-0' : '-translate-x-full'} rounded-lg shadow`}>
            <div className='flex items-center justify-between'>
                <div className='flex gap-x-2'>
                    <img src={cross_circle_icon} alt="cross_icon" className='h-5' />
                    <h2 className='text-[16px]'>{t('errorPopUp.header')}</h2>
                </div>
                <img src={close_icon} className='cursor-pointer' onClick={() => setShowErrorPopup(false)}/>
            </div>
            <p className='text-[12px] px-1.5 pt-2'>{t('errorPopUp.desc')}</p>
        </div>
    )
}

interface ErrorPopupProps {
    showErrorPopup?: boolean;
    setShowErrorPopup: (status: boolean) => void;
}
