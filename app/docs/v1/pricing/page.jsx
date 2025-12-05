"use client";
import React, { useState } from "react";
import {
  Check,
  Star,
  Rocket,
  Zap,
  Database,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";

/**
 * PricingPlans.jsx
 * - Drop into Next.js / React
 * - Tailwind required (darkMode: 'class' recommended)
 */

const PLANS = [
  {
    id: "free",
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    tagline: "Hobby & test",
    features: [
      "100 API calls / month",
      "Basic question generation",
      "Community support",
    ],
    cta: "Get API Key",
    variant: "outline",
  },
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 29,
    priceYearly: 290, // (2 months free example)
    tagline: "Individual developers",
    features: [
      "5,000 API calls / month",
      "Priority generation queue",
      "Webhooks & SDKs",
      "Email support",
    ],
    cta: "Start 14-day trial",
    badge: "Popular",
    icon: Rocket,
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 149,
    priceYearly: 1490,
    tagline: "Teams & small businesses",
    features: [
      "50,000 API calls / month",
      "Higher concurrency",
      "SLA & audit logs",
      "Priority support (chat + email)",
    ],
    cta: "Get started",
    highlight: true,
    icon: Star,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: "Custom",
    priceYearly: "Custom",
    tagline: "Large scale & custom SLAs",
    features: [
      "Custom quotas & SSO",
      "Dedicated account manager",
      "On-prem / VPC options",
      "SLA, compliance & audits",
    ],
    cta: "Contact sales",
    icon: Users,
  },
];

function Price({ monthly, yearly, billing }) {
  if (monthly === "Custom") return <span>Custom</span>;
  const amt = billing === "monthly" ? monthly : yearly;
  const isYearly = billing === "yearly";
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
        ${amt}
      </span>
      <span className="text-sm text-slate-500 dark:text-slate-400">
        / {isYearly ? "yr" : "mo"}
      </span>
    </div>
  );
}

function PlanCard({ plan, billing }) {
  const Icon = plan.icon || Zap;
  const highlight = plan.highlight;
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 sm:p-8 border ${
        highlight
          ? "bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-900 border-transparent shadow-[4px_8px_30px_rgba(15,23,42,0.12)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.6)]"
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm"
      } transition-all hover:-translate-y-1`}
    >
      {plan.badge && (
        <div className="absolute -top-3 right-4">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Tag className="w-4 h-4" />
            {plan.badge}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <Icon className={`w-6 h-6 ${highlight ? "text-amber-600" : "text-slate-700 dark:text-slate-300"}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{plan.tagline}</p>
          </div>
        </div>

        {plan.highlight && (
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-300">
            Best for teams
          </div>
        )}
      </div>

      <div className="mb-6">
        <Price monthly={plan.priceMonthly} yearly={plan.priceYearly} billing={billing} />
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Includes core API features and webhooks.
        </p>
      </div>

      <ul className="flex-1 space-y-2 mb-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <span className="mt-1">
              <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </span>
            <span className="text-slate-700 dark:text-slate-300">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <button
          className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold transition ${
            plan.variant === "outline"
              ? "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100"
              : highlight
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          }`}
          onClick={() => {
            // wire to checkout / create subscription / open modal
            alert(`${plan.cta} — ${plan.name}`);
          }}
        >
          {plan.cta}
          {plan.id !== "free" && <Database className="w-4 h-4 opacity-80" />}
        </button>
      </div>
    </div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState("monthly"); // monthly | yearly

  return (
    <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-slate-50 dark:from-slate-900 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">Intervyu AI API pricing</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Flexible tiers for every team — start free, scale your usage, and keep complete control over API keys, quotas, and webhooks.
          </p>

          <div className="inline-flex items-center gap-4 mt-6 rounded-full bg-slate-100 dark:bg-slate-800 p-1.5">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                billing === "monthly" ? "bg-white dark:bg-slate-900 shadow" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                billing === "yearly" ? "bg-white dark:bg-slate-900 shadow" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Yearly <span className="ml-2 text-xs text-emerald-600 font-semibold">Save 2 months</span>
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} billing={billing} />
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
          <div className="mb-2">
            Need custom limits?{" "}
            <a href="/contact" className="text-amber-600 dark:text-amber-400 font-semibold">Contact sales</a>
          </div>
          <div>
            All plans include access to API docs and 24/7 status updates. Usage-based overages billed monthly.
          </div>
        </div>
      </div>
    </section>
  );
}