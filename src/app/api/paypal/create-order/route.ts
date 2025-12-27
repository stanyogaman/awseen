import { NextResponse } from "next/server";
import { paypalAccessToken } from "@/lib/paypal";

export async function POST() {
  const price = process.env.AUDIT_PRICE_USD || "129";
  const currency = process.env.AUDIT_CURRENCY || "USD";

  const { token, baseUrl } = await paypalAccessToken();

  const res = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "awseen — Website Revenue Audit (Report + Video Walkthrough)",
          amount: { currency_code: currency, value: String(price) },
        },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Create order failed: ${res.status} ${text}` },
      { status: 500 }
    );
  }

  const data = await res.json();
  return NextResponse.json({ id: data.id });
}
