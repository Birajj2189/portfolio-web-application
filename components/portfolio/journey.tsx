"use client"

import { Rocket, Award, Lightbulb, BookOpen } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { getIcon } from "@/lib/icon-map"
import {
  sectionFlow,
  sectionFlowItem,
  sectionList,
  sectionListItem,
  sectionViewport,
} from "@/lib/section-motion"
import type { JourneyData } from "@/types/portfolio"

interface JourneyProps {
  data: JourneyData
}

export function Journey({ data }: JourneyProps) {
  const reduce = useReducedMotion()

  return (
    <section id="journey" className="scroll-mt-24 px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={reduce ? undefined : sectionFlow}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
        >
          <motion.div variants={reduce ? undefined : sectionFlowItem} className="mb-12">
            <div className="flex items-center gap-4">
              <Rocket className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">My Journey</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : sectionFlowItem}
            className="grid gap-8 lg:grid-cols-3"
          >
            <div className="lg:col-span-2">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                Career Timeline
              </h3>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-6 w-px bg-border" />

                <motion.div className="space-y-8" variants={reduce ? undefined : sectionList}>
                  {data.timeline?.map((item) => {
                    const Icon = getIcon(item.icon)
                    const bgColor = item.color.replace("text-", "bg-") + "/20"
                    return (
                      <motion.div
                        key={item.id}
                        variants={reduce ? undefined : sectionListItem}
                        className="group relative flex gap-6"
                      >
                        <div
                          className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bgColor} transition-transform group-hover:scale-110`}
                        >
                          <Icon className={`h-5 w-5 ${item.color}`} />
                        </div>

                        <div className="glass-card flex-1 rounded-xl p-5 transition-colors hover:border-primary/30">
                          <div className="mb-2 flex items-center gap-3">
                            <span className="font-mono text-sm text-primary">{item.year}</span>
                            <span className="h-px w-4 bg-border" />
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              </div>
            </div>

            <motion.aside variants={reduce ? undefined : sectionList} className="space-y-8">
              <motion.div
                variants={reduce ? undefined : sectionListItem}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Lightbulb className="h-5 w-5 text-chart-3" />
                  What I&apos;m Exploring
                </h3>
                <div className="space-y-4">
                  {data.exploring?.map((item) => (
                    <div key={item.id} className="group">
                      <h4 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                        {item.topic}
                      </h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={reduce ? undefined : sectionListItem}
                className="glass-card rounded-xl p-6"
              >
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Award className="h-5 w-5 text-chart-3" />
                  Achievements
                </h3>
                <div className="space-y-4">
                  {data.achievements?.map((item) => (
                    <div key={item.id} className="group">
                      <h4 className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.aside>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
