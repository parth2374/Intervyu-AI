"use client"

import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import moment from "moment"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Check,
  Copy,
  Send,
  MoreHorizontal,
  Calendar,
  Clock,
  Users,
  Share2,
  ListCollapseIcon,
} from "lucide-react"
import { toast } from "sonner"

const InterviewCard = ({ interview, viewDetail = false, showCandidate = true }) => {
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const url = `${process.env.NEXT_PUBLIC_HOST_URL || ""}/${interview?.interview_id}`

  useEffect(() => {
    console.log("Interview from interview card")
    console.log(interview)
  }, [interview])

  // parse interview.type safely into an array of strings
  const types = useMemo(() => {
    const t = interview?.type
    if (!t) return []

    // if the field already is an array, return it
    if (Array.isArray(t)) return t.map(String)

    // if it's a string try to parse JSON like '["Behavioral"]'
    if (typeof t === "string") {
      try {
        const parsed = JSON.parse(t)
        if (Array.isArray(parsed)) return parsed.map(String)
        if (parsed) return [String(parsed)]
      } catch (e) {
        // fallback: try to clean up a bracketed string like '["Behavioral"]' or 'Behavioral'
        const cleaned = t.replace(/^\[|\]$/g, "") // remove outer brackets
        return cleaned
          .split(",")
          .map(s => s.replace(/^"|"$/g, "").trim())
          .filter(Boolean)
      }
    }

    // final fallback: coerce to string
    return [String(t)]
  }, [interview?.type])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      toast.error("Copy failed")
    }
  }

  const onSend = () => {
    const email = "parthbansal2374@gmail.com"
    const subject = encodeURIComponent("Intervyu AI Interview Link")
    const body = encodeURIComponent(`Interview Link: ${url}`)

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`
    window.open(gmailWebUrl, "_blank")
  }

  const getInitials = (str) => {
    if (!str) return "I"
    const parts = String(str).trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  const when = moment(interview?.created_at).format("DD MMM, YYYY")
  const candidatesCount = interview?.Interview_Feedback?.length || 0

  return (
    <article className="relative group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5 shadow-sm transition-shadow duration-200">
      {/* Top: avatar + meta + actions */}
      <div className="flex flex-col items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-indigo-500 to-pink-500 text-lg flex-shrink-0">
            {getInitials(interview?.jobPosition || interview?.companyName || interview?.interview_id)}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold truncate">{interview?.jobPosition || "Untitled Role"}</h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-300 truncate">
              {/* <span className="truncate">{interview?.companyName || "Self-hosted"}</span>
              <span aria-hidden className="mx-1">•</span> */}
              <time dateTime={interview?.created_at}>{when}</time>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between w-full gap-2">
          <div className="hidden sm:flex items-center gap-3 text-sm text-slate-500 dark:text-slate-300">
            <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-full border border-slate-100 dark:border-slate-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-xs">{interview?.duration || "10m"}</span>
            </div>

            <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-700">
              <Users className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-xs text-emerald-700 dark:text-emerald-200">{candidatesCount} candidates</span>
            </div>
          </div>

          {/* actions: menu */}
          <div className="relative">
            <div
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg p-2 transition-colors"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <div className="space-y-2 transition-all duration-300 ease-in-out">
                <span
                  className={`block h-1 w-8 rounded-full bg-slate-500 dark:bg-white transition-transform duration-300 ease-in-out ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                ></span>
                <span
                  className={`block h-1 w-6 rounded-full bg-orange-500 transition-all duration-300 ease-in-out ${
                    menuOpen ? "w-8 -translate-y-1.5 -rotate-45" : ""
                  }`}
                ></span>
              </div>
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-md py-1 z-20">
                <button onClick={copyLink} className="w-full text-left cursor-pointer px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm flex items-center gap-2">
                  {copied ? <><Check className="h-4 w-4" /> Copied</> : <><Copy className="h-4 w-4" /> Copy link</>}
                </button>
                <button onClick={onSend} className="w-full cursor-pointer text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Share via email
                </button>
                <Link href={`/scheduled-interview/${interview?.interview_id}/details`}>
                  <div className="px-3 py-2 flex gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm"><ListCollapseIcon className="h-4 w-4" /> View details</div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle: description / tags */}
      <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
        {interview?.jobDescription ? (
          <p className="line-clamp-3">{interview?.jobDescription}</p>
        ) : (
          <p className="text-slate-500">No description provided — use the interview editor to add context and notes.</p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {(types.length ? types : (interview?.tags || ["AI", "Screening"])).slice(0, 4).map((t, idx) => (
            <span key={idx} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-700 dark:text-slate-200">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom: actions */}
      <div className="mt-5 flex items-center gap-3">
        {!viewDetail ? (
          <>
            <Button variant="outline" onClick={copyLink} className="flex-1 min-w-0">
              {copied ? (
                <div className="flex items-center gap-2 justify-center"><Check /> Copied</div>
              ) : (
                <div className="flex items-center gap-2 justify-center"><Copy /> Copy link</div>
              )}
            </Button>

            <Button onClick={onSend} className="w-36"><Send /> Send</Button>
          </>
        ) : (
          <Link href={`/scheduled-interview/${interview?.interview_id}/details`} className="w-full">
            <div className="w-full"><Button variant="outline" className="w-full">View detail <ArrowRight /></Button></div>
          </Link>
        )}
      </div>

      {/* subtle footer */}
      <div className="mt-4 text-xs text-slate-400">Interview ID: <span className="font-mono">{interview?.interview_id}</span></div>
    </article>
  )
}

export default InterviewCard