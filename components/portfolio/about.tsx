"use client"

import { Code2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { getIcon } from "@/lib/icon-map"
import {
  SECTION_EASE,
  sectionFlow,
  sectionFlowItem,
  sectionList,
  sectionListItem,
  sectionViewport,
} from "@/lib/section-motion"
import type { AboutData } from "@/types/portfolio"

interface AboutProps {
  data: AboutData
}

export function About({ data }: AboutProps) {
  const reduce = useReducedMotion()

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
    <section id="about" className="scroll-mt-24 px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="grid gap-12 lg:grid-cols-2"
          variants={reduce ? undefined : sectionFlow}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
        >
          <motion.div variants={reduce ? undefined : sectionFlowItem} className="lg:col-span-2">
            <div className="mb-12 flex items-center gap-4">
              <Code2 className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">About Me</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
          </motion.div>

          <motion.div variants={reduce ? undefined : sectionFlowItem} className="space-y-6">
            <motion.div variants={reduce ? undefined : sectionList} className="space-y-6">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    variants={reduce ? undefined : sectionListItem}
                    className="text-lg leading-relaxed text-muted-foreground"
                  >
                    {para}
                  </motion.p>
                ))
              ) : (
                <motion.p
                  variants={reduce ? undefined : sectionListItem}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  Passionate software engineer crafting elegant digital experiences.
                </motion.p>
              )}
            </motion.div>

            <motion.div
              variants={reduce ? undefined : sectionList}
              className="flex flex-wrap gap-2 pt-4"
            >
              {data.techStack?.map((tech) => (
                <motion.span
                  key={tech}
                  variants={reduce ? undefined : sectionListItem}
                  className="glass-card cursor-default rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={reduce ? undefined : sectionFlowItem}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {data.skills?.map((skill, index) => {
              const Icon = getIcon(skill.icon)
              return (
                <motion.div
                  key={skill.id}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={sectionViewport}
                  transition={{
                    delay: reduce ? 0 : index * 0.07,
                    duration: 0.7,
                    ease: SECTION_EASE,
                  }}
                  whileHover={
                    reduce
                      ? undefined
                      : { y: -4, transition: { type: "spring", stiffness: 400, damping: 28 } }
                  }
                  className="glass-card group flex flex-col items-center gap-3 rounded-xl p-6 transition-colors hover:border-primary/50"
                >
                  <Icon
                    className={`h-10 w-10 ${skill.color} transition-transform group-hover:scale-110`}
                  />
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
