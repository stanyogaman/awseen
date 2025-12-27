import { NextResponse } from "next/server";
import { LeadSchema } from "@/lib/validators";
import { insertLead } from "@/lib/db";

function uid() {
  return "ld_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = LeadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const id = uid();
  const created_at = new Date().toISOString();

  insertLead({
    id,
    created_at,
    email: payload.email,
    payload_json: JSON.stringify(payload),
  });

  console.log("NEW_LEAD", payload);

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, created_at, ...payload }),
      });
    } catch (e) {
      console.warn("Lead webhook failed", e);
    }
  }

  return NextResponse.json({ ok: true, leadId: id });
}
