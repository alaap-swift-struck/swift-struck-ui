"use client"

// The gallery's stateful demo widgets — each a small, self-contained component
// that wires a library component to live state, so the composer / overlay /
// stepper / engine are actually interactive in the showcase. Pulled out of
// page.tsx to keep the gallery file focused on composing the catalog. Harness
// only — never shipped to consuming apps.

import * as React from "react"

import { type ScreenRights } from "@swift-struck/ui/lib/recipe"
import {
  AgentChat,
  type AgentChatItem,
} from "@swift-struck/ui/registry/collections/agent-chat/agent-chat"
import { CopilotOverlay } from "@swift-struck/ui/registry/collections/copilot-overlay/copilot-overlay"
import {
  ScreenRenderer,
  type ScreenIntent,
} from "@swift-struck/ui/registry/collections/screen-renderer/screen-renderer"
import {
  TicketThread,
  type TicketStatus,
} from "@swift-struck/ui/registry/collections/ticket-thread/ticket-thread"
import { Breadcrumbs } from "@swift-struck/ui/registry/primitives/breadcrumbs/breadcrumbs"
import { Button } from "@swift-struck/ui/registry/primitives/button/button"
import { ProgressToggle } from "@swift-struck/ui/registry/primitives/progress-toggle/progress-toggle"
import { toast } from "@swift-struck/ui/registry/primitives/sonner/sonner"
import { StatusStepper } from "@swift-struck/ui/registry/primitives/status-stepper/status-stepper"

import {
  agentChatItems,
  copilotSteps,
  memberDetailRecipe,
  memberEditRecipe,
  memberListRecipe,
  roleOptions,
  screenActivity,
  screenMembers,
  statusStages,
  statusTones,
  ticketData,
  ticketMembers,
  ticketReplies,
} from "./_data"

// ScreenEngineDemo — a tiny mini-app driven ENTIRELY by recipes (lib/recipe) +
// the ScreenRenderer engine. A list recipe → click a row → a detail recipe →
// "Edit" → an edit recipe as a responsive overlay. The demo plays the host:
// it owns the (fake) router state, injects data + rights, and maps the engine's
// intents to state. "delete" right is denied, so the Remove action is gated away.
export function ScreenEngineDemo() {
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [editing, setEditing] = React.useState(false)

  const rights: ScreenRights = {
    members: { read: true, create: true, edit: true, delete: false },
  }
  const record = openId ? screenMembers.find((m) => m.id === openId) : undefined

  const crumbs = openId
    ? [
        { label: "Members", href: "#members" },
        { label: record?.name ?? openId, href: "#open" },
      ]
    : [{ label: "Members", href: "#members" }]

  return (
    <div className="flex w-full flex-col gap-3">
      <Breadcrumbs
        items={crumbs}
        collapseAfter={3}
        onNavigate={() => setOpenId(null)}
      />

      {openId ? (
        <ScreenRenderer
          recipe={memberDetailRecipe}
          data={{ record, sets: { activity: screenActivity } }}
          rights={rights}
          onAction={(id, ctx) => {
            if (id === "members.edit") setEditing(true)
            else toast(`${id}`, { description: ctx.id })
          }}
        />
      ) : (
        <ScreenRenderer
          recipe={memberListRecipe}
          data={{ rows: screenMembers }}
          rights={rights}
          onAction={(id, ctx) => toast(`${id}`, { description: ctx.id })}
          onIntent={(i: ScreenIntent) => {
            if (i.kind === "open") setOpenId(i.id)
          }}
        />
      )}

      {editing && record && (
        <ScreenRenderer
          recipe={memberEditRecipe}
          data={{ record, options: { roles: roleOptions } }}
          rights={rights}
          onAction={(id, ctx) => {
            toast("Saved", { description: JSON.stringify(ctx.values) })
            setEditing(false)
          }}
          onIntent={(i: ScreenIntent) => {
            if (i.kind === "close") setEditing(false)
          }}
        />
      )}
    </div>
  )
}

// AgentChat demo — echoes a canned assistant reply so the composer + scroll +
// streaming indicator are all live. Attachments are wired too: the paperclip
// adds picked files as chips above the composer; a chip's remove button drops it.
export function AgentChatDemo() {
  const [items, setItems] = React.useState<AgentChatItem[]>(agentChatItems)
  const [streaming, setStreaming] = React.useState(false)
  const [attachments, setAttachments] = React.useState<{ name: string }[]>([])
  return (
    <AgentChat
      items={items}
      streaming={streaming}
      attachments={attachments}
      onAttachFiles={(files) =>
        setAttachments((s) => [
          ...s,
          ...Array.from(files, (f) => ({ name: f.name })),
        ])
      }
      onRemoveAttachment={(index) =>
        setAttachments((s) => s.filter((_, i) => i !== index))
      }
      onSend={(text) => {
        const userId = String(Date.now())
        setItems((s) => [...s, { id: userId, role: "user", content: text }])
        setStreaming(true)
        const aId = userId + "-a"
        setItems((s) => [...s, { id: aId, role: "assistant", content: "" }])
        setTimeout(() => {
          setItems((s) =>
            s.map((m) =>
              m.id === aId ? { ...m, content: "Got it — working on that." } : m
            )
          )
          setStreaming(false)
        }, 1200)
      }}
    />
  )
}

// CopilotOverlay demo — a Play button activates the floating narration bar; it
// advances steps on a timer; Stop ends it. (It floats over the viewport bottom.)
export function CopilotDemo() {
  const [active, setActive] = React.useState(false)
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => {
    if (!active) return
    if (idx >= copilotSteps.length - 1) return
    const t = setTimeout(() => setIdx((i) => i + 1), 1400)
    return () => clearTimeout(t)
  }, [active, idx])
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-sm text-muted-foreground">
        A non-blocking bar narrates while an agent drives the screen. Press play
        — the rest of the page stays usable; only Stop is interactive.
      </p>
      <Button
        onClick={() => {
          setIdx(0)
          setActive(true)
        }}
        disabled={active}
      >
        Play the agent
      </Button>
      <CopilotOverlay
        active={active}
        steps={copilotSteps}
        currentIndex={idx}
        onStop={() => setActive(false)}
        position="bottom"
      />
    </div>
  )
}

export function ProgressToggleDemo() {
  const [done, setDone] = React.useState(false)
  return <ProgressToggle done={done} onToggle={() => setDone((d) => !d)} />
}

export function StatusStepperDemo() {
  const [status, setStatus] = React.useState("in-progress")
  return (
    <StatusStepper
      stages={statusStages}
      value={status}
      tones={statusTones}
      onChange={setStatus}
    />
  )
}

// The intended pattern: the host drives status with its OWN control (a
// StatusStepper) above the thread, so TicketThread's in-thread dropdown is off.
export function TicketThreadDemo() {
  const [status, setStatus] = React.useState<TicketStatus>(ticketData.status)
  return (
    <div className="flex w-full flex-col gap-4">
      <StatusStepper
        stages={statusStages}
        value={status}
        tones={statusTones}
        onChange={(v) => setStatus(v as TicketStatus)}
      />
      <TicketThread
        ticket={{ ...ticketData, status }}
        replies={ticketReplies}
        members={ticketMembers}
        canResolve={true}
        showStatusControl={false}
        onReply={(body) => toast("Reply sent", { description: body })}
        onMention={(m) => toast(`Mentioned ${m.name}`)}
      />
    </div>
  )
}
