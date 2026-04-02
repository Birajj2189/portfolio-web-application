"use client"

import { useState, useEffect } from "react"
import { LogOut, X } from "lucide-react"
import { useAuthStore } from "@/store/auth.store"
import { LogoutConfirm } from "@/components/portfolio/logout-confirm"

function emailHandle(email: string) {
  return email.split("@")[0]
}

// Time-aware greeting + coder quip — all computed client-side only
type TimeContext = { greeting: string; quip: string; emoji: string }

function getTimeContext(): TimeContext {
  const hour = new Date().getHours()

  if (hour >= 0 && hour < 5) {
    return {
      greeting: "Burning midnight oil",
      quip: "The best bugs only appear at 2 AM, right?",
      emoji: "🌙",
    }
  }
  if (hour < 9) {
    return {
      greeting: "Good morning",
      quip: "Coffee loaded. Ready to ship.",
      emoji: "☕",
    }
  }
  if (hour < 12) {
    return {
      greeting: "Good morning",
      quip: "Deep work hours — let's build something cool.",
      emoji: "⚡",
    }
  }
  if (hour < 14) {
    return {
      greeting: "Good afternoon",
      quip: "Post-lunch energy is underrated.",
      emoji: "🚀",
    }
  }
  if (hour < 17) {
    return {
      greeting: "Good afternoon",
      quip: "Knee-deep in code. Glad you stopped by!",
      emoji: "💻",
    }
  }
  if (hour < 20) {
    return {
      greeting: "Good evening",
      quip: "Wrapping up PRs — feel free to explore.",
      emoji: "🎯",
    }
  }
  return {
    greeting: "Good evening",
    quip: "Night-mode coder. You're in the right place.",
    emoji: "🌃",
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Coder avatar SVG — hoodie, glasses, laptop
// ─────────────────────────────────────────────────────────────────────────────
function CoderAvatar() {
  return (
    <svg
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* ── Laptop glow (behind body) ── */}
      <ellipse cx="50" cy="130" rx="30" ry="6" fill="#6366f1" opacity="0.25" />

      {/* ── Laptop base ── */}
      <rect x="18" y="118" width="64" height="5" rx="2.5" fill="#1e1e2e" />
      {/* hinge */}
      <rect x="28" y="115" width="44" height="4" rx="2" fill="#27272a" />

      {/* ── Laptop screen ── */}
      <rect x="26" y="82" width="48" height="34" rx="4" fill="#0f0f1a" />
      {/* screen bezel highlight */}
      <rect x="26" y="82" width="48" height="1.5" rx="1" fill="#3f3f46" />
      {/* screen content — code lines */}
      <rect x="31" y="88" width="16" height="2" rx="1" fill="#6366f1" opacity="0.9" />
      <rect x="31" y="93" width="28" height="2" rx="1" fill="#22d3ee" opacity="0.8" />
      <rect x="31" y="98" width="20" height="2" rx="1" fill="#4ade80" opacity="0.8" />
      <rect x="31" y="103" width="24" height="2" rx="1" fill="#f472b6" opacity="0.7" />
      <rect x="31" y="108" width="14" height="2" rx="1" fill="#6366f1" opacity="0.6" />
      {/* blinking cursor */}
      <rect x="46" y="108" width="2" height="2" rx="0.5" fill="#e2e8f0" opacity="0.9" />
      {/* camera dot */}
      <circle cx="50" cy="84.5" r="1" fill="#3f3f46" />

      {/* ── Hoodie body ── */}
      {/* main torso */}
      <rect x="22" y="58" width="56" height="30" rx="10" fill="#27272a" />
      {/* hoodie pocket */}
      <rect x="35" y="72" width="30" height="13" rx="6" fill="#1e1e1e" />
      {/* hoodie front zip line */}
      <line x1="50" y1="58" x2="50" y2="85" stroke="#3f3f46" strokeWidth="1.5" />
      {/* hood/collar */}
      <path d="M34 58 Q50 48 66 58" fill="#2d2d2d" />

      {/* ── Left arm — resting on laptop ── */}
      <path
        d="M22 65 Q12 72 16 85 Q18 90 26 90"
        stroke="#27272a"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* left hand on keyboard */}
      <ellipse cx="26" cy="90" rx="6" ry="4" fill="#FDBCB4" />
      <circle cx="23" cy="89" r="1.5" fill="#e8a090" />
      <circle cx="26" cy="88" r="1.5" fill="#e8a090" />
      <circle cx="29" cy="89" r="1.5" fill="#e8a090" />

      {/* ── Right arm — resting on laptop ── */}
      <path
        d="M78 65 Q88 72 84 85 Q82 90 74 90"
        stroke="#27272a"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      {/* right hand on keyboard */}
      <ellipse cx="74" cy="90" rx="6" ry="4" fill="#FDBCB4" />
      <circle cx="71" cy="89" r="1.5" fill="#e8a090" />
      <circle cx="74" cy="88" r="1.5" fill="#e8a090" />
      <circle cx="77" cy="89" r="1.5" fill="#e8a090" />

      {/* ── Neck ── */}
      <rect x="44" y="48" width="12" height="12" rx="3" fill="#FDBCB4" />

      {/* ── Head ── */}
      <circle cx="50" cy="34" r="20" fill="#FDBCB4" />

      {/* ── Hair — messy coder hair ── */}
      <ellipse cx="50" cy="16" rx="20" ry="11" fill="#1a1014" />
      {/* front tufts */}
      <path d="M30 22 Q35 12 42 18" fill="#1a1014" />
      <path d="M68 24 Q66 14 58 18" fill="#1a1014" />
      {/* side bits */}
      <ellipse cx="30" cy="27" rx="4" ry="7" fill="#1a1014" />
      <ellipse cx="70" cy="27" rx="4" ry="7" fill="#1a1014" />

      {/* ── Ears ── */}
      <ellipse cx="30" cy="34" rx="3.5" ry="4.5" fill="#FDBCB4" />
      <ellipse cx="70" cy="34" rx="3.5" ry="4.5" fill="#FDBCB4" />
      {/* ear buds / headphones hint */}
      <circle cx="30" cy="34" r="2" fill="#111" />
      <circle cx="70" cy="34" r="2" fill="#111" />

      {/* ── Glasses frames ── */}
      {/* left lens */}
      <rect
        x="33"
        y="28"
        width="13"
        height="10"
        rx="3.5"
        stroke="#1e1e2e"
        strokeWidth="2"
        fill="none"
      />
      {/* right lens */}
      <rect
        x="54"
        y="28"
        width="13"
        height="10"
        rx="3.5"
        stroke="#1e1e2e"
        strokeWidth="2"
        fill="none"
      />
      {/* bridge */}
      <line x1="46" y1="33" x2="54" y2="33" stroke="#1e1e2e" strokeWidth="1.8" />
      {/* arms */}
      <line x1="33" y1="33" x2="27" y2="33" stroke="#1e1e2e" strokeWidth="1.8" />
      <line x1="67" y1="33" x2="73" y2="33" stroke="#1e1e2e" strokeWidth="1.8" />
      {/* lens tint */}
      <rect x="34" y="29" width="11" height="8" rx="2.5" fill="#6366f1" opacity="0.15" />
      <rect x="55" y="29" width="11" height="8" rx="2.5" fill="#6366f1" opacity="0.15" />

      {/* ── Eyes ── */}
      <ellipse cx="39.5" cy="33" rx="2.5" ry="3" fill="white" />
      <ellipse cx="60.5" cy="33" rx="2.5" ry="3" fill="white" />
      <circle cx="40" cy="33.5" r="1.8" fill="#1a1a2e" />
      <circle cx="61" cy="33.5" r="1.8" fill="#1a1a2e" />
      <circle cx="40.6" cy="32.5" r="0.7" fill="white" />
      <circle cx="61.6" cy="32.5" r="0.7" fill="white" />

      {/* ── Eyebrows — focused/concentrated ── */}
      <path
        d="M34 27 Q39 24.5 44 26.5"
        stroke="#1a1014"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M56 26.5 Q61 24.5 66 27"
        stroke="#1a1014"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Subtle smirk ── */}
      <path
        d="M44 42 Q50 46 56 42"
        stroke="#c0726a"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* cheeks */}
      <ellipse cx="37" cy="40" rx="4" ry="2.5" fill="#f4a0a0" opacity="0.35" />
      <ellipse cx="63" cy="40" rx="4" ry="2.5" fill="#f4a0a0" opacity="0.35" />

      {/* ── Hoodie hood behind head ── */}
      <path
        d="M30 52 Q22 38 28 22 Q32 14 50 12 Q68 14 72 22 Q78 38 70 52"
        stroke="#2d2d2d"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// Shown on first paint before local time is applied (avoids hydration mismatch + empty bubble)
