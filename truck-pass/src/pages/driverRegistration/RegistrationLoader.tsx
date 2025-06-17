import React from 'react';
import registering_process from "../../assets/registering_process.gif";

export const RegistrationLoader: React.FC<RegistrationLoaderProps> = ({ setConfirmationBtn }) => {

    setTimeout(() => {
        setConfirmationBtn(true)
    }, 4000)

    return (
        <div className={`flex flex-col bg-[#FFFFFF] pt-16 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-center font-inter`}>
            <div className="flex flex-col items-center">
                <h1 className="font-semibold text-[22px]">Registering</h1>
                <img src={registering_process} alt="registering_process" className='w-[36%]' />
                <p>Please Wait!</p>
            </div>
        </div>

    )
}

interface RegistrationLoaderProps {
    setConfirmationBtn: (status: boolean) => void
}
