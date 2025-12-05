import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import moment from 'moment'
import { Progress } from '@/components/ui/progress'

const CandidateFeedbackDialog = ({ candidate }) => {

  const feedback = candidate?.feedback?.feedback

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-primary">View Report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription asChild>
            <div className='mt-5'>
              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-5'>
                  <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold">
                    {candidate?.userName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <h2 className='font-bold'>{candidate?.userName}</h2>
                    <h2 className='text-sm text-gray-500'>{candidate?.userEmail}</h2>
                  </div>
                </div>
                <div className='flex gap-3 items-center'>
                  <h2 className='text-primary text-2xl font-bold'>6/10</h2>
                </div>
              </div>
              <div className='mt-5'>
                <h2 className='font-bold'>Skills Assessment</h2>
                <div className='mt-3 grid grid-cols-2 gap-5'>
                  <div>
                    <h2 className='flex justify-between'>Technical Skills <span>{feedback?.rating?.technicalSkills}/10</span></h2>
                    <Progress value={feedback?.rating?.technicalSkills * 10} className={`mt-1`} />
                  </div>
                  <div>
                    <h2 className='flex justify-between'>Communication <span>{feedback?.rating?.communication}/10</span></h2>
                    <Progress value={feedback?.rating?.communication * 10} className={`mt-1`} />
                  </div>
                  <div>
                    <h2 className='flex justify-between'>Problem Solving <span>{feedback?.rating?.problemSolving}/10</span></h2>
                    <Progress value={feedback?.rating?.problemSolving * 10} className={`mt-1`} />
                  </div>
                  <div>
                    <h2 className='flex justify-between'>Experience <span>{feedback?.rating?.experience}/10</span></h2>
                    <Progress value={feedback?.rating?.experience * 10} className={`mt-1`} />
                  </div>
                </div>
                <div className='mt-5'>
                  <h2 className='font-bold'>Performance Summary</h2>
                  <p className='p-5 bg-secondary my-3 rounded-md'>{feedback?.summary}</p>
                </div>
              </div>
              <div className={`p-5 mt-5 gap-7 flex items-center justify-between rounded-md ${feedback?.recommendation == 'No' ? 'bg-red-100' : 'bg-green-100'}`}>
                <div>
                  <h2 className={`font-bold ${feedback?.recommendation == 'No' ? 'text-red-700' : 'text-green-700'}`}>Recommendation Message:</h2>
                  <p className={`${feedback?.recommendation == 'No' ? 'text-red-500' : 'text-green-500'}`}>{feedback?.recommendationMessage}</p>
                </div>
                <Button className={`${feedback?.recommendation == 'No' ? 'bg-red-700' : 'bg-green-700'}`}>Send Message</Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default CandidateFeedbackDialog