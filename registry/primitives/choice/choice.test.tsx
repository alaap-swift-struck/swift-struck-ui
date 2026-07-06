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
