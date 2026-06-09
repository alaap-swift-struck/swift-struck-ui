// Collection data operations — the pure, testable logic behind every collection.
// Given rows + a CollectionConfig (+ the live search text and page), it applies,
// in order: the total `limit` → `filter` rules → search → sort → pagination, and
// returns the current page plus the totals the UI needs. Keeping this here (not
// inside a component) means it's deterministic and unit-tested.

import { type CollectionConfig, evaluateRules } from "./config"

export interface CollectionSlice<T> {
  /** Rows for the current page (what you render). */
  visible: T[]
  /** All rows after limit + filter + search + sort, before pagination. */
  filtered: T[]
  /** filtered.length — drives the "Showing X of Y" count. */
  total: number
  /** Number of pages. */
  pageCount: number
  /** The current page, clamped into range. */
  page: number
}

export function selectRows<T>(
  data: T[],
  config: CollectionConfig,
  opts: { query?: string; searchKeys?: (keyof T)[]; page?: number } = {}
): CollectionSlice<T> {
  const { query = "", searchKeys = [], page = 0 } = opts
  const get = (row: T, key: PropertyKey) =>
    (row as Record<PropertyKey, unknown>)[key]

  // 1) cap the TOTAL number of rows
  let rows = config.limit != null ? data.slice(0, config.limit) : data.slice()

  // 2) filter rules (each row evaluated against the rule engine)
  if (config.filter && config.filter.length > 0) {
    rows = rows.filter((row) =>
      evaluateRules(config.filter, {
        row: row as Record<string, unknown>,
        user: {},
        app: {},
      })
    )
  }

  // 3) free-text search over the named keys
  const q = query.trim().toLowerCase()
  if (config.searchable && q && searchKeys.length > 0) {
    rows = rows.filter((row) =>
      searchKeys.some((k) =>
        String(get(row, k) ?? "")
          .toLowerCase()
          .includes(q)
      )
    )
  }

  // 4) sort by a column (numbers compare numerically, else locale string compare)
  if (config.sortBy) {
    const dir = config.sortDir === "desc" ? -1 : 1
    rows = rows.slice().sort((a, b) => {
      const av = get(a, config.sortBy)
      const bv = get(b, config.sortBy)
      if (av == null) return 1
      if (bv == null) return -1
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
  }

  const filtered = rows
  const per = config.itemsPerPage ?? filtered.length
  const pageCount = per > 0 ? Math.max(1, Math.ceil(filtered.length / per)) : 1
  const current = Math.min(Math.max(page, 0), pageCount - 1)
  const visible = config.itemsPerPage
    ? filtered.slice(current * per, current * per + per)
    : filtered

  return { visible, filtered, total: filtered.length, pageCount, page: current }
}
