import Link from "next/link";
import { Container } from "@/components/Container";
import { getArticle } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export default function InsightPage({ params }: { params: { slug: string } }) {
  const item = getArticle(params.slug);

  if (!item || item.kind !== "insight") {
    return (
      <section className="py-12">
        <Container>
          <div className="max-w-3xl">Not found.</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12">
      <Container>
        <article className="max-w-3xl grid gap-6">
          <h1 className="text-3xl font-semibold tracking-tight">{item.title}</h1>
          <p className="text-gray-600">{item.description}</p>

          <div className="prose max-w-none">
            {item.body.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="rounded-3xl border p-6 bg-gray-50">
            <div className="font-semibold">Want a clear second opinion on your site?</div>
            <div className="text-sm text-gray-700 mt-1">
              Start the short quiz to see whether a full audit makes sense.
            </div>
            <div className="mt-3">
              <Link href="/quiz" className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-5 py-3 hover:opacity-90">
                Start the Audit Quiz <ArrowRight size={16}/>
              </Link>
            </div>
          </div>

          <Link href="/insights" className="hover:underline">← Back to Insights</Link>
        </article>
      </Container>
    </section>
  );
}
