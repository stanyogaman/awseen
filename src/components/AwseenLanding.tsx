"use client";

import { FormEvent, useEffect, useState } from "react";

const services = [
  {
    icon: "🌐",
    title: "AI-Powered Websites",
    text: "WordPress, WooCommerce, or custom Next.js builds with an embedded AI agent that qualifies visitors and captures leads automatically.",
    tags: ["WordPress", "WooCommerce", "Next.js", "AI-Coded"],
  },
  {
    icon: "🤖",
    title: "AI Sales Agents",
    text: "24/7 chat agents trained on your business. They answer questions, qualify leads, collect contact info, and log everything to your CRM.",
    tags: ["Lead capture", "CRM sync", "Multilingual"],
  },
  {
    icon: "✈️",
    title: "Telegram Bots",
    text: "Smart bots for Telegram and Max/VK that handle inquiries, bookings, notifications, and simple sales workflows.",
    tags: ["Telegram", "Max/VK", "Notifications"],
  },
  {
    icon: "📊",
    title: "CRM & Automation",
    text: "Google Sheets CRM, AmoCRM, HubSpot, Make, Zapier, or n8n integrations so every lead lands in one organised place.",
    tags: ["Google Sheets", "AmoCRM", "HubSpot", "n8n"],
  },
  {
    icon: "🔍",
    title: "Website Audit + SEO",
    text: "AI-assisted technical and conversion audit of your current site. We find conversion killers and SEO gaps, then prioritise fixes.",
    tags: ["Technical SEO", "Core Web Vitals", "Conversion"],
  },
  {
    icon: "🚀",
    title: "Full Sales Automation",
    text: "Landing page → AI agent → CRM → Telegram alert → follow-up sequence. Your website becomes a sales system, not just a brochure.",
    tags: ["Full stack", "Railway deploy", "24/7"],
  },
];

const plans = [
  {
    name: "Starter",
    price: "$990",
    desc: "One-time · Delivered in 3–5 days",
    featured: false,
    features: [
      "Landing page up to 5 sections",
      "AI chat agent on your site",
      "Google Sheets CRM",
      "Telegram lead notifications",
      "Mobile-optimised layout",
      "2 weeks support",
    ],
  },
  {
    name: "Growth",
    price: "$2,400",
    desc: "One-time · Delivered in 5–10 days",
    featured: true,
    features: [
      "Everything in Starter",
      "Telegram bot for your business",
      "Full SEO setup + sitemap",
      "WordPress or custom build",
      "3 months support included",
      "Priority response",
    ],
  },
  {
    name: "Scale",
    price: "$4,800",
    desc: "One-time · Delivered in 10–21 days",
    featured: false,
    features: [
      "Everything in Growth",
      "Full sales automation pipeline",
      "Custom AI workflows",
      "CRM of your choice",
      "Multi-channel bots",
      "6 months priority support",
    ],
  },
  {
    name: "Retainer",
    price: "$800/mo",
    desc: "Monthly · Cancel anytime",
    featured: false,
    features: [
      "Ongoing updates and new features",
      "Hosting and infrastructure managed",
      "AI agent tuning and improvements",
      "Monthly performance report",
      "Same-day response SLA",
      "Add-on bots and integrations",
    ],
  },
];

const planOptions = ["Starter — $990", "Growth — $2,400", "Scale — $4,800", "Retainer — $800/mo", "Not sure yet"];

type ContactState = {
  name: string;
  contact: string;
  business: string;
  plan: string;
  message: string;
};

const emptyContact: ContactState = {
  name: "",
  contact: "",
  business: "",
  plan: "",
  message: "",
};

