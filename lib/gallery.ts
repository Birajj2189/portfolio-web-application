import type { GalleryData, GalleryResponse } from "@/types/gallery"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1330"

export function strapiImageUrl(url: string): string {
  // If the URL is already absolute (starts with http), return as-is.
  // Otherwise prepend the Strapi base URL (Strapi v4 stores relative paths).
  if (url.startsWith("http")) return url
  return `${STRAPI_URL}${url}`
}

export async function fetchGallery(): Promise<GalleryData> {
  const res = await fetch(`${STRAPI_URL}/api/gallery?populate=deep`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch gallery data: ${res.status} ${res.statusText}`)
  }

  const json: GalleryResponse = await res.json()
  const raw = json?.data ?? json
  return (raw?.attributes ?? raw) as GalleryData
}
