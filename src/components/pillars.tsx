"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { anchorFor } from "@/lib/anchor";
import { toneClass } from "./media-frame";

type Service = { name: string; summary: string; image?: string | null };

/**
 * The four pillars as tall columns. One column is open at a time: its picture or color wipes up
 * and its headline appears inside it.
 * A mouse opens a column on hover. On phones the columns stack and open as they reach mid-screen.
 */
export function Pillars({ services }: { services: readonly Service[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: hover) and (min-width: 768px)").matches) return;
    const items = [...(listRef.current?.children ?? [])];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(items.indexOf(entry.target));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={listRef} className="pillars">
      {services.map((service, index) => (
        <li key={service.name} className="pillar" data-active={index === active}>
          <Link
            href={`/services#${anchorFor(service.name)}`}
            className={`pillar-link ${toneClass(index)}`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActive(index);
            }}
            onFocus={() => setActive(index)}
          >
            <span className="pillar-fill">
              {service.image && (
                <>
                  <Image
                    src={service.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 25vw, 100vw"
                    className="object-cover"
                  />
                  <span className="pillar-scrim" />
                </>
              )}
              <span className="pillar-head">
                <span className="block">{service.summary}</span>
                <span className="pillar-pill">Explore {service.name}</span>
              </span>
            </span>
            <span className="pillar-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="pillar-name">
              Our
              <br />
              {service.name}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
