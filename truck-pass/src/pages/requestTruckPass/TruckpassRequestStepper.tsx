import React from 'react';
import tickIcon from '../../assets/tick_icon.png';
import { useTranslation } from 'react-i18next';


export const TruckpassRequestStepper: React.FC<TruckpassRequestStepperProps> = ({ searchDriverStatus, driverProfileStatus, consignmentDetailsStatus, vehicleDetailsStatus, journeyDetailsStatus, reviewAndSubmitStatus }) => {

  const { t } = useTranslation();

  const stepperItems = [
    { itemId: 0, number: '1', itemName: t('Search Driver'), inProgress: !searchDriverStatus, completed: searchDriverStatus },
    { itemId: 1, number: '2', itemName: t('Driver Profile'), inProgress: (searchDriverStatus && !driverProfileStatus), completed: driverProfileStatus },
    { itemId: 2, number: '3', itemName: t('Consignment Details'), inProgress: (driverProfileStatus && !consignmentDetailsStatus), completed: consignmentDetailsStatus },
    { itemId: 3, number: '4', itemName: t('Vehicle Details'), inProgress: (consignmentDetailsStatus && !vehicleDetailsStatus), completed: vehicleDetailsStatus },
    { itemId: 4, number: '5', itemName: t('Journey Details'), inProgress: (vehicleDetailsStatus && !journeyDetailsStatus), completed: journeyDetailsStatus },
    { itemId: 5, number: '6', itemName: t('Review & Submit'), inProgress: (journeyDetailsStatus && !reviewAndSubmitStatus), completed: reviewAndSubmitStatus }
  ];

  return (
    <div className='bg-[#FFFFFF] flex items-center justify-between px-8 h-[120px] w-[1250px]'>
      {stepperItems.map((item, id) => {
        return (
          <div key={id} className='flex items-center'>
            <div key={id} className='flex flex-col gap-y-2'>
              <div className='flex items-center'>
                {item.completed
                  ? <img src={tickIcon} alt='tick-icon' className='h-7 w-7' />
                  : (<p className={`${item.inProgress ? 'bg-[#006DE7] text-[#FFFFFF] ' : 'bg-[#FFFFFF] text-[#414651] border border-[#E9EAEB]'} text-center h-[30px] w-[30px] rounded-2xl`}>
                    {item.number}
                  </p>)
                }
                {/* <img src={stepsConnectingLine} alt='steps-connecting-line' className={`w-[180px] ${item.itemId === 5 && "hidden"}`} /> */}
              </div>
              <p className={`${item.completed ? "text-[#079455]" : (item.inProgress ? "text-[#006DE7]" : "text-[#414651]")}`}>{item.itemName}</p>

            </div>
          </div>
        )
      })
      }
    </div>
  )
}


interface TruckpassRequestStepperProps {
  searchDriverStatus: boolean;
  driverProfileStatus?: boolean;
  consignmentDetailsStatus: boolean;
  vehicleDetailsStatus: boolean;
  journeyDetailsStatus: boolean;
  reviewAndSubmitStatus: boolean;
}
