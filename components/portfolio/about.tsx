"use client"

import { Code2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { AboutCardShell } from "@/components/portfolio/about-card-shell"
import { Card } from "@/components/ui/card"
import { SplineScene } from "@/components/ui/spline-scene"
import { Spotlight } from "@/components/ui/spotlight"
import {
  sectionFlow,
  sectionFlowItem,
  sectionList,
  sectionListItem,
  sectionViewport,
} from "@/lib/section-motion"
import type { AboutData } from "@/types/portfolio"
import { cn } from "@/lib/utils"

const DEFAULT_SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

interface AboutProps {
  data: AboutData
}

function resolveSplineSceneUrl(data: AboutData): string {
  const fromCms = data.splineSceneUrl?.trim()
  if (fromCms) return fromCms
  const fromEnv = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL?.trim()
  if (fromEnv) return fromEnv
  return DEFAULT_SPLINE_SCENE
}

export function About({ data }: AboutProps) {
  const reduce = useReducedMotion()
  const sceneUrl = resolveSplineSceneUrl(data)

  const bioParagraphs: string[] = (data.bio ?? [])
    .map((block: unknown) => {
      const b = block as { type: string; children?: { text: string }[] }
      if (b.type === "paragraph") {
        return (b.children ?? []).map((c) => c.text).join("")
      }
      return ""
    })
    .filter(Boolean)

  return (
    <section
      id="about"
      className="about-section-minimal relative flex min-h-screen scroll-mt-24 flex-col justify-center px-4 py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          variants={reduce ? undefined : sectionFlow}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
        >
          <motion.div variants={reduce ? undefined : sectionFlowItem} className="mb-8 sm:mb-10">
            <div className="flex items-center gap-4">
              <Code2 className="h-6 w-6 shrink-0 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">About Me</h2>
              <div className="h-px min-w-[2rem] flex-1 bg-border" />
            </div>
          </motion.div>

          <motion.div variants={reduce ? undefined : sectionFlowItem}>
            <AboutCardShell reducedMotion={!!reduce}>
              <Card
                className={cn(
                  "flex min-h-0 w-full flex-col overflow-hidden border-border/50 bg-card/82 p-0 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md",
                  "lg:min-h-[min(560px,72vh)] lg:flex-row"
                )}
              >
                <Spotlight
                  className="-top-40 left-0 md:-top-32 md:left-[10%] lg:-top-24 lg:left-[18%]"
                  fill="oklch(0.75 0.15 180)"
                />

                <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 p-6 sm:p-8 lg:max-w-[min(100%,28rem)] lg:shrink-0 lg:p-10 xl:max-w-md">
                  <motion.div
                    variants={reduce ? undefined : sectionList}
                    className="space-y-4 sm:space-y-5"
                  >
                    {bioParagraphs.length > 0 ? (
                      bioParagraphs.map((para, i) => (
                        <motion.p
                          key={i}
                          variants={reduce ? undefined : sectionListItem}
                          className="text-base leading-relaxed text-muted-foreground sm:text-lg"
                        >
                          {para}
                        </motion.p>
                      ))
                    ) : (
                      <motion.p
                        variants={reduce ? undefined : sectionListItem}
                        className="text-base leading-relaxed text-muted-foreground sm:text-lg"
                      >
                        Passionate software engineer crafting elegant digital experiences.
                      </motion.p>
                    )}
                  </motion.div>

                  {data.techStack && data.techStack.length > 0 ? (
                    <motion.div
                      variants={reduce ? undefined : sectionList}
                      className="flex flex-wrap gap-2 border-t border-border/50 pt-5"
                    >
                      {data.techStack.map((tech) => (
                        <motion.span
                          key={tech}
                          variants={reduce ? undefined : sectionListItem}
                          className="rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs text-muted-foreground sm:text-sm"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : null}
                </div>

                <div
                  className={cn(
                    "relative z-10 min-h-[260px] w-full flex-1 sm:min-h-[320px]",
                    "lg:min-h-0 lg:min-w-0"
                  )}
                >
                  {reduce ? (
                    <div className="flex h-full min-h-[inherit] items-center justify-center bg-muted/25 px-6 text-center text-sm text-muted-foreground">
                      3D scene is hidden when reduced motion is enabled.
                    </div>
                  ) : (
                    <div className="absolute inset-0 min-h-[260px] sm:min-h-[320px] lg:min-h-full">
                      <SplineScene
                        scene={sceneUrl}
                        className="!absolute inset-0 min-h-full min-w-full"
                      />
                    </div>
                  )}
                </div>
              </Card>
            </AboutCardShell>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
