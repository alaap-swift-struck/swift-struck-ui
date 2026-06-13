# Contributing

How to add to Swift Struck UI without re-creating the sprawl. Read
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
- [ ] It is registered in [`registry.json`](registry.json).
- [ ] **It is wired into the showcase _and_ the docs** — this is how the library
      documents itself, so it is not optional:
  - [ ] a live demo in the gallery ([`www/app/components/page.tsx`](www/app/components/page.tsx),
        presets in [`_data.ts`](www/app/components/_data.ts));
  - [ ] an entry in the searchable catalog (`CATALOG` in
        [`www/app/documentation/page.tsx`](www/app/documentation/page.tsx)) — **miss
        this and the component is invisible to search**;
  - [ ] if it's config-driven, a row in [`CONFIG-REFERENCE.md`](CONFIG-REFERENCE.md).
- [ ] `npm run check` is green (`guardrails` + `format:check`), `tsc --noEmit` and
      `npm test` pass.

> Docs live in the central showcase + catalog, **not** in co-located `.mdx` files
> (we tried per-component `.mdx` and dropped it — one searchable source of truth
> beats a doc-debt backlog). The gallery, the catalog, and `CONFIG-REFERENCE.md`
> are the doc surface; keep all three current.

## Commands

```bash
npm run dev          # docs + showcase harness
npm run guardrails   # enforce the layering rules
npm run format       # prettier write
npm run check        # guardrails + format check (run before committing)
```
