"use client"

/* ===========================================================================
 * TEMPORARY DESIGN PREVIEW — not part of the library.
 *
 * Self-contained: imports nothing from registry/ or the tokens, adds no deps.
 * Three motion directions for a "2026" feel. Delete this whole folder
 * (app/preview/) once a direction is chosen; nothing else depends on it.
 * Colors are hardcoded ON PURPOSE here — the final version tokenizes them.
 * ======================================================================== */

import * as React from "react"

/* ---------- shared motion helpers ---------- */

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3)

function useCountUp(to: number, duration = 1500) {
  const [value, setValue] = React.useState(0)
  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setValue(to * easeOutCubic(p))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return value
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <div className={`pv-fade-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function Sparkline({
  color = "#2dd4bf",
  className = "",
}: {
  color?: string
  className?: string
}) {
  const pts = [8, 14, 10, 18, 13, 22, 19, 28, 24, 34]
  const max = Math.max(...pts)
  const d = pts
    .map((p, i) => {
      const x = (i / (pts.length - 1)) * 100
      const y = 32 - (p / max) * 28
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className={className}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pv-draw"
      />
    </svg>
  )
}

/* Cursor-following spotlight — the "alive / reacting to you" hint. */
function SpotlightCard({
  children,
  className = "",
  glow = "rgba(45,212,191,0.16)",
}: {
  children: React.ReactNode
  className?: string
  glow?: string
}) {
  const [pos, setPos] = React.useState({ x: -300, y: -300 })
  const [active, setActive] = React.useState(false)
  return (
    <div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top })
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(440px circle at ${pos.x}px ${pos.y}px, ${glow}, transparent 55%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function SectionLabel({
  n,
  title,
  desc,
}: {
  n: string
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
        Direction {n}
      </span>
      <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
      <p className="max-w-prose text-sm text-white/50">{desc}</p>
    </div>
  )
}

/* =================================================================== */

export default function Preview() {
  const revenue = useCountUp(48250)
  const users = useCountUp(1284)

  return (
    <>
      <style>{css}</style>
      <main className="min-h-screen bg-[#070708] px-6 py-14 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-20">
          <FadeUp>
            <header className="flex flex-col gap-2">
              <span className="text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
                Temporary mockup · pick a direction
              </span>
              <h1 className="text-3xl font-semibold tracking-tight">
                A more 2026 feel
              </h1>
              <p className="max-w-prose text-sm text-white/50">
                Same content, three motion languages. Move your cursor over the
                cards, watch the numbers settle, refresh to replay the
                entrances. Subtle on purpose.
              </p>
            </header>
          </FadeUp>

          {/* ---------- DIRECTION A — Quiet Luxe ---------- */}
          <section className="flex flex-col gap-6">
            <FadeUp>
              <SectionLabel
                n="A"
                title="Quiet Luxe"
                desc="Hairline borders, layered shadows, staggered fade-ups, numbers that count up, gentle hover-lift. The restrained, expensive feel."
              />
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Revenue", value: `$${Math.round(revenue).toLocaleString()}`, sub: "+12.4% MoM" },
                { label: "Active Users", value: Math.round(users).toLocaleString(), sub: "+4.1% WoW" },
                { label: "Conversion", value: "3.8%", sub: "+0.6pt" },
              ].map((s, i) => (
                <FadeUp key={s.label} delay={100 + i * 90}>
                  <div className="pv-luxe group flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <span className="text-xs tracking-wide text-white/40 uppercase">
                      {s.label}
                    </span>
                    <span className="text-2xl font-semibold tabular-nums">
                      {s.value}
                    </span>
                    <span className="text-xs text-teal-400/80">{s.sub}</span>
                  </div>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={400}>
              <div className="flex flex-wrap items-center gap-3">
                <button className="pv-btn-luxe rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">
                  Primary action
                </button>
                <button className="pv-btn-luxe rounded-xl border border-white/12 bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/80">
                  Secondary
                </button>
              </div>
            </FadeUp>
          </section>

          {/* ---------- DIRECTION B — Aurora Glass ---------- */}
          <section className="flex flex-col gap-6">
            <FadeUp>
              <SectionLabel
                n="B"
                title="Aurora Glass"
                desc="A slow, living gradient drifts behind frosted glass. Gradient text, soft glow on primary actions. More expressive, still calm."
              />
            </FadeUp>
            <div className="pv-aurora-wrap relative overflow-hidden rounded-3xl border border-white/10 p-6">
              <div className="pv-aurora" aria-hidden />
              <div className="relative grid gap-4 sm:grid-cols-[1.4fr_1fr]">
                <div className="pv-glass flex flex-col gap-4 rounded-2xl p-6">
                  <span className="text-xs tracking-wide text-white/50 uppercase">
                    Monthly recurring revenue
                  </span>
                  <span className="pv-gradient-text text-4xl font-semibold tracking-tight tabular-nums">
                    ${Math.round(revenue).toLocaleString()}
                  </span>
                  <div className="h-px w-full bg-white/10" />
                  <Sparkline color="#5eead4" className="h-10 w-full" />
                </div>
                <div className="pv-glass flex flex-col justify-between gap-4 rounded-2xl p-6">
                  <p className="text-sm text-white/60">
                    Frosted surfaces let the motion behind them breathe through.
                  </p>
                  <button className="pv-btn-glow rounded-xl px-4 py-2.5 text-sm font-medium text-white">
                    Get started
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ---------- DIRECTION C — Living Surface ---------- */}
          <section className="flex flex-col gap-6">
            <FadeUp>
              <SectionLabel
                n="C"
                title="Living Surface"
                desc="Cards track your cursor with a soft spotlight, a live pulse and animated sparkline hint at an intelligent system working in the background. The most 'alive' option."
              />
            </FadeUp>
            <div className="grid gap-4 sm:grid-cols-2">
              <SpotlightCard className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <span className="pv-pulse relative flex size-2 rounded-full bg-teal-400" />
                    <span className="text-xs tracking-wide text-white/50 uppercase">
                      Live · syncing
                    </span>
                  </div>
                  <span className="text-2xl font-semibold tabular-nums">
                    {Math.round(users).toLocaleString()} sessions
                  </span>
                  <Sparkline color="#2dd4bf" className="h-10 w-full" />
                </div>
              </SpotlightCard>

              <SpotlightCard
                glow="rgba(251,191,36,0.16)"
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="flex flex-col gap-4">
                  <span className="pv-chip w-fit rounded-full px-2.5 py-1 text-[11px] font-medium">
                    ✦ AI suggestion
                  </span>
                  <p className="text-sm text-white/70">
                    Move your cursor across this card — the surface responds.
                    That responsiveness is the “intelligent” cue.
                  </p>
                  <button className="pv-magnetic w-fit rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium">
                    Apply suggestion
                  </button>
                </div>
              </SpotlightCard>
            </div>
          </section>

          <FadeUp>
            <footer className="border-t border-white/10 pt-6 text-sm text-white/40">
              Temporary preview · <code className="text-white/70">app/preview/</code> ·
              delete after we choose. Tell me A, B, C, or a mix — and what to dial
              up or down.
            </footer>
          </FadeUp>
        </div>
      </main>
    </>
  )
}

/* ---------- keyframes + custom classes (scoped with pv- prefix) ---------- */
const css = `
@keyframes pvFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.pv-fade-up { opacity: 0; animation: pvFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }

.pv-luxe { transition: transform .35s cubic-bezier(0.16,1,0.3,1), border-color .35s, background .35s; }
.pv-luxe:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.16); background: rgba(255,255,255,0.04); }

