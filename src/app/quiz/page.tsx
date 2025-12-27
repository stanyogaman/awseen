import { Container } from "@/components/Container";
import { QuizForm } from "@/components/QuizForm";

export default function QuizPage() {
  const priceUsd = process.env.AUDIT_PRICE_USD || "129";
  return (
    <section className="py-12">
      <Container>
        <div className="grid gap-6 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Check if your website is losing sales or leads
          </h1>
          <p className="text-gray-700">
            Answer a few short questions to get a quick pre-analysis. If it makes sense, confirm your audit with a one-time payment.
          </p>
          <QuizForm priceUsd={priceUsd} />
        </div>
      </Container>
    </section>
  );
}
