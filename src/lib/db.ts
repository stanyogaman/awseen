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

export type ProductRow = {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  sort_order: number;
  is_active: number;
};

export type CmsPageRow = {
  slug: string;
  title: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  sections_json: string;
  is_published: number;
  updated_at: string;
};

export type MediaAssetRow = {
  id: string;
  created_at: string;
  title: string;
  url: string;
  alt: string;
  provider: string;
};

export type PaymentRow = {
  id: string;
  created_at: string;
  status: string;
  amount: string;
  currency: string;
  payer_email: string;
  lead_email: string;
  payload_json: string;
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

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      category TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS cms_pages (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      seo_title TEXT NOT NULL,
      seo_description TEXT NOT NULL,
      seo_keywords TEXT NOT NULL,
      sections_json TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      title TEXT NOT NULL,
      url TEXT NOT NULL,
      alt TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'cloudflare-r2'
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
    tx([
      ...Object.entries(defaultSettings).map(([key, value]) => ({ key, value: String(value) })),
      { key: "site_language", value: "ru" },
      { key: "primary_offer", value: "AI-отдел продаж для малого бизнеса" },
      { key: "crm_targets", value: "Google Sheets, Яндекс Таблицы, Битрикс24, amoCRM" },
      { key: "payments", value: "ЮKassa опционально" },
      { key: "media_storage", value: "Cloudflare R2" },
    ]);
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

  const pCount = db.prepare("SELECT COUNT(*) as c FROM products").get() as any;
  if (pCount.c === 0) seedProducts(db);

  const pageCount = db.prepare("SELECT COUNT(*) as c FROM cms_pages").get() as any;
  if (pageCount.c === 0) seedPages(db);
}

function seedProducts(db: Database.Database) {
  const products: ProductRow[] = [
    {
      id: "audit-48h",
      title: "AI-аудит продаж и заявок за 48 часов",
      description: "Проверка сайта, карточек Яндекс/2ГИС/VK, форм, источников заявок, 10 конкретных проблем и схема автоматизации.",
      price: "7 000–15 000 ₽ или бесплатно для тёплого клиента",
      category: "audit",
      sort_order: 10,
      is_active: 1,
    },
    {
      id: "content-reputation-29",
      title: "AI-контент и репутация",
      description: "Упаковка Яндекс.Карт, 2ГИС, VK и сайта: описания, фото, отзывы, ответы, акции, посты и мини-воронка заявок.",
      price: "от 29 000 ₽",
      category: "reputation",
      sort_order: 20,
      is_active: 1,
    },
    {
      id: "crm-control-49",
      title: "CRM и заявки под контроль за 7 дней",
      description: "Простая CRM, статусы сделок, формы, уведомления, шаблоны сообщений, отчёт по заявкам и инструкция для владельца.",
      price: "49 000 ₽ + поддержка от 15 000 ₽/мес",
      category: "crm",
      sort_order: 30,
      is_active: 1,
    },
    {
      id: "site-crm-metrika-79",
      title: "Сайт + CRM + заявки + Яндекс.Метрика",
      description: "WordPress-сайт, форма заявки, CRM, цели в Метрике, базовое SEO, уведомления и шаблоны сообщений.",
      price: "79 000 ₽",
      category: "website",
      sort_order: 40,
      is_active: 1,
    },
    {
      id: "booking-salon",
      title: "Онлайн-запись для салона / студии",
      description: "Мини-сайт, онлайн-запись, карточки услуг, расписание, уведомления, база клиентов, автонапоминания и сбор отзывов.",
      price: "40 000–85 000 ₽ + поддержка 10 000–20 000 ₽/мес",
      category: "booking",
      sort_order: 50,
      is_active: 1,
    },
    {
      id: "woocommerce-crm",
      title: "Интернет-магазин WooCommerce + оплата + CRM",
      description: "Каталог, корзина, оплата, уведомления, CRM, статусы заказов, email/SMS и интеграции с доставкой по задаче.",
      price: "120 000–250 000 ₽",
      category: "ecommerce",
      sort_order: 60,
      is_active: 1,
    },
    {
      id: "b2b-ai-leads",
      title: "B2B-лидогенерация с ИИ",
      description: "База компаний, сегментация, КП, письма, скрипты звонков, CRM-воронка и система касаний для промышленности, стройки и поставщиков.",
      price: "20 000–180 000 ₽",
      category: "b2b",
      sort_order: 70,
      is_active: 1,
    },
    {
      id: "ai-sales-department",
      title: "AI-отдел продаж под ключ",
      description: "Мини-сайт или аудит, CRM, формы, мессенджеры, автоответы, шаблоны, AI-скрипты, отчёты и ежемесячное сопровождение.",
      price: "90 000–250 000 ₽",
      category: "automation",
      sort_order: 80,
      is_active: 1,
    },
  ];

  const ins = db.prepare(
    "INSERT INTO products (id,title,description,price,category,sort_order,is_active) VALUES (@id,@title,@description,@price,@category,@sort_order,@is_active)"
  );
  const tx = db.transaction((rows: ProductRow[]) => rows.forEach((row) => ins.run(row)));
  tx(products);
}

function seedPages(db: Database.Database) {
  const now = new Date().toISOString();
  const pages: CmsPageRow[] = [
    {
      slug: "home",
      title: "Главная",
      seo_title: "AWSEEN — сайты, CRM, AI-агенты и автоматизация заявок",
      seo_description: "WordPress-сайты, CRM, AI-агенты, Telegram/VK/Max уведомления, Google Sheets, Яндекс Таблицы и ЮKassa для малого бизнеса.",
      seo_keywords: "сайт визитка, CRM, AI агент, WordPress, ЮKassa, Google Sheets, Яндекс Таблицы, Красноярск",
      sections_json: JSON.stringify([
        { id: "hero", title: "AI-отдел продаж для малого бизнеса", type: "hero" },
        { id: "products", title: "Продукты и пакеты", type: "products" },
        { id: "crm", title: "Заявки в CRM и таблицы", type: "crm" },
      ], null, 2),
      is_published: 1,
      updated_at: now,
    },
  ];
  const ins = db.prepare(
    "INSERT INTO cms_pages (slug,title,seo_title,seo_description,seo_keywords,sections_json,is_published,updated_at) VALUES (@slug,@title,@seo_title,@seo_description,@seo_keywords,@sections_json,@is_published,@updated_at)"
  );
  const tx = db.transaction((rows: CmsPageRow[]) => rows.forEach((row) => ins.run(row)));
  tx(pages);
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

/* Products */
export function getProducts() {
  const db = getDb();
  return db.prepare("SELECT id,title,description,price,category,sort_order,is_active FROM products ORDER BY sort_order, title").all() as ProductRow[];
}

export function upsertProduct(p: ProductRow) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO products (id,title,description,price,category,sort_order,is_active)
    VALUES (@id,@title,@description,@price,@category,@sort_order,@is_active)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      description=excluded.description,
      price=excluded.price,
      category=excluded.category,
      sort_order=excluded.sort_order,
      is_active=excluded.is_active
  `
  ).run(p);
}

export function deleteProduct(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM products WHERE id=?").run(id);
}

/* Pages */
export function getCmsPages() {
  const db = getDb();
  return db.prepare("SELECT slug,title,seo_title,seo_description,seo_keywords,sections_json,is_published,updated_at FROM cms_pages ORDER BY slug").all() as CmsPageRow[];
}

export function upsertCmsPage(page: CmsPageRow) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO cms_pages (slug,title,seo_title,seo_description,seo_keywords,sections_json,is_published,updated_at)
    VALUES (@slug,@title,@seo_title,@seo_description,@seo_keywords,@sections_json,@is_published,@updated_at)
    ON CONFLICT(slug) DO UPDATE SET
      title=excluded.title,
      seo_title=excluded.seo_title,
      seo_description=excluded.seo_description,
      seo_keywords=excluded.seo_keywords,
      sections_json=excluded.sections_json,
      is_published=excluded.is_published,
      updated_at=excluded.updated_at
  `
  ).run(page);
}

export function deleteCmsPage(slug: string) {
  const db = getDb();
  db.prepare("DELETE FROM cms_pages WHERE slug=?").run(slug);
}

/* Media */
export function getMediaAssets() {
  const db = getDb();
  return db.prepare("SELECT id,created_at,title,url,alt,provider FROM media_assets ORDER BY created_at DESC").all() as MediaAssetRow[];
}

export function upsertMediaAsset(asset: MediaAssetRow) {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO media_assets (id,created_at,title,url,alt,provider)
    VALUES (@id,@created_at,@title,@url,@alt,@provider)
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      url=excluded.url,
      alt=excluded.alt,
      provider=excluded.provider
  `
  ).run(asset);
}

export function deleteMediaAsset(id: string) {
  const db = getDb();
  db.prepare("DELETE FROM media_assets WHERE id=?").run(id);
}

/* Payments / future YooKassa */
export function insertPayment(args: PaymentRow) {
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

export function getPayments(limit = 50) {
  const db = getDb();
  return db
    .prepare(
      "SELECT id,created_at,status,amount,currency,payer_email,lead_email,payload_json FROM orders ORDER BY created_at DESC LIMIT ?"
    )
    .all(limit) as PaymentRow[];
}
