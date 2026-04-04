"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ErrorScreen } from "@/components/portfolio/loading-screen"

function ErrorContent() {
  const searchParams = useSearchParams()
  const reason = searchParams.get("reason")

  const message =
    reason === "timeout"
      ? "Loading took longer than 20 seconds. Check your connection or backend, then try again."
      : "Something went wrong. Return home to try again."

  return (
    <ErrorScreen
      message={message}
      onRetry={() => {
        globalThis.window.location.assign("/")
      }}
    />
  )
}

export default function ErrorRoutePage() {
  return (
    <Suspense
      fallback={
        <div
          className="dot-pattern fixed inset-0 z-[300] bg-background"
          aria-busy="true"
          aria-label="Loading"
        />
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
