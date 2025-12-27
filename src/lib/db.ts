import Database from "better-sqlite3";
import { defaultSettings, defaultPillar, defaultArticles } from "@/lib/seed";

export type Setting = { key: string; value: string };
export type Article = { slug: string; title: string; description: string; body: string; kind: "insight" | "pillar" };

export type LeadRow = {
  id: string;
  created_at: string;
  email: string;
  payload_json: string;
};

export type OrderRow = {
  id: string;            // PayPal order id
  created_at: string;    // ISO timestamp
  status: string;        // CAPTURED / COMPLETED etc.
  amount: string;        // "129.00"
  currency: string;      // "USD"
  payer_email: string;   // if available
  lead_email: string;    // from quiz
  payload_json: string;  // full capture response
};

function dbPath() {
  return process.env.DB_PATH || "./awseen.db";
}

let _db: Database.Database | null = null;

export function getDb() {
  if (_db) return _db;
  const path = dbPath();
  _db = new Database(path);
  _db.pragma("journal_mode = WAL");
  initSchema(_db);
  seedIfEmpty(_db);
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS articles (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      body TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('insight','pillar'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      email TEXT NOT NULL,
      payload_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL,
      amount TEXT NOT NULL,
      currency TEXT NOT NULL,
      payer_email TEXT NOT NULL,
      lead_email TEXT NOT NULL,
      payload_json TEXT NOT NULL
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const sCount = db.prepare("SELECT COUNT(*) as c FROM settings").get() as any;
  if (sCount.c === 0) {
    const ins = db.prepare("INSERT INTO settings (key, value) VALUES (@key, @value)");
    const tx = db.transaction((rows: { key: string; value: string }[]) => {
      for (const r of rows) ins.run(r);
    });
    tx(Object.entries(defaultSettings).map(([key, value]) => ({ key, value: String(value) })));
  }

  const aCount = db.prepare("SELECT COUNT(*) as c FROM articles").get() as any;
  if (aCount.c === 0) {
    const insA = db.prepare(
      "INSERT INTO articles (slug,title,description,body,kind) VALUES (@slug,@title,@description,@body,@kind)"
    );
    const txA = db.transaction((rows: any[]) => {
      for (const r of rows) insA.run(r);
    });
    txA([{ ...defaultPillar, kind: "pillar" }, ...defaultArticles.map((a) => ({ ...a, kind: "insight" }))]);
  }
}

/* Settings */
export function getSetting(key: string) {
  const db = getDb();
  const row = db.prepare("SELECT value FROM settings WHERE key=?").get(key) as any;
  return row?.value ?? "";
}

export function getSettings() {
  const db = getDb();
  return db.prepare("SELECT key, value FROM settings ORDER BY key").all() as Setting[];
}

export function upsertSetting(key: string, value: string) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO settings (key,value) VALUES (?,?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value
  `
  ).run(key, value);
}

/* Articles */
export function getInsights() {
  const db = getDb();
  return db
    .prepare("SELECT slug,title,description,body,kind FROM articles WHERE kind='insight' ORDER BY slug")
    .all() as Article[];
}

export function getArticle(slug: string) {
  const db = getDb();
  return db.prepare("SELECT slug,title,description,body,kind FROM articles WHERE slug=?").get(slug) as
    | Article
    | undefined;
}

export function upsertArticle(a: Article) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO articles (slug,title,description,body,kind)
    VALUES (@slug,@title,@description,@body,@kind)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      description=excluded.description,
      body=excluded.body,
      kind=excluded.kind
  `
  ).run(a);
}

export function deleteArticle(slug: string) {
  const db = getDb();
  db.prepare("DELETE FROM articles WHERE slug=? AND kind='insight'").run(slug);
}

/* Leads */
export function insertLead(args: { id: string; created_at: string; email: string; payload_json: string }) {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO leads (id,created_at,email,payload_json) VALUES (?,?,?,?)").run(
    args.id,
    args.created_at,
    args.email,
    args.payload_json
  );
}

export function getLeads(limit = 50) {
  const db = getDb();
  return db
    .prepare("SELECT id,created_at,email,payload_json FROM leads ORDER BY created_at DESC LIMIT ?")
    .all(limit) as LeadRow[];
}

/* Orders */
export function insertOrder(args: OrderRow) {
  const db = getDb();
  db.prepare(
    "INSERT OR REPLACE INTO orders (id,created_at,status,amount,currency,payer_email,lead_email,payload_json) VALUES (?,?,?,?,?,?,?,?)"
  ).run(
    args.id,
    args.created_at,
    args.status,
    args.amount,
    args.currency,
    args.payer_email,
    args.lead_email,
    args.payload_json
  );
}

export function getOrders(limit = 50) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id,created_at,status,amount,currency,payer_email,lead_email,payload_json FROM orders ORDER BY created_at DESC LIMIT ?"
    )
    .all(limit) as OrderRow[];
}
