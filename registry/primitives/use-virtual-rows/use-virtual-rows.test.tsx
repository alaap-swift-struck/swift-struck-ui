// useVirtualRows — the DOM-facing half of windowed rendering.
//
// WHAT THIS TEST CAN AND CANNOT DO: jsdom has no layout engine. Every element
// reports offsetTop 0 and offsetHeight 0, and `getBoundingClientRect()` is all
// zeroes, so a real "scroll it and watch rows swap" test is not expressible
// here — the same limit documented in card.test.tsx and chart.test.tsx.
//
// So layout is STUBBED: rows are given synthetic offsets that describe a
// geometry (this many columns, this pitch), and the scroll viewport is driven by
// hand. That covers what actually broke or could break — does it measure the
// right pitch, does it find the column count, does it window to the viewport,
// does it stay off below the threshold, does it fall back safely when it cannot
// measure. The pure arithmetic is covered separately in lib/virtual.test.ts.
//
// Real scrolling in a real browser stays a manual check.

import * as React from "react"
import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  SPACER_ATTR,
  VIRTUALIZE_THRESHOLD,
  useVirtualRows,
} from "./use-virtual-rows"

/* ------------------------- stubbed jsdom layout ------------------------- */

let rowPitch = 50
let rowColumns = 1
let viewportHeight = 500
/** How far the list's top sits above the viewport top (i.e. scrolled past). */
let scrolledBy = 0

const originals: Record<string, PropertyDescriptor | undefined> = {}

beforeEach(() => {
  rowPitch = 50
  rowColumns = 1
  viewportHeight = 500
  scrolledBy = 0

  for (const prop of ["offsetTop", "offsetHeight"])
    originals[prop] = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      prop
    )

  // A child's offset is derived from its position among its siblings, so the
  // hook sees a believable grid: `rowColumns` children share each offsetTop.
  // An element can opt out with data-offset-top when a test needs to describe a
  // geometry the index can't express — a spacer that occupies real space.
  Object.defineProperty(HTMLElement.prototype, "offsetTop", {
    configurable: true,
    get(this: HTMLElement) {
      const explicit = this.getAttribute("data-offset-top")
      if (explicit != null) return Number(explicit)
      const parent = this.parentElement
      if (!parent) return 0
      const index = Array.from(parent.children).indexOf(this)
      return Math.floor(index / rowColumns) * rowPitch
    },
  })
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => rowPitch,
  })

  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    get: () => viewportHeight,
  })
  // The container's top edge relative to the page viewport.
  Element.prototype.getBoundingClientRect = function () {
    return {
      top: -scrolledBy,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect
  }
})

afterEach(() => {
  for (const [prop, desc] of Object.entries(originals))
    if (desc) Object.defineProperty(HTMLElement.prototype, prop, desc)
})

/* ------------------------------ the probe ------------------------------ */

let last: ReturnType<typeof useVirtualRows>

function Probe({
  count,
  enabled,
  overscan = 0,
  estimatePitch = 50,
}: {
  count: number
  enabled?: boolean
  overscan?: number
  estimatePitch?: number
}) {
  const v = useVirtualRows({ count, estimatePitch, overscan, enabled })
  last = v
  return (
    <div ref={v.containerRef} data-testid="container">
      {Array.from({ length: v.end - v.start }, (_, i) => (
        <div key={v.start + i} data-row={v.start + i}>
          row {v.start + i}
        </div>
      ))}
    </div>
  )
}

const rowCount = (c: HTMLElement) => c.querySelectorAll("[data-row]").length
const scrollTo = (px: number) => {
  scrolledBy = px
  act(() => {
    window.dispatchEvent(new Event("scroll"))
  })
}

/* -------------------------------- tests -------------------------------- */

