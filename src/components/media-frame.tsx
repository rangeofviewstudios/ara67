import Image from "next/image";

/** The four placeholder colors from the beige Figma frame. */
const TONES = ["tan", "forest", "sage", "slate"] as const;

export type MediaRatio = "2.39 : 1" | "1.85 : 1" | "16 : 9" | "4 : 5" | "1.618 : 1" | "1 : 1.618";

const RATIOS: Record<MediaRatio, string> = {
  "1.618 : 1": "1.618 / 1",
  "1 : 1.618": "1 / 1.618",
  "2.39 : 1": "2.39 / 1",
  "1.85 : 1": "1.85 / 1",
  "16 : 9": "16 / 9",
  "4 : 5": "4 / 5",
};

/** Picks a placeholder color. Any number works, so a list can just pass its index. */
export function toneClass(index: number) {
  return `tone-${TONES[index % TONES.length]}`;
}

/** A frame for real work. Until an image is added, shows a flat color block labelled with its ratio. */
export function MediaFrame({
  src,
  alt,
  sizes,
  priority,
  ratio = "16 : 9",
  tone = 0,
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  ratio?: MediaRatio;
  tone?: number;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden ${src ? "bg-surface" : toneClass(tone)}`}
      style={{ aspectRatio: RATIOS[ratio] }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="frame-inner absolute inset-0 p-3.5">
          <p className="text-xs leading-none">{ratio}</p>
        </div>
      )}
    </div>
  );
}
