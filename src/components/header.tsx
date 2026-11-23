"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="page-gutter pt-f21 md:pt-f34">
      <div className="flex items-start justify-between gap-4 pb-f21 md:pb-f34">
        <div>
          <Link href="/" aria-label="Ara67 home" className="logo-link flex min-h-11 items-center">
            <Logo className="logo-draw h-6 w-auto md:h-[30px]" />
          </Link>
          <p className="header-tagline mt-f21">
            <span className="text-muted">Strategy &amp; Studio</span>
            <br />
            Creative House
          </p>
        </div>
        <nav aria-label="Main" className="ml-auto">
          <ul className="flex items-center gap-f21 sm:gap-[28px]">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link type-mono hover-line relative flex min-h-11 items-center ${
                      active ? "text-fg" : "text-muted"
                    }`}
                  >
                    {label}
                    {/* A marker that travels between links, like a playhead. */}
                    {active && (
                      <motion.span
                        layoutId="nav-marker"
                        aria-hidden="true"
                        className="nav-marker"
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {pathname !== "/" && <div className="header-line" />}
    </header>
  );
}
