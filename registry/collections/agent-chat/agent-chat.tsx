"use client"

// AgentChat — the conversation surface for an agent: a scrollable message list
// with three row types (user · assistant · tool-action) plus a composer. Tool
// rows render as a compact "did X" line with a status dot and optional view/undo
// links. Stream-friendly (content can grow; a typing indicator shows on the last
// assistant row while `streaming`). Flat, token-driven, dark-mode.

import * as React from "react"
import { Eye, RotateCcw, Send } from "lucide-react"

import { cn } from "../../../lib/utils"
import { Button } from "../../primitives/button/button"
import { Textarea } from "../../primitives/textarea/textarea"

export type AgentChatRole = "user" | "assistant" | "tool"
export type ToolStatus = "pending" | "done" | "failed"

export interface AgentChatItem {
  id: string
  role: AgentChatRole
  /** Message body (user/assistant). Can grow while streaming. */
  content?: React.ReactNode
  /** Tool rows: the "did X" label, a status, and an optional summary. */
  actionLabel?: string
  status?: ToolStatus
  summary?: React.ReactNode
  onView?: () => void
  onUndo?: () => void
}

const statusDot: Record<ToolStatus, string> = {
  pending: "bg-warning",
  done: "bg-success",
  failed: "bg-destructive",
}
const statusLabel: Record<ToolStatus, string> = {
  pending: "in progress",
  done: "done",
  failed: "failed",
}

function TypingIndicator() {
  return (
    <span
      className="inline-flex items-center gap-1 py-1"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="ss-typing size-1.5 rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function ToolRow({ item }: { item: AgentChatItem }) {
  const status = item.status ?? "done"
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/40 px-3 py-2 text-sm">
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-1.5 size-2 shrink-0 rounded-full",
            statusDot[status]
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1 font-medium break-words">
          {item.actionLabel}
        </span>
        <span className="mt-px shrink-0 text-xs text-muted-foreground">
          {statusLabel[status]}
        </span>
      </div>
      {item.summary != null && (
        <p className="pl-4 text-xs break-words text-muted-foreground">
          {item.summary}
        </p>
      )}
      {(item.onView || item.onUndo) && (
        <div className="flex gap-3 pl-4 text-xs">
          {item.onView && (
            <button
              type="button"
              onClick={item.onView}
              className="inline-flex items-center gap-1 text-primary transition-colors outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Eye className="size-3.5" aria-hidden /> View
            </button>
          )}
          {item.onUndo && (
            <button
              type="button"
              onClick={item.onUndo}
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw className="size-3.5" aria-hidden /> Undo
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function AgentChat({
  items,
  streaming = false,
  disabled = false,
  emptyState,
  onSend,
  className,
}: {
  items: AgentChatItem[]
  /** Show a typing indicator on the last assistant row. */
  streaming?: boolean
  disabled?: boolean
  emptyState?: React.ReactNode
  onSend?: (text: string) => void
  className?: string
}) {
  const [draft, setDraft] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  // Keep the newest row in view as the conversation grows / streams.
  React.useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [items, streaming])

  const lastAssistantId = [...items]
    .reverse()
    .find((m) => m.role === "assistant")?.id

  function send() {
    if (!draft.trim() || disabled) return
    onSend?.(draft.trim())
    setDraft("")
    // Shrink the composer back to its one-row minimum after sending.
    if (inputRef.current) inputRef.current.style.height = "auto"
  }

  return (
    <div
      className={cn(
        "flex h-[28rem] w-full flex-col overflow-hidden rounded-xl border bg-card",
        className
      )}
    >
      <div ref={listRef} className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
            {emptyState ?? "Ask the assistant to get started."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              if (item.role === "tool") {
                return <ToolRow key={item.id} item={item} />
              }
              const isUser = item.role === "user"
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex",
                    isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm break-words",
                      isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {item.content}
                    {streaming &&
                      !isUser &&
                      item.id === lastAssistantId &&
                      (item.content ? (
                        <span className="ml-1 inline-block align-middle">
                          <TypingIndicator />
                        </span>
                      ) : (
                        <TypingIndicator />
                      ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-end gap-2 border-t p-3">
        <Textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onInput={(e) => {
            // Auto-grow to fit typed lines up to the max-h-32 cap, then scroll.
            const el = e.currentTarget
            el.style.height = "auto"
            el.style.height = `${el.scrollHeight}px`
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Message the assistant…"
          disabled={disabled}
          rows={1}
          className="max-h-32 min-h-9 flex-1 resize-none overflow-y-auto"
          aria-label="Message"
        />
        <Button
          type="button"
          size="icon"
          onClick={send}
          disabled={disabled || !draft.trim()}
          aria-label="Send"
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

export { AgentChat }
