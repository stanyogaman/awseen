import { Container } from "@/components/Container";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  { q: "What websites do you audit?", a: "E-commerce stores (Shopify/Woo/custom) and service websites." },
  { q: "Do I need Google Analytics / Search Console?", a: "Recommended, but not required. The audit still works without it." },
  { q: "Do you implement fixes?", a: "No. This is a diagnostic service. You get a clear plan you can implement or hand to your team." },
  { q: "Is this an SEO audit?", a: "Not specifically. SEO may be mentioned, but the focus is conversion and revenue." },
  { q: "How long does it take?", a: "Typically 2–3 business days after I receive your site details and (optional) analytics access." },
  { q: "Are refunds available?", a: "No refunds once work has started. If you’re unsure, ask questions before purchasing." },
];

export default function FAQPage() {
  return (
    <section className="py-12">
      <Container>
        <div className="max-w-3xl grid gap-6">
          <h1 className="text-3xl font-semibold tracking-tight">FAQ</h1>

          <div className="grid gap-3">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-3xl border p-6">
                <div className="font-semibold">{f.q}</div>
                <div className="text-sm text-gray-700 mt-2">{f.a}</div>
              </div>
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
