// SearchInput — the field updates instantly but `onChange` is debounced, and the
// clear (X) button resets it. Run: `npm test`.

import { fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SearchInput } from "./search-input"

describe("SearchInput", () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it("debounces onChange by debounceMs", () => {
    const onChange = vi.fn()
    render(<SearchInput value="" onChange={onChange} debounceMs={200} />)
    fireEvent.change(screen.getByRole("searchbox"), {
      target: { value: "ab" },
    })
    expect(onChange).not.toHaveBeenCalled() // still pending
    vi.advanceTimersByTime(200)
    expect(onChange).toHaveBeenCalledWith("ab")
  })

  it("clears via the clear button", () => {
    const onChange = vi.fn()
    render(<SearchInput value="hi" onChange={onChange} debounceMs={0} />)
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }))
    expect(onChange).toHaveBeenCalledWith("")
  })
})
