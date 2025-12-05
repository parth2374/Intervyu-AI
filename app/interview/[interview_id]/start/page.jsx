"use client"

import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Loader2Icon, Mic, MicOff, Phone, Timer } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web';
import { useAuthContext } from '@/app/provider'
import AlertConfirmation from './_components/AlertConfirmation'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { supabase } from '@/services/supabaseClient'

const StartInterview = () => {

	const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext)
	const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
	const { user } = useAuthContext()
	const [conversation, setConversation] = useState([])
	const [conversationText, setConversationText] = useState('')
	const callEndedRef = useRef(false)
	const feedbackRunningRef = useRef(false)
	const router = useRouter()
	const [activeUser, setActiveUser] = useState(false)
	const [micOn, setMicOn] = useState(false);
  const streamRef = useRef(null);
	const { interview_id } = useParams()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if(user === undefined) return;
		
		if (user === null) {
			toast("Please login to start the interview!")
			router.replace('/auth')
		}
	}, [user, router])

	useEffect(() => {
		interviewInfo && startCall()
		console.log("Interview Info")
		console.log(interviewInfo)
	}, [interviewInfo])

	const startCall = () => {
		let questionList;
		interviewInfo?.interviewData?.questionList.forEach((item, index) => (
			questionList = item?.question + "," + questionList
		))

		const assistantOptions = {
			name: "AI Recruiter",
			firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your first interview on " + interviewInfo?.interviewData?.jobPosition + "",
			transcriber: {
				provider: "deepgram",
				model: "nova-2",
				language: "en-US"
			},
			voice: {
				provider: "playht",
				voiceId: "jennifer"
			},
			model: {
				provider: "openai",
				model: "gpt-4",
				messages: [
					{
						role: "system",
						content: `
							You are an AI voice assistant conducting interviews.
							Your job is to ask candidates provided interview questions, assess their responses.
							Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
							"Hey there! Welcome to your ` + interviewInfo?.interviewData?.jobPosition + ` interview. Let's get started with a few questions!"
							Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below are the questions.
							Questions: ` + questionList + `
							If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
							"Need a hint? Think about how React track component updates!"
							Provide brief, encouraging feedback after each answer. Example:
							"Nice! That's a solid answer"
							"Hmm, not quite! Want to try again?"
							Keep the conversation natural and engaging-use casual phases like "Alright, next up..." or "Let's tackle a tricky one!"
							After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
							"That was great! You handled some tough questions well. Keep sharpening your skills!"
							End on a positive note:
							"Thanks for chatting! Hope to see you crushing projects soon!"
							Key guidelines:
							✅ Be friendly, engaging and witty
							✅ Keep responses short and neutral, like a real converstion
							✅ Adapt based on the candidate's confidence level
							✅ Ensure the interview remains focused on React
						`.trim()
					}
				]
			}
		}

		console.log("Interview Started")
		vapi.start(assistantOptions)
	}

	const stopInterview = async () => {
		if (callEndedRef.current) {
			console.log("Call already ending - ignoring duplicate stop.")
			return
		}

		callEndedRef.current = true
		try {
			// If the vapi.stop() supports a promise, await it. If not, this won't hurt.
			vapi.stop()
		} catch (err) {
			console.warn("vapi.stop() threw:", err)
		}

		console.log("User requested call end - running post-call tasks locally")
		toast && toast("Ending interview...")

		// Immediately generate feedback locally (no long wait for SDK event)
		await GenerateFeedback()
	}

	useEffect(() => {
		const handleMessage = (message) => {
			console.log("Message", message)

			if (!message?.conversation) return

			// message.conversation might be an array or a JSON string — handle both
			let conv = message.conversation
			if (typeof conv === 'string') {
				try {
					conv = JSON.parse(conv)
				} catch (err) {
					// if it's plain text, try to guard: wrap as a single assistant entry
					conv = [{ role: 'assistant', content: message.conversation }]
				}
			}

			// ensure conv is an array
			if (!Array.isArray(conv)) conv = [conv]

			setConversation(conv)

			// make a human-readable transcript to send to the feedback API
			const transcript = conv
				.map(m => `${(m.role || 'unknown').toUpperCase()}: ${m.content ?? ''}`)
				.join('\n')
			setConversationText(transcript)

			// debug logging
			console.log("Conversation (array)", conv)
			console.log("Conversation transcript", transcript)
		}

		vapi.on("message", handleMessage)

		vapi.on("call-start", () => {
			console.log("Call has started.")
			toast("Call Connected...")
		})

		vapi.on("speech-start", () => {
			console.log("Assistant speech has started.")
			setActiveUser(false)
		})

		vapi.on("speech-end", () => {
			console.log("Assistant speech has ended.")
			setActiveUser(true)
		})

		vapi.on("call-end", () => {
			console.log("Call has ended (SDK event).")
			if (callEndedRef.current) {
				console.log("Call-end already handled by user action - skipping.")
				return
			}
			callEndedRef.current = true
			toast && toast("Interview Ended!")
			GenerateFeedback()
		})

		return () => {
			vapi.off("message", handleMessage)
			vapi.off("call-start", () => console.log("End"))
			vapi.off("speech-start", () => console.log("End"))
			vapi.off("speech-end", () => console.log("End"))
			vapi.off("call-end", () => console.log("End"))
		}
	}, [])

	const GenerateFeedback = async () => {
		if (feedbackRunningRef.current) {
			console.log("GenerateFeedback already running - skipping duplicate call")
			return
		}
		feedbackRunningRef.current = true
		setLoading(true)

		const sendRequest = async (payload) => {
			try {
				return await axios.post('/api/ai-feedback', payload)
			} catch (err) {
				console.error("Feedback request failed", err)
				throw err
			}
		}

		// helper to extract JSON blocks (same approach as earlier)
		const extractJsonText = (text) => {
			if (!text || typeof text !== 'string') return null
			const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
			if (fence && fence[1]) return fence[1].trim()
			const brace = text.match(/(\{[\s\S]*\})/)
			if (brace && brace[1]) return brace[1].trim()
			return null
		}
		const sanitizePossibleJson = (text) => {
			if (!text || typeof text !== 'string') return text
			return text
				.replace(/(\r\n|\n|\r)/gm, ' ')
				.replace(/,\s*}/g, '}')
				.replace(/,\s*]/g, ']')
		}

		try {
			// 1) First attempt: send conversation as-is plus transcript
			const payload1 = { conversation, transcript: conversationText }
			const res1 = await sendRequest(payload1)
			const raw1 = res1?.data?.content ?? res1?.data ?? ''
			console.log("AI raw response (attempt 1):", raw1)

			// Try to parse JSON out of response
			let parsedFeedback = null
			const candidate1 = typeof raw1 === 'string' ? extractJsonText(raw1) : null
			if (candidate1) {
				try { parsedFeedback = JSON.parse(candidate1) }
				catch (e) {
					try { parsedFeedback = JSON.parse(sanitizePossibleJson(candidate1)) }
					catch (e2) { parsedFeedback = null }
				}
			} else if (typeof raw1 === 'object') {
				parsedFeedback = raw1
			} else {
				// try parsing raw1 itself
				try { parsedFeedback = JSON.parse(raw1) } catch (e) { parsedFeedback = null }
			}

			// If the model explicitly asked for the conversation (common failure), retry sending transcript and a stronger cue
			const needsTranscript = typeof raw1 === 'string' && /need the interview conversation|please provide the conversation/i.test(raw1)
			if (!parsedFeedback && needsTranscript) {
				console.warn("Model asked for conversation -> retrying with explicit transcript + instruction")
				const payload2 = {
					conversation,
					transcript: conversationText,
					client_note: "TRANSCRIPT_INCLUDED: please generate ONLY the JSON feedback using the transcript field. Do not ask for the transcript."
				}
				const res2 = await sendRequest(payload2)
				const raw2 = res2?.data?.content ?? res2?.data ?? ''
				console.log("AI raw response (attempt 2):", raw2)

				const candidate2 = typeof raw2 === 'string' ? extractJsonText(raw2) : null
				if (candidate2) {
					try { parsedFeedback = JSON.parse(candidate2) }
					catch (e) {
						try { parsedFeedback = JSON.parse(sanitizePossibleJson(candidate2)) }
						catch (e2) { parsedFeedback = null }
					}
				} else if (typeof raw2 === 'object') {
					parsedFeedback = raw2
				} else {
					try { parsedFeedback = JSON.parse(raw2) } catch (e) { parsedFeedback = null }
				}
			}

			// Final fallback: if still nothing parseable, create a structured fallback that won't be the assistant prompt
			const feedbackToStore = parsedFeedback ?? {
				error: "model_failed_to_return_json",
				model_raw: (typeof parsedFeedback === 'object' ? raw1 : String(res1?.data?.content ?? raw1))
			}

			// Save to DB
			const { data, error } = await supabase
				.from('Interview_Feedback')
				.insert([
					{
						userName: interviewInfo?.userName,
						userEmail: interviewInfo?.userEmail,
						interview_id: interview_id,
						feedback: feedbackToStore,
						recommended: false
					},
				])
				.select()

			if (error) {
				console.error("Supabase insert error:", error)
				toast && toast("Failed saving feedback.")
			} else {
				console.log("Saved feedback:", data)
				router.replace('/interview/' + interview_id + "/completed")
			}
		} catch (err) {
			console.error("GenerateFeedback error:", err)
			toast && toast("Failed to generate feedback. See console.")
		} finally {
			feedbackRunningRef.current = false
			setLoading(false)
		}
	}

	const toggleMic = async () => {
    if (!micOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setMicOn(true);
      } catch (err) {
        console.error('Microphone access denied:', err);
      }
    } else {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setMicOn(false);
    }
  };

	return (
		<div className='p-20 lg:px-48 xl:px-56'>
			<h2 className='font-bold text-xl flex justify-between'>AI Interview Session <span className='flex gap-2 items-center'><Timer /> 00:00:00</span></h2>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
				<div className='shadow-md relative h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
					<div className='relative'>
						{!activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
						<Image
							src={'/ai.webp'}
							alt='AI'
							width={100}
							height={100}
							className='w-[60px] h-[60px] rounded-full object-cover'
						/>
					</div>
					<div className='absolute bottom-5 left-5 text-md font-semibold'>
				    <h2>AI Recruiter</h2>
				  </div>
				</div>
				<div className='shadow-md relative h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
					<div className='relative'>
						{activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
						{!user && <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5'>{interviewInfo?.userName[0]}</h2>}
						{user && <Image
							src={user?.picture}
							alt='AI'
							width={100}
							height={100}
							className='w-[60px] h-[60px] rounded-full object-cover'
						/>}
					</div>
					<div className='absolute bottom-5 left-5 text-md font-semibold'>
						<h2>{interviewInfo?.userName}</h2>
					</div>
				</div>
			</div>

			<div className='flex items-center gap-5 justify-center mt-7'>
				<div onClick={toggleMic}>
		      {micOn ? (
		        <Mic className='h-12 w-12 p-3 bg-blue-500 text-white rounded-full cursor-pointer' />
		      ) : (
		        <MicOff className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
		      )}
		    </div>
				{loading ?
					<div className='bg-red-500 rounded-full'>
						<Loader2Icon className='h-12 w-12 p-3 text-white animate-spin' />
					</div>
					:
					<AlertConfirmation stopInterview={() => stopInterview()}>
						<Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
					</AlertConfirmation>
				}
			</div>
			<h2 className='text-sm text-gray-400 text-center mt-5'>Interview in Progress...</h2>
		</div>
	)
}

export default StartInterview