import { useTranslation } from 'react-i18next';
import { RequestTruckPassFlow } from '../../shared/RequestTruckPassFlow';

export const NewTruckPassRequest: React.FC<NewTruckPassRequestProps> = ({ children }) => {

    const { t } = useTranslation('');

    return (
        <div className="flex flex-col font-inter h-auto w-full pt-7 px-20 bg-[#ECF5FF]">
            <div className='flex flex-col'>
                <h1 className='font-[600] text-[22px] text-[#27181a]'>{t('newTruckPassRequest.newTruckPassRequest')}</h1>
                <p className='text-[12px] text-[#000000] font-[400]'>{t('newTruckPassRequest.headerDesc')}</p>

                <RequestTruckPassFlow children={children} />
            </div>

            {/* Footer */}
            <footer className='text-sm text-[#717171] place-self-center bg-transparent pt-10 pb-6 font-inter'>
                {t('footer.footerText')}
            </footer>
            {/* Footer */}

        </div>
    )
};

interface NewTruckPassRequestProps {
    children: any;
}
