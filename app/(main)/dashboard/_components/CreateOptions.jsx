'use client'

import React from 'react'
import Link from 'next/link'
import { Video, Phone, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

const CreateOptions = () => {
  const options = [
    {
      id: 'ai-interview',
      title: 'Create AI Interview',
      description: 'Design roles, auto-generate questions, schedule and invite candidates.',
      href: '/dashboard/create-interview',
      icon: <Video className="h-7 w-7" fill='#4f39f6' />,
      tags: ['Auto questions', 'Scheduling', 'Feedback'],
    },
    {
      id: 'phone-screen',
      title: 'Phone Screening Call',
      description: 'Quick voice screens to pre-filter candidates — lightweight and fast.',
      onClick: () => toast('Devs working on phone screening call feature!'),
      icon: <Phone className="h-7 w-7" fill='#4f39f6' />,
      comingSoon: true,
      tags: ['Voice', 'Short'],
    },
  ]

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {options.map((opt) =>
        opt.href ? (
          <Link key={opt.id} href={opt.href} className="group" prefetch={false}>
            <div
              className="
                block transform-gpu transition
                hover:-translate-y-1 hover:shadow-md
                rounded-2xl p-6
                bg-gradient-to-br from-white/60 to-slate-50
                border border-slate-100 shadow-sm
                dark:from-slate-800/40 dark:to-slate-900/30
                dark:border-slate-700 dark:shadow-[0_8px_30px_rgba(2,6,23,0.6)]
              "
            >
              <CardContent show={true} opt={opt} />
            </div>
          </Link>
        ) : (
          <button
            key={opt.id}
            onClick={opt.onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                opt.onClick?.()
              }
            }}
            className="
              w-full text-left transform-gpu transition
              hover:-translate-y-1 hover:shadow-md cursor-pointer
              rounded-2xl p-6
              bg-white border border-slate-100 shadow-sm
              dark:bg-transparent dark:[--card-bg:theme(colors.slate.800/0.32)]
              dark:border-slate-700 dark:shadow-[0_8px_30px_rgba(2,6,23,0.6)]
            "
            aria-label={opt.title + (opt.comingSoon ? ' — coming soon' : '')}
          >
            <div className="relative">
              {opt.comingSoon && (
                <span className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 dark:bg-amber-900/20 dark:text-amber-300">
                  Coming soon
                </span>
              )}
              <CardContent show={false} opt={opt} />
            </div>
          </button>
        )
      )}
    </section>
  )
}

const CardContent = ({ opt, show = true }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
      <div className="flex-shrink-0">
        <div
          className="
            h-14 w-14 rounded-lg flex items-center justify-center
            bg-gradient-to-br from-indigo-50 to-indigo-100 ring-1 ring-slate-100
            dark:from-indigo-900/20 dark:to-indigo-800/10 dark:ring-slate-700
          "
        >
          {/* icon inherits color from parent */}
          <div className="text-indigo-600 dark:text-indigo-300">{opt.icon}</div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold truncate text-slate-900 dark:text-slate-100">{opt.title}</h3>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            {show &&
              <>
                <span className="text-xs text-slate-400 dark:text-slate-400">— quick action</span>
                <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              </>
            }
          </div>
        </div>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300 truncate">{opt.description}</p>

        {opt.tags && (
          <div className="mt-3 flex flex-wrap gap-2">
            {opt.tags.map((t) => (
              <span
                key={t}
                className="
                  inline-flex items-center gap-2 text-xs px-2 py-0.5 rounded-full
                  bg-slate-100 text-slate-700 border border-slate-200
                  dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700
                "
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4">
          {/* subtle CTA */}
          <div className="inline-flex items-center gap-2 text-sm font-medium">
            <span className="underline decoration-indigo-200 decoration-2 underline-offset-2 text-indigo-600 dark:text-indigo-400">
              Start
            </span>
            <span className="text-slate-400 dark:text-slate-400">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOptions