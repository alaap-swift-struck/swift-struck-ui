// Component tests for CollectionFrame's headerLayout knob — "inline" puts the
// title, search, and filter bar on one row; "stacked" (default) keeps search on
// the title row with the filter bar below. Run: `npm test`.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { defaultCollectionConfig } from "../../../lib/config"
import { CollectionFrame } from "./collection-frame"

type Row = { id: string; name: string; status: string }
const data: Row[] = [
  { id: "1", name: "Alpha", status: "Active" },
  { id: "2", name: "Beta", status: "Away" },
]

function renderFrame(headerLayout: "stacked" | "inline") {
  return render(
    <CollectionFrame<Row>
      config={{
        ...defaultCollectionConfig,
        title: "Team",
        searchable: true,
        userFilter: true,
        filterFacets: [{ field: "status", label: "Status", control: "select" }],
        headerLayout,
      }}
      data={data}
      searchKeys={["name"]}
      renderItems={(rows) => (
        <ul>
          {rows.map((r) => (
            <li key={r.id}>{r.name}</li>
          ))}
        </ul>
      )}
    />
  )
}

// The inline header row is the `flex-wrap items-center gap-2` element that
// contains the search input (the FilterBar shares that class but has no input).
const inlineHeaderRow = (container: HTMLElement) =>
  [...container.querySelectorAll(".flex-wrap.items-center.gap-2")].find((el) =>
    el.querySelector("input")
  )

describe("CollectionFrame headerLayout", () => {
  it("inline: search AND filter live on the same row as the title", () => {
    const { container } = renderFrame("inline")
    const row = inlineHeaderRow(container)
    expect(row).toBeTruthy()
    expect(row?.querySelector('[role="combobox"]')).toBeTruthy()
  })

  it("stacked (default): search is not on a one-line row with the filter", () => {
    const { container } = renderFrame("stacked")
    expect(inlineHeaderRow(container)).toBeUndefined()
    // The header still renders the search box and the filter control.
    expect(container.querySelector("input")).toBeTruthy()
    expect(container.querySelector('[role="combobox"]')).toBeTruthy()
  })
})

describe("CollectionFrame sort", () => {
  const sortCfg = {
    ...defaultCollectionConfig,
    title: "Team",
    sortable: true,
    sortOptions: [
      { value: "name", label: "Name" },
      { value: "status", label: "Status", defaultDir: "desc" as const },
    ],
    sortBy: "name",
    sortDir: "asc" as const,
  }
  const rows = (r: Row[]) => (
    <ul>
      {r.map((x) => (
        <li key={x.id}>{x.name}</li>
      ))}
    </ul>
  )

  it("sorts in memory from the declared config sort", () => {
    const { container } = render(
      <CollectionFrame<Row>
        config={{ ...sortCfg, sortDir: "desc" }}
        data={data}
        searchKeys={["name"]}
        renderItems={rows}
      />
    )
    const names = [...container.querySelectorAll("li")].map(
      (li) => li.textContent
    )
    expect(names).toEqual(["Beta", "Alpha"])
  })

  it("emits sortBy/sortDir through the SAME onQueryChange seam", () => {
    const onQueryChange = vi.fn()
    render(
      <CollectionFrame<Row>
        config={sortCfg}
        data={data}
        searchKeys={["name"]}
        renderItems={rows}
        onQueryChange={onQueryChange}
      />
    )
    // flipping direction reports through the one seam, not a second callback
    fireEvent.click(
      screen.getByRole("button", { name: /switch to descending/i })
    )
    expect(onQueryChange).toHaveBeenCalledWith({
      query: "",
      facetValues: {},
      sortBy: "name",
      sortDir: "desc",
    })
  })

  it("serverSide: does NOT sort in memory, only emits", () => {
    const onQueryChange = vi.fn()
    const { container } = render(
      <CollectionFrame<Row>
        config={{ ...sortCfg, sortDir: "desc" }}
        data={data}
        serverSide
        searchKeys={["name"]}
        renderItems={rows}
        onQueryChange={onQueryChange}
      />
    )
    // config says desc, but serverSide must render `data` in the given order
    const names = [...container.querySelectorAll("li")].map(
      (li) => li.textContent
    )
    expect(names).toEqual(["Alpha", "Beta"])
  })

  it("no sort control when sortable is off or there are no options", () => {
    const { container } = render(
      <CollectionFrame<Row>
        config={{ ...sortCfg, sortable: false }}
        data={data}
        searchKeys={["name"]}
        renderItems={rows}
      />
    )
    expect(container.querySelector('[role="combobox"]')).toBeNull()
  })
})

describe("CollectionFrame mobile header (compact one row)", () => {
  it("folds the count into the search placeholder and shows a filter popover trigger", () => {
    // (jsdom renders both the mobile and desktop branches — CSS `sm:` classes
    // don't apply — so we assert both are present.)
    const { container } = renderFrame("stacked")
    const placeholders = [...container.querySelectorAll("input")].map((i) =>
      i.getAttribute("placeholder")
    )
    // Mobile: the live count (2 rows) is folded into the placeholder, e.g. "Search 2…".
    expect(placeholders.some((p) => /Search\s+\d/.test(p || ""))).toBe(true)
    // Desktop is unchanged: the plain "Search…" placeholder is still present.
    expect(placeholders.some((p) => p === "Search…")).toBe(true)
    // The funnel that opens the same filters in a popover.
    expect(container.querySelector('button[aria-label="Filters"]')).toBeTruthy()
  })
})
