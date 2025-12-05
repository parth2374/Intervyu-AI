"use client"

import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { Camera, Loader, Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import InterviewCard from './InterviewCard'
import { toast } from 'sonner'
import EmptyStateCard from './EmptyStateCard'

const LatestInterviewsList = () => {

	const [interviewList, setInterviewList] = useState([])
	const { user } = useAuthContext()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		user && GetInterviewList()
	}, [user])
 
	const GetInterviewList = async () => {
		setLoading(true)
		let { data: Interviews, error } = await supabase
		  .from('Interviews')
		  .select('*, Interview_Feedback ( userEmail )')
			.eq("userEmail", user?.email)
			.order("id", { ascending: false })
			.limit(6)

		console.log(Interviews)
		setInterviewList(Interviews)
		setLoading(false)
	}

	return (
		<div className='my-5 mt-10'>
			<h1 className="mb-6 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl"><span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Previously Created</span> Interviews</h1>

			{loading && <div className='w-full h-40 flex items-center justify-center'><Loader className='animate-spin' /></div>}

			{interviewList == 0 && !loading && (
				<EmptyStateCard />
			)}

			{interviewList && !loading &&
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-5'>
					{interviewList.map((interview, index) => (
						<InterviewCard interview={interview} key={index} showCandidate={false} />
					))}
				</div>
			}
		</div>
	)
}

export default LatestInterviewsList