"use client";

import { motion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { EASE_CUT, SCROLL_SPRING } from "@/lib/motion";

/**
 * The reel, or the photo, or a flat dark placeholder until either is added. A light panel wipes
 * away to uncover it. It starts inset to the page margins and grows to full width as it scrolls up,
 * while the picture inside settles from slightly closer, then it holds briefly.
 */
export function HeroMedia({ photo, reelUrl }: { photo?: string | null; reelUrl?: string | null }) {
  const stageRef = useRef<HTMLElement>(null);
  const [playReel, setPlayReel] = useState(false);
  const isEmpty = !photo && !reelUrl;

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start 50%", "start start"],
  });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const mediaScale = useTransform(progress, [0, 1], [1.08, 1]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Visitors who asked their phone to save data get the photo instead of a video download.
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData;
    if (reelUrl && !reducedMotion && !saveData) setPlayReel(true);
  }, [reelUrl]);

  return (
    <section ref={stageRef} id="reel" aria-label="Reel" className="reel-stage mt-f55 md:mt-[72px]">
      <motion.div className="reel-frame" style={{ "--reel": progress } as MotionStyle}>
        {!isEmpty && (
          <motion.div className="reel-media absolute inset-0" style={{ scale: mediaScale }}>
            {photo && (
              <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
            )}
            {playReel && reelUrl && (
              <video
                src={reelUrl}
                poster={photo ?? undefined}
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </motion.div>
        )}
        {isEmpty && (
          <div className="reel-empty pt-3.5">
            <p className="text-xs leading-none">Reel</p>
          </div>
        )}
        <motion.div
          aria-hidden="true"
          className="reel-wipe"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1, delay: 0.45, ease: EASE_CUT }}
        />
      </motion.div>
    </section>
  );
}
