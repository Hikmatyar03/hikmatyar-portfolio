# Hikmatyar — Brand Identity Designer & Growth Strategist
## Master Project Documentation & Content Archive

---

## 1. Project & Persona Identity

### 1.1 Who This Is For
* **Practitioner**: Hikmatyar
* **Role**: Solo Brand Identity Designer & Growth Strategist.
* **Core Philosophy**: "Brand work is systems work." Work built with intent, high contrast, and compounding impact.
* **Agency Scale Rule**: **NOT an agency** — never imply team scale. No "we", no "our team", no "our experts". Voice is strictly first-person singular **"I"**, confident, concise, and editorial. Zero corporate filler sentences or generic SaaS jargon.

### 1.2 The Three Service Pillars
The entire practice and portfolio are organized around three non-negotiable disciplines:
1. **Brand & Identity**: Brand strategy, identity systems, logo design, typography architecture, visual guidelines, and brand design systems.
2. **Campaign & Content**: Campaign design, art direction, album/cover art, motion graphics, strategic social launch content, and visual rollouts.
3. **Growth & Automation**: AI automation pipelines, B2B lead generation architecture, outreach infrastructure, and operational growth systems.

*Working Relationship*: Direct engagement with founders, creators, and studios. Zero account managers, zero layers, zero junior hand-offs.

---

## 2. Design System & Tokens

### 2.1 Color Tokens
| Token | Hex Value | Usage Rule |
| :--- | :--- | :--- |
| `--bg` | `#0E0E0E` | Primary deep black background for dark editorial immersion. |
| `--text` | `#D8D8D8` | Primary light gray typographic color for high-legibility body & display copy. |
| `--accent` | `#FF4A4A` | High-energy editorial red. **Strictly reserved for CTAs, active states, and focus rings.** Never used as a background fill or flood. |
| Light `--bg` | `#F5F3EF` | Natural archival parchment / warm paper tone for light mode. |
| Light `--text` | `#121212` | Dense editorial ink black for light mode typography. |

### 2.2 Typography Architecture
* **Display Typeface**: `"Degular Display"` (with Fallback Arial, sans-serif) — used for headlines, hero type, and section statements.
* **Body/UI Typeface**: `"Degular Text"` (or licensed paired sans) — used for body paragraphs, navigation, labels, and UI buttons.
* **Monospaced Stack**: `"Courier New", Consolas, Monaco, monospace` — shared identically between the WebGL ASCII shader font atlas and the DOM ASCII glyph cursor.
* **Typographic Scale**:
  * Display Headline: `clamp(3.5rem, 8vw, 7.5rem)` with `lineHeight: 0.88 - 0.92` and letter spacing `-0.02em`.
  * Display Subhead: `clamp(1.75rem, 3.5vw, 2.5rem)`.
  * Body Large: `1.125rem` (`18px`), `leading-relaxed`.
  * Body Regular: `1.0rem` (`16px`), `text-text/75`.
  * Eyebrow Label: `0.7rem - 0.8rem` (`11-13px`), uppercase, `+6%` to `+12%` letter-spacing, rendered within brackets `[ SECTION ]`.

### 2.3 Layout Grid (Tailwind Container Config)
* **Desktop (1440px+)**: 12 columns, 80px outer margin, 24px gutter, 1280px max-width container.
* **Laptop (1024px – 1439px)**: 12 columns, 48px outer margin, 20px gutter.
* **Tablet (768px – 1023px)**: 6 columns, 32px outer margin, 16px gutter.
* **Mobile (320px – 767px)**: 4 columns, 20px outer margin, 12px gutter.

### 2.4 Radii & Aesthetics
* **Base Radius**: `0–2px` (`rounded-sharp`). Sharp, razor-clean, editorial book-design aesthetic.
* **Interactive Elevated Elements**: `rounded-full` or `rounded-3xl` glass pills for floating navigation bars, status badges, and interactive category chips with backdrop blur (`backdrop-blur-xl`, `border-white/[0.08]`).

