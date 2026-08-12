# Operations — swift-struck-ui

How this project ships, who owns the accounts it depends on, and what to do when
it breaks. **This file is the operational source of truth.** The `/ship-staging`
and `/ship-production` skills read the `## Deploy config` block below — keep it
accurate if anything changes.

> Written to survive the author. Every command here is meant to be runnable by
> someone who has never seen this project, holding only this repository.

## Deploy config

- platform: cloudflare-pages
- cloudflare_project: swift-struck-ui
- build_command: npm run build:static
- build_output: www/out
- staging_branch: staging
- production_branch: main
- staging_url: https://staging.swift-struck-ui.pages.dev
- production_url: https://swift-struck-ui.pages.dev
- github_remote: origin (https://github.com/alaap-swift-struck/swift-struck-ui)

## Verify before shipping

```bash
npm run verify
```

Equivalent to `tsc --noEmit` + `vitest run` + `guardrails` + `format:check`.
All four must pass. **Do not run `npm run build:static` while the dev server is
running** — they share `www/.next` and it corrupts the dev server's CSS.

## Accounts and services — the non-code inventory

The repository is not enough to rebuild this. These are the things that live
outside it.

| Thing                                | Who owns it                                            | Notes                                                                                                                   |
| ------------------------------------ | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Cloudflare**                       | Account name **Swift Struck**, `alaap@swiftstruck.com` | Hosts both URLs as one Cloudflare Pages project, `swift-struck-ui`. Retrieve the account ID with `npx wrangler whoami`. |
| **GitHub**                           | `alaap-swift-struck`                                   | Source of truth and the only backup copy. Also runs CI.                                                                 |
| **Domains / DNS**                    | none                                                   | Both environments use Cloudflare's `*.pages.dev` subdomains. There are no custom domains and no DNS records to recover. |
| **Scheduled jobs, webhooks, queues** | none                                                   | Nothing runs on a timer. Deploys are manual, from a developer machine.                                                  |
| **Databases, object storage**        | none                                                   | The library is source-only; the docs site is a static export. There is no state to back up or restore.                  |
| **npm registry**                     | not used                                               | Distribution is GitHub-only, by deliberate decision — see HANDOFF.md. There is no npm org and no publish pipeline.      |

**Access:** every account above is held by `alaap@swiftstruck.com`. That is also
the single point of failure — see "If you have inherited this project" below.

## Credentials — by name, never by value

Nothing in this list is stored in the repository, and nothing here should ever be
committed.

| Credential             | Where it lives                                                                                 | Needed for               |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------ |
| Cloudflare OAuth token | `~/.wrangler/config/default.toml` on the maintainer's machine, created by `npx wrangler login` | Every deploy             |
| GitHub credentials     | The maintainer's macOS keychain                                                                | Pushing commits and tags |

- **The build needs no secrets at all.** There is no `.env` file and no
  `.env.example`, because the code reads no environment variables. The one
  `process.env` reference — `BUILD_STATIC` in `www/next.config.ts` — is set inline
  by the npm script.
- **CI needs no secrets.** `.github/workflows/ci.yml` only type-checks, tests,
  runs the guardrails and checks formatting.
- A successor who has the Cloudflare account can recreate the token in one command
  (`npx wrangler login`). A successor who does _not_ have the account cannot
  deploy to these URLs at all, and should create their own Pages project.

## Deploying

One build serves both environments; only the `--branch` flag differs. Run from
the repo root, with the dev server stopped.

```bash
# 0. gate
npm run verify

# 1. build the static docs site
npm run build:static

# 2. staging
npx wrangler pages deploy www/out --project-name swift-struck-ui --branch staging --commit-dirty=true

# 3. production, after checking staging
npx wrangler pages deploy www/out --project-name swift-struck-ui --branch main --commit-dirty=true
```

Deploying production from the same `www/out` you deployed to staging is
deliberate: wrangler reports `Uploaded 0 files (N already uploaded)`, which is the
proof that the two environments are byte-identical.

**Cloudflare deploys go straight from a developer machine via `wrangler`.**
GitHub is the source backup and CI, **not** part of the deploy path — there is no
Cloudflare–GitHub build integration to configure.

### Releasing the library

The library is the repo root, consumed straight from GitHub. A release is a
version bump plus a tag:

```bash
npm version <patch|minor|major> --no-git-tag-version
# update PROGRESS.md with what changed and why
git commit -am "…"
git tag -a v<x.y.z> -m "…"
git push origin main --follow-tags
```

Consumers pin with
`npm install github:alaap-swift-struck/swift-struck-ui#v<x.y.z>`.

## Rollback

**Trigger — roll back immediately, without debugging first, if any of these are
true after a production deploy:**

- the production URL returns a non-200, or renders unstyled
- the browser console shows an uncaught error on first paint
- a component the gallery demonstrates fails to render
- a host application reports the newly-tagged version broke its build

**Rolling back the site** (fastest path, no rebuild):

1. Open the Cloudflare dashboard → Workers & Pages → `swift-struck-ui` →
   Deployments.
2. Find the last known-good production deployment and choose **Rollback**.
   Cloudflare keeps previous deployments, so this is immediate and needs no
   local checkout.

Alternatively, from a machine with wrangler and a clean checkout of the good
commit: `npm run build:static` then re-run the production deploy command above.

**Rolling back the library** for consumers: nothing needs to be un-published,
because nothing is published. Tell the affected app to pin the previous tag —
`npm install github:alaap-swift-struck/swift-struck-ui#v<previous>` — and, if the
bad tag was cut in error, delete it with
`git push --delete origin v<x.y.z>`.

There is no database and no migration, so **rollback is never destructive** and
never needs a data restore.

## When it breaks — what to check, in order

1. **Is it the site or the build?** `curl -I https://swift-struck-ui.pages.dev`.
   A non-200 is the deploy; a 200 with a broken page is the build.
2. **Deployment log:** Cloudflare dashboard → the project → Deployments → the
   most recent one. It shows what was uploaded and when.
3. **Rebuild locally:** `npm run verify && npm run build:static`. If the gate is
   red, the last deploy shipped from a red tree.
4. **Browser console and network tab** on the failing page. Nearly every failure
   this project has had was a CSS/token issue visible on first paint, not a
   server error.
5. **CI:** the GitHub Actions tab shows whether `main` was green at the deployed
   commit.

There is no application server, no logs to tail and no health endpoint — a static
export either serves or it does not.

## If you have inherited this project

1. `git clone` the repo and run `npm install && npm run verify`. It should be
   green in under a minute with no configuration.
2. Read `HANDOFF.md` first, then `ARCHITECTURE.md`. `HANDOFF.md` carries the
   decisions that were made and rejected — read it before changing direction.
3. You will **not** be able to deploy to the existing URLs without the Cloudflare
   account. If you cannot obtain it, create your own Pages project and update the
   `## Deploy config` block above; nothing else in the repo needs to change.
4. There is no data to migrate and no service to keep alive. The project is
   entirely reconstructable from this repository plus a Cloudflare account.
