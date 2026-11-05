# Paper

A paper texture for a whole page: cream, and a dark `ink` to match. Pre-rendered tiles, so it costs a page no filters and no script.

```css
@import "@cozy-creator/paper/paper.css";

.canvas { background: var(--paper-cream); } /* or class="paper-cream" */
```

Cream averages `#ecdfc7`; ink `#141415`. Keep text at 4.5:1 against the darkest fibres, not only that average.

**How it was made:** every pixel comes from `make_paper.py`, seeded, so running it gives the same files. There's no scan, stock image or model output in here. Its header says how the tiles avoid a visible repeat.

```bash
uv run --no-project --with numpy --with pillow python make_paper.py .
```
