"""Makes this package's textures. Every pixel comes from here: no scan, no stock image, no model.

    uv run --no-project --with numpy --with pillow python make_paper.py [out dir]

Same seed, same files. Each tile wraps: noise is shaped in frequency space, which is periodic, and each fibre is drawn at every
wrapped position. A sheet is three tiles of coprime sizes, so they never line up. The eye finds a lattice by what's large and what stands out, so the
512 px tile holds neither: its fibres and grain have every wavelength over 48 px taken out, which is why it shows no grid even at
25%. Clouds of formation get a tile of their own, 127 px and drawn at 2003, as they hold nothing fine. Flecks get 1021.
"""

import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SHEET = 512
FLECKS = 1021
CLOUDS = 127
SCALE = 3


def band(rng, size, low, high):
    """Noise holding only wavelengths between 1/high and 1/low px, at unit deviation."""
    fy, fx = np.meshgrid(np.fft.fftfreq(size), np.fft.fftfreq(size), indexing="ij")
    radius = np.hypot(fx, fy)
    shaped = np.real(np.fft.ifft2(np.fft.fft2(rng.standard_normal((size, size))) * ((radius > low) & (radius < high))))
    return shaped / shaped.std()


def stroke(rng, size, length):
    """A wandering stroke, as tile pixels: a fibre never runs straight."""
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


def wrapped(draw, points, size, **line):
    for dx in (-size, 0, size):
        for dy in (-size, 0, size):
            draw.line([((x + dx) * SCALE, (y + dy) * SCALE) for x, y in points], **line)


def fibres(rng, size, count, shortest, longest, blur=0.8):
    """Coverage of `count` fibres, 0 to 1, supersampled so a thin one is faint rather than jagged."""
    canvas = Image.new("L", (size * SCALE, size * SCALE), 0)
    draw = ImageDraw.Draw(canvas)
    for _ in range(count):
        wrapped(draw, stroke(rng, size, rng.uniform(shortest, longest)), size, fill=int(rng.uniform(120, 255)), width=int(rng.integers(2, 4)))
    soft = canvas.filter(ImageFilter.GaussianBlur(blur * SCALE / 2)).resize((size, size), Image.Resampling.BOX)
    return np.asarray(soft, dtype=float) / 255


def fine(field, size, shortest=1 / 48):
    """`field` with every wavelength over 48 px taken out: what a grid would be seen in, from far off."""
    fy, fx = np.meshgrid(np.fft.fftfreq(size), np.fft.fftfreq(size), indexing="ij")
    return np.real(np.fft.ifft2(np.fft.fft2(field) * (np.hypot(fx, fy) > shortest)))


def tooth(rng, size):
    """Cold-press tooth, as light from the top left finds it: bumps of a few px with a bright side and a shadowed one. It's what makes
    a sheet read as paper from across a room, where a 1 px fibre on a 4K screen is gone."""
    bumps = band(rng, size, 1 / 11, 1 / 3)
    lit = bumps - np.roll(bumps, (1, 1), axis=(0, 1))
    return lit / lit.std()


def height(rng, size):
    """How the sheet catches light: tooth and grain, and fibres lying on it."""
    return fine(
        4.4 * tooth(rng, size)
        + 1.0 * band(rng, size, 0.2, 0.5)
        + 15 * fibres(rng, size, 520, 14, 80)
        - 11 * fibres(rng, size, 380, 10, 60),
        size,
    )


def sheet(rng, base, tint, gain, out):
    relief = height(rng, SHEET)
    relief -= relief.mean()
    pixels = np.array(base, dtype=float) + relief[..., None] * np.array(tint) * gain
    Image.fromarray(np.clip(pixels, 0, 255).round().astype("uint8")).save(out, quality=80, method=6)


def flecks(rng, colour, strength, out):
    """Small, sparse flecks, on nothing. `strength` scales their alpha, 0 to 1."""
    canvas = Image.new("L", (FLECKS * SCALE, FLECKS * SCALE), 0)
    draw = ImageDraw.Draw(canvas)
    for _ in range(150):
        wrapped(draw, stroke(rng, FLECKS, rng.uniform(4, 15)), FLECKS, fill=int(rng.uniform(70, 170)), width=int(rng.integers(1, 3)))
    for _ in range(320):
        x, y = rng.uniform(0, FLECKS, 2)
        wrapped(draw, [(x, y), (x + rng.uniform(0.4, 1.6), y + rng.uniform(-0.8, 0.8))], FLECKS, fill=int(rng.uniform(110, 230)), width=int(rng.integers(2, 5)))
    alpha = canvas.filter(ImageFilter.GaussianBlur(SCALE * 0.28)).resize((FLECKS, FLECKS), Image.Resampling.BOX)
    tile(colour, alpha.point(lambda value: int(value * strength) & 0xf0), out)


def clouds(rng, colour, strength, out):
    """Soft clouds of formation, on nothing. `strength` is alpha, 0 to 255."""
    alpha = np.clip(band(rng, CLOUDS, 0.02, 0.16) * 0.5 + 1.0, 0, 2) * strength
    tile(colour, Image.fromarray(alpha.round().astype("uint8")), out)


def tile(colour, alpha, out):
    layer = Image.merge("RGBA", (*(Image.new("L", alpha.size, channel) for channel in colour), alpha))
    layer.save(out, lossless=True, quality=100, method=6, exact=False)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    sheet(np.random.default_rng(1), (0xef, 0xe3, 0xcb), (1.0, 0.96, 0.84), 1.0, f"{out}/cream.webp")
    flecks(np.random.default_rng(2), (0x5a, 0x3e, 0x22), 0.5, f"{out}/cream-flecks.webp")
    clouds(np.random.default_rng(5), (0x6b, 0x4c, 0x2c), 5, f"{out}/cream-clouds.webp")
    sheet(np.random.default_rng(3), (0x13, 0x13, 0x14), (1.0, 1.0, 1.04), 0.5, f"{out}/ink.webp")
    flecks(np.random.default_rng(4), (0xd8, 0xd2, 0xc4), 0.22, f"{out}/ink-flecks.webp")
    clouds(np.random.default_rng(6), (0xd8, 0xd2, 0xc4), 3, f"{out}/ink-clouds.webp")


if __name__ == "__main__":
    main()
