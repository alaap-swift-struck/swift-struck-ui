import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "brimba",
  description:
    "A web-first, cross-platform component & collection library you build apps on top of.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
