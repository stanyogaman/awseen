import Link from "next/link";
import { Container } from "@/components/Container";
import { getInsights } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export default function InsightsPage() {
  const insights = getInsights();
  return (
    <section className="py-12">
      <Container>
        <div className="max-w-3xl grid gap-6">
          <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
          <p className="text-gray-700">
            Practical articles about conversion, trust, and revenue-focused audits.
          </p>

          <div className="grid gap-3">
            {insights.map((a) => (
              <Link key={a.slug} href={`/insights/${a.slug}`} className="rounded-3xl border p-6 hover:bg-gray-50 transition">
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-gray-700 mt-2">{a.description}</div>
              </Link>
            ))}
          </div>

          <Link href="/quiz" className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-5 py-3 w-fit hover:opacity-90">
            Start the Audit Quiz <ArrowRight size={16}/>
          </Link>
        </div>
      </Container>
    </section>
  );
}
