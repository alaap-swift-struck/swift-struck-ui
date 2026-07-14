"use client"

// FilterBar — the user-facing filter row for collections. Renders each
// `FilterFacet` as a dropdown (control:"select") or a set of removable chips
// (control:"chips"), plus a single "Clear all" when anything is active. The
// chosen value is reported via onChange; the collection turns it into an `is`
// Rule (see lib/collection selectRows). Keyboard-operable, aria-labelled per
// facet, with a polite live-region count. Wraps — it never widens its parent.

import * as React from "react"
import { Check, ChevronsUpDown, Filter, X } from "lucide-react"

import { facetOptions } from "../../../lib/collection"
import { type FacetOption, type FilterFacet } from "../../../lib/config"
import { cn } from "../../../lib/utils"
import { Badge } from "../badge/badge"
import { Button } from "../button/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command/command"
import { Popover, PopoverContent, PopoverTrigger } from "../popover/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select/select"

/** A `control:"select"` facet rendered as a searchable combobox. Shows `options`
 * up front; when `onSearch` is set it fires (debounced) as the user types and the
 * resolved rows REPLACE the list — so a facet with thousands of values never
 * loads them all. Without `onSearch` it's a plain client-side filtered combobox. */
function SearchableFacet({
  facet,
  value,
  options,
  onChange,
}: {
  facet: FilterFacet
  value: string
  /** Options shown before the user types (facet.options or data-derived). */
  options: FacetOption[]
  onChange: (value: string) => void
}) {
  const { field, label, onSearch } = facet
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  // null = "no async results yet" → show `options`. onSearch replaces this.
  const [results, setResults] = React.useState<FacetOption[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const reqId = React.useRef(0)

  // Debounced async search. Empty query reverts to `options`. A request counter
  // guards against an earlier (slower) response clobbering a newer one.
  const q = query.trim()
  React.useEffect(() => {
    if (!onSearch) return
    if (q === "") {
      setResults(null)
      setLoading(false)
      return
    }
    const id = ++reqId.current
    setLoading(true)
    const timer = setTimeout(() => {
      Promise.resolve(onSearch(field, q))
        .then((rows) => {
          if (id === reqId.current) {
            setResults(rows)
            setLoading(false)
          }
        })
        .catch(() => {
          if (id === reqId.current) {
            setResults([])
            setLoading(false)
          }
        })
    }, 200)
    return () => clearTimeout(timer)
  }, [q, onSearch, field])

  // Remember labels we've seen so the trigger can name a picked value even after
  // it drops out of the visible (async) list.
  const [labels, setLabels] = React.useState<Record<string, string>>({})
  const shown = onSearch ? (results ?? options) : options
  React.useEffect(() => {
    if (shown.length === 0) return
    setLabels((prev) => {
      let changed = false
      const next = { ...prev }
      for (const o of shown)
        if (next[o.value] !== o.label) {
          next[o.value] = o.label
          changed = true
        }
      return changed ? next : prev
    })
  }, [shown])

  // With onSearch the server already filtered — cmdk must not filter again.
  const shouldFilter = !onSearch
  const triggerLabel = value ? (labels[value] ?? value) : label

  const pick = (v: string) => {
    onChange(v === value ? "" : v)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={label}
          className="h-8 w-auto min-w-[8rem] justify-between gap-1 font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {triggerLabel}
          </span>
          {value ? (
            <X
              className="size-3.5 shrink-0 opacity-60 hover:opacity-100"
              aria-hidden
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange("")
              }}
            />
          ) : (
            <ChevronsUpDown
              className="size-3.5 shrink-0 opacity-50"
              aria-hidden
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(16rem,calc(100vw-2rem))] p-0"
      >
        <Command shouldFilter={shouldFilter}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={`Search ${label.toLowerCase()}…`}
          />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching…
              </div>
            ) : (
              <CommandEmpty>No matches.</CommandEmpty>
            )}
            <CommandGroup>
              {shown.map((o) => {
                const selected = value === o.value
                return (
                  <CommandItem
                    // cmdk matches on `value`; use the label for client-side
                    // filtering, the raw value when the server already filtered.
                    key={o.value}
                    value={onSearch ? o.value : o.label}
                    onSelect={() => pick(o.value)}
                  >
                    <Check
                      className={cn(
                        "size-4 shrink-0",
                        selected ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden
                    />
                    <span className="flex-1 truncate">{o.label}</span>
                    {o.count != null && (
                      <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                        {o.count}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

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

        // control: "select", searchable → a combobox (client-filtered, or async
        // via onSearch). The plain-dropdown path below stays untouched.
        if (f.searchable) {
          return (
            <SearchableFacet
              key={f.field}
              facet={f}
              value={val}
              options={opts}
              onChange={(v) => onChange(f.field, v)}
            />
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
