import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import upload_to_cloud from '../assets/upload_cloud_icon.png';
import file_type_icon from '../assets/file_type_icon.png';
import cross_circle_icon from '../assets/cross_circle_icon.png';
import trash_icon from '../assets/trash_icon.png';
import { useTranslation } from 'react-i18next';
export const CertificateUploadingSection = ({ driverRegistrationCpc, vehicleRegistrationDocument, showUploadingBlock, setShowUploadingBlock, clickableText, setFileUploaded, setDataInFile, fileUploadErrorMsg, setFileUploadErrorMsg }) => {
    const [fileName, setFileName] = useState('');
    // @ts-expect-error ignore unused variable error
    const [uploading, setUploading] = useState(false);
    // @ts-expect-error ignore unused variable error
    const [removeLastUploadData, setRemoveLastUploadData] = useState(true);
    const [progress, setProgress] = useState(0);
    const [fileSize, setFileSize] = useState(0);
    const { t } = useTranslation();
    const handleFileInputClick = () => {
        document.getElementById('file-upload')?.click();
    };
    const handleFileChange = (e) => {
        setShowUploadingBlock(true);
        setProgress(0);
        const file = e.target.files ? e.target.files[0] : null;
        if (!file)
            return;
        if (file) {
            const fileName = file.name;
            setFileSize(Math.round(file.size / 1024));
            setFileUploadErrorMsg('');
            const fileExtension = fileName.split('.').pop()?.toLowerCase();
            if (fileExtension === 'pdf' || fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fileData = e.target?.result;
                    setUploading(true);
                    setRemoveLastUploadData(true);
                    setFileName(fileName);
                    setDataInFile(fileData);
                    setTimeout(() => {
                        const uploadSimulation = setInterval(() => {
                            setProgress((prev) => {
                                const newProgress = prev + 20;
                                if (newProgress >= 100) {
                                    clearInterval(uploadSimulation);
                                    setUploading(false);
                                }
                                if (newProgress === 100) {
                                    clearInterval(uploadSimulation);
                                    setUploading(false);
                                    setFileUploaded(true);
                                }
                                return newProgress;
                            });
                        }, 500);
                    }, 0);
                };
                reader.readAsDataURL(file);
            }
            else {
                setFileName(fileName);
                setFileUploadErrorMsg(t('errors.uploadingCertificateErr'));
            }
        }
    };
    const cancelUpload = () => {
        setFileName('');
        setProgress(0);
        setUploading(false);
        setFileUploadErrorMsg('');
        setDataInFile('');
        setShowUploadingBlock(false);
        setFileUploaded(false);
    };
    const onChangeFile = () => {
        setShowUploadingBlock(false);
        setProgress(0);
        setUploading(false);
        setFileName('');
        setFileUploadErrorMsg('');
        setDataInFile('');
        setFileUploaded(false);
    };
    return (_jsxs("div", { className: "flex flex-col ", children: [_jsxs("div", { className: `flex flex-col ${vehicleRegistrationDocument ? 'h-[236px]' : 'h-[200px]'} px-6 space-y-3 items-center bg-white border ${fileUploadErrorMsg ? 'border-[#FDA29B]' : 'border-[#E4E7EC]'} rounded-lg`, children: [!showUploadingBlock && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "border border-[#E4E7EC] p-2 mt-12 rounded-md", children: [_jsx("input", { id: "file-upload", type: "file", onChange: handleFileChange, className: "cursor-pointer hidden" }), _jsx("img", { itemType: 'file', src: upload_to_cloud, className: "h-4 cursor-pointer", onClick: handleFileInputClick })] }), _jsxs("div", { className: `text-center ${!driverRegistrationCpc && 'w-[55%]'}`, children: [_jsxs("p", { className: "text-[13px] text-[#475467]", children: [_jsx("span", { itemType: 'file', className: "text-[13px] text-[#006DE7] font-semibold cursor-pointer", onClick: handleFileInputClick, children: clickableText }), ' ', " ", t('certificationUploadSec.clickToBrowse')] }), _jsx("p", { className: "text-[12px] text-[#475467]", children: t('certificationUploadSec.uploadManualCertificateInfo') })] })] })), showUploadingBlock && !fileUploadErrorMsg ? (_jsxs("div", { className: "flex items-center justify-between w-full h-[4.5rem] border border-[#E4E7EC] rounded-md px-2.5 mt-12", children: [_jsxs("div", { className: "flex items-center space-x-2 w-full", children: [_jsx("div", { className: 'items-center -mt-3', children: _jsx("img", { src: file_type_icon, className: "h-7 w-7" }) }), _jsxs("div", { className: "flex flex-col mt-5 w-full", children: [_jsx("p", { className: "text-[#344054] text-[0.7rem] font-semibold", children: fileName ? fileName : 'CPC.pdf' }), _jsxs("p", { className: "text-[0.6rem] text-[#475467] font-semibold", children: [fileSize, " KB"] }), _jsx("div", { className: "flex justify-between gap-x-1 rounded-full h-2.5 mb-4", children: _jsx("div", { className: `bg-[#006DE7] h-1.5 self-center rounded-full mr-2`, style: { width: `${progress}%` } }) })] })] }), _jsxs("div", { className: 'flex flex-col h-7 w-7 gap-2 items-center', children: [_jsx("img", { src: trash_icon, className: "h-4 w-4 cursor-pointer ", onClick: cancelUpload }), _jsxs("p", { className: "text-[#344054] self-center text-[0.7rem] bg-white", children: [progress, "%"] })] })] })) : (fileUploadErrorMsg && (_jsxs("div", { className: "flex items-center justify-between w-full h-[4.5rem] border border-[#FDA29B] rounded-md px-2.5 mt-12", children: [_jsxs("div", { className: "flex items-center space-x-2 w-full", children: [_jsx("div", { className: 'items-center -mt-3', children: _jsx("img", { src: file_type_icon, className: "h-7 w-7" }) }), _jsxs("div", { className: "flex flex-col mt-5 w-full", children: [_jsx("p", { className: "text-[#344054] text-[0.7rem] font-semibold", children: fileName ? fileName : 'CPC.pdf' }), _jsxs("div", { className: 'flex items-center gap-1', children: [_jsxs("p", { className: "text-[0.6rem] text-[#475467] font-semibold", children: [fileSize, " ", t('certificationUploadSec.kb')] }), _jsx("img", { src: cross_circle_icon, className: 'h-3 pl-1.5' }), _jsx("p", { className: 'text-[10px] text-[#D92D20]', children: t('certificationUploadSec.failed') })] }), _jsx("div", { className: "flex justify-between gap-x-1 rounded-full h-2.5 mb-4", children: _jsx("div", { className: `bg-[#D92D20] h-1.5 self-center rounded-full mr-2`, style: { width: `100%` } }) })] })] }), _jsxs("div", { className: 'flex flex-col h-7 w-7 gap-2 items-center', children: [_jsx("img", { src: trash_icon, className: "h-4 w-4 cursor-pointer ", onClick: cancelUpload }), _jsx("p", { className: "text-[#344054] self-center text-[0.7rem] bg-white", children: t('certificationUploadSec.fullPercentage') })] })] }))), (showUploadingBlock || fileUploadErrorMsg) &&
                        _jsx("button", { onClick: onChangeFile, className: `bg-transparent w-[23%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`, children: t('certificationUploadSec.changeFile') })] }), _jsx("p", { className: 'text-xs text-[#D92D20] pt-1', children: fileUploadErrorMsg })] }));
};
