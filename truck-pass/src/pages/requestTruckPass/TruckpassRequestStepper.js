import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import tickIcon from '../../assets/tick_icon.png';
import { useTranslation } from 'react-i18next';
import stepsConnectingLine from '../../assets/connecting_line.png';
export const TruckpassRequestStepper = ({ searchDriverStatus, driverProfileStatus, consignmentDetailsStatus, vehicleDetailsStatus, journeyDetailsStatus, reviewAndSubmitStatus }) => {
    const { t } = useTranslation();
    const stepperItems = [
        { itemId: 0, number: '1', itemName: t('Search Driver'), inProgress: !searchDriverStatus, completed: searchDriverStatus },
        { itemId: 1, number: '2', itemName: t('Driver Profile'), inProgress: (searchDriverStatus && !driverProfileStatus), completed: driverProfileStatus },
        { itemId: 2, number: '3', itemName: t('Consignment Details'), inProgress: (driverProfileStatus && !consignmentDetailsStatus), completed: consignmentDetailsStatus },
        { itemId: 3, number: '4', itemName: t('Vehicle Details'), inProgress: (consignmentDetailsStatus && !vehicleDetailsStatus), completed: vehicleDetailsStatus },
        { itemId: 4, number: '5', itemName: t('Journey Details'), inProgress: (vehicleDetailsStatus && !journeyDetailsStatus), completed: journeyDetailsStatus },
        { itemId: 5, number: '6', itemName: t('Review & Submit'), inProgress: (journeyDetailsStatus && !reviewAndSubmitStatus), completed: reviewAndSubmitStatus }
    ];
    return (_jsxs("div", { className: 'bg-[#FFFFFF] flex items-center justify-between px-8 h-[120px] w-[1250px]', children: [_jsx("img", { src: stepsConnectingLine, className: "absolute px-[50px] left-8 right-8 top-[210px] w-[1160px] h-[4px] z-0" }), stepperItems.map((item, id) => {
                return (_jsxs("div", { className: 'flex flex-col items-center gap-y-2 z-10', children: [item.completed
                            ? _jsx("img", { src: tickIcon, alt: 'tick-icon', className: 'h-7 w-7' })
                            : (_jsx("p", { className: `${item.inProgress ? 'bg-[#006DE7] text-[#FFFFFF] ' : 'bg-[#FFFFFF] text-[#414651] border border-[#E9EAEB]'} text-center h-[30px] w-[30px] rounded-2xl`, children: item.number })), _jsx("p", { className: `${item.completed ? "text-[#079455]" : (item.inProgress ? "text-[#006DE7]" : "text-[#414651]")}`, children: item.itemName })] }, id));
            })] }));
};