const TIME_FALLBACK: TimeContext = {
  greeting: "Hello",
  quip: "Welcome — glad you're here.",
  emoji: "👋",
}

// ─────────────────────────────────────────────────────────────────────────────
// Greeting bar
// ─────────────────────────────────────────────────────────────────────────────
export function GreetingBar() {
  const { user, logout } = useAuthStore()
  const [dismissed, setDismissed] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [bubbleDismissed, setBubbleDismissed] = useState(false)
  const [timeCtx, setTimeCtx] = useState<TimeContext | null>(null)

  // Defer setState out of the effect body (react-hooks/set-state-in-effect) + keep SSR/client first paint aligned
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setTimeCtx(getTimeContext())
    })
    return () => cancelAnimationFrame(id)
  }, [])

  if (!user || dismissed) return null

  const display = timeCtx ?? TIME_FALLBACK

  return (
    <>
      <div className="animate-slide-up fixed bottom-0 left-4 z-50 flex items-end gap-3">
        {/* ── Avatar ── */}
        <div className="group flex flex-col items-center">
          {/* Hover dismiss */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="mb-1 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-red-500 hover:text-white"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="h-[130px] w-[86px] drop-shadow-[0_4px_24px_rgba(99,102,241,0.35)]">
            <CoderAvatar />
          </div>

          {/* Indigo glow underfoot */}
          <div className="h-2 w-20 rounded-full bg-indigo-500/25 blur-md" />
        </div>

        {/* ── Thought bubble ── */}
        {!bubbleDismissed && (
          <div className="relative mb-10">
            {/* Connecting dots from avatar to bubble */}
            <div className="absolute -bottom-4 -left-4 flex items-end gap-[3px]">
              <span className="block h-2 w-2 rounded-full bg-[#18181b] ring-1 ring-white/10" />
              <span className="block h-3 w-3 rounded-full bg-[#18181b] ring-1 ring-white/10" />
            </div>

            {/* Dismiss bubble */}
            <button
              onClick={() => setBubbleDismissed(true)}
              aria-label="Dismiss greeting"
              className="absolute -top-2.5 -right-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-zinc-400 shadow-lg transition-colors hover:bg-red-500 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>

            {/* Bubble — fully solid, no transparency */}
            <div className="w-[270px] rounded-2xl rounded-bl-sm border border-white/10 bg-[#18181b] shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(99,102,241,0.15)]">
              {/* Top stripe — indigo accent */}
              <div className="flex items-center gap-2 rounded-t-2xl border-b border-white/8 bg-indigo-950/60 px-4 py-2.5">
                <span className="font-mono text-lg">{display.emoji}</span>
                <span className="font-mono text-xs font-semibold tracking-widest text-indigo-300 uppercase">
                  {display.greeting}
                </span>
                {/* Fake terminal dots */}
                <div className="ml-auto flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500/70" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                  <span className="h-2 w-2 rounded-full bg-green-500/70" />
                </div>
              </div>

              {/* Body */}
              <div className="px-4 py-3">
                {/* Greeting line */}
                <p className="font-mono text-sm leading-snug text-white">
                  <span className="text-indigo-400">hey </span>
                  <span className="font-bold text-sky-300">{emailHandle(user.email)}</span>
                  <span className="text-white/60"> ~$</span>
                </p>

                {/* Quip — styled like a terminal comment */}
                <p className="mt-1.5 font-mono text-xs leading-relaxed text-emerald-400">
                  <span className="text-zinc-600"># </span>
                  {display.quip}
                </p>

                <p className="mt-1 font-mono text-xs text-zinc-500">Welcome to my portfolio ✦</p>

                {/* Divider */}
                <div className="my-3 h-px bg-white/6" />

                {/* Sign out */}
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-1.5 font-mono text-xs text-zinc-600 transition-colors hover:text-red-400"
                >
                  <LogOut className="h-3 w-3" />
                  <span>logout</span>
                  <span className="text-zinc-700">--session</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <LogoutConfirm
        isOpen={showLogoutConfirm}
        onConfirm={() => {
          setShowLogoutConfirm(false)
          logout()
          setDismissed(true)
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  )
}
