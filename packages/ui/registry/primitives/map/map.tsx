// Map — an embedded OpenStreetMap centred on a latitude/longitude, with a
// marker. No API key and no dependency (uses OSM's public embed).

import * as React from "react"

import { cn } from "../../../lib/utils"
import { AspectRatio } from "../aspect-ratio/aspect-ratio"

export interface MapProps {
  lat: number
  lng: number
  /** 1 (world) – 18 (street). */
  zoom?: number
  ratio?: number
  className?: string
}

function Map({ lat, lng, zoom = 13, ratio = 16 / 9, className }: MapProps) {
  // Rough bounding box from a zoom level (smaller span = more zoomed in).
  const span = 0.04 * Math.pow(2, 13 - Math.min(Math.max(zoom, 1), 18))
  const bbox = [lng - span, lat - span, lng + span, lat + span].join("%2C")
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
  return (
    <div className={cn("overflow-hidden rounded-xl border", className)}>
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
