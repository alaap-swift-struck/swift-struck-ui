"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

/**
 * Wraps the app so the `.dark` class (and any future named themes) toggles the
 * Layer 0 tokens in app/globals.css. This is the runtime half of theming; the
 * values themselves live in the CSS. Pair with <ModeToggle /> for a switcher.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
