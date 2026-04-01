import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const inter = Inter({ subsets: ["latin"] });

const description = `Personal academic homepage of ${profile.name}, ${profile.position} at ${profile.university}. Research interests: LLM Agent, AI Safety.`;

export const metadata: Metadata = {
  title: `${profile.name} | Academic Homepage`,
  description,
  keywords: ["academic", "research", "publications", "LLM", "AI Safety", "USTC", profile.name],
  authors: [{ name: profile.name }],
  openGraph: {
    title: `${profile.name} | Academic Homepage`,
    description,
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${profile.name} | Academic Homepage`,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
