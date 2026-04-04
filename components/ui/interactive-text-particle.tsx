"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react"

import { cn } from "@/lib/utils"

interface Pointer {
  x?: number
  y?: number
}

export interface Particle {
  ox: number
  oy: number
  cx: number
  cy: number
  or: number
  cr: number
  pv: number
  ov: number
  f: number
  rgb: number[]
  draw: () => void
  move: (interactionRadius: number, hasPointer: boolean, pointer: Pointer) => boolean
}

interface TextBox {
  str: string
  x?: number
  y?: number
  w?: number
  h?: number
}

export interface ParticleTextEffectProps {
  text?: string
  /** Hex without `#`, e.g. `ffad70` */
  colors?: string[]
  className?: string
  animationForce?: number
  particleDensity?: number
  /** Canvas `font` weight for mask text (font must be loaded, e.g. via `next/font`) */
  canvasFontWeight?: number
  /** Stack for `fillText`, e.g. `'Space Grotesk', system-ui, sans-serif` */
  canvasFontFamily?: string
}

function rand(max = 1, min = 0, dec = 0): number {
  return +(min + Math.random() * (max - min)).toFixed(dec)
}

function createParticle(
  x: number,
  y: number,
  animationForce: number,
  rgb: number[] = [rand(128, 0), rand(128, 0), rand(128, 0)],
  ctxRef: RefObject<CanvasRenderingContext2D | null>
): Particle {
  const base: Omit<Particle, "draw" | "move"> = {
    ox: x,
    oy: y,
    cx: x,
    cy: y,
    or: rand(5, 1),
    cr: 0,
    pv: 0,
    ov: 0,
    f: rand(animationForce + 15, animationForce - 15),
    rgb: rgb.map((c) => Math.max(0, Math.min(255, c + rand(13, -13)))),
  }
  base.cr = base.or

  return {
    ...base,
    draw() {
      const ctx = ctxRef.current
      if (!ctx) return
      ctx.fillStyle = `rgb(${this.rgb.join(",")})`
      ctx.beginPath()
      ctx.arc(this.cx, this.cy, this.cr, 0, 2 * Math.PI)
      ctx.fill()
    },
    move(interactionRadius: number, hasPointer: boolean, pointer: Pointer) {
      let moved = false

      if (hasPointer && pointer.x !== undefined && pointer.y !== undefined) {
        const dx = this.cx - pointer.x
        const dy = this.cy - pointer.y
        const dist = Math.hypot(dx, dy)
        if (dist < interactionRadius && dist > 0) {
          const force = Math.min(this.f, ((interactionRadius - dist) / dist) * 2)
          this.cx += (dx / dist) * force
          this.cy += (dy / dist) * force
          moved = true
        }
      }

      const odx = this.ox - this.cx
      const ody = this.oy - this.cy
      const od = Math.hypot(odx, ody)

      if (od > 1) {
        const restore = Math.min(od * 0.1, 3)
        this.cx += (odx / od) * restore
        this.cy += (ody / od) * restore
        moved = true
      }

      this.draw()
      return moved
    },
  }
}

const DEFAULT_COLORS = [
  "5eead4",
  "2dd4bf",
  "14b8a6",
  "c084fc",
  "e879f9",
  "a855f7",
  "67e8f9",
  "d946ef",
]

