const layers = [
  {
    n: "0",
    name: "Tokens",
    path: "app/globals.css · registry/tokens",
    desc: "Colors, radii, surfaces. The single source of truth every other layer resolves to.",
  },
  {
    n: "1",
    name: "Primitives",
    path: "registry/primitives",
    desc: "shadcn-style atoms — Button, Input, Dialog. Compose from tokens only.",
  },
  {
    n: "2",
    name: "Collections",
    path: "registry/collections",
    desc: "Glide-style data-bound views — List, Grid, Kanban, Calendar. Compose from primitives only.",
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
          Phase 0 · Foundation
        </span>
        <h1 className="text-4xl font-semibold tracking-tight">brimba</h1>
        <p className="max-w-prose text-muted-foreground">
          A web-first, cross-platform component &amp; collection library you
          build entire apps on top of. The skeleton is in place and the
          guardrails are live — the next phases fill in the layers below.
        </p>
      </header>

      <ol className="flex flex-col gap-3">
        {layers.map((l) => (
          <li
            key={l.n}
            className="flex gap-4 rounded-lg border bg-card p-5 text-card-foreground"
          >
            <span className="text-2xl font-semibold text-muted-foreground tabular-nums">
              {l.n}
            </span>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <h2 className="font-medium">{l.name}</h2>
                <code className="text-xs text-muted-foreground">{l.path}</code>
              </div>
              <p className="text-sm text-muted-foreground">{l.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <footer className="text-sm text-muted-foreground">
        Dependencies flow one way only:{" "}
        <code className="text-foreground">
          tokens → primitives → collections
        </code>
        . The build fails if anything points the wrong way.
      </footer>
    </main>
  )
}
