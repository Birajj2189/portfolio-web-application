"use client"

import { Rocket, GraduationCap, Briefcase, Award, Lightbulb, BookOpen } from "lucide-react"

const timeline = [
  {
    year: "2024",
    title: "Senior Developer",
    description: "Leading development of enterprise applications and mentoring junior developers.",
    icon: Rocket,
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    year: "2023",
    title: "Full-Stack Developer",
    description:
      "Built and deployed multiple production applications using MERN stack and Next.js.",
    icon: Briefcase,
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    year: "2022",
    title: "First Tech Job",
    description:
      "Started as a junior developer, learning from experienced engineers and shipping features.",
    icon: Award,
    color: "text-chart-3",
    bgColor: "bg-chart-3/20",
  },
  {
    year: "2021",
    title: "Graduated",
    description: "Completed Computer Science degree and built my first serious web applications.",
    icon: GraduationCap,
    color: "text-chart-4",
    bgColor: "bg-chart-4/20",
  },
]

const exploring = [
  {
    topic: "AI/ML Integration",
    description: "Building intelligent features with OpenAI and LangChain",
  },
  { topic: "System Design", description: "Scaling applications for millions of users" },
  { topic: "Web3 & Blockchain", description: "Exploring decentralized applications" },
  { topic: "DevOps & Cloud", description: "AWS, Docker, and Kubernetes deep dive" },
]

const achievements = [
  { title: "Open Source Contributor", description: "100+ contributions to popular repositories" },
  { title: "Hackathon Winner", description: "1st place at Regional Tech Hackathon 2023" },
  { title: "Tech Blog Author", description: "10K+ monthly readers on technical articles" },
]

export function Journey() {
  return (
    <section id="journey" className="px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-12 flex items-center gap-4">
          <Rocket className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">My Journey</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Timeline */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              Career Timeline
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute top-0 bottom-0 left-6 w-px bg-border" />

              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={item.year} className="group relative flex gap-6">
                    {/* Icon */}
                    <div
                      className={`relative z-10 h-12 w-12 rounded-full ${item.bgColor} flex flex-shrink-0 items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>

                    {/* Content */}
                    <div className="glass-card flex-1 rounded-xl p-5 transition-colors hover:border-primary/30">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="font-mono text-sm text-primary">{item.year}</span>
                        <span className="h-px w-4 bg-border" />
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Currently Exploring */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Lightbulb className="h-5 w-5 text-chart-3" />
                What I&apos;m Exploring
              </h3>
              <div className="space-y-4">
                {exploring.map((item) => (
                  <div key={item.topic} className="group">
                    <h4 className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {item.topic}
                    </h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Award className="h-5 w-5 text-chart-3" />
                Achievements
              </h3>
              <div className="space-y-4">
                {achievements.map((item) => (
                  <div key={item.title} className="group">
                    <h4 className="text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
