// "use client"

// import { Button } from '@/components/ui/button'
// import axios from 'axios'
// import { Loader2, Loader2Icon } from 'lucide-react'
// import React, { useEffect, useRef, useState } from 'react'
// import { toast } from 'sonner'
// import QuestionListContainer from './QuestionListContainer'
// import { supabase } from '@/services/supabaseClient'
// import { useAuthContext } from '@/app/provider'
// import { v4 as uuidv4 } from 'uuid'

// const QuestionList = ({ formData, onCreateLink }) => {

// 	const { user } = useAuthContext()

// 	const [loading, setLoading] = useState(true)
// 	const [questionList, setQuestionList] = useState()
// 	const [saveLoading, setSaveLoading] = useState(false)

// 	const hasCalledAPI = useRef(false)

// 	const onFinish = async () => {
// 		setSaveLoading(true)
// 		const interview_id = uuidv4()
// 		const { data, error } = await supabase
// 		  .from('Interviews')
// 		  .insert([
// 		    {
// 					...formData,
// 					questionList: questionList,
// 					userEmail: user?.email,
// 					interview_id: interview_id
// 				},
// 		  ])
// 		  .select()

// 		// Update user credits
// 		const userUpdate = await supabase
// 			.from('Users')
// 			.update({ credits: Number(user?.credits) - 1 })
// 			.eq('email', user?.email)
// 			.select()
// 		console.log(userUpdate)

// 		setSaveLoading(false)

// 		onCreateLink(interview_id)
// 	}

// 	useEffect(() => {
// 		if (formData && !hasCalledAPI.current) {
// 			hasCalledAPI.current = true
// 			GenerateQuestionList()
// 		}
// 	}, [formData])

// 	const GenerateQuestionList = async () => {
// 		setLoading(true)
// 		try {
// 			const result = await axios.post('/api/ai-model', {
// 				...formData
// 			})
// 			console.log("Content field from api")
// 			console.log(result.data.content)
// 			const Content = result.data.content
// 			const FINAL_CONTENT = Content.replace('```', '').replace('json', '').replace('```', '')
// 			console.log("Cleaned and final content to be converted to json")
// 			console.log(FINAL_CONTENT)
// 			setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions)
// 			setLoading(false)
// 		} catch (e) {
// 			toast('Server Error, Try Again!')
// 			setLoading(false)
// 		}
// 	}

// 	return (
// 		<div>
// 			{loading &&
// 				<div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
// 					<Loader2Icon className='animate-spin w-20 h-20 md:w-16 md:h-16 lg:w-7 lg:h-7' />
// 					<div>
// 						<h2 className='font-medium'>Generating Interview Questions...</h2>
// 						<p className='text-primary'>Our AI is crafting personalized questions based on your Job Position</p>
// 					</div>
// 				</div>
// 			}

// 			{questionList?.length > 0 &&
// 				<div>
// 					<QuestionListContainer questionList={questionList} />
// 				</div>
// 			}

// 			<div className={`flex justify-end mt-10`}>
// 				<Button onClick={() => onFinish()} disabled={saveLoading}>
// 					{saveLoading && <Loader2 className='animate-spin' />}
// 					Create Interview Link
// 				</Button>
// 			</div>
// 		</div>
// 	)
// }

// export default QuestionList

"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw, Download, Check, ArrowRight, X, Copy, MoveRightIcon } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import QuestionListContainer from './QuestionListContainer'
import { supabase } from '@/services/supabaseClient'
import { useAuthContext } from '@/app/provider'
import { v4 as uuidv4 } from 'uuid'

