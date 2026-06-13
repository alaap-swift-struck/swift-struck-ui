// Unit tests for the PermissionMatrix pure logic — applyToggle (the value
// transform) and cellState (how a cell renders, including the read/locked guard
// that stops view-only modes from ever mutating). Run with `npm test` (vitest).

import { describe, expect, it } from "vitest"

import {
  applyToggle,
  cellState,
  defaultPermissionMatrixConfig,
  emptyRights,
  rightsFor,
  type PermissionMatrixConfig,
  type PermissionMatrixValue,
  type RightSet,
} from "./logic"

const cfg = (
  over: Partial<PermissionMatrixConfig> = {}
): PermissionMatrixConfig => ({
  ...defaultPermissionMatrixConfig,
  modules: [{ key: "teams", label: "Teams" }],
  ...over,
})

const val = (rights: Partial<RightSet> = {}): PermissionMatrixValue => ({
  teams: { ...emptyRights, ...rights },
})

describe("applyToggle", () => {
  it("turning Create ON forces Read ON and locks Read", () => {
    const next = applyToggle(val(), "teams", "create", true, true)
    expect(next.teams.create).toBe(true)
    expect(next.teams.read).toBe(true)
    // Read is now locked on (any write present).
    expect(cellState(cfg(), next, "teams", "read")).toMatchObject({
      checked: true,
      disabled: true,
      lockedOn: true,
    })
  })

  it("turning the last write OFF unlocks Read", () => {
    let v = applyToggle(val(), "teams", "create", true, true) // read locks on
    expect(cellState(cfg(), v, "teams", "read").lockedOn).toBe(true)
    v = applyToggle(v, "teams", "create", false, true) // last write off
    expect(cellState(cfg(), v, "teams", "read").lockedOn).toBe(false)
    expect(cellState(cfg(), v, "teams", "read").disabled).toBe(false)
    // Read is still ON, just toggleable again.
    expect(v.teams.read).toBe(true)
  })

  it("turning Read OFF while a write is ON is a no-op (stays on)", () => {
    const v = val({ read: true, edit: true })
    const next = applyToggle(v, "teams", "read", false, true)
    expect(next).toBe(v) // unchanged reference — true no-op
    expect(next.teams.read).toBe(true)
  })

  it("turning Read OFF is allowed when no write is on", () => {
    const v = val({ read: true })
    const next = applyToggle(v, "teams", "read", false, true)
    expect(next.teams.read).toBe(false)
  })

  it("does not mutate the input value", () => {
    const v = val({ read: true })
    const snapshot = JSON.parse(JSON.stringify(v))
    applyToggle(v, "teams", "create", true, true)
    expect(v).toEqual(snapshot)
  })

  it("with autoFlipRead off, a write does NOT pull Read on", () => {
    const next = applyToggle(val(), "teams", "edit", true, false)
    expect(next.teams.edit).toBe(true)
    expect(next.teams.read).toBe(false)
  })

  it("treats a module absent from value as all-off, then toggles correctly", () => {
    const empty: PermissionMatrixValue = {}
    expect(rightsFor(empty, "teams")).toEqual(emptyRights)
    const next = applyToggle(empty, "teams", "delete", true, true)
    expect(next.teams).toEqual({
      read: true, // pulled on by the write
      create: false,
      edit: false,
      delete: true,
    })
  })
})

describe("cellState — read/locked modes never mutate", () => {
  it("read mode disables every cell (so no toggle can fire)", () => {
    const v = val({ read: true, create: true })
    for (const right of ["read", "create", "edit", "delete"] as const) {
      const st = cellState(cfg({ mode: "read" }), v, "teams", right)
      expect(st.disabled).toBe(true)
    }
  })

  it("locked mode forces every cell ON and disabled", () => {
    const v: PermissionMatrixValue = {} // even with no stored value
    for (const right of ["read", "create", "edit", "delete"] as const) {
      const st = cellState(cfg({ mode: "locked" }), v, "teams", right)
      expect(st).toMatchObject({ checked: true, disabled: true })
    }
  })

  it("edit mode reflects the stored value", () => {
    const v = val({ read: true })
    expect(cellState(cfg(), v, "teams", "read").checked).toBe(true)
    expect(cellState(cfg(), v, "teams", "create").checked).toBe(false)
  })
})
