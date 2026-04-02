"use client"

import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Send,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContactStore } from "@/store/contact.store"

const socialLinks = [
  { name: "GitHub", icon: Github, href: "#", color: "hover:text-foreground" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-500" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
  { name: "Email", icon: Mail, href: "mailto:hello@example.com", color: "hover:text-primary" },
]

export function Contact() {
  const { formData, status, errorMessage, setField, submit, resetForm } = useContactStore()
  const isSubmitting = status === "loading"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit()
  }

  return (
    <section id="contact" className="px-4 py-24">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-4 flex items-center gap-4">
          <Mail className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <p className="mb-12 max-w-2xl text-muted-foreground">
          Have a project in mind or just want to say hi? I&apos;d love to hear from you. Let&apos;s
          create something amazing together.
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="glass-card rounded-2xl p-8">
            {status === "success" ? (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 text-center">
                <CheckCircle className="h-14 w-14 text-primary" />
                <h3 className="text-xl font-semibold">Message Sent!</h3>
                <p className="text-muted-foreground">
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <Button variant="outline" onClick={resetForm}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setField("name", e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-secondary px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setField("message", e.target.value)}
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary py-6 text-lg text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Info & Social */}
          <div className="flex flex-col justify-center space-y-8">
            {/* AI Summary style card like reference */}
            <div className="glass-card rounded-xl border-l-4 border-primary p-6">
              <div className="mb-3 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Quick Info</span>
              </div>
              <p className="text-foreground">
                Based in your city. Open to remote opportunities worldwide. Currently interested in
                full-stack roles and exciting startup projects.
              </p>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Connect With Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`glass-card flex h-12 w-12 items-center justify-center rounded-xl text-muted-foreground ${link.color} transition-all hover:-translate-y-1`}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-2 flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                <span className="font-medium text-foreground">Available for work</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Response time: Usually within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
