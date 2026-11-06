# Paper

A paper texture for a whole page: cream, and a dark `ink` to match. Pre-rendered tiles, so it costs a page no filters and no script.

```css
@import "@cozy-creator/paper/paper.css";

.canvas { background: var(--paper-cream); } /* or class="paper-cream" */
```

For a faded blue sky with drifting picture-book clouds, use `--paper-sky`. To have it travel with a canvas, use `class="paper-world"`, which says in `paper.css` how to move it. Clouds drift with `transform` only, and stop under `prefers-reduced-motion`.

**A landscape** in place of the sheet behind a canvas: a sky with the clouds, then mountains, hills and a meadow with trees and a fence, which pan at different rates, the farthest slowest.

```html
<div class="paper-landscape" aria-hidden="true">
  <div class="paper-landscape-sky"></div>
  <div class="paper-landscape-mountains"></div>
  <div class="paper-landscape-hills"></div>
  <div class="paper-landscape-meadow"></div>
</div>
```

For a pan of `dx` px, move each layer by its `--rate` of it with `transform`, wrapped by its own period: its `offsetWidth` less the landscape's. Each is on a layer of its own, so a pan repaints nothing. It sits at the bottom of the window and grows a step on a taller one. The sky is cream paper with the clouds on it, so it replaces `.paper-world` rather than lying over it, and its clouds don't drift: one more layer the size of the window costs a pan drawn without a GPU more than the three of the land. It's for cream, not ink.

Cream averages `#ecdfc7`; ink `#141415`. Keep text at 4.5:1 against the darkest fibres, not only that average. On the landscape, `#3f2f24` text is 6.6:1 against its darkest 1%, and `#625141` 4.5:1 against all but its darkest 5% (its trees).

**How it was made:** every pixel comes from `make_paper.py`, seeded, so running it gives the same files. There's no scan, stock image or model output in here. Its header says how the tiles avoid a visible repeat.

```bash
uv run --no-project --with numpy --with pillow python make_paper.py .
```
