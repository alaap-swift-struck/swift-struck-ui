"use client"

// SearchInput — the one search box the whole library uses (collection-frame,
// data-table). Composed from the Input primitive + a lucide Search icon, with a
// clear (X) button when non-empty. The field updates immediately; the onChange
// callback is debounced (`debounceMs`, default 200) so apps don't refilter/
// refetch on every keystroke. Accessible: type="search", aria-label="Search".

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "../../../lib/utils"
import { Input } from "../input/input"

function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 200,
  className,
  ...props
}: {
  value: string
  /** Debounced (see `debounceMs`). */
  onChange: (value: string) => void
  placeholder?: string
  /** Debounce for `onChange` in ms. `0` = fire immediately. */
  debounceMs?: number
  className?: string
} & Omit<React.ComponentProps<"input">, "value" | "onChange">) {
  // Local mirror so the input is responsive; the callback fires on a timer.
  const [text, setText] = React.useState(value)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stay in sync when the controlled value changes from outside (e.g. Clear all).
  React.useEffect(() => setText(value), [value])
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const set = (next: string) => {
    setText(next)
    if (timer.current) clearTimeout(timer.current)
    if (debounceMs <= 0) {
      onChange(next)
    } else {
      timer.current = setTimeout(() => onChange(next), debounceMs)
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        aria-label="Search"
        value={text}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        // hide the native webkit clear "x" — we render our own below
        className="h-8 pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {text !== "" && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => set("")}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export { SearchInput }
