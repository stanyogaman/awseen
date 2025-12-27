import { Container } from "@/components/Container";
import Link from "next/link";
import { getSetting } from "@/lib/db";

export default function ThankYouPage() {
  const email = getSetting("contact_email") || "hello@awseen.com";
  const turnaround = getSetting("turnaround") || "2–3 business days";
  return (
    <section className="py-12">
      <Container>
        <div className="max-w-3xl grid gap-6">
          <h1 className="text-3xl font-semibold tracking-tight">Your audit is confirmed</h1>
          <p className="text-gray-700">
            Please send the details below so I can start immediately.
          </p>

          <div className="rounded-3xl border p-6 grid gap-3">
            <div className="font-semibold">Send these details to: <span className="underline">{email}</span></div>
            <ul className="list-disc pl-5 text-sm text-gray-700 grid gap-1">
              <li>Website URL</li>
              <li>Google Analytics access (read-only) or screenshots</li>
              <li>Google Search Console access (optional)</li>
              <li>Any specific questions you want me to focus on</li>
            </ul>
            <div className="text-sm text-gray-600">Delivery: typically {turnaround} after receiving your details.</div>
            <div className="text-xs text-gray-500">No upsells. No follow-up sales.</div>
          </div>

          <Link href="/" className="hover:underline">Back to home →</Link>
        </div>
      </Container>
    </section>
  );
}
