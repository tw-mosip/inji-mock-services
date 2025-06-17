import React from 'react';
import tick_icon from '../assets/tick_icon.png';
import close_icon from '../assets/close_icon.png';
import { useTranslation } from 'react-i18next';

export const SuccessPopup: React.FC<SuccessPopupProps> = ({ showSuccessPopup, setShowSuccessPopup }) => {
 
    const { t } = useTranslation();

    return (
        <div className={`absolute bg-[#FFFFFF] w-[30%] p-8 top-24 right-10 z-50 transform transition-all duration-500 ${showSuccessPopup ? '-translate-x-0' : '-translate-x-full'} rounded-lg shadow`}>
            <div className='flex items-center justify-between'>
                <div className='flex gap-x-2'>
                    <img src={tick_icon} alt="tick_icon" className='h-5' />
                    <h2 className='text-[16px]'>{t('successPopUp.header')}</h2>
                </div>
                <img src={close_icon} className='cursor-pointer' onClick={() => setShowSuccessPopup(false)}/>
            </div>
            <p className='text-[12px] px-1.5 pt-2'>{t('successPopUp.desc')}</p>
        </div>
    )
}

interface SuccessPopupProps {
    showSuccessPopup: boolean;
    setShowSuccessPopup: (status: boolean) => void;
}
