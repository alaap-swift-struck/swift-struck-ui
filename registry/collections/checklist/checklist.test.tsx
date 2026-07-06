// Checklist — ticking an item reports the whole list with that item's `done`
// flipped (it's controlled — the parent owns the state).

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import {
  Checklist,
  defaultChecklistConfig,
  type ChecklistItem,
} from "./checklist"

const items: ChecklistItem[] = [
  { id: "a", label: "Alpha", done: false },
  { id: "b", label: "Beta", done: true },
]

describe("Checklist", () => {
  it("flips an item's done state on toggle", () => {
    const onChange = vi.fn()
    render(
      <Checklist
        items={items}
        onChange={onChange}
        config={defaultChecklistConfig}
      />
    )
    fireEvent.click(screen.getAllByRole("checkbox")[0])
    expect(onChange).toHaveBeenCalledTimes(1)
    const next = onChange.mock.calls[0][0] as ChecklistItem[]
    expect(next[0].done).toBe(true) // Alpha flipped on
    expect(next[1].done).toBe(true) // Beta untouched
  })
})
