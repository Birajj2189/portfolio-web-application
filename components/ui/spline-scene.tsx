"use client"

import { Suspense, lazy } from "react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const Spline = lazy(() => import("@splinetool/react-spline"))

export interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: Readonly<SplineSceneProps>) {
  return (
    <Suspense
      fallback={
        <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-muted/20">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <Spline scene={scene} className={cn("h-full w-full", className)} />
    </Suspense>
  )
}
