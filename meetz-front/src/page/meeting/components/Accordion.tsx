import React, { useEffect, useState } from 'react';
import AudioPlayer from './AudioPlayer';
import ScriptBox from './ScriptBox';
import getReportedDetail from '../../../apis/meeting/getReportedDetail';
import fetchUserData from '../../../lib/fetchUserData';
import { useParams } from 'react-router-dom';
import { ReportsDto } from '../../../types/types';
import Loading from '../../../common/Loading';

interface AccordionProps {
  title: string;
  report: ReportsDto
}

const Accordion: React.FC<AccordionProps> = ({ title, report }) => {
  const { accessToken } = fetchUserData();
  const { meetingId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [reportDetail, setReportDetail] = useState<ReportsDto | null>(null);

  const fetchReportedDetail = async () => {
    setScriptLoading(true);
    try {
      const { data } = await getReportedDetail(+(meetingId || 0), report.reportId, accessToken || '');


    } catch (error) {

    }
    setScriptLoading(false);
  }

  const openAccordionHandler = () => {
    fetchReportedDetail();
    setIsOpen(!isOpen)
  }



  return (
    <div className='border-b'>
      <div
        className='flex justify-between items-center py-7 cursor-pointer'
        onClick={openAccordionHandler}
      >
        <span className='font-light text-2xl'>{title}</span>
        <svg
          className={`w-9 h-9 text-[#FF4F5D] transform transition-transform ${isOpen ? 'rotate-180' : ''
            } hover:scale-125 hover:text-[#ff4444]`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M19 9l-7 7-7-7'
          ></path>
        </svg>
      </div>
      {isOpen && (
        <div className='p-4'>
          {scriptLoading ?
            <div className='py-10'>
              <Loading width={60} height={60} />
            </div>
            :
            <>
              <AudioPlayer />
              <ScriptBox />
            </>}
        </div>
      )}
    </div>
  );
};

export default Accordion;