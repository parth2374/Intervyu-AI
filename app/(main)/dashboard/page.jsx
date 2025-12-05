'use client'

import React, { useEffect, useState } from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'

const Dashboard = () => {

	const { user } = useAuthContext()
	const router = useRouter()
	const [authLoading, setAuthLoading] = useState(true)

	useEffect(() => {
		if (user === undefined) {
      setAuthLoading(true)
      return
    }

		if (user === null) {
      router.push('/auth')
      return
    }

		setAuthLoading(false)
	}, [user, router])

	if (authLoading) {
		return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div role="status" className="flex flex-col items-center gap-3">
          <Loader className='animate-spin' />
          <span className="text-sm text-gray-600">Checking account…</span>
        </div>
      </div>
    )
	}

	return (
		<div>
			<h1 className="mb-6 mt-10 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">Dash<mark className="px-2 text-white bg-blue-600 rounded-sm dark:bg-blue-500">board</mark></h1>
			<CreateOptions />
			<LatestInterviewsList />
		</div>
	)
}

export default Dashboard