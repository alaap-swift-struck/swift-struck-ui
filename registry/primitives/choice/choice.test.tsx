// Choice — in single "pills" mode, clicking a pill reports that value.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Choice, defaultChoiceConfig } from "./choice"

const options = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
]

describe("Choice (pills)", () => {
  it("reports the picked value in single mode", () => {
    const onChange = vi.fn()
    render(
      <Choice
        options={options}
        value={[]}
        onChange={onChange}
        config={{ ...defaultChoiceConfig, display: "pills", mode: "single" }}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: /Apple/ }))
    expect(onChange).toHaveBeenCalledWith(["a"])
  })
})

describe("Choice (creatable)", () => {
  const creatable = (over = {}) => ({
    ...defaultChoiceConfig,
    display: "dropdown" as const,
    mode: "single" as const,
    creatable: true,
    ...over,
  })

  const openAndType = (text: string) => {
    fireEvent.click(screen.getByRole("combobox"))
    fireEvent.change(screen.getByPlaceholderText("Search…"), {
      target: { value: text },
    })
  }

  it("offers a create row for a value not in options, and uses the typed value", () => {
    const onChange = vi.fn()
    const onCreate = vi.fn()
    render(
      <Choice
        options={options}
        value={[]}
        onChange={onChange}
        onCreate={onCreate}
        config={creatable()}
      />
    )
    openAndType("Brass")
    fireEvent.click(screen.getByText('Add "Brass"'))
    expect(onChange).toHaveBeenCalledWith(["Brass"])
    expect(onCreate).toHaveBeenCalledWith("Brass")
  })

  it("uses the createLabel template with the trimmed query", () => {
    render(
      <Choice
        options={options}
        value={[]}
        onChange={() => {}}
        config={creatable({ createLabel: "Create {query}" })}
      />
    )
    openAndType("  Cobalt  ")
    expect(screen.getByText("Create Cobalt")).toBeTruthy()
  })

  it("dedupes: a typed value matching an existing option (any case) selects it, no create", () => {
    const onChange = vi.fn()
    const onCreate = vi.fn()
    render(
      <Choice
        options={options}
        value={[]}
        onChange={onChange}
        onCreate={onCreate}
        config={creatable()}
      />
    )
    openAndType("apple") // existing "Apple", different case
    // no create row for an exact (case-insensitive) match
    expect(screen.queryByText(/^Add "/)).toBeNull()
    fireEvent.click(screen.getByText("Apple"))
    expect(onChange).toHaveBeenCalledWith(["a"]) // the existing option's value
    expect(onCreate).not.toHaveBeenCalled()
  })

  it("does NOT offer a create row when creatable is off (default)", () => {
    render(
      <Choice
        options={options}
        value={[]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig }}
      />
    )
    fireEvent.click(screen.getByRole("combobox"))
    fireEvent.change(screen.getByPlaceholderText("Search…"), {
      target: { value: "Brass" },
    })
    expect(screen.queryByText(/^Add "/)).toBeNull()
  })

  it("renders a created value as escaped text, never HTML (XSS-safe)", () => {
    const onChange = vi.fn()
    const payload = '<img src=x onerror="alert(1)">'
    const { container } = render(
      <Choice
        options={options}
        value={[]}
        onChange={onChange}
        config={creatable()}
      />
    )
    openAndType(payload)
    // the create row shows the payload as literal text, no <img> is parsed
    const row = screen.getByText(`Add "${payload}"`)
    expect(row).toBeTruthy()
    expect(container.querySelector("img")).toBeNull()
    fireEvent.click(row)
    expect(onChange).toHaveBeenCalledWith([payload])
  })

  it("multi mode: created values accumulate and the box stays open", () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <Choice
        options={options}
        value={[]}
        onChange={onChange}
        config={creatable({ mode: "multi" })}
      />
    )
    openAndType("Brass")
    fireEvent.click(screen.getByText('Add "Brass"'))
    expect(onChange).toHaveBeenLastCalledWith(["Brass"])
    // host echoes the new value back; the popover stays open in multi mode, so
    // just type again (no reopen — the cmdk input is still mounted).
    rerender(
      <Choice
        options={options}
        value={["Brass"]}
        onChange={onChange}
        config={creatable({ mode: "multi" })}
      />
    )
    fireEvent.change(screen.getByPlaceholderText("Search…"), {
      target: { value: "Copper" },
    })
    fireEvent.click(screen.getByText('Add "Copper"'))
    expect(onChange).toHaveBeenLastCalledWith(["Brass", "Copper"])
  })
})
