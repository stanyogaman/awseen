import { NextResponse } from "next/server";
import { z } from "zod";
import { insertLead } from "@/lib/db";

const ContactLeadSchema = z.object({
  name: z.string().min(2).max(120),
  contact: z.string().min(3).max(180),
  email: z.string().email().optional().nullable(),
  telegram: z.string().max(120).optional().nullable(),
  business: z.string().max(160).optional().default(""),
  plan: z.string().max(120).optional().default(""),
  message: z.string().max(3000).optional().default(""),
  source: z.string().max(80).optional().default("awseen_landing"),
});

function uid() {
  return "ct_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = ContactLeadSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const id = uid();
  const created_at = new Date().toISOString();
  const leadContact = payload.email || payload.telegram || payload.contact;

  insertLead({
    id,
    created_at,
    email: leadContact,
    payload_json: JSON.stringify(payload),
  });

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, created_at, ...payload }),
      });
    } catch (error) {
      console.warn("Contact webhook failed", error);
    }
  }

  return NextResponse.json({ ok: true, leadId: id });
}
