"use client"

import { FileText, Download, Building2, Calendar } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  sectionFlow,
  sectionFlowItem,
  sectionGrid,
  sectionGridItem,
  sectionList,
  sectionListItem,
  sectionViewport,
} from "@/lib/section-motion"
import type { ResumeData } from "@/types/portfolio"

interface ResumeProps {
  data: ResumeData
}

export function Resume({ data }: ResumeProps) {
  const reduce = useReducedMotion()

  return (
    <section id="resume" className="scroll-mt-24 px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={reduce ? undefined : sectionFlow}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={sectionViewport}
        >
          <motion.div
            variants={reduce ? undefined : sectionFlowItem}
            className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">Resume</h2>
              <div className="hidden h-px flex-1 bg-border sm:block sm:min-w-[120px]" />
            </div>
            {data.resumeFileUrl ? (
              <Button
                className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                asChild
              >
                <a href={data.resumeFileUrl} target="_blank" rel="noopener noreferrer" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </a>
              </Button>
            ) : null}
          </motion.div>

          <motion.p
            variants={reduce ? undefined : sectionFlowItem}
            className="mb-12 text-muted-foreground"
          >
            A summary of my professional experience and education.
          </motion.p>

          <motion.div
            variants={reduce ? undefined : sectionFlowItem}
            className="grid gap-8 lg:grid-cols-3"
          >
            <div className="space-y-6 lg:col-span-2">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Experience
              </h3>

              <motion.div className="space-y-6" variants={reduce ? undefined : sectionGrid}>
                {data.experience?.map((job) => (
                  <motion.div
                    key={job.id}
                    variants={reduce ? undefined : sectionGridItem}
                    whileHover={
                      reduce
                        ? undefined
                        : { y: -3, transition: { type: "spring", stiffness: 400, damping: 30 } }
                    }
                    className="glass-card group rounded-xl p-6 transition-colors hover:border-primary/30"
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
                      {job.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="space-y-6">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Education
              </h3>

              <motion.div className="space-y-6" variants={reduce ? undefined : sectionList}>
                {data.education?.map((edu) => (
                  <motion.div
                    key={edu.id}
                    variants={reduce ? undefined : sectionListItem}
                    whileHover={
                      reduce
                        ? undefined
                        : { y: -3, transition: { type: "spring", stiffness: 400, damping: 30 } }
                    }
                    className="glass-card group rounded-xl p-6 transition-colors hover:border-primary/30"
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
                  </motion.div>
                ))}

                {data.stats && data.stats.length > 0 ? (
                  <motion.div
                    variants={reduce ? undefined : sectionListItem}
                    className="glass-card rounded-xl p-6"
                  >
                    <h4 className="mb-4 font-semibold text-foreground">Quick Stats</h4>
                    <div className="space-y-3">
                      {data.stats.map((stat) => (
                        <div key={stat.id} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                          <span className={`font-mono font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
