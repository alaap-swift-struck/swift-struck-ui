// Rating — clicking a star reports its value; readOnly makes it inert.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Rating } from "./rating"

describe("Rating", () => {
  it("fires onChange with the clicked star's value", () => {
    const onChange = vi.fn()
    render(<Rating value={0} max={5} onChange={onChange} />)
    fireEvent.click(screen.getByRole("button", { name: "3 stars" }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it("is inert when readOnly (stars disabled)", () => {
    const onChange = vi.fn()
    render(<Rating value={2} max={5} onChange={onChange} readOnly />)
    const star = screen.getByRole("button", { name: "1 star" })
    expect((star as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(star)
    expect(onChange).not.toHaveBeenCalled()
  })
})
