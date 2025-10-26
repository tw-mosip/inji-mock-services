import React from 'react';
export declare const TruckpassRequestStepper: React.FC<TruckpassRequestStepperProps>;
interface TruckpassRequestStepperProps {
    searchDriverStatus: boolean;
    driverProfileStatus?: boolean;
    consignmentDetailsStatus: boolean;
    vehicleDetailsStatus: boolean;
    journeyDetailsStatus: boolean;
    reviewAndSubmitStatus: boolean;
}
export {};