.pv-btn-luxe { transition: transform .25s cubic-bezier(0.16,1,0.3,1), box-shadow .25s, opacity .25s; }
.pv-btn-luxe:hover { transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(255,255,255,0.25); }
.pv-btn-luxe:active { transform: translateY(0); }

@keyframes pvAurora {
  0%   { transform: translate(-10%, -10%) rotate(0deg) scale(1); }
  50%  { transform: translate(10%, 5%) rotate(180deg) scale(1.25); }
  100% { transform: translate(-10%, -10%) rotate(360deg) scale(1); }
}
.pv-aurora-wrap { background: #0a0b10; }
.pv-aurora {
  position: absolute; inset: -40%;
  background:
    radial-gradient(40% 40% at 30% 30%, rgba(45,212,191,0.45), transparent 60%),
    radial-gradient(35% 35% at 70% 40%, rgba(99,102,241,0.40), transparent 60%),
    radial-gradient(40% 40% at 50% 70%, rgba(251,191,36,0.30), transparent 60%);
  filter: blur(40px);
  animation: pvAurora 18s ease-in-out infinite;
}
.pv-glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.12);
}
.pv-gradient-text {
  background: linear-gradient(90deg, #5eead4, #a5b4fc 60%, #fcd34d);
  -webkit-background-clip: text; background-clip: text;
  color: transparent;
}
.pv-btn-glow {
  background: linear-gradient(180deg, #14b8a6, #0d9488);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.08) inset, 0 8px 24px -8px rgba(20,184,166,0.7);
  transition: box-shadow .3s, transform .2s;
}
.pv-btn-glow:hover { box-shadow: 0 0 0 1px rgba(255,255,255,0.12) inset, 0 12px 34px -8px rgba(20,184,166,0.95); transform: translateY(-1px); }

@keyframes pvDraw { from { stroke-dashoffset: 240; } to { stroke-dashoffset: 0; } }
.pv-draw { stroke-dasharray: 240; animation: pvDraw 1.6s cubic-bezier(0.16,1,0.3,1) forwards; }

@keyframes pvPulse {
  0% { box-shadow: 0 0 0 0 rgba(45,212,191,0.55); }
  70% { box-shadow: 0 0 0 9px rgba(45,212,191,0); }
  100% { box-shadow: 0 0 0 0 rgba(45,212,191,0); }
}
.pv-pulse { animation: pvPulse 2s ease-out infinite; }

@keyframes pvShimmer { from { background-position: -150% 0; } to { background-position: 250% 0; } }
.pv-chip {
  color: #fde68a;
  background: linear-gradient(90deg, rgba(251,191,36,0.12), rgba(251,191,36,0.28), rgba(251,191,36,0.12));
  background-size: 200% 100%;
  border: 1px solid rgba(251,191,36,0.3);
  animation: pvShimmer 3.2s linear infinite;
}
.pv-magnetic { transition: transform .25s cubic-bezier(0.16,1,0.3,1), background .25s, border-color .25s; }
.pv-magnetic:hover { transform: scale(1.04); background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); }

@media (prefers-reduced-motion: reduce) {
  .pv-fade-up, .pv-aurora, .pv-draw, .pv-pulse, .pv-chip { animation: none; }
  .pv-fade-up { opacity: 1; }
}
`
