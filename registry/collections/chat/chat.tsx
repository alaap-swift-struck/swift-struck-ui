"use client"

// Chat — a message thread with "me" bubbles (right, brand) vs "them" (left,
// muted) and a send box. Hand it messages + onSend.

import * as React from "react"
import { Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/primitives/button/button"
import { Input } from "@/registry/primitives/input/input"

export interface ChatMessage {
  id: string
  from: "me" | "them"
  text: string
  time: string
}

function Chat({
  messages,
  onSend,
  className,
}: {
  messages: ChatMessage[]
  onSend?: (text: string) => void
  className?: string
}) {
  const [draft, setDraft] = React.useState("")
  function send() {
    if (!draft.trim()) return
    onSend?.(draft)
    setDraft("")
  }
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex flex-col gap-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex",
              m.from === "me" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                m.from === "me"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {m.text}
              <div
                className={cn(
                  "mt-0.5 text-[10px]",
                  m.from === "me"
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
        className="flex gap-2"
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message…"
        />
        <Button type="submit" size="icon" aria-label="Send">
          <Send />
        </Button>
      </form>
    </div>
  )
}

export { Chat }
