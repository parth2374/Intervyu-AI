'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import APIDocumentationSection from './_components/ApiDocumentationSection';

export default function Developer() {
  const [name, setName] = useState('My First Key');
  const [ownerId, setOwnerId] = useState('admin');
  const [scopes, setScopes] = useState('create:interview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [keyShown, setKeyShown] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedKey(null);
    setCopied(false);

    try {
      const body = {
        name: name || null,
        ownerId: ownerId || null,
        scopes: scopes.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch('/api/admin/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.error || json?.message || 'Failed to create API key');
      }

      // Expecting { apiKey: 'sk_..', id: '...' }
      const apiKey = json.apiKey ?? json.key ?? json?.apiKeyReturn ?? null;
      if (!apiKey) throw new Error('No key returned from server');

      setGeneratedKey(apiKey);
      setKeyShown(true);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!generatedKey) return;
    try {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy failed', err);
      setError('Copy failed — please copy manually');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Developer Keys</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Generate server API keys for your integrations. Secrets are shown <strong>only once</strong> — copy and store them safely.
            </p>

            <form onSubmit={handleGenerate} className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="col-span-1 sm:col-span-1 flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Key name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My App Key"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="col-span-1 sm:col-span-1 flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Owner ID</span>
                <input
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  placeholder="owner-id (user or org)"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <label className="col-span-1 sm:col-span-1 flex flex-col">
                <span className="text-xs text-slate-500 mb-1">Scopes (comma separated)</span>
                <input
                  value={scopes}
                  onChange={(e) => setScopes(e.target.value)}
                  placeholder="create:interview,read:interview"
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-300"
                />
              </label>

              <div className="col-span-1 sm:col-span-3 mt-2 flex gap-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow hover:brightness-105 disabled:opacity-60"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : (
                    'Generate API Key'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => { setName(''); setOwnerId(''); setScopes(''); setError(null); setGeneratedKey(null); setKeyShown(false); }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-sm"
                >
                  Reset
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 text-sm text-red-500">{error}</div>
            )}
          </div>

          <div className="hidden md:block w-64">
            <div className="p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-medium">Tips</h3>
              <ul className="mt-2 text-xs text-slate-500 space-y-2">
                <li>Use server-side only for this key.</li>
                <li>Store the key in your environment variables.</li>
                <li>Rotate & revoke compromised keys immediately.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Generated key area */}
        {keyShown && generatedKey && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-6">
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-amber-800 dark:text-amber-200">Secret (shown only once)</div>
                <div className="mt-2 font-mono text-sm bg-white dark:bg-slate-900 px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 break-words">
                  {generatedKey}
                </div>
                <div className="mt-2 text-xs text-slate-500">Copy this now — you will not be able to see it again after leaving this page.</div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button onClick={handleCopy} className="px-3 py-2 rounded-md bg-slate-800 text-white font-medium hover:brightness-105">
                  {copied ? 'Copied!' : 'Copy Key'}
                </button>

                <button onClick={() => { setKeyShown(false); setGeneratedKey(null); }} className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </motion.div>

      <div className="mt-6 text-xs mb-6 text-slate-500">* Manage secure API keys that allow external platforms to connect with <code>Intervyu AI</code>.</div>

      <APIDocumentationSection />
    </div>
  );
}