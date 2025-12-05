// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { ArrowLeft, Calendar, Clock, Copy, List, Mail, MessageCircle, Plus, Slack } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import React from 'react'
// import { toast } from 'sonner'

// const InterviewLink = ({ interview_id, formData }) => {

// 	const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id

// 	const GetInterviewUrl = () => {
// 		return url
// 	}

// 	const onCopyLink = async () => {
// 		await navigator.clipboard.writeText(url)
// 		toast('Link Copied!')
// 		console.log("FormData is here")
// 		console.log(formData)
// 	}

// 	return (
// 		<div className='flex flex-col items-center justify-center mt-10'>
// 			<Image
// 				src={'/check.png'}
// 				alt='check'
// 				width={200}
// 				height={200}
// 				className='w-[50px] h-[50px]'
// 			/>
// 			<h2 className='font-bold text-lg mt-4'>Your AI Interview is Ready!</h2>
// 			<p className='mt-3'>Share this link with your candidates to start the interview process</p>

// 			<div className='w-full p-7 mt-6 rounded-lg shadow-md border'>
// 				<div className='flex justify-between items-center'>
// 					<h2 className='font-bold'>Interview Link</h2>
// 					<h2 className='p-1 px-2 text-primary bg-blue-50 text-center rounded-4xl'>Valid for 30 Days</h2>
// 				</div>

// 				<div className='mt-3 flex-row md:flex lg:flex gap-3 items-center'>
// 					<Input defaultValue={GetInterviewUrl()} disabled={true} />
// 					<Button className='mt-2 text-center md:mt-0 lg:mt-0' onClick={() => onCopyLink()}><Copy /> Copy Link</Button>
// 				</div>

// 				<hr className='my-5' />

// 				<div className='flex gap-5'>
// 					<h2 className='text-sm text-gray-500 flex gap-2 items-center'><Clock className='h-4 w-4' />{formData?.duration}</h2>
// 					<h2 className='text-sm text-gray-500 flex gap-2 items-center'><List className='h-4 w-4' /> 10 Questions</h2>
// 					{/* <h2 className='text-sm text-gray-500 flex gap-2 items-center'><Calendar className='h-4 w-4' /> 30 Min {formData?.duration}</h2> */}
// 				</div>
// 			</div>

// 			<div className='mt-7 shadow-md border p-5 rounded-lg w-full'>
// 				<h2 className='font-bold'>Share Via</h2>
// 				<div className='flex gap-7 mt-2 flex-wrap'>
// 					<Button variant={'outline'}><Mail /> Email</Button>
// 					<Button variant={'outline'}><Slack /> Slack</Button>
// 					<Button variant={'outline'}><MessageCircle /> Whatsapp</Button>
// 				</div>
// 			</div>

// 			<div className='flex w-full gap-5 justify-between mt-6 flex-wrap'>
// 				<Link href={'/dashboard'}>
// 					<Button className={`cursor-pointer`} variant={'outline'}><ArrowLeft /> Back to Dashboard</Button>
// 				</Link>
// 				<Link href={'/dashboard/create-interview'}>
// 					<Button className={`cursor-pointer`}><Plus /> Create New Interview</Button>
// 				</Link>
// 			</div>
// 		</div>
// 	)
// }

// export default InterviewLink

'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Copy,
  List,
  Mail,
  MessageCircle,
  Plus,
  Slack,
  Link as LinkIcon,
	Check,
	LucideMoveLeft,
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * InterviewLink.jsx
 * - Plain JSX (no TS)
 * - Polished, responsive success UI
 * - Copy, preview, quick-share (email / whatsapp / slack fallback)
 * - QR code preview (uses free qrserver API image)
 *
 * Drop in place of your original component.
 */

