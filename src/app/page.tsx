import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { FeatureGrid } from "@/components/FeatureGrid";
import { getSetting } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const badge = getSetting("hero_badge");
  const h1 = getSetting("hero_h1");
  const sub = getSetting("hero_sub");

  const price = process.env.AUDIT_PRICE_USD || getSetting("price_usd") || "129";
  const turnaround = getSetting("turnaround") || "2–3 business days";

  return (
    <>
      <section className="py-14">
        <Container>
          <div className="grid gap-7">
            <div className="text-sm text-gray-600">{badge}</div>

            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
              {h1}
            </h1>

            <p className="text-gray-700 text-base sm:text-lg max-w-2xl">
              {sub}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button href="/quiz">
                Start the Audit Quiz <span className="ml-2"><ArrowRight size={16} /></span>
              </Button>
              <Button href="/how-it-works" variant="secondary">
                How it works
              </Button>
              <div className="text-sm text-gray-600 sm:ml-3">
                Takes 2–3 minutes • Delivery: {turnaround}
              </div>
            </div>

            <div className="rounded-3xl border p-6 grid gap-2 bg-gray-50">
              <div className="font-semibold">Website Revenue Audit — ${price}</div>
              <div className="text-sm text-gray-700">
                Report + prioritized fixes + private video walkthrough (15–25 min). One-time payment. No upsells.
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 border-t">
        <Container>
          <div className="grid gap-6">
            <div className="max-w-2xl">
              <h2 className="text-xl font-semibold tracking-tight">What’s included</h2>
              <p className="text-gray-700 mt-2">
                I audit your website as a decision system: clarity, trust, friction, and conversion logic.
              </p>
            </div>
            <FeatureGrid />
          </div>
        </Container>
      </section>

      <section className="py-10 border-t">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border p-6">
              <div className="font-semibold mb-2">This audit is for you if</div>
              <ul className="list-disc pl-5 text-gray-700 grid gap-1 text-sm">
                <li>You run an e-commerce store or service website</li>
                <li>You already get traffic (paid or organic)</li>
                <li>Sales/leads are lower than expected</li>
                <li>You want clarity before spending more money</li>
              </ul>
            </div>
            <div className="rounded-3xl border p-6">
              <div className="font-semibold mb-2">Not for you if</div>
              <ul className="list-disc pl-5 text-gray-700 grid gap-1 text-sm">
                <li>Your website has no traffic at all</li>
                <li>You are still testing a business idea</li>
                <li>You want implementation, not diagnosis</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border p-6 bg-white">
            <div className="font-semibold">Prefer to read first?</div>
            <div className="text-sm text-gray-700 mt-1">
              Start with the complete guide (pillar article), then take the quiz when ready.
            </div>
            <div className="mt-3">
              <Link href="/guide/why-websites-dont-convert" className="hover:underline inline-flex items-center gap-2">
                Read the complete guide <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 border-t">
        <Container>
          <div className="rounded-3xl border p-7 bg-black text-white grid gap-3">
            <div className="text-sm opacity-80">Ready to see what’s blocking results?</div>
            <div className="text-2xl font-semibold">Start the Audit Quiz</div>
            <div className="text-sm opacity-90 max-w-2xl">
              2–3 minutes. No obligation. If it makes sense, you can confirm with a one-time payment.
            </div>
            <div>
              <Link href="/quiz" className="inline-flex rounded-2xl bg-white text-black px-5 py-3 font-medium">
                Start the Audit Quiz
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
