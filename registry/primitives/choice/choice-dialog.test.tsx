// Choice inside a Dialog — the scroll-lock trap.
//
// A Choice dropdown is portaled to <body>, so when it opens inside a Dialog it
// lands OUTSIDE the dialog's DOM subtree. The dialog's scroll lock
// (react-remove-scroll) preventDefaults wheel/touchmove on everything outside
// that subtree, which now includes the open list: typing filters fine, but the
// list won't scroll. `modal` hands the popover its own scroll lock so its
// content is scrollable again.

import { fireEvent, render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Dialog, DialogContent } from "../dialog/dialog"
import { Choice, defaultChoiceConfig } from "./choice"

// enough options that the list must scroll
const options = Array.from({ length: 40 }, (_, i) => ({
  value: `c${i}`,
  label: `Currency ${i}`,
}))

function ChoiceInDialog({ modal }: { modal?: boolean }) {
  return (
    <Dialog open>
      <DialogContent>
        <Choice
          options={options}
          value={[]}
          onChange={() => {}}
          modal={modal}
          config={{ ...defaultChoiceConfig, searchable: true }}
        />
      </DialogContent>
    </Dialog>
  )
}

describe("Choice inside a Dialog", () => {
  it("opens its list and still filters by typing", () => {
    render(<ChoiceInDialog modal />)
    fireEvent.click(screen.getByRole("combobox"))
    const input = screen.getByPlaceholderText("Search…")
    fireEvent.change(input, { target: { value: "Currency 7" } })
    // "Currency 7" + "Currency 7x" variants — at minimum the exact one is there
    expect(screen.getByText("Currency 7")).toBeTruthy()
    expect(screen.queryByText("Currency 1")).toBeNull()
  })

  // NOTE ON SCOPE: jsdom has no layout — an open list reports
  // scrollHeight/clientHeight of 0/0, so react-remove-scroll treats it as
  // unscrollable and preventDefaults wheel events in BOTH modes. A "wheel is
  // not prevented" assertion would therefore pass or fail for reasons unrelated
  // to this fix. So jsdom asserts the WIRING (does `modal` reach Radix), and the
  // actual scrolling is verified in a real browser on staging.
  it("modal: the popover takes over modal behaviour (owns its own scroll lock)", () => {
    render(<ChoiceInDialog modal />)
    fireEvent.click(screen.getByRole("combobox"))

    const listbox = document.querySelector("[cmdk-list]") as HTMLElement
    expect(listbox).toBeTruthy()
    // the scroll container itself
    expect(listbox.className).toMatch(/overflow-y-auto/)
    // Radix only neutralises outside pointer events for a MODAL popover — the
    // observable proof that `modal` reached Root rather than being dropped.
    expect(document.body.style.pointerEvents).toBe("none")
  })

  it("renders every option inside the dialog (no clipping of the list)", () => {
    render(<ChoiceInDialog modal />)
    fireEvent.click(screen.getByRole("combobox"))
    const listbox = document.querySelector("[cmdk-list]") as HTMLElement
    expect(within(listbox).getAllByRole("option").length).toBe(options.length)
  })

  it("defaults to non-modal so a filter row in a normal page is unaffected", () => {
    // No dialog here — a plain page. The default must stay non-modal, or every
    // in-page control would trap focus and block click-through to the next one.
    // (Inside a Dialog this assertion can't discriminate: the dialog itself sets
    // pointer-events:none, which is why the guard lives on the no-dialog case.)
    render(
      <Choice
        options={options}
        value={[]}
        onChange={() => {}}
        config={{ ...defaultChoiceConfig }}
      />
    )
    fireEvent.click(screen.getByRole("combobox"))
    expect(document.querySelector("[cmdk-list]")).toBeTruthy()
    expect(document.body.style.pointerEvents).not.toBe("none")
  })
})
