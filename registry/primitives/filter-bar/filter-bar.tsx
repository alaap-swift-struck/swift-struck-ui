"use client"

// FilterBar — the user-facing filter row for collections. Renders each
// `FilterFacet` as a dropdown (control:"select") or a set of removable chips
// (control:"chips"), plus a single "Clear all" when anything is active. The
// chosen value is reported via onChange; the collection turns it into an `is`
// Rule (see lib/collection selectRows). Keyboard-operable, aria-labelled per
// facet, with a polite live-region count. Wraps — it never widens its parent.

import * as React from "react"
import { Filter, X } from "lucide-react"

import { facetOptions } from "../../../lib/collection"
import { type FilterFacet } from "../../../lib/config"
import { cn } from "../../../lib/utils"
import { Badge } from "../badge/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select/select"

function FilterBar<T>({
  facets,
  values,
  data,
  onChange,
  onClearAll,
  canClear,
  resultCount,
  className,
}: {
  facets: FilterFacet[]
  /** Current selection per facet field ({} = none). */
  values: Record<string, string>
  /** The FULL data — distinct values are derived from it when a facet omits
   * `options` (so choices don't vanish as you filter). */
  data: T[]
  /** Empty `value` clears that facet. */
  onChange: (field: string, value: string) => void
  onClearAll: () => void
  /** Show the "Clear all" control (true when any facet OR the search is active). */
  canClear: boolean
  /** Announced politely to screen readers when results change. */
  resultCount?: number
  className?: string
}) {
  if (facets.length === 0 && !canClear) return null

  const optionsFor = (f: FilterFacet) =>
    f.options ?? facetOptions(data, f.field)

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Filter className="size-4 shrink-0 text-muted-foreground" aria-hidden />

      {facets.map((f) => {
        const opts = optionsFor(f)
        const val = values[f.field] ?? ""

        if (f.control === "chips") {
          return (
            <div
              key={f.field}
              role="group"
              aria-label={f.label}
              className="flex flex-wrap items-center gap-1.5"
            >
              {opts.map((o) => {
                const selected = val === o.value
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={selected}
                    aria-label={`${f.label}: ${o.label}`}
                    onClick={() => onChange(f.field, selected ? "" : o.value)}
                    className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Badge
                      variant={selected ? "default" : "outline"}
                      className="cursor-pointer gap-1"
                    >
                      {o.label}
                      {selected && <X className="size-3" aria-hidden />}
                    </Badge>
                  </button>
                )
              })}
            </div>
          )
        }

        // control: "select"
        return (
          <Select
            key={f.field}
            value={val || undefined}
            onValueChange={(v) => onChange(f.field, v)}
          >
            <SelectTrigger
              aria-label={f.label}
              className="h-8 w-auto min-w-[8rem] gap-1"
            >
              <SelectValue placeholder={f.label} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      })}

      {canClear && (
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" aria-hidden /> Clear all
        </button>
      )}

      <span aria-live="polite" className="sr-only">
        {resultCount != null ? `${resultCount} results` : ""}
      </span>
    </div>
  )
}

export { FilterBar }
