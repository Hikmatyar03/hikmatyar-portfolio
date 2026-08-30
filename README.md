# Hikmatyar Portfolio

Next.js 14 App Router portfolio for Hikmatyar, a solo brand identity designer
and growth strategist.

## Getting Started

Install dependencies and run the development server:

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Fonts

Place the licensed Degular files here before visual QA:

```txt
public/fonts/degular-display.woff2
public/fonts/degular-text.woff2
```

The CSS font slots are already wired to those filenames. The files are not
included in this repository because they are licensed assets.

## Sanity Development

Phase 2 adds the embedded Sanity Studio. Once it exists, run the app and Studio
side by side in separate terminals:

```sh
npm run dev
sanity dev
```

## Current Phase

Phase 1 scaffold is in place with TypeScript, Tailwind, ESLint, App Router,
the `src/` directory, project tokens, required motion/CMS dependencies, and a
blank dark test page.
