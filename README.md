# Ghibli UI

Registry-first, shadcn-style React components with a soft paper-and-ink visual language.

Ghibli UI is designed for source distribution, not package consumption. Consumers install components with `shadcn add` and copy the source into their own app.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- shadcn registry
- Storybook
- Vitest + Playwright

## Workspace

```text
apps/web            Vite docs app, mockups, and registry host
examples/consumer-vite
packages/ui         Internal re-export layer for local development
packages/eslint-config
packages/tsconfig
registry/ghibli   Canonical public source for installable items
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

`pnpm build:web` generates the registry into `apps/web/public/r` before building the docs app, so preview and deployment always serve the latest registry artifacts.

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
pnpm dlx shadcn@latest add @ghibli/hero-paper
```

The public contract is the registry, not `@ghibli/ui`. `packages/ui` exists only to make local docs, mockups, and Storybook development ergonomic inside the monorepo.
