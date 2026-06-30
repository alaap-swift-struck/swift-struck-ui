// ArticleBody - the pure, JSX-free URL guard, kept here so it can be unit tested
// in isolation (same split as permission-matrix/logic.ts). The component imports
// `safeHref` and runs EVERY href it sets through it.

/** The only URL schemes we ever allow as a clickable link (compared without the
 * trailing colon). Everything else (javascript, data, vbscript, file, ...) is
 * treated as unsafe. */
export const SAFE_SCHEMES = ["http", "https", "mailto"]

/** True for any character a browser would ignore inside a scheme: all C0
 * control codes and the space (<= 0x20), NBSP (0xa0), and the line / paragraph
 * separators (0x2028 / 0x2029). Stripping them defeats "java\tscript:" tricks. */
function isIgnored(codePoint: number): boolean {
  return (
    codePoint <= 0x20 ||
    codePoint === 0xa0 ||
    codePoint === 0x2028 ||
    codePoint === 0x2029
  )
}

/** Remove every ignored character (see `isIgnored`) from a string. */
function stripIgnored(value: string): string {
  let out = ""
  for (const ch of value) {
    if (!isIgnored(ch.codePointAt(0) ?? 0)) out += ch
  }
  return out
}

/**
 * Return a safe href, or `"#"` when the URL is dangerous.
 *
 * Markdown bodies can carry hostile links like `[click](javascript:alert(1))`.
 * Browsers also ignore TAB / newline / leading control characters inside a
 * scheme, so `java\tscript:` and ` javascript:` are live too - we strip those
 * before inspecting the scheme. A relative/fragment link (`#x`, `/x`, `./x`)
 * has no scheme and can't carry a dangerous one, so it passes through.
 *
 * Note: React sets `href` as a DOM property (it does not HTML-entity-decode it),
 * so an entity-obfuscated scheme like `&#106;avascript:` reaches the browser as
 * a literal, invalid scheme - our scheme check rejects it anyway.
 */
export function safeHref(url: string | null | undefined): string {
  if (!url) return "#"

  // Strip the chars browsers ignore, then look at what's left.
  const cleaned = stripIgnored(url)
  if (!cleaned) return "#"

  // No scheme -> relative or fragment link -> safe. Anything else must carry an
  // explicit `scheme:` that we recognise.
  const match = /^([a-z][a-z0-9+.-]*):/i.exec(cleaned)
  if (!match) return url.trim()

  return SAFE_SCHEMES.includes(match[1].toLowerCase()) ? url.trim() : "#"
}
