export declare const DropDownSelection: React.FC<DropDownSelectionProps>;
interface DropDownSelectionProps {
    data: any;
    setItemSelected: (value: any) => void;
    placeHolder: string;
    selectingDriverName?: boolean;
    selectingVehicleType?: boolean;
    selectingAxelSize?: boolean;
    selectingOriginCountry?: boolean;
    selectingDestinationCountry?: boolean;
    selectOriginBorder?: boolean;
    selectDestinationBorder?: boolean;
}
export {};
