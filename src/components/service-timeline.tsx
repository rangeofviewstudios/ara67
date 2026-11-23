"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { anchorFor } from "@/lib/anchor";
import { SCROLL_SPRING } from "@/lib/motion";
import { MediaFrame } from "./media-frame";
import { Reveal } from "./reveal";

type Service = { name: string; summary: string; image?: string | null };

/**
 * The four phases on an edit timeline, with a playhead driven by scrolling.
 * On larger screens the stage pins and each phase swaps in. On phones the phases stack under a
 * sticky ruler. The pinning lives in globals.css, so without JavaScript or with reduced motion
 * this stays a plain list.
 */
export function ServiceTimeline({ services }: { services: Service[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = services.length;

  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, () => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return 0;

    // Pinned, every phase gets an equal share of the scroll.
    if (getComputedStyle(stage).position === "sticky") {
      const bounds = track.getBoundingClientRect();
      return Math.min(1, Math.max(0, -bounds.top / (bounds.height - stage.offsetHeight)));
    }

    // Stacked, phases differ in height, so follow whichever one has reached the reading line,
    // a quarter of the way down the screen below the ruler.
    const rulerHeight = stage.querySelector<HTMLElement>(".svc-ruler")?.offsetHeight ?? 0;
    const readingLine = rulerHeight + window.innerHeight * 0.25;
    const panels = [...stage.querySelectorAll<HTMLElement>(".svc-panel")];
    const current = panels.findLastIndex(
      (panel) => panel.getBoundingClientRect().top <= readingLine,
    );
    if (current < 0) return 0;
    const bounds = panels[current].getBoundingClientRect();
    const within = Math.min(1, (readingLine - bounds.top) / bounds.height);
    return (current + within) / panels.length;
  });
  // The phase changes on the true position. The ruler glides after it.
  const smooth = useSpring(progress, SCROLL_SPRING);
  const playhead = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(progress, "change", (value) => {
    setActive(Math.min(count - 1, Math.floor(value * count)));
  });

  // A link to one phase. Pinned, the phases share one spot on screen, so the browser can't find
  // them by itself: scroll to the middle of that phase's share of the track.
  useEffect(() => {
    function goToPhase(behavior: ScrollBehavior) {
      const index = services.findIndex(
        (service) => anchorFor(service.name) === window.location.hash.slice(1),
      );
      const track = trackRef.current;
      const stage = stageRef.current;
      if (index < 0 || !track || !stage) return;
      if (getComputedStyle(stage).position !== "sticky") return;
      const run = track.offsetHeight - stage.offsetHeight;
      const top = track.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + run * ((index + 0.5) / services.length), behavior });
    }
    const onHashChange = () => goToPhase("smooth");
    const frame = requestAnimationFrame(() => goToPhase("instant"));
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [services]);

  return (
    <div
      ref={trackRef}
      className="svc-track mt-f55 md:mt-f89"
      style={{ "--svc-count": count } as CSSProperties}
    >
      <div ref={stageRef} className="svc-stage">
        <div aria-hidden="true" className="svc-ruler">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            {services.map((service, index) => (
              <span
                key={service.name}
                className={`type-label truncate pr-2 transition-colors duration-200 ${
                  index === active ? "text-fg" : "text-muted"
                }`}
              >
                <span className="hidden md:inline">{String(index + 1).padStart(2, "0")} </span>
                {service.name}
              </span>
            ))}
          </div>
          <div className="svc-rail">
            <motion.div
              className="absolute inset-0 origin-left bg-accent"
              style={{ scaleX: smooth }}
            />
            <motion.span
              className="absolute -top-1.5 -bottom-1.5 -ml-0.5 w-0.5 bg-fg"
              style={{ left: playhead }}
            />
          </div>
        </div>

        <ol className="svc-panels">
          {services.map((service, index) => (
            <li
              key={service.name}
              id={anchorFor(service.name)}
              className="svc-panel"
              data-active={index === active}
              data-past={index < active}
            >
              <Reveal className="svc-copy">
                <span className="type-label text-index">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="svc-name mt-2">
                  <span>{service.name}</span>
                </h2>
                <p className="svc-summary text-trim mt-f34 max-w-[40ch] text-lg text-muted">
                  {service.summary}
                </p>
              </Reveal>
              <Reveal delay={120} className="svc-image">
                <MediaFrame
                  src={service.image}
                  alt={service.name}
                  sizes="(min-width: 768px) 62vw, 100vw"
                  ratio="1.618 : 1"
                  tone={index}
                />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
