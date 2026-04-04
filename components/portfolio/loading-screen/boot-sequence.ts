import { useEffect, useRef, useState } from "react"

/** Command / success pairs — simulates env init → data → render */
export const BOOT_STEPS = [
  { cmd: "Initializing environment...", done: "✔ Environment ready" },
  { cmd: "Fetching portfolio data...", done: "✔ Data loaded" },
  { cmd: "Rendering interface...", done: "✔ Interface ready" },
] as const

/** Final personality line (developer signature) */
export const BOOT_PERSONALITY = "Ready to ship 🚀"

export const CHAR_MS = 26
export const PAUSE_AFTER_CMD_MS = 320
export const PAUSE_AFTER_DONE_MS = 420
export const HOLD_AT_100_MS = 420

export interface BootSequenceView {
  /** Fully completed log lines (prompt or status) */
  settledLines: readonly string[]
  /** Active `> …` command row (incl. empty while waiting for first char) */
  commandLineActive: boolean
  /** Suffix after `> ` while typing a command */
  typingCmdSuffix: string
  /** Shown after command finishes, before folding into settled */
  pendingDoneLine: string | null
  /** Suffix after `> ` for personality line */
  typingPersonalitySuffix: string | null
  /** Target 0–100 for progress spring (step-synced, not per-character) */
  progressTarget: number
  /** Narrative finished (personality typed + hold); parent may start exit */
  narrativeComplete: boolean
}

const INITIAL: BootSequenceView = {
  settledLines: [],
  commandLineActive: true,
  typingCmdSuffix: "",
  pendingDoneLine: null,
  typingPersonalitySuffix: null,
  progressTarget: 6,
  narrativeComplete: false,
}

function progressAfterCmdComplete(stepIndex: number): number {
  return 18 + stepIndex * 24
}

function progressAfterDone(stepIndex: number): number {
  return 28 + stepIndex * 24
}

export function useBootSequence(
  reduceMotion: boolean,
  onNarrativeComplete: () => void
): BootSequenceView {
  const [vm, setVm] = useState<BootSequenceView>(INITIAL)
  const onDoneRef = useRef(onNarrativeComplete)

  useEffect(() => {
    onDoneRef.current = onNarrativeComplete
  }, [onNarrativeComplete])

  useEffect(() => {
    let cancelled = false
    const timers: ReturnType<typeof globalThis.setTimeout>[] = []
    const schedule = (fn: () => void, ms: number) => {
      const id = globalThis.setTimeout(() => {
        const idx = timers.indexOf(id)
        if (idx !== -1) timers.splice(idx, 1)
        fn()
      }, ms)
      timers.push(id)
    }

    const clearTimers = () => {
      timers.forEach((id) => {
        globalThis.clearTimeout(id)
      })
      timers.length = 0
    }

    const finishBoot = () => {
      if (cancelled) return
      setVm((v) => ({
        ...v,
        progressTarget: 100,
        commandLineActive: false,
        typingPersonalitySuffix: null,
        settledLines: [...v.settledLines, `> ${BOOT_PERSONALITY}`],
      }))
      schedule(() => {
        if (cancelled) return
        setVm((v) => ({ ...v, narrativeComplete: true }))
        onDoneRef.current()
      }, HOLD_AT_100_MS)
    }

    const runPersonality = () => {
      const full = BOOT_PERSONALITY
      let i = 0
      setVm((v) => ({ ...v, progressTarget: 82, typingPersonalitySuffix: "" }))
      const tick = () => {
        if (cancelled) return
        if (i <= full.length) {
          const next = full.slice(0, i)
          setVm((v) => ({
            ...v,
            typingPersonalitySuffix: next,
            progressTarget:
              82 + (full.length > 0 ? Math.min(12, Math.round((i / full.length) * 12)) : 12),
          }))
          i += 1
          schedule(tick, CHAR_MS)
        } else {
          finishBoot()
        }
      }
      schedule(tick, CHAR_MS)
    }

    const afterDone = (stepIndex: number) => {
      if (cancelled) return
      const s = BOOT_STEPS[stepIndex]
      setVm((v) => ({
        ...v,
        settledLines: [...v.settledLines, `> ${s.cmd}`, s.done],
        commandLineActive: false,
        pendingDoneLine: null,
        typingCmdSuffix: "",
        progressTarget: progressAfterDone(stepIndex),
      }))
      if (stepIndex + 1 < BOOT_STEPS.length) {
        runCmd(stepIndex + 1)
      } else {
        runPersonality()
      }
    }

    const showDone = (stepIndex: number) => {
      if (cancelled) return
      const s = BOOT_STEPS[stepIndex]
      setVm((v) => ({
        ...v,
        commandLineActive: true,
        pendingDoneLine: s.done,
        progressTarget: progressAfterCmdComplete(stepIndex),
      }))
      schedule(() => afterDone(stepIndex), PAUSE_AFTER_DONE_MS)
    }

    const runCmd = (stepIndex: number) => {
      if (cancelled) return
      const cmd = BOOT_STEPS[stepIndex].cmd
      let i = 0
      setVm((v) => ({
        ...v,
        commandLineActive: true,
        typingCmdSuffix: "",
        pendingDoneLine: null,
        progressTarget: 10 + stepIndex * 22,
      }))

      const tick = () => {
        if (cancelled) return
        if (i <= cmd.length) {
          setVm((v) => ({
            ...v,
            typingCmdSuffix: cmd.slice(0, i),
            progressTarget:
              10 + stepIndex * 22 + Math.min(10, Math.floor((i / Math.max(cmd.length, 1)) * 10)),
          }))
          i += 1
          schedule(tick, CHAR_MS)
        } else {
          schedule(() => showDone(stepIndex), PAUSE_AFTER_CMD_MS)
        }
      }
      schedule(tick, CHAR_MS)
    }

    const rafId = globalThis.requestAnimationFrame(() => {
      if (cancelled) return
      if (reduceMotion) {
        const lines: string[] = []
        for (const s of BOOT_STEPS) {
          lines.push(`> ${s.cmd}`)
          lines.push(s.done)
        }
        lines.push(`> ${BOOT_PERSONALITY}`)
        setVm({
          settledLines: lines,
          commandLineActive: false,
          typingCmdSuffix: "",
          pendingDoneLine: null,
          typingPersonalitySuffix: null,
          progressTarget: 100,
          narrativeComplete: false,
        })
        schedule(() => {
          if (cancelled) return
          setVm((v) => ({ ...v, narrativeComplete: true }))
          onDoneRef.current()
        }, 380)
        return
      }
      runCmd(0)
    })

    return () => {
      cancelled = true
      globalThis.cancelAnimationFrame(rafId)
      clearTimers()
    }
  }, [reduceMotion])

  return vm
}
