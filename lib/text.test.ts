import { describe, expect, it } from "vitest"

import { truncateText } from "./text"

describe("truncateText", () => {
  it("leaves short text alone", () => {
    expect(truncateText("hi", 10)).toBe("hi")
  })
  it("cuts and adds an ellipsis", () => {
    expect(truncateText("hello world", 5)).toBe("hello…")
  })
  it("trims a trailing space before the ellipsis", () => {
    expect(truncateText("hello world", 6)).toBe("hello…")
  })
})
