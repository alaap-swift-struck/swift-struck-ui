// Next config for the showcase harness. `externalDir` compiles the repo-root
// library as source (no build step between editing a component and seeing it),
// and BUILD_STATIC switches on the static export that Cloudflare Pages serves.

import type { NextConfig } from "next"

// BUILD_STATIC=1 switches on Next's static export (a plain `out/` folder) for
// Cloudflare Pages + the future Tauri/Capacitor shells. Left OFF in dev so the
// docs harness keeps the full Next.js dev server.
const staticExport = process.env.BUILD_STATIC
  ? { output: "export" as const, images: { unoptimized: true } }
  : {}

const nextConfig: NextConfig = {
  // The library lives one level up (the repo root) and is pulled in as TS source
  // via the `@swift-struck/ui/*` tsconfig paths. externalDir lets Next compile
  // files that sit outside this app folder.
  experimental: { externalDir: true },
  ...staticExport,
}

export default nextConfig
