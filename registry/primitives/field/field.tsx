"use client"

// Field — the one wrapper that frames ANY input. Driven by FieldConfig, it
// renders the label (with a red asterisk when required), the animated teal
// required-ring, the help text, and a validation message — so every input gets
// the same config-driven frame without each one repeating the logic.
//
//   <Field config={cfg} htmlFor="email" error={err}>
//     <Input id="email" {...fieldProps(cfg)} />
//   </Field>
//
// `fieldProps(config)` turns the config's validation into native HTML attributes
// to spread onto an <input>/<textarea>; `validateField` (lib/config) gives you a
// human-readable message to pass as `error`. The field self-hides via its
// visibility rules.

import * as React from "react"

import { type FieldConfig } from "@/lib/config"
import { cn } from "@/lib/utils"
import { Label } from "@/registry/primitives/label/label"
import { useIsVisible } from "@/registry/primitives/visibility/visibility"

function Field({
  config,
  htmlFor,
  error,
  className,
  children,
}: {
  config: FieldConfig
  /** id of the input inside — wires the label's `htmlFor`. */
  htmlFor?: string
  /** validation message to show (overrides helpText while present). */
  error?: string
  className?: string
  children: React.ReactNode
}) {
  if (!useIsVisible(config)) return null

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {config.label && (
        <Label htmlFor={htmlFor}>
          {config.label}
          {config.required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      {/* required inputs get the slow teal ring (see globals.css .required-ring) */}
      <div className={cn(config.required && "required-ring")}>{children}</div>
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : config.helpText ? (
        <p className="text-xs text-muted-foreground">{config.helpText}</p>
      ) : null}
    </div>
  )
}

/** Map a FieldConfig to native HTML validation attributes. Spread onto the input
 * inside a Field; the browser ignores attributes that don't apply to its type
 * (e.g. min/max on a text input). */
function fieldProps(config: FieldConfig) {
  const v = config.validation
  return {
    required: config.required || undefined,
    disabled: config.disabled || undefined,
    min: v.min ?? undefined,
    max: v.max ?? undefined,
    minLength: v.minLength ?? undefined,
    maxLength: v.maxLength ?? undefined,
    pattern: v.pattern || undefined,
  }
}

export { Field, fieldProps }
