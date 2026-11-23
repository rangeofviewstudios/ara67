"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useRef } from "react";

/** Text that comes up from muted to full strength, word by word, as it is scrolled through. */
export function ScrubText({
  paragraphs,
  className = "",
}: {
  paragraphs: string[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 60%"] });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const words = ref.current?.querySelectorAll(".scrub-word");
    if (!words) return;
    const lit = Math.round(progress * words.length);
    words.forEach((word, index) => word.toggleAttribute("data-on", index < lit));
  });

  return (
    <div ref={ref} className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>
          {paragraph.split(/\s+/).map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className="scrub-word">{word}</span>{" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