describe("useVirtualRows — when it engages", () => {
  it("stays OFF below the threshold and renders every row", () => {
    const { getByTestId } = render(<Probe count={VIRTUALIZE_THRESHOLD} />)
    expect(last.active).toBe(false)
    expect(last.start).toBe(0)
    expect(last.end).toBe(VIRTUALIZE_THRESHOLD)
    expect(rowCount(getByTestId("container"))).toBe(VIRTUALIZE_THRESHOLD)
  })

  it("engages one row past the threshold", () => {
    render(<Probe count={VIRTUALIZE_THRESHOLD + 1} />)
    expect(last.active).toBe(true)
  })

  it("can be forced off for a large collection", () => {
    const { getByTestId } = render(<Probe count={2000} enabled={false} />)
    expect(last.active).toBe(false)
    expect(rowCount(getByTestId("container"))).toBe(2000)
  })

  it("can be forced on for a small one", () => {
    render(<Probe count={20} enabled />)
    expect(last.active).toBe(true)
  })
})

describe("useVirtualRows — bounding the DOM", () => {
  it("puts a screenful in the DOM instead of 2,000 rows", () => {
    // The actual ask: 2,000 loaded rows must not be 2,000 nodes.
    const { getByTestId } = render(<Probe count={2000} />)
    const rendered = rowCount(getByTestId("container"))
    expect(rendered).toBe(10) // 500px viewport / 50px rows
    expect(rendered).toBeLessThan(2000 / 50)
  })

  it("preserves the collection's full height with spacers", () => {
    render(<Probe count={2000} />)
    const rendered = (last.end - last.start) * rowPitch
    expect(last.padTop + rendered + last.padBottom).toBe(2000 * rowPitch)
  })

  it("swaps in later rows as the viewport scrolls, keeping the count bounded", () => {
    const { getByTestId } = render(<Probe count={2000} />)
    const container = getByTestId("container")
    expect(
      container.querySelector("[data-row]")?.getAttribute("data-row")
    ).toBe("0")

    scrollTo(25_000) // 500 rows down
    expect(last.start).toBe(500)
    expect(
      container.querySelector("[data-row]")?.getAttribute("data-row")
    ).toBe("500")
    expect(rowCount(container)).toBe(10)
    expect(last.padTop).toBe(25_000)
  })

  it("keeps total height exact at every scroll position", () => {
    render(<Probe count={2000} />)
    for (const px of [0, 137, 25_000, 99_500, 99_999]) {
      scrollTo(px)
      const rendered = (last.end - last.start) * rowPitch
      expect(last.padTop + rendered + last.padBottom).toBe(2000 * rowPitch)
    }
  })

  it("renders the tail, with no space below it, at the bottom", () => {
    render(<Probe count={2000} />)
    scrollTo(2000 * 50) // scrolled clean past the end
    expect(last.end).toBe(2000)
    expect(last.padBottom).toBe(0)
  })

  it("applies overscan on both sides", () => {
    render(<Probe count={2000} overscan={4} />)
    scrollTo(25_000)
    expect(last.start).toBe(496)
    expect(last.end).toBe(514)
  })
})

