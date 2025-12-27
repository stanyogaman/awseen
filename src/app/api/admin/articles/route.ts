import { NextResponse } from "next/server";
import { requireAdminToken } from "@/lib/validators";
import { upsertArticle, deleteArticle } from "@/lib/db";

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!requireAdminToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null) as any;
  const a = body?.article;
  if (!a?.slug || !a?.title || !a?.description || !a?.body || !a?.kind) {
    return NextResponse.json({ error: "invalid article" }, { status: 400 });
  }

  upsertArticle({
    slug: String(a.slug),
    title: String(a.title),
    description: String(a.description),
    body: String(a.body),
    kind: a.kind === "pillar" ? "pillar" : "insight",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (!requireAdminToken(token)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "missing slug" }, { status: 400 });
  deleteArticle(slug);
  return NextResponse.json({ ok: true });
}
