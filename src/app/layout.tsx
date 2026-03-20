import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
import {
  siteAuthor,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site-metadata";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: siteName,
  description: siteDescription,
  authors: [{ name: siteAuthor, url: "https://saharmor.me" }],
  creator: siteAuthor,
  publisher: siteAuthor,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          Built for aspiring prompt engineers by <a href="https://saharmor.me" target="_blank" rel="noopener noreferrer">Sahar Mor</a>. Not affiliated with Anthropic.
        </footer>
      </body>
    </html>
  );
}
