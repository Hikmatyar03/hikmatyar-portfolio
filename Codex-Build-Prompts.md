# Codex Build Prompts — Hikmatyar Portfolio

How to use this: paste **Prompt 0** into a file named `AGENTS.md` at your repo root first — Codex reads this automatically every session, so you don't have to repeat the design system in every prompt. Then run **Phase 1 → Phase 10** in order, one at a time, reviewing the diff before moving to the next. Don't skip ahead — each phase assumes the previous one's files exist.

Every phase that touches media includes an **asset policy** block. You said you'll add your own assets — until you do, Codex is instructed to pull real, free, commercially-safe placeholder video/images from Pexels/Mixkit/Coverr and mark them clearly so they're trivial to find and swap later. Nothing gets built on fake gray boxes.

---

## Prompt 0 — `AGENTS.md` (paste once, at repo root)

```
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
```

---

## Phase 1 — Project Scaffold

```
Initialize the Next.js 14 App Router project per AGENTS.md.

Do:
1. `create-next-app` with TypeScript, Tailwind, ESLint, App Router, src/ dir.
2. Configure tailwind.config.ts with the exact design tokens from
   AGENTS.md as theme.extend values (colors.bg/text/accent, fontFamily,
   the fluid type scale via clamp in a plugin or CSS variables, the
   spacing/grid values as custom breakpoints/container settings).
3. Self-host Degular Display + Degular Text as woff2 in /public/fonts/
   (I'll drop the licensed font files in there — reference them via
   next/font/local, don't link to a font CDN).
4. Set up /src/app/layout.tsx with the base <html> dark theme, font
   variables applied, and a placeholder metadata block (title/description
   to be finalized in the SEO phase).
5. Install and configure: gsap, framer-motion, @sanity/client,
   @sanity/image-url.
6. Create a clean folder structure:
   /src/app, /src/components, /src/lib, /src/sanity, /src/styles
7. Add a README section documenting how to run `sanity dev` alongside
   `next dev` once Phase 2 adds the studio.

Acceptance criteria:
- `npm run dev` boots a blank dark (#0E0E0E) page with Degular Display
  rendering correctly in a test <h1>.
- No TypeScript errors, no unused generic Next.js boilerplate (starter
  page content, default favicon, default globals.css demo styles) left
  in the repo.
```

---

## Phase 2 — Sanity Schema & Client

```
Set up Sanity CMS per AGENTS.md.

Do:
1. Initialize an embedded Sanity Studio at /src/app/studio (or a separate
   /studio package if you prefer a cleaner separation — your call, state
   which you chose and why in a comment).
2. Define schemas:

   caseStudy:
     title, slug, pillar (reference to servicePillar OR a string enum:
       "brand-identity" | "campaign-content"), templateType: "identity" |
       "campaign" (this determines which case-study layout renders —
       see Phase 6), year, client (string, optional — blank for own
       ventures like Shawls & Soul), isOwnVenture (boolean),
     — Identity template fields: context, challenge, strategicIdea,
       identitySystemNotes, outcome, credits
     — Campaign template fields: brief, concept, reach
     — Shared: heroMedia (image or video + isPlaceholder boolean),
       gallery (array of image/video objects, each with isPlaceholder),
       description (short, used in card previews)

   servicePillar:
     name, slug, oneLineDescription, capabilityWords (array of short
     strings, max 4)

   siteSettings:
     heroHeadline, heroSubline, aboutShortCopy, contactEmail,
     socialLinks

3. Write a typed Sanity client in /src/lib/sanity.ts with a fetch helper
   using GROQ, and generate TypeScript types for each schema (either by
   hand in /src/lib/types.ts or via sanity-codegen — pick one and be
   consistent).
4. Seed the studio with placeholder entries for these real projects,
   correctly tagged (do NOT invent projects beyond this list):
   - Shawls & Soul (pillar: brand-identity, template: identity, isOwnVenture: true)
   - BLU X, Blue Bridge LLC, OURA, Stoke Gadget, SDC, Zyphra, CropIQ,
     Studio Buntu (pillar: brand-identity, template: identity)
   - TechFest IMS (pillar: campaign-content, template: campaign)
   - GDGoC IMSciences (pillar: campaign-content, template: campaign)
   Leave description/outcome/reach fields as [PLACEHOLDER COPY] — do not
   write invented case study narratives, I'll supply real copy separately.

Acceptance criteria:
- Studio runs locally, all schemas validate, seed data visible in the
  Studio UI.
- Frontend can successfully query and log one caseStudy document by slug.
```

---

## Phase 3 — Global Layout: Nav, Footer/Contact Strip, Page Transitions

