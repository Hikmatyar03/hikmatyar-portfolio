# PROJECT_REPORT.md — Hikmatyar Portfolio
> Machine-readable project map. Every AI agent working on this repo MUST read this file before writing a single line of code. Nothing here is aspirational — it reflects the exact current state of the codebase as of 2026-08-30.

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| Owner | Hikmatyar (solo practitioner — never "we" or "our team") |
| Site purpose | Personal portfolio for a brand identity designer + growth strategist |
| Voice | First-person "I", confident, editorial, no filler |
| Package name | `hikmatyar-portfolio` |
| Current build phase | **Phase 1–10 complete + Polish Passes** — Scaffold, Sanity schema/client, Global layout, Homepage, Work Archive, Case Study Templates, About, Contact flow, Dynamic Client Logo Marquee, Precision Cursor Systems (Magnetic + Smooth Ink Bleed), Motion pass, and Performance/A11y/SEO pass fully implemented and verified with zero build errors. |
| Deployment target | Vercel |

---

## 2. Tech Stack (do NOT substitute any of these)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js App Router | `14.2.35` |
| Language | TypeScript (strict mode) | `^5` |
| Styling | Tailwind CSS | `^3.4.1` |
| CMS | Sanity (embedded Studio at `/studio`) | `^3.99.0` |
| Sanity client | `next-sanity` + `@sanity/client` | `^9.12.3` / `^7.26.2` |
| Image helper | `@sanity/image-url` | `^2.1.1` |
| Scroll animation | GSAP + ScrollTrigger | `^3.15.0` |
| Route/component animation | Framer Motion | `^13.1.0` |
| Media | `next/image` + `next/font/local` — NO raw `<img>` or `<video>` without dimensions |
| Dynamic Asset Helpers | Node `fs` folder scanner for automatic client logo detection | Native |

### npm scripts

```bash
npm run dev          # Next.js dev server
npm run build        # Production build (verified passing 15/15 routes)
npm run start        # Production server
npm run lint         # ESLint
npm run sanity:dev   # Sanity Studio standalone dev
npm run sanity:seed  # Seed Sanity with placeholder documents (requires .env.local)
```

---

## 3. Directory Structure (complete)

