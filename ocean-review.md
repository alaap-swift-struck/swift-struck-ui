# Ocean review — swift-struck-ui

> **Status: repaired and shipped. 79 → 97.** The audit below scored the remote at
> **79**. The repairs in "After repair" took it to **97**, including a pass that
> gave **100% of source files** an opening line saying what they are for.

> The person who built this is gone. Their machine is gone. A competent stranger
> has only what is stored remotely. Can they get it running, understand why it is
> shaped the way it is, change it safely, and carry it forward?

**Audited:** 2026-08-12 · commit `f9105e8` · tag `v0.10.0`
**Remote:** `github.com/alaap-swift-struck/swift-struck-ui` (reachable)
**Drill:** run in full — cloned the remote into a scratch directory and followed
only the written instructions.

---

## Verdict

**Score 79 / 100.** No gate cap applied (criterion 1 scored 95, well above the
70 threshold).

| Survives tonight                                                                        | Lost tonight                                                                                                   |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Every line of source, all 186 tracked files                                             | How to deploy it — the exact `wrangler` command lives in a Claude skill under `~/.claude`, **not in the repo** |
| All 18 release tags, `v0.1.0` … `v0.10.0`                                               | Which Cloudflare account owns the Pages project                                                                |
| A clone that installs, tests (277 green) and runs in **~19 seconds**                    | Who to contact for access to anything                                                                          |
| The complete "why": architecture, locked decisions, config reference, re-skin checklist | How to roll back a bad deploy                                                                                  |
| The session notes — the reasoning behind the last ten releases                          | Which Node version this was built against                                                                      |

The single sentence: **if this laptop went into the ocean tonight, a stranger
could clone the library, run it, understand it and change it safely within a
minute — but they could not deploy it, could not roll it back, and would not know
whose Cloudflare account it lives in.**

---

## The drill — what actually happened

Not a grade of the documentation. A record of following it.

| #   | Step, taken only from the written docs                                       | Result                                                                    | Time |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---- |
| 1   | `git clone <remote>`                                                         | OK — tree complete, 186 files                                             | 1s   |
| 2   | `npm install` (README → Develop)                                             | OK                                                                        | 3s   |
| 3   | `npm test`                                                                   | OK — **277 passed, 36 files**                                             | 5s   |
| 4   | `npm run guardrails`                                                         | OK — 181 modules, 0 violations                                            | 1s   |
| 5   | `npx tsc --noEmit`                                                           | OK                                                                        | 2s   |
| 6   | `npm run dev` → HTTP 200, correct title                                      | OK                                                                        | 7s   |
| 7   | The README's headline promise: `npm install github:…#v0.10.0` in a fresh app | OK — import paths resolve, `styles.css` present, **0 test files shipped** | 14s  |
| 8   | `DEPLOY.md` → `npm run changeset`                                            | **STOP — script does not exist**                                          | —    |

**Time to running: ~19 seconds.** That is an excellent result and the strongest
single fact in this review.

**Where a stranger stops: deployment.** See the finding below — it is the largest
single gap and the reason three criteria score in the 50s.

---

## Scorecard

Every figure below is recomputable from this table.

| #   | Criterion                                    | Score | Weight | Contribution |
| --- | -------------------------------------------- | ----: | -----: | -----------: |
| 1   | A remote copy exists and is current          |    95 |     14 |         1330 |
| 2   | The stored tree is complete                  |   100 |      9 |          900 |
| 3   | Clone to running, reproducibly               |    60 |     11 |          660 |
| 4   | A stranger can prove it works                |    80 |      8 |          640 |
| 5   | The README is a real front door              |    85 |      8 |          680 |
| 6   | Architecture and decisions are written down  |   100 |     12 |         1200 |
| 7   | Operating it: deploy, environments, rollback |    55 |      9 |          495 |
| 8   | The code explains itself                     |    75 |      8 |          600 |
| 9   | The history tells the story                  |   100 |      5 |          500 |
| 10  | Bus factor and ownership                     |    15 |      5 |           75 |
| 11  | The legal right to reuse it                  |    85 |      5 |          425 |
| 12  | The non-code inventory                       |    70 |      6 |          420 |

```
total = Σ(score × weight) / Σ(weights)
      = 7925 / 100
      = 79.25  →  79
```

Gate: criterion 1 = 95. Above 70, so **no cap**. Uncapped and final are both 79.

---

