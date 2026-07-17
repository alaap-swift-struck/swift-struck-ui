// SortControl — the three rules that make a sort control feel right (each one
// was a real bug before it was a rule): per-option default direction, a
// directionless option disables the toggle, and the toggle only flips direction.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { type SortOption } from "../../../lib/config"
import { SortControl } from "./sort-control"

const options: SortOption[] = [
  { value: "name", label: "Name" }, // defaults to asc
  { value: "added", label: "Date added", defaultDir: "desc" }, // newest first
  { value: "relevance", label: "Best match", directionless: true },
]

// The field picker is Choice's dropdown trigger (role="combobox"); its
// accessible name is whatever is currently selected, so query by role alone.
const open = () => fireEvent.click(screen.getByRole("combobox"))

describe("SortControl", () => {
  it("renders nothing without options", () => {
    const { container } = render(
      <SortControl options={[]} sortBy="" sortDir="asc" onChange={() => {}} />
    )
    expect(container.firstChild).toBeNull()
  })

  it("applies the option's default direction when picked (dates → newest first)", () => {
    const onChange = vi.fn()
    render(
      <SortControl
        options={options}
        sortBy="name"
        sortDir="asc"
        onChange={onChange}
      />
    )
    open()
    fireEvent.click(screen.getByText("Date added"))
    // NOT "asc" — picking a date field and getting oldest-first reads as broken
    expect(onChange).toHaveBeenCalledWith("added", "desc")
  })

  it("defaults to asc for an option without a defaultDir", () => {
    const onChange = vi.fn()
    render(
      <SortControl
        options={options}
        sortBy="added"
        sortDir="desc"
        onChange={onChange}
      />
    )
    open()
    fireEvent.click(screen.getByText("Name"))
    expect(onChange).toHaveBeenCalledWith("name", "asc")
  })

  it("disables the direction toggle for a directionless option", () => {
    render(
      <SortControl
        options={options}
        sortBy="relevance"
        sortDir="asc"
        onChange={() => {}}
      />
    )
    const toggle = screen.getByRole("button", {
      name: /unavailable for this field/i,
    }) as HTMLButtonElement
    expect(toggle.disabled).toBe(true)
  })

  it("disables the toggle when nothing is sorted (no axis to flip)", () => {
    render(
      <SortControl
        options={options}
        sortBy=""
        sortDir="asc"
        onChange={() => {}}
      />
    )
    const toggle = screen.getByRole("button", {
      name: /unavailable for this field/i,
    }) as HTMLButtonElement
    expect(toggle.disabled).toBe(true)
  })

  it("the toggle flips direction and keeps the field", () => {
    const onChange = vi.fn()
    render(
      <SortControl
        options={options}
        sortBy="name"
        sortDir="asc"
        onChange={onChange}
      />
    )
    fireEvent.click(
      screen.getByRole("button", { name: /switch to descending/i })
    )
    expect(onChange).toHaveBeenCalledWith("name", "desc")
  })
})
