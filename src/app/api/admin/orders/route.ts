import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/validators";
import { getOrders } from "@/lib/db";

export async function GET(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!requireAdminToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const limit = Math.min(200, Math.max(1, Number(url.searchParams.get("limit") || "50")));
  return NextResponse.json({ orders: getOrders(limit) });
}
