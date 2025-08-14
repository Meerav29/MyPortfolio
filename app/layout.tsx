import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meerav Shah — Portfolio",
  description: "CS @ Penn State (Astrophysics minor). Research scientist & builder for AI in education and space tech.",
  metadataBase: new URL("https://meeravshah.vercel.app"),
  openGraph: {
    title: "Meerav Shah Portfolio",
    description: "AI x EdTech x SpaceTech.",
    url: "/",
    siteName: "Meerav Shah",
    images: ["/headshot.png"], // put headshot.png in /public
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerav Shah Portfolio",
    description: "AI x EdTech x SpaceTech.",
    images: ["/headshot.png"],
  },
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-slate-100 selection:bg-blue-200">
        <Header />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
