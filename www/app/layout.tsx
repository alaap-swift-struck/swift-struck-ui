import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AmbientBackground } from "@swift-struck/ui/registry/primitives/ambient-background/ambient-background"
import { Toaster } from "@swift-struck/ui/registry/primitives/sonner/sonner"
import { ThemeProvider } from "@swift-struck/ui/registry/tokens/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Swift Struck UI",
  description:
    "A web-first, cross-platform component & collection library you build apps on top of.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AmbientBackground />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