export default function InterviewLink({ interview_id, formData }) {
  const url = (process.env.NEXT_PUBLIC_HOST_URL || '') + '/' + interview_id
  const [copied, setCopied] = useState(false)

  const expiresOn = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30) // valid 30 days
    return d.toLocaleDateString()
  }, [])

  const questionsCount = (formData?.questionList && formData.questionList.length) || 10

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      toast.error('Failed to copy — please select and copy manually.')
    }
  }

  const onShareEmail = () => {
    const subject = encodeURIComponent(`${formData?.jobPosition || 'Interview'} — Invitation`)
    const body = encodeURIComponent(
      `Hello,\n\nYou have been invited to an interview.\n\nOpen the interview: ${url}\n\nDuration: ${formData?.duration || '—'}\n\nGood luck!`
    )
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank')
  }

  const onShareWhatsapp = () => {
    const text = encodeURIComponent(
      `You're invited to an interview: ${formData?.jobPosition || ''}\n\nOpen: ${url}\nDuration: ${formData?.duration || '—'}`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
  }

  const onShareSlack = async () => {
    // Slack does not provide a universal "share" URL for arbitrary workspaces.
    // Try to open Slack desktop app using deep link — fallback to copying link + toast.
    const slackDeep = `slack://open`
    // attempt deep link
    const timeout = setTimeout(() => {
      onCopyLink()
      toast('Unable to open Slack directly — link copied to clipboard, paste it in Slack.')
    }, 800)

    // try open deep link
    window.location.href = slackDeep
    // clear fallback if focus lost (likely opened)
    window.addEventListener('blur', () => clearTimeout(timeout), { once: true })
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-50 to-white/80 dark:from-slate-900 dark:to-slate-800 shadow-md border border-slate-100 dark:border-slate-700 p-6">
        {/* Top area */}
        <div className="flex flex-col md:flex-col items-center gap-6">
          {/* Success visual */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-emerald-500 to-indigo-600 shadow-lg">
              {/* Animated check SVG */}
              <svg className="w-12 h-12 text-white" viewBox="0 0 52 52" aria-hidden>
                <circle cx="26" cy="26" r="25" fill="transparent" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                <path
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14 27l6 6 18-18"
                  style={{ strokeDasharray: 60, strokeDashoffset: 0 }}
                />
              </svg>
            </div>

            <div className="min-w-0">
              <h2 className="text-2xl font-extrabold leading-tight text-center">Your AI interview is ready 🎉</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 text-center">
                Share the link below with candidates. Interview will expire on <strong>{expiresOn}</strong>.
              </p>

              <div className="mt-3 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                  <Clock className="h-4 w-4 text-slate-600" /> <span>{formData?.duration || '—'}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
                  <List className="h-4 w-4 text-slate-600" /> <span>{questionsCount} Questions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions panel */}
          <div className="ml-auto w-full">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <label className="text-xs text-slate-500">Interview Link</label>

              <div className="mt-3 flex gap-2">
                <Input value={url} readOnly aria-label="Interview link" className="flex-1" />
                <Button onClick={onCopyLink} aria-label="Copy interview link" className="flex-shrink-0">
                  {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
                </Button>
              </div>

              <div className="mt-8 mb-10 flex gap-8 items-center">
								<div class="relative w-full inline-flex group">
									<div
										className="absolute w-full transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"
									>
									</div>
									<a
										href={url}
										target='_blank'
										rel="noreferrer"
										title="Get quote now"
										className="relative gap-2 w-full inline-flex items-center justify-center px-8 py-2 font-mono transition-all duration-200 bg-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
										role="button"
									>
											<LinkIcon className='h-5 w-5' /> Preview Link
									</a>
								</div>

                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open QR code in new tab"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`}
                    alt="QR code"
                    className="h-10 w-12 rounded-md border border-slate-100"
                  />
                </a>
              </div>

              <div className="mt-3 text-xs text-slate-400">Share options</div>
 
							<div class="grid grid-cols-2 gap-6 max-w-[10rem] mx-auto">
								<button
									onClick={onShareWhatsapp}
									class="p-5 rounded-full backdrop-blur-lg border border-green-500/20 bg-gradient-to-tr shadow-md hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-green-500/50 hover:bg-gradient-to-tr hover:from-green-500/10 group relative overflow-hidden"
								>
									<div
										class="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
									></div>
									<div class="relative z-10">
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="w-7 h-7 text-green-500 fill-current group-hover:text-green-400 transition-colors duration-300" role="img" aria-hidden="true">
											<path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
										</svg>
									</div>
								</button>

								<button
									onClick={onShareEmail}
									class="p-5 rounded-full backdrop-blur-lg border border-red-500/20 bg-gradient-to-tr shadow-md hover:shadow-2xl hover:shadow-red-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-red-500/50 hover:bg-gradient-to-tr hover:from-red-500/1 group relative overflow-hidden"
								>
									<div
										class="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
									></div>
									<div class="relative z-10">
										<Image src={'/gmail.png'} alt='Gmail' height={90} width={90} />
									</div>
								</button>

								<button
									onClick={() => { onCopyLink(); toast('Now paste into Slack or any chat') }}
									class="p-5 rounded-full backdrop-blur-lg border border-yellow-500/20 bg-gradient-to-tr shadow-md hover:shadow-2xl hover:shadow-yellow-500/30 hover:scale-110 hover:-rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-yellow-500/50 hover:bg-gradient-to-tr hover:from-yellow-500/10 group relative overflow-hidden"
								>
									<div
										class="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
									></div>
									<div class="relative z-10">
										<Image src={'/slack.png'} alt='Gmail' height={90} width={90} />
									</div>
								</button>

								<button
									onClick={() => { navigator.share ? navigator.share({ title: 'Interview link', text: formData?.jobPosition || '', url }) : (onCopyLink()) }}
									className="p-5 rounded-full backdrop-blur-lg border border-black/10 bg-gradient-to-tr shadow-md hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 group relative overflow-hidden"
								>
									<div
										class="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
									></div>
									<div class="relative z-10">
										<Image src={'/plus.png'} alt='Gmail' height={90} width={90} />
									</div>
								</button>
							</div>


            </div>

            {/* Small helpers */}
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-80" aria-hidden>
                <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span>Tip: Copy the link and paste into your ATS or communication tool for bulk invites.</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-slate-100 dark:border-slate-700"></div>

        {/* Bottom actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <div>
                <Button variant="outline">
                  <LucideMoveLeft className="mr-0" /> Back to dashboard
                </Button>
              </div>
            </Link>

            <Link href="/dashboard/create-interview">
              <div>
                <Button>
                  <Plus className="mr-0" /> Create new interview
                </Button>
              </div>
            </Link>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400">Valid for <strong className="text-slate-800 dark:text-slate-200">30 days</strong> • Expires on {expiresOn}</div>
        </div>
      </div>
    </div>
  )
}