# Placeholder Media

This directory holds temporary stand-in media while real assets are being prepared.

## Policy (from AGENTS.md)

- All media here is CC0 / free-for-commercial-use sourced from **Pexels**, **Mixkit**, or **Coverr**.
- No attribution required for Pexels and Mixkit.
- Every piece of placeholder media has `isPlaceholder: true` in Sanity.
- A dev-only badge ("Placeholder — replace") renders over it in `NODE_ENV === development`.
- **Replace with your own assets before launching.** Search for the badge to find every placeholder.

## Directory structure

```
placeholder-media/
  hero/
    craft-reel.mp4        ← Short looping reel (close-up craft-in-progress)
    craft-poster.jpg      ← Poster frame for the video (prevents flash on load)
  about/
    portrait.jpg          ← Designer portrait or workspace photo
```

## How to replace

1. Drop your real file into the correct subdirectory with the exact filename above.
2. Update the `src` / `poster` prop in the relevant component.
3. Remove `isPlaceholder: true` from the Sanity document.
4. The dev badge will disappear automatically.
