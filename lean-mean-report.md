# Lean Mean Check — Swift Struck UI

Scanned 2026-06-09 · Overall **84/100 (Grade B)** · _Lean, well-architected, exhaustively documented, and now tested on its core logic — ship-ready._

> Up from **79 (C)** after working the fix-list: added unit tests, a root README, retired the old codename, trimmed dead code.

## Done this pass

- [x] **(robustness)** Added a unit-test suite (vitest, 11 tests) for `validateField` + the visibility rule engine — runs in CI via `npm test`.
- [x] **(documentation)** Refreshed the root `README.md` (was a stale "brimba / Phase 0" stub).
- [x] **(documentation)** Retired the `brimba` codename → consistent **Swift Struck UI** across docs, comments, and CSS vars.
- [x] **(size / leanness)** Deleted the deletable `app/preview/` scratch folder.
- [x] **(leanness)** Trimmed the unused `ContentConfig` type.

## Fix next (ordered by impact)

- [ ] **(robustness)** Widen test coverage — _why:_ tests cover the core pure logic; `CollectionFrame` pagination and `Clamp` still live untested inside components. Extract their logic or add render tests. — _where:_ `packages/ui/registry/collections/collection-frame/collection-frame.tsx`, `packages/ui/registry/primitives/clamp/clamp.tsx`
- [ ] **(size / understandability)** Split the 2,290-line showcase file — _why:_ `app/components/page.tsx` holds ~70 demos in one file; breaking it per section makes edits/review easier. Harness-only, low risk. — _where:_ `app/components/page.tsx`
- [ ] **(scalability)** Fill the declared seams — _why:_ filter/sort rules and the map's geocoding/clustering/satellite are config-only; the data layer + Leaflet engine make the scale story real. — _where:_ `packages/ui/registry/collections/*`, `packages/ui/registry/primitives/map/map.tsx`
- [ ] **(robustness)** Wire the declared "open detail screen" action so it isn't a silent no-op. — _where:_ `packages/ui/lib/config.ts` (`ActionKind`), action components

## Scores

| Dimension | Before | Now | Status |
|---|---|---|---|
| Size & Scope | 85 | 87 | green |
| Robustness | 63 | 76 | green |
| Documentation | 84 | 90 | green |
| Understandability | 82 | 85 | green |
| Leanness & Optimization | 85 | 88 | green |
| Scalability & Structure | 84 | 84 | green |
| **Overall** | **79 (C)** | **84 (B)** | — |

## Full findings

### Size & Scope — 87/100 (green)
- Strengths: lean shipped library, one folder per component; deleted the deletable `preview/`.
- To improve: the ~2,290-line gallery harness (`app/components/page.tsx`) is worth splitting per section.

### Robustness — 76/100 (green)
- Strengths: now unit-tested (validation + rule engine, the exact logic a recent bug slipped through) running in CI; strict TS, required config fields, enforced layering, validation, graceful fallbacks.
- To improve: widen coverage to `CollectionFrame`/`Clamp`/components; wire the declared "detail" action and data-layer filter/sort.

### Documentation — 90/100 (green)
- Strengths: refreshed root README + full doc set; codename retired (consistent naming); plain-English comments on every file.
- To improve: per-component `.mdx` docs later for a true reference site.

### Understandability — 85/100 (green)
- Strengths: clean layering, one folder per component, consistent names + codename, clear entry point (README → HANDOFF).
- To improve: the 2.3k-line showcase file — split per section.

### Leanness & Optimization — 88/100 (green)
- Strengths: reuse-first (Field/Container/CollectionFrame/Clamp/VariantGroup); trimmed unused `ContentConfig`; tokens single source of truth; duplication down to 3.0%.
- To improve: the small remaining duplication is the repeated demo blocks in the harness.

### Scalability & Structure — 84/100 (green)
- Strengths: monorepo (library vs showcase), real npm package, config-driven with a declared data-layer seam, static export → host-agnostic.
- To improve: the data layer (filter/sort execution) and the Leaflet map engine are declared seams not yet implemented.
