// Unit tests for selectRows — the collection data pipeline (limit → filter →
// search → sort → paginate). This is the logic that used to live untested inside
// CollectionFrame.

import { describe, expect, it } from "vitest"

import { selectRows } from "./collection"
import {
  defaultCollectionConfig,
  type CollectionConfig,
  type Rule,
} from "./config"

type Row = { id: string; name: string; role: string; n: number }
const rows: Row[] = [
  { id: "1", name: "Ada", role: "Eng", n: 30 },
  { id: "2", name: "Grace", role: "Design", n: 10 },
  { id: "3", name: "Alan", role: "Eng", n: 20 },
  { id: "4", name: "Kay", role: "Product", n: 40 },
]
const cfg = (over: Partial<CollectionConfig> = {}): CollectionConfig => ({
  ...defaultCollectionConfig,
  ...over,
})

describe("selectRows", () => {
  it("returns everything by default", () => {
    const r = selectRows(rows, cfg())
    expect(r.total).toBe(4)
    expect(r.visible).toHaveLength(4)
    expect(r.pageCount).toBe(1)
  })

  it("caps the total with limit", () => {
    expect(selectRows(rows, cfg({ limit: 2 })).total).toBe(2)
  })

  it("paginates with itemsPerPage", () => {
    const p0 = selectRows(rows, cfg({ itemsPerPage: 2 }), { page: 0 })
    expect(p0.visible.map((x) => x.id)).toEqual(["1", "2"])
    expect(p0.pageCount).toBe(2)
    const p1 = selectRows(rows, cfg({ itemsPerPage: 2 }), { page: 1 })
    expect(p1.visible.map((x) => x.id)).toEqual(["3", "4"])
  })

  it("clamps an out-of-range page", () => {
    expect(selectRows(rows, cfg({ itemsPerPage: 2 }), { page: 9 }).page).toBe(1)
  })

  it("searches the named keys", () => {
    const r = selectRows(rows, cfg({ searchable: true }), {
      query: "ad",
      searchKeys: ["name"],
    })
    expect(r.visible.map((x) => x.name)).toEqual(["Ada"])
  })

  it("executes a filter rule (role is Eng)", () => {
    const filter: Rule[] = [
      { source: "row", field: "role", op: "is", value: "Eng" },
    ]
    expect(selectRows(rows, cfg({ filter })).total).toBe(2)
  })

  it("sorts ascending and descending by a numeric column", () => {
    expect(
      selectRows(rows, cfg({ sortBy: "n", sortDir: "asc" })).visible.map(
        (x) => x.n
      )
    ).toEqual([10, 20, 30, 40])
    expect(
      selectRows(rows, cfg({ sortBy: "n", sortDir: "desc" })).visible.map(
        (x) => x.n
      )
    ).toEqual([40, 30, 20, 10])
  })

  it("applies filter → sort → paginate together", () => {
    const filter: Rule[] = [
      { source: "row", field: "role", op: "is", value: "Eng" },
    ]
    const r = selectRows(
      rows,
      cfg({ filter, sortBy: "n", sortDir: "desc", itemsPerPage: 1 }),
      { page: 0 }
    )
    expect(r.total).toBe(2) // two Eng rows
    expect(r.visible.map((x) => x.n)).toEqual([30]) // desc → 30,20 ; page 0 of size 1
  })
})
