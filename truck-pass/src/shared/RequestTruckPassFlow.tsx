import React from 'react';

export const RequestTruckPassFlow: React.FC<DriverRegistrationFlowProps> = ({ children }) => {

    return (
        <div className="flex flex-col w-full items-center pt-7 gap-y-10 font-inter">
            {children}
        </div>
    )
}

interface DriverRegistrationFlowProps {
    children: any
}