// Clearing ONE active facet — across ALL FOUR control types.
//
// THE BUG THIS GUARDS (v0.9.0): the ✕ on range + searchable facets was a bare
// <X> svg nested inside the trigger <Button>. Button's base class carries
// `[&_svg]:pointer-events-none`, so the browser hit-tested straight through to
// the Button and Radix opened the popover — the user had to unselect values one
// by one. The X's own preventDefault/stopPropagation never ran at all.
//
// WHY THESE ASSERTIONS ARE STRUCTURAL, NOT CLICK-BASED: jsdom applies no
// stylesheet and does no hit-testing, so `pointer-events-none` has no effect
// there and `fireEvent.click` on the old nested <X> WOULD have fired its
// handler. A click test would therefore pass against the broken code and prove
// nothing. What genuinely distinguishes fixed from broken is the STRUCTURE: the
// clear affordance must be a real, accessible-named, focusable <button> that is
// NOT a descendant of the trigger. The old <X> was aria-hidden, unfocusable and
// nameless, so `getByRole("button", { name: /Clear …/ })` cannot find it.
//
// It covers all four control types because filter-bar auto-promotes any facet
// past SEARCHABLE_THRESHOLD into the searchable path — a host facet that merely
// GROWS migrates between control implementations without the host changing a
// line, so every path has to behave the same.

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { type FilterFacet } from "../../../lib/config"
import { FilterBar } from "./filter-bar"

const data = [
  { status: "active", size: 5 },
  { status: "away", size: 9 },
]

const renderBar = (facet: FilterFacet, values: Record<string, string>) => {
  const onChange = vi.fn()
  const onClearAll = vi.fn()
  render(
    <FilterBar
      facets={[facet]}
      values={values}
      data={data}
      onChange={onChange}
      onClearAll={onClearAll}
      canClear={Object.keys(values).length > 0}
    />
  )
  return { onChange, onClearAll }
}

// value that marks each control type as "active"
const CASES: { name: string; facet: FilterFacet; active: string }[] = [
  {
    name: 'control:"select" (plain dropdown)',
    facet: {
      field: "status",
      label: "Status",
      control: "select",
      options: [{ value: "active", label: "Active" }],
    },
    active: "active",
  },
  {
    name: 'control:"select" + searchable (combobox)',
    facet: {
      field: "status",
      label: "Status",
      control: "select",
      searchable: true,
      options: [{ value: "active", label: "Active" }],
    },
    active: "active",
  },
  {
    name: 'control:"select" auto-promoted past SEARCHABLE_THRESHOLD',
    facet: {
      field: "status",
      label: "Status",
      control: "select",
      // >8 options ⇒ filter-bar promotes this into the searchable path itself
      options: Array.from({ length: 12 }, (_, i) => ({
        value: `v${i}`,
        label: `Value ${i}`,
      })),
    },
    active: "v3",
  },
  {
    name: 'control:"range"',
    facet: { field: "size", label: "Size", control: "range" },
    active: "2..8",
  },
]

describe("FilterBar — per-facet clear works on every control type", () => {
  for (const c of CASES) {
    it(`${c.name}: exposes a real, named clear button when active`, () => {
      renderBar(c.facet, { [c.facet.field]: c.active })
      // Fails on the broken build: the old ✕ was an aria-hidden <svg> with no
      // role and no accessible name.
      const clear = screen.getByRole("button", {
        name: `Clear ${c.facet.label}`,
      })
      expect(clear.tagName).toBe("BUTTON")
    })

    it(`${c.name}: the clear button is NOT inside the trigger`, () => {
      renderBar(c.facet, { [c.facet.field]: c.active })
      const clear = screen.getByRole("button", {
        name: `Clear ${c.facet.label}`,
      })
      // Nested inside the trigger is exactly what made it unclickable.
      const trigger = screen.queryByRole("combobox", { name: c.facet.label })
      if (trigger) expect(trigger.contains(clear)).toBe(false)
      expect(clear.closest("[data-slot=popover-trigger]")).toBeNull()
    })

    it(`${c.name}: clearing reports ("${c.facet.field}", "") — a one-action reset`, () => {
      const { onChange, onClearAll } = renderBar(c.facet, {
        [c.facet.field]: c.active,
      })
      fireEvent.click(
        screen.getByRole("button", { name: `Clear ${c.facet.label}` })
      )
      // the host deletes the key on "" (see CollectionFrame.setFacet)
      expect(onChange).toHaveBeenCalledWith(c.facet.field, "")
      // clearing ONE facet must never nuke the others
      expect(onClearAll).not.toHaveBeenCalled()
    })

    it(`${c.name}: no clear button while the facet is inactive`, () => {
      renderBar(c.facet, {})
      expect(
        screen.queryByRole("button", { name: `Clear ${c.facet.label}` })
      ).toBeNull()
    })
  }

  // chips are their own affordance: the active chip toggles itself off
  it('control:"chips": clicking the active chip clears it', () => {
    const chips: FilterFacet = {
      field: "status",
      label: "Status",
      control: "chips",
      options: [
        { value: "active", label: "Active" },
        { value: "away", label: "Away" },
      ],
    }
    const { onChange } = renderBar(chips, { status: "active" })
    const chip = screen.getByRole("button", { name: "Status: Active" })
    expect(chip.getAttribute("aria-pressed")).toBe("true")
    fireEvent.click(chip)
    expect(onChange).toHaveBeenCalledWith("status", "")
  })

  it("every clear control is keyboard-reachable (not an aria-hidden svg)", () => {
    // The old ✕ had no focus stop at all — this is the accessibility half of
    // the same bug.
    for (const c of CASES) {
      const { unmount } = render(
        <FilterBar
          facets={[c.facet]}
          values={{ [c.facet.field]: c.active }}
          data={data}
          onChange={() => {}}
          onClearAll={() => {}}
          canClear
        />
      )
      const clear = screen.getByRole("button", {
        name: `Clear ${c.facet.label}`,
      })
      expect(clear.getAttribute("aria-hidden")).toBeNull()
      clear.focus()
      expect(document.activeElement).toBe(clear)
      unmount()
    }
  })
})
