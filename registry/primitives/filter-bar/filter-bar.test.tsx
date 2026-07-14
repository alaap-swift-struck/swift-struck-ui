// FilterBar — picking a chip reports (field, value); "Clear all" resets. A
// `searchable` select renders a combobox (client-filtered, or async via
// onSearch); the plain-dropdown path is unchanged.

import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

  it("client-side searchable select filters its own options", async () => {
    const onChange = vi.fn()
    const searchable: FilterFacet[] = [
      {
        field: "role",
        label: "Role",
        control: "select",
        searchable: true,
        options: [
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
          { value: "viewer", label: "Viewer" },
        ],
      },
    ]
    render(
      <FilterBar
        facets={searchable}
        values={{}}
        data={[]}
        onChange={onChange}
        onClearAll={() => {}}
        canClear={false}
      />
    )
    // Opens as a combobox, not a plain <Select>.
    fireEvent.click(screen.getByRole("combobox", { name: "Role" }))
    fireEvent.change(screen.getByPlaceholderText("Search role…"), {
      target: { value: "edit" },
    })
    // cmdk keeps only the matching option.
    await waitFor(() => {
      expect(screen.queryByText("Admin")).toBeNull()
      expect(screen.getByText("Editor")).toBeTruthy()
    })
    fireEvent.click(screen.getByText("Editor"))
    expect(onChange).toHaveBeenCalledWith("role", "editor")
  })

  it("async searchable select calls onSearch and shows the returned rows", async () => {
    const onChange = vi.fn()
    const onSearch = vi
      .fn()
      .mockResolvedValue([{ value: "ca", label: "California", count: 42 }])
    const searchable: FilterFacet[] = [
      {
        field: "region",
        label: "Region",
        control: "select",
        searchable: true,
        onSearch,
        options: [{ value: "any", label: "Anywhere" }],
      },
    ]
    render(
      <FilterBar
        facets={searchable}
        values={{}}
        data={[]}
        onChange={onChange}
        onClearAll={() => {}}
        canClear={false}
      />
    )
    fireEvent.click(screen.getByRole("combobox", { name: "Region" }))
    // Before typing, the seed option is shown.
    expect(screen.getByText("Anywhere")).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText("Search region…"), {
      target: { value: "cal" },
    })
    // Debounced call with (field, query); results replace the list (with count).
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("region", "cal"))
    const row = await screen.findByText("California")
    expect(screen.getByText("42")).toBeTruthy()

    fireEvent.click(row)
    expect(onChange).toHaveBeenCalledWith("region", "ca")
  })
})
