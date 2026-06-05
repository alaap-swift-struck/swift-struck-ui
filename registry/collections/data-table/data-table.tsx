"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  MoreHorizontal,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/primitives/badge/badge"
import { Button } from "@/registry/primitives/button/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/primitives/dropdown-menu/dropdown-menu"
import { Input } from "@/registry/primitives/input/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/primitives/table/table"

/* ------------------------------- config ------------------------------- */

export type ColumnType = "text" | "number" | "badge" | "date"
export type DataTableDensity = "comfortable" | "compact"
export type Align = "left" | "center" | "right"

export interface DataTableColumn {
  /** Key into each row object. */
  key: string
  header: string
  /** Drives rendering + sort behavior. */
  type: ColumnType
  sortable: boolean
  align: Align
}

/** Every field is required on purpose — see ARCHITECTURE.md "Configuration". */
export interface DataTableConfig {
  columns: DataTableColumn[]
  /** Global search box over all columns. */
  searchable: boolean
  /** Zebra-striped rows. */
  striped: boolean
  density: DataTableDensity
  /** Trailing actions (⋯) column — supply `actions` to populate it. */
  rowActions: boolean
}

export const defaultDataTableConfig: DataTableConfig = {
  columns: [],
  searchable: true,
  striped: true,
  density: "comfortable",
  rowActions: false,
}

/* ------------------------------ component ------------------------------ */

export interface RowAction<T> {
  label: string
  onSelect: (row: T) => void
}

export interface DataTableProps<T extends Record<string, unknown>> {
  data: T[]
  config: DataTableConfig
  actions?: RowAction<T>[]
  className?: string
}

const alignClass: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
}

function DataTable<T extends Record<string, unknown>>({
  data,
  config,
  actions = [],
  className,
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("")
  const [sort, setSort] = React.useState<{ key: string; dir: 1 | -1 } | null>(
    null
  )

  const pad = config.density === "compact" ? "py-1.5" : "py-3"

  const rows = React.useMemo(() => {
    let r = data
    if (config.searchable && query.trim()) {
      const q = query.toLowerCase()
      r = r.filter((row) =>
        config.columns.some((c) =>
          String(row[c.key] ?? "")
            .toLowerCase()
            .includes(q)
        )
      )
    }
    if (sort) {
      const col = config.columns.find((c) => c.key === sort.key)
      r = [...r].sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        if (col?.type === "number") {
          return (Number(av) - Number(bv)) * sort.dir
        }
        return String(av).localeCompare(String(bv)) * sort.dir
      })
    }
    return r
  }, [data, query, sort, config])

  function toggleSort(key: string) {
    setSort((s) =>
      s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {config.searchable && (
        <div className="relative w-full max-w-xs">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="pl-8"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.columns.map((c) => (
                <TableHead key={c.key} className={alignClass[c.align]}>
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(c.key)}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      {c.header}
                      {sort?.key === c.key ? (
                        sort.dir === 1 ? (
                          <ArrowUp className="size-3.5" />
                        ) : (
                          <ArrowDown className="size-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    c.header
                  )}
                </TableHead>
              ))}
              {config.rowActions && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow
                key={i}
                className={cn(config.striped && i % 2 === 1 && "bg-muted/40")}
              >
                {config.columns.map((c) => (
                  <TableCell
                    key={c.key}
                    className={cn(
                      pad,
                      alignClass[c.align],
                      c.type === "number" && "tabular-nums"
                    )}
                  >
                    {c.type === "badge" ? (
                      <Badge variant="secondary">
                        {String(row[c.key] ?? "")}
                      </Badge>
                    ) : (
                      (row[c.key] as React.ReactNode)
                    )}
                  </TableCell>
                ))}
                {config.rowActions && (
                  <TableCell className={cn(pad, "text-right")}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((a) => (
                          <DropdownMenuItem
                            key={a.label}
                            onSelect={() => a.onSelect(row)}
                          >
                            {a.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={config.columns.length + (config.rowActions ? 1 : 0)}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { DataTable }
