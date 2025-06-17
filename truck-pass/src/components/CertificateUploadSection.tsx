import React, { useState, type ChangeEvent } from 'react';
import upload_to_cloud from '../assets/upload_cloud_icon.png';
import file_type_icon from '../assets/file_type_icon.png';
import cross_circle_icon from '../assets/cross_circle_icon.png';
import trash_icon from '../assets/trash_icon.png';
import { useTranslation } from 'react-i18next';

export const CertificateUploadingSection: React.FC<CertificateUploadingSectionProps> = ({
  showUploadingBlock,
  setShowUploadingBlock,
  setFileUploaded,
  errorMsg,
  setErrorMsg
}) => {

  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [removeLastUploadData, setRemoveLastUploadData] = useState<boolean>(true);
  const [data, setData] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [fileSize, setFileSize] = useState<number>(0);
  const { t } = useTranslation();


  const handleFileInputClick = () => {
    document.getElementById('file-upload')?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShowUploadingBlock(true);
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    if (file) {
      const fileName = file.name;
      setFileSize(file.size);
      setErrorMsg('');
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      if (fileExtension === 'pdf' || fileExtension === 'png') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileData = e.target?.result as string;
          setUploading(true);
          setRemoveLastUploadData(true);
          setFileName(fileName);
          setData(fileData);
          const uploadSimulation = setInterval(() => {
            setProgress((prev) => {
              const newProgress = prev + 20;
              if (newProgress >= 100) {
                clearInterval(uploadSimulation);
                setUploading(false);
              }
              if (newProgress === 100) {
                setFileUploaded(true);
              }
              return newProgress;
            });
          }, 500);
        }
        reader.readAsText(file);
      } else {
        setFileName(fileName);
        setErrorMsg('Unsupported file type. Please upload valid PDF or image documents.');
      }
    }
  };

  const cancelUpload = () => {
    setFileName(null);
    setProgress(0);
    setUploading(false);
    setErrorMsg('');
    setData(null);
    setShowUploadingBlock(false);
    setFileUploaded(false);
  };

  const onChangeFile = () => {
    setShowUploadingBlock(false);
    setProgress(0);
    setUploading(false);
    setFileName(null);
    setErrorMsg('');
    setData(null);
    setFileUploaded(false);
  }

  return (
    <div className="flex flex-col ">
      <div className={`flex flex-col h-[200px] px-6 space-y-3 items-center bg-white border ${errorMsg ? 'border-[#FDA29B]' : 'border-[#E4E7EC]'} rounded-lg`}>
        {!showUploadingBlock && (
          <>
            <div className="border border-[#E4E7EC] p-2 mt-12 rounded-md">
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer hidden"
              />
              <img
                src={upload_to_cloud}
                className="h-4 cursor-pointer"
                onClick={handleFileInputClick}
              />
            </div>
            <p className="text-[13px] text-[#475467]">
              <span className="text-[13px] text-[#006DE7] font-semibold cursor-pointer" onClick={handleFileInputClick}>
                {t('certificationUploadSec.cpc')}
              </span>{' '} {t('certificationUploadSec.clickToBrowse')}
            </p>
            <p className="text-[13px] text-[#475467]">{t('certificationUploadSec.uploadCertificateInfo')}</p>
          </>
        )}

        {showUploadingBlock && !errorMsg ? (
          <div className="flex items-center justify-between w-full h-[4.5rem] border border-[#E4E7EC] rounded-md px-2.5 mt-12">
            <div className="flex items-center space-x-2 w-full">
              <div className='items-center -mt-3'>
                <img src={file_type_icon} className="h-7 w-7" />
              </div>
              <div className="flex flex-col mt-5 w-full">
                <p className="text-[#344054] text-[0.7rem] font-semibold">
                  {fileName ? fileName : 'CPC.pdf'}
                </p>
                <p className="text-[0.6rem] text-[#475467] font-semibold">
                  {fileSize} KB
                </p>
                <div className="flex justify-between gap-x-1 rounded-full h-2.5 mb-4">
                  <div
                    className={`bg-[#006DE7] h-1.5 self-center rounded-full mr-2`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className='flex flex-col h-7 w-7 gap-2 items-center'>
              <img
                src={trash_icon}
                className="h-4 w-4 cursor-pointer "
                onClick={cancelUpload}
              />
              <p className="text-[#344054] self-center text-[0.7rem] bg-white">{progress}%</p>
            </div>
          </div>
        ) : (
          errorMsg && (
            <div className="flex items-center justify-between w-full h-[4.5rem] border border-[#FDA29B] rounded-md px-2.5 mt-12">
              <div className="flex items-center space-x-2 w-full">
                <div className='items-center -mt-3'>
                  <img src={file_type_icon} className="h-7 w-7" />
                </div>
                <div className="flex flex-col mt-5 w-full">
                  <p className="text-[#344054] text-[0.7rem] font-semibold">
                    {fileName ? fileName : 'CPC.pdf'}
                  </p>
                  <div className='flex items-center gap-1'>
                    <p className="text-[0.6rem] text-[#475467] font-semibold">{fileSize} KB </p>
                    <img src={cross_circle_icon} className='h-3 pl-1.5' />
                    <p className='text-[10px] text-[#D92D20]'>{t('certificationUploadSec.failed')}</p>
                  </div>

                  <div className="flex justify-between gap-x-1 rounded-full h-2.5 mb-4">
                    <div
                      className={`bg-[#D92D20] h-1.5 self-center rounded-full mr-2`}
                      style={{ width: `100%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col h-7 w-7 gap-2 items-center'>
                <img
                  src={trash_icon}
                  className="h-4 w-4 cursor-pointer "
                  onClick={cancelUpload}
                />
                <p className="text-[#344054] self-center text-[0.7rem] bg-white">100%</p>
              </div>
            </div>
          )
        )}
        {(showUploadingBlock || errorMsg) &&
          <button onClick={onChangeFile}
            className={`bg-transparent w-[23%] text-xs text-[#414651] border border-[#D5D7DA] font-[600] py-2.5 text-center rounded-[5px] cursor-pointer`}>
            {t('certificationUploadSec.changeFile')}
          </button>
        }
      </div>
      <p className='text-xs text-[#D92D20] pt-1'>{errorMsg}</p>
    </div>
  );
};



interface CertificateUploadingSectionProps {
  showUploadingBlock: boolean;
  setShowUploadingBlock: React.Dispatch<React.SetStateAction<boolean>>;
  setFileUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  errorMsg: string;
  setErrorMsg: React.Dispatch<React.SetStateAction<string>>;
}