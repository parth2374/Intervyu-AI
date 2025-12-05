"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import "./LandingPageStyles.css";
import Link from "next/link";
import { useAuthContext } from "../provider";

export default function HeroSection() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuthContext()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    if (typeof window !== "undefined") onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen font-[LandingFont] flex flex-col items-center justify-center text-center bg-[url('/HeroImage.avif')] bg-center bg-cover relative overflow-hidden">
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-8 md:px-10 transition-all duration-300 ${
          isScrolled
            ?
              "bg-white/20 backdrop-blur-md border-b border-white/10 py-1"
            :
              "bg-transparent py-3"
        }`}
      >
        <div className="flex items-center gap-4">
          <Image
            src={"/transparent_bg_logo.png"}
            alt="Logo"
            height={36}
            width={130}
            priority
          />
        </div>

        <div className="hidden md:flex gap-10 text-gray-700 font-medium">
          <a href="/scheduled-interview" className="text-gray-600 hover:text-black transition">
            Scheduled Interviews
          </a>
          <a href="/all-interview" className="text-gray-600 hover:text-black transition">
            All Interviews
          </a>
          <a href="/billing" className="text-gray-600 hover:text-black transition">
            Pricing
          </a>
          <a href="/developer" className="text-gray-600 hover:text-black transition">
            Developer
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link href={'/dashboard'}>
            <Button className="bg-black text-white flex justify-center items-center rounded-full px-5 py-2 hover:bg-gray-800">
              {user ? 'Dashboard' : 'Schedule a demo'}
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mt-[27rem] px-6">
        <h1 className="text-5xl md:text-[4.5rem] font-[500]  text-gray-900 max-w-4xl tracking-tighter">
          The future of hiring <br /> & interview preparation
        </h1>
        <p className="text-gray-500 mt-6 text-[1.5rem] max-w-[39rem]">
          Empowering companies and candidates with intelligent interview solutions.
        </p>
        <Link href={'/dashboard'}>
          <Button className="mt-6 bg-black text-white rounded-full px-6 py-6 text-xl hover:bg-gray-800">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
}