// Unit tests for the pure screen-recipe helpers — the URL grammar (path/query),
// permission gating, breadcrumb building, and the collapse math. Run with vitest.

import { describe, expect, it } from "vitest"

import {
  buildScreenPath,
  buildScreenQuery,
  collapseCrumbs,
  gateState,
  hasRight,
  parseScreenPath,
  parseScreenQuery,
  screenCrumbs,
  type ScreenRights,
} from "./recipe"

describe("path grammar", () => {
  it("parses (module,id) pairs into levels", () => {
    expect(parseScreenPath(["members", "m1", "roles", "r2"])).toEqual([
      { module: "members", id: "m1" },
      { module: "roles", id: "r2" },
    ])
  })

  it("treats a trailing lone module as a list level (id '')", () => {
    expect(parseScreenPath(["members"])).toEqual([
      { module: "members", id: "" },
    ])
    expect(parseScreenPath(["members", "m1", "roles"])).toEqual([
      { module: "members", id: "m1" },
      { module: "roles", id: "" },
    ])
  })

  it("round-trips build → parse", () => {
    const levels = [
      { module: "members", id: "m1" },
      { module: "roles", id: "r2" },
    ]
    expect(buildScreenPath(levels)).toBe("/members/m1/roles/r2")
    expect(
      parseScreenPath(buildScreenPath(levels).slice(1).split("/"))
    ).toEqual(levels)
  })

  it("a list level builds without an id segment", () => {
    expect(buildScreenPath([{ module: "members", id: "" }])).toBe("/members")
    expect(buildScreenPath([])).toBe("/")
  })
})

describe("query grammar", () => {
  it("parses the transient layer keys", () => {
    const sp = new URLSearchParams("panel=edit&tab=overview")
    expect(parseScreenQuery(sp)).toEqual({ panel: "edit", tab: "overview" })
  })

  it("ignores an unknown panel value", () => {
    expect(parseScreenQuery({ panel: "nope" }).panel).toBeUndefined()
  })

  it("builds a query string (or '' when empty)", () => {
    expect(buildScreenQuery({ panel: "add", module: "members" })).toBe(
      "?panel=add&module=members"
    )
    expect(buildScreenQuery({ confirm: "members.remove", id: "m1" })).toBe(
      "?confirm=members.remove&id=m1"
    )
    expect(buildScreenQuery({})).toBe("")
  })
})

describe("permission gating", () => {
  const rights: ScreenRights = {
    members: { read: true, create: false, edit: true, delete: false },
  }

  it("hasRight reads per-module r/c/e/d", () => {
    expect(hasRight(rights, { module: "members", right: "read" })).toBe(true)
    expect(hasRight(rights, { module: "members", right: "delete" })).toBe(false)
    expect(hasRight(rights, { module: "ghost", right: "read" })).toBe(false)
    expect(hasRight(rights, undefined)).toBe(true)
  })

  it("gateState hides by default and disables opt-in", () => {
    expect(gateState(rights, undefined)).toBe("show")
    expect(gateState(rights, { module: "members", right: "edit" })).toBe("show")
    expect(gateState(rights, { module: "members", right: "delete" })).toBe(
      "hidden"
    )
    expect(
      gateState(rights, {
        module: "members",
        right: "delete",
        showWhenDenied: "disabled",
      })
    ).toBe("disabled")
  })
})

describe("breadcrumbs", () => {
  it("builds cumulative hrefs with a tenant prefix", () => {
    const levels = [
      { module: "members", id: "m1" },
      { module: "roles", id: "r2" },
    ]
    const crumbs = screenCrumbs(levels, (l) => l.module, "/t/team1")
    expect(crumbs.map((c) => c.href)).toEqual([
      "/t/team1/members/m1",
      "/t/team1/members/m1/roles/r2",
    ])
  })

  it("does not collapse a short trail", () => {
    const r = collapseCrumbs([1, 2, 3], 3)
    expect(r.collapsed).toBe(false)
    expect(r.tail).toEqual([1, 2, 3])
  })

  it("collapses the middle of a long trail (first · … · last two)", () => {
    const r = collapseCrumbs([1, 2, 3, 4, 5], 3)
    expect(r.collapsed).toBe(true)
    expect(r.lead).toEqual([1])
    expect(r.middle).toEqual([2, 3])
    expect(r.tail).toEqual([4, 5])
  })
})
