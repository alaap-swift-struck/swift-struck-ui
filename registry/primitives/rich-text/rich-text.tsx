"use client"

// RichText — a lightweight rich-text editor (bold / italic / bullet list) with
// a small toolbar. Emits HTML via onChange. Good for notes & descriptions;
// swap in a full editor (e.g. Tiptap) later if you need more.

import * as React from "react"
import { Bold, Italic, List as ListIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Toggle } from "@/registry/primitives/toggle/toggle"

function RichText({
  defaultValue = "",
  onChange,
  placeholder = "Write something…",
  className,
}: {
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const run = (command: string) => {
    document.execCommand(command, false)
    ref.current?.focus()
    onChange?.(ref.current?.innerHTML ?? "")
  }

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex gap-1">
        <Toggle size="sm" aria-label="Bold" onPressedChange={() => run("bold")}>
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          aria-label="Italic"
          onPressedChange={() => run("italic")}
        >
          <Italic />
        </Toggle>
        <Toggle
          size="sm"
          aria-label="Bullet list"
          onPressedChange={() => run("insertUnorderedList")}
        >
          <ListIcon />
        </Toggle>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => onChange?.(ref.current?.innerHTML ?? "")}
        dangerouslySetInnerHTML={{ __html: defaultValue }}
        className="min-h-24 rounded-xl border bg-transparent px-3 py-2 text-sm empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&_ul]:list-disc [&_ul]:pl-5"
      />
    </div>
  )
}

export { RichText }
