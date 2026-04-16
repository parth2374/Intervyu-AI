'use client'

import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuthContext } from '@/app/provider'
import FormContainer from './FormContainer'
import QuestionList from './QuestionList'
import InterviewLink from './InterviewLink'

const CreateInterviewContent = () => {

  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledRole = searchParams.get('role') || ''
  const prefilledDesc = searchParams.get('desc') || ''
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    duration: '',
    type: []
  })
  const [interviewId, setInterviewId] = useState()
  const { user } = useAuthContext()

  useEffect(() => {
    if (!user) {
      const currentUrl = window.location.pathname + window.location.search
      router.push(`/auth?redirect=${encodeURIComponent(currentUrl)}`)
    }
  }, [user])

  useEffect(() => {
    const roleFromUrl = searchParams.get('role') || ''
    const roleFromStorage = localStorage.getItem('jobRole') || ''
    const descFromStorage = localStorage.getItem('jobDesc') || ''

    setFormData({
      jobPosition: roleFromUrl || roleFromStorage,
      jobDescription: descFromStorage,
      duration: '',
      type: []
    })
  }, [])

  const onHandleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    console.log('formData', formData)
  }

  const onGoToNext = () => {
    if (user?.credits <= 0) {
      toast('Please add credits!')
      return;
    }
    if(!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData?.type) {
      toast('Please fill all the details!')
      return;
    }
    setStep(step + 1)
  }

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id)
    setStep(step + 1)
  }

  return (
    <div className='mt-10 px-0 md:px-24 lg:px-44 xl:px-56'>
      <div className='flex gap-5 items-center'>
        <ArrowLeft onClick={() => router.back()} className='cursor-pointer' />
        <h2 className='font-bold text-2xl'>Create New Interview</h2>
      </div>

      <Progress value={step * 33.33} className={`my-5`} />
      {step == 1 ?
        <FormContainer onHandleInputChange={onHandleInputChange} GoToNext={() => onGoToNext()} initialJobPosition={formData?.jobPosition} initialJobDescription={formData?.jobDescription} />
        :
        step == 2 ?
          <QuestionList formData={formData} onCreateLink={(interview_id) => onCreateLink(interview_id)} />
          :
          step == 3 ?
            <InterviewLink interview_id={interviewId} formData={formData} />
            : null
      }
    </div>
  )
}

export default CreateInterviewContent