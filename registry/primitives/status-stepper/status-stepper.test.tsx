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

  it("scrolls on the WRAPPER, not the <ol> — else the active ring is clipped", () => {
    // The active pill's ring-2 + ring-offset-2 paints ~4px OUTSIDE the pill.
    // Per CSS, `overflow-x: auto` with a visible overflow-y computes the y-axis
    // to `auto` as well, so a scrolling <ol> became a scroll box in BOTH axes
    // and sheared that ring off. Keep the scroll on the wrapper.
    const { container } = render(
      <StatusStepper stages={stages} value="in-progress" />
    )
    const wrapper = container.firstElementChild as HTMLElement
    const list = container.querySelector("ol") as HTMLElement

    expect(wrapper.className).toMatch(/overflow-x-auto/)
    expect(list.className).not.toMatch(/overflow-x-auto/)
    expect(list.className).toMatch(/overflow-visible/)
    // vertical breathing room so the ring offset has somewhere to paint
    expect(list.className).toMatch(/\bpy-/)
  })
})
