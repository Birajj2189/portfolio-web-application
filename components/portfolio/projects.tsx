"use client"

import { ExternalLink, Github, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProjectItem, ProjectStatus } from "@/types/portfolio"

interface ProjectsProps {
  data: ProjectItem[]
}

const STATUS_STYLES: Record<ProjectStatus, string> = {
  COMPLETED: "bg-primary text-primary-foreground",
  IN_PROGRESS: "bg-accent text-accent-foreground",
  LIVE: "bg-chart-3 text-background",
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  COMPLETED: "COMPLETED",
  IN_PROGRESS: "IN PROGRESS",
  LIVE: "LIVE",
}

export function Projects({ data }: ProjectsProps) {
  const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

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
          {sorted.map((project, index) => (
            <div
              key={project.id}
              className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold text-foreground transition-colors group-hover:text-primary">
                  {project.title}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}
                >
                  {STATUS_LABELS[project.status]}
                </span>
              </div>

              {/* Description */}
              <p className="mb-6 leading-relaxed text-muted-foreground">{project.description}</p>

              {/* Tech stack */}
              <div className="mb-6 flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
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
                {project.githubUrl && project.githubUrl !== "#" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border hover:border-primary hover:text-primary"
                    asChild
                  >
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                ) : null}
                {project.demoUrl && project.demoUrl !== "#" ? (
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    asChild
                  >
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
