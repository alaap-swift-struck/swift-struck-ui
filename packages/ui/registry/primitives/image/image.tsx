"use client"

// Image — a framed image locked to an aspect ratio, with a graceful "No image"
// fallback if the source is missing or fails to load.

import * as React from "react"

import { cn } from "../../../lib/utils"
import { AspectRatio } from "../aspect-ratio/aspect-ratio"

export interface ImageProps {
  src: string
  alt?: string
  ratio?: number
  fit?: "cover" | "contain"
  rounded?: boolean
  className?: string
}

function Image({
  src,
  alt = "",
  ratio = 16 / 9,
  fit = "cover",
  rounded = true,
  className,
}: ImageProps) {
  const [error, setError] = React.useState(false)
  return (
    <div
      className={cn(
        "overflow-hidden border bg-muted",
        rounded && "rounded-xl",
        className
      )}
    >
      <AspectRatio ratio={ratio}>
        {error || !src ? (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setError(true)}
            className={cn(
              "size-full",
              fit === "cover" ? "object-cover" : "object-contain"
            )}
          />
        )}
      </AspectRatio>
    </div>
  )
}

export { Image }
