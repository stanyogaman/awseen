"use client";

import React, { useMemo, useState } from "react";
import { PayPalCheckout } from "./PayPalCheckout";
import { ArrowRight, CheckCircle2, TriangleAlert } from "lucide-react";

type QuizState = {
  websiteType: "ecommerce" | "services";
  mainIssue: string;
  trafficSource: string;
  monthlyTraffic: string;
  analytics: string;
  goal: string;
  email: string;
  messenger: string;
};

const initial: QuizState = {
  websiteType: "ecommerce",
  mainIssue: "Traffic but no sales/leads",
  trafficSource: "Paid ads",
  monthlyTraffic: "1,000–10,000",
  analytics: "Google Analytics + Search Console",
  goal: "Increase sales/leads",
  email: "",
  messenger: "",
};

function score(state: QuizState) {
  // Simple heuristic to generate a helpful "pre-analysis" summary (not a promise).
  let s = 0;
  if (state.monthlyTraffic.includes("10,000")) s += 3;
  else if (state.monthlyTraffic.includes("1,000")) s += 2;
  else s += 1;

  if (state.analytics.includes("Google Analytics")) s += 2;
  else if (state.analytics.includes("Partial")) s += 1;

  if (state.trafficSource.includes("Paid")) s += 2;
  if (state.mainIssue.includes("Not sure")) s += 1;

  return s; // 1..7
}

