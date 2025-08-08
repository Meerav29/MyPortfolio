import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meerav Shah — Portfolio",
  description: "Building AI-powered tools for education and space tech.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
