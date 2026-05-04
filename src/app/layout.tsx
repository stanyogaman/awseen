import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AWSEEN — AI Websites & Agents That Close Deals",
  description:
    "AI-powered websites, Telegram bots, CRM automations, and sales agents for businesses that want more leads and faster follow-up.",
  metadataBase: new URL("https://awseen.com"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AWSEEN — AI Websites & Agents That Close Deals",
    description:
      "Landing pages, AI sales agents, Telegram bots, CRM automation, and website audits for businesses worldwide.",
    url: "https://awseen.com",
    siteName: "AWSEEN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AWSEEN — AI Websites & Agents That Close Deals",
    description: "Websites, AI agents, bots, and CRM automations built for lead capture.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
