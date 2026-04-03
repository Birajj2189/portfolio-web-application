import type { Transition, Variants } from "framer-motion"

/** Shared ease-out for landing sections (matches playground). */
export const SECTION_EASE: [number, number, number, number] = [0.19, 1, 0.22, 1]

export const sectionViewport = {
  once: true as const,
  amount: 0.2 as const,
  margin: "0px 0px -12% 0px" as const,
}

const baseDuration = (duration: number): Transition => ({
  duration,
  ease: SECTION_EASE,
})

/** Top-level block: header row, then major columns (stagger). */
export const sectionFlow: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
}

export const sectionFlowItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseDuration(0.8),
  },
}

/** Card grids (projects, wide tiles). */
export const sectionGrid: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.06 },
  },
}

export const sectionGridItem: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseDuration(0.82),
  },
}

/** Optional subtle scale-in (bento / featured). */
export const sectionGridItemScale: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: baseDuration(0.85),
  },
}

/** Lists: timeline rows, paragraphs, badges. */
export const sectionList: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.075, delayChildren: 0.04 },
  },
}

export const sectionListItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseDuration(0.65),
  },
}

/** Intro lines: eyebrow, title, subtitle. */
export const sectionIntro: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
}

export const sectionIntroLine: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseDuration(0.78),
  },
}

/** Footer strip. */
export const sectionFooterReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: baseDuration(0.65),
  },
}
