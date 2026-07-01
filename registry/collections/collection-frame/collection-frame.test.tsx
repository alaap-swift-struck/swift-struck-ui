// Component tests for CollectionFrame's headerLayout knob — "inline" puts the
// title, search, and filter bar on one row; "stacked" (default) keeps search on
// the title row with the filter bar below. Run: `npm test`.

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

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
