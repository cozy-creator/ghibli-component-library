# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

All commands are run from the repo root unless noted. Package manager is `pnpm@11.0.0` (pinned via `packageManager`). Dependency lifecycle scripts are disabled by workspace policy.

- `pnpm dev` — builds the registry, then starts the Vite showcase (`apps/web`). The registry build must run first because `apps/web` serves `/r/*.json` from `public/r`.
- `pnpm dev:storybook` — isolated component inspection surface.
- `pnpm typecheck` / `pnpm lint` / `pnpm test` — turbo pipelines across the workspace.
- `pnpm test:e2e` — Playwright, scoped to `@ghibli/web`. `webServer` runs `pnpm build && pnpm preview` on port 4173 and reuses an existing server locally.
- `pnpm registry:build` — deletes `apps/web/public/r`, then runs `shadcn build --output apps/web/public/r`. Regenerate whenever `registry.json` or `registry/ghibli/**` changes.
- `pnpm smoke:registry` — spins up a temp consumer project in `os.tmpdir()`, installs `@ghibli/all` against a live `vite preview` of the built registry, and builds — end-to-end contract check.
- `pnpm build:web` — registry build + Vite build. Use this (not `pnpm --filter @ghibli/web build`) for preview/deploy so `/r` is populated.

### Running a single test

Vitest lives in `apps/web`. Filter by file or test name:

```bash
pnpm --filter @ghibli/web test -- src/test/app.test.tsx
pnpm --filter @ghibli/web test -- -t "hand-drawn-frame"
```

E2E specs are in `apps/web/src/test/e2e` — `pnpm --filter @ghibli/web test:e2e -- some.spec.ts`.

## Architecture

### The registry is the public contract

`registry/ghibli/**` is the canonical source of every installable item. `registry.json` is the install manifest. `packages/ui` is **not** the public API — it exists only to re-export registry sources so the docs app, Storybook, and the consumer example can import them ergonomically inside the monorepo (see `packages/ui/src/index.ts`, which reaches into `../../../registry/ghibli/*`).

Consequence: when adding or editing a component, edit it in `registry/ghibli/`, then add its export to `packages/ui/src/index.ts` and its entry to `registry.json`. Run `pnpm registry:build` so `apps/web/public/r/*.json` stays in sync.

`@ghibli/all` is a fileless aggregate registry item — the one-command install for consumers.

Keep optional runtime behavior separate from the base registry items. `@ghibli/theme` should remain the minimal provider/runtime item. `@ghibli/theme-sounds` is an optional add-on and consumers must provide or customize its public audio assets after installation.

### Path aliases

Defined in `tsconfig.base.json` and mirrored in `apps/web/vite.config.ts`:

- `@/components/ui/*` → `registry/ghibli/ui/*`
- `@/components/blocks/*` → `registry/ghibli/blocks/*`
- `@/lib/*` → `registry/ghibli/lib/*`
- `@/*` → repo root

Use these for all internal imports — registry items ship with the same alias shape so the source copies cleanly into a consumer app.

### Showcase-first docs app

`apps/web` is a single-page specimen site. `router.tsx` defines one real route (`HomePage`) and a bunch of redirects: legacy `/components/:name`, `/patterns/:name`, `/guides/*`, `/docs/**` URLs all forward to hash anchors on `/` (e.g. `#component-button`, `#pattern-auth-forms`, `#install`). Don't reintroduce per-component routes — add sections/anchors to the home specimen instead. `legacy-redirects.tsx` handles the slug-to-anchor mapping.

### Monorepo layout

- `apps/web` — Vite + Storybook + Playwright. Also the registry host (serves `public/r/*.json`).
- `packages/ui` — private re-export layer only; no build output and no public npm contract.
- `packages/eslint-config`, `packages/tsconfig` — shared configs.
- `registry/ghibli/{ui,blocks,lib}` — canonical installable sources.
- `examples/consumer-vite` — minimal external-consumer setup; useful for validating that a fresh install renders.
- `scripts/smoke-registry.mjs` — the real end-to-end registry check.

Turbo's `build` task outputs include `apps/web/public/r/**`, so the registry is treated as a first-class build artifact.

### Consumer registry URL

`apps/web/components.json` points `@ghibli` at `http://localhost:4173/r/{name}.json` — the Vite preview port. Running `pnpm build:web && pnpm --filter @ghibli/web preview` locally lets you `shadcn add @ghibli/<name>` against your own build.

## Known gotchas

- `pnpm dev` and `pnpm build:web` both run `registry:build` first. `pnpm --filter @ghibli/web build` does **not** — only use it if you're deliberately skipping the registry rebuild.
- Because `registry:build` cleans `apps/web/public/r` before generating, removed registry items should disappear locally instead of being served as stale JSON.
