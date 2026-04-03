/** How the next palette is built (golden-angle hues + S/L ranges). */
export type PaletteStyle = "vivid" | "soft" | "deep" | "mixed"

const GOLDEN_ANGLE = 137.508

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hn = ((h % 360) + 360) % 360
  const sn = Math.max(0, Math.min(100, s)) / 100
  const ln = Math.max(0, Math.min(100, l)) / 100

  let r: number
  let g: number
  let b: number
  if (sn === 0) {
    r = g = b = ln
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t
      if (tt < 0) tt += 1
      if (tt > 1) tt -= 1
      if (tt < 1 / 6) return p + (q - p) * 6 * tt
      if (tt < 1 / 2) return q
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
      return p
    }
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
    const p = 2 * ln - q
    const hk = hn / 360
    r = hue2rgb(p, q, hk + 1 / 3)
    g = hue2rgb(p, q, hk)
    b = hue2rgb(p, q, hk - 1 / 3)
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0")).join("")
  )
}

export function hslToHex(h: number, s: number, l: number): string {
  const [r, g, b] = hslToRgb(h, s, l)
  return rgbToHex(r, g, b)
}

function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function slForStyle(style: PaletteStyle, index: number): { s: number; l: number } {
  if (style === "vivid") {
    return { s: randomInRange(62, 96), l: randomInRange(42, 58) }
  }
  if (style === "soft") {
    return { s: randomInRange(26, 48), l: randomInRange(74, 90) }
  }
  if (style === "deep") {
    return { s: randomInRange(52, 88), l: randomInRange(20, 36) }
  }
  const modes = ["vivid", "soft", "deep"] as const
  const pick = modes[index % modes.length]
  return slForStyle(pick, index)
}

/**
 * Builds a cohesive set of hex colors using golden-angle hue spacing so swatches stay distinct.
 */
export function generateColorPalette(style: PaletteStyle, count = 5): string[] {
  const baseHue = Math.random() * 360
  const out: string[] = []
  for (let i = 0; i < count; i += 1) {
    const h = (baseHue + i * GOLDEN_ANGLE) % 360
    const { s, l } = slForStyle(style, i)
    out.push(hslToHex(h, s, l))
  }
  return out
}

/** Curated default aligned with the site accent family (SSR-safe). */
export const DEFAULT_PLAYGROUND_PALETTE = [
  "#14b8a6",
  "#ec4899",
  "#f97316",
  "#eab308",
  "#8b5cf6",
] as const
