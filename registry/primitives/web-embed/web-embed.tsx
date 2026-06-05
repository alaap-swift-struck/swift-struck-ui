// WebEmbed — drops an external page/URL into a framed, responsive iframe
// (a YouTube video, a map, a form, etc.).

import * as React from "react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/registry/primitives/aspect-ratio/aspect-ratio"

export interface WebEmbedProps {
  src: string
  title?: string
  /** Width / height ratio (e.g. 16/9). */
  ratio?: number
  className?: string
}

function WebEmbed({
  src,
  title = "Embedded content",
  ratio = 16 / 9,
  className,
}: WebEmbedProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border", className)}>
      <AspectRatio ratio={ratio}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          className="size-full"
          referrerPolicy="no-referrer"
        />
      </AspectRatio>
    </div>
  )
}

export { WebEmbed }
