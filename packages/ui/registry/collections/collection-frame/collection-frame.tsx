"use client"

// CollectionFrame — the shared "chrome" every collection wears. You hand it the
// FULL row array plus a function that renders one page of rows; it applies the
// Glide-style collection config for you:
//   • title           — an optional header
//   • showCount        — a LIVE "Showing X of Y" that reacts to search/filter
//   • searchable       — a search box that filters on the columns you name
//   • limit            — caps the TOTAL rows (e.g. "only ever show 50")
//   • itemsPerPage     — paginates the (filtered) rows, with a Prev/Next pager
// One component so List, Card, Table, etc. all behave identically — no repeat.

import * as React from "react"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"

import { type CollectionConfig } from "../../../lib/config"
import { cn } from "../../../lib/utils"
import { Button } from "../../primitives/button/button"
import { Input } from "../../primitives/input/input"
import { useIsVisible } from "../../primitives/visibility/visibility"

function CollectionFrame<T>({
  config,
  data,
  searchKeys,
  renderItems,
  className,
}: {
  config: CollectionConfig
  data: T[]
  /** Object keys searched when the user types in the search box. */
  searchKeys: (keyof T)[]
  /** Render one page of rows (the frame slices them for you). */
  renderItems: (rows: T[]) => React.ReactNode
  className?: string
}) {
  const [query, setQuery] = React.useState("")
  const [page, setPage] = React.useState(0)
  const rootRef = React.useRef<HTMLDivElement>(null)

  // A new search resets to the first page so results are never off-screen.
  React.useEffect(() => setPage(0), [query])

  const visibleConfig = useIsVisible(config)
  if (!visibleConfig) return null

  // 1) cap the total, 2) search-filter, 3) slice to the current page.
  const limited = config.limit != null ? data.slice(0, config.limit) : data
  const q = query.trim().toLowerCase()
  const filtered =
    config.searchable && q
      ? limited.filter((row) =>
          searchKeys.some((k) =>
            String(row[k] ?? "")
              .toLowerCase()
              .includes(q)
          )
        )
      : limited

  const per = config.itemsPerPage ?? filtered.length
  const pageCount = per > 0 ? Math.max(1, Math.ceil(filtered.length / per)) : 1
  const current = Math.min(page, pageCount - 1)
  const visible = config.itemsPerPage
    ? filtered.slice(current * per, current * per + per)
    : filtered

  const showHeader = config.title || config.showCount || config.searchable

  // Page change: optionally scroll the collection's top back into view.
  const goTo = (p: number) => {
    setPage(p)
    if (config.scrollToTop)
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div ref={rootRef} className={cn("flex w-full flex-col gap-3", className)}>
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-3">
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
          {config.searchable && (
            <div className="relative w-44">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="h-8 pl-8"
              />
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {config.emptyText}
        </div>
      ) : (
        renderItems(visible)
      )}

      {config.itemsPerPage != null && pageCount > 1 && (
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
