// List surfaces — the flat ("none") surface rounds + clips its own row group so
// the full-bleed hover/selected row highlight follows a host card's corners; a
// host-passed radius still wins via cn(). The card surface is untouched (the
// Card primitive brings its own radius).

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { List } from "./list"

const items = [{ id: "1", title: "A row" }]

function rootClass(el: Element | null) {
  return (el as HTMLElement).className
}

describe("List flat surface", () => {
  it("rounds and clips its own row group", () => {
    const { container } = render(<List items={items} surface="none" />)
    const cls = rootClass(container.firstElementChild)
    expect(cls).toContain("rounded-xl")
    expect(cls).toContain("overflow-hidden")
  })

  it("rounds the empty state the same way", () => {
    const { container } = render(<List items={[]} surface="none" />)
    expect(rootClass(container.firstElementChild)).toContain("rounded-xl")
  })

  it("lets a host-passed radius override the default", () => {
    const { container } = render(
      <List items={items} surface="none" className="rounded-none" />
    )
    const cls = rootClass(container.firstElementChild)
    expect(cls).toContain("rounded-none")
    expect(cls).not.toContain("rounded-xl")
  })
})
