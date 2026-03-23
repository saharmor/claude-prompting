"use client";

import Link from "next/link";
import { siteName } from "@/lib/site-metadata";
import { SettingsPanel } from "./settings-panel";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground"
        >
          <span className="text-primary text-lg">&#9672;</span>
          {siteName}
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/learn"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Curriculum
          </Link>
          <SettingsPanel />
        </div>
      </nav>
    </header>
  );
}
