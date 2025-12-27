"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import React from "react";

function readLead() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("awseen_last_lead_payload");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function PayPalCheckout() {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const lead = readLead();

  return (
    <PayPalScriptProvider options={{ clientId, currency: "USD", intent: "capture" }}>
      <div className="rounded-2xl border p-5">
        <div className="text-sm text-gray-600 mb-3">Secure one-time payment via PayPal.</div>

        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={async () => {
            const res = await fetch("/api/paypal/create-order", { method: "POST" });
            const data = (await res.json()) as { id?: string; error?: string };
            if (!data.id) throw new Error(data.error || "Failed to create order");
            return data.id;
          }}
          onApprove={async (data) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID, lead }),
            });
            const out = await res.json();
            if (!out.ok) throw new Error("Payment capture failed");
            router.push("/thank-you");
          }}
        />

        <div className="text-xs text-gray-500 mt-3">No subscriptions. No upsells.</div>
      </div>
    </PayPalScriptProvider>
  );
}
