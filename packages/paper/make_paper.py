"""Makes this package's textures. Every pixel comes from here: no scan, no stock image, no model.

    uv run --no-project --with numpy --with pillow python make_paper.py [out dir]

Same seed, same files. Each tile wraps: noise is shaped in frequency space, which is periodic, and each fibre is drawn at every
wrapped position. Every tile repeats on 2048 px, so `.paper-world` can wrap by that much as it pans and nothing jumps. The eye finds a lattice by what's
large and what stands out, so the 512 px tile holds neither: its fibres and grain have every wavelength over 48 px taken out, which is
why it shows no grid even at 25%. Flecks are on 1024, and clouds of formation on a tile of their own, 128 px and drawn at 2048, as they
hold nothing fine.

The sky is a blue wash that comes and goes down the sheet, and one tile of picture-book clouds that paper.css drifts.

The landscape is a sky (the cream sheet with the sky's clouds on it, in paper.css) and three layers over it, each a tile that wraps across
only, each painted on the cream sheet itself (tooth, flecks and all), so where one hides the sky it shows the same paper: mountains repeat on 6144 px, hills on 4096 and the meadow on 3072, each wider than a
4K window at the size it's drawn there, and as each pans at its own rate, the three rarely line up as they did. Each one's foot eases to
a single tone, and a tile of that tone on the sheet (`-fill`) goes on below it, so a pan up or down that moves the layers apart shows
more of a layer and never its edge.
"""

import sys
from collections.abc import Callable, Sequence
from typing import TypeAlias, TypedDict, Unpack

import numpy as np
import numpy.typing as npt
from PIL import Image, ImageDraw, ImageFilter

SHEET = 512
FLECKS = 1024
CLOUDS = 128
PERIOD = 2048
SKY_WIDTH = PERIOD
SKY_HEIGHT = 600
SKY_TOP = 40
SKY_FAR_DOWN = 230
SKY_FAR_ACROSS = 700
SKY_FAR_FAINT = 0.6
SKY_CLOUDS = ((180, 300, 430), (660, 170, 300), (1080, 410, 520), (1500, 230, 270), (1840, 450, 340))
SCALE = 3
# Each landscape layer's tile, in CSS px at the landscape's own scale 1: how far it goes before it repeats, and how tall. Drawn at
# LAND_SCALE tile px to a CSS px, so it's sharp on a 2x screen where it's sharp enough to need it.
LAND_SIZE = {"mountains": (6144, 280), "hills": (4096, 190), "meadow": (3072, 224)}
LAND_SCALE = {"mountains": 1, "hills": 1.5, "meadow": 2}

Field: TypeAlias = npt.NDArray[np.float64]
Rgb: TypeAlias = tuple[int, int, int]
Points: TypeAlias = list[tuple[float, float]]


class Line(TypedDict):
    fill: int
    width: int


def band(rng: np.random.Generator, size: int, low: float, high: float) -> Field:
    """Noise holding only wavelengths between 1/high and 1/low px, at unit deviation."""
    fy, fx = np.meshgrid(np.fft.fftfreq(size), np.fft.fftfreq(size), indexing="ij")
    radius = np.hypot(fx, fy)
    shaped = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((size, size))) * ((radius > low) & (radius < high))))
    return shaped / shaped.std()


def stroke(rng: np.random.Generator, size: int, length: float) -> Points:
    """A wandering stroke, as tile pixels: a fibre never runs straight."""
    x: float
    y: float
    x, y = rng.uniform(0, size, 2)
    heading = rng.uniform(0, 2 * np.pi)
    bend = rng.uniform(-0.09, 0.09)
    points = [(x, y)]
    for _ in range(int(length / 3)):
        heading += bend + rng.normal(0, 0.1)
        x += np.cos(heading) * 3
        y += np.sin(heading) * 3
        points.append((x, y))
    return points


