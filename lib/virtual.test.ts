// Tests for the windowed-rendering arithmetic. DOM-free on purpose: the hook
// that measures real elements is covered separately in
// registry/primitives/use-virtual-rows.

import { describe, expect, it } from "vitest"

import { initialWindow, windowSlice } from "./virtual"

// A plain list: 1 column, 50px rows, a 500px viewport, no buffer unless stated.
const list = (over: Partial<Parameters<typeof windowSlice>[0]> = {}) =>
  windowSlice({
    count: 1000,
    columns: 1,
    pitch: 50,
    listTop: 0,
    viewportHeight: 500,
    overscan: 0,
    ...over,
  })

describe("windowSlice — what actually gets rendered", () => {
  it("renders only the viewport's worth of rows at the top of a long list", () => {
    const w = list()
    expect(w.start).toBe(0)
    expect(w.end).toBe(10) // 500px / 50px
    expect(w.padTop).toBe(0)
    expect(w.padBottom).toBe(990 * 50)
  })

  it("preserves total height exactly — the scrollbar must not move", () => {
    // This is the whole contract: rendered rows + spacers === the un-windowed
    // height. If this drifts, scrolling jumps and anchors land in the wrong place.
    for (const listTop of [0, -137, -5000, -49_950, 300]) {
      const w = list({ listTop })
      const rendered = (w.end - w.start) * 50
      expect(w.padTop + rendered + w.padBottom).toBe(1000 * 50)
    }
  })

  it("moves the window as the list scrolls up past the viewport", () => {
    const w = list({ listTop: -5000 }) // 100 rows scrolled past
    expect(w.start).toBe(100)
    expect(w.end).toBe(110)
    expect(w.padTop).toBe(5000)
  })

  it("adds overscan on both sides", () => {
    const w = list({ listTop: -5000, overscan: 3 })
    expect(w.start).toBe(97)
    expect(w.end).toBe(113)
    expect(w.padTop).toBe(97 * 50)
  })

  it("never overscans past the start of the list", () => {
    const w = list({ listTop: 0, overscan: 10 })
    expect(w.start).toBe(0)
    expect(w.padTop).toBe(0)
  })

  it("never runs past the end of the list", () => {
    const w = list({ listTop: -(1000 * 50), overscan: 10 })
    expect(w.end).toBe(1000)
    expect(w.padBottom).toBe(0)
  })

  it("keeps one row mounted when the list is entirely off-screen", () => {
    // Below the fold entirely...
    const below = list({ listTop: 10_000 })
    expect(below.end - below.start).toBe(1)
    // ...and scrolled far past the bottom.
    const above = list({ listTop: -999_999 })
    expect(above.end - above.start).toBe(1)
    // Height is still exact in both cases.
    for (const w of [below, above])
      expect(w.padTop + (w.end - w.start) * 50 + w.padBottom).toBe(1000 * 50)
  })

  it("handles a partially-scrolled list (top above the fold, tail below)", () => {
    const w = list({ listTop: -125 }) // 2.5 rows in
    expect(w.start).toBe(2)
    expect(w.end).toBe(13)
  })
})

describe("windowSlice — grids", () => {
  it("windows by visual ROW, not by item, when there are N columns", () => {
    const w = windowSlice({
      count: 1000,
      columns: 4,
      pitch: 200,
      listTop: 0,
      viewportHeight: 600,
      overscan: 0,
    })
    expect(w.start).toBe(0)
    expect(w.end).toBe(12) // 3 rows of 4
    expect(w.padBottom).toBe((250 - 3) * 200)
  })

  it("never splits a grid row across the window boundary", () => {
    const w = windowSlice({
      count: 1000,
      columns: 3,
      pitch: 100,
      listTop: -1000,
      viewportHeight: 500,
      overscan: 1,
    })
    expect(w.start % 3).toBe(0)
  })

  it("clamps the last window to the item count, not the row count", () => {
    // 10 items in 3 columns = 4 rows, the last of which holds only one item.
    const w = windowSlice({
      count: 10,
      columns: 3,
      pitch: 100,
      listTop: 0,
      viewportHeight: 1000,
      overscan: 0,
    })
    expect(w.end).toBe(10)
    expect(w.padBottom).toBe(0)
  })
})

describe("windowSlice — degenerate input renders EVERYTHING, never a wrong window", () => {
  it("falls back when the pitch has not been measured yet", () => {
    for (const pitch of [0, -10, NaN, Infinity]) {
      const w = list({ pitch })
      expect(w).toEqual({ start: 0, end: 1000, padTop: 0, padBottom: 0 })
    }
  })

  it("falls back on a non-finite viewport or list offset", () => {
    expect(list({ viewportHeight: NaN }).end).toBe(1000)
    expect(list({ viewportHeight: -1 }).end).toBe(1000)
    expect(list({ listTop: NaN }).end).toBe(1000)
  })

  it("returns an empty window for an empty collection", () => {
    expect(list({ count: 0 })).toEqual({
      start: 0,
      end: 0,
      padTop: 0,
      padBottom: 0,
    })
  })

  it("treats a nonsense column count as a single column", () => {
    for (const columns of [0, -3, NaN])
      expect(list({ columns, count: 10, viewportHeight: 500 }).end).toBe(10)
  })

  it("falls back when the viewport measures zero", () => {
    // Not a window of one row: a zero viewport means we don't know what's on
    // screen, and if the container later appears without firing a resize we'd be
    // left showing a single row. Rendering everything is merely slow.
    expect(list({ viewportHeight: 0 }).end).toBe(1000)
  })
})

describe("initialWindow — the pre-measurement paint", () => {
  it("is a pure function of its arguments (server and client must agree)", () => {
    // If this ever depended on the real viewport, hydration would mismatch.
    const a = initialWindow(5000, 56, 1, 6)
    const b = initialWindow(5000, 56, 1, 6)
    expect(a).toEqual(b)
  })

  it("renders a screenful, not the whole list", () => {
    const w = initialWindow(5000, 56, 1, 6)
    expect(w.start).toBe(0)
    expect(w.end).toBeLessThan(50)
    expect(w.end).toBeGreaterThan(10)
  })

  it("still preserves total height", () => {
    const w = initialWindow(5000, 56, 1, 6)
    expect(w.padTop + (w.end - w.start) * 56 + w.padBottom).toBe(5000 * 56)
  })

  it("renders everything when the collection is smaller than one screen", () => {
    const w = initialWindow(5, 56, 1, 6)
    expect(w.end).toBe(5)
    expect(w.padBottom).toBe(0)
  })
})
