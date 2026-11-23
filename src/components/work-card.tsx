"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { Project } from "@/lib/content";
import { MediaFrame } from "./media-frame";

const SPRING = { stiffness: 500, damping: 40, mass: 0.4 };

/**
 * A project card. With a mouse, hovering plays the preview clip and a label follows the cursor.
 * On touch screens the clip plays while the card is in view.
 */
export function WorkCard({ project, index }: { project: Project; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovering, setHovering] = useState(false);
  const [playing, setPlaying] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const labelX = useSpring(pointerX, SPRING);
  const labelY = useSpring(pointerY, SPRING);
  const clip = project.previewClip;

  const play = () => {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Visitors who asked their phone to save data keep the cover instead of a video download.
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
      return;
    }
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false), // A missing clip or a blocked autoplay leaves the cover showing.
    );
  };

  const stop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !window.matchMedia("(hover: none)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) play();
        else stop();
      },
      { threshold: 0.6 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [clip]);

  const moveLabel = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(event.clientX - bounds.left);
    pointerY.set(event.clientY - bounds.top);
  };

  return (
    <Link href={`/work/${project.slug}`} className="work-card block">
      <div
        className="work-frame relative overflow-hidden"
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          pointerX.jump(event.clientX - bounds.left);
          pointerY.jump(event.clientY - bounds.top);
          labelX.jump(event.clientX - bounds.left);
          labelY.jump(event.clientY - bounds.top);
          setHovering(true);
          play();
        }}
        onPointerMove={moveLabel}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          setHovering(false);
          stop();
        }}
      >
        <MediaFrame
          src={project.cover}
          alt={project.title}
          sizes="(min-width: 768px) 62vw, 100vw"
          ratio="1.618 : 1"
          tone={index}
        />
        {clip && (
          <video
            ref={videoRef}
            src={clip}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <motion.span
          aria-hidden="true"
          className="work-cursor type-label"
          data-visible={hovering}
          style={{ x: labelX, y: labelY }}
        >
          {clip ? "Play" : "View"}
        </motion.span>
      </div>
      <div className="work-meta mt-f13 flex items-baseline gap-f13">
        <span className="type-label text-index">{String(index + 1).padStart(2, "0")}</span>
        <span className="work-title min-w-0 flex-1 text-[17px] font-bold">
          {project.title}
          <span aria-hidden="true" className="work-arrow">
            {" "}
            →
          </span>
        </span>
        <span className="work-category shrink-0 text-sm text-muted">{project.category}</span>
      </div>
    </Link>
  );
}