def wrapped(draw: ImageDraw.ImageDraw, points: Sequence[tuple[float, float]], size: int, **line: Unpack[Line]) -> None:
    for dx in (-size, 0, size):
        for dy in (-size, 0, size):
            draw.line([((x + dx) * SCALE, (y + dy) * SCALE) for x, y in points], **line)


def fibres(rng: np.random.Generator, size: int, count: int, shortest: float, longest: float, blur: float = 0.8) -> Field:
    """Coverage of `count` fibres, 0 to 1, supersampled so a thin one is faint rather than jagged."""
    canvas = Image.new("L", (size * SCALE, size * SCALE), 0)
    draw = ImageDraw.Draw(canvas)
    for _ in range(count):
        wrapped(draw, stroke(rng, size, rng.uniform(shortest, longest)), size, fill=int(rng.uniform(120, 255)), width=int(rng.integers(2, 4)))
    soft = canvas.filter(ImageFilter.GaussianBlur(blur * SCALE / 2)).resize((size, size), Image.Resampling.BOX)
    return np.asarray(soft, dtype=np.float64) / 255


def fine(field: Field, size: int, shortest: float = 1 / 48) -> Field:
    """`field` with every wavelength over 48 px taken out: what a grid would be seen in, from far off."""
    fy, fx = np.meshgrid(np.fft.fftfreq(size), np.fft.fftfreq(size), indexing="ij")
    return np.real(np.fft.ifft2(np.fft.fft2(field) * (np.hypot(fx, fy) > shortest)))


def tooth(rng: np.random.Generator, size: int) -> Field:
    """Cold-press tooth, as light from the top left finds it: bumps of a few px with a bright side and a shadowed one. It's what makes
    a sheet read as paper from across a room, where a 1 px fibre on a 4K screen is gone."""
    bumps = band(rng, size, 1 / 11, 1 / 3)
    lit = bumps - np.roll(bumps, (1, 1), axis=(0, 1))
    return lit / lit.std()


def height(rng: np.random.Generator, size: int) -> Field:
    """How the sheet catches light: tooth and grain, and fibres lying on it."""
    return fine(
        4.4 * tooth(rng, size)
        + 1.0 * band(rng, size, 0.2, 0.5)
        + 15 * fibres(rng, size, 520, 14, 80)
        - 11 * fibres(rng, size, 380, 10, 60),
        size,
    )


def sheet(rng: np.random.Generator, base: Rgb, tint: tuple[float, float, float], gain: float, out: str) -> None:
    relief = height(rng, SHEET)
    relief -= relief.mean()
    pixels = np.array(base, dtype=np.float64) + relief[..., None] * np.array(tint) * gain
    Image.fromarray(np.clip(pixels, 0, 255).round().astype("uint8")).save(out, quality=80, method=6)


def flecks(rng: np.random.Generator, colour: Rgb, strength: float, out: str) -> None:
    """Small, sparse flecks, on nothing. `strength` scales their alpha, 0 to 1."""
    canvas = Image.new("L", (FLECKS * SCALE, FLECKS * SCALE), 0)
    draw = ImageDraw.Draw(canvas)
    for _ in range(150):
        wrapped(draw, stroke(rng, FLECKS, rng.uniform(4, 15)), FLECKS, fill=int(rng.uniform(70, 170)), width=int(rng.integers(1, 3)))
    x: float
    y: float
    for _ in range(320):
        x, y = rng.uniform(0, FLECKS, 2)
        wrapped(draw, [(x, y), (x + rng.uniform(0.4, 1.6), y + rng.uniform(-0.8, 0.8))], FLECKS, fill=int(rng.uniform(110, 230)), width=int(rng.integers(2, 5)))
    alpha = canvas.filter(ImageFilter.GaussianBlur(SCALE * 0.28)).resize((FLECKS, FLECKS), Image.Resampling.BOX)
    tile(colour, alpha.point(lambda value: int(value * strength) & 0xf0), out)


