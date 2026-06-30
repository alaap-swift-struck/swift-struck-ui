// Component tests for ArticleBody — confirms the link guard is actually applied
// where the component renders hrefs (inline markdown links + the external link),
// not just in the safeHref unit test. Run: `npm test`.

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ArticleBody } from "./article-body"

describe("ArticleBody - inline link safety", () => {
  it("defuses a dangerous inline link to #, keeps a safe one", () => {
    render(
      <ArticleBody body="Danger [x](javascript:alert(1)) and safe [y](https://example.com)." />
    )
    expect(screen.getByText("x").closest("a")?.getAttribute("href")).toBe("#")
    expect(screen.getByText("y").closest("a")?.getAttribute("href")).toBe(
      "https://example.com"
    )
  })
})

describe("ArticleBody - external link", () => {
  it("renders the external button for a safe URL", () => {
    render(<ArticleBody externalUrl="https://example.com" />)
    const link = screen.getByText(/Open the full resource/).closest("a")
    expect(link?.getAttribute("href")).toBe("https://example.com")
  })

  it("drops the external button entirely for a dangerous URL", () => {
    render(<ArticleBody externalUrl="javascript:alert(1)" />)
    expect(screen.queryByText(/Open the full resource/)).toBeNull()
  })
})
