"use client"

// CollectionFrame — the shared "chrome" every collection wears. You hand it the
// FULL row array plus a function that renders one page of rows; it applies the
// Glide-style collection config for you:
//   • title           — an optional header
//   • filter / sort    — EXECUTED here (via selectRows) from the config's rules
//   • searchable       — a debounced SearchInput that filters the named columns
//   • userFilter       — a FilterBar of `filterFacets` (dropdowns / chips)
//   • showCount        — a LIVE "Showing X of Y" that reacts to search + facets
//   • limit            — caps the TOTAL rows (e.g. "only ever show 50")
//   • itemsPerPage     — paginates the (filtered) rows, with a Prev/Next pager
// The data math lives in lib/collection (selectRows) so it stays unit-tested;
// one component so List, Card, Table, etc. all behave identically — no repeat.
//
// SERVER-SIDE seam: pass `serverSide` + `onQueryChange` and the frame stops
// filtering in memory — it emits the (debounced) query + facets and renders
// whatever `data` it's handed, so an app can refetch (?q= / FTS5) later.

import * as React from "react"
import { ChevronLeft, ChevronRight, Filter } from "lucide-react"

import { selectRows } from "../../../lib/collection"
import { type CollectionConfig } from "../../../lib/config"
import { cn } from "../../../lib/utils"
import { Button } from "../../primitives/button/button"
import { FilterBar } from "../../primitives/filter-bar/filter-bar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../primitives/popover/popover"
import { SearchInput } from "../../primitives/search-input/search-input"
import { useIsVisible } from "../../primitives/visibility/visibility"

function CollectionFrame<T>({
  config,
  data,
  searchKeys,
  renderItems,
  serverSide = false,
  onQueryChange,
  className,
}: {
  config: CollectionConfig
  data: T[]
  /** Object keys searched when the user types in the search box. */
  searchKeys: (keyof T)[]
  /** Render one page of rows (the frame slices them for you). */
  renderItems: (rows: T[]) => React.ReactNode
  /** When true, the frame does NOT filter/search/paginate in memory — it renders
   * `data` as given and emits query/facets via `onQueryChange` (the app refetches). */
  serverSide?: boolean
  /** Notified (query already debounced by SearchInput) whenever the user's
   * query or facet selection changes — the seam for server-side `?q=` / FTS5. */
  onQueryChange?: (state: {
    query: string
    facetValues: Record<string, string>
  }) => void
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  const [facetValues, setFacetValues] = React.useState<Record<string, string>>(
    {}
  )
  const [page, setPage] = React.useState(0)
  const rootRef = React.useRef<HTMLDivElement>(null)

  // A new search/facet resets to the first page so results are never off-screen.
  React.useEffect(() => setPage(0), [query, facetValues])

  // Emit query/facets to the app (skip the initial mount). The query is already
  // debounced upstream by SearchInput; facet changes are immediate.
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    onQueryChange?.({ query, facetValues })
  }, [query, facetValues, onQueryChange])

  const visibleConfig = useIsVisible(config)
  if (!visibleConfig) return null

  // limit → (builder filter + facets) → search → sort → paginate (see selectRows).
  // serverSide: skip the in-memory pipeline — render whatever `data` we're given.
  const slice = serverSide
    ? {
        visible: data,
        filtered: data,
        total: data.length,
        pageCount: 1,
        page: 0,
      }
    : selectRows(data, config, { query, searchKeys, page, facetValues })
  const { visible, filtered, pageCount, page: current } = slice

  const showFilterBar = config.userFilter && config.filterFacets.length > 0
  const showHeader =
    config.title || config.showCount || config.searchable || showFilterBar
  const canClear =
    query !== "" || Object.values(facetValues).some((v) => v !== "")

  const setFacet = (field: string, value: string) =>
    setFacetValues((s) => {
      const next = { ...s }
      if (value === "") delete next[field]
      else next[field] = value
      return next
    })

  const clearAll = () => {
    setQuery("")
    setFacetValues({})
  }

  // Page change: optionally scroll the collection's top back into view.
  const goTo = (p: number) => {
    setPage(p)
    if (config.scrollToTop)
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div ref={rootRef} className={cn("flex w-full flex-col gap-3", className)}>
      {showHeader &&
        (() => {
          const titleBlock = (
            <div className="flex items-baseline gap-2">
              {config.title && (
                <h3 className="text-sm font-semibold">{config.title}</h3>
              )}
              {config.showCount && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  Showing {visible.length} of {filtered.length}
                </span>
              )}
            </div>
          )
          const searchBox = config.searchable ? (
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={config.searchPlaceholder}
              className="w-44"
            />
          ) : null
          const filterBar = showFilterBar ? (
            <FilterBar
              facets={config.filterFacets}
              values={facetValues}
              data={data}
              onChange={setFacet}
              onClearAll={clearAll}
              canClear={canClear}
              resultCount={filtered.length}
            />
          ) : null

          // Mobile: fold the live count into the search placeholder (e.g.
          // "Search 3 roles…") so the header can stay ONE row with no separate
          // count line. (Only rewrites a placeholder that starts with "Search".)
          const mobilePlaceholder = config.showCount
            ? config.searchPlaceholder.replace(
                /^Search\b/i,
                (m) => `${m} ${filtered.length}`
              )
            : config.searchPlaceholder

          return (
            <>
              {/* Mobile (< sm): ONE compact row — a stretching search field + a
                  funnel that opens the same FilterBar in a popover. Left-to-right,
                  never wrapping into 2–3 stacked rows. */}
              <div className="flex items-center gap-2 sm:hidden">
                {config.searchable ? (
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder={mobilePlaceholder}
                    className="min-w-0 flex-1"
                  />
                ) : (
                  <div className="min-w-0 flex-1">{titleBlock}</div>
                )}
                {showFilterBar && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Filters"
                        className="relative size-8 shrink-0"
                      >
                        <Filter />
                        {canClear && (
                          <span
                            aria-hidden
                            className="absolute top-1 right-1 size-1.5 rounded-full bg-primary"
                          />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-[min(20rem,calc(100vw-2rem))]"
                    >
                      {/* The same FilterBar the desktop layout renders (built
                          once as `filterBar` above) — just placed in a popover. */}
                      {filterBar}
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* ≥ sm: the desktop/tablet layout — UNCHANGED. "inline" = title +
                  search + filters on one wrapping row; "stacked" (default) =
                  title+search row with the filter bar on its own line below. */}
              <div className="hidden sm:block">
                {config.headerLayout === "inline" ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {titleBlock}
                    {searchBox}
                    {filterBar}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      {titleBlock}
                      {searchBox}
                    </div>
                    {filterBar}
                  </div>
                )}
              </div>
            </>
          )
        })()}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {config.emptyText}
        </div>
      ) : (
        renderItems(visible)
      )}

      {!serverSide && config.itemsPerPage != null && pageCount > 1 && (
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-muted-foreground tabular-nums">
            Page {current + 1} of {pageCount}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={current === 0}
              onClick={() => goTo(current - 1)}
            >
              <ChevronLeft /> Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={current >= pageCount - 1}
              onClick={() => goTo(current + 1)}
            >
              Next <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { CollectionFrame }
