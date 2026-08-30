# Project: Hikmatyar — Brand Identity Designer Portfolio

## Who this is for
A solo brand identity designer and growth strategist. NOT an agency — never
imply team scale (no "we", no "our team"). Voice is first-person "I",
confident, short, editorial. No corporate filler sentences.

## Stack (do not substitute)
- Next.js 14, App Router, TypeScript (strict mode)
- Tailwind CSS, configured with the design tokens below — no arbitrary
  one-off hex values in components, everything pulls from tokens
- Sanity CMS (schema defined in Phase 2) for all case study / project content
- GSAP + ScrollTrigger for scroll-driven reveals
- Framer Motion for route transitions and component-level interaction
- next/image and next/video patterns for all media — no raw <img>/<video>
  without explicit width/height and lazy loading
- Deployed target: Vercel

## Design tokens
Colors:
  --bg: #0E0E0E
  --text: #D8D8D8
  --accent: #FF4A4A   (use ONLY for CTAs, active states, focus rings —
                        never as a background fill or decorative flood)

Typography:
  Display: "Degular Display" — headlines, hero type, section titles
  Body/UI: "Degular Text" (or the paired sans already licensed) — body
           copy, nav, labels, buttons
  Scale: display clamp(3.5rem, 8vw, 7.5rem) / body 1rem–1.125rem /
         eyebrow labels 0.7rem–0.8rem, uppercase, +6–12% letter-spacing

Grid (Tailwind container config):
  Desktop 1440px+: 12 columns, 80px outer margin, 24px gutter, 1280px max-width
  Laptop 1024–1439px: 12 columns, 48px margin, 20px gutter
  Tablet 768–1023px: 6 columns, 32px margin, 16px gutter
  Mobile 320–767px: 4 columns, 20px margin, 12px gutter

Motion:
  Micro (hover/state): 100–200ms, ease-out
  UI transition (card expand, form step): 250–450ms, cubic-bezier(0.4,0,0.2,1)
  Section reveal: 500–800ms, ease-out, staggered 60–100ms per child
  Page transition: 700–1000ms, crossfade + 20px vertical settle

Radius: 0–2px everywhere. Sharp, editorial. Never rounded-xl / pill shapes
except where explicitly specified.

## Three service pillars (this is the actual site structure — not a generic
services list, don't invent a 4th pillar or rename these)
1. Brand & Identity — brand strategy, brand identity, logo design, brand
   guidelines
2. Campaign & Content — campaign design, album/cover art, motion, social
   and launch content
3. Growth & Automation — AI automation, B2B lead generation, outreach systems

## Quality bar (non-negotiable)
- No generic "AI-tool" aesthetics: no Inter/Roboto/system-ui as the visual
  typeface, no purple-gradient-on-white, no soft rounded SaaS cards, no
  centered-hero-with-two-buttons template look.
- Commit fully to the dark editorial direction: high contrast, disciplined
  asymmetry, one accent color used sparingly, generous negative space
  between sections rather than dense stacking.
- Every animation must have a stated UX reason (confirm an action, or pace
  a reveal). If you can't justify it in one sentence in a code comment,
  don't add it.
- Respect prefers-reduced-motion everywhere: disable autoplay video and
  large-distance transforms when it's set.

## Asset policy (applies to every phase)
I will replace all placeholder media with my own real assets. Until then:
- Never use a plain gray/colored div as a stand-in for a hero image or
  video — pull a real, free, commercially-licensed placeholder from
  Pexels, Mixkit, or Coverr (all CC0-style / free-for-commercial-use, no
  attribution required for Pexels/Mixkit).
- Store placeholders in /public/placeholder-media/{section}/ with
  descriptive filenames, e.g. shawls-and-soul-loom-01.mp4.
- In Sanity schema, every media field gets a companion boolean
  `isPlaceholder`. Placeholder media renders with a small, dismissible
  dev-only badge ("Placeholder — replace") visible only when
  NODE_ENV === 'development'.
- Never fabricate a case-study outcome number/stat. If a real metric
  isn't provided, use qualitative placeholder copy clearly marked
  [PLACEHOLDER COPY] in the CMS seed data, not a fake number.