def clouds(rng: np.random.Generator, colour: Rgb, strength: float, out: str) -> None:
    """Soft clouds of formation, on nothing. `strength` is alpha, 0 to 255."""
    alpha = np.clip(band(rng, CLOUDS, 0.02, 0.16) * 0.5 + 1.0, 0, 2) * strength
    tile(colour, Image.fromarray(alpha.round().astype("uint8")), out)


def tile(colour: Rgb, alpha: Image.Image, out: str) -> None:
    layer = Image.merge("RGBA", (*(Image.new("L", alpha.size, channel) for channel in colour), alpha))
    layer.save(out, lossless=True, quality=100, method=6, exact=False)


def wide_band(rng: np.random.Generator, height: int, width: int, low: float, high: float) -> Field:
    """`band`, wrapping across a tile that isn't square."""
    fy, fx = np.meshgrid(np.fft.fftfreq(height), np.fft.fftfreq(width), indexing="ij")
    radius = np.hypot(fx, fy)
    shaped = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((height, width))) * ((radius > low) & (radius < high))))
    return shaped / shaped.std()


def blur(field: Field, radius: float) -> Field:
    """`field`, from 0 to 1, softened."""
    return np.asarray(Image.fromarray((field * 255).round().astype("uint8")).filter(ImageFilter.GaussianBlur(radius)), dtype=np.float64) / 255


def puffs(rng: np.random.Generator) -> Field:
    """Where the clouds are, as coverage: each a row of round puffs on a flat base, drawn at every wrapped position so the tile joins."""
    width, height = SKY_WIDTH * 2, SKY_HEIGHT * 2
    canvas = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(canvas)
    for x, base, wide in SKY_CLOUDS:
        x, base, wide = x * 2, base * 2, wide * 2
        count = max(5, wide // 84)
        t: float
        for shift in (-width, 0, width):
            for t in np.linspace(0, 1, count):
                rise = np.sin(np.pi * t) ** 0.6
                radius = wide * 0.15 * rise * rng.uniform(0.72, 1.2) + 26
                cx = x + shift + (t - 0.5) * wide * 0.92
                cy = base - radius * 0.72
                draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=255)
            draw.ellipse((x + shift - wide * 0.5, base - wide * 0.09, x + shift + wide * 0.5, base + wide * 0.02), fill=255)
    return np.asarray(canvas, dtype=np.float64) / 255


def wobble(rng: np.random.Generator, field: Field, reach: float = 12) -> Field:
    """Moves each pixel up to about `reach` px, so an edge is drawn and not compass-true."""
    height: int
    width: int
    height, width = field.shape
    dy = (wide_band(rng, height, width, 0.0012, 0.008) * reach).round().astype(int)
    dx = (wide_band(rng, height, width, 0.0012, 0.008) * reach).round().astype(int)
    rows, columns = np.indices(field.shape)
    return field[np.clip(rows + dy, 0, height - 1), (columns + dx) % width]


