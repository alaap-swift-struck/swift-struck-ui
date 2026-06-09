"use client"

// Map — a DATA-BOUND map. You give it records + a MapConfig; it reads each pin's
// location from `config.addressField` (a "lat,lng" string today) and its label
// from `config.captionField`, then centers + zooms on them. Uses OpenStreetMap's
// keyless embed — no dependency, no API key.
//
// LIMITS (declared in config, delivered by a future Leaflet engine): live address
// geocoding, satellite tiles, and true multi-pin clustering. The embed renders a
// single representative marker centered on the records; `cluster`/`visualType`
// are honored once the richer engine lands.

import * as React from "react"

import { type MapConfig } from "../../../lib/config"
import { cn } from "../../../lib/utils"
import { AspectRatio } from "../aspect-ratio/aspect-ratio"

/** Parse "lat,lng" → [lat, lng]; returns null for plain (un-geocoded) addresses. */
function parseLatLng(v: unknown): [number, number] | null {
  if (typeof v !== "string") return null
  const parts = v.split(",").map((s) => Number(s.trim()))
  return parts.length === 2 && parts.every((n) => !Number.isNaN(n))
    ? [parts[0], parts[1]]
    : null
}

function Map<T extends Record<string, unknown>>({
  data = [],
  config,
  ratio = 16 / 9,
  className,
}: {
  data?: T[]
  config: MapConfig
  ratio?: number
  className?: string
}) {
  const points = data
    .map((r) => parseLatLng(r[config.addressField]))
    .filter((p): p is [number, number] => p !== null)

  // Center on the average of all located records (fallback: London).
  const [lat, lng] = points.length
    ? [
        points.reduce((s, p) => s + p[0], 0) / points.length,
        points.reduce((s, p) => s + p[1], 0) / points.length,
      ]
    : [51.505, -0.09]

  const zoom = Math.min(Math.max(config.zoom, 1), 18)
  const span = 0.04 * Math.pow(2, 13 - zoom)
  const bbox = [lng - span, lat - span, lng + span, lat + span].join("%2C")
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`

  return (
    <div className={cn("w-full overflow-hidden rounded-xl border", className)}>
      <AspectRatio ratio={ratio}>
        <iframe
          title="Map"
          src={src}
          loading="lazy"
          className="size-full"
          referrerPolicy="no-referrer"
        />
      </AspectRatio>
    </div>
  )
}

export { Map }
