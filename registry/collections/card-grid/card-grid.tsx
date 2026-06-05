"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/primitives/card/card"

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
  className,
}: CardGridProps<T>) {
  const interactive = Boolean(onItemClick)

  return (
    <div className={cn("grid gap-4", columnClass[columns], className)}>
      {items.map((item) => (
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
