// Chart — the "it must SHRINK, not just grow" regression guard.
//
// WHY THIS EXISTS: this bug shipped twice. The chart measured its container and
// passed explicit pixel dimensions to Recharts; dragging a desktop window down
// to phone width left the chart at its old width and the page scrolled sideways.
// A fresh load at the same width was fine, so it only bit on window-drag and
// device rotation — which is exactly the case no static render test sees.
//
// The mechanism has three moving parts, and all three are asserted below:
//   1. it measures SYNCHRONOUSLY on mount (the fresh-load case),
//   2. a ResizeObserver callback RE-measures — and the new width may be SMALLER,
//   3. a `window.resize` event is a second, independent trigger, because a lone
//      ResizeObserver is not reliably delivered in every host.
//
// WHAT THIS TEST CAN AND CANNOT DO: jsdom has no layout, so `clientWidth` is
// stubbed and the ResizeObserver is driven by hand. That means this covers the
// component's REACTION (does it re-measure, does it accept a smaller number),
// not real layout. The `min-w-0` + `overflow-hidden` belt-and-braces on the
// wrapper is asserted as a class contract for the same reason as in
// card.test.tsx. Proven able to fail: reverting the effect to a grow-only
// `setWidth(Math.max(width, el.clientWidth))` turns the shrink test red.

import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { Chart, defaultChartConfig } from "./chart"

const DATA = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
]

// --- controllable container width -----------------------------------------
let stubWidth = 0
let originalClientWidth: PropertyDescriptor | undefined

// --- controllable ResizeObserver ------------------------------------------
let observers: Array<() => void> = []
class ControllableRO {
  constructor(private cb: () => void) {
    observers.push(cb)
  }
  observe() {}
  unobserve() {}
  disconnect() {
    observers = observers.filter((o) => o !== this.cb)
  }
}

/** Resize the container the way a real browser would: box first, then notify. */
function resizeTo(px: number, notify: "observer" | "window") {
  stubWidth = px
  act(() => {
    if (notify === "observer") observers.forEach((cb) => cb())
    else window.dispatchEvent(new Event("resize"))
  })
}

/** The width Recharts was actually handed. */
function renderedWidth(container: HTMLElement): number {
  const svg = container.querySelector("svg")
  return svg ? Number(svg.getAttribute("width")) : 0
}

beforeEach(() => {
  observers = []
  stubWidth = 900
  originalClientWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth"
  )
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return stubWidth
    },
  })
  // @ts-expect-error - test shim, restored below
  globalThis.ResizeObserver = ControllableRO
})

afterEach(() => {
  if (originalClientWidth)
    Object.defineProperty(
      HTMLElement.prototype,
      "clientWidth",
      originalClientWidth
    )
  else
    delete (HTMLElement.prototype as unknown as Record<string, unknown>)
      .clientWidth
})

describe("Chart resizes with its container", () => {
  it("measures on mount, before any resize event (fresh load)", () => {
    const { container } = render(
      <Chart data={DATA} config={{ ...defaultChartConfig, animate: false }} />
    )
    expect(renderedWidth(container)).toBe(900)
  })

  it("SHRINKS when the container gets narrower", () => {
    // The actual regression. Desktop -> phone, no reload.
    const { container } = render(
      <Chart data={DATA} config={{ ...defaultChartConfig, animate: false }} />
    )
    expect(renderedWidth(container)).toBe(900)

    resizeTo(320, "observer")
    expect(renderedWidth(container)).toBe(320)
  })

  it("grows again when the container widens", () => {
    const { container } = render(
      <Chart data={DATA} config={{ ...defaultChartConfig, animate: false }} />
    )
    resizeTo(320, "observer")
    resizeTo(1280, "observer")
    expect(renderedWidth(container)).toBe(1280)
  })

  it("re-measures on window resize even if the observer never fires", () => {
    // Not redundant: a single ResizeObserver is not reliably delivered in every
    // host (embedded webviews, background tabs, throttled rAF). Both harnesses
    // used to verify this library deliver zero RO callbacks — so the window
    // listener is the one that actually saves the page there.
    const { container } = render(
      <Chart data={DATA} config={{ ...defaultChartConfig, animate: false }} />
    )
    resizeTo(375, "window")
    expect(renderedWidth(container)).toBe(375)
  })

  it("subscribes to the observer and cleans up on unmount", () => {
    const { unmount } = render(
      <Chart data={DATA} config={{ ...defaultChartConfig, animate: false }} />
    )
    expect(observers.length).toBe(1)
    unmount()
    expect(observers.length).toBe(0)
  })

  it("legend LABELS use the text token, not the series colour", () => {
    // WHY: Recharts colours legend label text with the series colour by
    // default. That put --chart-2 (tuned to the 3:1 GRAPHICS floor) into 12px
    // text at 3.05:1 and --chart-1 at 4.07:1 — both under the 4.5:1 text floor,
    // with nothing in our own source asking for it. Proven able to fail:
    // deleting the `formatter` prop turns this red.
    const { container } = render(
      <Chart
        data={DATA}
        config={{ ...defaultChartConfig, animate: false, showLegend: true }}
      />
    )
    const labels = container.querySelectorAll(".recharts-legend-item-text")
    expect(labels.length).toBeGreaterThan(0)
    labels.forEach((label) => {
      // The formatter wraps the text in a span that pins the colour.
      const pinned = label.querySelector("span")
      expect(pinned).not.toBeNull()
      expect(pinned!.style.color).toContain("--color-muted-foreground")
    })
  })

  it("wrapper can never widen its parent (min-w-0 + overflow-hidden)", () => {
    // Belt and braces: even a momentarily stale measurement must clip rather
    // than push the page sideways. Same class-contract caveat as card.test.tsx.
    const { container } = render(
      <Chart data={DATA} config={{ ...defaultChartConfig, animate: false }} />
    )
    const cls = (container.firstElementChild?.className ?? "").split(/\s+/)
    expect(cls).toContain("min-w-0")
    expect(cls).toContain("overflow-hidden")
  })
})
