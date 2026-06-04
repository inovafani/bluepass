# Yacht Images

Each folder matches a yacht slug from `lib/data/yachts.ts`.

## Naming convention

Drop your photos into the matching folder using these exact filenames:

| File | Used on | Recommended size |
|------|---------|-----------------|
| `card.jpg` | Grid card thumbnail (explore, for-operators) | 800 × 600 |
| `hero.jpg` | Full-bleed background on detail page | 2200 × 1200 min |
| `gallery-1.jpg` | Gallery — large image (left column) | 1200 × 900 |
| `gallery-2.jpg` | Gallery — small image | 800 × 600 |
| `gallery-3.jpg` | Gallery — small image | 800 × 600 |
| `gallery-4.jpg` | Gallery — small image | 800 × 600 |
| `gallery-5.jpg` | Gallery — small image | 800 × 600 |

## Example

```
public/yachts/
  anne-bonny/
    card.jpg
    hero.jpg
    gallery-1.jpg
    gallery-2.jpg
    gallery-3.jpg
    gallery-4.jpg
    gallery-5.jpg
```

## How the data file works

Each yacht in `lib/data/yachts.ts` has an `images` block.
It currently uses `localImages("slug")` which auto-maps to these paths:

```ts
images: localImages("anne-bonny"),
// resolves to:
//   card:    /yachts/anne-bonny/card.jpg
//   hero:    /yachts/anne-bonny/hero.jpg
//   gallery: /yachts/anne-bonny/gallery-1.jpg  (× 5)
```

Just drop the files in and refresh — no code changes needed.

## Alt text

The gallery alt text defaults to the yacht name.
To customise it, pass an alts array as the second argument:

```ts
images: localImages("anne-bonny", [
  "Anne Bonny at anchor in Komodo",
  "Interior master cabin",
  "Dive deck at sunrise",
  "Pink Beach anchorage",
  "Dinner on deck",
]),
```
