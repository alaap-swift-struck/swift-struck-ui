# Operations — swift-struck-ui

How this project ships. The **/ship-staging** and **/ship-production** skills read
the `## Deploy config` block below — keep it accurate if anything changes.

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

- npx tsc --noEmit
- npm test
- npm run guardrails
- npm run format:check

## Notes

- The repo root **is** the library `@swift-struck/ui`; the docs/showcase site lives
  in `www/` (its build output is `www/out`).
- Cloudflare deploys go straight from this machine via `wrangler` — GitHub is the
  source backup, not part of the deploy path.
- Same build serves staging and production; only the URL differs.
