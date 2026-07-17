"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import { Card } from "../../primitives/card/card"

export interface ListItem {
  id: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Extra label/value pairs under the subtitle, for rows you SCAN rather than
   *  read (code · price · height · material). Without these a row shows two
   *  fields, so sorting by a field the row doesn't display looks broken.
   *  They wrap and truncate; keep them short. Many columns of uniform data are
   *  still a `DataTable` — this is for a list row that needs more than two. */
  fields?: { label: string; value: React.ReactNode }[]
  /** Leading slot — an avatar, icon, or thumbnail. */
  leading?: React.ReactNode
  /** Trailing slot — a badge, timestamp, or action. */
  trailing?: React.ReactNode
}

export interface ListProps<T extends ListItem> {
  items: T[]
  /** When provided, rows become buttons and fire this on click. */
  onItemClick?: (item: T) => void
  /** Opt-in single-select. The id of the currently-selected row (its active
   *  highlight). Pair with `onSelect`. `null`/absent = nothing selected. */
  selectedId?: string | null
  /** When provided, rows become buttons; clicking one fires this with the row. */
  onSelect?: (item: T) => void
  /** "card" = the frosted card surface (default); "none" = flat, no
   *  background/border — for hosts that provide their own surface. A flat list
   *  still rounds + clips its rows so the hover/selected highlight follows the
   *  host card's corners. */
  surface?: "card" | "none"
  /** Rendered when `items` is empty. */
  empty?: React.ReactNode
  className?: string
}

/**
 * A Glide-style data-bound list: hand it an array of records and it renders a
 * polished, optionally-interactive list. Composed entirely from the Card
 * primitive + tokens — it owns almost no markup of its own.
 *
 * Selection is opt-in: pass `selectedId` + `onSelect` and the active row gets an
 * accessible highlight (a teal left-accent + tint, distinct from the grey
 * hover/avatar chips, and `aria-current="true"`) that reads in light and dark.
 */
function List<T extends ListItem>({
  items,
  onItemClick,
  selectedId,
  onSelect,
  surface = "card",
  empty,
  className,
}: ListProps<T>) {
  // "none" = a flat container (no card background/border); "card" = the frosted
  // Card. Either way rows keep their divider + hover/selected affordances.
  const Surface = surface === "card" ? Card : "div"
  // A flat list rounds itself (the Card surface brings its own radius), so the
  // full-bleed hover/selected row highlight follows rounded corners even when a
  // host nests the list inside its own card. `overflow-hidden` on the row group
  // does the clipping; a host-passed className can still override the radius.
  const surfaceClass = surface === "none" ? "rounded-xl" : undefined

  if (items.length === 0) {
    return (
      <Surface
        className={cn(
          "p-8 text-center text-sm text-muted-foreground",
          surfaceClass,
          className
        )}
      >
        {empty ?? "Nothing here yet."}
      </Surface>
    )
  }

  const interactive = Boolean(onItemClick || onSelect)

  return (
    <Surface
      className={cn("divide-y overflow-hidden p-0", surfaceClass, className)}
    >
      {items.map((item) => {
        const selected = selectedId != null && item.id === selectedId
        const content = (
          <>
            {item.leading != null && (
              <div className="shrink-0">{item.leading}</div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{item.title}</div>
              {item.subtitle != null && (
                <div className="truncate text-sm text-muted-foreground">
                  {item.subtitle}
                </div>
              )}
              {item.fields != null && item.fields.length > 0 && (
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  {item.fields.map((f) => (
                    <span
                      key={f.label}
                      className="min-w-0 truncate text-xs text-muted-foreground"
                    >
                      <span className="opacity-70">{f.label}</span>{" "}
                      <span className="text-foreground tabular-nums">
                        {f.value}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {item.trailing != null && (
              <div className="shrink-0">{item.trailing}</div>
            )}
          </>
        )

        // Every row reserves a 2px left rail (transparent) so the selected
        // accent never shifts the layout. The selected state is a teal accent
        // rail + a soft teal tint — deliberately NOT the grey used by hover or
        // the avatar/icon chip, so the leading slot stays legible in both themes.
        const rowClass =
          "flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left transition-colors"
        const stateClass = selected
          ? "border-l-primary bg-primary/10 hover:bg-primary/15"
          : interactive
            ? "border-l-transparent hover:bg-accent hover:text-accent-foreground"
            : "border-l-transparent hover:bg-accent/40"

        const handleClick = () => {
          onSelect?.(item)
          onItemClick?.(item)
        }

        return interactive ? (
          <button
            key={item.id}
            type="button"
            onClick={handleClick}
            data-selected={selected ? "true" : undefined}
            aria-current={selected ? "true" : undefined}
            className={cn(rowClass, stateClass)}
          >
            {content}
          </button>
        ) : (
          <div
            key={item.id}
            data-selected={selected ? "true" : undefined}
            aria-current={selected ? "true" : undefined}
            className={cn(rowClass, stateClass)}
          >
            {content}
          </div>
        )
      })}
    </Surface>
  )
}

export { List }