```
Build the persistent layout shell per AGENTS.md.

Do:
1. Nav component: fixed/sticky, minimal — logo/name mark (text-based,
   "Hikmatyar"), links to Work / Services / About / Contact, mobile
   version collapses to a single full-screen overlay menu (not a
   generic hamburger dropdown — make the mobile menu open feel
   intentional: staggered link reveal using the "section reveal" motion
   tier from AGENTS.md).
2. Footer / Contact Strip component: NOT a full duplicated homepage —
   this is deliberately lighter than a typical agency footer. Just:
   your name, one short line, two CTAs ("Start a project" /
   "Book a call"), social links, copyright. Same component renders at
   the bottom of every route.
3. Page transition wrapper using Framer Motion's AnimatePresence in the
   root layout: crossfade + 20px vertical settle per AGENTS.md's
   "page transition" motion tier. Must respect prefers-reduced-motion
   (fall back to instant/opacity-only transition).
4. Focus states: visible on every interactive element, using --accent
   as the focus ring color, meeting WCAG contrast against #0E0E0E.

Acceptance criteria:
- Nav and footer render identically on every route once wired into
  layout.tsx.
- Keyboard tab order is logical through nav → page content → footer.
- Reduced-motion users get no crossfade/transform, just a plain swap.
```

---

## Phase 4 — Homepage

```
Build the homepage per the wireframe below. Each section is a separate
component in /src/components/home/.

SECTION 1 — Hero
- Full-viewport. Large Degular Display headline (one sentence fragment,
  pull from siteSettings.heroHeadline — use placeholder copy
  "Brand identity, built with intent." if not yet set).
- Hero visual: short looping video of best work in motion, muted,
  autoplay, poster frame required.
  ASSET POLICY: until real reel footage is added, source a free
  Pexels/Mixkit clip that reads as "close, tactile, craft-in-progress"
  — e.g. search Pexels for "hands weaving loom" or "design studio close
  up" — download to /public/placeholder-media/hero/ and mark
  isPlaceholder true in a local config, not hardcoded permanently.
- Motion: staggered line reveal on load (section-reveal tier).

SECTION 2 — Featured Work
- 3 project cards pulled from Sanity (query the 3 most recent
  caseStudy docs), mixed-ratio media (alternate portrait ~4:5 and
  landscape ~3:2 across the row — don't let all three match).
- Each card: name, pillar tag, one-line description, "View case" link.
- Motion: scroll-triggered reveal via GSAP ScrollTrigger, staggered.

SECTION 3 — Services (three pillars)
- Query servicePillar docs. Three columns desktop, stacked mobile.
- Each: eyebrow label, one-sentence description, up to 4 capability
  words in a small caps row. Do NOT render this as a bulleted feature
  list — treat it like an editorial masthead section, matching the
  eyebrow-label rhythm defined in AGENTS.md typography tokens.

SECTION 4 — About (compact)
- 3–4 sentences from siteSettings.aboutShortCopy, one photo, one line
  naming Shawls & Soul and mehbob.mov as range — NOT styled as
  competing brand logos, just inline text.
- No motion beyond a simple fade-in — this section should feel calm
  after the Work/Services sections.

SECTION 5 — Contact Strip
- Reuse the Footer/Contact Strip component from Phase 3 — do not build
  a second, different contact block here.

Acceptance criteria:
- Homepage is fully data-driven from Sanity (no hardcoded project data
  in the component files).
- Lighthouse performance score on this page is a real number you report
  back, not assumed — flag anything scoring under 80 before moving on.
```

---

## Phase 5 — Work Archive

```
Build /work — the full project index.

Do:
1. Query all caseStudy documents from Sanity, sorted by year descending.
2. Filter control by pillar (Brand & Identity / Campaign & Content /
   Growth & Automation) — simple tab or pill filter, updates the grid
   without a full page reload (client-side filter on already-fetched
   data, not a new fetch per filter click).
3. Same project card component from the homepage Featured Work section
   — reuse it, don't rebuild a second card variant.
4. Empty state: if a pillar has zero projects yet (e.g. Growth &
   Automation may not have a public case study written yet), show a
   short honest line — "Case studies for this coming soon" — never an
   empty grid with no explanation.

Acceptance criteria:
- Filtering is instant (no network round-trip), accessible via keyboard,
  and the active filter has a visible state using --accent.
```

---

## Phase 6 — Case Study Templates (Identity + Campaign)

