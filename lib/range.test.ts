// Range — the "min..max" facet value round-trips, and each side is optional.

import { describe, expect, it } from "vitest"

import { formatRange, parseRange } from "./range"

describe("parseRange", () => {
  it("parses both bounds", () => {
    expect(parseRange("10..20")).toEqual({ min: 10, max: 20 })
  })

  it("parses a one-sided range", () => {
    expect(parseRange("10..")).toEqual({ min: 10, max: null })
    expect(parseRange("..20")).toEqual({ min: null, max: 20 })
  })

  it("treats cleared / malformed values as no bounds", () => {
    expect(parseRange("")).toEqual({ min: null, max: null })
    expect(parseRange("abc")).toEqual({ min: null, max: null })
    expect(parseRange("x..y")).toEqual({ min: null, max: null })
  })

  it("handles negatives and decimals", () => {
    expect(parseRange("-5..2.5")).toEqual({ min: -5, max: 2.5 })
  })
})

describe("formatRange", () => {
  it("formats both bounds", () => {
    expect(formatRange(10, 20)).toBe("10..20")
  })

  it("formats a one-sided range", () => {
    expect(formatRange(10, null)).toBe("10..")
    expect(formatRange(null, 20)).toBe("..20")
  })

  it("returns the empty (cleared) value when there are no bounds", () => {
    expect(formatRange(null, null)).toBe("")
  })

  it("round-trips through parseRange", () => {
    for (const v of ["10..20", "10..", "..20", ""]) {
      const { min, max } = parseRange(v)
      expect(formatRange(min, max)).toBe(v)
    }
  })
})
