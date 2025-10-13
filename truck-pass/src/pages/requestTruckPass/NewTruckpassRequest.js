import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { RequestTruckPassFlow } from '../../shared/RequestTruckPassFlow';
export const NewTruckPassRequest = ({ children }) => {
    const { t } = useTranslation('');
    return (_jsxs("div", { className: "flex flex-col font-inter h-auto w-full pt-7 px-20 bg-[#ECF5FF]", children: [_jsxs("div", { className: 'flex flex-col', children: [_jsx("h1", { className: 'font-[600] text-[22px] text-[#27181a]', children: t('newTruckPassRequest.newTruckPassRequest') }), _jsx("p", { className: 'text-[12px] text-[#000000] font-[400]', children: t('newTruckPassRequest.headerDesc') }), _jsx(RequestTruckPassFlow, { children: children })] }), _jsx("footer", { className: 'text-sm text-[#717171] place-self-center bg-transparent pt-10 pb-6 font-inter', children: t('footer.footerText') })] }));
};
