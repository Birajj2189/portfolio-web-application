"use client"

import { FileText, Download, Building2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

const experience = [
  {
    company: "Tech Company",
    role: "Senior Software Engineer",
    period: "2024 - Present",
    description: "Leading development of scalable web applications and mentoring team members.",
    skills: ["Next.js", "TypeScript", "PostgreSQL", "AWS"],
  },
  {
    company: "Startup Inc.",
    role: "Full-Stack Developer",
    period: "2022 - 2024",
    description:
      "Built and maintained multiple production applications serving thousands of users.",
    skills: ["React", "Node.js", "MongoDB", "Docker"],
  },
  {
    company: "Digital Agency",
    role: "Junior Developer",
    period: "2021 - 2022",
    description: "Developed client websites and internal tools while learning best practices.",
    skills: ["JavaScript", "HTML/CSS", "PHP", "MySQL"],
  },
]

const education = [
  {
    institution: "University of Technology",
    degree: "B.S. Computer Science",
    period: "2017 - 2021",
    description: "Graduated with honors. Focus on software engineering and web technologies.",
  },
]

export function Resume() {
  return (
    <section id="resume" className="px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-4">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Resume</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Download button */}
        <div className="mb-12 flex items-center justify-between">
          <p className="text-muted-foreground">
            A summary of my professional experience and education.
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Download Resume
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Experience */}
          <div className="space-y-6 lg:col-span-2">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Experience
            </h3>

            <div className="space-y-6">
              {experience.map((job, index) => (
                <div
                  key={index}
                  className="glass-card group rounded-xl p-6 transition-all hover:border-primary/30"
                >
                  <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h4 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {job.role}
                      </h4>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                    <span className="flex items-center gap-1 font-mono text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {job.period}
                    </span>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <FileText className="h-5 w-5 text-muted-foreground" />
              Education
            </h3>

            {education.map((edu, index) => (
              <div
                key={index}
                className="glass-card group rounded-xl p-6 transition-all hover:border-primary/30"
              >
                <h4 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                  {edu.degree}
                </h4>
                <p className="text-sm text-muted-foreground">{edu.institution}</p>
                <span className="mt-2 flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {edu.period}
                </span>
                <p className="mt-3 text-sm text-muted-foreground">{edu.description}</p>
              </div>
            ))}

            {/* Quick Stats */}
            <div className="glass-card rounded-xl p-6">
              <h4 className="mb-4 font-semibold text-foreground">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Years Experience</span>
                  <span className="font-mono font-bold text-primary">3+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Projects Completed</span>
                  <span className="font-mono font-bold text-accent">20+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Happy Clients</span>
                  <span className="font-mono font-bold text-chart-3">15+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
