// FilterBar — picking a chip reports (field, value); "Clear all" resets.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { type FilterFacet } from "../../../lib/config"
import { FilterBar } from "./filter-bar"

const facets: FilterFacet[] = [
  {
    field: "status",
    label: "Status",
    control: "chips",
    options: [
      { value: "active", label: "Active" },
      { value: "away", label: "Away" },
    ],
  },
]
const data = [{ status: "active" }, { status: "away" }]

describe("FilterBar", () => {
  it("reports (field, value) when a chip is picked", () => {
    const onChange = vi.fn()
    render(
      <FilterBar
        facets={facets}
        values={{}}
        data={data}
        onChange={onChange}
        onClearAll={() => {}}
        canClear={false}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Status: Active" }))
    expect(onChange).toHaveBeenCalledWith("status", "active")
  })

  it("fires onClearAll from the Clear all control", () => {
    const onClearAll = vi.fn()
    render(
      <FilterBar
        facets={facets}
        values={{ status: "active" }}
        data={data}
        onChange={() => {}}
        onClearAll={onClearAll}
        canClear
      />
    )
    fireEvent.click(screen.getByText(/Clear all/))
    expect(onClearAll).toHaveBeenCalled()
  })
})
