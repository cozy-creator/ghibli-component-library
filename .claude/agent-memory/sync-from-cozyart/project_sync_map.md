---
name: Cozy Art ↔ Ghibli style sync map
description: File-to-file mapping between Cozy Art frontend and the Ghibli component library registry, plus gotchas discovered during sync
type: project
---

Source-of-truth repo: a sibling checkout ending in `cozy.art/frontend` (absolute path varies per developer — see the agent's Phase 0 resolution). Target: the Ghibli library at this repo's root.

**Why:** A dedicated sync agent pulls Cozy-Art theme/style changes into the Ghibli registry. Future runs need the canonical path map to diff fast.

**How to apply:** When syncing, diff each pair below and propagate all style/token/CSS-var changes one-to-one. Adapt path/structure if Ghibli's layout differs; never change values.

## Style surface pairs

| Cozy Art | Ghibli |
|---|---|
| `src/index.css` | `apps/web/src/styles/globals.css` (Ghibli adds many `.ghibli-*` utility classes that are not in Cozy — keep them) |
| `src/theme/theme-options.ts` | `registry/ghibli/lib/theme/theme-options.ts` |
| `src/theme/theme-dom.ts` | `registry/ghibli/lib/theme/theme-dom.ts` |
| `src/theme/theme-provider.tsx` | `registry/ghibli/lib/theme/theme-provider.tsx` |
| `src/theme/theme-storage.ts` | `registry/ghibli/lib/theme/theme-storage.ts` |
| `src/theme/theme-types.ts` | `registry/ghibli/lib/theme/theme-types.ts` |
| `src/theme/theme-sound-effects.ts` | `registry/ghibli/lib/theme/theme-sound-effects.ts` |
| `src/theme/theme-sound-effects.test.ts` | `registry/ghibli/lib/theme/theme-sound-effects.test.ts` |
| `src/theme/use-theme.ts` | `registry/ghibli/lib/theme/use-theme.ts` |
| `src/components/layout/Header/ChangeThemeModal.tsx` | `registry/ghibli/blocks/theme/change-theme-modal.tsx` |
| `src/components/layout/Header/ThemeOptionCard.tsx` | `registry/ghibli/blocks/theme/theme-option-card.tsx` |
| `src/components/ui/*.tsx` | `registry/ghibli/ui/*.tsx` (kebab-case names) |
| `src/lib/utils.ts` | `registry/ghibli/lib/utils.ts` (Ghibli adds `createRange`, `clamp`, `useControllableState`, `NavItem`, `MediaItem` — keep) |
| `public/themes/forest/background-main.webp` | `apps/web/public/themes/forest/background-main.webp` |
| `public/theme-previews/*.png` | `apps/web/public/theme-previews/*.png` |
| `src/assets/audio/*.mp3` | `apps/web/public/audio/*.mp3` (adapted: Cozy uses Vite `@/assets` imports, Ghibli uses public URL strings) |

## Gotchas

- `packages/ui/src/index.ts` re-exports all registry sources; it already does `export * from "../../../registry/ghibli/lib/theme"`, so adding to `lib/theme/index.ts` is sufficient.
- `registry.json` must list every lib file explicitly — adding a new `lib/theme/*.ts` file requires an entry there; then `pnpm registry:build` must run.
- Ghibli components use older shadcn patterns (`@radix-ui/react-dialog` direct imports, `export function` not `function ... export { ... }`). Cozy has moved to the new `radix-ui` namespace package and has different export style. **Treat these as pre-existing architectural drift, not style drift — do not replicate.**
- Cozy paints the app chrome via a sibling `.app-backdrop` div inside `RootLayout`, not via `body { background }`. Ghibli's `SiteShell` at `apps/web/src/layouts/site-shell.tsx` mirrors this pattern.
- Ghibli's canonical `--danger-*` vars are backward-compat aliases pointing to `--destructive-*`. Cozy uses `--destructive-*` directly. Keep the aliases in `:root` so older registry consumers don't break.
- `ghibli-forest` theme references `/themes/forest/background-main.webp` — this asset must exist in `apps/web/public/themes/forest/`.
- Audio assets: Cozy imports mp3s via Vite `@/assets/audio/*.mp3`; Ghibli registry consumers need plain URLs. We use `/audio/page-flip.mp3` and `/audio/tree-rustle.mp3` (served from `apps/web/public/audio`).
