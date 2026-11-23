"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { SCROLL_SPRING } from "@/lib/motion";
import { Logo } from "./logo";

/** The closing logo. It rises from behind its mask as the page ends, fading in on the way. */
export function FooterLogo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(useSpring(scrollYProgress, SCROLL_SPRING), [0, 1], ["70%", "0%"]);

  return (
    <div ref={ref} className="footer-logo">
      <motion.div className="footer-logo-inner" style={{ y }}>
        <Logo className={`logo-wait block h-auto w-full ${inView ? "is-drawn" : ""}`} />
      </motion.div>
    </div>
  );
}
