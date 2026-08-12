"use client"

// CardGrid — a responsive grid of Cards built from data. Like List, it arranges
// existing primitives and owns no styling of its own beyond layout. Past 100
// items it renders only the cards near the viewport (see use-virtual-rows).

import * as React from "react"

import { cn } from "../../../lib/utils"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../primitives/card/card"
import { useVirtualRows } from "../../primitives/use-virtual-rows/use-virtual-rows"

export interface CardGridItem {
  id: string
  title: React.ReactNode
  description?: React.ReactNode
  /** Media slot rendered above the header — an image, chart, or icon block. */
  media?: React.ReactNode
  /** Footer slot — badges, metadata, or actions. */
  footer?: React.ReactNode
}

const columnClass: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

export interface CardGridProps<T extends CardGridItem> {
  items: T[]
  /** Max columns at the largest breakpoint (1–4). Responsive below that. */
  columns?: 1 | 2 | 3 | 4
  onItemClick?: (item: T) => void
  /** Windowed rendering — only the cards near the viewport go in the DOM. Turns
   *  itself on past 100 items. The live column count is measured from the
   *  rendered grid, so it stays correct as the grid re-flows at a breakpoint —
   *  `columns` above is a maximum, not what is actually on screen. */
  virtualize?: boolean
  className?: string
}

/**
 * A responsive grid of cards from data. Like <List>, it arranges Card
 * primitives and owns no bespoke styling beyond layout.
 */
function CardGrid<T extends CardGridItem>({
  items,
  columns = 3,
  onItemClick,
  virtualize,
  className,
}: CardGridProps<T>) {
  const interactive = Boolean(onItemClick)
  // A card with media + header ≈ 220px, plus the 16px gap. First paint only.
  const v = useVirtualRows({
    count: items.length,
    estimatePitch: 236,
    enabled: virtualize,
  })

  return (
    <div
      ref={v.containerRef}
      className={cn("grid gap-4", columnClass[columns], className)}
      // Padding rather than spacer cells: a spacer would occupy a grid track
      // and shift every card after it by one column.
      style={
        v.active
          ? { paddingTop: v.padTop, paddingBottom: v.padBottom }
          : undefined
      }
    >
      {items.slice(v.start, v.end).map((item) => (
        <Card
          key={item.id}
          onClick={interactive ? () => onItemClick?.(item) : undefined}
          className={cn(
            "overflow-hidden",
            interactive && "hover-lift cursor-pointer"
          )}
        >
          {item.media != null && <div>{item.media}</div>}
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            {item.description != null && (
              <CardDescription>{item.description}</CardDescription>
            )}
          </CardHeader>
          {item.footer != null && (
            <CardFooter className="gap-2">{item.footer}</CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}

export { CardGrid }
