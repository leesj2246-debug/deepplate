from pathlib import Path

from PIL import Image


SOURCE_DIR = Path("assets/images")
OUTPUT_DIR = Path("public/images")
WIDTHS = (640, 1024)
IMAGE_NAMES = (
    "dining_space",
    "hero_architecture",
    "hero_slide_2",
    "hero_slide_3",
    "hidden_alley",
    "korean_local_eatery",
    "tea_eatery",
)


def optimize_image(name: str) -> None:
    source_path = SOURCE_DIR / f"{name}.png"
    with Image.open(source_path) as source:
        source = source.convert("RGB")
        for width in WIDTHS:
            if width == source.width:
                resized = source.copy()
            else:
                height = round(source.height * width / source.width)
                resized = source.resize((width, height), Image.Resampling.LANCZOS)

            resized.save(
                OUTPUT_DIR / f"{name}-{width}.avif",
                format="AVIF",
                quality=55,
                speed=6,
            )
            resized.save(
                OUTPUT_DIR / f"{name}-{width}.webp",
                format="WEBP",
                quality=78,
                method=6,
            )


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for name in IMAGE_NAMES:
        optimize_image(name)
        print(f"optimized {name}")


if __name__ == "__main__":
    main()
