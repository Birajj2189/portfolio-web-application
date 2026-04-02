"use client"

import { ExternalLink, Github, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
    tech: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    github: "#",
    demo: "#",
    status: "COMPLETED",
    statusColor: "bg-primary text-primary-foreground",
  },
  {
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, drag-and-drop interface, and team workspaces.",
    tech: ["React", "Express", "PostgreSQL", "Socket.io"],
    github: "#",
    demo: "#",
    status: "COMPLETED",
    statusColor: "bg-primary text-primary-foreground",
  },
  {
    title: "AI Content Generator",
    description:
      "AI-powered content generation tool that helps creators write better blog posts, social media content, and marketing copy.",
    tech: ["Next.js", "OpenAI API", "Tailwind CSS"],
    github: "#",
    demo: "#",
    status: "IN PROGRESS",
    statusColor: "bg-accent text-accent-foreground",
  },
  {
    title: "Developer Portfolio",
    description:
      "This very portfolio you&apos;re viewing! A modern, interactive space to showcase my work and journey as a developer.",
    tech: ["Next.js", "Tailwind CSS", "Framer Motion"],
    github: "#",
    demo: "#",
    status: "LIVE",
    statusColor: "bg-chart-3 text-background",
  },
]

export function Projects() {
  return (
    <section id="projects" className="dot-pattern px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 flex items-center gap-4">
          <FolderKanban className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Projects</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Projects grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${project.statusColor}`}
                >
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p className="mb-6 leading-relaxed text-muted-foreground">{project.description}</p>

              {/* Tech stack */}
              <div className="mb-6 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border hover:border-primary hover:text-primary"
                  asChild
                >
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Code
                  </a>
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  asChild
                >
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
