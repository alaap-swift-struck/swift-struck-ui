// Windowed rendering, wired into the collections that actually hold volume.
//
// The ask this answers: a screen holding 2,000 loaded rows was putting 2,000
// nodes in the DOM. The data side was already bounded (the host caps its cache
// and pages by keyset); the render side wasn't.
//
// One file rather than three because this is a cross-collection contract and
// the jsdom layout stub is the bulk of it — the same reason
// render-smoke.test.tsx is shared. jsdom has no layout engine, so geometry is
// stubbed exactly as in use-virtual-rows.test.tsx; what is asserted here is the
// WIRING (does each collection window, does it keep its own semantics intact),
// not the arithmetic, which lib/virtual.test.ts owns.

import * as React from "react"
import { act, render } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { CardGrid } from "./card-grid/card-grid"
import { DataTable, defaultDataTableConfig } from "./data-table/data-table"
import { List } from "./list/list"

/* ------------------------- stubbed jsdom layout ------------------------- */

const PITCH = 50
const VIEWPORT = 500
let columns = 1
let scrolledBy = 0
let originalOffsetTop: PropertyDescriptor | undefined
let originalOffsetHeight: PropertyDescriptor | undefined
const originalRect = Element.prototype.getBoundingClientRect

beforeEach(() => {
  columns = 1
  scrolledBy = 0
  originalOffsetTop = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetTop"
  )
  originalOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetHeight"
  )
  Object.defineProperty(HTMLElement.prototype, "offsetTop", {
    configurable: true,
    get(this: HTMLElement) {
      const parent = this.parentElement
      if (!parent) return 0
      // Spacer nodes occupy the top of the container and are not rows.
      const siblings = Array.from(parent.children).filter(
        (el) => !el.hasAttribute("data-virtual-spacer")
      )
      const index = siblings.indexOf(this)
      if (index < 0) return 0
      return Math.floor(index / columns) * PITCH
    },
  })
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => PITCH,
  })
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    get: () => VIEWPORT,
  })
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
  if (originalOffsetTop)
    Object.defineProperty(HTMLElement.prototype, "offsetTop", originalOffsetTop)
  if (originalOffsetHeight)
    Object.defineProperty(
      HTMLElement.prototype,
      "offsetHeight",
      originalOffsetHeight
    )
  Element.prototype.getBoundingClientRect = originalRect
})

const scrollTo = (px: number) => {
  scrolledBy = px
  act(() => {
    window.dispatchEvent(new Event("scroll"))
  })
}

const listItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({
    id: `row-${i}`,
    title: `Row ${i}`,
  }))

const tableRows = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ idx: String(i), name: `Row ${i}` }))

const tableConfig = {
  ...defaultDataTableConfig,
  columns: [
    {
      key: "idx",
      header: "#",
      type: "text" as const,
      sortable: false,
      align: "left" as const,
    },
    {
      key: "name",
      header: "Name",
      type: "text" as const,
      sortable: false,
      align: "left" as const,
    },
  ],
}

/* --------------------------------- List --------------------------------- */

describe("List", () => {
  it("puts a screenful in the DOM, not 2,000 rows", () => {
    const { container } = render(<List items={listItems(2000)} />)
    const rows = container.querySelectorAll("[aria-current], .divide-y > div")
    expect(rows.length).toBeGreaterThan(0)
    expect(rows.length).toBeLessThan(40)
  })

  it("reserves the removed rows' height so the scrollbar does not move", () => {
    const { container } = render(<List items={listItems(2000)} />)
    const surface = container.firstElementChild as HTMLElement
    const rendered = surface.querySelectorAll(".divide-y > div").length
    const padTop = parseFloat(surface.style.paddingTop || "0")
    const padBottom = parseFloat(surface.style.paddingBottom || "0")
    expect(padTop + rendered * PITCH + padBottom).toBe(2000 * PITCH)
  })

  it("shows later rows as the page scrolls", () => {
    const { container } = render(<List items={listItems(2000)} />)
    expect(container.textContent).toContain("Row 0")

    scrollTo(500 * PITCH)
    expect(container.textContent).not.toContain("Row 0")
    expect(container.textContent).toContain("Row 500")
  })

  it("is completely inert below the threshold — no spacers, every row present", () => {
    const { container } = render(<List items={listItems(20)} />)
    const surface = container.firstElementChild as HTMLElement
    expect(surface.querySelectorAll(".divide-y > div").length).toBe(20)
    expect(surface.style.paddingTop).toBe("")
    expect(surface.style.paddingBottom).toBe("")
  })

  it("can be forced off, and then renders all 2,000", () => {
    const { container } = render(
      <List items={listItems(2000)} virtualize={false} />
    )
    expect(container.querySelectorAll(".divide-y > div").length).toBe(2000)
  })

  it("keeps selection and click behaviour on windowed rows", () => {
    const seen: string[] = []
    const { container } = render(
      <List
        items={listItems(2000)}
        selectedId="row-3"
        onSelect={(i) => seen.push(i.id)}
      />
    )
    const selected = container.querySelector('[aria-current="true"]')
    expect(selected?.textContent).toContain("Row 3")
    ;(container.querySelector("button") as HTMLButtonElement).click()
    expect(seen).toHaveLength(1)
  })
})

