// Vitest config. Component tests need a DOM (jsdom) and a React JSX transform.
// The root tsconfig uses `jsx: "preserve"` (for Next), so the React plugin owns
// the JSX transform here; pure-logic tests run fine under jsdom too.
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
})