export default function QuestionList({ formData, onCreateLink }) {
  const { user } = useAuthContext()
  const [generating, setGenerating] = useState(false)
  const [questionList, setQuestionList] = useState(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [parsingError, setParsingError] = useState(null)
  const [isCopied, setIsCopied] = useState(false)
  const [showDone, setShowDone] = useState(false)

  const hasCalledAPI = useRef(false)

  useEffect(() => {
    if (formData && !hasCalledAPI.current) {
      hasCalledAPI.current = true
      generateQuestionList()
    }
  }, [formData])

  const cleanAiContent = (raw) => {
    // Remove triple backticks and surrounding text commonly returned by LLMs
    let s = String(raw || '')
    s = s.replace(/```json\s*/g, '')
    s = s.replace(/```/g, '')
    s = s.trim()
    return s
  }

  const generateQuestionList = async () => {
    setGenerating(true)
    setParsingError(null)
    setQuestionList(null)

    console.log("Questions Generated Successfully and below is the form data")
    console.log(formData)

    try {
      const res = await axios.post('/api/ai-model', { ...formData })
      const content = res?.data?.content ?? res?.data ?? ''
      const cleaned = cleanAiContent(content)

      let parsed
      try {
        parsed = JSON.parse(cleaned)
      } catch (e) {
        // Try to extract JSON block with regex
        const match = cleaned.match(/\{[\s\S]*\}/)
        if (match) parsed = JSON.parse(match[0])
        else throw e
      }

      const finalList = parsed?.interviewQuestions ?? parsed ?? []

      if (!Array.isArray(finalList)) {
        throw new Error('Invalid questions format returned from AI')
      }

      setQuestionList(finalList)
      setShowDone(true)
      toast.success('Questions generated')
    } catch (err) {
      console.error(err)
      setParsingError('Failed to generate questions. Try regenerating or tweak the job description.')
      toast.error('Server Error — could not generate questions')
    } finally {
      setGenerating(false)
    }
  }

  const onFinish = async () => {
    if (!questionList || questionList.length === 0) {
      toast('No questions to save')
      return
    }

    if (!user) {
      toast('Please sign in to save the interview')
      return
    }

    // check credits (if available)
    if (typeof user?.credits !== 'undefined' && Number(user.credits) <= 0) {
      toast('Not enough credits to create interview')
      return
    }

    setSaveLoading(true)

    try {
      const interview_id = uuidv4()
      const payload = {
        ...formData,
        questionList,
        userEmail: user.email,
        interview_id,
      }

      const { data, error } = await supabase.from('Interviews').insert([payload]).select()
      if (error) throw error

      // decrement credits (best-effort)
      try {
        await supabase.from('Users').update({ credits: Number(user.credits) - 1 }).eq('email', user.email)
      } catch (e) {
        console.warn('Failed to update credits', e)
      }

      toast.success('Interview saved')
      onCreateLink(interview_id)
    } catch (e) {
      console.error(e)
      toast.error('Failed to save interview')
    } finally {
      setSaveLoading(false)
    }
  }

  const onCopyJSON = async () => {
    if (!questionList) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(questionList, null, 2))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
      toast.success('JSON copied')
    } catch (e) {
      toast.error('Copy failed')
    }
  }

  const onDownload = () => {
    if (!questionList) return
    const blob = new Blob([JSON.stringify(questionList, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(formData?.jobPosition || 'interview').replace(/\s+/g, '_')}_questions.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-white/60 to-slate-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="text-lg font-semibold">Generated Questions</h3>
          <p className="text-sm text-slate-500 mt-1">AI-crafted questions based on your job description. Edit or regenerate if needed.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500">Credits: <span className="font-medium">{user?.credits ?? '—'}</span></div>
          <Button variant="ghost" onClick={generateQuestionList} disabled={generating}>
            {generating ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            <span className="ml-2 hidden sm:inline">Regenerate</span>
          </Button>
        </div>
      </div>

      {/* Generating state */}
      {generating && (
        <div className="p-6 rounded-2xl border border-dashed border-slate-200 bg-white dark:bg-slate-800 flex items-center gap-4">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600" />
          <div>
            <div className="font-medium">Generating questions…</div>
            <div className="text-sm text-slate-500 mt-1">This usually takes 5–12 seconds. Our AI is focusing the questions to the role you provided.</div>
          </div>
        </div>
      )}

      {/* Error */}
      {parsingError && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-100 text-rose-700">
          <div className="flex items-start justify-between">
            <div>{parsingError}</div>
            <Button variant="ghost" onClick={generateQuestionList}><RefreshCw /></Button>
          </div>
        </div>
      )}

      {/* Questions list */}
      {questionList && questionList.length > 0 && (
        <div className="space-y-4">
          <QuestionListContainer questionList={questionList} editable />

          <div className="flex flex-wrap items-center gap-3 justify-end">
            <Button variant="outline" onClick={onCopyJSON}>
              {isCopied ?
								<>
									<Check />
									<span className="ml-1">Copied</span>
								</>
								:
								<>
									<Copy />
									<span className="ml-1">Copy JSON</span>
								</>
							}
            </Button>

            <Button variant="outline" onClick={onDownload}>
              <Download />
              <span className="ml-1">Download</span>
            </Button>

            <Button onClick={onFinish} disabled={saveLoading}>
              {saveLoading ? <Loader2 className="animate-spin" /> : <MoveRightIcon />}
              <span className="ml-1">Create Interview Link</span>
            </Button>
          </div>
        </div>
      )}

      {/* Empty / fallback */}
      {!generating && (!questionList || questionList.length === 0) && !parsingError && (
        <div className="p-5 rounded-xl border border-slate-100 bg-white dark:bg-slate-800 text-center">
          <div className="text-sm text-slate-500">No questions available yet. Click "Regenerate" to try again, or edit the job description to refine results.</div>
          <div className="mt-4 flex justify-center">
            <Button onClick={generateQuestionList}><RefreshCw className="mr-2" /> Regenerate</Button>
          </div>
        </div>
      )}
    </section>
  )
}

// small inline components (icons)
function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m2 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6a2 2 0 012-2h6z" />
    </svg>
  )
}