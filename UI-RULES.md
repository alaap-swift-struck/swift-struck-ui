# UI rules (the design-language contract)

These are hard rules for every app built on Swift Struck UI. They keep the
look **powerful, subtle, professional, intelligent** — and consistent across
every screen and every app. Break one only when the user explicitly asks.

## 1 · No emojis in product UI

Never put emojis in screens, buttons, labels, toasts, copy, or code comments
of a shipped app. They read as casual; we read as powerful and precise. Use
real iconography (lucide via the library) when a glyph is needed. Emojis are
allowed **only** when the user explicitly asks for them, or in throwaway dev
tooling that users never see (e.g. a local report).

## 2 · Contentless pages are immovable

A page must not scroll or rubber-band when its content already fits the
screen. Sign-in, onboarding, confirmations, empty states — they sit perfectly
still on every device, including mobile.

How the library enforces it (you inherit this for free):

- `html { overscroll-behavior: none }` — kills the rubber-band bounce globally.
- `body { min-height: 100svh }` — uses the **small viewport height**, so a
  full-height page fits the *visible* area even with a mobile toolbar showing.

How apps apply it on single-screen pages:

- Size the page to `min-h-[100svh]` (NOT `min-h-screen` / `100vh`, which can
  exceed the visible area on mobile and create phantom scroll).
- Let content grow naturally — when it genuinely overflows, the page scrolls;
  when it fits, it can't move.

## 3 · The background is alive (subtle by design)

The general background is never flat black. It carries a soft **source of
light** (a top glow + brand-tinted corners) and the `AmbientBackground`
component layers a slow **heartbeat** — a gentle drift plus a shallow opacity
pulse — so the app feels like it has a pulse without ever being busy. It stays
**frosted and subtle** (the heavier "liquid-glass gloss" was tried and
rejected). All of it is token-driven and lives in `styles.css`; mount
`<AmbientBackground />` once near the app root and it's everywhere.
Respects `prefers-reduced-motion` (motion off, light stays).
