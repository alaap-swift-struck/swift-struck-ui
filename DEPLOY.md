# Deploying Swift Struck UI

> **This file used to describe a changesets/npm-publish pipeline that was never
> built.** It listed `npm run changeset`, `npm run release`, an `NPM_TOKEN` secret
> and a `.github/workflows/release.yml` — none of which exist — and it said
> Cloudflare Pages builds from GitHub, which is not how this deploys. An ocean
> review followed it literally and stopped dead at the first command. It has been
> replaced with a pointer to the truth.

**The operational source of truth is [OPERATIONS.md](OPERATIONS.md).** It carries
the deploy commands, the account inventory, the credential list, rollback and its
trigger, and what to check when something breaks.

## The short version

There are two things, and neither is published to a package registry.

| What                                 | How it ships                                         | Where it lands                                                                                             |
| ------------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **The library** (`@swift-struck/ui`) | a git tag on `main` — the repo root _is_ the package | consumers run `npm install github:alaap-swift-struck/swift-struck-ui#v<x.y.z>`                             |
| **The showcase site**                | `npm run build:static`, then `wrangler pages deploy` | [staging](https://staging.swift-struck-ui.pages.dev), then [production](https://swift-struck-ui.pages.dev) |

```bash
npm run verify                 # must be green first
npm run build:static
npx wrangler pages deploy www/out --project-name swift-struck-ui --branch staging --commit-dirty=true
npx wrangler pages deploy www/out --project-name swift-struck-ui --branch main    --commit-dirty=true
```

Staging and production are the **same build** — only the `--branch` flag differs.
Deploying production from the same `www/out` makes wrangler report
`Uploaded 0 files`, which is the proof the two are identical.

## Why there is no npm publish

A deliberate decision, recorded in `HANDOFF.md`: distribution is GitHub-only, so
there is one place to look rather than two. The cost is real and is documented in
the README's "Updating" section — npm resolves a GitHub dependency to a **commit
SHA**, so a plain `npm install` never pulls new library code. Consumers must pin a
tag or run `npm update`.

Everything else — accounts, credentials, rollback, incident checks — is in
[OPERATIONS.md](OPERATIONS.md).
