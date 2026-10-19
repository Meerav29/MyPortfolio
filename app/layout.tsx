import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/ringed-planet-round.svg",
  },
  title: "Meerav Shah — Portfolio",
  description: "CS @ Penn State (Astrophysics minor). Research scientist & builder for AI in education and space tech.",
  metadataBase: new URL("https://meeravshah.vercel.app"),
  openGraph: {
    title: "Meerav Shah Portfolio",
    description: "AI x EdTech x SpaceTech.",
    url: "/",
    siteName: "Meerav Shah",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Meerav Shah — Applied AI Engineer" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerav Shah Portfolio",
    description: "AI x EdTech x SpaceTech.",
    images: ["/og-image.png"],
  },
};

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import ThemeProvider from "@/components/ThemeProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground selection:bg-accent">
        <ThemeProvider>
          <Header />
          {children}
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}

