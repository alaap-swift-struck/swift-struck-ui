// Video — a framed HTML5 video player with an optional poster and controls.

import * as React from "react"

import { cn } from "@/lib/utils"
import { AspectRatio } from "@/registry/primitives/aspect-ratio/aspect-ratio"

export interface VideoProps {
  src: string
  poster?: string
  ratio?: number
  controls?: boolean
  className?: string
}

function Video({
  src,
  poster,
  ratio = 16 / 9,
  controls = true,
  className,
}: VideoProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-xl border bg-black", className)}
    >
      <AspectRatio ratio={ratio}>
        <video
          src={src}
          poster={poster}
          controls={controls}
          className="size-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}

export { Video }
