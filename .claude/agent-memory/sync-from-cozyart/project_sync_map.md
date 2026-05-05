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
- Audio assets: Cozy imports mp3s via Vite `@/assets/audio/*.mp3`; Ghibli registry consumers need plain URLs. We use `/audio/page-flip.mp3`, `/audio/tree-rustle.mp3`, `/audio/modern-sound.mp3`, `/audio/ocean-bubble.mp3` (served from `apps/web/public/audio`).
- **Theme expansion (May 2026 sync):** Cozy Art now ships 5 themes — `hand-drawn-paper`, `ghibli-forest`, `modern`, `sunset`, `ocean` (note: `ocean`, not `ocean-breeze` — renamed). All five are flagged `available: true`. Ghibli's `theme-types.ts` and `theme-options.ts` were updated to match. The `modern` and `ocean` themes also added new sound effects (`modern-sound.mp3`, `ocean-bubble.mp3`).
- **`--theme-*` token system:** Cozy Art's `index.css` has shifted from per-component hardcoded styles to a comprehensive token system. Each theme block now defines hundreds of `--theme-panel-*`, `--theme-inset-*`, `--theme-field-*`, `--theme-button-*`, `--theme-tabs-*`, `--theme-community-*`, `--theme-nav-*`, `--theme-docs-*`, `--theme-dialog-*`, `--theme-sheet-*`, `--theme-skeleton-*`, `--theme-auth-*`, `--theme-account-*`, `--theme-shell-*`, `--theme-generate-*`, `--theme-media-viewer-*` tokens. Defaults live in `:root`, per-theme overrides per block. `lib/utils.ts` added `panelSurfaceClass`, `insetSurfaceClass`, `fieldSurfaceClass`, `dialogFrameSurfaceClass`, `dialogPrimaryActionClass`. Old `paperSurfaceClass`, `paperInsetClass`, `paperFieldClass` are now aliases to the new tokenized versions for backward-compat.
- **Cross-theme rules:** A block of `html:is([data-theme="modern"], [data-theme="sunset"], [data-theme="ocean"]) ...` rules at the bottom of `globals.css` enables `theme-field-frame` styling and disables hand-drawn-frame SVGs for the new themes. `html[data-theme="sunset|ocean"]` adds `box-shadow: var(--sunset-panel-glow)` / `var(--ocean-panel-glow)` to specific frame variants.
- **Theme images path discrepancy:** Cozy Art's `theme-options.ts` references `previewSrc: "/themes/ocean/ocean-breeze.png"` (uses the full theme background as the picker preview, with a TODO to replace with a dedicated `/theme-previews/ocean.png`). Ghibli has both files — keep mirroring Cozy until they replace it.
- The `:root` block in `globals.css` keeps Ghibli-specific `--spacing`, `--shadow-paper/soft/raised` (used by Ghibli's `.shell-header-layout` and `.ghibli-sheet-content`) alongside Cozy Art's full Shared constants. Don't remove these or Ghibli's sheet/dialog will break.
- The `.ghibli-prose` class was retoken'd to use `var(--theme-docs-*)` tokens instead of hardcoded `--card-foreground` / `--ink-strong`. The duplicate `.ghibli-prose a` and `.ghibli-prose code` rules that were below `.sr-only` were merged into the upper definition.
