import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/validators";
import { getSettings, getArticle, getInsights, getOrders, getLeads } from "@/lib/db";

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!requireAdminToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const settings = getSettings();
  const pillar = getArticle("why-websites-dont-convert");
  const insights = getInsights();
  const orders = getOrders(50);
  const leads = getLeads(50);

  return NextResponse.json({ settings, pillar, insights, orders, leads });
}
