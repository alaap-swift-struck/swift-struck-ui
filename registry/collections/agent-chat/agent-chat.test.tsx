// AgentChat composer — sends the draft via the Send button and on Enter (but not
// Shift+Enter, which inserts a newline). Attachments are opt-in: the paperclip +
// chips row only exist when the host passes the attach props.

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

describe("AgentChat attachments", () => {
  it("renders no paperclip or picker when onAttachFiles is absent", () => {
    const { container } = render(<AgentChat items={[]} onSend={vi.fn()} />)
    expect(screen.queryByRole("button", { name: "Attach files" })).toBeNull()
    expect(container.querySelector('input[type="file"]')).toBeNull()
  })

  it("fires onAttachFiles with the picked files, then resets the picker", () => {
    const onAttachFiles = vi.fn()
    const { container } = render(
      <AgentChat items={[]} onAttachFiles={onAttachFiles} />
    )
    const picker = container.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement
    expect(picker.multiple).toBe(true)
    const file = new File(["a,b"], "people.csv", { type: "text/csv" })
    fireEvent.change(picker, { target: { files: [file] } })
    expect(onAttachFiles).toHaveBeenCalledTimes(1)
    expect(onAttachFiles.mock.calls[0][0][0]).toBe(file)
    // The value resets after each pick so re-picking the same file works.
    expect(picker.value).toBe("")
  })

  it("shows attachment chips and removes by index", () => {
    const onRemoveAttachment = vi.fn()
    render(
      <AgentChat
        items={[]}
        onAttachFiles={vi.fn()}
        attachments={[{ name: "people.csv" }, { name: "notes.txt" }]}
        onRemoveAttachment={onRemoveAttachment}
      />
    )
    expect(screen.getByText("people.csv")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Remove notes.txt" }))
    expect(onRemoveAttachment).toHaveBeenCalledWith(1)
  })

  it("disables the paperclip with the composer", () => {
    render(<AgentChat items={[]} onAttachFiles={vi.fn()} disabled />)
    const clip = screen.getByRole("button", {
      name: "Attach files",
    }) as HTMLButtonElement
    expect(clip.disabled).toBe(true)
  })
})