export function QuizForm({ priceUsd = "129" }: { priceUsd?: string }) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuizState>(initial);
  const [phase, setPhase] = useState<"quiz" | "results" | "payment">("quiz");
  const [error, setError] = useState<string>("");
  const total = 7;

  const progress = useMemo(() => Math.round((step / total) * 100), [step]);

  const next = () => setStep((s) => Math.min(total, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  async function submitLead() {
    setError("");
    if (!state.email || !state.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!res.ok) {
      setError("Could not submit. Please try again.");
      return;
    }
    try {
      localStorage.setItem("awseen_last_lead_payload", JSON.stringify(state));
    } catch {}
    setPhase("results");
  }

  const s = score(state);
  const isLowTraffic = state.monthlyTraffic.includes("Less");

  return (
    <div className="rounded-3xl border p-6 bg-white">
      {phase === "quiz" && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">Step {step} of {total}</div>
            <div className="text-sm text-gray-600">{progress}%</div>
          </div>

          <div className="h-2 w-full bg-gray-100 rounded-full mb-6">
            <div className="h-2 bg-black rounded-full" style={{ width: `${progress}%` }} />
          </div>

          {step === 1 && (
            <Block title="What type of website do you have?">
              <Select
                value={state.websiteType}
                onChange={(v) => setState({ ...state, websiteType: v as any })}
                options={[
                  { value: "ecommerce", label: "E-commerce store" },
                  { value: "services", label: "Service business website" },
                ]}
              />
            </Block>
          )}

          {step === 2 && (
            <Block title="What’s the main issue right now?">
              <Select
                value={state.mainIssue}
                onChange={(v) => setState({ ...state, mainIssue: v })}
                options={[
                  { value: "Traffic but no sales/leads", label: "Traffic but no sales/leads" },
                  { value: "Low conversion rate", label: "Low conversion rate" },
                  { value: "Expensive ads with poor results", label: "Expensive ads with poor results" },
                  { value: "Not sure where the problem is", label: "Not sure where the problem is" },
                ]}
              />
            </Block>
          )}

          {step === 3 && (
            <Block title="Where does most of your traffic come from?">
              <Select
                value={state.trafficSource}
                onChange={(v) => setState({ ...state, trafficSource: v })}
                options={[
                  { value: "Paid ads", label: "Paid ads" },
                  { value: "Organic (SEO)", label: "Organic (SEO)" },
                  { value: "Social / referrals", label: "Social / referrals" },
                  { value: "Mixed", label: "Mixed" },
                ]}
              />
            </Block>
          )}

          {step === 4 && (
            <Block title="Approximate monthly traffic?">
              <Select
                value={state.monthlyTraffic}
                onChange={(v) => setState({ ...state, monthlyTraffic: v })}
                options={[
                  { value: "Less than 1,000", label: "Less than 1,000" },
                  { value: "1,000–10,000", label: "1,000–10,000" },
                  { value: "10,000+", label: "10,000+" },
                ]}
              />
              <p className="text-xs text-gray-500 mt-2">An estimate is perfectly fine.</p>
            </Block>
          )}

          {step === 5 && (
            <Block title="Do you have analytics set up?">
              <Select
                value={state.analytics}
                onChange={(v) => setState({ ...state, analytics: v })}
                options={[
                  { value: "Google Analytics + Search Console", label: "Google Analytics + Search Console" },
                  { value: "Partial setup", label: "Partial setup" },
                  { value: "No analytics", label: "No analytics" },
                ]}
              />
            </Block>
          )}

          {step === 6 && (
            <Block title="What do you want from this audit?">
              <Select
                value={state.goal}
                onChange={(v) => setState({ ...state, goal: v })}
                options={[
                  { value: "Increase sales/leads", label: "Increase sales/leads" },
                  { value: "Find conversion blockers", label: "Find conversion blockers" },
                  { value: "Prepare for ads scaling", label: "Prepare for ads scaling" },
                  { value: "Get an honest second opinion", label: "Get an honest second opinion" },
                ]}
              />
            </Block>
          )}

          {step === 7 && (
            <Block title="Where should I send audit details?">
              <div className="grid gap-3">
                <input
                  className="w-full rounded-2xl border px-3 py-2"
                  placeholder="Email (required)"
                  value={state.email}
                  onChange={(e) => setState({ ...state, email: e.target.value })}
                />
                <input
                  className="w-full rounded-2xl border px-3 py-2"
                  placeholder="Telegram / WhatsApp (optional)"
                  value={state.messenger}
                  onChange={(e) => setState({ ...state, messenger: e.target.value })}
                />
                <div className="text-xs text-gray-500">No spam. No marketing emails.</div>
                {error ? <div className="text-sm text-red-600 flex items-center gap-2"><TriangleAlert size={16}/> {error}</div> : null}
                <button
                  onClick={submitLead}
                  className="rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90 inline-flex items-center justify-center gap-2"
                >
                  See pre-analysis <ArrowRight size={16} />
                </button>
              </div>
            </Block>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              onClick={back}
              className="rounded-2xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
              disabled={step === 1}
            >
              Back
            </button>
            <button
              onClick={next}
              className="rounded-2xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-40"
              disabled={step === total}
            >
              Next
            </button>
          </div>
        </>
      )}

      {phase === "results" && (
        <div className="grid gap-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1" />
            <div>
              <div className="text-lg font-semibold">Pre-analysis summary</div>
              <div className="text-sm text-gray-600">
                This is a quick assessment based on your answers — not a promise of results.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-semibold mb-2">What your answers suggest</div>
            <ul className="text-sm text-gray-700 list-disc pl-5 grid gap-1">
              <li>You have a <b>{state.websiteType === "ecommerce" ? "store" : "service website"}</b> with {state.monthlyTraffic} visits/month (approx.).</li>
              <li>Primary issue: <b>{state.mainIssue}</b>.</li>
              <li>Traffic source: <b>{state.trafficSource}</b> (expectation matching is critical).</li>
              <li>Analytics: <b>{state.analytics}</b>.</li>
            </ul>

            <div className="mt-4 text-sm text-gray-700">
              Likely high-impact areas to review first:
              <ul className="mt-2 list-disc pl-5 grid gap-1">
                <li><b>Clarity</b> (5-second understanding on first screen)</li>
                <li><b>Trust</b> (proof and reassurance at the action moment)</li>
                <li><b>Friction</b> (forms/checkout steps and confusing copy)</li>
              </ul>
            </div>

            {isLowTraffic ? (
              <div className="mt-4 text-sm text-gray-700">
                Note: with very low traffic, the audit will focus more on structural issues and readiness before scaling.
              </div>
            ) : null}

            <div className="mt-4 text-xs text-gray-500">
              Signal score (internal): {s}/7
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-semibold">Confirm your full audit</div>
            <div className="text-sm text-gray-700 mt-1">
              Website Revenue Audit — <b>${priceUsd}</b> (one-time). Includes report + private video walkthrough (15–25 min).
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setPhase("payment")}
                className="rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90"
              >
                Continue to Payment
              </button>
              <button
                onClick={() => setPhase("quiz")}
                className="rounded-2xl border px-4 py-2 hover:bg-gray-50"
              >
                Edit answers
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "payment" && (
        <div className="grid gap-4">
          <div>
            <div className="text-lg font-semibold">Payment</div>
            <div className="text-sm text-gray-600">
              Secure one-time payment to confirm your audit.
            </div>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-semibold">Website Revenue Audit</div>
            <div className="text-sm text-gray-600">${priceUsd} — one-time payment</div>
            <div className="text-sm text-gray-700 mt-2">
              Includes report + private video walkthrough (15–25 min). No upsells.
            </div>
          </div>

          <PayPalCheckout />
          <button
            onClick={() => setPhase("results")}
            className="rounded-2xl border px-4 py-2 hover:bg-gray-50 w-fit"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      className="w-full rounded-2xl border px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
