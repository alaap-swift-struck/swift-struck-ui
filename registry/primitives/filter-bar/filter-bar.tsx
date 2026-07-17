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
import {
  SEARCHABLE_THRESHOLD,
  type FacetOption,
  type FilterFacet,
} from "../../../lib/config"
import { formatRange, parseRange } from "../../../lib/range"
import { cn } from "../../../lib/utils"
import { Badge } from "../badge/badge"
import { Button } from "../button/button"
import { Input } from "../input/input"
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
import { Slider } from "../slider/slider"
import { useDebouncedCallback } from "../use-debounce/use-debounce"

/** A `control:"range"` facet: a compact trigger + a min/max editor in a popover.
 * With BOTH `min` and `max` bounds it's a two-thumb Slider; otherwise two number
 * inputs (so an unbounded field still works). Reports "min..max" through the
 * SAME onChange every other facet uses — empty clears it. */
function RangeFacet({
  facet,
  value,
  onChange,
}: {
  facet: FilterFacet
  value: string
  onChange: (value: string) => void
}) {
  const { label, min: lo, max: hi, step = 1 } = facet
  const [open, setOpen] = React.useState(false)
  const { min, max } = parseRange(value)
  const bounded = lo != null && hi != null

  // Raw text mirrors, so a half-typed "-" or "1" isn't clobbered mid-keystroke.
  // Re-synced from `value` each time the popover opens (which also picks up an
  // outside "Clear all"), and the inputs own the text while it's open.
  const [rawMin, setRawMin] = React.useState("")
  const [rawMax, setRawMax] = React.useState("")
  React.useEffect(() => {
    if (!open) return
    const p = parseRange(value)
    setRawMin(p.min == null ? "" : String(p.min))
    setRawMax(p.max == null ? "" : String(p.max))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const toNum = (raw: string) => {
    const t = raw.trim()
    if (t === "") return null
    const n = Number(t)
    return Number.isFinite(n) ? n : null
  }

  const summary =
    min != null && max != null
      ? `${min} – ${max}`
      : min != null
        ? `≥ ${min}`
        : max != null
          ? `≤ ${max}`
          : label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={label}
          className="h-8 w-auto min-w-[8rem] justify-between gap-1 font-normal"
        >
          <span
            className={cn("truncate", value === "" && "text-muted-foreground")}
          >
            {summary}
          </span>
          {value !== "" ? (
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
        className="w-[min(16rem,calc(100vw-2rem))] p-3"
      >
        {bounded ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground tabular-nums">
                {min ?? lo} – {max ?? hi}
              </span>
            </div>
            <Slider
              aria-label={label}
              min={lo}
              max={hi}
              step={step}
              value={[min ?? lo, max ?? hi]}
              onValueChange={([a, b]) => onChange(formatRange(a, b))}
            />
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <label className="flex-1 text-xs text-muted-foreground">
              Min
              <Input
                type="number"
                inputMode="numeric"
                min={lo}
                max={hi}
                step={step}
                value={rawMin}
                aria-label={`${label} minimum`}
                onChange={(e) => {
                  setRawMin(e.target.value)
                  onChange(formatRange(toNum(e.target.value), toNum(rawMax)))
                }}
                className="mt-1 h-8"
              />
            </label>
            <label className="flex-1 text-xs text-muted-foreground">
              Max
              <Input
                type="number"
                inputMode="numeric"
                min={lo}
                max={hi}
                step={step}
                value={rawMax}
                aria-label={`${label} maximum`}
                onChange={(e) => {
                  setRawMax(e.target.value)
                  onChange(formatRange(toNum(rawMin), toNum(e.target.value)))
                }}
                className="mt-1 h-8"
              />
            </label>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

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

  // Debounced async search (via the shared debounce). A request counter guards
  // against an earlier (slower) response clobbering a newer one.
  const runSearch = useDebouncedCallback((raw: string) => {
    if (!onSearch) return
    const id = ++reqId.current
    Promise.resolve(onSearch(field, raw))
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

  // On each keystroke: mirror immediately, then debounce the fetch. Empty query
  // reverts to `options` and invalidates any in-flight response.
  const onQueryChange = (next: string) => {
    setQuery(next)
    if (!onSearch) return
    const q = next.trim()
    if (q === "") {
      reqId.current++
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    runSearch(q)
  }

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
            onValueChange={onQueryChange}
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
        const val = values[f.field] ?? ""

        // control: "range" → a numeric min/max control. Its value is "min..max",
        // compiled to inclusive gte/lte rules by selectRows. Handled before the
        // option list is derived — a range facet has no options to scan for.
        if (f.control === "range") {
          return (
            <RangeFacet
              key={f.field}
              facet={f}
              value={val}
              onChange={(v) => onChange(f.field, v)}
            />
          )
        }

        const opts = optionsFor(f)

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

        // control: "select" → a combobox when it searches itself, else the plain
        // dropdown. `searchable` is OPT-OUT past SEARCHABLE_THRESHOLD options:
        // a host can't accidentally ship an unsearchable 200-item dropdown, and
        // small facets stay plain (a search box over 3 options is noise). The
        // triggers are near-identical either way — only the popover adapts.
        const searchable = f.searchable ?? opts.length > SEARCHABLE_THRESHOLD
        if (searchable) {
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
