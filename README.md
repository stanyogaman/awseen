# awseen.com — Website Revenue Audit

Next.js + Tailwind + PayPal Checkout + Admin + SQLite.

## What’s included
- Landing + quiz (pre-analysis) + PayPal one-time payment
- Insights + pillar guide
- Admin panel (/admin): edit settings + articles + view recent leads + view captured PayPal orders
- SQLite storage (recommended: Railway Volume mounted at /data)

## Local run
1) Copy `.env.example` -> `.env.local`
2) Fill PayPal keys + set ADMIN_TOKEN
3) Install deps:
   npm i
4) Run:
   npm run dev

## Deploy (Railway)
- Set env vars from `.env.example`
- Recommended: add a Railway Volume mounted at `/data` (so DB persists)
- Build: `npm run build`
- Start: `npm run start`

## Webhooks (optional)
- LEADS_WEBHOOK_URL: receives lead JSON after quiz submit
- ORDERS_WEBHOOK_URL: receives order JSON after successful PayPal capture
- EMAIL_WEBHOOK_URL: receives {to, subject, template, data} so you can send emails via Make/n8n/SMTP

## Notes
- This is a diagnostic service. No implementation. No upsells.
