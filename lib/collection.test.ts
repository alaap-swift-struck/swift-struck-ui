// Unit tests for selectRows — the collection data pipeline (limit → filter →
// search → sort → paginate). This is the logic that used to live untested inside
// CollectionFrame.

import { describe, expect, it } from "vitest"

import { facetOptions, selectRows } from "./collection"
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

  /* ----------------------------- facet filters ---------------------------- */

  it("applies a facet value as an `is` rule (select control)", () => {
    const r = selectRows(rows, cfg(), { facetValues: { role: "Eng" } })
    expect(r.total).toBe(2)
    expect(r.visible.map((x) => x.name)).toEqual(["Ada", "Alan"])
  })

  it("a chips facet uses the SAME engine (value → is rule)", () => {
    // control is presentation only — the logic is identical to select.
    const r = selectRows(rows, cfg(), { facetValues: { role: "Design" } })
    expect(r.visible.map((x) => x.name)).toEqual(["Grace"])
  })

  it("ignores an empty facet value", () => {
    expect(selectRows(rows, cfg(), { facetValues: { role: "" } }).total).toBe(4)
  })

  describe("range facet", () => {
    // A range facet must be DECLARED so selectRows knows to compile "a..b" into
    // gte/lte instead of matching it as a literal string.
    const rangeCfg = cfg({
      filterFacets: [{ field: "n", label: "N", control: "range" }],
    })

    it("filters inclusively between both bounds", () => {
      const r = selectRows(rows, rangeCfg, { facetValues: { n: "10..30" } })
      // inclusive: 10 and 30 are kept, 40 is not
      expect(r.visible.map((x) => x.n).sort((a, b) => a - b)).toEqual([
        10, 20, 30,
      ])
    })

    it("supports a one-sided range", () => {
      expect(
        selectRows(rows, rangeCfg, { facetValues: { n: "30.." } }).visible.map(
          (x) => x.n
        )
      ).toEqual([30, 40])
      expect(
        selectRows(rows, rangeCfg, { facetValues: { n: "..20" } }).visible.map(
          (x) => x.n
        )
      ).toEqual([10, 20])
    })

    it("an empty range clears the filter", () => {
      expect(selectRows(rows, rangeCfg, { facetValues: { n: "" } }).total).toBe(
        4
      )
    })

    it("ANDs a range with a select facet", () => {
      const both = cfg({
        filterFacets: [
          { field: "n", label: "N", control: "range" },
          { field: "role", label: "Role", control: "select" },
        ],
      })
      // n in [20,40] → Ada(30), Alan(20), Kay(40); AND role=Eng → Ada, Alan
      const r = selectRows(rows, both, {
        facetValues: { n: "20..40", role: "Eng" },
      })
      expect(r.visible.map((x) => x.name)).toEqual(["Ada", "Alan"])
      // tightening the range drops Ada
      const tight = selectRows(rows, both, {
        facetValues: { n: "20..25", role: "Eng" },
      })
      expect(tight.visible.map((x) => x.name)).toEqual(["Alan"])
    })

    it("a NON-range facet whose value contains '..' still matches literally", () => {
      // the control is looked up, never guessed from the value's shape
      const dotted = [{ id: "1", name: "a..b", role: "x", n: 1 }]
      const r = selectRows(dotted, cfg(), { facetValues: { name: "a..b" } })
      expect(r.total).toBe(1)
    })
  })

  it("ANDs multiple facets with each other and the builder filter", () => {
    const filter: Rule[] = [
      { source: "row", field: "role", op: "is", value: "Eng" },
    ]
    // builder: role=Eng (Ada, Alan) AND facet name=Ada → just Ada
    const r = selectRows(rows, cfg({ filter }), {
      facetValues: { name: "Ada" },
    })
    expect(r.visible.map((x) => x.name)).toEqual(["Ada"])
  })

  it("combines facet + search + sort + paginate (order preserved)", () => {
    const r = selectRows(
      rows,
      cfg({ sortBy: "n", sortDir: "desc", itemsPerPage: 1, searchable: true }),
      {
        facetValues: { role: "Eng" },
        query: "a",
        searchKeys: ["name"],
        page: 0,
      }
    )
    // facet Eng → Ada(30), Alan(20); search "a" keeps both; desc by n → 30,20;
    // page size 1, page 0 → [30] (Ada)
    expect(r.total).toBe(2)
    expect(r.visible.map((x) => x.name)).toEqual(["Ada"])
  })
})

describe("facetOptions", () => {
  it("derives distinct values, sorted, skipping empties", () => {
    const data = [
      { role: "Eng" },
      { role: "Design" },
      { role: "Eng" },
      { role: "" },
      { role: null },
    ]
    expect(facetOptions(data, "role")).toEqual([
      { value: "Design", label: "Design" },
      { value: "Eng", label: "Eng" },
    ])
  })
})
