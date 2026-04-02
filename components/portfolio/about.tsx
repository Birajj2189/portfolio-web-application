"use client"

import { Code2 } from "lucide-react"
import { getIcon } from "@/lib/icon-map"
import type { AboutData } from "@/types/portfolio"

interface AboutProps {
  data: AboutData
}

export function About({ data }: AboutProps) {
  // bio is Strapi Blocks format — flatten to plain text paragraphs for now.
  // Replace with @strapi/blocks-react-renderer if rich formatting is needed.
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
    <section id="about" className="px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 flex items-center gap-4">
          <Code2 className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">About Me</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Story */}
          <div className="space-y-6">
            {bioParagraphs.length > 0 ? (
              bioParagraphs.map((para, i) => (
                <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-lg leading-relaxed text-muted-foreground">
                Passionate software engineer crafting elegant digital experiences.
              </p>
            )}

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 pt-4">
              {data.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="glass-card cursor-default rounded-full px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Skill cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {data.skills?.map((skill) => {
              const Icon = getIcon(skill.icon)
              return (
                <div
                  key={skill.id}
                  className="glass-card group flex flex-col items-center gap-3 rounded-xl p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
                >
                  <Icon
                    className={`h-10 w-10 ${skill.color} transition-transform group-hover:scale-110`}
                  />
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
