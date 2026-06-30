// Component tests for WebEmbed — the iframe is sandboxed by default and its src
// is scheme-guarded so a `javascript:` src can't run in our origin. Run: `npm test`.

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WebEmbed } from "./web-embed"

describe("WebEmbed", () => {
  it("sandboxes the iframe and passes a safe src through", () => {
    const { container } = render(<WebEmbed src="https://example.com/embed" />)
    const iframe = container.querySelector("iframe") as HTMLIFrameElement
    expect(iframe).toBeTruthy()
    expect(iframe.getAttribute("sandbox")).toContain("allow-scripts")
    expect(iframe.getAttribute("sandbox")).not.toContain("allow-top-navigation")
    expect(iframe.getAttribute("src")).toBe("https://example.com/embed")
  })

  it("collapses a dangerous src to #", () => {
    const { container } = render(<WebEmbed src="javascript:alert(1)" />)
    const iframe = container.querySelector("iframe") as HTMLIFrameElement
    expect(iframe.getAttribute("src")).toBe("#")
  })
})
