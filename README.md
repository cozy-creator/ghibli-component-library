# Ghibli UI

## Quick Start

Ghibli UI ships as a shadcn registry, components are installed by copying source into your app, not via npm. Add the namespace below to your app's components.json once, then install either the whole set with @ghibli/all or any single item by its name (e.g. @ghibli/button, @ghibli/auth-forms). Every section on this page shows its own install command with a copy button..

1. Make sure your app already has shadcn wired up. If not, run `pnpm dlx shadcn@latest init` and follow its prompts.
2. Add the `@ghibli` namespace to your app's `components.json`:
   ```json
   {
     "registries": {
       "@ghibli": "https://ghibli-component-library.vercel.app//r/{name}.json"
     }
   }
   ```
3. Install components — pick one or more: install either the whole set with @ghibli/all or any single item by its name)
   ```bash
   pnpm dlx shadcn@latest add @ghibli/button       # one component
   pnpm dlx shadcn@latest add @ghibli/auth-forms   # a pattern block
   pnpm dlx shadcn@latest add @ghibli/all          # everything
   ```
   Each command writes the TypeScript source into your project (e.g. `src/components/ui/button.tsx`) and installs any npm peer deps (`clsx`, `tailwind-merge`, Radix primitives…).
4. Import and use:
   ```tsx
   import { Button } from "@/components/ui/button";
   ```
   From here on, that file is yours — edit it freely.

Every showcase section on the docs site displays its own install command with a copy button, so the quickest way to discover what's installable is to browse the live showcase.

### Deploying the registry (maintainers)

