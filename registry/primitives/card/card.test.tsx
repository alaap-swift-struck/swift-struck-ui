// Card — the `min-w-0` regression guard.
//
// WHY THIS EXISTS: `min-width: auto` has now caused three separate bugs in this
// library (Choice's trigger shearing text, the chart refusing to shrink, and the
// page scrolling sideways). All three are the same thing: a flex/grid item
// defaults to `min-width: auto` and will not shrink below its widest child, so
// ONE wide child pins its container open and pushes the page sideways.
//
// The fix lives on Card because a Card is almost always a grid/flex item, and
// fixing it at the producer means it cannot recur every time something wide
// (a chart, a table, a long unbroken string) lands inside one.
//
// WHAT THIS TEST CAN AND CANNOT DO — read before "improving" it:
// jsdom has NO layout engine. Every element is 0x0, `offsetWidth` is always 0,
// and CSS is never cascaded. So "render a wide child and assert the parent did
// not widen" is not expressible here — such a test would pass identically
// against a Card with `min-w-0` deleted, i.e. it would be a test that cannot
// fail. What IS expressible, and what actually broke, is the class contract:
// the class was simply absent. These assertions go red the moment it is removed
// (verified by deleting `min-w-0` from card.tsx: 3 failures).
//
// Real pixel behaviour is verified in a browser at 1280 -> 700 -> 375 and
// recorded in the session notes. If this library ever gains an e2e runner, the
// layout assertion belongs there — not here, pretending.

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Card } from "./card"

const cls = (el: Element | null) => (el?.className ?? "").split(/\s+/)

describe("Card can always shrink below its widest child", () => {
  it("carries min-w-0 by default", () => {
    const { container } = render(<Card>content</Card>)
    expect(cls(container.firstElementChild)).toContain("min-w-0")
  })

  it("keeps min-w-0 when a consumer passes unrelated classes", () => {
    // The realistic silent break: someone adds layout/spacing classes at a call
    // site and the merge drops the guard.
    const { container } = render(
      <Card className="flex flex-col gap-4 p-6">content</Card>
    )
    expect(cls(container.firstElementChild)).toContain("min-w-0")
  })

  it("keeps min-w-0 when the Card holds a deliberately wide child", () => {
    // The exact shape of the bug: a wide, unbreakable child inside a Card that
    // is itself a grid item. jsdom can't measure it, but the guard must survive
    // the render path the bug travelled through.
    const { container } = render(
      <div className="grid grid-cols-1">
        <Card>
          <div style={{ width: 2000 }}>{"x".repeat(400)}</div>
        </Card>
      </div>
    )
    const card = container.querySelector(".grid > div")
    expect(cls(card)).toContain("min-w-0")
  })

  it("lets an explicit min-w-* from the call site win", () => {
    // Not a bug — an intentional override must still be possible. Documented so
    // nobody "fixes" the merge order and makes Card un-overridable.
    const { container } = render(<Card className="min-w-[40rem]" />)
    const c = cls(container.firstElementChild)
    expect(c).toContain("min-w-[40rem]")
    expect(c).not.toContain("min-w-0")
  })
})
