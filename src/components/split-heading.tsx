"use client";

import { useEffect, useRef } from "react";

/**
 * A heading whose lines slide up from behind a mask, one after the other. The page title (h1) plays
 * on arrival. Section headings (h2) wait until they scroll into view.
 */
export function SplitHeading({
  text,
  className = "",
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const waitsForView = Tag === "h2";

  useEffect(() => {
    const heading = ref.current;
    if (!heading) return;
    let cancelled = false;

    const play = () => {
      // Lines depend on the final font, so wait for it, but never hold the title back for long.
      Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 600)),
      ]).then(() => {
        if (cancelled) return;
        const words = [...heading.querySelectorAll<HTMLElement>(".split-word")];
        const lineTops = [...new Set(words.map((word) => word.offsetTop))];
        words.forEach((word) => {
          word.style.setProperty("--line", String(lineTops.indexOf(word.offsetTop)));
        });
        heading.classList.add("is-in");
      });
    };

    if (!waitsForView) {
      play();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          play();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(heading);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [waitsForView]);

  const words = text.trim().split(/\s+/);

  return (
    <Tag ref={ref} className={`${waitsForView ? "split-late " : ""}${className}`}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="split-word">
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
