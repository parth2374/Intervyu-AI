import React from "react";
import './LandingPageStyles.css'
import { LockKeyhole, TrendingUp } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Smarter hiring decisions",
      desc:
        "Intervyu AI helps recruiters assess candidates efficiently using real-time AI interviewers and structured analytics.",
      // simple arrow-up-right icon (svg)
      icon: (
        <TrendingUp className="h-10 w-10" />
      ),
    },
    {
      title: "AI-driven interview insights",
      desc:
        "Get detailed reports on candidate performance, soft skills, and communication, enabling data hiring.",
      icon: (
        <LockKeyhole className="h-10 w-10" />
      ),
    },
    {
      title: "Reduce manual effort",
      desc:
        "Automate screening, feedback, and scheduling workflows, saving valuable recruiter time and costs.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M15 12H9" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white font-[LandingFont] mt-8">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Large heading */}
        <h2 className="text-4xl md:text-5xl font-normal text-gray-900 tracking-tighter mb-12">
          Built to simplify. Powered to scale.
        </h2>

        {/* Features grid */}
        <div className="grid grid-cols-1 mt-20 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="flex flex-col items-start gap-6">
              {/* icon */}
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center">
                  <div>{f.icon}</div>
                </div>
              </div>

              {/* content */}
              <div>
                <h3 className="text-xl text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed max-w-lg text-[1.15rem]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* thin rule below similar to screenshot */}
        <div className="mt-[8rem] border-t border-gray-200" />
      </div>
    </section>
  );
}