export function ParticleTextEffect({
  text = "HOVER",
  colors = DEFAULT_COLORS,
  className,
  animationForce = 80,
  particleDensity = 4,
  canvasFontWeight = 900,
  canvasFontFamily = "ui-sans-serif, system-ui, Verdana, sans-serif",
}: Readonly<ParticleTextEffectProps>) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const pointerRef = useRef<Pointer>({})
  const hasPointerRef = useRef(false)
  const interactionRadiusRef = useRef(100)
  const textBoxRef = useRef<TextBox>({ str: text })
  const animationIdRef = useRef<number | null>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })

  const dottify = useCallback(() => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    const textBox = textBoxRef.current
    if (
      !ctx ||
      !canvas ||
      textBox.x == null ||
      textBox.y == null ||
      textBox.w == null ||
      textBox.h == null
    )
      return

    const data = ctx.getImageData(textBox.x, textBox.y, textBox.w, textBox.h).data
    const pixels: { x: number; y: number; rgb: number[] }[] = []

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]
      if (!alpha) continue
      const px = (i / 4) % textBox.w
      const py = Math.floor(i / 4 / textBox.w)
      if (px % particleDensity !== 0 || py % particleDensity !== 0) continue
      pixels.push({
        x: px,
        y: py,
        rgb: [data[i]!, data[i + 1]!, data[i + 2]!],
      })
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const next: Particle[] = []
    pixels.forEach((p, i) => {
      next[i] = createParticle(textBox.x! + p.x, textBox.y! + p.y, animationForce, p.rgb, ctxRef)
      next[i]!.draw()
    })

    particlesRef.current = next
  }, [animationForce, particleDensity])

  const write = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = ctxRef.current
    const textBox = textBoxRef.current
    if (!canvas || !ctx || size.w < 8 || size.h < 8) return

    canvas.width = size.w
    canvas.height = size.h

    textBox.str = text
    const len = Math.max(text.length, 1)
    // Start large from width estimate, then shrink until text fits canvas width (fills hero boxes)
    const fontStack = (n: number) => `${canvasFontWeight} ${n}px ${canvasFontFamily}`
    let h = Math.max(16, Math.floor(Math.min(size.w / len, size.h * 0.96)))
    ctx.font = fontStack(h)
    let tw = ctx.measureText(textBox.str).width
    while (tw > size.w - 16 && h > 12) {
      h -= 2
      ctx.font = fontStack(h)
      tw = ctx.measureText(textBox.str).width
    }
    if (h > size.h * 0.98) {
      h = Math.floor(size.h * 0.96)
      ctx.font = fontStack(h)
      tw = ctx.measureText(textBox.str).width
      while (tw > size.w - 16 && h > 12) {
        h -= 2
        ctx.font = fontStack(h)
        tw = ctx.measureText(textBox.str).width
      }
    }
    textBox.h = h

    interactionRadiusRef.current = Math.max(48, textBox.h * 1.35)

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    textBox.w = Math.ceil(ctx.measureText(textBox.str).width)
    textBox.x = Math.floor(0.5 * (canvas.width - textBox.w))
    textBox.y = Math.floor(0.5 * (canvas.height - textBox.h))

    const safeColors = colors.length ? colors : DEFAULT_COLORS
    const gradient = ctx.createLinearGradient(
      textBox.x,
      textBox.y,
      textBox.x + textBox.w,
      textBox.y + textBox.h
    )
    const N = Math.max(safeColors.length - 1, 1)
    safeColors.forEach((c, i) => {
      gradient.addColorStop(i / N, `#${c.replace(/^#/, "")}`)
    })
    ctx.fillStyle = gradient

    ctx.fillText(textBox.str, 0.5 * canvas.width, 0.5 * canvas.height)
    dottify()
  }, [canvasFontFamily, canvasFontWeight, colors, dottify, size.h, size.w, text])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const measure = () => {
      const r = el.getBoundingClientRect()
      const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)
      setSize({
        w: Math.max(48, Math.floor(r.width * dpr)),
        h: Math.max(40, Math.floor(r.height * dpr)),
      })
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    ctxRef.current = ctx
  }, [])

  useEffect(() => {
    if (size.w < 8 || size.h < 8) return
    write()

    const cancel = () => {
      if (animationIdRef.current != null) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }
    }
    cancel()

    const loop = () => {
      const ctx = ctxRef.current
      const canvas = canvasRef.current
      if (!ctx || !canvas) return
      const ptr = pointerRef.current
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach((p) =>
        p.move(interactionRadiusRef.current, hasPointerRef.current, ptr)
      )
      animationIdRef.current = requestAnimationFrame(loop)
    }
    animationIdRef.current = requestAnimationFrame(loop)
    return cancel
  }, [size, write])

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    pointerRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
    hasPointerRef.current = true
  }

  const handlePointerLeave = () => {
    hasPointerRef.current = false
    pointerRef.current = {}
  }

  const handlePointerEnter = () => {
    hasPointerRef.current = true
  }

  return (
    <div ref={wrapRef} className={cn("relative h-full min-h-[3rem] w-full", className)}>
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-crosshair touch-none"
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100%",
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
      />
    </div>
  )
}
