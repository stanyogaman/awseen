import Link from "next/link";
import { Container } from "./Container";
import { getSetting } from "@/lib/db";
import { Sparkles } from "lucide-react";

export function Nav() {
  // server component (reads DB)
  const siteName = getSetting("site_name") || "awseen";
  return (
    <header className="border-b">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border">
              <Sparkles size={16} />
            </span>
            <span>{siteName}</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-5 text-sm text-gray-700">
            <Link href="/how-it-works" className="hover:underline">How it works</Link>
            <Link href="/insights" className="hover:underline">Insights</Link>
            <Link href="/faq" className="hover:underline">FAQ</Link>
          </nav>

          <Link
            href="/quiz"
            className="rounded-2xl bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            Start the Audit Quiz
          </Link>
        </div>
      </Container>
    </header>
  );
}