### 2.5 Motion Tiers & Animation Contracts
* **Micro Interactions** (hover / click / state swap): 100–200ms, `ease-out`.
* **UI Transitions** (card expand, modal, form step advance): 250–450ms, `cubic-bezier(0.4, 0, 0.2, 1)`.
* **Section Reveals** (GSAP ScrollTrigger): 500–800ms, `power2.out`, staggered 60–100ms per child element.
* **Page Transitions** (Framer Motion `PageTransitionWrapper`): 700–1000ms crossfade with `20px` vertical settle (`mode="wait"`).
* **Accessibility (`prefers-reduced-motion`)**: Fully respected across all components. Automatically pauses background reel video, disables continuous transforms, eliminates preloader countdown, and converts page transitions to instant opacity cuts.

---

## 3. Case Studies & Creative Work Archive

### 3.1 Featured Case Studies

#### Case Study 1: Studio Buntu
* **ID / Slug**: `caseStudy-studio-buntu` / `/work/studio-buntu`
* **Pillar**: Brand & Identity (`brand-identity`)
* **Template**: Identity Template (`identity`)
* **Year**: 2024
* **Client**: Studio Buntu
* **Is Own Venture**: `false`
* **Short Description**: Comprehensive brand identity, visual system, and motion direction for Studio Buntu — a contemporary design practice.
* **Hero Media**:
  * Format: Full-bleed MP4 Video
  * URL: `/placeholder-media/studio-buntu/Buntu.mp4`
  * Alt: "Studio Buntu Motion Reel"
* **Strategic Idea**: "Form follows intent — a sharp, disciplined typographic system paired with rhythmic motion."
* **Context**: Studio Buntu required an editorial identity system and motion framework to establish their visual positioning across physical collateral, digital touchpoints, and brand launches.
* **Challenge**: Creating an identity that balances high contrast editorial minimalism with fluid motion, without sacrificing legibility or commercial impact.
* **Identity System Notes**: Built around custom typographic hierarchy, monochrome contrast with warm undertones, and structured grid compositions that scale across web and print.
* **Outcome**: Delivered a complete, scalable brand identity kit, motion guidelines, and launch content system.
* **Gallery Artifacts**:
  1. `01.png`: Identity System Overview (Typography & lockup hierarchy)
  2. `02.png`: Stationery & Printed Applications (Stationery, business collateral)
  3. `03.png`: Typography & Color Architecture (Color swatches, type scales)
  4. `04.png`: Digital Touchpoints & UI Grid (Web interface guidelines)
  5. `05.png`: Social Launch Content & Campaign Assets (Motion frames & reels)

---

#### Case Study 2: Shawls & Soul
* **ID / Slug**: `caseStudy-shawls-and-soul` / `/work/shawls-and-soul`
* **Pillar**: Brand & Identity (`brand-identity`)
* **Template**: Identity Template (`identity`)
* **Year**: 2024
* **Client**: Shawls & Soul (Founder / Own Venture)
* **Is Own Venture**: `true` (Written in first-person founder voice)
* **Short Description**: Artisan textile venture identity celebrating traditional craftsmanship with modern luxury positioning.
* **Strategic Idea**: "Tactile luxury built on authentic craft heritage."
* **Context**: I founded Shawls & Soul to bridge traditional handloom heritage with contemporary luxury branding.
* **Challenge**: Communicating tactile craft and artisanal heritage to an international luxury demographic.
* **Identity System Notes**: Restrained typography paired with rich macro imagery of loom weaving, delicate hand-spun fabrics, and organic textures.
* **Outcome**: Established brand positioning and launched initial capsule collection identity.

---

#### Case Study 3: BLU X
* **ID / Slug**: `caseStudy-blu-x` / `/work/blu-x`
* **Pillar**: Brand & Identity (`brand-identity`)
* **Template**: Identity Template (`identity`)
* **Year**: 2024
* **Client**: BLU X
* **Is Own Venture**: `false`
* **Short Description**: Next-generation mobility and digital product brand identity system engineered for high-visibility visual precision.

---

