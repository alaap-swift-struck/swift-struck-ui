// Component tests for TicketThread's showStatusControl toggle — the in-thread
// status dropdown can be hidden while the status Badge stays. Run: `npm test`.

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { TicketThread, type Ticket } from "./ticket-thread"

const ticket: Ticket = {
  description: "The export button does nothing on mobile.",
  type: "Bug",
  status: "in-progress",
}

describe("TicketThread - showStatusControl", () => {
  it("shows the in-thread status dropdown by default", () => {
    const { container } = render(
      <TicketThread ticket={ticket} replies={[]} members={[]} canResolve />
    )
    expect(container.querySelector('[aria-label="Ticket status"]')).toBeTruthy()
  })

  it("hides the dropdown when showStatusControl is false, keeping the status badge", () => {
    const { container } = render(
      <TicketThread
        ticket={ticket}
        replies={[]}
        members={[]}
        canResolve
        showStatusControl={false}
      />
    )
    expect(container.querySelector('[aria-label="Ticket status"]')).toBeNull()
    // The status is still visible as a badge.
    expect(screen.getByText("In progress")).toBeTruthy()
  })
})
