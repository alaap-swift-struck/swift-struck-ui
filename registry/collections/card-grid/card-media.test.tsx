// A CARD'S MEDIA SLOT HOLDS TWO DIFFERENT THINGS AND MUST LAY THEM OUT
// DIFFERENTLY.
//
// Reported by the host's owner on 19 Aug 2026 against the knowledge base, in his
// words: "knowledge base source logos are spilling out of cards". They were not
// spilling — they were flush. The slot's own docstring offered "an image, chart,
// or icon block" and wrapped all three in a bare <div> with no padding, so a 36px
// rounded mark landed hard in the card's corner, its own rounded edge colliding
// with the card's, while the title below it sat in CardHeader's 24px gutter. A
// photo wants exactly that zero padding; a mark never does.
//
// So the slot now takes `mediaFit`. The default is unchanged and the guardrail
// below proves it: a caller that says nothing renders byte-identical markup, so
// every existing full-bleed card is untouched by this.

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { defaultFieldConfig } from "../../../lib/config"
import type { ScreenRecipe } from "../../../lib/recipe"
import {
  ScreenRenderer,
  type ScreenData,
} from "../screen-renderer/screen-renderer"
import { CardGrid } from "./card-grid"

const mark = <span data-testid="mark">▣</span>

/** The wrapper the media sits in — the card's first child, whatever it holds. */
const mediaWrapper = (container: HTMLElement) =>
  container.querySelector("[data-testid='mark']")!.parentElement!

describe("CardGrid — the media slot", () => {
  it("bleeds to the card's edge by default, for a picture", () => {
    const { container } = render(
      <CardGrid items={[{ id: "1", title: "Acme", media: mark }]} />
    )
    expect(mediaWrapper(container).className).toBe("")
  })

  it("renders byte-identically when the default is passed explicitly", () => {
    const implicit = render(
      <CardGrid items={[{ id: "1", title: "Acme", media: mark }]} />
    ).container.innerHTML
    const explicit = render(
      <CardGrid
        items={[{ id: "1", title: "Acme", media: mark, mediaFit: "bleed" }]}
      />
    ).container.innerHTML
    expect(explicit).toBe(implicit)
  })

  it("takes the card's own gutter when asked to inset, for a mark", () => {
    const { container } = render(
      <CardGrid
        items={[{ id: "1", title: "Acme", media: mark, mediaFit: "inset" }]}
      />
    )
    // CardHeader's `p-6`, so the mark lines up with the title beneath it.
    expect(mediaWrapper(container).className).toContain("px-6")
    expect(mediaWrapper(container).className).toContain("pt-6")
  })
})

/* ------------------------------------------------------------------------- */

const rights = {
  accounts: { read: true, create: true, edit: true, delete: true },
}

const rows: Record<string, unknown>[] = [
  { id: "1", name: "Acme Corp", city: "Leeds", logo: mark },
]

const cardsRecipe: ScreenRecipe = {
  type: "list",
  binding: { module: "accounts" },
  display: "cards",
  leading: "logo",
  fields: [
    {
      column: "name",
      type: "text",
      field: { ...defaultFieldConfig, label: "Name" },
    },
    {
      column: "city",
      type: "text",
      field: { ...defaultFieldConfig, label: "City" },
    },
  ],
  actions: [],
}

describe("a recipe that chose cards", () => {
  // THE REGRESSION TEST FOR THE REPORTED BUG. `leading` is always a record's
  // MARK — a small face or glyph, never a photo — so the renderer knows which of
  // the two layouts it wants and says so. Asserted here rather than only on
  // CardGrid because the defect was in the WIRING: the slot could always be
  // inset, and nothing ever asked it to be.
  it("insets the row's mark instead of jamming it into the corner", () => {
    const { container } = render(
      <ScreenRenderer
        recipe={cardsRecipe}
        data={{ rows } as ScreenData}
        rights={rights}
        onAction={() => {}}
      />
    )
    expect(screen.getByText("Acme Corp")).toBeTruthy()
    expect(mediaWrapper(container).className).toContain("px-6")
  })
})