#### Case Study 4: TechFest IMS
* **ID / Slug**: `caseStudy-techfest-ims` / `/work/techfest-ims`
* **Pillar**: Campaign & Content (`campaign-content`)
* **Template**: Campaign Template (`campaign`)
* **Year**: 2024
* **Client**: TechFest IMS
* **Is Own Venture**: `false`
* **Short Description**: Full campaign design, kinetic motion graphics, and social launch architecture.
* **Brief**: Create an unmistakable event identity and launch campaign for TechFest IMS.
* **Concept**: "Hyper-kinetic technology in motion."
* **Reach / Impact**: Multi-channel university and regional campaign reaching thousands of tech participants and founders.

---

### 3.2 Studio Archive & Carousel Assets
The interactive 3D WebGL Rotunda Carousel in `FeaturedWork.tsx` features 8 curated high-resolution design artifacts:
1. `/placeholder-media/studio-buntu/01.png` — Visual identity lockups & mark variations.
2. `/placeholder-media/studio-buntu/02.png` — Stationery set, debossed envelopes & business cards.
3. `/placeholder-media/studio-buntu/03.png` — Typographic layout rules & monochrome contrast hierarchy.
4. `/placeholder-media/studio-buntu/04.png` — Digital responsive UI design system.
5. `/placeholder-media/studio-buntu/05.png` — Kinetic motion stills & promotional frames.
6. `/placeholder-media/studio-buntu/onwww.jpg` — Web presence & editorial landing design.
7. `/placeholder-media/studio-buntu/vghj.png` — Monogram & logomark study.
8. Unsplash High-Res Architectural Imagery — Curated editorial architectural framing.

### 3.3 Complete Seed Project Roster
* **Brand & Identity**: Shawls & Soul, BLU X, Blue Bridge LLC, OURA, Stoke Gadget, SDC, Zyphra, CropIQ, Studio Buntu.
* **Campaign & Content**: TechFest IMS, GDGoC IMSciences.
* **Client Logo Marquee**: Dynamic auto-discovery from `/public/logos/` displaying 7 client brand artboards in an infinite continuous GPU scroll.

---

## 4. Interactive Components & WebGL Shader Systems

### 4.1 ASCII Reveal Preloader (`PagePreloader.tsx`)
* **Purpose**: Full-screen entrance transition that renders on first visit per session (stored in `sessionStorage`).
* **Architecture**:
  * Full-viewport WebGL fragment shader running on an orthographic quad via Three.js.
  * Rasterizes a dynamic monospace canvas font atlas containing the ramp `" .:-=+*#%@"`.
  * Samples the wordmark texture `/brand/hikmatyar-wordmark.png` directly via `texture2D(uDensityTex, uv).a` (handling RGBA flat white with letterforms solely in the alpha channel).
  * Smooth simplex noise threshold animation (`uNoiseTex`) revealing the wordmark glyphs progressively from left to right.
  * Interactive counter incrementing from `0%` to `100%` alongside an SVG progress track.
  * Escape / Space keyboard shortcuts and skip-to-content click triggers for instant bypass.

### 4.2 ASCII Cursor Ink Bleed System (`AsciiInkBleedCursor.tsx` & `AsciiCursorScope.tsx`)
* **Purpose**: Replaces traditional blurred canvas blobs with an editorial ASCII density field, expressing cursor motion as "ink seeping into textured paper."
* **Architecture & Performance**:
  * Full-viewport Three.js orthographic scene rendered at `z-index: 25` with `mix-blend-mode: screen`.
  * Grid resolution tuned to `10–14px` cells based on viewport width (`~10,700` cells at 1080p).
  * **Active Cell Tracking**: Bounded by an enforced cap of `MAX_ACTIVE_CELLS = 600`. Only cells touched by cursor bloom are tracked in an `activeIndices` set.
  * **Culling**: Once a bloom cell decays down to resting density and accent intensity drops to 0, it is immediately culled from the iteration set.
  * **Idle Zero-Overhead**: When the mouse is stationary and blooms have faded, CPU loops drop to 0 and GPU texture re-uploads are halted.
  * **Route Scoping**: Genuinely unmounted (returns `null`, 0 canvas elements in DOM, 0 rAF ticks) on content-dense routes (`/work`, `/work/[slug]`, `/studio`). Mounted only on `/`, `/about`, `/contact`, and `/services`.