def sky_clouds(rng: np.random.Generator, out: str) -> None:
    """Picture-book clouds, on nothing: a thin wash of white, shade pooled under each, and a broken pencil line round it."""
    shape = wobble(rng, puffs(rng))
    soft = blur(blur(shape, 3), 2)
    under = np.clip(soft - blur(np.roll(shape, -70, axis=0), 26), 0, 1)
    line = np.clip(soft * (1 - soft) * 4, 0, 1) * np.clip(wide_band(rng, *soft.shape, 0.004, 0.03) * 0.5 + 0.75, 0, 1)  # type: ignore[call-arg, operator]  # shape: height, width; operator: mypy echoes call-arg through numpy's overloaded *
    wash = np.array([255, 253, 244], dtype=np.float64)
    shade = np.array([186, 207, 226], dtype=np.float64)
    pencil = np.array([96, 124, 152], dtype=np.float64)
    mix = (under * 0.5)[..., None]
    colour = wash * (1 - mix) + shade * mix
    amount = (line * 0.7)[..., None]
    colour = colour * (1 - amount) + pencil * amount
    alpha = np.maximum(soft * 0.3, line * 0.34)
    premultiplied = np.dstack((colour * alpha[..., None], alpha * 255))
    small = Image.fromarray(np.clip(premultiplied, 0, 255).round().astype("uint8"), "RGBa").resize((SKY_WIDTH, SKY_HEIGHT), Image.Resampling.LANCZOS)
    tile = Image.new("RGBa", (PERIOD, PERIOD), (0, 0, 0, 0))
    tile.paste(small, (0, SKY_TOP))
    near = np.asarray(tile, dtype=np.float64)
    # A fainter set behind, in the same tile: a second drifting layer of its own costs more to composite than it's worth.
    far = np.roll(near, (SKY_FAR_DOWN, SKY_FAR_ACROSS), axis=(0, 1)) * SKY_FAR_FAINT
    both = near + far * (1 - near[..., 3:] / 255)
    Image.fromarray(np.clip(both, 0, 255).round().astype("uint8"), "RGBa").convert("RGBA").save(out, quality=60, alpha_quality=62, method=6)


def sky_wash(rng: np.random.Generator, out: str) -> None:
    """The blue, coming and going down the sheet and strongest behind the clouds, a little uneven as a brush leaves it. Soft, so it's small."""
    width, height = 192, 192
    down = np.arange(height)[:, None] / height
    fade = (0.5 + 0.5 * np.cos(2 * np.pi * (down - 0.16))) ** 2.2
    uneven = np.clip(1 + wide_band(rng, height, width, 0.006, 0.03) * 0.08, 0, 2)
    alpha = np.clip(fade * uneven * 0.3, 0, 1) * 255
    layer = Image.merge("RGBA", (*(Image.new("L", (width, height), channel) for channel in (0x7f, 0xb6, 0xeb)), Image.fromarray(alpha.round().astype("uint8"))))
    layer.save(out, quality=70, alpha_quality=80, method=6)


def line(rng: np.random.Generator, width: int, longest: float, shortest: float) -> Field:
    """Noise along a line that wraps, holding only wavelengths between `shortest` and `longest` px, at unit deviation."""
    frequency = np.fft.rfftfreq(width)
    shaped = np.fft.irfft(np.fft.rfft(rng.standard_normal(width)) * ((frequency > 1 / longest) & (frequency < 1 / shortest)), width)
    return shaped / shaped.std()


def across(x: npt.NDArray[np.int_], at: np.float64, width: int) -> Field:
    """How far each of `x` is from `at`, the short way round a tile `width` wide."""
    return (x - at + width / 2) % width - width / 2


def peaks(rng: np.random.Generator, width: int, count: int, low: float, high: float, broad: tuple[float, float]) -> Field:
    """A range of mountains: pointed, a little rounded at the top, slopes that fall away concave, the tallest wins where two meet."""
    x = np.arange(width)
    ridge = np.zeros(width)
    at: np.float64
    for at in np.sort(rng.uniform(0, width, count)):
        tall, wide = rng.uniform(low, high), rng.uniform(*broad)
        reach = np.sqrt(across(x, at, width) ** 2 + 30**2) - 30
        ridge = np.maximum(ridge, tall * np.clip(1 - reach / wide, 0, 1) ** 1.4)
    return ridge


def edge(depth: Field, soft: float) -> Field:
    """Coverage of a wash whose edge is `depth` px away, below it positive: softened over `soft` px, as wet paint stops."""
    return np.clip(0.5 + depth / (2 * soft), 0, 1)


def pigment(paper: Field, colour: Rgb, amount: Field) -> Field:
    """`paper` (rows, columns, rgb) with a wash of `colour` at `amount` (rows, columns), 0 to 1, laid over it: the paper's tooth shows
    through, as the colour scales it rather than covering it."""
    flat = np.array([0xef, 0xe3, 0xcb], dtype=np.float64)
    return paper * (1 + amount[..., None] * (np.array(colour, dtype=np.float64) / flat - 1))


