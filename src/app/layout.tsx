import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/nav-bar";
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
  title: "PromptCraft - Master Claude Prompt Engineering",
  description:
    "Interactive exercises to sharpen your prompt engineering skills with Claude. Practice real techniques, get instant feedback, and level up your prompting.",
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
