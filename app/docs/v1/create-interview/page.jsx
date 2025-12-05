'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark, docco, vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { atomDark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CreateInterviewDocs() {
  const [copied, setCopied] = useState(false)
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [tab, setTab] = useState('fetch') // 'fetch' | 'axios'

  const fetchSnippet = `/* Create headers for the request */
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer YOUR_API_KEY");

/* Prepare the request body */
const raw = JSON.stringify({
  jobPosition: "Senior Frontend Developer",
  jobDescription: "Experienced React developer...",
  duration: "30 minutes",
  type: ["technical","behavioral"]
});

/* Send POST request */
fetch("https://yourdomain.com/api/v1/generate-questions", {
  method: "POST",
  headers: myHeaders,
  body: raw
})
  .then(res => res.json())
  .then(result => console.log(result))
  .catch(err => console.error(err));`

  const axiosSnippet = `import axios from "axios";

const response = await axios.post(
  "https://yourdomain.com/api/v1/generate-questions",
  {
    jobPosition: "Senior Frontend Developer",
    jobDescription: "Experienced React developer...",
    duration: "30 minutes",
    type: ["technical","behavioral"]
  },
  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    }
  }
);

console.log(response.data);`

  const responseExample = `{
  "questions": [
    { "question": "Tell me about yourself...", "type": "Experience" },
    { "question": "Explain React hooks...", "type": "Technical" }
  ],
  "id": "16855a5b-5b35-4341-beea-4f442923dc0b"
}`

  function doCopy(key, text) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(prev => ({ ...prev, [key]: true }))
        setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1800)
      })
    }
  }

  const handleCopyEndpoint = async () => {
    try {
      await navigator.clipboard.writeText('https://intervyu.ai/api/v1/create-interview');
      setCopiedEndpoint(true);
      setTimeout(() => setCopiedEndpoint(false), 2000); // revert back after 2 sec
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const params = [
    { name: 'jobPosition', type: 'string', required: 'Yes', desc: 'Title / role for which questions should be generated.' },
    { name: 'jobDescription', type: 'string', required: 'Yes', desc: 'Full job description — responsibilities, required skills, stack.' },
    { name: 'duration', type: 'string', required: 'Yes', desc: "Interview duration (e.g. '30 min')." },
    { name: 'type', type: 'array[string]', required: 'No', desc: "Array of question types (e.g. ['technical','behavioral'])." }
  ]

  return (
    <main className="max-w-6xl mx-auto mb-12 px-6">
      {/* Hero */}
      <header className="rounded-2xl pt-8 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Generate Questions API</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-5xl">
                Generate interview question lists from a job description — returns a JSON array of questions grouped by type. Best for building interview flows, candidate assessments and auto-generated question banks.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Content grid */}
      <section className="mt-3 gap-8">
        {/* Left: main docs */}
        <article className="lg:col-span-2 space-y-8">
          {/* Endpoint */}
          <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Endpoint</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">POST request to create interview & start question generation</p>
              </div>

              <div className="relative mt-4 w-full bg-gray-50 p-4 dark:bg-[#1f2937] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
                {/* Copy Button */}
                <Button
                  onClick={handleCopyEndpoint}
                  size="sm"
                  variant="ghost"
                  className="absolute top-3 right-3 text-slate-600"
                >
                  {copiedEndpoint ? (
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

                {/* Endpoint Info */}
                <div className="inline-flex items-center gap-2 font-mono text-sm">
                  <span className="px-2 py-1 rounded-md bg-green-100 text-green-800 font-semibold">
                    POST
                  </span>
                  <code className="px-2 py-1 rounded-md">
                    https://intervyu.ai/api/v1/create-interview
                  </code>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Send Job Position, Job Description, Duration and Types (optional). The request is processed asynchronously and returns the generated question list once ready. Interview ID is also created.</p>
            </div>
          </div>

          {/* Request parameters */}
          <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Request Body Parameters</h3>
            <p className='text-sm mt-1 text-gray-500 mb-8'>Parameters required to send a request.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="text-sm text-slate-500 dark:text-slate-400">
                    <th className="pb-2 pr-6">Parameter</th>
                    <th className="pb-2 pr-6">Type</th>
                    <th className="pb-2 pr-6">Required</th>
                    <th className="pb-2">Description</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {params.map(p => (
                    <tr key={p.name} className="border-t dark:border-slate-800">
                      <td className="py-3 font-medium">{p.name}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{p.type}</td>
                      <td className="py-3">{p.required}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-400">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Examples (tabs) */}
          <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Request Examples</h3>
              <div className="inline-flex bg-slate-100 dark:bg-black rounded-md p-1">
                <button onClick={() => setTab('fetch')} className={`px-3 py-1 rounded-md text-sm ${tab === 'fetch' ? 'bg-white dark:bg-blue-400 shadow-sm' : ''}`}>Fetch</button>
                <button onClick={() => setTab('axios')} className={`px-3 py-1 rounded-md text-sm ${tab === 'axios' ? 'bg-white dark:bg-blue-400 shadow-sm' : ''}`}>Axios</button>
              </div>
            </div>

            <div className="mt-4 relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => doCopy(tab === 'fetch' ? 'fetch-snippet' : 'axios-snippet', tab === 'fetch' ? fetchSnippet : axiosSnippet)}
                  className="inline-flex text-black items-center gap-2 rounded-md px-3 py-1 bg-slate-100 hover:bg-slate-200 transition"
                >
                  {copied[tab === 'fetch' ? 'fetch-snippet' : 'axios-snippet'] ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />} <span className="text-sm">{copied[tab === 'fetch' ? 'fetch-snippet' : 'axios-snippet'] ? 'Copied' : 'Copy'}</span>
                </button>
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
                  {tab === 'fetch' ? fetchSnippet : axiosSnippet}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>

          {/* Response & Errors */}
          <div className="gap-4">
            <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-0">Response</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">On success, the API returns the generated questions and the job status.</p>
              <pre className="rounded-md bg-[#f5f2f0] dark:bg-slate-800 text-black dark:text-white p-4 overflow-auto text-sm"><code>{responseExample}</code></pre>
            </div>

            <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-6 mt-8 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Error Codes</h3>
              <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc ml-5 space-y-1">
                <li><strong>401</strong> — No token / Invalid API token</li>
                <li><strong>402</strong> — Not enough credits</li>
                <li><strong>400</strong> — Invalid request body</li>
                <li><strong>500</strong> — Internal Server Error (question generation failed)</li>
              </ul>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}