def granulate(rng: np.random.Generator, height: int, width: int, scale: float) -> Field:
    """Pigment settling in the paper's hollows: fine, uneven, at unit deviation."""
    return wide_band(rng, height, width, 1 / (5 * scale), 1 / (1.6 * scale))


def paper_under(cream: Image.Image, flecks: Image.Image, height: int, width: int, scale: float) -> Field:
    """The cream sheet, flecks and all, at `scale` tile px to its px: what each landscape layer is painted on, so where it hides the
    sheet it shows the same paper."""
    wide, down = int(np.ceil(width / scale / FLECKS)) + 1, int(np.ceil(height / scale / FLECKS)) + 1
    tiled = Image.new("RGBA", (FLECKS * wide, FLECKS * down))
    for i in range(wide * FLECKS // SHEET):
        for j in range(down * FLECKS // SHEET):
            tiled.paste(cream, (i * SHEET, j * SHEET))
    for i in range(wide):
        for j in range(down):
            tiled.alpha_composite(flecks, (i * FLECKS, j * FLECKS))
    tiled = tiled.resize((round(tiled.width * scale), round(tiled.height * scale)), Image.Resampling.BICUBIC)
    return np.asarray(tiled.convert("RGB"), dtype=np.float64)[:height, :width]


def pencil(rng: np.random.Generator, colour: Field, shape: Field, ink: Rgb, strength: float) -> Field:
    """`colour` with a broken pencil line round `shape`, a coverage softened at its edge, as the sky's clouds have."""
    height: int
    width: int
    height, width = shape.shape
    stroke = np.clip(shape * (1 - shape) * 4, 0, 1) * np.clip(wide_band(rng, height, width, 0.002, 0.02) * 0.6 + 0.6, 0, 1) * strength
    return colour * (1 - stroke[..., None]) + np.array(ink, dtype=np.float64) * stroke[..., None]


def save_layer(colour: Field, alpha: Field, out: str, paper: Field, scale: float) -> None:
    """The layer, its foot eased over its last 40 px to one tone on the sheet, and that tone below it as `<out>-fill`: a tile a pan up
    shows beneath the layer, so the layer goes on down with no edge."""
    height: int = colour.shape[0]
    tone = colour[-round(6 * scale):].reshape(-1, 3).mean(axis=0)
    toward = np.clip((np.arange(height) - (height - 40 * scale)) / (40 * scale), 0, 1)[:, None, None] ** 2
    colour = colour * (1 - toward) + paper * (tone / paper.reshape(-1, 3).mean(axis=0)) * toward
    rgba = np.dstack((np.clip(colour, 0, 255), np.clip(alpha, 0, 1) * 255)).round().astype("uint8")
    Image.fromarray(rgba, "RGBA").save(f"{out}.webp", quality=82, alpha_quality=90, method=6)
    sheet = np.asarray(Image.open(out.rsplit("/", 1)[0] + "/cream.webp").convert("RGB"), dtype=np.float64)
    below = sheet * (tone / sheet.reshape(-1, 3).mean(axis=0))
    Image.fromarray(np.clip(below, 0, 255).round().astype("uint8")).save(f"{out}-fill.webp", quality=82, method=6)


def mountains(rng: np.random.Generator, paper: Field, out: str) -> None:
    """Far mountains in blue-grey, a paler range behind a nearer one: a lit face to the upper left and a shaded one, a little snow on
    the tallest, and haze toward their feet."""
    scale, (width, height) = LAND_SCALE["mountains"], LAND_SIZE["mountains"]
    width, height = round(width * scale), round(height * scale)
    rows = np.arange(height)[:, None]
    colour, cover = paper, np.zeros((height, width))
    for faint, low, high, count in ((0.5, 120, 225, 9), (1.0, 60, 190, 14)):
        ridge = peaks(rng, width, count, low * scale, high * scale, (320 * scale, 760 * scale))
        ridge += line(rng, width, 1200 * scale, 300 * scale) * 6 * scale + line(rng, width, 320 * scale, 60 * scale) * 2 * scale
        depth = rows - (height - 45 * scale - ridge)[None, :]
        here = edge(depth, 1.2 * scale)
        slope = np.convolve(np.pad(np.gradient(ridge), 40, mode="wrap"), np.ones(81) / 81, "valid")
        shaded = np.clip(0.5 - slope * 3, 0, 1)[None, :] * np.exp(-np.clip(depth, 0, None) / (90 * scale))
        snow = np.clip((ridge[None, :] - 175 * scale) / (30 * scale), 0, 1) * np.clip(1 - depth / (24 * scale), 0, 1)
        haze = np.clip(1 - depth / (200 * scale), 0.4, 1)
        amount = (0.36 + 0.34 * shaded) * haze * (1 + 0.07 * wide_band(rng, height, width, 1 / (500 * scale), 1 / (60 * scale)))
        amount = faint * (amount * (1 - 0.65 * snow) + 0.12 * np.exp(-np.clip(depth, 0, None) / (3 * scale)))
        amount *= 1 + 0.05 * granulate(rng, height, width, scale)
        colour = colour * (1 - here[..., None]) + pigment(paper, (0xa2, 0xb0, 0xc4), np.clip(amount, 0, 1)) * here[..., None]
        cover = np.maximum(cover, here)
    save_layer(colour, cover, out, paper, scale)


def bushes(rng: np.random.Generator, width: int, height: int, scale: float, count: int, low: float, high: float, size: float,
           ground: Field) -> Field:
    """Round bushes and trees of a few puffs each along `ground` (a row per column), as coverage, drawn at every wrapped position."""
    canvas = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(canvas)
    at: float
    for at in rng.uniform(0, width, count):
        crown = rng.uniform(low, high) * scale
        base: float = ground[int(at) % width]
        for _ in range(int(rng.integers(3, 6))):
            radius = crown * rng.uniform(0.45, 0.7)
            cx = at + rng.uniform(-0.5, 0.5) * crown
            cy = base - crown * rng.uniform(0.35, 0.9) * size
            for shift in (-width, 0, width):
                draw.ellipse((cx + shift - radius, cy - radius, cx + shift + radius, cy + radius), fill=255)
    return np.asarray(canvas, dtype=np.float64) / 255


def hills(rng: np.random.Generator, paper: Field, out: str) -> None:
    """Rolling sage hills, darker where the wash stopped at their crest, a few bushes on them, and lighter as they near the meadow."""
    scale, (width, height) = LAND_SCALE["hills"], LAND_SIZE["hills"]
    width, height = round(width * scale), round(height * scale)
    ridge = line(rng, width, 2400 * scale, 500 * scale) * 16 * scale + line(rng, width, 420 * scale, 120 * scale) * 4 * scale
    top = (height - 134 * scale - ridge).round()
    rows = np.arange(height)[:, None]
    depth = rows - top[None, :]
    clumps = bushes(rng, width, height, scale, 26, 8, 20, 0.8, top + 6 * scale)
    cover = np.maximum(edge(depth, 1.2 * scale), blur(clumps, 1.2 * scale))
    amount = 0.54 * np.clip(1 - depth / (260 * scale), 0.55, 1) * (1 + 0.08 * wide_band(rng, height, width, 1 / (600 * scale), 1 / (80 * scale)))
    amount += 0.12 * np.exp(-np.clip(depth, 0, None) / (4 * scale)) + 0.22 * blur(clumps, 2 * scale) * (depth < 4 * scale)
    amount *= 1 + 0.05 * granulate(rng, height, width, scale)
    colour = pencil(rng, pigment(paper, (0xa6, 0xb8, 0x92), np.clip(amount, 0, 1)), cover, (0x6e, 0x7c, 0x62), 0.25)
    save_layer(colour, cover, out, paper, scale)


def tree(draw: dict[str, ImageDraw.ImageDraw], rng: np.random.Generator, x: float, ground: float, scale: float) -> None:
    """A picture-book tree into `draw`'s layers: a short trunk, a crown of round puffs, and where light finds it, at its top left."""
    tall = rng.uniform(46, 78) * scale
    wide = tall * rng.uniform(0.55, 0.75)
    trunk = 3.2 * scale
    draw["trunk"].polygon([(x - trunk, ground), (x + trunk, ground), (x + trunk * 0.6, ground - tall * 0.55), (x - trunk * 0.6, ground - tall * 0.55)], fill=255)
    middle = ground - tall * 0.62
    for _ in range(int(rng.integers(6, 10))):
        radius = wide * rng.uniform(0.32, 0.5)
        cx, cy = x + rng.uniform(-0.45, 0.45) * wide, middle + rng.uniform(-0.55, 0.3) * tall * 0.5
        draw["crown"].ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=255)
        draw["lit"].ellipse((cx - radius * 1.05, cy - radius * 1.1, cx + radius * 0.55, cy + radius * 0.45), fill=255)


def fence(draw: ImageDraw.ImageDraw, x: float, ground: Callable[[float], float], posts: int, scale: float) -> None:
    """A run of posts and two rails, following the ground."""
    gap = 26 * scale
    for i in range(posts):
        at = x + i * gap
        g = ground(at)
        draw.line([(at, g + 2 * scale), (at + 0.6 * scale, g - 17 * scale)], fill=255, width=max(1, round(2.2 * scale)))
        if i:
            for rail in (7, 13):
                draw.line([(at - gap, ground(at - gap) - rail * scale), (at, g - rail * scale)], fill=255, width=max(1, round(1.3 * scale)))


def meadow(rng: np.random.Generator, paper: Field, out: str) -> None:
    """The meadow nearest: a warm green line with trees in twos and threes and a fence."""
    scale, (width, height) = LAND_SCALE["meadow"], LAND_SIZE["meadow"]
    width, height = round(width * scale), round(height * scale)
    ridge = line(rng, width, 2400 * scale, 700 * scale) * 9 * scale + line(rng, width, 300 * scale, 60 * scale) * 1.6 * scale
    top = height - 118 * scale - ridge
    rows = np.arange(height)[:, None]
    depth = rows - top[None, :]
    layers = {name: Image.new("L", (width, height), 0) for name in ("trunk", "crown", "lit", "fence")}
    draw = {name: ImageDraw.Draw(layer) for name, layer in layers.items()}
    ground: Callable[[float], float] = lambda at: float(top[int(round(at)) % width])
    group: float
    at: float
    for group in np.sort(rng.uniform(0, width, 5)):
        for at in group + np.cumsum(rng.uniform(30, 80, int(rng.integers(1, 4))) * scale):
            for shift in (-width, 0, width):
                tree(draw, np.random.default_rng(int(at * 7) % 100000), at + shift, ground(at) + 3 * scale, scale)
    start = rng.uniform(0, width)
    for shift in (-width, 0, width):
        fence(draw["fence"], start + shift, lambda at: ground(at - shift) + 4 * scale, 14, scale)
    trunk, crown, lit, rails = (np.asarray(layers[name], dtype=np.float64) / 255 for name in ("trunk", "crown", "lit", "fence"))
    crown = wobble(rng, blur(crown, 0.8 * scale), 2 * scale)
    lit = blur(lit * crown, 3 * scale)
    ground_cover = edge(depth, 1.2 * scale)
    amount = 0.52 * (1 + 0.06 * wide_band(rng, height, width, 1 / (500 * scale), 1 / (60 * scale)))
    amount += 0.16 * np.exp(-np.clip(depth, 0, None) / (4 * scale))
    amount *= 1 + 0.06 * granulate(rng, height, width, scale)
    colour = pigment(paper, (0xb7, 0xc0, 0x8a), np.clip(amount, 0, 1))
    tree_amount = np.clip(0.62 - 0.25 * lit + 0.08 * granulate(rng, height, width, scale), 0, 1)
    colour = colour * (1 - crown[..., None]) + pigment(paper, (0x93, 0xa8, 0x7a), tree_amount) * crown[..., None]
    wood = np.clip(trunk * (1 - crown) + rails * 0.8, 0, 1)
    colour = colour * (1 - wood[..., None]) + pigment(paper, (0x9a, 0x86, 0x6a), np.full(wood.shape, 0.9)) * wood[..., None]
    colour = pencil(rng, colour, np.maximum(edge(depth, 1.2 * scale), crown), (0x6a, 0x76, 0x58), 0.26)
    save_layer(colour, np.maximum(ground_cover, np.maximum(crown, wood)), out, paper, scale)


def landscape_sky(rng: np.random.Generator, out: str) -> None:
    """The sky over the landscape: blue at the top of the window, paling toward the hills, unevenly, as a brush leaves it. Drawn the
    window's height, so small."""
    width, height = 192, 192
    down = np.arange(height)[:, None] / height
    fade = np.interp(down, (0, 0.3, 0.6, 0.78, 1), (1, 0.8, 0.38, 0.16, 0.12))
    uneven = np.clip(1 + wide_band(rng, height, width, 0.006, 0.03) * 0.08, 0, 2)
    alpha = np.clip(fade * uneven * 0.3, 0, 1) * 255
    layer = Image.merge("RGBA", (*(Image.new("L", (width, height), channel) for channel in (0x7f, 0xb6, 0xeb)), Image.fromarray(alpha.round().astype("uint8"))))
    layer.save(out, quality=70, alpha_quality=80, method=6)


def landscape(out: str) -> None:
    """The landscape's three layers, painted on the cream sheet as it is in `out`."""
    cream, flecks = Image.open(f"{out}/cream.webp").convert("RGBA"), Image.open(f"{out}/cream-flecks.webp").convert("RGBA")
    for name, paint, seed in (("mountains", mountains, 9), ("hills", hills, 10), ("meadow", meadow, 11)):
        (width, height), scale = LAND_SIZE[name], LAND_SCALE[name]
        paper = paper_under(cream, flecks, round(height * scale), round(width * scale), scale)
        paint(np.random.default_rng(seed), paper, f"{out}/landscape-{name}")
    landscape_sky(np.random.default_rng(12), f"{out}/landscape-sky.webp")


def main() -> None:
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    sheet(np.random.default_rng(1), (0xef, 0xe3, 0xcb), (1.0, 0.96, 0.84), 1.0, f"{out}/cream.webp")
    flecks(np.random.default_rng(2), (0x5a, 0x3e, 0x22), 0.5, f"{out}/cream-flecks.webp")
    clouds(np.random.default_rng(5), (0x6b, 0x4c, 0x2c), 5, f"{out}/cream-clouds.webp")
    sheet(np.random.default_rng(3), (0x13, 0x13, 0x14), (1.0, 1.0, 1.04), 0.5, f"{out}/ink.webp")
    flecks(np.random.default_rng(4), (0xd8, 0xd2, 0xc4), 0.22, f"{out}/ink-flecks.webp")
    clouds(np.random.default_rng(6), (0xd8, 0xd2, 0xc4), 3, f"{out}/ink-clouds.webp")
    sky_wash(np.random.default_rng(7), f"{out}/sky-wash.webp")
    sky_clouds(np.random.default_rng(8), f"{out}/sky-clouds.webp")
    landscape(out)


if __name__ == "__main__":
    main()
