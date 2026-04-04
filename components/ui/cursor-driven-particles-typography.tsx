"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface CursorDrivenParticleTypographyProps {
  className?: string
  text: string
  fontSize?: number
  fontFamily?: string
  particleSize?: number
  particleDensity?: number
  dispersionStrength?: number
  returnSpeed?: number
  color?: string
  /**
   * Caps rasterized font size at `containerWidth * factor` so type scales on small viewports.
   * Increase for poster-style heroes (e.g. `0.22`).
   */
  maxFontSizeByWidthFactor?: number
  /**
   * When true, scales glyphs horizontally so the string spans the drawable width (minus padding).
   * Short names look wider/bolder; long names still shrink via font size first to avoid over-compression.
   */
  stretchToCanvasWidth?: boolean
  /** Upper bound on horizontal scale (caps distortion for very short strings). Default high so hero names usually hit full width. */
  maxHorizontalStretch?: number
}

class Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  color: string
  dispersion: number
  returnSpd: number

  constructor(
    x: number,
    y: number,
    size: number,
    color: string,
    dispersion: number,
    returnSpd: number
  ) {
    this.x = x + (Math.random() - 0.5) * 10
    this.y = y + (Math.random() - 0.5) * 10
    this.originX = x
    this.originY = y
    this.vx = (Math.random() - 0.5) * 5
    this.vy = (Math.random() - 0.5) * 5
    this.size = size
    this.color = color
    this.dispersion = dispersion
    this.returnSpd = returnSpd
  }

  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.x
    const dy = mouseY - this.y
    const distance = Math.hypot(dx, dy)
    const interactionRadius = 120

    if (distance < interactionRadius && mouseX !== -1000 && mouseY !== -1000) {
      const forceDirectionX = dx / distance
      const forceDirectionY = dy / distance
      const force = (interactionRadius - distance) / interactionRadius

      const repulsionX = forceDirectionX * force * this.dispersion
      const repulsionY = forceDirectionY * force * this.dispersion

      this.vx -= repulsionX
      this.vy -= repulsionY
    }

    this.vx += (this.originX - this.x) * this.returnSpd
    this.vy += (this.originY - this.y) * this.returnSpd

    this.vx *= 0.85
    this.vy *= 0.85

    const distToOrigin = Math.hypot(this.x - this.originX, this.y - this.originY)

    if (distToOrigin < 1 && Math.random() > 0.95) {
      this.vx += (Math.random() - 0.5) * 0.2
      this.vy += (Math.random() - 0.5) * 0.2
    }

    this.x += this.vx
    this.y += this.vy
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

export function CursorDrivenParticleTypography({
  className,
  text,
  fontSize = 120,
  fontFamily = "Inter, sans-serif",
  particleSize = 1.5,
  particleDensity = 6,
  dispersionStrength = 15,
  returnSpeed = 0.08,
  color,
  maxFontSizeByWidthFactor = 0.15,
  stretchToCanvasWidth = true,
  maxHorizontalStretch = 80,
}: Readonly<CursorDrivenParticleTypographyProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return

    let animationFrameId: number | undefined
    let particles: Particle[] = []

    let mouseX = -1000
    let mouseY = -1000

    let containerWidth = 0
    let containerHeight = 0

    const init = () => {
      const container = containerRef.current
      if (!container) return

      containerWidth = container.clientWidth
      containerHeight = container.clientHeight

      const win = globalThis.window
      if (!win) return

      const dpr = Math.min(2, win.devicePixelRatio || 1)
      canvas.width = containerWidth * dpr
      canvas.height = containerHeight * dpr
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)

      const computedStyle = win.getComputedStyle(container)
      const textColor = color ?? (computedStyle.color || "#000000")

      ctx.clearRect(0, 0, containerWidth, containerHeight)

      const pad = 12
      const maxW = Math.max(24, containerWidth - pad * 2)
      const widthCap = containerWidth * maxFontSizeByWidthFactor
      let h = Math.min(fontSize, widthCap > 8 ? widthCap : fontSize)
      const maxH = Math.max(12, containerHeight * 0.88)
      h = Math.min(h, maxH)

      ctx.fillStyle = textColor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const fontSpec = (size: number) => `700 ${size}px ${fontFamily}`
      ctx.font = fontSpec(h)
      let tw = ctx.measureText(text).width
      while (tw > maxW && h > 8) {
        h -= 1
        ctx.font = fontSpec(h)
        tw = ctx.measureText(text).width
      }

      const cx = containerWidth / 2
      const cy = containerHeight / 2

      if (stretchToCanvasWidth && tw > 0.5) {
        const rawScale = maxW / tw
        const scaleX = Math.min(Math.max(rawScale, 1), maxHorizontalStretch)
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scaleX, 1)
        ctx.fillText(text, 0, 0)
        ctx.restore()
      } else {
        ctx.fillText(text, cx, cy)
      }

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height)

      particles = []

      const step = Math.max(1, Math.floor(particleDensity * dpr))

      for (let y = 0; y < textCoordinates.height; y += step) {
        for (let x = 0; x < textCoordinates.width; x += step) {
          const index = (y * textCoordinates.width + x) * 4
          const alpha = textCoordinates.data[index + 3] ?? 0

          if (alpha > 128) {
            particles.push(
              new Particle(
                x / dpr,
                y / dpr,
                particleSize,
                textColor,
                dispersionStrength,
                returnSpeed
              )
            )
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, containerWidth, containerHeight)

      for (const p of particles) {
        p.update(mouseX, mouseY)
        p.draw(ctx)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }

    const handlePointerLeave = () => {
      mouseX = -1000
      mouseY = -1000
    }

    const handleResize = () => {
      init()
    }

    const timeoutId = globalThis.setTimeout(() => {
      init()
      animate()
    }, 100)

    const resizeObserver = new ResizeObserver(handleResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    canvas.addEventListener("pointermove", handlePointerMove, { passive: true })
    canvas.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      globalThis.clearTimeout(timeoutId)
      resizeObserver.disconnect()
      canvas.removeEventListener("pointermove", handlePointerMove)
      canvas.removeEventListener("pointerleave", handlePointerLeave)
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [
    text,
    fontSize,
    fontFamily,
    particleSize,
    particleDensity,
    dispersionStrength,
    returnSpeed,
    color,
    maxFontSizeByWidthFactor,
    stretchToCanvasWidth,
    maxHorizontalStretch,
  ])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-full min-h-[200px] w-full touch-none items-center justify-center",
        className
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
