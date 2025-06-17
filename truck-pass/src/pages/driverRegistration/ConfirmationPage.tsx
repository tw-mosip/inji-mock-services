import React from 'react';
import { useNavigate } from 'react-router-dom';
import confirmation_icon from '../../assets/confirmation_icon.png';
import user_photo from "../../assets/user_photo.png";


export const ConfirmationPage: React.FC = () => {

    const navigate = useNavigate();

    const onStartNewRegistration = () => {
        navigate('/LandingPage')
    }

    return (

        <div className={`flex flex-col bg-[#FFFFFF] pt-5 pb-9 w-full px-6 rounded-br-2xl rounded-tr-2xl justify-between font-inter`}>
            <div className="flex flex-col items-center space-y-4">
                <img src={confirmation_icon} alt="confirmation_icon" className='h-14' />
                <h1 className="font-semibold text-[20px]">Registration Completed!</h1>
                <p className="text-[13px] font-thin">Your application has been successfully submitted.</p>

                <div className="w-[90%] border border-[#E2E8F0] rounded-lg p-6">
                    <div className='flex gap-x-3 items-center'>
                        <img src={user_photo} alt="user_photo" className='h-20 pt-2' />
                        <div className='flex flex-col space-y-2 items-start'>
                            <h1 className='font-bold'>Driver Summary</h1>
                            <p className='text-xs text-[#6B6B6B] font-[500]'>Registration details for Rajesh Singh</p>
                        </div>
                    </div>
                    <hr className='w-full border border-[#E5E5E5] my-4' />

                    <div className='flex flex-col'>
                        <ol className='pb-2'>
                            <li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>Full Name:</p>
                                <p className='text-sm font-[500]'>Rajesh Singh</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>UIN</p>
                                <p className='text-sm font-[500]'>198765432123</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>Gender</p>
                                <p className='text-sm font-[500]'>Male</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>Email:</p>
                                <p className='text-sm font-[500]'>myemail@gmail.com</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>Phone Number:</p>
                                <p className='text-sm font-[500]'>+91 9876543210</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>City</p>
                                <p className='text-sm font-[500]'>Chandigarh</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>Transport Company</p>
                                <p className='text-sm font-[500]'>TransGlobal Logistics Ltd.</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>License Number:</p>
                                <p className='text-sm font-[500]'>DL-9876543210</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>Passport Number:</p>
                                <p className='text-sm font-[500]'>Z7654321</p>
                            </li><li className='flex justify-between py-2.5'>
                                <p className='font-semibold text-sm'>CPC Certificate:</p>
                                <p className='text-sm font-[500]'>File Uploaded </p>
                            </li>
                        </ol>
                    </div>
                </div>
                <button onClick={onStartNewRegistration}
                    className={`bg-[#006DE7] w-[31%] cursor-pointer"} text-xs font-[600] py-2.5 px-2.5 mt-6 mr-9 place-self-end text-center rounded-[5px] text-[#FFFFFF] cursor-pointer`}>
                    Start New Registration
                </button>
            </div>

        </div>
    )
}

