import type { NextConfig } from "next"

// BUILD_STATIC=1 switches on Next's static export (a plain `out/` folder) for
// Cloudflare Pages + the future Tauri/Capacitor shells. Left OFF in dev so the
// docs harness keeps the full Next.js dev server.
const staticExport = process.env.BUILD_STATIC
  ? { output: "export" as const, images: { unoptimized: true } }
  : {}

const nextConfig: NextConfig = {
  // Compile the workspace component library (shipped as TS source) on the fly.
  transpilePackages: ["@swift-struck/ui"],
  ...staticExport,
}

export default nextConfig
