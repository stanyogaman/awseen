import Link from "next/link";
import { Container } from "@/components/Container";
import { getArticle } from "@/lib/db";
import { ArrowRight } from "lucide-react";

export default function PillarPage() {
  const item = getArticle("why-websites-dont-convert");

  if (!item) {
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

          <div className="rounded-3xl border p-6 bg-black text-white">
            <div className="font-semibold">Check your website</div>
            <div className="text-sm opacity-90 mt-1">
              Take the short quiz to see whether a full revenue-focused audit makes sense.
            </div>
            <div className="mt-3">
              <Link href="/quiz" className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-5 py-3 font-medium">
                Start the Audit Quiz <ArrowRight size={16}/>
              </Link>
            </div>
          </div>

          <Link href="/insights" className="hover:underline">← Browse Insights</Link>
        </article>
      </Container>
    </section>
  );
}
