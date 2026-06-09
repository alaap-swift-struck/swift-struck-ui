# Lean Mean Check — Swift Struck UI

Scanned 2026-06-09 · Overall **79/100 (Grade C)** · _Lean, well-architected and exhaustively documented — held back almost entirely by zero automated tests._

## Fix first (ordered by impact)

- [ ] **(robustness)** Add automated tests for the pure logic — _why:_ there are **0 tests**; `validateField`, the visibility rule engine (`evaluateRules`), `CollectionFrame` pagination math, and `Clamp` are pure functions that are cheap to test and high-value. A real number-coercion bug already slipped through review. Tests are the thing to add before others depend on the npm package. — _where:_ `packages/ui/lib/config.ts`, `packages/ui/registry/collections/collection-frame/collection-frame.tsx`, `packages/ui/registry/primitives/clamp/clamp.tsx`
- [ ] **(documentation)** Add a root `README.md` — _why:_ the package has a README but the repo root doesn't; it's the first thing a GitHub/npm visitor opens. A short one pointing at HANDOFF/ARCHITECTURE/DEPLOY is enough. — _where:_ repo root
- [ ] **(documentation)** Retire the `brimba` codename — _why:_ docs mix `brimba` (old internal name) with `swift-struck` (the real package); a find-replace removes newcomer confusion. — _where:_ `HANDOFF.md`, `ARCHITECTURE.md`, `PROGRESS.md`, `GLIDE-*.md`
- [ ] **(size / understandability)** Split the 2,290-line showcase file — _why:_ `app/components/page.tsx` holds ~70 demos in one file; breaking it per section (one file per gallery section) makes edits and review far easier. It's the harness, not shipped, so low risk. — _where:_ `app/components/page.tsx`
- [ ] **(size / leanness)** Delete the scratch `preview/` folder — _why:_ `app/preview/` (~356 lines) is marked deletable in the handoff; removing it trims dead weight. — _where:_ `app/preview/`
- [ ] **(leanness)** Adopt or trim the unused config types — _why:_ `ActionConfig`/`ContentConfig` are defined but not consumed yet (kept as foundation); either wire them in or remove until needed, to keep the "no dead weight" promise honest. — _where:_ `packages/ui/lib/config.ts`
- [ ] **(scalability)** Fill the declared seams — _why:_ filter/sort rules and the map's geocoding/clustering are config-only; the data layer and the Leaflet map engine are the implementations that make the scale story real (not just declared). — _where:_ `packages/ui/registry/collections/*`, `packages/ui/registry/primitives/map/map.tsx`

## Scores

| Dimension | Score | Status |
|---|---|---|
| Size & Scope | 85 | green |
| Robustness | 63 | orange |
| Documentation | 84 | green |
| Understandability | 82 | green |
| Leanness & Optimization | 85 | green |
| Scalability & Structure | 84 | green |
| **Overall** | **79** | **C** |

## Full findings

### Size & Scope — 85/100 (green)
- Strengths: shipped library (`packages/ui`) is lean, one folder per component; ~9.2k LOC for ~70 components + a full showcase is tight.
- To improve: `app/components/page.tsx` is ~2,290 lines (split per section); `app/preview/` is deletable dead weight.

### Robustness — 63/100 (orange)
- Strengths: strict TypeScript, every config field required; enforced layering (dependency-cruiser), input validation, graceful fallbacks, CI (tsc + guardrails + format) on every push.
- To improve: **0 automated tests** — add unit tests for the pure logic (validation, rules, pagination, clamp). A couple of features ("open detail" action, data-layer filter/sort) are declared but not wired — a thin implementation + tests prevents silent no-ops.

### Documentation — 84/100 (green)
- Strengths: a real doc set (HANDOFF, ARCHITECTURE, CONTRIBUTING, GLIDE-PARITY, GLIDE-CONFIG-RESEARCH, PROGRESS, DEPLOY); plain-English comments on every file.
- To improve: no root README (OSS front door); the `brimba` codename lingers alongside `swift-struck`.

### Understandability — 82/100 (green)
- Strengths: clean tokens → primitives → collections layering, one folder per component (findable by convention); clear names (Field, Clamp, Container, CollectionFrame); HANDOFF as the entry point.
- To improve: the ~70-demo showcase lives in one 2.3k-line file — split it to lower the surprise factor.

### Leanness & Optimization — 85/100 (green)
- Strengths: reuse-first (one Field/Container/CollectionFrame/Clamp/VariantGroup, variants over new files); tokens as the single source of truth; anti-bloat enforced by guardrails. Duplication only 3.3%.
- To improve: `ActionConfig`/`ContentConfig` defined-but-unused; repeated demo blocks make up most of the small duplication.

### Scalability & Structure — 84/100 (green)
- Strengths: monorepo (library vs showcase), published as a real npm package; config-driven with a declared data-layer seam; static export → not coupled to any one host.
- To improve: the data layer (filter/sort execution) and the Leaflet map engine are seams declared in config but not yet implemented — the scale story is partly aspirational until they land.
