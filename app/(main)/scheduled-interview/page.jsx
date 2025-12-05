'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAuthContext } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import InterviewCard from '../dashboard/_components/InterviewCard'
import { Loader, Video, RefreshCw, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ScheduledInterview() {
  const { user } = useAuthContext()
  const [interviewList, setInterviewList] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // UI controls
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // all | withFeedback | withoutFeedback
  const [sort, setSort] = useState('newest') // newest | oldest

  const router = useRouter()
  const searchTimer = useRef(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth')
    }
  }, [user, router])

  useEffect(() => {
    if (user) fetchInterviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Debounced search: re-fetch with small delay for better UX
  useEffect(() => {
    if (!user) return
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      fetchInterviews()
    }, 350)
    return () => clearTimeout(searchTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, sort])

  const fetchInterviews = async () => {
    setLoading(true)
    try {
      // base query
      let q = supabase
        .from('Interviews')
        .select('id, jobPosition, jobDescription, duration, interview_id, created_at, Interview_Feedback ( userEmail )')
        .eq('userEmail', user?.email)

      // simple text search on jobPosition using ilike (Postgres ILIKE)
      if (query && query.trim().length > 0) {
        q = q.ilike('jobPosition', `%${query}%`)
      }

      // run query
      const result = await q.order('id', { ascending: sort === 'oldest' }).limit(200)
      const rows = result?.data || []

      // apply filter client-side for feedback count if supabase doesn't support nested filters easily
      const filtered = rows.filter((r) => {
        const hasFeedback = Array.isArray(r?.Interview_Feedback) && r.Interview_Feedback.length > 0
        if (filter === 'withFeedback') return hasFeedback
        if (filter === 'withoutFeedback') return !hasFeedback
        return true
      })

      setInterviewList(filtered)
    } catch (err) {
      console.error('Failed to fetch interviews', err)
      toast.error('Failed to load interviews')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchInterviews()
  }

  const totalInterviews = useMemo(() => interviewList.length, [interviewList])
  const totalFeedback = useMemo(
    () =>
      interviewList.reduce((acc, it) => {
        const len = Array.isArray(it?.Interview_Feedback) ? it.Interview_Feedback.length : 0
        return acc + len
      }, 0),
    [interviewList]
  )

  const exportCSV = () => {
    if (!interviewList || interviewList.length === 0) {
      toast('No interviews to export')
      return
    }
    const header = ['Interview ID', 'Job Position', 'Duration', 'Created At', 'Feedback Count']
    const rows = interviewList.map((r) => [
      r.interview_id,
      `"${(r.jobPosition || '').replace(/"/g, '""')}"`,
      r.duration || '',
      r.created_at || '',
      Array.isArray(r.Interview_Feedback) ? r.Interview_Feedback.length : 0,
    ])
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interviews_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast.success('Export started')
  }

  const handleCreate = () => router.push('/dashboard/create-interview')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col mt-5 md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Interview List & Feedback</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review interviews and candidate feedback. Search, filter or export results.
          </p>
          <div className="mt-3 flex gap-3 text-xs text-slate-600">
            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <Video className="h-4 w-4" /> <strong>{totalInterviews}</strong> interviews
            </div>
            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <Loader className="h-4 w-4" /> <strong>{totalFeedback}</strong> total feedback
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center w-full md:w-auto">
          {/* <div className="flex-1 min-w-0">
            <Input
              placeholder="Search job title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search interviews"
            />
          </div> */}

          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium shadow-sm">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="withFeedback">With feedback</SelectItem>
                <SelectItem value="withoutFeedback">Without feedback</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-40 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom dropdown icon */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-4 w-4 text-slate-500 dark:text-slate-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <Button variant="outline" onClick={handleRefresh} aria-label="Refresh">
              {refreshing ? <Loader className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>

            <Button variant="ghost" onClick={exportCSV} aria-label="Export CSV">
              <Download className="h-4 w-4" /> Export
            </Button>

            <Button onClick={handleCreate} className="ml-1">
              <Plus className='h-4 w-4' /> Create
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main>
        {loading ? (
          // Skeleton grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse p-5 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm h-40" />
            ))}
          </div>
        ) : interviewList && interviewList.length == 0 ? (
          // Empty state (improved)
          <div className="mt-6 p-8 rounded-2xl border border-dashed border-slate-400 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-900 text-center">
            <div className="mx-auto max-w-lg">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 shadow-md">
                <svg className="h-12 w-12 text-slate-400" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 21H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <h2 className="mt-6 text-xl font-semibold">No interviews yet</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create your first interview and invite candidates — feedback will appear here as candidates complete interviews.</p>

              <div className="mt-6 flex justify-center gap-3">
                <Link href="/dashboard/create-interview">
                  <div>
                    <Button className="px-6 py-3">+ Create Interview</Button>
                  </div>
                </Link>

                <Button variant="outline" onClick={handleRefresh}>
                  {refreshing ? <Loader className="animate-spin mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />} Retry
                </Button>
              </div>

              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Tip: Use the <strong>Export</strong> button to download a CSV of interviews once you have data.
              </div>
            </div>
          </div>
        ) : (
          // Cards grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {interviewList.map((interview, index) => (
              <InterviewCard interview={interview} viewDetail={true} key={interview?.interview_id || index} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}