```
Build /work/[slug] as a dynamic route that renders ONE of two layouts
based on caseStudy.templateType. Do not merge these into one flexible
template — they should be genuinely different components, per AGENTS.md.

IDENTITY TEMPLATE (templateType: "identity") — for Shawls & Soul, BLU X,
Blue Bridge LLC, OURA, Stoke Gadget, SDC, Zyphra, CropIQ, Studio Buntu:
  Hero → Context → Challenge → Strategic idea → Identity system
  (typography/color/mark shown applied, not just described) →
  Applications (mixed-ratio gallery) → Outcome → Credits (only if
  isOwnVenture is false and collaborators exist) → Next project card.

CAMPAIGN TEMPLATE (templateType: "campaign") — for TechFest IMS,
GDGoC IMSciences:
  Hero → Brief → Concept (one sentence, large type treatment — this is
  the emotional peak of the campaign template, give it real space) →
  Execution gallery → Reach (real numbers if present in Sanity, else
  render nothing rather than a fake stat) → Next project card.
  This template should read noticeably shorter/punchier than the
  identity template when both are viewed back to back — don't let it
  sprawl to the same length.

Shared behavior:
- "Next project" card at the end always resolves to the next caseStudy
  by document order, wrapping to the first after the last.
- Gallery media: use the isPlaceholder flag from Sanity to show the
  dev-only "Placeholder — replace" badge described in AGENTS.md.
  ASSET POLICY for Shawls & Soul specifically: source real close-up
  loom/weaving placeholder footage from Pexels (search "loom weaving
  close up" or "traditional loom") — this content genuinely fits the
  brand even as a placeholder, so pick clips you'd be comfortable
  leaving up longer than the others if final footage is delayed.
- Own-venture case studies (isOwnVenture: true) render Context/Outcome
  copy in first-person founder voice — if the seed copy reads like a
  third-party client brief, flag it, don't silently render it.

Acceptance criteria:
- Visiting a Shawls & Soul URL renders the identity template; visiting
  TechFest renders the campaign template, visibly different in length
  and structure, not just re-skinned.
- generateStaticParams (or equivalent) is wired so all case studies are
  statically generated at build time.
```

---

## Phase 7 — About Page

```
Build /about — one level deeper than the homepage's compact About
section, but still short. No "culture page," no team section (there is
no team).

Sections: a real intro paragraph in first person (who you are, what you
actually do across the three pillars), a short "how I work" block (3–4
principles, not a numbered agency-process deck), and a closing line into
the contact CTA. Reuse the Contact Strip component at the bottom.

Acceptance criteria:
- Page reads like it was written by one person about their own practice
  — flag any sentence that defaults to "we"/"our team" language.
```

---

## Phase 8 — Contact Page / Flow

```
Build the contact experience as a progressive, one-question-at-a-time
flow (not a single long form), per AGENTS.md's UI-transition motion tier.

Steps: 1) project type (button choice: Brand & Identity / Campaign &
Content / Growth & Automation / Not sure yet) → 2) name + email →
3) short message → submit.

- Each step transitions with the UI-transition tier (250–450ms).
- Success state: a real, specific, personal line in your voice — not a
  generic "Thank you, we'll be in touch." Draft 2–3 options and let me
  pick, don't hardcode one.
- Error state: equally human, specific about what to do next (e.g. email
  directly), never a raw error code shown to the user.
- Wire submission to a real endpoint (Sanity, a form service, or an API
  route sending email — ask me which one before hardcoding a specific
  provider, since this touches credentials).

Acceptance criteria:
- Full flow is keyboard-navigable, each step is announced correctly to
  screen readers (aria-live region for step changes).
```

---

## Phase 9 — Motion Pass

```
This is a polish pass across everything already built — do not add new
sections, only refine motion. Go through every component built in
Phases 3–8 and confirm each animation maps to exactly one tier from
AGENTS.md (micro / UI transition / section reveal / page transition).

Do:
1. Add GSAP ScrollTrigger reveals to any section still using a plain
   CSS fade — staggered per AGENTS.md.
2. Confirm hover states (project cards, nav links, buttons) use the
   micro tier and the --accent color consistently — no one-off custom
   easing per component.
3. Add prefers-reduced-motion handling everywhere it's missing.
4. Remove any animation you can't justify in one sentence — literally
   write that justification as a code comment above the animation, and
   if you can't, cut it.

Acceptance criteria:
- A written list (in the PR description or a comment block) of every
  animation in the site and its one-sentence justification.
```

---

## Phase 10 — Performance, Accessibility, SEO Pass

```
Final pre-launch pass.

Performance:
- All images via next/image with correct sizes; all placeholder/real
  video compressed (H.264 MP4 + poster frame), lazy-loaded below the
  fold via IntersectionObserver.
- Run Lighthouse on Home, Work, one Identity case study, one Campaign
  case study — report all four scores, don't just report the best one.

Accessibility:
- Real alt text on every image (not filenames) — flag any placeholder
  image still missing real alt text.
- Confirm every custom-styled control (video play/pause, filter tabs,
  contact form steps) is a real <button> under the hood.
- Confirm color contrast of --text (#D8D8D8) and --accent (#FF4A4A) both
  pass WCAG AA against #0E0E0E.

SEO:
- Unique title + meta description per route.
- Open Graph + Twitter Card tags, one shared 1200×630 og:image asset
  (flag if this doesn't exist yet — don't fake one).
- Person schema for the homepage, CreativeWork schema per case study.
- sitemap.xml and robots.txt generated via Next.js's built-in support.

Acceptance criteria:
- A short written report: Lighthouse scores per page, any accessibility
  issues found and fixed, confirmation SEO tags are unique per route.
```
