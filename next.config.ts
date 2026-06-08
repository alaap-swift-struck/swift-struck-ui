import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Compile the workspace component library (shipped as TS source) on the fly.
  transpilePackages: ["@swift-struck/ui"],
  // `output: "export"` is what lets Tauri (desktop) and Capacitor (mobile)
  // wrap the exact same web build in Phase 5. Kept off during development
  // so the docs harness can use the full Next.js dev server.
}

export default nextConfig
