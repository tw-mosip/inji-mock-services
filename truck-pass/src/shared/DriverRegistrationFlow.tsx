import React from 'react';

export const DriverRegistrationFlow: React.FC<DriverRegistrationFlowProps> = ({ children }) => {
    return (
        <div className="">
            {children}
        </div>
    )
}

interface DriverRegistrationFlowProps {
    children: any;
}
