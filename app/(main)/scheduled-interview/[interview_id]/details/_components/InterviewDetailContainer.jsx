import { Calendar, Clock, MessageCircleQuestionIcon, Tag } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 shadow-md rounded-lg mt-5 border'>
      <h2 className='font-bold text-xl'>{interviewDetail?.jobPosition}</h2>

      <div className='mt-4 flex items-center justify-between lg:pr-52'>
        <div>
          <h2 className='text-sm text-gray-500'>Duration</h2>
          <h2 className='flex mt-1 text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' /> {interviewDetail?.duration}</h2>
        </div>
        <div>
          <h2 className='text-sm text-gray-500'>Created On</h2>
          <h2 className='flex mt-1 text-sm font-bold items-center gap-2'><Calendar className='h-4 w-4' /> {moment(interviewDetail?.created_at).format('MMM DD, yyyy')}</h2>
        </div>
        {interviewDetail?.type &&
          <div>
            <h2 className='text-sm text-gray-500'>Type</h2>
            <h2 className='flex mt-1 text-sm font-bold items-center gap-2'><Tag className='h-4 w-4' /> {JSON.parse(interviewDetail?.type)[0]}</h2>
          </div>
        }
      </div>
      <div className='mt-5'>
        <h2 className='font-bold'>Job Description</h2>
        <p className='text-sm leading-6'>{interviewDetail?.jobDescription}</p>
      </div>

      <div className='mt-5'>
        <h2 className='font-bold'>Interview Questions</h2>
        <div className='gap-3 mt-2 leading-6'>
          {interviewDetail?.questionList.map((item, index) => (
            <h2 key={index} className='text-sm flex gap-2 items-center mt-1'><MessageCircleQuestionIcon className='text-primary h-4 w-4' /> {item?.question}</h2>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InterviewDetailContainer