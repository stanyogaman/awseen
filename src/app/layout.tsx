import "./globals.css";
import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "awseen — Website Revenue Audit",
  description: "Revenue-focused website audits for e-commerce and service businesses.",
  metadataBase: new URL("https://awseen.com"),
  openGraph: {
    title: "awseen — Website Revenue Audit",
    description: "Find why your website doesn’t convert and what to fix first.",
    url: "https://awseen.com",
    siteName: "awseen",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
