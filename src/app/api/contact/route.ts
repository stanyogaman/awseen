import { NextResponse } from "next/server";
import { z } from "zod";
import { insertLead } from "@/lib/db";

const ContactLeadSchema = z.object({
  name: z.string().min(2).max(120),
  contact: z.string().min(3).max(180),
  email: z.string().email().optional().nullable(),
  telegram: z.string().max(120).optional().nullable(),
  business: z.string().max(160).optional().default(""),
  plan: z.string().max(160).optional().default(""),
  message: z.string().max(5000).optional().default(""),
  source: z.string().max(100).optional().default("awseen_landing"),
});

function uid() {
  return "lead_" + Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function postWebhook(url: string | undefined, payload: unknown) {
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Lead webhook failed", error);
  }
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

  const lead = {
    id,
    created_at,
    name: payload.name,
    contact: payload.contact,
    email: payload.email,
    telegram: payload.telegram,
    business: payload.business,
    plan: payload.plan,
    message: payload.message,
    source: payload.source,
    status: "new",
    crm_note: `Новая заявка AWSEEN: ${payload.name} / ${payload.plan || "без выбранного пакета"}`,
  };

  insertLead({
    id,
    created_at,
    email: leadContact,
    payload_json: JSON.stringify(lead),
  });

  await Promise.all([
    postWebhook(process.env.LEADS_WEBHOOK_URL, lead),
    postWebhook(process.env.GOOGLE_SHEETS_WEBHOOK_URL, lead),
    postWebhook(process.env.YANDEX_TABLES_WEBHOOK_URL, lead),
    postWebhook(process.env.CRM_WEBHOOK_URL, lead),
    postWebhook(process.env.TELEGRAM_WEBHOOK_URL, lead),
  ]);

  return NextResponse.json({ ok: true, leadId: id });
}
