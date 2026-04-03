"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Command,
  Search,
  Home,
  User,
  FolderKanban,
  Rocket,
  Beaker,
  FileText,
  Mail,
  Github,
  Linkedin,
  Download,
  Images,
} from "lucide-react"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

const commands = [
  {
    name: "Home",
    icon: Home,
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    shortcut: "H",
  },
  {
    name: "About",
    icon: User,
    action: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }),
    shortcut: "A",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    action: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }),
    shortcut: "P",
  },
  {
    name: "Journey",
    icon: Rocket,
    action: () => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" }),
    shortcut: "J",
  },
  {
    name: "Playground",
    icon: Beaker,
    action: () => {
      globalThis.location.href = "/playground"
    },
    shortcut: "L",
  },
  {
    name: "Gallery",
    icon: Images,
    action: () => {
      globalThis.location.href = "/gallery"
    },
    shortcut: "Y",
  },
  {
    name: "Resume",
    icon: FileText,
    action: () => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" }),
    shortcut: "R",
  },
  {
    name: "Contact",
    icon: Mail,
    action: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }),
    shortcut: "C",
  },
  { name: "GitHub", icon: Github, action: () => window.open("#", "_blank"), shortcut: "G" },
  { name: "LinkedIn", icon: Linkedin, action: () => window.open("#", "_blank"), shortcut: "I" },
  {
    name: "Download Resume",
    icon: Download,
    action: () => alert("Resume download (demo)"),
    shortcut: "D",
  },
]

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  )

  const executeCommand = useCallback(
    (index: number) => {
      const command = filteredCommands[index]
      if (command) {
        command.action()
        onClose()
        setSearch("")
      }
    },
    [filteredCommands, onClose]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
        setSearch("")
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((i) => (i + 1) % filteredCommands.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        executeCommand(selectedIndex)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands.length, selectedIndex, executeCommand, onClose])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setSelectedIndex(0)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => {
          onClose()
          setSearch("")
        }}
      />

      {/* Palette */}
      <div className="glass-card animate-slide-up relative mx-4 w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Type a command or search..."
            autoFocus
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="rounded bg-secondary px-2 py-1 text-xs text-muted-foreground">ESC</kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">No commands found</div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.name}
                onClick={() => executeCommand(index)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  index === selectedIndex
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <cmd.icon className="h-5 w-5" />
                <span className="flex-1 text-left">{cmd.name}</span>
                <kbd className="rounded bg-secondary px-2 py-1 text-xs">{cmd.shortcut}</kbd>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-secondary px-1">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-secondary px-1">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-secondary px-1">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}
