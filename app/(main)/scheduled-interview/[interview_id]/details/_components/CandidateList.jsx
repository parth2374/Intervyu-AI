import { Button } from '@/components/ui/button'
import moment from 'moment'
import React from 'react'
import CandidateFeedbackDialog from './CandidateFeedbackDialog'

const CandidateList = ({ candidateList }) => {
  return (
    <div>
      <h2 className='font-bold my-5'>Candidates ({candidateList?.length})</h2>
      {candidateList && candidateList.map((candidate, index) => (
        <div key={index} className='p-5 flex gap-3 items-center shadow-md justify-between rounded-lg border'>
          <div className='flex items-center gap-5'>
            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold">
              {candidate?.userName?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className='font-bold'>{candidate?.userName}</h2>
              <h2 className='text-sm text-gray-500'>Completed On: {moment(candidate?.created_at).format('MMM DD, yyyy')}</h2>
            </div>
          </div>
          <div className='flex gap-3 items-center'>
            <h2 className='text-green-600 font-bold'>6/10</h2>
            <CandidateFeedbackDialog candidate={candidate} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default CandidateList