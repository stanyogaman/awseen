"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Lock, Save, Trash2, Plus, CreditCard, Mail, Globe, Users } from "lucide-react";

type Setting = { key: string; value: string };
type Article = { slug: string; title: string; description: string; body: string; kind: "insight" | "pillar" };
type OrderRow = {
  id: string;
  created_at: string;
  status: string;
  amount: string;
  currency: string;
  payer_email: string;
  lead_email: string;
  payload_json: string;
};
type LeadRow = { id: string; created_at: string; email: string; payload_json: string };

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("awseen_admin_token") || "";
}

function fmt(ts: string) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return ts;
  }
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);

  const [settings, setSettings] = useState<Setting[]>([]);
  const [insights, setInsights] = useState<Article[]>([]);
  const [pillar, setPillar] = useState<Article | null>(null);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);

  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = getToken();
    if (t) {
      setToken(t);
      setAuthed(true);
    }
  }, []);

  async function load() {
    setMsg("");
    const res = await fetch("/api/admin/bootstrap", { headers: { "x-admin-token": token } });
    if (!res.ok) {
      setMsg("Auth failed. Check token.");
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setSettings(data.settings || []);
    setInsights(data.insights || []);
    setPillar(data.pillar || null);
    setOrders(data.orders || []);
    setLeads(data.leads || []);
  }

  useEffect(() => {
    if (authed && token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, token]);

  function login() {
    localStorage.setItem("awseen_admin_token", token);
    setAuthed(true);
  }

  async function saveSettings() {
    setMsg("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ settings }),
    });
    setMsg(res.ok ? "Saved settings." : "Failed to save settings.");
    if (res.ok) load();
  }

  async function saveArticle(a: Article) {
    setMsg("");
    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": token },
      body: JSON.stringify({ article: a }),
    });
    setMsg(res.ok ? "Saved article." : "Failed to save article.");
    if (res.ok) load();
  }

  async function deleteInsight(slug: string) {
    if (!confirm("Delete this insight?")) return;
    setMsg("");
    const res = await fetch(`/api/admin/articles?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { "x-admin-token": token },
    });
    setMsg(res.ok ? "Deleted." : "Failed to delete.");
    if (res.ok) load();
  }

  function updateSetting(idx: number, value: string) {
    const copy = [...settings];
    copy[idx] = { ...copy[idx], value };
    setSettings(copy);
  }

  const paidCount = useMemo(() => {
    return orders.filter((o) => {
      const s = (o.status || "").toUpperCase();
      return s.includes("COMPLET") || s.includes("CAPTURE");
    }).length;
  }, [orders]);

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border p-6 grid gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <Lock size={18} /> Admin login
          </div>
          <input
            className="rounded-2xl border px-3 py-2"
            placeholder="Enter ADMIN_TOKEN"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button onClick={login} className="rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90">
            Login
          </button>
          <div className="text-xs text-gray-500">
            Set <b>ADMIN_TOKEN</b> in Railway env vars. This page stores token in your browser (localStorage).
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto grid gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">awseen Admin</h1>
          {msg ? <div className="text-sm text-gray-700 mt-1">{msg}</div> : null}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("awseen_admin_token");
            setAuthed(false);
            setToken("");
          }}
          className="rounded-2xl border px-4 py-2 hover:bg-gray-50"
        >
          Logout
        </button>
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        <KPI icon={CreditCard} label="Orders (50)" value={String(orders.length)} />
        <KPI icon={CreditCard} label="Paid (approx.)" value={String(paidCount)} />
        <KPI icon={Users} label="Leads (50)" value={String(leads.length)} />
        <KPI icon={Globe} label="Site" value="awseen.com" />
      </section>

      <section className="rounded-3xl border p-6 grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Site settings</div>
          <button
            onClick={saveSettings}
            className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90"
          >
            <Save size={16} /> Save
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {settings.map((s, idx) => (
            <div key={s.key} className="grid gap-1">
              <div className="text-xs text-gray-500">{s.key}</div>
              <input
                className="rounded-2xl border px-3 py-2"
                value={s.value}
                onChange={(e) => updateSetting(idx, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      {pillar ? <ArticleEditor title="Pillar article" article={pillar} onSave={saveArticle} /> : null}

      <section className="rounded-3xl border p-6 grid gap-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Insights</div>
          <button
            onClick={() =>
              setInsights([
                {
                  slug: "new-insight-" + Date.now(),
                  title: "New insight",
                  description: "Short description",
                  body: "Write content here.",
                  kind: "insight",
                },
                ...insights,
              ])
            }
            className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="grid gap-4">
          {insights.map((a) => (
            <div key={a.slug} className="rounded-3xl border p-5">
              <div className="grid gap-2">
                <div className="text-xs text-gray-500">slug</div>
                <input className="rounded-2xl border px-3 py-2" value={a.slug} readOnly />
                <div className="text-xs text-gray-500">title</div>
                <input
                  className="rounded-2xl border px-3 py-2"
                  value={a.title}
                  onChange={(e) =>
                    setInsights(insights.map((x) => (x.slug === a.slug ? { ...x, title: e.target.value } : x)))
                  }
                />
                <div className="text-xs text-gray-500">description</div>
                <input
                  className="rounded-2xl border px-3 py-2"
                  value={a.description}
                  onChange={(e) =>
                    setInsights(insights.map((x) => (x.slug === a.slug ? { ...x, description: e.target.value } : x)))
                  }
                />
                <div className="text-xs text-gray-500">body</div>
                <textarea
                  className="rounded-2xl border px-3 py-2 min-h-[160px]"
                  value={a.body}
                  onChange={(e) =>
                    setInsights(insights.map((x) => (x.slug === a.slug ? { ...x, body: e.target.value } : x)))
                  }
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => saveArticle({ ...a, kind: "insight" })}
                  className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90"
                >
                  <Save size={16} /> Save
                </button>
                <button
                  onClick={() => deleteInsight(a.slug)}
                  className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border p-6 grid gap-4">
        <div className="font-semibold flex items-center gap-2">
          <CreditCard size={18} /> Recent orders
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Order ID</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2 pr-3">Lead email</th>
                <th className="py-2 pr-3">Payer email</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="py-2 pr-3 whitespace-nowrap">{fmt(o.created_at)}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{o.id}</td>
                  <td className="py-2 pr-3">{o.status}</td>
                  <td className="py-2 pr-3">
                    {o.amount} {o.currency}
                  </td>
                  <td className="py-2 pr-3">{o.lead_email}</td>
                  <td className="py-2 pr-3">{o.payer_email}</td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td className="py-3 text-gray-600" colSpan={6}>
                    No orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-gray-500">
          Tip: push orders to Make/n8n/Telegram using <b>ORDERS_WEBHOOK_URL</b> (env var).
        </div>
      </section>

      <section className="rounded-3xl border p-6 grid gap-4">
        <div className="font-semibold flex items-center gap-2">
          <Mail size={18} /> Recent leads
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-3">Time</th>
                <th className="py-2 pr-3">Lead ID</th>
                <th className="py-2 pr-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="py-2 pr-3 whitespace-nowrap">{fmt(l.created_at)}</td>
                  <td className="py-2 pr-3 font-mono text-xs">{l.id}</td>
                  <td className="py-2 pr-3">{l.email}</td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td className="py-3 text-gray-600" colSpan={3}>
                    No leads yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="text-xs text-gray-500">
          Tip: push leads using <b>LEADS_WEBHOOK_URL</b>.
        </div>
      </section>
    </div>
  );
}

function KPI({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-3xl border p-5">
      <div className="flex items-center gap-2 text-gray-600 text-xs">
        <Icon size={14} /> {label}
      </div>
      <div className="text-xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function ArticleEditor({
  title,
  article,
  onSave,
}: {
  title: string;
  article: Article;
  onSave: (a: Article) => void;
}) {
  const [a, setA] = useState<Article>(article);
  useEffect(() => setA(article), [article.slug]);

  return (
    <section className="rounded-3xl border p-6 grid gap-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{title}</div>
        <button
          onClick={() => onSave(a)}
          className="inline-flex items-center gap-2 rounded-2xl bg-black text-white px-4 py-2 hover:opacity-90"
        >
          <Save size={16} /> Save
        </button>
      </div>

      <div className="grid gap-3">
        <div className="text-xs text-gray-500">title</div>
        <input className="rounded-2xl border px-3 py-2" value={a.title} onChange={(e) => setA({ ...a, title: e.target.value })} />
        <div className="text-xs text-gray-500">description</div>
        <input className="rounded-2xl border px-3 py-2" value={a.description} onChange={(e) => setA({ ...a, description: e.target.value })} />
        <div className="text-xs text-gray-500">body</div>
        <textarea className="rounded-2xl border px-3 py-2 min-h-[220px]" value={a.body} onChange={(e) => setA({ ...a, body: e.target.value })} />
      </div>
    </section>
  );
}
