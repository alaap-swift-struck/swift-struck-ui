# Shipping Swift Struck UI — staging & live

There are **two things** we ship, and each has a **staging** and a **live** lane.

| What                                             | Staging                      | Live              |
| ------------------------------------------------ | ---------------------------- | ----------------- |
| **The library** (npm package `@swift-struck/ui`) | `@next` tag                  | `@latest` tag     |
| **The showcase site** (the gallery)              | staging URL (preview branch) | live URL (`main`) |

You test on staging, then promote to live. Live changes reach the outside world
when they next update; **breaking changes need a new major version**, so nobody
gets surprise-broken. Your own apps get fixes whenever they `npm update`.

---

## One-time setup (needs YOU — ~10 min of signups)

1. **GitHub:** push this repo to a **public** GitHub repo (for open source).
2. **npm:** create a free account at npmjs.com, then create the **`@swift-struck`
   org** (Settings → Add Organization — it's free for public packages). Generate
   an **Automation access token** (Access Tokens → Generate → Automation).
3. **GitHub secret:** in the repo, Settings → Secrets → Actions → add
   `NPM_TOKEN` = that token. (CI publishing now works.)
4. **Cloudflare:** create a Cloudflare account. We'll connect the GitHub repo to
   **Cloudflare Pages** (build command `npm run build`, output `out`).

Tell me when these exist and I'll wire the last mile.

---

## Library — publish flow

```bash
# 1. describe what changed (pick patch / minor / major)
npm run changeset

# 2. LIVE: merging to main opens a "Version Packages" PR; merging THAT publishes
#    @swift-struck/ui@latest automatically (via .github/workflows/release.yml).

# STAGING (test a prerelease before going live):
npm run changeset
npx changeset version --snapshot next
npm run release -- --tag next      # publishes @swift-struck/ui@x.y.z-next.0
# consumers test it with:  npm install @swift-struck/ui@next
```

## Showcase site — deploy flow (Cloudflare Pages)

The gallery is a Next.js app that exports to a static site, which Cloudflare
hosts directly.

- **Live:** Cloudflare Pages builds from `main` → your live URL.
- **Staging:** every branch / PR gets its own preview URL automatically.

Build settings in Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `out` (we enable `output: "export"` in `next.config.ts`
  when we wire this — verified together so dev isn't disrupted).

---

## The everyday loop

1. Change a component → push a branch → **staging site preview** + optional
   `@next` package to test.
2. Happy? Merge to `main` → **live site** + (after the Version PR) `@latest`.
3. Your apps pick it up on their next `npm update`; the world does too.
