"use client"

import * as React from "react"

import { cn } from "../../../lib/utils"
import { Card } from "../../primitives/card/card"

export interface ListItem {
  id: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  /** Leading slot — an avatar, icon, or thumbnail. */
  leading?: React.ReactNode
  /** Trailing slot — a badge, timestamp, or action. */
  trailing?: React.ReactNode
}

export interface ListProps<T extends ListItem> {
  items: T[]
  /** When provided, rows become buttons and fire this on click. */
  onItemClick?: (item: T) => void
  /** Rendered when `items` is empty. */
  empty?: React.ReactNode
  className?: string
}

/**
 * A Glide-style data-bound list: hand it an array of records and it renders a
 * polished, optionally-interactive list. Composed entirely from the Card
 * primitive + tokens — it owns almost no markup of its own.
 */
function List<T extends ListItem>({
  items,
  onItemClick,
  empty,
  className,
}: ListProps<T>) {
  if (items.length === 0) {
    return (
      <Card
        className={cn(
          "p-8 text-center text-sm text-muted-foreground",
          className
        )}
      >
        {empty ?? "Nothing here yet."}
      </Card>
    )
  }

  const interactive = Boolean(onItemClick)

  return (
    <Card className={cn("divide-y overflow-hidden p-0", className)}>
      {items.map((item) => {
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
            </div>
            {item.trailing != null && (
              <div className="shrink-0">{item.trailing}</div>
            )}
          </>
        )

        const rowClass = "flex w-full items-center gap-3 px-4 py-3 text-left"

        return interactive ? (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick?.(item)}
            className={cn(
              rowClass,
              "transition-colors hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {content}
          </button>
        ) : (
          <div
            key={item.id}
            className={cn(rowClass, "transition-colors hover:bg-accent/40")}
          >
            {content}
          </div>
        )
      })}
    </Card>
  )
}

export { List }
