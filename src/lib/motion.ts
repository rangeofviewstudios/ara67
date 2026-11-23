/*
 * The Ara67 motion language, shared with the matching tokens in globals.css.
 * Settle: things arriving and coming to rest. Cut: things crossing the frame, like a wipe.
 * Nothing bounces. This is an edit, not a toy.
 */
export const EASE_CUT = [0.76, 0, 0.24, 1] as const;

/** Takes the steps out of mouse-wheel scrolling on anything tied to scroll position, without taking over the scroll itself. */
export const SCROLL_SPRING = { stiffness: 140, damping: 34, mass: 0.35 };
