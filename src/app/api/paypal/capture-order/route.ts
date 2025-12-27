import { NextResponse } from "next/server";
import { paypalAccessToken } from "@/lib/paypal";
import { insertOrder } from "@/lib/db";

function safeStr(v: any) {
  return typeof v === "string" ? v : v ? String(v) : "";
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { orderID?: string; lead?: any };
  const orderID = body.orderID;
  if (!orderID) return NextResponse.json({ ok: false, error: "Missing orderID" }, { status: 400 });

  const { token, baseUrl } = await paypalAccessToken();

  const res = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `Capture failed: ${res.status}`, details: data }, { status: 500 });
  }

  const status = safeStr(data.status || "CAPTURED");
  const purchase = data.purchase_units?.[0];
  const amountObj = purchase?.payments?.captures?.[0]?.amount || purchase?.amount || {};
  const amount = safeStr(amountObj.value || "");
  const currency = safeStr(amountObj.currency_code || "");
  const payer_email = safeStr(data.payer?.email_address || "");
  const lead_email = safeStr(body.lead?.email || "");
  const created_at = new Date().toISOString();

  insertOrder({
    id: orderID,
    created_at,
    status,
    amount: amount || safeStr(process.env.AUDIT_PRICE_USD || "129"),
    currency: currency || safeStr(process.env.AUDIT_CURRENCY || "USD"),
    payer_email,
    lead_email,
    payload_json: JSON.stringify({ capture: data, lead: body.lead || null }),
  });

  // Optional webhook: orders -> Make/n8n/Slack/Telegram etc.
  const ordersWebhook = process.env.ORDERS_WEBHOOK_URL;
  if (ordersWebhook) {
    try {
      await fetch(ordersWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderID,
          created_at,
          status,
          amount: amount || process.env.AUDIT_PRICE_USD || "129",
          currency: currency || process.env.AUDIT_CURRENCY || "USD",
          payer_email,
          lead_email,
          lead: body.lead || null,
        }),
      });
    } catch (e) {
      console.warn("Orders webhook failed", e);
    }
  }

  // Optional webhook: trigger sending email via automation (Make/n8n/SMTP)
  const emailWebhook = process.env.EMAIL_WEBHOOK_URL;
  const to = lead_email || payer_email;
  if (emailWebhook && to) {
    try {
      await fetch(emailWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject: "awseen — Website Audit confirmed (next steps)",
          template: "awseen_audit_confirmation_v1",
          data: {
            order_id: orderID,
            amount: amount || process.env.AUDIT_PRICE_USD || "129",
            currency: currency || process.env.AUDIT_CURRENCY || "USD",
          },
        }),
      });
    } catch (e) {
      console.warn("Email webhook failed", e);
    }
  }

  return NextResponse.json({ ok: true, data });
}
