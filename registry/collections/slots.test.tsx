// Host-supplied visual slots — a recipe list can draw each row's picture, a
// recipe detail draws an avatar ONLY when it declares one, a stat card takes a
// glyph, and a config-driven tab takes a mark lucide doesn't have.
//
// The load-bearing test is the first one. Rows here ALWAYS carry a picture
// column; only the recipe changes. So "omitting `leading` changes nothing" is a
// claim about the recipe, not about the data — which is the guardrail the host
// asked for: every existing recipe list must render node for node as before.

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { defaultFieldConfig } from "../../lib/config"
import type { ScreenRecipe } from "../../lib/recipe"
import { defaultTabsConfig, TabsView } from "../primitives/tabs/tabs"
import {
  ScreenRenderer,
  type ScreenData,
} from "./screen-renderer/screen-renderer"
import { defaultStatGridConfig, StatGrid } from "./stat-grid/stat-grid"

const rights = {
  accounts: { read: true, create: true, edit: true, delete: true },
}

const mark = <span data-testid="mark">▣</span>

/** Two rows that both carry a rendered mark in a `logo` column. */
const rows: Record<string, unknown>[] = [
  { id: "1", name: "Acme Corp", city: "Leeds", logo: mark },
  { id: "2", name: "Globex", city: "Hull", logo: mark },
]

function listRecipe(extra: Partial<ScreenRecipe> = {}): ScreenRecipe {
  return {
    type: "list",
    binding: { module: "accounts" },
    display: "list",
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
    ...extra,
  }
}

function renderScreen(recipe: ScreenRecipe, data: ScreenData = { rows }) {
  return render(
    <ScreenRenderer
      recipe={recipe}
      data={data}
      rights={rights}
      onAction={() => {}}
    />
  )
}

describe("recipe list — the leading slot", () => {
  it("draws nothing, and adds no wrapper, when the recipe omits `leading`", () => {
    const { container } = renderScreen(listRecipe())
    expect(screen.getByText("Acme Corp")).toBeTruthy()
    expect(screen.queryByTestId("mark")).toBeNull()
    // The row's only child is the text column: no empty slot, no grey box.
    const row = container.querySelector("[class*='border-l-2']")!
    expect(row.children.length).toBe(1)
    expect(container.querySelector(".shrink-0")).toBeNull()
  })

  it("renders byte-identically to a list whose rows carry no picture at all", () => {
    const withPicture = renderScreen(listRecipe()).container.innerHTML
    const plain = renderScreen(listRecipe(), {
      rows: rows.map(({ id, name, city }) => ({ id, name, city })),
    }).container.innerHTML
    expect(withPicture).toBe(plain)
  })

  it("fills the slot from the named column, ahead of the title", () => {
    const { container } = renderScreen(listRecipe({ leading: "logo" }))
    expect(screen.getAllByTestId("mark").length).toBe(2)
    const row = container.querySelector("[class*='border-l-2']")!
    expect(row.children.length).toBe(2)
    expect(row.firstElementChild!.className).toContain("shrink-0")
    expect(
      row.firstElementChild!.querySelector("[data-testid='mark']")
    ).toBeTruthy()
  })

  it("fills the card grid's media slot, above the header", () => {
    const { container } = renderScreen(
      listRecipe({ display: "cards", leading: "logo" })
    )
    expect(screen.getAllByTestId("mark").length).toBe(2)
    // The CardGrid's cards are the grid's own children (the Card primitive).
    const card = container.querySelector(".grid")!.firstElementChild!
    expect(
      card.firstElementChild!.querySelector("[data-testid='mark']")
    ).toBeTruthy()
  })

  it("draws nothing for a column the row doesn't have", () => {
    renderScreen(listRecipe({ leading: "missing" }))
    expect(screen.queryByTestId("mark")).toBeNull()
    expect(screen.getByText("Acme Corp")).toBeTruthy()
  })

  it("survives a column holding a value React cannot draw", () => {
    // React throws on an object child, which would take the whole screen down.
    const bad = [
      { id: "1", name: "Acme Corp", city: "Leeds", logo: { url: "x" } },
    ]
    expect(() =>
      renderScreen(listRecipe({ leading: "logo" }), { rows: bad })
    ).not.toThrow()
    expect(screen.getByText("Acme Corp")).toBeTruthy()
  })
})

function detailRecipe(header: ScreenRecipe["header"]): ScreenRecipe {
  return {
    type: "detail",
    binding: { module: "accounts" },
    header,
    fields: [
      {
        column: "name",
        type: "text",
        field: { ...defaultFieldConfig, label: "Name" },
      },
    ],
    actions: [],
  }
}

const record = {
  id: "1",
  name: "Acme Corp",
  logoUrl: "https://example.com/a.png",
}

describe("recipe detail — the avatar", () => {
  it("draws no avatar when the recipe declares none", () => {
    const { container } = renderScreen(detailRecipe({ title: "name" }), {
      record,
    })
    expect(screen.getAllByText("Acme Corp").length).toBeGreaterThan(0)
    // No initials disc: "AC" must not appear anywhere.
    expect(screen.queryByText("AC")).toBeNull()
    expect(container.querySelector(".size-12")).toBeNull()
  })

  it("draws one, with initials, when the recipe declares an avatar column", () => {
    const { container } = renderScreen(
      detailRecipe({ title: "name", avatar: "logoUrl" }),
      { record }
    )
    const avatar = container.querySelector(".size-12")
    expect(avatar).toBeTruthy()
    expect(avatar!.className).toContain("rounded-full")
    expect(screen.getByText("AC")).toBeTruthy()
  })

  it("squares the crop when the recipe asks for it", () => {
    const { container } = renderScreen(
      detailRecipe({ title: "name", avatar: "logoUrl", avatarShape: "square" }),
      { record }
    )
    const avatar = container.querySelector(".size-12") as HTMLElement
    expect(avatar.className).toContain("rounded-lg")
    expect(avatar.className).not.toContain("rounded-full")
  })
})

describe("stat card — the glyph slot", () => {
  const base = {
    id: "1",
    label: "Revenue",
    value: "$10.2k",
    delta: "+5%",
    trend: "up" as const,
  }

  it("renders the glyph beside the label", () => {
    render(
      <StatGrid
        items={[{ ...base, icon: mark }]}
        config={defaultStatGridConfig}
      />
    )
    expect(screen.getByTestId("mark")).toBeTruthy()
    expect(screen.getByText("Revenue")).toBeTruthy()
  })

  it("adds nothing when omitted", () => {
    render(<StatGrid items={[base]} config={defaultStatGridConfig} />)
    expect(screen.queryByTestId("mark")).toBeNull()
  })
})

describe("config-driven tabs — a mark instead of a lucide name", () => {
  it("renders a node icon as-is", () => {
    render(
      <TabsView
        config={{
          ...defaultTabsConfig,
          tabs: [
            {
              value: "a",
              label: "Accounts",
              icon: mark,
              badge: "",
              badgeVariant: "",
            },
          ],
        }}
      />
    )
    expect(screen.getByTestId("mark")).toBeTruthy()
    expect(screen.getByText("Accounts")).toBeTruthy()
  })

  it('still treats a string as a lucide name, and `""` as no icon', () => {
    const { container } = render(
      <TabsView
        config={{
          ...defaultTabsConfig,
          tabs: [
            {
              value: "a",
              label: "Plain",
              icon: "",
              badge: "",
              badgeVariant: "",
            },
          ],
        }}
      />
    )
    expect(container.querySelector("svg")).toBeNull()
  })
})
