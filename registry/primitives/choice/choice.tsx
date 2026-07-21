"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, X } from "lucide-react"

import { type BaseConfig, defaultBaseConfig } from "../../../lib/config"
import { cn } from "../../../lib/utils"
import { Badge } from "../badge/badge"
import { useIsVisible } from "../visibility/visibility"
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

/* ------------------------------- config ------------------------------- */

export type ChoiceMode = "single" | "multi"
export type ChoiceDisplay = "dropdown" | "chips" | "pills"

/** Every field is required on purpose — see ARCHITECTURE.md "Configuration". */
export interface ChoiceConfig extends BaseConfig {
  /** Pick one value or many. */
  mode: ChoiceMode
  /** dropdown = trigger + searchable list · chips = removable + add · pills = inline toggles. */
  display: ChoiceDisplay
  /** Show a search box inside the dropdown list. */
  searchable: boolean
  /** Allow clearing the whole selection. */
  clearable: boolean
  /** Max selections in multi mode (`null` = unlimited). */
  max: number | null
  /** Text shown when nothing is selected. */
  placeholder: string
  /** Placeholder inside the search box. */
  searchPlaceholder: string
  /** Text shown when no options match the search. */
  emptyText: string
  /** Allow using a typed value that isn't in `options` — a "create" row appears
   *  at the top of the list when the search text matches no existing option.
   *  Applies to `dropdown` and `chips` (the searchable displays); `pills` has no
   *  text input so it's unaffected. Forces the search box on when true. */
  creatable: boolean
  /** The create row's label. `{query}` is replaced with the trimmed search text
   *  (rendered as escaped text, never HTML). E.g. `Add "{query}"`. */
  createLabel: string
}

export const defaultChoiceConfig: ChoiceConfig = {
  ...defaultBaseConfig,
  mode: "single",
  display: "dropdown",
  searchable: true,
  clearable: true,
  max: null,
  placeholder: "Select…",
  searchPlaceholder: "Search…",
  emptyText: "No options found.",
  creatable: false,
  createLabel: 'Add "{query}"',
}

/* ------------------------------ component ------------------------------ */

export interface ChoiceOption {
  label: string
  value: string
}

export interface ChoiceProps {
  options: ChoiceOption[]
  /** Always an array — length 0/1 in single mode. */
  value: string[]
  onChange: (value: string[]) => void
  config: ChoiceConfig
  /** Fired (in addition to `onChange`) when a `creatable` value that isn't in
   *  `options` is used — the host can persist it as a new option. The value is
   *  also in the next `onChange`, so a host that reconciles from `value` alone
   *  can ignore this. Never fired for a value that matches an existing option. */
  onCreate?: (value: string) => void
  className?: string
}