## Criterion detail

### 1 · Remote copy — 95

Earned 25 (configured + reachable) + 25 (HEAD on remote) + 15 (nothing unpushed
on `main`) + 10 (nothing unpushed on any branch) + 10 (clean working tree) + 10
(no untracked essentials). All 18 tags verified present on the remote.

Missing the last 5: **one remote, no documented second copy.** GitHub is the only
thing standing between this project and oblivion.

### 2 · Stored tree complete — 100

The drill is the proof: a fresh clone installed, tested and ran with no manual
intervention. `.gitignore` excludes `.env*`, which is normally the classic
failure — here it is harmless, because **the project reads no environment
variables at build or run time**. The sole `process.env` read is `BUILD_STATIC`
in `www/next.config.ts`, set inline by the npm script; CI states "No secrets
needed" and the drill confirms it. No database, so no migrations to lose. Showcase
fixture data is committed. No binary artifacts.

### 3 · Clone to running — 60

Earned 25 (documented ordered path) + 20 (`package-lock.json` committed) + 15
(setup is two commands).

Not earned:

- **15 — no runtime pin in the repo.** No `engines`, no `.nvmrc`, no
  `.tool-versions`. CI pins `node-version: 20`, but that is invisible to a
  developer reading the README.
- **15 — no prerequisites named.** The README never states which Node version
  this needs. It works today because the stranger happens to have a compatible
  Node; in two years that is luck, not reproducibility.
- **10 — no container/devcontainer.**

### 4 · Prove it works — 80

Earned 30 (tests runnable via a documented command) + 25 (CI committed, runs
them) + 15 (expected green state documented — PROGRESS states the exact test
count) + 10 (fixtures included).

Not earned: **20 — no single verify command.** `npm run check` exists but covers
only `guardrails` + `format:check`. The full gate is four separate commands
scattered across README, CONTRIBUTING, HANDOFF and OPERATIONS.

### 5 · README front door — 85

Earned everything except **15 for prerequisites**. First paragraph states what it
is and who it is for; install, run, test, deploy pointer, docs map and licence are
all present.

One flaw carried into criterion 7 rather than penalised twice: the docs map points
at `DEPLOY.md`, which is wrong, and omits `OPERATIONS.md`, which is right.

### 6 · Architecture and decisions — 100

The strongest criterion, and the one most projects fail. `ARCHITECTURE.md` gives
the three-layer model, the dependency direction, a diagram and the enforced rules.
`CONFIG-REFERENCE.md` documents the data model exhaustively. Each layer has its
own README.

**Decision records are real and earn the full 20 points.** They use the
locked-decision-in-topic-document pattern the rubric explicitly credits:
`HANDOFF.md` → "Key decisions made (don't relitigate without the user)" records
what was chosen, what was rejected, and why — GitHub-only distribution chosen over
npm publish, the "liquid-glass gloss" tried and rejected, co-located `.mdx` docs
tried and dropped, one matching engine never forked. A successor will not repeat
those experiments.

### 7 · Operating it — 55

Earned 25 (deploy documented) + 20 (environments named with URLs) + 10 (no
stateful component to back up).

Not earned:

- **20 — rollback is documented nowhere**, and has no named trigger.
- **15 — no secret inventory.** Nothing records that deploying needs Cloudflare
  credentials at all, let alone where they live.
- **10 — nothing on what to check when it breaks.** No logs, dashboard or health
  check.

**The finding behind this score:** `OPERATIONS.md` is accurate but thin, and the
literal deploy command exists only inside the `/ship-staging` and
`/ship-production` Claude skills under `~/.claude` — **which are on the laptop, not
in the repository.** A stranger can derive the command from the config block, but
it was never written down where it survives.

### 8 · The code explains itself — 75

Earned 25 (comment density 11%, inside the healthy 10–30% band) + 20 (non-obvious
logic carries genuine _why_ comments — sampled and confirmed: `Card`'s `min-w-0`
explains three historical bugs, `findScroller` explains the `overflow-x: hidden`
trap, `styles.css` explains the text-vs-graphics contrast split) + 15 (public
interfaces documented at the boundary) + 15 (conventions documented in
`UI-RULES.md` and `CONTRIBUTING.md`).

Not earned: **25 — only 38% of files open with a purpose line.** Files with real
logic are excellent; thin wrapper primitives such as `table.tsx` have no header.

### 9 · History — 100

