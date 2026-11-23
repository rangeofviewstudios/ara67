"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import type { Project } from "@/lib/content";
import { toneClass } from "./media-frame";
import { Reveal } from "./reveal";

const FOLLOW = { stiffness: 260, damping: 32, mass: 0.5 };

/** One project's picture in the hover preview and the phone thumbnail. */
function Preview({
  project,
  index,
  active,
}: {
  project: Project;
  index: number;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active) {
      video.pause();
      video.currentTime = 0;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Visitors who asked their phone to save data keep the cover instead of a video download.
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) {
      return;
    }
    video.play().catch(() => {}); // A missing clip or a blocked autoplay leaves the cover showing.
  }, [active]);

  return (
    <div
      className={`work-preview-layer ${project.cover ? "" : toneClass(index)}`}
      data-active={active}
    >
      {project.cover && (
        <Image src={project.cover} alt="" fill sizes="30vw" className="object-cover" />
      )}
      {project.previewClip && (
        <video
          ref={videoRef}
          src={project.previewClip}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {!project.cover && !project.previewClip && (
        <span className="absolute top-3.5 left-3.5 text-xs leading-none">Loop on hover</span>
      )}
    </div>
  );
}

/**
 * Selected work as an edit list. The hovered or focused row holds full strength while the others
 * drop back, and a preview follows it down the list. Phones get a small thumbnail in each row.
 */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const y = useMotionValue(0);
  const followY = useSpring(y, FOLLOW);

  const openRow = (index: number, row: Element) => {
    const list = listRef.current;
    if (!list) return;
    const bounds = row.getBoundingClientRect();
    const center = bounds.top + bounds.height / 2 - list.getBoundingClientRect().top;
    y.set(center);
    // Opening from closed, the preview appears at the row instead of sliding in from the last one.
    if (active === null) followY.jump(center);
    setActive(index);
  };

  return (
    <div>
      <div aria-hidden="true" className="work-row work-row-head">
        <span className="work-no">No.</span>
        <span className="work-name">Title</span>
        <span className="work-client">Client</span>
        <span className="work-type">Type</span>
        <span className="work-runtime">Runtime</span>
        <span className="work-year">Year</span>
      </div>
      <div
        ref={listRef}
        className="work-list"
        data-hovering={active !== null}
        onPointerLeave={() => setActive(null)}
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setActive(null);
        }}
      >
        <ol>
          {projects.map((project, index) => (
            <li key={project.slug} className="work-item" data-active={index === active}>
              <Reveal plain className="draw-line">
                <Link
                  href={`/work/${project.slug}`}
                  className="work-row"
                  style={{ "--row-delay": `${index * 50}ms` } as CSSProperties}
                  onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
                    if (event.pointerType === "mouse") openRow(index, event.currentTarget);
                  }}
                  onFocus={(event) => openRow(index, event.currentTarget)}
                >
                  <span
                    aria-hidden="true"
                    className={`work-thumb ${project.cover ? "" : toneClass(index)}`}
                  >
                    {project.cover && (
                      <Image src={project.cover} alt="" fill sizes="88px" className="object-cover" />
                    )}
                  </span>
                  <span className="work-no">{String(index + 1).padStart(3, "0")}</span>
                  <span className="work-name">
                    <span className="work-name-text">{project.title}</span>
                    <span className="work-sub">
                      {[project.client, project.category].filter(Boolean).join(" · ")}
                    </span>
                  </span>
                  <span className="work-client">{project.client}</span>
                  <span className="work-type">{project.category}</span>
                  <span className="work-runtime">{project.runtime}</span>
                  <span className="work-year">{project.year}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
        <motion.div
          aria-hidden="true"
          className="work-preview"
          data-visible={active !== null}
          style={{ y: followY }}
        >
          <div className="work-preview-frame">
            {projects.map((project, index) => (
              <Preview
                key={project.slug}
                project={project}
                index={index}
                active={index === active}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
