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

describe("Choice trigger label + truncation floor", () => {
  const currencies = [
    { value: "inr", label: "INR — Indian Rupee", triggerLabel: "INR" },
    { value: "usd", label: "USD — US Dollar", triggerLabel: "USD" },
  ]

  it("shows the compact triggerLabel in the closed control", () => {
    render(
      <Choice
        options={currencies}
        value={["inr"]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig }}
      />
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger.textContent).toContain("INR")
    // the long form is NOT crammed into the trigger…
    expect(trigger.textContent).not.toContain("Indian Rupee")
    // …but stays reachable as the hover title
    expect(trigger.querySelector('[title="INR — Indian Rupee"]')).toBeTruthy()
  })

  it("shows the FULL label in the open menu", () => {
    render(
      <Choice
        options={currencies}
        value={["inr"]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig }}
      />
    )
    fireEvent.click(screen.getByRole("combobox"))
    expect(screen.getByText("INR — Indian Rupee")).toBeTruthy()
  })

  it("falls back to label, and can shrink so text ellipsises instead of shearing", () => {
    const plain = [{ value: "a", label: "A very long option label indeed" }]
    render(
      <Choice
        options={plain}
        value={["a"]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig }}
      />
    )
    const trigger = screen.getByRole("combobox")
    expect(trigger.textContent).toContain("A very long option label indeed")
    // min-w-0 is what lets the flex child shrink; without it the label is
    // hard-clipped mid-letter instead of ellipsising.
    const span = trigger.querySelector("span")
    expect(span?.className).toMatch(/min-w-0/)
    expect(trigger.querySelector(".truncate")).toBeTruthy()
  })
})

describe("Choice clearable ✕", () => {
  // Same root cause as the FilterBar facets: the ✕ was a bare <X> svg nested in
  // the trigger <Button>, and Button's base class sets
  // `[&_svg]:pointer-events-none` — so in a real browser the click fell through
  // to the trigger and just opened the list. A `clearable` Choice could not be
  // cleared. jsdom does no hit-testing, so this asserts the STRUCTURE (a real,
  // named, focusable button outside the trigger), which is what actually
  // differs. See filter-bar-clear.test.tsx for the full rationale.
  it("exposes a real clear button, outside the trigger, when clearable + selected", () => {
    render(
      <Choice
        options={options}
        value={["a"]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig, clearable: true }}
      />
    )
    const clear = screen.getByRole("button", { name: "Clear selection" })
    expect(clear.tagName).toBe("BUTTON")
    expect(clear.getAttribute("aria-hidden")).toBeNull()
    // must NOT be nested in the trigger — that's what made it unclickable
    expect(screen.getByRole("combobox").contains(clear)).toBe(false)
    clear.focus()
    expect(document.activeElement).toBe(clear)
  })

  it("clears the whole selection", () => {
    const onChange = vi.fn()
    render(
      <Choice
        options={options}
        value={["a", "b"]}
        onChange={onChange}
        config={{ ...defaultChoiceConfig, mode: "multi", clearable: true }}
      />
    )
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it("no clear button when nothing is selected, or when not clearable", () => {
    const { unmount } = render(
      <Choice
        options={options}
        value={[]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig, clearable: true }}
      />
    )
    expect(screen.queryByRole("button", { name: "Clear selection" })).toBeNull()
    unmount()
    render(
      <Choice
        options={options}
        value={["a"]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig, clearable: false }}
      />
    )
    expect(screen.queryByRole("button", { name: "Clear selection" })).toBeNull()
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
