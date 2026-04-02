"use client"

import { LogOut, X } from "lucide-react"
import { useEffect } from "react"

interface LogoutConfirmProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function LogoutConfirm({ isOpen, onConfirm, onCancel }: Readonly<LogoutConfirmProps>) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel()
      if (e.key === "Enter") onConfirm()
    }
    globalThis.addEventListener("keydown", handler)
    return () => globalThis.removeEventListener("keydown", handler)
  }, [isOpen, onCancel, onConfirm])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center">
      {/* Backdrop */}
      <button
        aria-label="Cancel logout"
        className="absolute inset-0 cursor-default bg-background/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="glass-card animate-slide-up relative z-10 mx-4 w-full max-w-sm rounded-2xl border border-border p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-500/20">
          <LogOut className="h-5 w-5 text-red-400" />
        </div>

        {/* Text */}
        <h3 className="mb-1 text-lg font-semibold text-foreground">Sign out?</h3>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          You&apos;ll need to sign in again to access your account.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-border bg-secondary py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
