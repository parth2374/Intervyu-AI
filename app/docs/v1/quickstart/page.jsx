'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check, KeyRound, MoveRight } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark, docco, vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useRouter } from 'next/navigation'

export default function CreateInterviewDocs() {
  const [copied, setCopied] = useState(false)
  const [copiedNpmAxios, setCopiedNpmAxios] = useState(false)
  const [copiedYarnAxios, setCopiedYarnAxios] = useState(false)
  const router = useRouter()

  function doCopy(key, text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(prev => ({ ...prev, [key]: true }))
        setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1800)
      })
    }
  }

  const handleCopyNpmAxios = async () => {
    try {
      await navigator.clipboard.writeText('npm install axios');
      setCopiedNpmAxios(true);
      setTimeout(() => setCopiedNpmAxios(false), 2000); // revert back after 2 sec
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyYarnAxios = async () => {
    try {
      await navigator.clipboard.writeText('yarn add axios');
      setCopiedYarnAxios(true);
      setTimeout(() => setCopiedYarnAxios(false), 2000); // revert back after 2 sec
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const axiosSnippet = `import axios from "axios";

const response = await axios.post(
  "https://yourdomain.com/api/v1/generate-questions",
  {
    jobPosition: "Business Analyst",
    jobDescription: "Experienced Business analyst...",
    duration: "45 min",
    type: ["experience","leadership"]
  },
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    }
  }
);

console.log(response.data);`

  return (
    <main className="max-w-6xl mx-auto mb-12 px-6">
      {/* Hero */}
      <div className="rounded-2xl pt-8 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex">
          <div className="inline-flex items-center gap-3">
            <div>
              <h1 className="text-2xl flex items-center justify-centers gap-2 md:text-3xl font-semibold"><KeyRound className='h-7 w-7' /> Quick Start</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-5xl">
                Get started with the Intervyu AI API in just a few steps. You’ll first create an API key, then install the axios HTTP client, and finally move to making your first request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <section className="mt-3 gap-8">
        {/* Left: main docs */}
        <article className="lg:col-span-2 space-y-8">
          {/* Endpoint */}
          <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between">
              <div>
                <h3 className="text-md font-semibold">Step 1: Create Your API Key</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Generate a personal API key for authentication.</p>
              </div>

              <div className='mt-6'>
                Go to <a href="/developer" className='text-blue-400 underline'>interview.ai/developer</a> and sign in to create your API key.
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Keep this key secret — it’s required for all API requests.</p>
            </div>
          </div>

          <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between">
              <div>
                <h3 className="text-md font-semibold">Step 2: Install Axios</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Use axios for making API requests easily.</p>
              </div>

              <div className="relative mt-4 w-full bg-gray-50 p-4 dark:bg-[#1f2937] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                <Button
                  onClick={handleCopyNpmAxios}
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 text-slate-600"
                >
                  {copiedNpmAxios ? (
                    <>
                      <Check className="h-4 w-4 mr-0" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>

                <div className="inline-flex items-center gap-2 font-mono text-sm">
                  <code className="px-2 py-1 rounded-md">
                    <code className='text-blue-400'>npm install</code> axios
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Or, if you’re using yarn:</p>
            </div>

            <div className="relative mt-4 w-full bg-gray-50 p-4 dark:bg-[#1f2937] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Button
                onClick={handleCopyYarnAxios}
                size="sm"
                variant="ghost"
                className="absolute top-3 right-3 text-slate-600"
              >
                {copiedYarnAxios ? (
                  <>
                    <Check className="h-4 w-4 mr-0" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>

              <div className="inline-flex items-center gap-2 font-mono text-sm">
                <code className="px-2 py-1 rounded-md">
                  <code className='text-blue-400'>yarn add</code> axios
                </code>
              </div>
            </div>
          </div>

          {/* Examples (tabs) */}
          <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col">
              <h3 className="text-md font-semibold">Step 3: Make Your First Request</h3>
              <p className='text-sm text-gray-500 mt-1'>Use your API key and axios to call the Chat API.</p>
            </div>

            <div className="mt-4 relative">
              <div className="absolute top-3 right-3 flex gap-2">
              </div>

              <div className='bg-gray-800 dark:bg-gray-800 rounded-lg'>
                <SyntaxHighlighter
                  language={'jsx'}
                  style={atomDark}
                  showLineNumbers
                  lineNumberStyle={{
                    color: 'rgba(203,213,225,1)',
                    paddingRight: '18px',
                    fontSize: '13px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono", monospace',
                    minWidth: '3.2rem',
                    textAlign: 'right',
                  }}
                  customStyle={{
                    background: 'transparent',
                    padding: '1.4rem 1.6rem',
                    fontSize: '15.5px',
                    lineHeight: 1.7,
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono", monospace',
                    overflowX: 'auto',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale',
                    backfaceVisibility: 'hidden',
                    transform: 'none',
                    color: 'black'
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      letterSpacing: 'normal',
                      whiteSpace: 'pre',
                      color: 'white'
                    }
                  }}
                  wrapLongLines
                >
                  {axiosSnippet}
                </SyntaxHighlighter>
              </div>
              <p>Replace YOUR_API_KEY with the key you created in Step 1.</p>
            </div>
          </div>
        </article>
        <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 mt-8 shadow-sm">
          <div className="flex flex-col items-start justify-between">
            <div>
              <h3 className="text-md font-semibold">Next Steps</h3>
            </div>

            <div className='mt-4 flex justify-between w-full items-center'>
              <p>Now that you’re set up, continue to the <a href="/developer" className='text-blue-400 underline'>Create Interview API Documentation</a> to learn more.</p>
              <Button onClick={() => router.push('/docs/v1/create-interview')}><p className='px-2 flex items-center gap-1.5 py-2'>Next <MoveRight /></p></Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}