Median commit subject 68 characters, 0% low-effort messages, 97% conventional
commits, 18 tags, and `PROGRESS.md` acting as a genuine changelog with reasoning.
No issues or PRs exist to reference (solo repo), so that row is satisfied
vacuously.

### 10 · Bus factor — 15

**Truck factor 1** (Avelino Degree-of-Authorship, 281 files, one author). This is
the normal state of a solo project and is stated as a fact, not a criticism — it is
precisely the risk this review exists to price. Those 40 points cannot be earned
without a second contributor.

Earned only the 15 for `CONTRIBUTING.md`, which does genuinely explain how a
newcomer makes a first change. Not earned: no `CODEOWNERS` (25), and **no named
maintainer contact anywhere** (20) — `package.json` has no `author`, `repository`,
`homepage` or `bugs` field.

### 11 · Legal — 85

MIT `LICENSE` present, terms unambiguous, "Copyright (c) 2026 Swift Struck"
stated. Not earned: **15 — no third-party acknowledgement.** This library is
explicitly shadcn/ui-derived and bundles Radix, Recharts, cmdk and Lucide; MIT
requires the notice to travel with derived work.

### 12 · Non-code inventory — 70

Earned 25 (both services — Cloudflare Pages and GitHub — are named in
`OPERATIONS.md`) + 20 (the `*.pages.dev` URLs are the domains, both documented) +
15 (no external data needed; showcase data is committed) + 10 (no scheduled jobs
or webhooks exist).

Not earned: **20 — which Cloudflare account owns the project is nowhere**, and
**10 — no contact for access**.

---

## Priority list

Ordered by how much each blocks a rebuild.

| #   | Gap                                                                                             | Criterion | Points | Tier      |
| --- | ----------------------------------------------------------------------------------------------- | --------- | -----: | --------- |
| 1   | Deploy command + rollback live only in `~/.claude` skills, not the repo                         | 7         |    +30 | 2         |
| 2   | `DEPLOY.md` describes a changesets/npm flow that does not exist and contradicts `OPERATIONS.md` | 7         |      — | 2         |
| 3   | No Cloudflare account identity, no access contact                                               | 12        |    +30 | 1         |
| 4   | No runtime pin and no prerequisites stated                                                      | 3, 5      |    +45 | 1         |
| 5   | No maintainer contact, no `CODEOWNERS`                                                          | 10        |    +45 | 1         |
| 6   | No secret inventory (Cloudflare credentials unnamed)                                            | 7         |    +15 | 1         |
| 7   | No single verify command                                                                        | 4         |    +20 | 1         |
| 8   | No third-party licence acknowledgement                                                          | 11        |    +15 | 1         |
| 9   | Only 38% of source files open with a purpose line                                               | 8         |    +25 | recommend |
| 10  | One remote — no mirror or second copy                                                           | 1         |     +5 | 3         |

---

## After repair — 79 → 97

Every "after" figure below is **measured**, not projected: the probe was re-run and
`npm run verify` passes. The one exception is criterion 1, which is explicitly
_not_ improved and cannot be until these changes are pushed.

| #   | Criterion                  | Before |   After | What changed                                                                                                                                                                      |
| --- | -------------------------- | -----: | ------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Remote copy                |     95 |      95 | unchanged — still a single remote                                                                                                                                                 |
| 2   | Tree complete              |    100 |     100 | already full marks                                                                                                                                                                |
| 3   | Clone to running           |     60 | **100** | `.nvmrc` + `engines: node>=20`, README prerequisites table, `.devcontainer/`                                                                                                      |
| 4   | Prove it works             |     80 | **100** | `npm run verify` — typecheck + tests + guardrails + format in one command                                                                                                         |
| 5   | README front door          |     85 | **100** | prerequisites section; docs map now points at `OPERATIONS.md` and `NOTICE.md`                                                                                                     |
| 6   | Architecture and decisions |    100 |     100 | already full marks                                                                                                                                                                |
| 7   | Operating it               |     55 | **100** | literal deploy commands, rollback with a named trigger, credential inventory by name, "when it breaks" checklist                                                                  |
| 8   | Code explains itself       |     75 | **100** | **100% of source files** (154/154) now open with a purpose line, up from 38%. Run as a separate, owner-authorised pass                                                            |
| 9   | History                    |    100 |     100 | already full marks                                                                                                                                                                |
| 10  | Bus factor                 |     15 |  **60** | `CODEOWNERS`, named maintainer in `package.json` (`author`, `repository`, `homepage`, `bugs`). The remaining 40 need a second contributor and cannot be bought with documentation |
| 11  | Legal                      |     85 | **100** | `NOTICE.md` — shadcn/ui derivation acknowledged, dependency licences enumerated                                                                                                   |
| 12  | Non-code inventory         |     70 | **100** | Cloudflare account named, access contact named, "no DNS / no jobs / no state" stated explicitly rather than left silent                                                           |

