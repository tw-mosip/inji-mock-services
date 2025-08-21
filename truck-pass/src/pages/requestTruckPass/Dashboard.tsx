import React from 'react';
import { useTranslation } from 'react-i18next';
import clockIcon from '../../assets/clock_icon.png';
import approvedIcon from '../../assets/approved_icon.png';
import pendingReviewIcon from '../../assets/pending_review_icon.png';
import trucksNumIcon from '../../assets/trucks_number_icon.png';
import sortUpIcon from '../../assets/sort_up_icon.png';
import sortDownIcon from '../../assets/sort_down_icon.png';
import { useNavigate } from 'react-router-dom';



export const Dashboard: React.FC<DashboardProps> = ({ }) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const metricItems = [
        { icon: clockIcon, itemName: t('dashBoard.activeRequest'), count: '10' },
        { icon: approvedIcon, itemName: t('dashBoard.approvedPasses'), count: '70' },
        { icon: pendingReviewIcon, itemName: t('dashBoard.pendingReview'), count: '8' },
        { icon: trucksNumIcon, itemName: t('dashBoard.totalTrucks'), count: '45' }
    ]

    const tableHeaders = [
        { id: '1', title: t('dashBoard.requestId') },
        { id: '2', title: t('dashBoard.driverName') },
        { id: '3', title: t('dashBoard.licenceNumber') },
        { id: '4', title: t('dashBoard.status') },
        { id: '5', title: t('dashBoard.date') }
    ];

    const tableBody = [
        { requestId: 'TP-2024-001', driverName: 'John Smith', licenceNumber: 'ABC-123', status: 'approved', date: '20-08-2025' },
        { requestId: 'TP-2024-002', driverName: 'Srikar dube', licenceNumber: 'XYZ-234', status: 'pending', date: '12-05-2025' },
        { requestId: 'TP-2024-003', driverName: 'Anand Kumar', licenceNumber: 'PQR-345', status: 'underReview', date: '06-6-2025' },
        { requestId: 'TP-2024-004', driverName: 'Rajesh singh', licenceNumber: 'TUV-890', status: 'rejected', date: '5m 8s' },
        { requestId: 'TP-2024-005', driverName: 'Raja Vijaya Venkatesh pratap rana Singh', licenceNumber: 'STR-345', status: 'approved', date: '1hr 30m 20s' },
        { requestId: 'TP-2024-006', driverName: 'Arjun Naidu', licenceNumber: 'GHI-567', status: 'pending', date: '33m 21s' }
    ];

    const statusBg = (status: string) => {
        switch (status) {
            case 'approved':
                return { label: 'Approved', statusClass: 'text-[#067647] bg-[#ECFDF3] border-[#ABEFC6] rounded-2xl w-[90px]', pointerBg: 'bg-[#17B26A]' };
            case 'pending':
                return { label: 'Pending', statusClass: 'text-[#B54708] bg-[#FFFAEB] border-[#FEDF89] rounded-2xl w-[90px]', pointerBg: 'bg-[#F79009]' };
            case 'underReview':
                return { label: 'Under Review', statusClass: 'text-[#026AA2] bg-[#F0F9FF] border-[#B9E6FE] rounded-2xl w-[120px]', pointerBg: 'bg-[#0BA5EC]' };
            case 'rejected':
                return { label: 'Rejected', statusClass: 'text-[#f74060] bg-[#F7C7CF] border-[#F7C7Ch] rounded-2xl w-[90px]', pointerBg: 'bg-[#F74060]' };
        }
    };

    const newTruckPassRequest = () => {
        navigate('/requestTruckpassProcess/driverProfile');
    };


    return (
        <div className="flex flex-col pt-9 font-inter h-auto bg-[#ECF5FF]">
            <div className='flex justify-between items-center px-20'>
                <h1 className='font-[600] text-[23px] text-[#27181a]'>{t('dashBoard.myDashBoard')}</h1>
                <button onClick={() => newTruckPassRequest()} className='bg-[#006DE7] font-medium text-[13px] px-3.5 py-2.5 text-[#FFFFFF] border rounded-md cursor-pointer hover:border-[#006DE9] hover:shadow-lg'>
                    {t('dashBoard.newTruckPassRequest')}
                </button>
            </div>

            <div className='flex justify-between my-9 px-20'>
                {metricItems.map((item, id) => {
                    return (
                        <div key={id} className='flex bg-[#FFFFFF] p-3 space-x-3 h-[90px] w-[270px] border border-[#DEDEDE] rounded-xl'>
                            <img src={item.icon} className='h-9.5' />
                            <div className='flex flex-col gap-x-1 text-start'>
                                <p className='text-[#535862] text-sm font-[600]'>{item.itemName}</p>
                                <p className='text-[#181D27] text-[30px] font-[600]'>{item.count}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-[url('../assets/landingpage_bg.png')] w-full px-20">
                <div className='flex bg-[#FFFFFF] px-6 h-[69px] items-center bottom border border-[#DEDEDE] rounded-t-[8px]'>
                    <p className='font-semibold text-[16px] text-[#181D27]'>Request Truck Pass Requests</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            {tableHeaders.map((header, id) => {
                                return (
                                    <th key={id} className="bg-[#FFFFFF] gap-x-2 w-[15%] text-[#181D27] text-sm font-[400]">
                                        <div id={`${header.title}_header`} className={`flex gap-x-1.5 p-4 mx-2 items-center text-left}`}>
                                            {t(header.title)}
                                            <div className='flex flex-col items-center'>
                                                <img src={sortUpIcon} alt="sorting icon" className='h-2 font-[600] place-self-center' />
                                                <img src={sortDownIcon} alt="sorting icon" className='h-2 font-[600] place-self-center' />
                                            </div>
                                        </div>
                                    </th>);
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tableBody.map((request, id) => {
                            const currentStatus = statusBg(request.status) ?? { label: '', statusClass: '', pointerBg: '' };
                            const { label, statusClass, pointerBg } = currentStatus;

                            return (
                                <tr key={id}
                                    className={`bg-[#FFFFFF] border-t border-[#E5EBFA] text-[0.8rem] break-words h-[54px] text-[#191919] cursor-pointer"}`}>
                                    <td className={`px-6 font-[600]`}>{request.requestId}</td>
                                    <td className={`px-6 w-[360px]`}>{request.driverName}</td>
                                    <td className={`px-6`}>{request.licenceNumber}</td>
                                    <td className={`${statusClass} flex space-x-1 border text-xs font-[400] mt-3.5 px-1.5 ml-4 h-[28px] items-center`}>
                                        <span className={`flex h-1.5 w-1.5 rounded-2xl ${pointerBg}`}></span>
                                        <p className='font-[600]'>{label}</p>
                                    </td>
                                    <td className={`px-6`}>{request.date}</td>
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <footer className='text-sm text-[#717171] place-self-center bg-transparent pt-10 pb-6 font-inter'>
                {t('footer.footerText')}
            </footer>
            {/* Footer */}
        </div>
    )
}

interface DashboardProps {

};
