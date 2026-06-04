# Contributing

How to add to brimba without re-creating the sprawl. Read
[ARCHITECTURE.md](ARCHITECTURE.md) first — this file is the practical workflow
that follows from it.

## Before you add anything

Ask, in order:

1. **Does an existing component already cover this with a prop?** Use it.
2. **Does it cover this with a new CVA _variant_?** Add the variant, not a file.
3. **Only if neither:** add a new component, in the correct layer.

Most "I need a new component" moments are actually rule 1 or 2. That instinct is
the single most important habit for keeping the codebase small.

## Adding a primitive (Layer 1)

```
registry/primitives/<name>/
  <name>.tsx     # component + CVA variants
  <name>.mdx     # docs + at least one live example
```

- Build behavior on Radix UI where one exists; style only with token-backed
  Tailwind utilities (`bg-primary`, `text-muted-foreground`, `rounded-md` …).
- Expose `className` and merge it with [`cn()`](lib/utils.ts) so consumers can
  override.
- Encode visual options as CVA variants, not booleans-per-look.
- Must not import anything from `registry/collections`.

## Adding a collection (Layer 2)

```
registry/collections/<name>/
  <name>.tsx
  <name>.mdx
```

- Compose it out of primitives. A collection should contain almost no raw markup
  of its own.
- Take typed `data` + a small `config`/render-prop API; stay agnostic about
  where data comes from.
- May import primitives and tokens; nothing higher.

## Definition of done

A change is done only when **all** of these hold:

- [ ] It lives in the correct layer and respects the dependency direction.
- [ ] No hardcoded colors or sizes — tokens only.
- [ ] New looks are CVA variants, not new components.
- [ ] It has a co-located `.mdx` doc with a live example.
- [ ] It is registered in [`registry.json`](registry.json) (from Phase 4 on).
- [ ] `npm run check` is green (`guardrails` + `format:check`).

## Commands

```bash
npm run dev          # docs + showcase harness
npm run guardrails   # enforce the layering rules
npm run format       # prettier write
npm run check        # guardrails + format check (run before committing)
```
