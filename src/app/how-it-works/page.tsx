import { Container } from "@/components/Container";
import Link from "next/link";
import { ArrowRight, ClipboardList, CreditCard, Video } from "lucide-react";
import { getSetting } from "@/lib/db";

export default function HowItWorksPage() {
  const turnaround = getSetting("turnaround") || "2–3 business days";
  return (
    <section className="py-12">
      <Container>
        <div className="max-w-3xl grid gap-6">
          <h1 className="text-3xl font-semibold tracking-tight">How the Audit Works</h1>
          <p className="text-gray-700">
            A structured process designed to remove guesswork and prevent wasted spend.
          </p>

          <div className="grid gap-3">
            <Step
              icon={ClipboardList}
              title="1) Audit Quiz (2–3 minutes)"
              text="Answer a few questions about your site, traffic, and goals. This helps me focus on what matters."
            />
            <Step
              icon={CreditCard}
              title="2) One-time payment"
              text="Secure checkout via PayPal. No subscriptions. No upsells."
            />
            <Step
              icon={Video}
              title={`3) Audit report + private video (${turnaround})`}
              text="You receive a concise report and a 15–25 min video walkthrough showing what to fix first."
            />
          </div>

          <div className="rounded-3xl border p-6 bg-gray-50">
            <div className="font-semibold">What this audit is (and isn’t)</div>
            <ul className="list-disc pl-5 text-sm text-gray-700 mt-2 grid gap-1">
              <li>Revenue-focused diagnostics (clarity, trust, friction, conversion logic)</li>
              <li>Prioritized fixes (what to do first)</li>
              <li>Not an SEO checklist</li>
              <li>Not a redesign proposal</li>
              <li>Not implementation</li>
            </ul>
          </div>

          <Link href="/quiz" className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-5 py-3 w-fit hover:opacity-90">
            Start the Audit Quiz <ArrowRight size={16}/>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border p-6">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white">
          <Icon size={18} />
        </span>
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-700 mt-1">{text}</div>
        </div>
      </div>
    </div>
  );
}
