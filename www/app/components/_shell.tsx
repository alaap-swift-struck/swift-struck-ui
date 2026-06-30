"use client"

// The gallery's demo-card framework: a per-demo Container + ⚙ editor popover
// (`Demo`), a section header + responsive grid (`Section`), the preset fan-out
// (`VariantGroup`), and the two contexts they read (the live search text and the
// per-demo Container config). Pulled out of page.tsx so the gallery file stays
// focused on composing the catalog. Harness only — never shipped to apps.

import * as React from "react"
import { Settings2 } from "lucide-react"

import {
  defaultContainerConfig,
  type ContainerConfig,
} from "@swift-struck/ui/lib/config"
import { cn } from "@swift-struck/ui/lib/utils"
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
import { Container } from "@swift-struck/ui/registry/primitives/container/container"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@swift-struck/ui/registry/primitives/popover/popover"

import { ConfigEditor, JsonField } from "./_playground/config-editor"

// The current search text, shared so each Demo can hide itself when filtered.
export const SearchCtx = React.createContext("")

// Per-demo Container config (background + stacking), keyed by demo name. Every
// demo wraps its children in a <Container>, so its ⚙ can switch the background
// (none/card/dark/light/image) and lay components horizontally vs vertically.
export const ContainersCtx = React.createContext<{
  get: (key: string) => Record<string, unknown>
  set: (key: string, next: Record<string, unknown>) => void
}>({
  get: () =>
    ({ ...defaultContainerConfig }) as unknown as Record<string, unknown>,
  set: () => {},
})

export const containerEnums = {
  background: ["none", "card", "dark", "light", "image"],
  direction: ["vertical", "horizontal"],
  padding: ["none", "sm", "md", "lg"],
  gap: ["none", "sm", "md", "lg"],
}

export function Demo({
  name,
  children,
  config,
  setConfig,
  enums,
  data,
  setData,
  span = 1,
}: {
  name: string
  children: React.ReactNode
  // When provided, a "Config" section is added to the ⚙ to live-edit it.
  config?: Record<string, unknown>
  setConfig?: (next: Record<string, unknown>) => void
  enums?: Record<string, string[]>
  // Optional: also expose the component's data (its content) as editable JSON.
  data?: unknown
  setData?: (next: unknown) => void
  // How many grid columns this card spans (1–3). Big demos use 2–3.
  span?: 1 | 2 | 3
}) {
  const query = React.useContext(SearchCtx)
  const containers = React.useContext(ContainersCtx)
  if (query && !name.toLowerCase().includes(query.toLowerCase())) return null

  const container = containers.get(name)
  const hasConfig = Boolean(config && setConfig)
  const hasData = Boolean(data !== undefined && setData)
  const spanClass =
    span === 3
      ? "sm:col-span-2 lg:col-span-3"
      : span === 2
        ? "sm:col-span-2"
        : ""

  return (
    <div className={cn("flex min-w-0 flex-col gap-2", spanClass)}>
      {/* the component's name sits OUTSIDE/above its container */}
      <div className="flex items-center justify-between gap-2 px-1">
        <span className="text-sm font-medium">{name}</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={`Edit ${name}`}
            >
              <Settings2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="max-h-[55vh] overflow-y-auto p-3">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Container · background &amp; layout
                  </p>
                  <ConfigEditor
                    config={container}
                    onChange={(n) => containers.set(name, n)}
                    enums={containerEnums}
                  />
                </div>
                {hasConfig && (
                  <div className="flex flex-col gap-3 border-t pt-4">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Config · live
                    </p>
                    <ConfigEditor
                      config={config!}
                      onChange={setConfig!}
                      enums={enums}
                    />
                  </div>
                )}
                {hasData && (
                  <div className="flex flex-col gap-2 border-t pt-4">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Data · live
                    </p>
                    <JsonField value={data} onCommit={(v) => setData!(v)} />
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Container
        config={container as unknown as ContainerConfig}
        className="min-h-20"
      >
        {children}
      </Container>
    </div>
  )
}

// A section header + a responsive grid of demo cards.
export function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="animate-rise flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {title}
        </h2>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  )
}

// VariantGroup — renders one demo card PER preset, each with its own ⚙ gear,
// all reading/writing a shared keyed config store. This is how we show "the top
// few configurations of a component, side by side, each editable" without
// hand-writing a state hook per card.
export function VariantGroup({
  items,
  configs,
  onChange,
  enums,
  render,
}: {
  items: { id: string; name: string; span?: 1 | 2 | 3 }[]
  configs: Record<string, Record<string, unknown>>
  onChange: (id: string, next: Record<string, unknown>) => void
  enums?: Record<string, string[]>
  render: (cfg: Record<string, unknown>, id: string) => React.ReactNode
}) {
  return (
    <>
      {items.map(({ id, name, span }) => (
        <Demo
          key={id}
          name={name}
          span={span}
          config={configs[id]}
          setConfig={(next) => onChange(id, next)}
          enums={enums}
        >
          {render(configs[id], id)}
        </Demo>
      ))}
    </>
  )
}
