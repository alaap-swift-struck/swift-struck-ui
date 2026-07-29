// Field — the required-ring must match the SHAPE of what it wraps. A ring is
// right around one rectangular input; around a gap-separated group of pills it
// draws a gold rectangle enclosing the gaps, which is why `shape` exists.

import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { defaultFieldConfig, type FieldConfig } from "../../../lib/config"
import { Field } from "./field"

const cfg = (over: Partial<FieldConfig> = {}): FieldConfig => ({
  ...defaultFieldConfig,
  ...over,
})

const ring = (c: HTMLElement) => c.querySelector(".required-ring")

describe("Field required-ring shape", () => {
  it("input (default): a required field is ringed — unchanged behaviour", () => {
    const { container } = render(
      <Field config={cfg({ required: true, label: "Name" })}>
        <input />
      </Field>
    )
    expect(ring(container)).toBeTruthy()
  })

  it("input: no ring when the field isn't required", () => {
    const { container } = render(
      <Field config={cfg({ required: false })}>
        <input />
      </Field>
    )
    expect(ring(container)).toBeNull()
  })

  it("pill: rings, but publishes its own corner radius", () => {
    const { container } = render(
      <Field config={cfg({ required: true })} shape="pill">
        <button>Pill</button>
      </Field>
    )
    const el = ring(container) as HTMLElement
    expect(el).toBeTruthy()
    // --ss-ring-radius overrides the rectangle default in styles.css, so the
    // ring hugs the pill instead of boxing it.
    expect(el.style.getPropertyValue("--ss-ring-radius")).toBe("9999px")
  })

  it("group: NO ring — a gold rectangle would enclose the gaps", () => {
    const { container } = render(
      <Field config={cfg({ required: true, label: "Tags" })} shape="group">
        <div>
          <button>A</button>
          <button>B</button>
        </div>
      </Field>
    )
    expect(ring(container)).toBeNull()
    // the required marker still reads, on the label side
    expect(container.textContent).toContain("*")
  })

  it("ringed={false} still wins (composite controls draw their own)", () => {
    const { container } = render(
      <Field config={cfg({ required: true })} ringed={false}>
        <input />
      </Field>
    )
    expect(ring(container)).toBeNull()
  })
})