/* ------------------------------- CardGrid ------------------------------- */

describe("CardGrid", () => {
  it("windows a large grid", () => {
    const items = Array.from({ length: 2000 }, (_, i) => ({
      id: `c-${i}`,
      title: `Card ${i}`,
    }))
    const { container } = render(<CardGrid items={items} />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.children.length).toBeLessThan(60)
    expect(grid.children.length).toBeGreaterThan(0)
  })

  it("windows by whole grid rows once the column count is measured", () => {
    columns = 4
    const items = Array.from({ length: 2000 }, (_, i) => ({
      id: `c-${i}`,
      title: `Card ${i}`,
    }))
    const { container } = render(<CardGrid items={items} />)
    scrollTo(20 * PITCH)
    const first = container.textContent?.match(/Card (\d+)/)?.[1]
    expect(Number(first) % 4).toBe(0)
  })

  it("is inert below the threshold", () => {
    const items = Array.from({ length: 12 }, (_, i) => ({
      id: `c-${i}`,
      title: `Card ${i}`,
    }))
    const { container } = render(<CardGrid items={items} />)
    const grid = container.firstElementChild as HTMLElement
    expect(grid.children.length).toBe(12)
    expect(grid.style.paddingTop).toBe("")
  })
})

/* ------------------------------ DataTable ------------------------------ */

const dataRows = (c: HTMLElement) =>
  c.querySelectorAll("tbody tr:not([data-virtual-spacer])")

describe("DataTable", () => {
  it("windows the rows the frame hands it", () => {
    const { container } = render(
      <DataTable data={tableRows(2000)} config={tableConfig} />
    )
    expect(dataRows(container).length).toBeGreaterThan(0)
    expect(dataRows(container).length).toBeLessThan(40)
  })

  it("uses spacer ROWS above AND below, accounting for the full height", () => {
    // Padding on a tbody is not rendered in table layout, so the empty space
    // has to be real rows. Scrolled into the MIDDLE on purpose: at the top of
    // the list padTop is legitimately 0, so a test that never scrolls would
    // pass with the top spacer deleted entirely.
    const { container } = render(
      <DataTable data={tableRows(2000)} config={tableConfig} />
    )
    scrollTo(600 * PITCH)

    const spacers = container.querySelectorAll("tbody tr[data-virtual-spacer]")
    expect(spacers.length).toBe(2) // one above, one below

    // A spacer must span the whole table or it would shift the column widths.
    for (const s of spacers)
      expect(s.querySelector("td")?.getAttribute("colspan")).toBe("2")

    const px = (el: Element) =>
      parseFloat((el.querySelector("td") as HTMLElement).style.height || "0")
    const rendered = dataRows(container).length
    expect(px(spacers[0]) + rendered * PITCH + px(spacers[1])).toBe(
      2000 * PITCH
    )
  })

  it("stripes by ABSOLUTE row index, so the zebra pattern does not flip when scrolled", () => {
    // The subtle one. Striping is `index % 2`; using the SLICED index would
    // restart the pattern at every window, so stripes would visibly invert as
    // you scroll. Scrolled here so the first rendered row is ODD (501) — an even
    // start would give the same answer either way and prove nothing.
    const { container } = render(
      <DataTable data={tableRows(2000)} config={tableConfig} />
    )
    scrollTo((501 + 6) * PITCH) // + the default overscan of 6
    const rows = dataRows(container)
    expect(rows[0].textContent).toContain("Row 501")
    expect(rows[0].className).toContain("bg-muted/40") // 501 is odd → striped
    expect(rows[1].className).not.toContain("bg-muted/40")
  })

  it("is inert below the threshold — no spacers at all", () => {
    const { container } = render(
      <DataTable data={tableRows(20)} config={tableConfig} />
    )
    expect(dataRows(container).length).toBe(20)
    expect(container.querySelectorAll("[data-virtual-spacer]").length).toBe(0)
  })

  it("does not engage when pagination has already bounded the rows", () => {
    // itemsPerPage means the frame hands over one page; windowing must simply
    // never trigger rather than fight the pager.
    const { container } = render(
      <DataTable
        data={tableRows(2000)}
        config={{ ...tableConfig, itemsPerPage: 25 }}
      />
    )
    expect(dataRows(container).length).toBe(25)
    expect(container.querySelectorAll("[data-virtual-spacer]").length).toBe(0)
  })
})

/* ------------------------- the compatibility bar ------------------------- */

describe("the props API is unchanged — host recipes need no edits", () => {
  it("every collection still renders with exactly its pre-existing props", () => {
    // If any of these had gained a required prop, this would not type-check or
    // would render empty. `virtualize` is optional everywhere by design.
    const { container: a } = render(<List items={listItems(3)} />)
    expect(a.textContent).toContain("Row 0")

    const { container: b } = render(
      <CardGrid items={[{ id: "x", title: "Card X" }]} />
    )
    expect(b.textContent).toContain("Card X")

    const { container: c } = render(
      <DataTable data={tableRows(3)} config={tableConfig} />
    )
    expect(c.textContent).toContain("Row 2")
  })
})
