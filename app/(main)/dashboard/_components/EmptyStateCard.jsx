'use client'

import React from 'react'
import { Video, Sparkles, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

/**
 * EmptyStateCard
 * Props:
 *  - onCreate: function called when user clicks Create (defaults to navigate to create page)
 */
export default function EmptyStateCard({ onCreate } = {}) {
  const router = useRouter()
  const handleCreate = onCreate ?? (() => router.push('/dashboard/create-interview'))

  return (
    <div
      role="region"
      aria-label="No interviews created"
      className="
        w-full mx-auto p-6 flex flex-col items-center gap-4
        rounded-2xl
        bg-gradient-to-br from-white/80 via-slate-50 to-white/80
        dark:from-slate-900/60 dark:via-slate-800/50 dark:to-slate-900/60
        border border-slate-200 dark:border-slate-800
        shadow-md transform-gpu transition-all duration-300
      "
    >
      {/* Icon badge */}
      <div className="relative">
        <div
          className="
            rounded-full p-4
            bg-gradient-to-tr from-indigo-500 to-pink-500
            shadow-lg
            transform transition-transform duration-400 hover:scale-105
          "
          aria-hidden="true"
        >
          <Video className="h-8 w-8 text-white" />
        </div>

        <span
          className="
            absolute -bottom-2 -right-2 inline-flex items-center gap-1 text-xs font-semibold
            rounded-full px-2 py-0.5 bg-amber-500 text-white shadow-sm
          "
        >
          <Sparkles className="h-3 w-3" />
          New
        </span>
      </div>

      {/* Heading + description */}
      <h2 className="text-center text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
        You don't have any interviews created
      </h2>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 max-w-md">
        Create an AI interview, auto-generate relevant questions, schedule candidates and collect automated feedback — all in one place.
      </p>

      {/* CTA group */}
      <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full justify-center">
        <div className="flex flex-col w-full sm:w-auto sm:flex-row p-4">
          <a href="/dashboard/create-interview"
              className="flex flex-row items-center justify-center w-full px-4 py-4 mb-4 text-sm font-bold bg-blue-300 leading-6 capitalize duration-100 transform rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none sm:mb-0 sm:w-auto sm:mr-4 md:pl-8 md:pr-6 xl:pl-12 xl:pr-10   hover:shadow-lg hover:-translate-y-1">
              Create New Interview
              <span className="ml-4">
                  <MoveRight />
              </span>
          </a>

          <a href=""
              className="flex items-center justify-center w-full px-4 py-4 text-sm font-bold leading-6 capitalize duration-100 transform border-2 rounded-sm cursor-pointer border-blue-300 focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:outline-none sm:w-auto sm:px-6 border-text  hover:shadow-lg hover:-translate-y-1">
              See Features
          </a>
        </div>
      </div>

      {/* subtle helper text */}
      <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
        Tip: You can also import interview templates to speed things up.
      </div>
    </div>
  )
}