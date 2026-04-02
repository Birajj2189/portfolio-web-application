"use client"

import { useState } from "react"
import { LogOut, Sparkles, X } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"

/** Returns the part before @ — e.g. "alice.smith@example.com" → "alice.smith" */
function emailHandle(email: string) {
  return email.split("@")[0]
}

export function GreetingBar() {
  const { user, logout } = useAuthStore()
  const [dismissed, setDismissed] = useState(false)

  if (!user || dismissed) return null

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="animate-slide-up fixed right-0 bottom-0 left-0 z-40">
      <div className="mx-auto max-w-3xl px-4 pb-4">
        <div className="glass-card flex items-center justify-between gap-3 rounded-2xl border border-primary/20 px-5 py-3 shadow-lg">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="truncate text-sm text-foreground">
              {greeting},{" "}
              <span className="font-semibold text-primary">{emailHandle(user.email)}</span>! Welcome
              to my portfolio.
            </p>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