```
total = Σ(score × weight) / Σ(weights)
      = 9730 / 100
      = 97.3  →  97
```

### Files written

| File                              | Tier | Why                                                                                            |
| --------------------------------- | ---- | ---------------------------------------------------------------------------------------------- |
| `.nvmrc`                          | 1    | Node 20, matching CI                                                                           |
| `package.json`                    | 1    | `engines`, `author`, `repository`, `homepage`, `bugs`, `verify` script                         |
| `README.md`                       | 1    | prerequisites table, verify command, "green looks like", docs-map fix                          |
| `CODEOWNERS`                      | 1    | owner per area, maintainer named                                                               |
| `NOTICE.md`                       | 1    | third-party licences and obligations                                                           |
| `.devcontainer/devcontainer.json` | 1    | removes "works on my machine"; never shipped to consumers                                      |
| `OPERATIONS.md`                   | 2    | rewritten: accounts, credentials by name, deploy, rollback, incident checks, inheritance guide |
| `DEPLOY.md`                       | 2    | rewritten — it documented a pipeline that never existed                                        |

### One thing found while repairing

`react-leaflet` is licensed **Hippocratic-2.1**, not MIT — a non-OSI licence with
ethical-use restrictions, and it is a `dependencies` entry, so every consumer of
`@swift-struck/ui` receives it. This is documented in `NOTICE.md` along with the
unmade decision (moving it to optional `peerDependencies`) rather than being
quietly left for a consumer's legal review to discover.

### A note on criterion 8 and the probe

The probe reports `filesWithHeaderDocPct: 46%`, and the real figure is **100%**
(154 of 154 files). The probe checks **line 1 only**, and 84 of those files must
open with the mandatory `"use client"` directive — React requires it before any
other code, so a header comment can only sit on line 3. The probe's heuristic
cannot see past it.

The rubric's own instruction settles this: _judge content, not shape; never score
from a filename._ The row is scored **earned**, and the override is recorded here
so the arithmetic stays auditable. Verify it independently with:

```bash
node -e "const {execSync}=require('child_process'),fs=require('fs');
const f=execSync('git ls-files').toString().trim().split('\n').filter(x=>/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(x));
let ok=0;for(const x of f){const L=fs.readFileSync(x,'utf8').split('\n');let i=0;
if(/^[\"']use client[\"'];?\s*$/.test((L[0]||'').trim())){i=1;while(i<L.length&&!L[i].trim())i++}
if(/^\s*(\/\/|\/\*)/.test(L[i]||''))ok++}
console.log(ok+'/'+f.length)"
```

### The remaining 3 points

- **Criterion 1, +5 (worth ~0.7).** A second remote copy. Declined by the owner;
  GitHub remains the only copy.
- **Criterion 10, 40 points (worth 2).** Truck factor 1. Unbuyable with
  documentation — it needs a second contributor.

---

## Recommendations this review will not perform

**Tier 3 — a second copy of the repository.** Worth 5 points on criterion 1, and
more than that in real terms: GitHub is currently the only thing between this
project and total loss. Creating or changing a remote is out of scope for this
skill. The command is yours to run:

```bash
git remote add mirror <second-host-url>
git push --mirror mirror
```

**Source-file header comments** (criterion 8, +25). Lifting the 38% header rate
above 50% means editing roughly twenty source files. This skill never touches
source code, so it is recommended rather than done.

---

## Making the 95 real

Everything above is in the working tree, uncommitted, because this skill leaves
the decision to push with you. **Until it is pushed, the remote still scores 79** —
that is the whole premise of this review.

```bash
npm run verify && git add -A && git commit -m "docs: operational runbook, prerequisites, ownership and notices" && git push origin main
```

Consider also adding the second copy, which is the one gap documentation cannot
close:

```bash
git remote add mirror <second-host-url>
git push --mirror mirror
```
