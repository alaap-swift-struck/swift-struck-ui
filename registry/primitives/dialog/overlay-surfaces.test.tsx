// AN OVERLAY IS OPAQUE, ALL OF THEM, FOREVER.
//
// A floating surface — a dialog, a sheet, an alert, a popover, a menu — sits over
// WHATEVER the page happens to be showing. `.glass` is a 72% color-mix, so over a
// plain list nobody notices and over a grid of logo tiles the content behind
// reads straight through the fields. That is not a taste call about frosting: a
// form is for reading, and 28% of somebody else's screen through the middle of it
// is noise on top of every label.
//
// WHY THIS TEST EXISTS RATHER THAN A COMMENT. On 2026-06-18 popover, dropdown,
// hover-card, select and command were each given `bg-popover` with a note saying
// exactly this — and dialog, sheet and alert-dialog were left on `.glass`. The
// reasoning was written down five times and applied to five of eight components,
// which is precisely what a comment cannot prevent and a census can. The host
// then deleted its own compensating override on the belief that the library had
// been fixed, and shipped an unreadable form dialog.
//
// It reads the SOURCE rather than rendering, deliberately: the fault is a missing
// class, and a jsdom render of a Radix portal proves far less than the string.

import { describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(__dirname, "..", "..", "..")

/** Every component whose surface floats over arbitrary page content, and the
 * file it lives in. Adding one here is how a new overlay joins the rule. */
const OVERLAYS: [string, string][] = [
  ["dialog", join("registry", "primitives", "dialog", "dialog.tsx")],
  ["alert-dialog", join("registry", "primitives", "alert-dialog", "alert-dialog.tsx")],
  ["sheet", join("registry", "primitives", "sheet", "sheet.tsx")],
  ["popover", join("registry", "primitives", "popover", "popover.tsx")],
  ["dropdown-menu", join("registry", "primitives", "dropdown-menu", "dropdown-menu.tsx")],
  ["hover-card", join("registry", "primitives", "hover-card", "hover-card.tsx")],
  ["select", join("registry", "primitives", "select", "select.tsx")],
  ["command", join("registry", "primitives", "command", "command.tsx")],
]

describe("every floating surface is opaque", () => {
  for (const [name, file] of OVERLAYS) {
    it(`${name} paints an opaque background, never .glass`, () => {
      const src = readFileSync(join(ROOT, file), "utf8")
      // The class list of the floating panel itself. `.glass` anywhere in a
      // className is the fault; naming it in a COMMENT explaining why it is not
      // used is fine, which is why comments are stripped first.
      const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
      expect(
        /["'`][^"'`]*\bglass\b/.test(code),
        `${name} still uses the translucent .glass surface — a floating panel over arbitrary content must be opaque`
      ).toBe(false)
      expect(
        /\bbg-(card|popover|background)\b/.test(code),
        `${name} sets no opaque background at all, so its surface is whatever is behind it`
      ).toBe(true)
    })
  }

  // …and the utility itself is still translucent, which is what makes the rule
  // above load-bearing. If a future edit makes `.glass` opaque, this fails and
  // whoever did it gets to decide whether the rule is still needed rather than
  // finding out from a screenshot.
  it(".glass is still translucent, so the rule above is still doing work", () => {
    const css = readFileSync(join(ROOT, "styles.css"), "utf8")
    const at = css.indexOf(".glass")
    expect(at, ".glass must exist — a card still uses it deliberately").toBeGreaterThan(-1)
    const rule = css.slice(at, css.indexOf("}", at))
    expect(
      /color-mix\(/.test(rule),
      ".glass is no longer a color-mix — re-read whether floating surfaces still need the rule above"
    ).toBe(true)
  })
})
