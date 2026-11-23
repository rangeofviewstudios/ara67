"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Brings content in as it enters view, once. Plain only marks it as visible, for sections whose
 * own parts have their motion, such as a heading and a drawn line.
 */
export function Reveal({
  children,
  className = "",
  plain = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  plain?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${plain ? "reveal-plain" : "reveal"} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
