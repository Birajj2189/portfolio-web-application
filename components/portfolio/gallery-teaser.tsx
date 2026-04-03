"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, Camera, Images } from "lucide-react"
import {
  sectionFlow,
  sectionFlowItem,
  sectionGrid,
  sectionGridItem,
  sectionViewport,
} from "@/lib/section-motion"

export function GalleryTeaser() {
  const reduce = useReducedMotion()

  return (
    <section id="gallery" className="scroll-mt-24 px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={reduce ? undefined : sectionFlow}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
        >
          <motion.div variants={reduce ? undefined : sectionFlowItem} className="mb-12">
            <div className="flex items-center gap-4">
              <Images className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">My World</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : sectionGrid}
            className="grid items-center gap-10 lg:grid-cols-2"
          >
            <motion.div variants={reduce ? undefined : sectionGridItem} className="space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Life beyond the code — a curated visual diary of the places I&apos;ve been, the
                events I&apos;ve attended, and the moments worth remembering.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Each photo tells a small story. Together they paint a fuller picture of who I am
                outside the terminal.
              </p>
              <motion.div
                whileHover={
                  reduce
                    ? undefined
                    : { y: -3, transition: { type: "spring", stiffness: 400, damping: 28 } }
                }
              >
                <Link
                  href="/gallery"
                  className="glass-card group inline-flex items-center gap-3 rounded-2xl px-6 py-4 transition-colors hover:border-primary/50"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 transition-colors group-hover:bg-primary/30">
                    <Camera className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Open Gallery</p>
                    <p className="text-sm text-muted-foreground">Browse the full collection</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={reduce ? undefined : sectionGridItem}
              className="relative"
              whileHover={reduce ? undefined : { scale: 1.01 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-2xl" />

              <div className="relative w-full">
                <div className="relative rounded-t-xl border border-b-0 border-white/10 bg-[#1a1a1a] p-2 shadow-2xl">
                  <div className="absolute top-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#333]" />
                  <div className="overflow-hidden rounded-lg bg-background">
                    <div className="flex items-center gap-2 border-b border-border bg-secondary/50 px-3 py-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <span className="ml-2 rounded-full bg-background px-3 py-0.5 font-mono text-xs text-muted-foreground">
                        devspace://gallery
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 p-3">
                      {[
                        {
                          id: "p-a",
                          col: "col-span-2 row-span-2",
                          h: "h-28",
                          color: "bg-primary/20",
                          delay: "0s",
                        },
                        {
                          id: "p-b",
                          col: "col-span-1 row-span-1",
                          h: "h-[52px]",
                          color: "bg-accent/20",
                          delay: "0.15s",
                        },
                        {
                          id: "p-c",
                          col: "col-span-1 row-span-1",
                          h: "h-[52px]",
                          color: "bg-chart-3/20",
                          delay: "0.30s",
                        },
                        {
                          id: "p-d",
                          col: "col-span-1 row-span-1",
                          h: "h-[52px]",
                          color: "bg-chart-2/20",
                          delay: "0.45s",
                        },
                        {
                          id: "p-e",
                          col: "col-span-1 row-span-1",
                          h: "h-[52px]",
                          color: "bg-chart-5/20",
                          delay: "0.60s",
                        },
                        {
                          id: "p-f",
                          col: "col-span-1 row-span-1",
                          h: "h-[52px]",
                          color: "bg-primary/10",
                          delay: "0.75s",
                        },
                      ].map((cell) => (
                        <div
                          key={cell.id}
                          className={`${cell.col} ${cell.h} animate-pulse rounded-lg ${cell.color} flex items-center justify-center`}
                          style={{ animationDelay: cell.delay }}
                        >
                          <Camera className="h-4 w-4 text-white/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="h-3 rounded-b-sm bg-gradient-to-b from-[#2a2a2a] to-[#1f1f1f]">
                  <div className="mx-auto h-0.5 w-1/3 rounded-full bg-[#111]" />
                </div>
                <div className="mx-auto h-1.5 w-1/4 rounded-b-sm bg-[#252525]" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
