"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonLabel } from "./button-label";

/** A phone-only booking button that appears once the hero's own button has scrolled away. */
export function StickyBook() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const visible = scrolled && !formInView;

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 480);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Steps aside once the footer's own form is on screen.
  useEffect(() => {
    const form = document.querySelector(".footer-booking");
    if (!form) return;
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting));
    observer.observe(form);
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg px-5 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] transition-[translate,visibility] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        visible ? "translate-y-0" : "invisible translate-y-full"
      }`}
    >
      <Link href="/contact" className="button-primary w-full">
        <ButtonLabel>Book a conversation</ButtonLabel>
      </Link>
    </div>
  );
}