describe("useVirtualRows — measuring real geometry", () => {
  it("measures the row pitch instead of trusting the estimate", () => {
    rowPitch = 120 // the DOM disagrees with the 50px estimate below
    render(<Probe count={2000} estimatePitch={50} />)
    // 500px viewport / 120px rows = 5 rows (ceil), not the 10 the estimate implies.
    expect(last.end - last.start).toBe(5)
    expect(last.padTop + (last.end - last.start) * 120 + last.padBottom).toBe(
      2000 * 120
    )
  })

  it("derives the COLUMN COUNT from the rendered grid", () => {
    // A 4-across grid: windowing must step by visual row, not by item.
    rowColumns = 4
    render(<Probe count={2000} />)
    expect(last.start % 4).toBe(0)
    expect(last.end % 4).toBe(0)
    // 500px / 50px = 10 visual rows of 4 items.
    expect(last.end - last.start).toBe(40)
  })

  it("never splits a grid row when scrolled", () => {
    rowColumns = 3
    render(<Probe count={2000} />)
    scrollTo(5000)
    expect(last.start % 3).toBe(0)
  })

  it("re-measures on resize, so a grid re-flowing at a breakpoint stays right", () => {
    rowColumns = 4
    const { rerender } = render(<Probe count={2000} />)
    expect(last.end - last.start).toBe(40)

    rowColumns = 2 // narrower screen: the grid drops to 2 across
    viewportHeight = 500
    act(() => {
      window.dispatchEvent(new Event("resize"))
    })
    rerender(<Probe count={2000} />)
    expect(last.end - last.start).toBe(20)
  })

  it("falls back to rendering everything when it cannot measure a pitch", () => {
    // A pitch of 0 means "we don't know" — a wrong window is worse than a slow one.
    rowPitch = 0
    const { getByTestId } = render(<Probe count={300} estimatePitch={0} />)
    expect(rowCount(getByTestId("container"))).toBe(300)
    expect(last.padTop).toBe(0)
    expect(last.padBottom).toBe(0)
  })
})

describe("useVirtualRows — choosing the scroll container", () => {
  it("ignores <html>, so page scrolling still advances the window", () => {
    // REGRESSION, found in a real browser and invisible to the other tests here.
    // This library sets `html { overflow-x: hidden }`, and CSS computes the OTHER
    // axis of a hidden overflow to `auto` — so the root looked like a scroll
    // container to a naive ancestor walk. For the root element,
    // getBoundingClientRect().top is -scrollTop, so subtracting it from the
    // list's top cancelled the scroll out exactly and the window sat still while
    // the page scrolled. Proven able to fail: removing the root/body guard in
    // findScroller leaves `start` at 0 here.
    const realGetComputedStyle = window.getComputedStyle
    const root = document.documentElement
    const spy = (el: Element) =>
      el === root
        ? ({ overflowY: "auto" } as CSSStyleDeclaration)
        : realGetComputedStyle(el)
    window.getComputedStyle = spy
    Object.defineProperty(root, "scrollHeight", {
      configurable: true,
      value: 100_000,
    })
    Object.defineProperty(root, "clientHeight", {
      configurable: true,
      value: 500,
    })

    try {
      render(<Probe count={2000} />)
      scrollTo(25_000)
      expect(last.start).toBe(500)
      expect(last.padTop).toBe(25_000)
    } finally {
      window.getComputedStyle = realGetComputedStyle
      delete (root as unknown as Record<string, unknown>).scrollHeight
      delete (root as unknown as Record<string, unknown>).clientHeight
    }
  })
})

describe("useVirtualRows — spacer nodes are excluded from measurement", () => {
  it("ignores children marked as spacers when finding the pitch", () => {
    // A table has to use spacer ROWS rather than padding, because padding on a
    // tbody is not rendered in table layout. The geometry below is the real one:
    // the spacer sits at the top occupying `padTop` px, and the rows follow it.
    //
    // If measurement counted the spacer as a row, the first "two rows" would be
    // the spacer at 0 and the first real row also at 0 (padTop is 0 at the top
    // of the list) — so the hook would read TWO COLUMNS and render double the
    // window. Proven able to fail: deleting the SPACER_ATTR skip in
    // measureRows() turns this red.
    function WithSpacers() {
      const v = useVirtualRows({ count: 2000, estimatePitch: 50, overscan: 0 })
      last = v
      return (
        <div ref={v.containerRef} data-testid="container">
          <div
            {...{ [SPACER_ATTR]: "" }}
            data-offset-top="0"
            style={{ height: v.padTop }}
          />
          {Array.from({ length: v.end - v.start }, (_, i) => (
            <div
              key={v.start + i}
              data-row={v.start + i}
              data-offset-top={v.padTop + i * rowPitch}
            />
          ))}
        </div>
      )
    }
    rowColumns = 1
    render(<WithSpacers />)
    expect(last.end - last.start).toBe(10)
  })
})
