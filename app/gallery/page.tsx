"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Camera, Images, Tag, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { useGalleryStore } from "@/store/gallery.store"
import { strapiImageUrl } from "@/lib/gallery"
import type { GalleryTile } from "@/types/gallery"

// ─────────────────────────────────────────────────────────────────────────────
// Bento span map
// ─────────────────────────────────────────────────────────────────────────────
const SPAN_MAP: Record<string, string> = {
  "1x1": "col-span-1 row-span-1",
  "1x2": "col-span-1 row-span-2",
  "2x1": "col-span-2 row-span-1",
  "2x2": "col-span-2 row-span-2",
}

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox
// ─────────────────────────────────────────────────────────────────────────────
interface LightboxProps {
  tiles: GalleryTile[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function Lightbox({ tiles, index, onClose, onPrev, onNext }: Readonly<LightboxProps>) {
  const tile = tiles[index]
  const src = strapiImageUrl(tile.image?.url ?? "")

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    globalThis.addEventListener("keydown", handler)
    return () => globalThis.removeEventListener("keydown", handler)
  }, [onClose, onPrev, onNext])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/92 backdrop-blur-xl">
      {/* Backdrop */}
      <button
        aria-label="Close lightbox"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:scale-105 hover:bg-white/25"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Prev */}
      <button
        onClick={onPrev}
        className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25 md:left-10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Image */}
      <div className="relative z-10 flex max-h-[85vh] max-w-[80vw] flex-col items-center gap-4">
        <div
          className="relative w-[75vw] max-w-4xl overflow-hidden rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
          style={{ aspectRatio: "16/10" }}
        >
          <Image
            src={src}
            alt={tile.image?.alternativeText ?? tile.caption ?? "Gallery photo"}
            fill
            priority
            className="object-contain"
            sizes="80vw"
          />
        </div>
        {(tile.caption || tile.tag) && (
          <div className="flex flex-col items-center gap-2">
            {tile.tag && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/80 px-3 py-1 text-xs font-medium text-primary-foreground">
                <Tag className="h-3 w-3" />
                {tile.tag}
              </span>
            )}
            {tile.caption && <p className="text-sm text-white/70">{tile.caption}</p>}
          </div>
        )}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25 md:right-10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dot strip counter */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {tiles.map((_, i) => (
          <span
            key={_.id}
            className={`block rounded-full transition-all duration-300 ${i === index ? "h-2 w-5 bg-white" : "h-2 w-2 bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Bento tile
// ─────────────────────────────────────────────────────────────────────────────
interface BentoTileProps {
  tile: GalleryTile
  onOpen: () => void
  /** First bento cells are in the initial viewport — improves LCP when Strapi images are largest paint. */
  priority?: boolean
}

function BentoTile({ tile, onOpen, priority = false }: Readonly<BentoTileProps>) {
  const spanClass = SPAN_MAP[tile.size] ?? SPAN_MAP["1x1"]
  const src = strapiImageUrl(tile.image?.formats?.medium?.url ?? tile.image?.url ?? "")

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`${spanClass} group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-card text-left`}
    >
      {src ? (
        <Image
          src={src}
          alt={tile.image?.alternativeText ?? tile.caption ?? "Gallery photo"}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-secondary">
          <Camera className="h-10 w-10 text-muted-foreground/30" />
        </div>
      )}

      {/* Hover — dark overlay + zoom icon */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <ZoomIn className="h-5 w-5 text-white" />
        </div>
        {tile.tag && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/80 px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            <Tag className="h-3 w-3" />
            {tile.tag}
          </span>
        )}
      </div>

      {/* Caption strip */}
      {tile.caption && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/85 via-black/50 to-transparent px-3 pt-8 pb-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <p className="line-clamp-2 text-xs leading-snug font-medium text-white">{tile.caption}</p>
        </div>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading skeleton
// ─────────────────────────────────────────────────────────────────────────────
function GallerySkeleton() {
  const items = [
    { id: "sk-a", span: "col-span-2 row-span-2", delay: "0s" },
    { id: "sk-b", span: "col-span-1 row-span-1", delay: "0.05s" },
    { id: "sk-c", span: "col-span-1 row-span-1", delay: "0.1s" },
    { id: "sk-d", span: "col-span-1 row-span-2", delay: "0.15s" },
    { id: "sk-e", span: "col-span-2 row-span-1", delay: "0.2s" },
    { id: "sk-f", span: "col-span-1 row-span-1", delay: "0.25s" },
    { id: "sk-g", span: "col-span-1 row-span-1", delay: "0.3s" },
    { id: "sk-h", span: "col-span-1 row-span-1", delay: "0.35s" },
  ]
  return (
    <div className="grid auto-rows-[180px] grid-cols-4 gap-3">
      {items.map(({ id, span, delay }) => (
        <div
          key={id}
          className={`${span} animate-pulse rounded-xl bg-white/5`}
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MacBook frame
// — The bezel fills the full container width.
// — Screen has a fixed height that fills the lower portion of the viewport.
// — Content scrolls inside the screen.
// ─────────────────────────────────────────────────────────────────────────────
interface MacbookFrameProps {
  children: React.ReactNode
  activeTag: string | null
  photoCount: number
}

function MacbookFrame({ children, activeTag, photoCount }: Readonly<MacbookFrameProps>) {
  const bezelRef = useRef<HTMLDivElement>(null)
  const [glare, setGlare] = useState({ x: 50, y: 30, opacity: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = bezelRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setGlare({ x, y, opacity: 0.06 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setGlare((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <div className="relative w-full">
      {/* Subtle glow behind the device */}
      <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-primary/8 blur-3xl" />

      {/* Bezel */}
      {}
      <div
        ref={bezelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-t-[18px] border border-white/12 bg-gradient-to-b from-[#323234] to-[#1e1e20] px-3 pt-3 pb-2 shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_50px_100px_rgba(0,0,0,0.7)]"
      >
        {/* Camera notch */}
        <div className="mb-2.5 flex items-center justify-center">
          <div className="h-1.5 w-1.5 rounded-full bg-[#3a3a3c] shadow-inner ring-1 ring-black/50" />
        </div>

        {/* Screen area */}
        <div className="relative overflow-hidden rounded-lg bg-[#0d0d0f]">
          {/* Screen glare */}
          <div
            className="pointer-events-none absolute inset-0 z-30 rounded-lg transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 55%)`,
            }}
          />

          {/* Browser toolbar */}
          <div className="relative z-20 flex items-center gap-3 border-b border-white/8 bg-[#18181b] px-4 py-2.5">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <span className="group/tl flex h-3 w-3 cursor-default items-center justify-center rounded-full bg-[#ff5f57] shadow-sm ring-1 ring-black/20 transition-opacity hover:opacity-80">
                <X className="h-1.5 w-1.5 text-[#6a0f00] opacity-0 transition-opacity group-hover/tl:opacity-100" />
              </span>
              <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-sm ring-1 ring-black/20" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-sm ring-1 ring-black/20" />
            </div>

            {/* Back / forward */}
            <div className="flex items-center gap-0.5">
              <button className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-white/8 hover:text-white/60">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:bg-white/8 hover:text-white/60">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* URL bar */}
            <div className="flex min-w-0 flex-1 items-center justify-center">
              <div className="flex max-w-md flex-1 items-center gap-2 rounded-lg bg-white/6 px-3 py-1 ring-1 ring-white/8">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-white/50">
                  devspace://gallery{activeTag ? `?tag=${encodeURIComponent(activeTag)}` : ""}
                </span>
              </div>
            </div>

            {/* Count chip */}
            <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 ring-1 ring-primary/20">
              <Camera className="h-3 w-3 text-primary" />
              <span className="font-mono text-xs text-primary">{photoCount}</span>
            </div>
          </div>

          {/* Scrollable content — height fills viewport nicely */}
          <div className="h-[calc(100vh-380px)] max-h-[700px] min-h-[400px] overflow-y-auto overscroll-contain scroll-smooth [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin]">
            <div className="p-4">{children}</div>
          </div>

          {/* Bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 rounded-b-lg bg-gradient-to-t from-[#0d0d0f] to-transparent" />
        </div>
      </div>

      {/* Hinge bar */}
      <div className="relative h-[12px] rounded-b-sm bg-gradient-to-b from-[#3a3a3c] to-[#1a1a1c] shadow-lg">
        <div className="absolute inset-x-[8%] top-0 h-px rounded-full bg-white/8" />
        <div className="absolute top-[3px] left-1/2 h-[5px] w-[18%] -translate-x-1/2 rounded-full bg-black/50" />
      </div>

      {/* Base platform */}
      <div className="mx-[5%] h-[7px] rounded-b-2xl bg-gradient-to-b from-[#2e2e30] to-[#1c1c1e] shadow-2xl" />
      <div className="mx-[12%] h-[3px] rounded-b-xl bg-[#181818] shadow-lg" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { data, status, errorMessage, fetch: fetchGallery } = useGalleryStore()
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchGallery()
  }, [fetchGallery])

  const sorted = [...(data?.tiles ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const tags = Array.from(new Set(sorted.map((t) => t.tag).filter(Boolean))) as string[]
  const filtered = activeTag ? sorted.filter((t) => t.tag === activeTag) : sorted
  const header = data?.header

  const openLightbox = useCallback((idx: number) => setLightboxIndex(idx), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(
    () =>
      setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  )
  const nextPhoto = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length)),
    [filtered.length]
  )

  return (
    <div className="dot-pattern min-h-screen bg-background">
      {/* Ambient orbs */}
      <div className="animate-pulse-glow pointer-events-none fixed top-1/3 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/6 blur-3xl" />
      <div
        className="animate-pulse-glow pointer-events-none fixed right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-accent/6 blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Full-height layout */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-10 md:px-10 md:py-12">
        {/* ── Top bar ── */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
          {/* Left: back + title */}
          <div>
            <Link
              href="/"
              className="glass-card mb-5 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>

            <div className="flex items-center gap-3">
              <Images className="h-6 w-6 shrink-0 text-primary" />
              <h1 className="text-3xl leading-tight font-bold md:text-4xl">
                {header?.title ?? "My World"}
              </h1>
            </div>
            <p className="mt-2 font-mono text-base text-primary">
              {header?.subtitle ?? "A window into life beyond the code"}
            </p>
            {header?.description && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {header.description}
              </p>
            )}
          </div>

          {/* Right: tag filters */}
          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => setActiveTag(null)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTag === null
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "glass-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "glass-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── MacBook — fills remaining height ── */}
        <div className="flex-1">
          <MacbookFrame activeTag={activeTag} photoCount={filtered.length}>
            {(status === "idle" || status === "loading") && <GallerySkeleton />}

            {status === "error" && (
              <div className="flex flex-col items-center gap-4 py-24 text-center">
                <Camera className="h-14 w-14 text-white/20" />
                <p className="text-sm text-white/50">{errorMessage}</p>
                <button
                  onClick={fetchGallery}
                  className="rounded-xl bg-primary px-5 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            )}

            {status === "success" && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-24 text-center">
                <Camera className="h-14 w-14 text-white/20" />
                <p className="text-sm text-white/50">No photos in this category yet.</p>
              </div>
            )}

            {status === "success" && filtered.length > 0 && (
              <div className="grid auto-rows-[180px] grid-cols-4 gap-3">
                {filtered.map((tile, idx) => (
                  <BentoTile
                    key={tile.id}
                    tile={tile}
                    priority={idx < 6}
                    onOpen={() => openLightbox(idx)}
                  />
                ))}
              </div>
            )}
          </MacbookFrame>
        </div>

        {/* Subtle footer note */}
        {status === "success" && filtered.length > 0 && (
          <p className="mt-6 text-center text-xs text-muted-foreground/60">
            {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
            {activeTag ? ` · tagged "${activeTag}"` : " · click any photo to view"}
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered.length > 0 && (
        <Lightbox
          tiles={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </div>
  )
}
