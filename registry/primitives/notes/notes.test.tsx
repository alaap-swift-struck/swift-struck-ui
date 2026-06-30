// Component test for Notes — confirms the editor seeds SANITIZED content (the
// fix for the dangerouslySetInnerHTML XSS sink): a hostile defaultValue renders
// with its dangerous parts removed but its formatting intact. Run: `npm test`.

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Notes } from "./notes"

describe("Notes - seeds sanitized content", () => {
  it("strips dangerous nodes from defaultValue but keeps formatting", () => {
    const { container } = render(
      <Notes defaultValue='<img src=x onerror="window.__x=1"><script>window.__x=1</script><b>bold</b> <mark>hi</mark>' />
    )
    const editor = container.querySelector("[contenteditable]") as HTMLElement
    expect(editor).toBeTruthy()
    const html = editor.innerHTML.toLowerCase()
    expect(html).not.toContain("<img")
    expect(html).not.toContain("<script")
    expect(html).not.toContain("onerror")
    expect(editor.innerHTML).toContain("<b>bold</b>")
    expect(editor.innerHTML).toContain("<mark>hi</mark>")
    // The onerror payload never ran.
    expect((window as unknown as { __x?: number }).__x).toBeUndefined()
  })
})
