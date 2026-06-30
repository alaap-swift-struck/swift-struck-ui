// Component tests for StatusStepper — renders the stages, marks the current one,
// and changes status on click (the behaviour previously only checked by hand in
// the browser). Run: `npm test`.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { StatusStepper, type StatusStage } from "./status-stepper"

const stages: StatusStage[] = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
]

describe("StatusStepper", () => {
  it("renders every stage label", () => {
    render(<StatusStepper stages={stages} value="in-progress" />)
    expect(screen.getByText("Open")).toBeTruthy()
    expect(screen.getByText("In progress")).toBeTruthy()
    expect(screen.getByText("Resolved")).toBeTruthy()
  })

  it("marks exactly the current stage with aria-current=step", () => {
    const { container } = render(
      <StatusStepper stages={stages} value="in-progress" />
    )
    const current = container.querySelectorAll('[aria-current="step"]')
    expect(current.length).toBe(1)
    expect(current[0].textContent).toContain("In progress")
  })

  it("calls onChange with the clicked stage's value", () => {
    const onChange = vi.fn()
    render(<StatusStepper stages={stages} value="open" onChange={onChange} />)
    fireEvent.click(screen.getByRole("button", { name: /Resolved/ }))
    expect(onChange).toHaveBeenCalledWith("resolved")
  })

  it("does not fire onChange when disabled", () => {
    const onChange = vi.fn()
    render(
      <StatusStepper
        stages={stages}
        value="open"
        onChange={onChange}
        disabled
      />
    )
    const btn = screen.getByRole("button", { name: /Resolved/ })
    expect((btn as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(btn)
    expect(onChange).not.toHaveBeenCalled()
  })

  it("is read-only (buttons disabled) when no onChange is given", () => {
    const { container } = render(<StatusStepper stages={stages} value="open" />)
    container
      .querySelectorAll("button")
      .forEach((b) => expect((b as HTMLButtonElement).disabled).toBe(true))
  })
})