### 4.3 ASCII Magnetic Cursor (`MagneticCursor.tsx`)
* **Graphic**: A single fixed DOM character span styled with the shared monospace font stack.
* **Proximity Density Stepping**:
  * Idle: `:`
  * Approaching interactive target: `+` &rarr; `*`
  * Hovering target: `@` with `--accent` (`#FF4A4A`) glow and optional contextual label chip (`[VIEW]`, `[SELECT]`, `[OPEN]`).
* **Zero Forced Reflow Architecture**:
  * Caches `DOMRect` bounding boxes and centers every 350ms in `updateCachedTargets`.
  * Proximity checks during `onMouseMove` execute purely in JS memory without calling `getBoundingClientRect()`, eliminating layout thrashing.
  * Cache invalidates automatically on scroll, window resize, and route changes.

### 4.4 3D Rotunda Carousel (`rotunda-carousel.tsx`)
* **Design Concept**: An interior cylindrical gallery where the camera sits on the axis looking outward at concave-hung picture panels.
* **Drag Physics**: Inverse cylindrical projection pinning the wall angle to the pointer.
* **Fail-Safe Fallback**: Includes a 4.5-second timer. If WebGL context is unsupported or network stalls, `FeaturedWork.tsx` automatically transitions to an editorial static archival grid of 8 design artifacts with hover zoom.

---

## 5. Site Pages & Editorial Copy

### 5.1 Homepage (`/`)
* **Hero Section**:
  * Eyebrow: `[ BRAND IDENTITY & STRATEGY ]`
  * Headline: *"Brand work is systems work."* (per-word stagger reveal).
  * Subline: *"Brand identity, campaign design, and growth systems. Work built with intent."*
  * CTAs: `"Explore Selected Work ↓"`, `"Start a Project →"`
  * Availability Pill: Pulsing accent indicator — *"Available for Projects"*.
* **Selected Work Section**:
  * Section Label: `[ SELECTED WORK ]`
  * Headline: *"Built with intent."*
  * Interactive 3D Rotunda Showcase with fallback.
  * Case study cards with alternating portrait / landscape rhythms.
* **Services Preview**:
  * Headline: *"Three disciplines. One system."*
  * Cards for Brand & Identity, Campaign & Content, Growth & Automation.
* **Client Logo Marquee**:
  * Continuous GPU-driven infinite reel displaying client marks.

### 5.2 About Page (`/about`)
* **Headline**: *"Brand work is systems work."*
* **Intro Copy**:
  > "I'm a brand identity designer and growth strategist working with founders, studios, and independent creators. I design the systems that make a brand recognisable — and the strategies that make it findable."
  > "My practice spans three disciplines: **brand identity**, where I build the visual and verbal language a brand lives in; **campaign design**, where I give that language something to say; and **growth systems**, where I build the infrastructure to distribute it."
  > "I keep all three in the same room because they compound each other. A brand without campaigns stays invisible. A campaign without identity is forgettable. Growth without a brand to grow is noise."
* **Three Working Principles**:
  1. **Research before design**: *"I don't open software until I understand the market, the audience, and what the brand needs to feel different from. The brief is a starting point, not the strategy."*
  2. **Systems, not one-offs**: *"A logo is a component. I design identity systems — type, colour, tone, space, motion — that work across every application without ongoing management. That's what makes a brand durable."*
  3. **Short loops, no long silences**: *"I share work early and often. A wrong direction caught in week one costs a fraction of one caught at presentation. Tight loops are how I stay aligned without lengthy check-ins."*
* **Closing CTA**: *"If any of this sounds like what your project needs, I'd like to hear about it."* &rarr; `Start a project`.

### 5.3 Services Page (`/services`)
* **Headline**: *"Three pillars engineered for compounding growth."*
* **Pillars Detailed**:
  * **Pillar 01 — Brand & Identity**: Brand strategy, identity systems, logo design, and comprehensive brand guidelines built for long-term equity. Capabilities: Brand Strategy, Visual Identity, Logo Design, Guidelines.
  * **Pillar 02 — Campaign & Content**: High-impact campaign design, art direction, motion graphics, and strategic social launch content. Capabilities: Campaign Design, Art Direction, Motion Graphics, Launch Systems.
  * **Pillar 03 — Growth & Automation**: AI automation workflows, B2B lead generation architecture, and high-converting outreach systems. Capabilities: AI Automation, B2B Lead Gen, Outreach Systems, Growth Pipelines.