```
Portfolio/
├── AGENTS.md                      # AI agent rules — read before coding
├── PROJECT_REPORT.md              # This file
├── Codex-Build-Prompts.md         # Phase-by-phase build specs (Phases 1–10)
├── README.md                      # Quick-start documentation
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Design token definitions
├── tsconfig.json                  # TypeScript config (strict mode)
├── postcss.config.mjs             # PostCSS (Tailwind pipeline)
├── sanity.cli.ts                  # Sanity CLI entry
├── sanity.config.ts               # Embedded Sanity Studio config
├── .env.example                   # Required environment variable template
├── package.json
│
├── Assets/                        # Raw source assets (Logos, Studio Buntu, Video reels)
│   ├── Logos/                     # Source artboards
│   └── Studio Buntu/              # Project visual assets
│
├── public/
│   ├── fonts/                     # Self-hosted Degular OTF font files
│   │   ├── DegularDisplay-*.otf   # Regular, Medium, Semibold, Bold, Black
│   │   └── DegularText-*.otf      # Light, Regular, Medium, Semibold, Bold
│   ├── logos/                     # Auto-trimmed, normalized client logo assets
│   │   ├── Artboard 1.png
│   │   ├── Artboard 2.png
│   │   ├── Artboard 3.png
│   │   ├── Artboard 4.png
│   │   ├── Artboard 5 copy 2.png
│   │   ├── Artboard 5 copy.png
│   │   └── Artboard 5.png
│   └── placeholder-media/         # Sectional placeholder media (CC0/curated)
│       ├── about/
│       ├── hero/
│       └── studio-buntu/
│
├── scripts/
│   └── seed-sanity.mjs            # Node script: seeds all 15 Sanity documents
│
└── src/
    ├── app/                       # Next.js App Router
    │   ├── layout.tsx             # Root layout (metadata, cursor layers, preloader, Nav/Footer)
    │   ├── page.tsx               # Home page (Hero, FeaturedWork, Services, About + Logo Marquee)
    │   ├── about/page.tsx         # Dedicated editorial about page
    │   ├── contact/page.tsx       # Progressive multi-step contact flow
    │   ├── services/page.tsx      # Services pillar overview
    │   ├── work/page.tsx          # Work archive with pillar filter tabs & expandable rows
    │   ├── work/[slug]/page.tsx   # Dynamic case study route (Identity vs Campaign templates)
    │   ├── not-found.tsx          # Custom 404 page
    │   ├── error.tsx              # Error boundary
    │   ├── robots.ts              # Crawler directives
    │   ├── sitemap.ts             # Dynamic XML sitemap generator
    │   ├── api/contact/route.ts   # Contact form submission endpoint
    │   └── studio/[[...tool]]/    # Embedded Sanity Studio catch-all route
    │
    ├── components/
    │   ├── about/
    │   │   └── AboutContent.tsx
    │   ├── case-study/
    │   │   ├── CampaignTemplate.tsx
    │   │   ├── CaseStudySidebar.tsx
    │   │   ├── IdentityTemplate.tsx
    │   │   ├── MediaBlock.tsx
    │   │   └── NextProjectCard.tsx
    │   ├── contact/
    │   │   └── ContactFlow.tsx
    │   ├── cursor/
    │   │   ├── CustomCursor.tsx
    │   │   ├── InkBleedCursor.tsx     # High-DPI scaled, lerp-smoothed, feathered canvas ink bleed
    │   │   ├── LiquidPixelCursor.tsx
    │   │   └── MagneticCursor.tsx     # GSAP magnetic cursor with interactive element snapping
    │   ├── home/
    │   │   ├── AboutSection.tsx       # About narrative + dynamic client logo marquee
    │   │   ├── FeaturedWork.tsx
    │   │   ├── HeroSection.tsx        # Video backdrop, breathing scroll cue, per-word stagger
    │   │   └── ServicesSection.tsx
    │   ├── layout/
    │   │   ├── Footer.tsx
    │   │   ├── Nav.tsx                # Fixed editorial header + mobile overlay
    │   │   ├── PagePreloader.tsx      # First-visit editorial brand preloader
    │   │   └── PageTransitionWrapper.tsx
    │   ├── ui/
    │   │   ├── CategoryTag.tsx
    │   │   ├── MarqueeStrip.tsx       # Infinite dual-track logo & client marquee
    │   │   ├── ScrollNavDots.tsx      # Vertical desktop scroll tracker
    │   │   ├── SectionLabel.tsx
    │   │   ├── StatBadge.tsx
    │   │   └── ToggleIcon.tsx
    │   └── work/
    │       ├── ExpandableCaseRow.tsx
    │       ├── ProjectCard.tsx
    │       └── WorkArchive.tsx
    │
    ├── lib/
    │   ├── logos.ts               # Dynamic server-side public/logos folder reader
    │   ├── sanity.ts              # Sanity client, GROQ queries, fetch helpers
    │   └── types.ts               # TypeScript types for all Sanity documents
    │
    ├── sanity/
    │   └── schemaTypes/
    │       ├── index.ts           # Schema registry
    │       ├── caseStudy.ts       # caseStudy document schema
    │       ├── servicePillar.ts   # servicePillar document schema
    │       ├── projectMedia.ts    # projectMedia object schema
    │       └── siteSettings.ts    # siteSettings singleton schema
    │
    └── styles/
        └── globals.css            # CSS variables, @font-face, base resets, cursor & marquee filters
```

---

## 4. Design Tokens (canonical — never use raw hex in components)

### Colors (CSS custom properties in `globals.css`)

```css
--bg:     #0E0E0E   /* Background — near-black */
--text:   #D8D8D8   /* Body text — warm light gray */
--accent: #FF4A4A   /* Red — CTAs, active states, focus rings ONLY.
                       NEVER as background fill or decorative flood. */
```

Tailwind aliases (from `tailwind.config.ts`):
- `bg-bg` → `--bg`
- `text-text` → `--text`
- `bg-accent` / `text-accent` → `--accent`

### Typography

| Role | Font | Tailwind class |
|------|------|---------------|
| Display/Headlines | Degular Display | `font-display` |
| Body/UI/Nav | Degular Text | `font-body` |

Self-hosted OTF fonts located at `/public/fonts/`. Loaded via `@font-face` in `globals.css`.

| Scale | Size | Tailwind class |
|-------|------|---------------|
| Display | `clamp(3.5rem, 8vw, 7.5rem)` / lh `0.88` | `text-display` |
| Body large | `1.125rem` / lh `1.6` | `text-body-lg` |
| Body | `1rem` / lh `1.6` | `text-body` |
| Eyebrow | `0.75rem` / ls `0.1em` / UPPERCASE | `text-eyebrow` |

### Grid (Tailwind container configuration)

| Breakpoint | Columns | Outer margin | Gutter | Tailwind classes |
|-----------|---------|-------------|--------|---------|
| Mobile (320–767px) | 4 | 20px | 12px | `grid-cols-mobile gap-grid-mobile` |
| Tablet (768–1023px) | 6 | 32px | 16px | `grid-cols-tablet gap-grid-tablet` |
| Laptop (1024–1439px) | 12 | 48px | 20px | `grid-cols-desktop gap-grid-laptop` |
| Desktop (1440px+) | 12 | 80px | 24px | `grid-cols-desktop gap-grid-desktop` |

