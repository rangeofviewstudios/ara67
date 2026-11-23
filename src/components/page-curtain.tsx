"use client";

import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EASE_CUT } from "@/lib/motion";
import { Logo } from "./logo";

type Phase = "idle" | "covering" | "covered" | "leaving";

/**
 * The cut between pages: a dark panel rises, the route changes behind it, and it carries on up.
 * Works from the click itself, so every internal link gets it. Back and forward stay instant, and
 * anything a browser handles differently (new tabs, email links, same-page links) is left alone.
 */
export function PageCurtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const startPath = useRef(pathname);
  const safety = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.preventDefault();
      event.stopPropagation();
      target.current = url.pathname + url.search + url.hash;
      startPath.current = window.location.pathname;
      setPhase("covering");
    }
    // On window, in the capture phase, so this runs before the link's own navigation.
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, []);

  // The new page has arrived behind the panel. Hold a beat so the mark registers, then clear.
  useEffect(() => {
    if (phase === "covered" && pathname !== startPath.current) {
      clearTimeout(safety.current);
      const hold = setTimeout(() => setPhase("leaving"), 170);
      return () => clearTimeout(hold);
    }
  }, [pathname, phase]);

  useEffect(() => () => clearTimeout(safety.current), []);

  const covering = phase === "covering" || phase === "covered";

  return (
    <motion.div
      aria-hidden="true"
      className="page-curtain"
      data-phase={phase}
      initial={false}
      animate={{ scaleY: covering ? 1 : 0 }}
      style={{ transformOrigin: phase === "leaving" ? "top" : "bottom" }}
      transition={{ duration: covering ? 0.4 : 0.56, ease: EASE_CUT }}
      onAnimationComplete={() => {
        if (phase === "leaving") {
          setPhase("idle");
        } else if (phase === "covering" && target.current) {
          setPhase("covered");
          router.push(target.current);
          // A slow or failed page never leaves the visitor stuck behind the panel.
          safety.current = setTimeout(() => setPhase("leaving"), 6000);
        }
      }}
    >
      <Logo className="page-curtain-logo" />
    </motion.div>
  );
}
