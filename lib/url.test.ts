// Unit tests for the shared URL guard. Every component that renders a
// host/user-supplied link (ArticleBody, TicketThread, Breadcrumbs, WebEmbed)
// runs its hrefs through `safeHref`, so this is the security boundary that stops
// `[click](javascript:alert(1))` from becoming a clickable XSS. Run: `npm test`.

import { describe, expect, it } from "vitest"

import { safeHref } from "./url"

describe("safeHref - dangerous schemes collapse to #", () => {
  it("blocks javascript:", () => {
    expect(safeHref("javascript:alert(1)")).toBe("#")
  })

  it("blocks data:", () => {
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBe("#")
  })

  it("blocks vbscript:", () => {
    expect(safeHref("vbscript:msgbox(1)")).toBe("#")
  })

  it("blocks file: and other unknown schemes", () => {
    expect(safeHref("file:///etc/passwd")).toBe("#")
    expect(safeHref("tel:+15551234")).toBe("#")
  })

  it("blocks case-obfuscated schemes", () => {
    expect(safeHref("JavaScript:alert(1)")).toBe("#")
    expect(safeHref("JAVASCRIPT:alert(1)")).toBe("#")
  })

  it("blocks whitespace/control-obfuscated schemes", () => {
    expect(safeHref(" javascript:alert(1)")).toBe("#") // leading space
    expect(safeHref("\tjavascript:alert(1)")).toBe("#") // leading TAB
    expect(safeHref("java\tscript:alert(1)")).toBe("#") // embedded TAB
    expect(safeHref("java\nscript:alert(1)")).toBe("#") // embedded newline
  })

  it("blocks empty / whitespace-only input", () => {
    expect(safeHref("")).toBe("#")
    expect(safeHref(null)).toBe("#")
    expect(safeHref(undefined)).toBe("#")
    expect(safeHref("   ")).toBe("#")
  })
})

describe("safeHref - safe URLs pass through", () => {
  it("allows http / https", () => {
    expect(safeHref("http://example.com")).toBe("http://example.com")
    expect(safeHref("https://example.com/path?q=1")).toBe(
      "https://example.com/path?q=1"
    )
  })

  it("allows mailto", () => {
    expect(safeHref("mailto:hi@example.com")).toBe("mailto:hi@example.com")
  })

  it("allows relative + fragment links (no scheme to abuse)", () => {
    expect(safeHref("#section")).toBe("#section")
    expect(safeHref("/teams/42")).toBe("/teams/42")
    expect(safeHref("./guide")).toBe("./guide")
  })

  it("trims surrounding whitespace on safe URLs", () => {
    expect(safeHref("  https://example.com  ")).toBe("https://example.com")
  })
})
