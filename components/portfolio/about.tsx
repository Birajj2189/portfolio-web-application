"use client"

import { Code2, Database, Server, Layout, Container, Layers } from "lucide-react"

const skills = [
  { name: "React", icon: Layout, color: "text-chart-1" },
  { name: "Next.js", icon: Layers, color: "text-foreground" },
  { name: "Node.js", icon: Server, color: "text-chart-3" },
  { name: "MongoDB", icon: Database, color: "text-chart-4" },
  { name: "PostgreSQL", icon: Database, color: "text-chart-1" },
  { name: "Docker", icon: Container, color: "text-chart-2" },
]

const techStack = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Git",
  "REST APIs",
  "GraphQL",
]

export function About() {
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
            <p className="text-lg leading-relaxed text-muted-foreground">
              I&apos;m a passionate software engineer who transforms ideas into elegant, functional
              digital experiences. My journey in tech started with curiosity and evolved into a deep
              love for building products that make a difference.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              With expertise in the <span className="font-medium text-primary">MERN stack</span> and
              modern web technologies, I specialize in creating full-stack applications that are not
              only powerful but also delightful to use.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing
              to open source, or writing about my learnings in tech.
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2 pt-4">
              {techStack.map((tech) => (
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
            {skills.map((skill) => (
              <div
                key={skill.name}
                className="glass-card group flex flex-col items-center gap-3 rounded-xl p-6 transition-all hover:-translate-y-1 hover:border-primary/50"
              >
                <skill.icon
                  className={`h-10 w-10 ${skill.color} transition-transform group-hover:scale-110`}
                />
                <span className="text-sm font-medium text-foreground">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
