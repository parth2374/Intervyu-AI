"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SunIcon, MoonIcon, MenuIcon, XIcon, SearchIcon } from "./icons"; // small inline icons below
import Image from "next/image";
import { FilePlus2, GalleryThumbnails, Moon, NotebookText, PlayCircle, Sun, Wallet } from "lucide-react";

const NAV = [
  { title: "Quickstart", href: "/docs/v1/quickstart", icon: NotebookText },
  { title: "Create Interview", href: "/docs/v1/create-interview", icon: FilePlus2 },
  { title: "Start Interview", href: "/docs/v1/start-interview", icon: PlayCircle },
  { title: "Webhooks", href: "/docs/webhooks", icon: GalleryThumbnails },
  { title: "Pricing", href: "/docs/v1/pricing", icon: Wallet }
];

export default function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [dark, setDark] = useState(false);

  const filtered = NAV.filter(
    (n) => n.title.toLowerCase().includes(q.toLowerCase()) || n.href.includes(q.toLowerCase())
  );

  return (
    <>
      {/* mobile header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <MenuIcon className="w-5 h-5" />
          </button>
          <div className="text-lg font-extrabold">Intervyu AI Docs</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setDark((d) => !d);
              document.documentElement.classList.toggle("dark");
            }}
            aria-label="Toggle dark"
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden overflow-hidden fixed md:flex md:flex-col w-[16rem] justify-between h-screen shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-6">
        <div>
        <div className="mb-6">
          <div className="flex flex-col items-center gap-3">
            <Link href={'/'}>
              <Image
                src={'/logo.png'}
                alt="logo"
                width={200}
                height={100}
                className="w-[150px] mt-1 block dark:hidden"
              />
              <Image
                src="/transparent_bg_logo_white.png"
                alt="logo dark"
                width={130}
                height={100}
                className="hidden dark:block"
              />
            </Link>
            <div className="flex">
              <div>
                <div className="text-lg font-extrabold">Intervyu AI</div>
                <div className="text-xs text-center text-slate-500 dark:text-slate-400">Docs & API</div>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search docs..."
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-slate-200 dark:focus:border-slate-700 outline-none text-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        <nav className="flex overflow-auto">
          <ul className="space-y-1">
            {filtered.map((item, index) => {
              const active = pathname?.startsWith(item.href);
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`group flex ${index == 0 ? 'mt-0' : 'mt-2'} w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      active
                        ? "bg-amber-50 dark:bg-blue-500 text-amber-700 dark:text-white shadow-sm dark:shadow-[2px_2px_6px_rgba(255,255,255,0.5)]"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <item.icon />
                    <span className="truncate text-[1rem]">{item.title}</span>
                    {active && <span className="ml-auto text-xs text-slate-400 dark:text-white">●</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        </div>

        <div className="pt-1 pb-1 flex flex-col items-center overflow-hidden">
          <div className="block py-2 rounded-lg text-sm">
            <strong className="dark:text-white">Get started</strong>
            <div className="text-xs text-slate-500 dark:text-slate-400">Setup & keys</div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              className="relative group text-slate-950 transition-all flex items-center justify-center whitespace-nowrap rounded-lg hover:rotate-[3deg] will-change-transform duration-300 shadow-lg hover:shadow-xl h-12 pl-[3.2rem] pr-3 bg-yellow-400 shadow-yellow-400/30 hover:shadow-yellow-400/30"
              onClick={() => {
                setDark((d) => !d);
                document.documentElement.classList.toggle("dark");
              }}
            >
              <div
                className="absolute flex items-center justify-center left-0 top-0 mt-1 ml-1 bg-white text-slate-950 p-[0.35rem] bottom-1 group-hover:w-[calc(100%-0.5rem)] transition-all rounded-md duration-300 h-10 w-10"
              >
                <Moon className="relative dark:hidden" />
                <Sun className="hidden dark:block" />
              </div>

              <div className="text-[1rem]">Toggle Theme</div>

              <div
                className="bg-orange-400 absolute flex rounded-full animate-ping opacity-75 h-5 w-5 -top-2 -right-2"
              ></div>
              <div
                className="bg-orange-600 absolute flex rounded-full scale-[90%] h-5 w-5 -top-2 -right-2"
              ></div>
            </button>
            <a href="/developer" className="py-2.5 px-1 rounded-lg bg-amber-100 text-amber-800 font-semibold">API</a>
          </div>
          <div className="flex mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="mr-1">🚀</span>
            <span className="text-gray-600 dark:text-gray-400">Powered by </span>
            <span className="ml-1 font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-violet-500">
              RAMORAE AI
            </span>
          </div>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white dark:bg-slate-950 p-4 shadow-xl overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-extrabold">Intervyu Docs</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="w-full pl-3 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800" />
            </div>

            <ul className="space-y-2">
              {filtered.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}