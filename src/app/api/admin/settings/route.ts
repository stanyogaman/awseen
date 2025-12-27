import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/validators";
import { upsertSetting } from "@/lib/db";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!requireAdminToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as { settings?: { key: string; value: string }[] } | null;
  if (!body?.settings) {
    return NextResponse.json({ error: "missing settings" }, { status: 400 });
  }

  for (const s of body.settings) {
    if (!s.key) continue;
    upsertSetting(s.key, String(s.value ?? ""));
  }

  return NextResponse.json({ ok: true });
}
