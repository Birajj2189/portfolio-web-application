// ─────────────────────────────────────────────────────────────────────────────
// Strapi image format
// ─────────────────────────────────────────────────────────────────────────────
export interface StrapiImageFormat {
  url: string
  width: number
  height: number
}

export interface StrapiImage {
  id: number
  url: string
  alternativeText?: string
  width: number
  height: number
  formats?: {
    thumbnail?: StrapiImageFormat
    small?: StrapiImageFormat
    medium?: StrapiImageFormat
    large?: StrapiImageFormat
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery page header
// ─────────────────────────────────────────────────────────────────────────────
export interface GalleryHeader {
  title: string // e.g. "My World"
  subtitle: string // e.g. "A window into life beyond the code"
  description: string // longer paragraph shown below subtitle
}

// ─────────────────────────────────────────────────────────────────────────────
// A single photo tile in the bento grid
// ─────────────────────────────────────────────────────────────────────────────
export type BentoSize = "1x1" | "1x2" | "2x1" | "2x2"

export interface GalleryTile {
  id: number
  image: StrapiImage
  caption?: string // short text shown on hover overlay
  tag?: string // e.g. "Travel", "Events", "Life"
  size: BentoSize // controls grid span
  order: number // display order
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Gallery Single Type attributes
// ─────────────────────────────────────────────────────────────────────────────
export interface GalleryAttributes {
  header: GalleryHeader
  tiles: GalleryTile[]
}

export interface GalleryResponse {
  data: {
    id: number
    attributes: GalleryAttributes
  }
  meta: Record<string, unknown>
}

export type GalleryData = GalleryAttributes