---

## 5. Key System Implementations

### Client Logo Marquee (`src/components/ui/MarqueeStrip.tsx` & `src/lib/logos.ts`)
- **Dynamic File Ingestion**: `getClientLogos()` reads `public/logos/` on demand. Any new logo file dropped in is automatically rendered without code modifications.
- **Color Normalization**:
  - Default: Filtered to a single unified `#D8D8D8` off-white tone via CSS (`brightness(0) invert(0.85)` with `opacity: 0.72`).
  - Hover: Smooth 300ms transition to brand accent red (`#FF4A4A`) with a subtle glow (`drop-shadow(0 0 14px rgba(255, 74, 74, 0.45))`), `scale: 1.05`, and full opacity.
- **Marquee Mechanics**: Seamless dual-track infinite CSS animation, fixed optical height (`h-8 md:h-11`), proportional widths (`object-contain`), pause-on-hover, and screen reader accessibility (`aria-hidden="true"` on duplicate track).

### Organic Ink Bleed Cursor (`src/components/cursor/InkBleedCursor.tsx`)
- **Retina / High-DPI Scaling**: Canvas buffer sized and scaled to `window.devicePixelRatio` with `ctx.scale(dpr, dpr)` on mount and resize.
- **Motion Smoothing (Lerp)**: Mouse coordinates smoothed with `currentPos += (targetPos - currentPos) * 0.22` before evaluating spawn distance, eliminating hardware polling jitter.
- **Feathered Organic Contours**: 64-segment polar Simplex noise contour sampling with native 2D canvas blur filtering (`ctx.filter = "blur(8px)"`) and layered radial gradients. Zero polygonal faceting or banding.
- **Bloom & Dissolution Dynamics**: `easeOutCubic` growth transitioning into `easeInOutQuad` fade with continuous scale-alpha cross-fade. Rendered with `mix-blend-mode: screen` and `ctx.globalCompositeOperation = "screen"`.

---

## 6. Sanity CMS Schemas & Document Structure

### Schema types (`src/sanity/schemaTypes/`)
1. `servicePillar`: Brand & Identity (`brand-identity`), Campaign & Content (`campaign-content`), Growth & Automation (`growth-automation`).
2. `caseStudy`: 11 seeded documents (9 Identity, 2 Campaign) with typed hero media, gallery, structured process fields, and outcome metrics.
3. `projectMedia`: Reusable object supporting image/video with `isPlaceholder` dev-only badge.
4. `siteSettings`: Singleton document for global headlines, short copy, email, and social links.

---

## 7. Current State of Each File

| File / Directory | Status | Notes |
|------------------|--------|-------|
| `src/styles/globals.css` | Done | Variables, fonts, cursor styles, logo filter normalization |
| `tailwind.config.ts` | Done | Design tokens, grid layout, motion durations |
| `src/app/layout.tsx` | Done | Preloader, InkBleedCursor, MagneticCursor, Nav, Footer, Transitions |
| `src/app/page.tsx` | Done | Fetches Sanity data & dynamic client logos; renders all 4 main sections |
| `src/app/work/page.tsx` | Done | Pillar filter tabs, expandable case study rows, interactive hover cards |
| `src/app/work/[slug]/page.tsx` | Done | Case study route switching between Identity and Campaign templates |
| `src/app/services/page.tsx` | Done | Dedicated services page detailing 3 core pillars |
| `src/app/about/page.tsx` | Done | Editorial longform about page |
| `src/app/contact/page.tsx` | Done | Progressive multi-step contact form |
| `src/app/api/contact/route.ts` | Done | Contact form POST endpoint |
| `src/app/studio/[[...tool]]/page.tsx` | Done | Embedded Sanity Studio route |
| `src/app/sitemap.ts` & `robots.ts` | Done | SEO crawler endpoints |
| `src/lib/logos.ts` | Done | Dynamic folder reader for client logos |
| `src/lib/sanity.ts` | Done | Typed GROQ queries with ISR revalidation |
| `src/components/cursor/*` | Done | High-DPI InkBleedCursor & MagneticCursor |
| `src/components/ui/MarqueeStrip.tsx` | Done | Dynamic dual-track client logo marquee |

---

## 8. Build & Verification Status

- `npm run build`: **PASSED** (15/15 static and SSG pages compiled cleanly with 0 errors).
- TypeScript strict mode: **PASSED** (100% clean).

---

*Last updated: 2026-08-30 | Verified live across complete codebase*
