"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-belgium-border bg-belgium-black/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex gap-1">
            <div className="w-2 h-6 bg-black border border-gold-800" />
            <div className="w-2 h-6 bg-gold-500" />
            <div className="w-2 h-6 bg-red-600" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight group-hover:text-gold-400 transition-colors">
            Belgium Events
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`font-body text-sm transition-colors hover:text-gold-400 ${
              pathname === "/" ? "text-gold-400" : "text-belgium-muted"
            }`}
          >
            Events
          </Link>
          <Link
            href="/admin"
            className={`font-mono text-xs uppercase tracking-widest border px-3 py-1.5 transition-colors ${
              pathname === "/admin"
                ? "border-gold-500 text-gold-400"
                : "border-belgium-border text-belgium-muted hover:border-gold-700 hover:text-gold-500"
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
