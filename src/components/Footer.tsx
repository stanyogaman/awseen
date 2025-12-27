import { Container } from "./Container";
import { getSetting } from "@/lib/db";

export function Footer() {
  const company = getSetting("company_name") || "Ocean Drive Co., Ltd";
  const support = getSetting("support_line") || "Diagnostic service. No implementation. No upsells.";
  return (
    <footer className="border-t">
      <Container>
        <div className="py-10 text-sm text-gray-600 grid gap-2">
          <div>© {new Date().getFullYear()} {company}</div>
          <div className="text-xs">{support}</div>
        </div>
      </Container>
    </footer>
  );
}
