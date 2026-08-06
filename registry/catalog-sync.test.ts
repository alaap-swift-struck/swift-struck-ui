// registry.json ↔ docs catalog — drift guard.
//
// The docs catalog (www/app/documentation) is hand-written prose: a plain-English
// blurb and a category per component. That prose is worth keeping by hand, but it
// silently fell 6 entries behind registry.json — Select, Toggle, Toggle Group,
// Command, Stopwatch and Table were all demoed in the gallery yet unfindable from
// docs search. Nothing failed; the two lists just drifted.
//
// So the catalog stays hand-written and THIS test makes drift impossible: every
// registry entry must either appear in the catalog or be listed below with a
// reason. Adding a component to registry.json now fails CI until it is either
// documented or explicitly declared undocumented-on-purpose.
//
// Parsed as TEXT rather than imported: the catalog lives in a Next.js client
// component, and importing it here would drag Next into the unit-test run.

import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const root = join(__dirname, "..")

/** Registry entries with NO catalog entry, on purpose. */
const NOT_IN_CATALOG: Record<string, string> = {
  // Internal runtime/helpers — not something a user drops on a screen.
  visibility:
    "runtime for config-driven show/hide (useIsVisible), not a UI part",
  "use-debounce": "shared hook (useDebouncedCallback), not a UI part",
  label: "form label used *inside* Field; never placed on its own",
  sonner: "the toast host; documented as the 'Toast' entry",
}

/** Registry name → the catalog name it is documented under. */
const RENAMED_IN_CATALOG: Record<string, string> = {
  "calendar-view": "Calendar",
  "detail-view": "Detail View (Fields)",
  "stat-grid": "Stat Grid (Big Numbers)",
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

function registryNames(): string[] {
  const raw = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"))
  const items = raw.items ?? raw.registry ?? []
  return items.map((i: { name: string }) => i.name)
}

function catalogNames(): string[] {
  const src = readFileSync(join(root, "www/app/documentation/page.tsx"), "utf8")
  const start = src.indexOf("const CATALOG")
  const end = src.indexOf("\n]", start)
  expect(start, "CATALOG array not found in the docs page").toBeGreaterThan(-1)
  return [...src.slice(start, end).matchAll(/name:\s*"([^"]+)"/g)].map(
    (m) => m[1]
  )
}

describe("docs catalog covers registry.json", () => {
  it("every registry component is documented (or declared exempt)", () => {
    const cat = new Set(catalogNames().map(norm))
    const undocumented = registryNames().filter((n) => {
      if (n in NOT_IN_CATALOG) return false
      const renamed = RENAMED_IN_CATALOG[n]
      return !cat.has(norm(renamed ?? n))
    })
    expect(
      undocumented,
      `These registry entries have no docs-catalog entry. Add one in ` +
        `www/app/documentation/page.tsx, or declare it in NOT_IN_CATALOG / ` +
        `RENAMED_IN_CATALOG in this test with a reason.`
    ).toEqual([])
  })

  it("the exemption lists stay honest (no stale entries)", () => {
    // If a component is deleted or later documented, its exemption must go —
    // otherwise the allow-list quietly grows into a place drift can hide.
    const reg = new Set(registryNames())
    const cat = new Set(catalogNames().map(norm))

    for (const name of Object.keys(NOT_IN_CATALOG)) {
      expect(
        reg.has(name),
        `NOT_IN_CATALOG lists "${name}", which is not in registry.json`
      ).toBe(true)
    }
    for (const [name, as] of Object.entries(RENAMED_IN_CATALOG)) {
      expect(
        reg.has(name),
        `RENAMED_IN_CATALOG lists "${name}", which is not in registry.json`
      ).toBe(true)
      expect(
        cat.has(norm(as)),
        `RENAMED_IN_CATALOG maps "${name}" → "${as}", but the catalog has no "${as}"`
      ).toBe(true)
    }
  })

  it("the catalog has no duplicate names", () => {
    const names = catalogNames()
    const dupes = names.filter((n, i) => names.indexOf(n) !== i)
    expect(dupes).toEqual([])
  })
})
