"""Bake the existing Fyntix logo's Y into the About particle model.

Run with Python 3 and Pillow. The logo silhouette comes from the existing
wordmark; its height, depth distribution and point count match the old mark.
"""

from pathlib import Path
import random
import struct

from PIL import Image


root = Path(__file__).resolve().parents[1]
reference = root / "public/particle-data/mark.f32"
logo = root / "public/brand-assets/logos/wordmark/fyntix-navbar.png"
output = root / "public/particle-data/fyntix-y.f32"

points = list(struct.iter_unpack("<fff", reference.read_bytes()))
height = max(p[1] for p in points) - min(p[1] for p in points)
image = Image.open(logo).convert("RGBA")
mask = [
    (x, y)
    for y in range(image.height)
    for x in range(image.width)
    if (pixel := image.getpixel((x, y)))[3] >= 128
    and pixel[0] > pixel[1] + 35
    and pixel[0] > pixel[2] + 35
]
if not mask:
    raise ValueError("The wordmark does not contain the coloured Y silhouette.")

left, right = min(x for x, _ in mask), max(x for x, _ in mask)
top, bottom = min(y for _, y in mask), max(y for _, y in mask)
centre_x, centre_y = (left + right + 1) / 2, (top + bottom + 1) / 2
units = height / (bottom - top + 1)
randomness = random.Random(20261121)
depths = [p[0] for p in points]
randomness.shuffle(depths)
model = bytearray()
for depth in depths:
    x, y = randomness.choice(mask)
    # The existing marks face along X: image-up is +Y and image-left is +Z.
    model.extend(struct.pack(
        "<fff",
        depth,
        (centre_y - y - randomness.random()) * units,
        (centre_x - x - randomness.random()) * units,
    ))
output.write_bytes(model)
print(f"Baked {len(depths)} Fyntix Y particles into {output.name}.")
