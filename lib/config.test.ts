// Unit tests for the pure config logic — field validation and the visibility
// rule engine. Run with `npm test` (vitest). These lock in the cases a recent
// number-coercion bug slipped through, plus every rule operator.

import { describe, expect, it } from "vitest"

import {
  defaultFieldConfig,
  evaluateRules,
  validateField,
  type FieldConfig,
  type Rule,
} from "./config"

const field = (over: Partial<FieldConfig> = {}): FieldConfig => ({
  ...defaultFieldConfig,
  ...over,
  validation: { ...defaultFieldConfig.validation, ...(over.validation ?? {}) },
})

describe("validateField", () => {
  it("flags a required field when empty", () => {
    expect(validateField("", field({ required: true, label: "Name" }))).toBe(
      "Name is required."
    )
  })

  it("passes an optional empty field", () => {
    expect(validateField("", field({ required: false }))).toBeNull()
  })

  it("enforces minLength / maxLength", () => {
    const f = field({
      validation: {
        min: null,
        max: null,
        minLength: 3,
        maxLength: 5,
        pattern: "",
      },
    })
    expect(validateField("ab", f)).toMatch(/at least 3/)
    expect(validateField("abcdef", f)).toMatch(/at most 5/)
    expect(validateField("abcd", f)).toBeNull()
  })

  it("enforces numeric min / max", () => {
    const f = field({
      validation: {
        min: 1,
        max: 10,
        minLength: null,
        maxLength: null,
        pattern: "",
      },
    })
    expect(validateField("0", f)).toMatch(/1 or more/)
    expect(validateField("11", f)).toMatch(/10 or less/)
    expect(validateField("5", f)).toBeNull()
  })

  it("does NOT let Number() coerce hex / Infinity past the range check", () => {
    const f = field({
      validation: {
        min: 0,
        max: 100,
        minLength: null,
        maxLength: null,
        pattern: "",
      },
    })
    // "0x10" → 16 via Number(); must be treated as non-decimal, not range-checked
    expect(validateField("0x10", f)).toBeNull()
    expect(validateField("Infinity", f)).toBeNull()
  })

  it("enforces a regex pattern", () => {
    const f = field({
      label: "User",
      validation: {
        min: null,
        max: null,
        minLength: null,
        maxLength: null,
        pattern: "^[a-z]+$",
      },
    })
    expect(validateField("abc", f)).toBeNull()
    expect(validateField("abc1", f)).toMatch(/not in the expected format/)
  })
})

describe("evaluateRules", () => {
  const ctx = {
    row: { status: "active", count: 5, note: "" },
    user: {},
    app: {},
  }
  const rule = (over: Partial<Rule>): Rule => ({
    source: "row",
    field: "status",
    op: "is",
    value: "active",
    ...over,
  })

  it("no rules → always visible", () => {
    expect(evaluateRules([], ctx)).toBe(true)
  })

  it("is / isNot", () => {
    expect(evaluateRules([rule({ op: "is", value: "active" })], ctx)).toBe(true)
    expect(evaluateRules([rule({ op: "isNot", value: "active" })], ctx)).toBe(
      false
    )
  })

  it("gt / lt on numbers", () => {
    expect(
      evaluateRules([rule({ field: "count", op: "gt", value: "3" })], ctx)
    ).toBe(true)
    expect(
      evaluateRules([rule({ field: "count", op: "lt", value: "3" })], ctx)
    ).toBe(false)
  })

  it("isEmpty / isNotEmpty", () => {
    expect(
      evaluateRules([rule({ field: "note", op: "isEmpty", value: "" })], ctx)
    ).toBe(true)
    expect(
      evaluateRules(
        [rule({ field: "status", op: "isNotEmpty", value: "" })],
        ctx
      )
    ).toBe(true)
  })

  it("ANDs by default, ORs with matchAny", () => {
    const rules = [
      rule({ op: "is", value: "active" }),
      rule({ field: "count", op: "gt", value: "99" }),
    ]
    expect(evaluateRules(rules, ctx)).toBe(false) // AND: second fails
    expect(evaluateRules(rules, ctx, true)).toBe(true) // OR: first passes
  })
})
