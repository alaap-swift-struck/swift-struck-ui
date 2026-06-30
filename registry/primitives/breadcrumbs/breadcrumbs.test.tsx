// Component test for Breadcrumbs — confirms crumb hrefs are scheme-guarded, so a
// hostile deep-link can't become a clickable XSS. Run: `npm test`.

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Breadcrumbs } from "./breadcrumbs"

describe("Breadcrumbs - link safety", () => {
  it("guards a dangerous crumb href down to #", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "javascript:alert(1)" },
          { label: "Current" },
        ]}
      />
    )
    expect(screen.getByText("Home").closest("a")?.getAttribute("href")).toBe(
      "#"
    )
  })

  it("keeps a safe crumb href", () => {
    render(
      <Breadcrumbs
        items={[{ label: "Home", href: "/home" }, { label: "Current" }]}
      />
    )
    expect(screen.getByText("Home").closest("a")?.getAttribute("href")).toBe(
      "/home"
    )
  })
})
