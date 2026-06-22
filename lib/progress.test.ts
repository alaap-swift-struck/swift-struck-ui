// Unit tests for the learning completion rollups.

import { describe, expect, it } from "vitest"

import { completionStats } from "./progress"

const members = [{ id: "u1" }, { id: "u2" }, { id: "u3" }]
const items = [{ id: "a" }, { id: "b" }]

describe("completionStats", () => {
  it("rolls up per-member and per-item counts", () => {
    const s = completionStats(members, items, [
      { memberId: "u1", itemId: "a" },
      { memberId: "u1", itemId: "b" },
      { memberId: "u2", itemId: "a" },
    ])
    expect(s.perMember).toEqual({ u1: 2, u2: 1, u3: 0 })
    expect(s.perItem).toEqual({ a: 2, b: 1 })
    expect(s.totalItems).toBe(2)
    expect(s.totalMembers).toBe(3)
  })

  it("isDone looks up a cell", () => {
    const s = completionStats(members, items, [{ memberId: "u2", itemId: "b" }])
    expect(s.isDone("u2", "b")).toBe(true)
    expect(s.isDone("u2", "a")).toBe(false)
  })

  it("dedupes and ignores out-of-scope entries", () => {
    const s = completionStats(members, items, [
      { memberId: "u1", itemId: "a" },
      { memberId: "u1", itemId: "a" }, // duplicate
      { memberId: "ghost", itemId: "a" }, // unknown member
      { memberId: "u1", itemId: "z" }, // unknown item
    ])
    expect(s.perMember.u1).toBe(1)
    expect(s.perItem.a).toBe(1)
  })
})
