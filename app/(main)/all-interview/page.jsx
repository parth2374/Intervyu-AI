"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuthContext } from "@/app/provider";
import { supabase } from "@/services/supabaseClient";
import InterviewCard from "../dashboard/_components/InterviewCard";
import {
  Loader,
  Video,
  RefreshCw,
  Download,
  Search as SearchIcon,
  Users,
  FilePlus,
  PlusCircle,
  Sparkles,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AllInterview() {
  const { user } = useAuthContext();
  const router = useRouter();

  // data + UI state
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 9;

  // controls
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all | withFeedback | withoutFeedback
  const [sort, setSort] = useState("newest"); // newest | oldest

  // helpers
  const searchTimer = useRef(null);
  const mounted = useRef(false);
  const totalCount = interviewList.length;
  const totalFeedback = useMemo(
    () =>
      interviewList.reduce((acc, it) => {
        const len = Array.isArray(it?.Interview_Feedback) ? it.Interview_Feedback.length : 0
        return acc + len
      }, 0),
    [interviewList]
  )

  // ensure auth
  useEffect(() => {
    if (!user) router.push("/auth");
  }, [user, router]);

  // initial load when user becomes available
  useEffect(() => {
    if (user) {
      resetAndFetch();
      mounted.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // debounced search / controls
  useEffect(() => {
    if (!mounted.current) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      resetAndFetch();
    }, 350);
    return () => clearTimeout(searchTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, sort]);

  async function fetchPage(pageNumber = 0, append = false) {
    setLoading(true);
    try {
      const start = pageNumber * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      let q = supabase
        .from("Interviews")
        .select(
          "id, jobPosition, jobDescription, duration, interview_id, created_at, Interview_Feedback ( userEmail )",
          {
            count: "exact",
          }
        )
        .eq("userEmail", user?.email);

      // server-side ilike search if query provided
      if (query && query.trim().length > 0) {
        q = q.ilike("jobPosition", `%${query}%`);
      }

      // ordering
      q = q.order("id", { ascending: sort === "oldest" }).range(start, end);

      const result = await q;
      if (result.error) throw result.error;
      let rows = result.data || [];

      // apply filter client-side for feedback existence if necessary
      if (filter === "withFeedback" || filter === "withoutFeedback") {
        rows = rows.filter((r) => {
          const hasFeedback =
            Array.isArray(r?.Interview_Feedback) &&
            r.Interview_Feedback.length > 0;
          return filter === "withFeedback" ? hasFeedback : !hasFeedback;
        });
      }

      if (append) {
        setInterviewList((prev) => [...prev, ...rows]);
      } else {
        setInterviewList(rows);
      }
    } catch (err) {
      console.error("Fetch interviews failed", err);
      toast.error("Failed to load interviews");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function resetAndFetch() {
    setPage(0);
    setInterviewList([]);
    fetchPage(0, false);
  }

  async function handleLoadMore() {
    const next = page + 1;
    setPage(next);
    await fetchPage(next, true);
  }

  async function handleRefresh() {
    setRefreshing(true);
    resetAndFetch();
  }

  function exportCSV() {
    if (!interviewList || interviewList.length === 0) {
      toast("No interviews to export");
      return;
    }
    const header = [
      "Interview ID",
      "Job Position",
      "Duration",
      "Created At",
      "Feedback Count",
    ];
    const rows = interviewList.map((r) => [
      r.interview_id,
      `"${(r.jobPosition || "").replace(/"/g, '""')}"`,
      r.duration || "",
      r.created_at || "",
      Array.isArray(r.Interview_Feedback) ? r.Interview_Feedback.length : 0,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interviews_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Export started");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex mt-5 flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">All Created Interviews</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your interview templates, view feedback and share interview
            links.
          </p>

          <div className="mt-3 flex gap-3 text-xs text-slate-600">
            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <Video className="h-4 w-4" /> <strong>{totalCount}</strong> shown
            </div>
            <div className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 shadow-sm">
              <Loader className="h-4 w-4" />{" "}
              <strong>{totalFeedback}</strong>{" "}
              feedbacks
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 items-center w-full md:w-auto">
          {/* <div className="relative flex-1 min-w-0">
            <Input
              placeholder="Search job title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
              aria-label="Search interviews"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
          </div> */}

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

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleRefresh}
            aria-label="Refresh"
          >
            {refreshing ? (
              <Loader className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>

          <Button variant="ghost" onClick={exportCSV} aria-label="Export CSV">
            <Download className="h-4 w-4" /> Export
          </Button>

          <Link href="/dashboard/create-interview">
            <div>
              <Button className="ml-1"><Plus className="w-4 h-4" /> Create</Button>
            </div>
          </Link>
        </div>
      </div>

      {/* Content */}
      <main>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-5 rounded-2xl border bg-white dark:bg-slate-800 shadow-sm h-44"
              />
            ))}
          </div>
        ) : interviewList && interviewList.length === 0 ? (
          <div className="mt-6 p-8 rounded-3xl border border-dashed border-slate-400 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-center shadow-sm">
            <div className="mx-auto max-w-lg">
              {/* floating illustration */}
              <div className="mx-auto relative h-32 w-32 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 shadow-md">
                <div className="absolute -top-3 -left-3 rounded-full bg-amber-100 dark:bg-amber-900/40 p-1 animate-bounce">
                  <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-300" />
                </div>

                <svg
                  className="h-16 w-16 text-slate-600 dark:text-slate-300"
                  viewBox="0 0 48 48"
                  fill="none"
                  aria-hidden
                >
                  <rect
                    x="6"
                    y="10"
                    width="36"
                    height="28"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M14 18h20M14 24h20M14 30h12"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="36" cy="14" r="2" fill="currentColor" />
                </svg>
              </div>

              <h2 className="mt-6 text-xl font-semibold text-slate-900 dark:text-slate-50">
                No interviews yet
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Create your first interview to see it listed here. Candidate
                feedback will appear on each interview card.
              </p>

              {/* Primary CTAs */}
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/dashboard/create-interview">
                  <div>
                    <Button
                      className="inline-flex items-center gap-2 px-6 py-3"
                      aria-label="Create interview"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Create Interview
                    </Button>
                  </div>
                </Link>

                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 px-5 py-3"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry
                </Button>
              </div>

              {/* Secondary quick actions */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto">
                <button
                  className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs shadow-sm hover:shadow-md transition-shadow"
                  onClick={() =>
                    (window.location.href =
                      "/dashboard/create-interview?from=template")
                  }
                  aria-label="Create from template"
                >
                  <FilePlus className="h-5 w-5" />
                  <span>Create from template</span>
                </button>

                <button
                  className="flex flex-col items-center justify-center gap-1 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs shadow-sm hover:shadow-md transition-shadow"
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }
                  aria-label="Copy dashboard link"
                >
                  <Users className="h-5 w-5" />
                  <span>Copy link</span>
                </button>

                <div className="hidden sm:flex items-center justify-center px-3 py-2 text-xs text-slate-400">
                  or
                </div>

                <div className="hidden sm:flex items-center justify-center px-3 py-2 text-xs text-slate-400">
                  start fast ✨
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Tip: You can import candidates in bulk or create an interview
                from a template to get started faster.
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {interviewList.map((interview) => (
                <InterviewCard
                  interview={interview}
                  key={interview?.interview_id || interview?.id}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}