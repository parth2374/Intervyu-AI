// 3:28:03

"use client"

import React, { useState } from 'react'
import InterviewHeader from './_components/InterviewHeader'
import { InterviewDataContext } from '@/context/InterviewDataContext'

const InterviewLayout = ({ children }) => {

	const [interviewInfo, setInterviewInfo] = useState()

	return (
		<InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
			<div>
				<InterviewHeader />
				{children}
			</div>
		</InterviewDataContext.Provider>
	)
}

export default InterviewLayout