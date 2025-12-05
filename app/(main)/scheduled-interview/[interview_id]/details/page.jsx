'use client'

import { useAuthContext } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import InterviewDetailContainer from './_components/InterviewDetailContainer'
import CandidateList from './_components/CandidateList'

const InterviewDetail = () => {

  const { interview_id } = useParams()
  const { user } = useAuthContext()
  const [interviewDetail, setInterviewDetail] = useState()

  useEffect(() => {
    user && GetInterviewDetail()
  }, [user])

  const GetInterviewDetail = async () => {
    const result = await supabase.from("Interviews")
                        .select(`jobPosition,jobDescription,type,questionList,duration,interview_id,created_at,Interview_Feedback(userEmail,userName,feedback,created_at)`)
                        .eq('userEmail', user?.email)
                        .eq('interview_id', interview_id)

    setInterviewDetail(result?.data[0])
    console.log("Interview Details")
    console.log(result?.data)
    console.log(interview_id)
  }

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-2xl'>Interview Details</h2>
      <InterviewDetailContainer interviewDetail={interviewDetail} />
      <CandidateList candidateList={interviewDetail?.['Interview_Feedback']} />
    </div>
  )
}

export default InterviewDetail