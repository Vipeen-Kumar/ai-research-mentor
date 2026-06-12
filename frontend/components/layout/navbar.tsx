"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Share2 } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",     href: "/" },
  { label: "Roadmaps", href: "/roadmaps" },
  { label: "About",    href: "/about" },
  { label: "Contact",  href: "/contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Glass bar */}
      <div className="border-b border-white/[0.07] bg-[#0a0f1c]/80 backdrop-blur-xl">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
            aria-label="AI Research Mentor — home"
          >
            <span className="text-cyan-400">
              <Share2 className="h-5 w-5" />
            </span>
            <span className="font-semibold tracking-tight text-white">
              AI Research Mentor
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-white",
                  ].join(" ")}
                >
                  {/* Active indicator pill */}
                  {active && (
                    <span
                      className="absolute inset-0 rounded-lg bg-white/[0.07] ring-1 ring-white/10"
                      aria-hidden
                    />
                  )}
                  <span className="relative">{label}</span>
                  {/* Active underline dot */}
                  {active && (
                    <span
                      className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                      aria-hidden
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile: simple pill links */}
          <div className="flex items-center gap-1 md:hidden">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={[
                    "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-white/10 text-white ring-1 ring-white/10"
                      : "text-slate-400 hover:text-white",
                  ].join(" ")}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}
