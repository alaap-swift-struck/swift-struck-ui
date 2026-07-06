// AgentChat composer — sends the draft via the Send button and on Enter (but not
// Shift+Enter, which inserts a newline).

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { AgentChat } from "./agent-chat"

describe("AgentChat composer", () => {
  it("sends the draft via the Send button", () => {
    const onSend = vi.fn()
    render(<AgentChat items={[]} onSend={onSend} />)
    fireEvent.change(screen.getByRole("textbox", { name: "Message" }), {
      target: { value: "hello" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Send" }))
    expect(onSend).toHaveBeenCalledWith("hello")
  })

  it("sends on Enter but not Shift+Enter", () => {
    const onSend = vi.fn()
    render(<AgentChat items={[]} onSend={onSend} />)
    const box = screen.getByRole("textbox", { name: "Message" })
    fireEvent.change(box, { target: { value: "hi" } })
    fireEvent.keyDown(box, { key: "Enter", shiftKey: true })
    expect(onSend).not.toHaveBeenCalled()
    fireEvent.keyDown(box, { key: "Enter" })
    expect(onSend).toHaveBeenCalledWith("hi")
  })
})