export function AwseenLanding() {
  const [contact, setContact] = useState<ContactState>(emptyContact);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".aw-fade"));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("aw-visible")),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function selectPlan(plan: string) {
    setContact((current) => ({ ...current, plan }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSent(false);

    if (!contact.name.trim() || !contact.contact.trim()) {
      setError("Please enter your name and email or Telegram.");
      return;
    }

    const rawContact = contact.contact.trim();
    const isEmail = rawContact.includes("@") && rawContact.includes(".");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...contact,
        contact: rawContact,
        email: isEmail ? rawContact : null,
        telegram: isEmail ? null : rawContact,
        source: "awseen_homepage",
      }),
    });

    if (!res.ok) {
      setError("Could not send the inquiry. Please message me on Telegram: @StanMan101");
      return;
    }

    setContact(emptyContact);
    setSent(true);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080810] text-[#f0f0f8]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#080810]/85 px-5 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href="#top" className="font-display text-[22px] font-extrabold tracking-[-0.5px] text-transparent bg-clip-text bg-gradient-to-br from-white to-[#7c6dfa]">
            AWSEEN
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/45 md:flex">
            <a className="transition hover:text-white" href="#how">How it works</a>
            <a className="transition hover:text-white" href="#services">Services</a>
            <a className="transition hover:text-white" href="#pricing">Pricing</a>
            <a className="transition hover:text-white" href="#contact">Contact</a>
          </nav>
          <a href="#ai-demo" className="rounded-lg bg-[#7c6dfa] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-85">
            Talk to AI →
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-32 text-center">
          <div className="pointer-events-none absolute -top-52 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(124,109,250,0.14)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(79,209,197,0.08)_0%,transparent_70%)]" />

          <div className="relative z-10 aw-fade">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#7c6dfa]/40 bg-[#7c6dfa]/10 px-4 py-2 text-[13px] font-medium text-[#7c6dfa]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#7c6dfa]" />
              AI-Powered Agency — Available Worldwide
            </div>
            <h1 className="mx-auto mb-6 max-w-5xl font-display text-[clamp(42px,7vw,82px)] font-extrabold leading-[1.05] tracking-[-2px]">
              Websites & AI Agents<br />That <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#7c6dfa] to-[#4fd1c5]">Close Deals</span>
            </h1>
            <p className="mx-auto mb-11 max-w-xl text-[clamp(16px,2vw,20px)] font-light leading-8 text-white/45">
              We build landing pages, Telegram bots, and AI sales agents that capture leads 24/7 — while you sleep.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <a href="#ai-demo" className="inline-flex items-center gap-2 rounded-[10px] bg-[#7c6dfa] px-8 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#6c5de8]">
                🤖 See AI agent demo
              </a>
              <a href="#pricing" className="rounded-[10px] border border-white/10 px-8 py-4 text-base font-medium text-white transition hover:border-white/20 hover:bg-white/5">
                See pricing
              </a>
            </div>
            <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
              {["3–7 days|Average delivery", "24/7|AI agent uptime", "CRM|Lead capture system", "3 ways|PayPal / Crypto / Wire"].map((item) => {
                const [num, label] = item.split("|");
                return (
                  <div className="text-center" key={item}>
                    <div className="font-display text-3xl font-extrabold text-white">{num}</div>
                    <div className="mt-0.5 text-[13px] text-white/45">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="bg-[#0f0f1a] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Process</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">From idea to live<br />in 3–7 days</h2>
            </div>
            <div className="aw-fade mt-14 grid overflow-hidden rounded-[14px] border border-white/10 md:grid-cols-4">
              {[
                ["01", "Brief & Strategy", "Tell us about your business. We define the right stack, offer, lead flow, and launch scope."],
                ["02", "Build & Integrate", "We build your landing page, configure the AI agent, and connect CRM plus notifications."],
                ["03", "Launch & Automate", "Go live on Railway or your hosting. Every hot lead can notify you on Telegram."],
                ["04", "Scale & Grow", "Add bots, automations, SEO pages, and follow-up workflows as the business grows."],
              ].map(([num, title, text]) => (
                <div key={num} className="border-b border-white/10 bg-[#0f0f1a] p-7 md:border-b-0 md:border-r md:last:border-r-0">
                  <div className="mb-4 font-display text-5xl font-extrabold leading-none text-[#7c6dfa]/20">{num}</div>
                  <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
                  <p className="text-sm leading-6 text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Services</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Everything your business<br />needs to automate growth</h2>
            </div>
            <div className="aw-fade mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.title} className="group relative overflow-hidden rounded-[14px] border border-white/10 bg-[#0f0f1a] p-8 transition hover:-translate-y-0.5 hover:border-[#7c6dfa]/30">
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-[#7c6dfa] to-[#4fd1c5] opacity-0 transition group-hover:opacity-100" />
                  <span className="mb-5 block text-3xl">{service.icon}</span>
                  <h3 className="mb-3 font-display text-xl font-bold">{service.title}</h3>
                  <p className="mb-5 text-sm leading-7 text-white/45">{service.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-[#7c6dfa]/20 bg-[#7c6dfa]/10 px-2.5 py-1 text-[11px] text-[#7c6dfa]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-demo" className="border-y border-white/10 bg-gradient-to-br from-[#7c6dfa]/5 to-[#4fd1c5]/5 px-6 py-24 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="aw-fade">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Live Demo</div>
              <h2 className="mb-4 font-display text-[clamp(28px,4vw,44px)] font-extrabold leading-[1.15] tracking-[-1px]">Your AI agent<br />can be connected here</h2>
              <p className="mb-7 leading-7 text-white/45">
                The visual chat widget is ready. Next step is connecting it to OpenAI, Claude, Telegram, or n8n so it can answer using your business knowledge and save every lead.
              </p>
              <ul className="grid gap-0">
                {["Responds in any language", "Identifies hot leads automatically", "Logs to Google Sheets CRM", "Sends Telegram alerts", "Runs 24/7 with Railway deploy"].map((item) => (
                  <li key={item} className="flex items-center gap-2 border-b border-white/10 py-2.5 text-sm text-white/45">
                    <span className="text-[#4fd1c5]">◆</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aw-fade rounded-[14px] border border-white/10 bg-[#0f0f1a] p-8 text-center">
              <div className="mb-4 text-5xl">💬</div>
              <h3 className="mb-3 font-display text-2xl font-bold">Demo agent block</h3>
              <p className="mb-6 text-sm leading-6 text-white/45">Use the contact form now. The next commit can connect the chat widget to a real model and your Telegram alerts.</p>
              <a href="#contact" className="inline-flex w-full justify-center rounded-[10px] bg-[#7c6dfa] px-8 py-4 text-base font-medium text-white transition hover:bg-[#6c5de8]">
                Request AI Agent →
              </a>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-[#0f0f1a] px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade text-center">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Pricing</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Clear packages,<br />no surprises</h2>
              <p className="mx-auto max-w-xl text-lg font-light leading-8 text-white/45">Everything includes deployment setup and post-launch support.</p>
            </div>
            <div className="aw-fade mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {plans.map((plan) => (
                <article key={plan.name} className={`relative rounded-[14px] border p-8 ${plan.featured ? "border-[#7c6dfa] bg-[#7c6dfa]/5" : "border-white/10 bg-[#080810]"}`}>
                  {plan.featured ? <div className="absolute left-1/2 top-[-12px] -translate-x-1/2 rounded-full bg-[#7c6dfa] px-3.5 py-1 text-[11px] font-medium text-white">Most popular</div> : null}
                  <div className="mb-3 font-display text-[13px] font-bold uppercase tracking-[2px] text-white/45">{plan.name}</div>
                  <div className="mb-1 font-display text-[42px] font-extrabold tracking-[-1px]">{plan.price}</div>
                  <div className="mb-6 text-[13px] text-white/45">{plan.desc}</div>
                  <ul className="mb-7">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 border-b border-white/10 py-2 text-sm text-white/45 last:border-none">
                        <span className="font-bold text-[#4fd1c5]">✓</span>{feature}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => selectPlan(`${plan.name} — ${plan.price}`)} className={`w-full rounded-[9px] border px-4 py-3.5 text-[15px] font-medium transition ${plan.featured ? "border-[#7c6dfa] bg-[#7c6dfa] text-white hover:bg-[#6c5de8]" : "border-white/10 text-white hover:border-[#7c6dfa] hover:text-[#7c6dfa]"}`}>
                    Get started →
                  </button>
                </article>
              ))}
            </div>
            <div className="aw-fade mt-10 text-center">
              <p className="mb-4 text-sm text-white/45">Accepted payment methods</p>
              <div className="flex flex-wrap justify-center gap-3">
                {"🅿️ PayPal Business|₿ Bitcoin / USDT / ETH|🏦 Bank Wire".split("|").map((item) => (
                  <div key={item} className="rounded-[9px] border border-white/10 bg-[#161625] px-4 py-2.5 text-[13px] font-medium">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="px-6 py-24 md:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="aw-fade text-center">
              <div className="mb-4 text-xs font-medium uppercase tracking-[3px] text-[#7c6dfa]">Get Started</div>
              <h2 className="mb-4 font-display text-[clamp(32px,5vw,52px)] font-extrabold leading-[1.1] tracking-[-1.5px]">Tell us about<br />your project</h2>
              <p className="mx-auto max-w-xl text-lg font-light leading-8 text-white/45">Send your project details and get a concrete proposal, not a generic sales pitch.</p>
            </div>
            <form onSubmit={submitContact} className="aw-fade mx-auto mt-12 max-w-2xl">
              <div className="grid gap-3.5 md:grid-cols-2">
                <Field label="Your name" value={contact.name} placeholder="John Smith" onChange={(value) => setContact({ ...contact, name: value })} />
                <Field label="Email or Telegram" value={contact.contact} placeholder="you@email.com or @handle" onChange={(value) => setContact({ ...contact, contact: value })} />
                <Field label="Business type" value={contact.business} placeholder="e-commerce, clinic, agency..." onChange={(value) => setContact({ ...contact, business: value })} />
                <label className="block text-[13px] font-medium text-white/45">
                  Package interest
                  <select value={contact.plan} onChange={(event) => setContact({ ...contact, plan: event.target.value })} className="mt-1.5 w-full rounded-[9px] border border-white/10 bg-[#080810] px-4 py-3 text-[15px] text-white outline-none transition focus:border-[#7c6dfa]">
                    <option value="">Select a plan</option>
                    {planOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <label className="mt-3.5 block text-[13px] font-medium text-white/45">
                Tell us about your project
                <textarea value={contact.message} onChange={(event) => setContact({ ...contact, message: event.target.value })} placeholder="What do you need? What is your current situation?" className="mt-1.5 min-h-28 w-full resize-y rounded-[9px] border border-white/10 bg-[#080810] px-4 py-3 text-[15px] text-white outline-none transition focus:border-[#7c6dfa]" />
              </label>
              <button className="mt-5 w-full rounded-[10px] bg-[#7c6dfa] px-4 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:bg-[#6c5de8]" type="submit">
                Send Inquiry →
              </button>
              <div className="mt-3.5 text-center text-[13px] text-white/45">No spam. We can reply by email or Telegram.</div>
              {error ? <div className="mt-4 rounded-[14px] border border-red-400/30 bg-red-500/10 p-4 text-center text-sm text-red-200">{error}</div> : null}
              {sent ? <div className="mt-4 rounded-[14px] border border-[#4fd1c5]/20 bg-[#4fd1c5]/10 p-4 text-center text-sm text-[#4fd1c5]">✅ Your inquiry has been received. I will reply with next steps.</div> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-12 text-center">
        <div className="mb-3 font-display text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-[#7c6dfa]">AWSEEN</div>
        <div className="mb-4 flex flex-wrap justify-center gap-6">
          {[
            ["How it works", "#how"],
            ["Services", "#services"],
            ["Pricing", "#pricing"],
            ["Contact", "#contact"],
            ["Telegram", "https://t.me/StanMan101"],
          ].map(([label, href]) => (
            <a key={label} href={href} className="text-[13px] text-white/45 transition hover:text-white">{label}</a>
          ))}
        </div>
        <p className="text-[13px] text-white/45">© 2026 AWSEEN. AI Websites & Agents — built for fast business automation.</p>
      </footer>
    </div>
  );
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="block text-[13px] font-medium text-white/45">
      {label}
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 w-full rounded-[9px] border border-white/10 bg-[#080810] px-4 py-3 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-[#7c6dfa]" />
    </label>
  );
}