function Choice({
  options,
  value,
  onChange,
  config,
  onCreate,
  className,
}: ChoiceProps) {
  const [open, setOpen] = React.useState(false)
  // Controlled search text — needed so the creatable "create" row can read the
  // query, decide whether it matches an existing option, and label itself.
  const [query, setQuery] = React.useState("")
  const labelOf = (v: string) => options.find((o) => o.value === v)?.label ?? v
  const isSelected = (v: string) => value.includes(v)
  const atMax =
    config.mode === "multi" && config.max !== null && value.length >= config.max

  function toggle(v: string) {
    if (config.mode === "single") {
      const next = isSelected(v) && config.clearable ? [] : [v]
      onChange(next)
      setOpen(false)
      return
    }
    if (isSelected(v)) {
      onChange(value.filter((x) => x !== v))
    } else if (!atMax) {
      onChange([...value, v])
    }
  }

  // selected options float to the top of the list
  const ordered = React.useMemo(
    () =>
      [...options].sort(
        (a, b) => Number(isSelected(b.value)) - Number(isSelected(a.value))
      ),
    [options, value] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // Reopening should start clean — clear the search on every close path (picking
  // an option, Escape, clicking outside), not just the popover's onOpenChange.
  React.useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  const trimmedQuery = query.trim()
  const matchesExisting = (v: string) =>
    options.some(
      (o) =>
        o.value.toLowerCase() === v.toLowerCase() ||
        o.label.toLowerCase() === v.toLowerCase()
    )
  // Show the create row only when the host opted in, there IS a query, it
  // matches no existing option (case-insensitive), and we're not at the max.
  const showCreate =
    config.creatable &&
    trimmedQuery !== "" &&
    !matchesExisting(trimmedQuery) &&
    !atMax

  function create() {
    const v = trimmedQuery
    if (!v) return
    // Trim + dedupe: a typed value that equals an existing option (any case)
    // selects that option instead of making a near-duplicate — and never fires
    // onCreate, since nothing new was created.
    const existing = options.find(
      (o) =>
        o.value.toLowerCase() === v.toLowerCase() ||
        o.label.toLowerCase() === v.toLowerCase()
    )
    if (existing) {
      toggle(existing.value)
    } else {
      onCreate?.(v)
      toggle(v)
    }
    setQuery("")
  }

  const visible = useIsVisible(config)
  if (!visible) return null

  /* ---- pills: inline toggles, no popover ---- */
  if (config.display === "pills") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {options.map((o) => {
          const active = isSelected(o.value)
          return (
            <Button
              key={o.value}
              type="button"
              size="sm"
              variant={active ? "default" : "outline"}
              disabled={!active && atMax}
              onClick={() => toggle(o.value)}
              className="rounded-full"
            >
              {active && <Check />}
              {o.label}
            </Button>
          )
        })}
      </div>
    )
  }

  const list = (
    <Command>
      {(config.searchable || config.creatable) && (
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder={config.searchPlaceholder}
        />
      )}
      <CommandList>
        {showCreate && (
          // The create row sits at the TOP. forceMount so cmdk's own text filter
          // can't drop it — we've already decided it should show (the query
          // matches no option); its label is escaped React text, never HTML.
          <CommandGroup forceMount>
            <CommandItem
              forceMount
              value={`__create__${trimmedQuery}`}
              onSelect={create}
              className="text-primary"
            >
              <Plus />
              {config.createLabel.replace("{query}", trimmedQuery)}
            </CommandItem>
          </CommandGroup>
        )}
        {/* Suppress "no options" when a create row is offered — otherwise the
            list reads "No options found." right above an "Add …" action. */}
        {!showCreate && <CommandEmpty>{config.emptyText}</CommandEmpty>}
        <CommandGroup>
          {ordered.map((o) => {
            const active = isSelected(o.value)
            return (
              <CommandItem
                key={o.value}
                value={o.label}
                disabled={!active && atMax}
                onSelect={() => toggle(o.value)}
              >
                <Check className={cn("opacity-0", active && "opacity-100")} />
                {o.label}
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  /* ---- chips: removable badges + an add popover ---- */
  if (config.display === "chips") {
    return (
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        {value.map((v) => (
          <Badge key={v} variant="secondary" className="gap-1 pr-1">
            {labelOf(v)}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== v))}
              className="rounded-full p-0.5 transition-colors hover:bg-background/60"
              aria-label={`Remove ${labelOf(v)}`}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button type="button" size="sm" variant="outline" disabled={atMax}>
              + Add
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">{list}</PopoverContent>
        </Popover>
      </div>
    )
  }

  /* ---- dropdown: trigger + popover (selected shown first) ---- */
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className="flex flex-1 flex-wrap items-center gap-1 overflow-hidden">
            {value.length === 0 ? (
              <span className="text-muted-foreground">
                {config.placeholder}
              </span>
            ) : config.mode === "single" ? (
              labelOf(value[0])
            ) : (
              <>
                {value.slice(0, 2).map((v) => (
                  <Badge key={v} variant="secondary">
                    {labelOf(v)}
                  </Badge>
                ))}
                {value.length > 2 && (
                  <Badge variant="secondary">+{value.length - 2}</Badge>
                )}
              </>
            )}
          </span>
          {config.clearable && value.length > 0 ? (
            <X
              className="opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange([])
              }}
            />
          ) : (
            <ChevronsUpDown className="opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        {list}
      </PopoverContent>
    </Popover>
  )
}

export { Choice }
