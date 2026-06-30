// Unit tests for the Notes HTML sanitizer — the boundary that stops stored HTML
// from smuggling executable content into the editor. Runs under jsdom (the
// sanitizer uses real DOM parsing). Run: `npm test`.

import { describe, expect, it } from "vitest"

import { sanitizeNotesHtml } from "./logic"

describe("sanitizeNotesHtml - strips dangerous content", () => {
  it("removes <script> entirely", () => {
    const out = sanitizeNotesHtml("<b>hi</b><script>alert(1)</script>")
    expect(out).not.toContain("script")
    expect(out).toContain("<b>hi</b>")
  })

  it("removes <img> (and its onerror handler)", () => {
    const out = sanitizeNotesHtml('<img src=x onerror="alert(1)">text')
    expect(out.toLowerCase()).not.toContain("<img")
    expect(out.toLowerCase()).not.toContain("onerror")
    expect(out).toContain("text")
  })

  it("removes svg / iframe / object / form controls", () => {
    const out = sanitizeNotesHtml(
      '<svg onload="x"></svg><iframe src="javascript:1"></iframe><input value="y">keep'
    )
    expect(out.toLowerCase()).not.toMatch(/<svg|<iframe|<input/)
    expect(out).toContain("keep")
  })

  it("unwraps a link (no href survives) but keeps its text", () => {
    const out = sanitizeNotesHtml('<a href="javascript:alert(1)">click</a>')
    expect(out.toLowerCase()).not.toContain("<a")
    expect(out.toLowerCase()).not.toContain("javascript")
    expect(out).toContain("click")
  })

  it("strips ALL attributes from surviving tags", () => {
    const out = sanitizeNotesHtml(
      '<b style="color:red" onclick="alert(1)" class="x">bold</b>'
    )
    expect(out).toBe("<b>bold</b>")
  })

  it("drops comment nodes", () => {
    const out = sanitizeNotesHtml("<!-- evil --><i>ok</i>")
    expect(out).not.toContain("evil")
    expect(out).toContain("<i>ok</i>")
  })
})

describe("sanitizeNotesHtml - keeps legitimate formatting", () => {
  it("preserves the editor's own tags", () => {
    const html =
      "<p>Edit <b>me</b> — <i>italic</i>, <mark>highlight</mark></p><ul><li>one</li></ul><hr>"
    const out = sanitizeNotesHtml(html)
    expect(out).toContain("<b>me</b>")
    expect(out).toContain("<i>italic</i>")
    expect(out).toContain("<mark>highlight</mark>")
    expect(out).toContain("<li>one</li>")
    expect(out.toLowerCase()).toContain("<hr>")
  })

  it("returns empty string for empty / falsy input", () => {
    expect(sanitizeNotesHtml("")).toBe("")
    // @ts-expect-error - guarding the runtime contract
    expect(sanitizeNotesHtml(null)).toBe("")
  })
})
