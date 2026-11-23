"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef } from "react";

const FPS = 24;
const PIXELS_PER_FRAME = 6;

function formatTimecode(frames: number) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const seconds = Math.floor(frames / FPS);
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % FPS)}`;
}

/** Runs along the page edge and counts frames as you scroll, as if the page were a film playing. */
export function ScrollTimecode() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const write = (y: number) => {
    if (ref.current) {
      ref.current.textContent = formatTimecode(Math.floor(Math.max(0, y) / PIXELS_PER_FRAME));
    }
  };

  useMotionValueEvent(scrollY, "change", write);
  useEffect(() => write(window.scrollY), []);

  return (
    <div ref={ref} aria-hidden="true" className="scroll-timecode type-label">
      00:00:00:00
    </div>
  );
}