1. `pnpm install && pnpm build:web` — produces `apps/web/dist/` (contains `dist/r/*.json`).
2. Pick any static host (GitHub Pages, Cloudflare Pages, Netlify, Vercel, S3…) and deploy `apps/web/dist/`. Build cmd: `pnpm build:web`. Output: `apps/web/dist`.
3. Get your URL (e.g. `https://foo.example.com`). Verify: `curl -sf https://foo.example.com/r/button.json | jq .name` → `"button"`.
4. Update two spots with that URL, then redeploy:
   - [README.md](README.md) install snippet
   - [registry.json:4](registry.json#L4) `homepage` field
5. Share with users — they add to their `components.json`:
   ```json
   { "registries": { "@ghibli": "https://foo.example.com/r/{name}.json" } }
   ```
   and run `pnpm dlx shadcn@latest add @ghibli/all` (or any single component).

That's it. Pick host → deploy → paste URL in 2 files → done.

---

Registry-first, shadcn-style React components with a soft paper-and-ink visual language.

Ghibli UI is designed for **source distribution, not package consumption**. Nothing is published to npm. Consumers install components with `shadcn add`, which fetches the component's JSON from a hosted registry and copies the TypeScript source directly into their own app. From that point on, it's their code — they edit it freely.

- React + TypeScript, Vite, Tailwind CSS v4
- shadcn registry format
- Storybook, Vitest, Playwright

## How It Works

```
  ┌──────────────────────┐     pnpm build:web      ┌───────────────────────────┐
  │ registry/ghibli/**   │  ───────────────────►   │ apps/web/dist/r/*.json    │
  │ registry.json        │                         │ (static site + registry)  │
  └──────────────────────┘                         └──────────────┬────────────┘
                                                                  │ deploy
                                                                  ▼
                                                  ┌───────────────────────────┐
                                                  │ https://<your-domain>     │
                                                  │   /r/button.json etc.     │
                                                  └──────────────┬────────────┘
                                                                 │ fetch
                                                                 ▼
   Consumer repo:                         ┌──────────────────────────────────────┐
     1. Add @ghibli namespace             │ pnpm dlx shadcn@latest               │
        to components.json                │   add @ghibli/button                 │
     2. Run shadcn add                    │ → writes button.tsx into src/...     │
                                          └──────────────────────────────────────┘
```

Two things matter:

1. **You host `/r/*.json` on a public HTTPS URL** (any static host — GitHub Pages, Cloudflare Pages, Netlify, Vercel, S3, Render…).
2. **Consumers point `shadcn` at that URL** and install.

---

## For Consumers — Installing Ghibli UI In Your App

### 1. Add the `@ghibli` registry namespace

In your consumer app's `components.json`:

```json
{
  "registries": {
    "@ghibli": "https://<your-domain>/r/{name}.json"
  }
}
```

Replace `<your-domain>` with wherever this registry is deployed.

### 2. Install components

```bash
# a single component
pnpm dlx shadcn@latest add @ghibli/button

# a grouped pattern (auth forms, marketing sections, etc.)
pnpm dlx shadcn@latest add @ghibli/auth-forms

# everything at once
pnpm dlx shadcn@latest add @ghibli/all
```

`@ghibli/all` is a fileless aggregate item that installs every public component and block in one command. Shadcn resolves peer dependencies (`clsx`, `tailwind-merge`, Radix primitives, etc.) and writes source files into your project's `components/ui/` and sibling paths.

### 3. Use them

Imports follow whatever path alias your app uses — typically:

```tsx
import { Button } from "@/components/ui/button";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
```

---

## For Maintainers — Deploying The Registry

The registry is just a folder of static JSON files under `/r/`. Any static host with HTTPS works.

### 1. Build locally to verify

```bash
pnpm install
pnpm build:web
```

This runs `pnpm registry:build` (which writes `apps/web/public/r/*.json`) and then builds `apps/web/dist/` — a static site that already includes `dist/r/*.json`.

### 2. Choose a host

Any of these work — no assumption is made about which:

- **GitHub Pages** — push `apps/web/dist` to a `gh-pages` branch
- **Cloudflare Pages / Netlify** — connect the repo, set build command `pnpm build:web`, output dir `apps/web/dist`
- **Vercel** — same three fields as above
- **S3 + CloudFront / any bucket** — upload `apps/web/dist/`

CORS must allow `shadcn` to fetch the JSON. Most default static hosts handle this; bare S3 buckets may need an `Access-Control-Allow-Origin: *` header.

### 3. Wire the real URL into the repo

Once the registry is live at `https://<your-domain>`, update two spots so the docs and snippets reflect it:

- [README.md](README.md) — the install snippet near the top of the consumer section
- [registry.json:4](registry.json#L4) — the `homepage` field (currently a placeholder)

Then re-run `pnpm build:web` and redeploy.

### 4. Verify

```bash
# the JSON artifact is publicly fetchable
curl -sf https://<your-domain>/r/button.json | jq .name
# → "button"

# full install loop against the live URL, in a temp app
mkdir /tmp/ghibli-check && cd /tmp/ghibli-check
pnpm create vite@latest app -- --template react-ts
cd app && pnpm install
pnpm dlx shadcn@latest init
# edit components.json to add "@ghibli": "https://<your-domain>/r/{name}.json"
pnpm dlx shadcn@latest add @ghibli/button
# confirm src/components/ui/button.tsx appears

# repo-local smoke test (spins up its own preview server)
pnpm smoke:registry
```

### 5. Keep the host in sync on every change

Each time you edit `registry/ghibli/**` or `registry.json`, the built `/r/*.json` needs to be refreshed on the host. Two options:

- **Git-integrated hosts** (GitHub Pages Action, Cloudflare Pages, Netlify, Vercel): configure them to run `pnpm build:web` on every push to `main` and publish `apps/web/dist/` — nothing to maintain in the repo.
- **Manual hosts**: add a CI job or local script that uploads `apps/web/dist/` after `pnpm build:web`.

---

## Local Development

### Setup

```bash
pnpm install
pnpm dev            # showcase app on the default Vite port
pnpm dev:storybook  # isolated component inspection
```

`pnpm dev` runs `registry:build` first so `/r/*.json` is in sync with the current source.

### Workspace layout

```text
apps/web                Vite showcase app + registry host (serves public/r/*.json)
examples/consumer-vite  Minimal in-monorepo consumer example
packages/ui             Internal re-export layer (not published; dev ergonomics only)
packages/eslint-config  Shared ESLint config
packages/tsconfig       Shared tsconfig base
registry/ghibli/        Canonical installable sources — { ui, blocks, lib }
registry.json           shadcn registry manifest (the install contract)
scripts/                Smoke-test and build helpers
```

### Adding or editing a component

1. Edit the source in `registry/ghibli/ui/<name>.tsx` (or `blocks/<name>.tsx`).
2. Add the export to `packages/ui/src/index.ts` so the docs app and Storybook can import it.
3. Add or update its entry in `registry.json`.
4. Run `pnpm registry:build` so `apps/web/public/r/` stays in sync.

### Path aliases

Defined in `tsconfig.base.json`, mirrored in `apps/web/vite.config.ts`:

- `@/components/ui/*` → `registry/ghibli/ui/*`
- `@/components/blocks/*` → `registry/ghibli/blocks/*`
- `@/lib/*` → `registry/ghibli/lib/*`
- `@/*` → repo root

Registry items ship with this same alias shape, so source copies cleanly into a consumer app.

### Commands

```bash
pnpm dev              # showcase app (registry:build then vite)
pnpm dev:storybook    # Storybook
pnpm typecheck        # tsc across workspace
pnpm lint             # eslint across workspace
pnpm test             # vitest unit tests
pnpm test:e2e         # Playwright, builds + previews first
pnpm build:web        # registry:build then vite build → apps/web/dist
pnpm build:storybook  # static Storybook build
pnpm registry:build   # shadcn build → apps/web/public/r/*.json
pnpm smoke:registry   # end-to-end: temp project installs @ghibli/all and builds
```

### Quality gates before handoff

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build:web
pnpm build:storybook
pnpm smoke:registry
```

---

## The Consumer Example

`examples/consumer-vite` is a minimal app that renders a few components with the scenic theme applied. It imports from `@ghibli/ui` using the workspace protocol — so it validates that the _components_ work, not the _registry install flow_ (that's what `pnpm smoke:registry` is for).

```bash
pnpm --filter @ghibli/consumer-vite dev
pnpm --filter @ghibli/consumer-vite build
```

---

## Notes

- **The public contract is the registry, not `@ghibli/ui`.** `packages/ui` exists only to make local docs, Storybook, and the consumer example ergonomic inside the monorepo. It is not published and should not be imported by external apps.
- **Nothing is published to npm.** All workspace packages are `private: true` by design. Consumers get source files via `shadcn add`, never an npm dependency.
- **The docs app is a single anchored specimen page.** Every component, pattern, and guide lives on one route; legacy per-component URLs redirect to hash anchors.
