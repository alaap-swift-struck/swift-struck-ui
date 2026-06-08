"use client"

/* ===========================================================================
 * ConfigEditor — a PLAYGROUND-ONLY live editor for a component's `config`.
 *
 * This is a developer toy for the showcase, NOT part of the library — it lets
 * you fiddle with a config and watch the component update. It reflects EVERY
 * key in the config (keys are fixed/read-only) and picks a control by value:
 *   • enum field (you pass options)  → Choice pills
 *   • true / false                   → Switch
 *   • number                         → number input
 *   • string (incl. colors)          → free-text input
 *   • array / object                 → editable JSON box
 * Lives under app/components/_playground/ (the leading "_" keeps Next.js from
 * treating it as a route).
 * ======================================================================== */

import * as React from "react"

import { cn } from "@swift-struck/ui/lib/utils"
import {
  Choice,
  defaultChoiceConfig,
} from "@swift-struck/ui/registry/primitives/choice/choice"
import { Input } from "@swift-struck/ui/registry/primitives/input/input"
import { Label } from "@swift-struck/ui/registry/primitives/label/label"
import { Switch } from "@swift-struck/ui/registry/primitives/switch/switch"
import { Textarea } from "@swift-struck/ui/registry/primitives/textarea/textarea"

export interface ConfigEditorProps {
  config: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  /** Map a field name to its allowed values, e.g. { mode: ["single","multi"] }. */
  enums?: Record<string, string[]>
}

// An editable JSON box for array/object fields. Keeps its own draft text so you
// can type invalid JSON mid-edit; it only commits once the text parses.
function JsonField({
  value,
  onCommit,
}: {
  value: unknown
  onCommit: (v: unknown) => void
}) {
  const [text, setText] = React.useState(() => JSON.stringify(value, null, 2))
  const [valid, setValid] = React.useState(true)
  return (
    <Textarea
      rows={6}
      spellCheck={false}
      value={text}
      onChange={(e) => {
        const t = e.target.value
        setText(t)
        try {
          onCommit(JSON.parse(t))
          setValid(true)
        } catch {
          setValid(false)
        }
      }}
      className={cn(
        "font-mono text-xs",
        !valid && "border-destructive focus-visible:ring-destructive"
      )}
    />
  )
}

function ConfigEditor({ config, onChange, enums = {} }: ConfigEditorProps) {
  const set = (key: string, val: unknown) => onChange({ ...config, [key]: val })

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(config).map(([key, val]) => {
        const id = `cfg-${key}`
        const isBool = typeof val === "boolean"

        let control: React.ReactNode
        if (enums[key]) {
          control = (
            <Choice
              options={enums[key].map((o) => ({ label: o, value: o }))}
              value={[String(val)]}
              onChange={(v) => v[0] && set(key, v[0])}
              config={{
                ...defaultChoiceConfig,
                mode: "single",
                display: "pills",
                searchable: false,
                clearable: false,
              }}
            />
          )
        } else if (isBool) {
          control = (
            <Switch
              id={id}
              checked={val}
              onCheckedChange={(c) => set(key, c)}
            />
          )
        } else if (typeof val === "number") {
          control = (
            <Input
              id={id}
              type="number"
              value={val}
              onChange={(e) =>
                set(key, e.target.value === "" ? 0 : Number(e.target.value))
              }
            />
          )
        } else if (val === null || typeof val === "string") {
          control = (
            <Input
              id={id}
              value={val ?? ""}
              placeholder={val === null ? "(null)" : ""}
              onChange={(e) => {
                const t = e.target.value
                // empty restores null for nullable fields, else a plain string
                set(key, t === "" && val === null ? null : t)
              }}
            />
          )
        } else {
          control = <JsonField value={val} onCommit={(v) => set(key, v)} />
        }

        return (
          <div
            key={key}
            className={cn(
              "flex gap-3",
              isBool ? "items-center justify-between" : "flex-col"
            )}
          >
            <Label htmlFor={id} className="font-mono text-xs text-foreground">
              {key}
            </Label>
            {control}
          </div>
        )
      })}
    </div>
  )
}

export { ConfigEditor, JsonField }