* **Working Model**:
  * *"Direct engagement. Zero layers."* You work directly with me. No account managers, no junior hand-offs, no bloated retainers.
  * Step 01: Strategy First (clarify position and objective before visual generation).
  * Step 02: High-Velocity Execution (focused sprints moving from alignment to delivery).

### 5.4 Contact Page (`/contact`)
* **Intake Flow (3 Steps)**:
  * **Step 1: Project Type**: Selection between `Brand & Identity`, `Campaign & Content`, `Growth & Automation`, or `Not sure yet`.
  * **Step 2: Your Details**: Name and Email address inputs with real-time accessibility validation.
  * **Step 3: Message**: Detailed project brief / scope textarea.
  * **Submission Endpoint**: `/api/contact` returning confirmation.
  * **Success Message**: *"Got it. I'll read this properly and come back to you within 48 hours."*
* **Direct Links**:
  * Email: `hikmodesiner03@gmail.com`
  * Cal.com booking link: `https://cal.com/hikmatyar`

### 5.5 Work Archive Page (`/work`)
* **Headline**: *"All selected projects."*
* **Filter Pills**: `All`, `Brand & Identity`, `Campaign & Content`, `Growth & Automation`.
* **Grid Layout**: Responsive masonry grid showing project cards, year badges, and direct links to individual case studies.

---

## 6. Architecture & CMS Schema (Sanity)

### 6.1 Schema Types (`src/sanity/schemaTypes/`)
1. **`caseStudy.ts`**:
   * Fields: `title`, `slug`, `pillar` (ref to `servicePillar`), `templateType` (`identity` | `campaign`), `year`, `client`, `isOwnVenture` (boolean), `description`, `heroMedia`, `gallery`, `context`, `challenge`, `strategicIdea`, `identitySystemNotes`, `outcome`, `credits`, `brief`, `concept`, `reach`.
2. **`servicePillar.ts`**:
   * Fields: `name`, `slug`, `oneLineDescription`, `capabilityWords` (array of strings).
3. **`siteSettings.ts`**:
   * Fields: `heroHeadline`, `heroSubline`, `aboutShortCopy`, `contactEmail`, `socialLinks`.
4. **`projectMedia.ts`**:
   * Fields: `mediaType` (`image` | `video`), `asset`, `url`, `alt`, `caption`, `isPlaceholder` (boolean).

### 6.2 Offline / Standalone Fallback Engine
* If Sanity environment variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`) are absent, `src/lib/sanity.ts` automatically switches to in-memory fallback records (`DEFAULT_CASE_STUDIES`).
* The site builds, renders, and operates 100% statically without requiring external database connections.

---

## 7. Tech Stack & Scripts Reference

### 7.1 Locked Technology Stack
* **Framework**: Next.js 14.2 (App Router, React 18, Strict TypeScript)
* **Styling**: Tailwind CSS configured with custom design tokens, CSS variables
* **Animation & Reveals**: GSAP 3.12 + ScrollTrigger (scoped with `gsap.context()`)
* **Transitions**: Framer Motion 11 (`AnimatePresence`, `motion`)
* **3D & Shaders**: Three.js 0.160+ (Raw WebGL orthographic shaders & PotFit textures)
* **CMS**: Sanity v3 + `@sanity/image-url`
* **Theme Support**: `next-themes` (Dark/Light mode support with persistence)

### 7.2 Key CLI Commands
* `npm run dev`: Launches local development server on `http://localhost:3000`.
* `npm run build`: Generates optimized production build (15/15 static pages).
* `npm run lint`: Executes Next.js ESLint verification.
* `npx tsc --noEmit`: Executes TypeScript strict compiler check.
* `npm run sanity:seed`: Seeds Sanity studio with canonical portfolio documents.

---
*Archive generated: October 2026 for Hikmatyar Portfolio.*
