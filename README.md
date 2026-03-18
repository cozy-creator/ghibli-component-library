# Ghibli UI

Registry-first, shadcn-style React components with a soft paper-and-ink visual language.

Ghibli UI is designed for source distribution, not package consumption. Consumers install components with `shadcn add`, copy the source into their app, and customize it there.

The repository is organized around a documentation-first workflow:

- `apps/web` is the primary docs experience
- Storybook is the secondary isolated demo surface
- `registry/ghibli` is the canonical public source
- `registry.json` is the install contract

## What You Get

- Installable scenic primitives such as buttons, cards, fields, tabs, overlays, and tooltips
- Grouped patterns such as auth forms, marketing sections, account sections, and generation controls
- A docs app with guides, searchable indexes, detail pages, and examples
- Storybook grouped by `Foundations`, `Components`, `Patterns`, and `Examples`

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- shadcn registry
- Storybook
- Vitest + Playwright

## Workspace

```text
apps/web            Vite docs app and registry host
examples/consumer-vite  Minimal consumer usage example
packages/ui         Internal re-export layer for local development
packages/eslint-config
packages/tsconfig
registry/ghibli     Canonical public source for installable items
scripts             Smoke and build helpers
registry.json       shadcn registry manifest
```

## Commands

```bash
pnpm install
pnpm dev
pnpm dev:storybook
pnpm typecheck
pnpm lint
pnpm test
pnpm build:web
pnpm build:storybook
pnpm smoke:registry
```

`pnpm dev` starts the docs app. `pnpm dev:storybook` starts Storybook.

`pnpm build:web` generates the registry into `apps/web/public/r` before building the docs app, so preview and deployment always serve the latest registry artifacts.

## Running The Project

Install dependencies once:

```bash
pnpm install
```

Run the docs app:

```bash
pnpm dev
```

Run Storybook:

```bash
pnpm dev:storybook
```

The docs app is the main public experience. Storybook is useful when you want to inspect isolated states or compare variants quickly.

## Registry Usage

Add this namespace to a consumer `components.json`:

```json
{
  "registries": {
    "@ghibli": "https://<your-domain>/r/{name}.json"
  }
}
```

Then install items with:

```bash
pnpm dlx shadcn@latest add @ghibli/button
pnpm dlx shadcn@latest add @ghibli/marketing-sections
```

Always install the style item first:

```bash
pnpm dlx shadcn@latest add @ghibli/style
```

Then add only the components or patterns your app actually needs.

## Documentation Structure

The docs app is structured like a shareable library site:

- `Home`: overview, featured items, and example entry points
- `Guides`: getting started, installation, theming, registry usage, and development
- `Components`: searchable primitive index and detail pages
- `Patterns`: searchable grouped-block index and detail pages
- `Examples`: small reusable example compositions

Each component or pattern page includes:

- preview
- install command
- import snippet
- usage snippet
- examples
- notes
- related items

## Consumer Example

`examples/consumer-vite` shows a minimal local consumer setup with the scenic theme applied and a few components rendered together.

Useful commands:

```bash
pnpm --filter @ghibli/consumer-vite dev
pnpm --filter @ghibli/consumer-vite build
```

## Quality Gates

Use these before publishing or handing off the repo:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build:web
pnpm build:storybook
pnpm smoke:registry
```

## Notes

The public contract is the registry, not `@ghibli/ui`. `packages/ui` exists only to make local docs, Storybook, and example development ergonomic inside the monorepo.
