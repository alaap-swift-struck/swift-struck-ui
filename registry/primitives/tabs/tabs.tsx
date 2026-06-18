"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "../../../lib/utils"
import { Badge, type BadgeProps } from "../badge/badge"

const Tabs = TabsPrimitive.Root

// Shape for the optional per-tab count/tag pill (Glide-style). A rounded chip
// that stays compact inside the h-9 tab; `min-w-5` keeps single digits circular.
const tabBadgeClass =
  "min-w-5 justify-center rounded-full px-1.5 py-0 text-xs leading-5"

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  badge,
  badgeVariant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  /** Optional trailing pill — a count or short tag, like Glide's tab counts
   *  when a tab leads to a collection. Accepts any node (number, string, node).
   *  Pass `undefined`/`null` to hide it (so `badge={count || undefined}` works). */
  badge?: React.ReactNode
  /** Badge style (see Badge). Omit for a neutral count pill that reads on both
   *  the active and inactive tab in light and dark; set e.g. "destructive" /
   *  "success" / "warning" for a colour-coded count. */
  badgeVariant?: BadgeProps["variant"]
}) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
      {badge != null && (
        <Badge
          variant={badgeVariant}
          className={cn(
            tabBadgeClass,
            // Default (no variant given): a neutral foreground-tinted chip that
            // contrasts on the muted (inactive) AND background (active) surfaces,
            // in both themes. An explicit `badgeVariant` keeps its own colours.
            !badgeVariant &&
              "border-transparent bg-foreground/10 text-foreground"
          )}
        >
          {badge}
        </Badge>
      )}
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
