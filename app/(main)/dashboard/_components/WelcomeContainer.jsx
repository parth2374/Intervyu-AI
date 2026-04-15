'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/app/provider'
import { ChevronDown, Moon, Sun, Settings, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/services/supabaseClient'

const WelcomeContainer = () => {
  const { user } = useAuthContext()
  const [interviewList, setInterviewList] = useState([])
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [loading, setLoading] = useState(false)

  const name = user?.name || user?.user_metadata?.full_name || user?.email?.split?.('@')?.[0] || 'User'
  const email = user?.email || user?.user_metadata?.email || ''
  const picture = user?.picture || user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  // useEffect(() => {
  //   if (user) fetchInterviews()
  // }, [user])

  // const fetchInterviews = async () => {
  //   setLoading(true)
  //   try {
  //     // base query
  //     let q = supabase
  //       .from('Interviews')
  //       .select('id, jobPosition, duration, interview_id, created_at, Interview_Feedback ( userEmail )')
  //       .eq('userEmail', user?.email)

  //     // simple text search on jobPosition using ilike (Postgres ILIKE)
  //     if (query && query.trim().length > 0) {
  //       q = q.ilike('jobPosition', `%${query}%`)
  //     }

  //     // run query
  //     const result = await q.order('id', { ascending: sort === 'oldest' }).limit(200)
  //     const rows = result?.data || []

  //     // apply filter client-side for feedback count if supabase doesn't support nested filters easily
  //     const filtered = rows.filter((r) => {
  //       const hasFeedback = Array.isArray(r?.Interview_Feedback) && r.Interview_Feedback.length > 0
  //       if (filter === 'withFeedback') return hasFeedback
  //       if (filter === 'withoutFeedback') return !hasFeedback
  //       return true
  //     })

  //     setInterviewList(filtered)
  //   } catch (err) {
  //     console.error('Failed to fetch interviews', err)
  //     toast.error('Failed to load interviews')
  //   } finally {
  //     setLoading(false)
  //     setRefreshing(false)
  //   }
  // }

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const initials = useMemo(() => {
    const parts = String(name).trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }, [name])

  const logoutHandler = async () => {
    try {
      await firebaseSignOut(auth);
      toast.success("Signed out");
      router.push("/auth");
    } catch (err) {
      console.error("sign out error:", err);
      toast.error("Failed to sign out");
    }
  }

  const toggleTheme = () => {
    setDark((v) => !v)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="w-full rounded-xl overflow-hidden!
      bg-gradient-to-r from-white/60 via-slate-50 to-white/60
      dark:from-slate-800/40 dark:via-slate-900/30 dark:to-slate-800/40
      border-slate-200 dark:border-slate-700 shadow-md dark:[box-shadow:0_2px_10px_rgba(0,0,0,0.6),0_0_2px_rgba(255,255,255,0.1)] p-5 border
      flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left: Greeting + subtitle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-extrabold truncate text-slate-900 dark:text-slate-100">
                {greeting}, <span className="text-indigo-600 dark:text-indigo-400">{name.split(' ')[0]}</span>
              </h2>
              <span className="ml-2 inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 font-medium dark:bg-indigo-900/40 dark:text-indigo-200">
                AI Interviews
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300 truncate flex-wrap">
              AI-Driven Interviews · Saves Time · Hire Smarter
            </p>
          </div>
        </div>

        {/* KPI chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <StatChip label="Saved Interviews" value="8" />
          <StatChip label="Drafts" value="2" tone='red' />
          <StatChip label="Scheduled" value="3" tone="accent" />
        </div>
      </div>

      {/* Right: Profile + theme toggle */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard/create-interview')}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700"
          >
            + New Interview
          </button>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="inline-flex items-center justify-center rounded-md p-2 border border-transparent hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600"
        >
          {dark ? <Sun className="h-4 w-4 text-slate-800 dark:text-slate-200" /> : <Moon className="h-4 w-4 text-slate-600 dark:text-slate-200" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={open}
            className="flex items-center gap-3 bg-white dark:bg-slate-900 py-1 px-2 rounded-full border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md focus:outline-none"
          >
            {/* Avatar (image or initials fallback) */}
            {picture ? (
              <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-slate-100 dark:ring-slate-700">
                <Image src={picture} alt={name} width={40} height={40} className="object-cover" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {initials}
              </div>
            )}

            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-400 truncate">{email}</span>
            </div>

            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''} text-slate-500 dark:text-slate-300`} />
          </button>

          {/* Dropdown */}
          {open && (
            <div
              role="menu"
              aria-label="Profile menu"
              className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-30 dark:bg-slate-800 dark:border-slate-700"
            >
              <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400">Signed in as</div>
              <div className="px-4 py-2">
                <div className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">{name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-400 truncate">{email}</div>
              </div>
              <div className="border-t border-slate-100 my-1 dark:border-slate-700"></div>

              <button
                onClick={() => router.push('/settings')}
                className="w-full text-left cursor-pointer px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <Settings className="h-4 w-4 text-slate-500 dark:text-slate-300" /> Settings
              </button>

              <button
                onClick={logoutHandler}
                className="w-full cursor-pointer text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* Small stat chip used inside header */
const StatChip = ({ label, value, tone = 'muted' }) => {
  const toneClass =
    tone === 'accent'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
      : tone === 'red'
      ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      : 'bg-slate-50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-200'

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${toneClass} border border-slate-100 dark:border-slate-700`}>
      <span className="text-xs opacity-80">{label}</span>
      <span className="inline-flex items-center justify-center bg-white/60 dark:bg-white/5 px-2 py-0.5 rounded-full text-xs font-semibold">{value}</span>
    </div>
  )
}

export default WelcomeContainer