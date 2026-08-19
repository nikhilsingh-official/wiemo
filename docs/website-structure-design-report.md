# WIEMO Website Structure Design Report

Generated: 2026-08-04  
Repository: `/home/nikhils/WebstormProjects/particle-physics`  
Purpose: help a human reviewer understand and manually inspect the structure of the website in detail.

## Contents

1. Executive summary
2. Key findings
3. Implications
4. Recommendations
5. Manual walkthrough guide
6. Appendix

## Executive summary

This is a Nuxt 4 website for The What is Everything Made of Initiative, using Vue single-file components, Nuxt file-based routing, `@nuxt/content` for blog content, SCSS for the visual system, and Three.js-powered particle hero animations.

The site is organized around a small set of static top-level pages, a blog area split into Reflections and Series, and a shared content/configuration layer. The most important structural fact for manual review is that the visible site is not driven from one CMS-only source: top-level page copy and navigation live in TypeScript files under `app/content` and `app/navbar`, while blog entries live as Markdown files under `content/blog`.

The project validated successfully with:

- `pnpm run typecheck`
- `pnpm run generate`

Static generation completed and reported 76 prerendered routes. The generated output also surfaced three review-relevant warnings: Nuxt Studio authentication is not configured for production, the build spent significant time in some plugins, and some client chunks exceed 500 kB after minification.

## At a glance

| Area | Main files | What to inspect manually |
| --- | --- | --- |
| App shell | `app/app.vue`, `app/components/Navbar.vue`, `app/components/SiteFooter.vue` | Global layout, fixed navigation, footer content, route-level hero behavior |
| Configuration | `nuxt.config.ts`, `content.config.ts`, `package.json` | Nuxt modules, Studio route, content schemas, build scripts |
| Top-level content | `app/content/siteContent.ts`, `app/navbar/items.ts` | Mission copy, impact numbers, partner list, navigation links, highlighted blog dropdown posts |
| Static pages | `app/pages/*.vue` | Home, About, Gallery, Timeline, Volunteer, Total Impact |
| Blog routes | `app/pages/blog/**` | Reflections index/detail, Series spectrum/index/detail |
| Blog source content | `content/blog/reflections`, `content/blog/series` | Frontmatter, titles, dates, draft flags, thumbnails, series metadata |
| Hero animation | `app/components/Hero.vue`, `app/components/ParticleCanvas.client.vue`, `app/hero/**`, `public/models` | Route-to-hero-stage mapping, GLB model loading, Three.js particle morph behavior |
| Visual system | `app/assets/styles/**` | Color tokens, fonts, layout wrappers, shared components, reduced-motion handling |
| Public assets | `public/logos`, `public/images`, `public/models`, `public/fonts` | Image availability, attribution, licensing, file sizes, missing permission-sensitive media |

## Introduction

This report describes the current website structure from the checked-out repository state. It is intended for a manual reviewer who needs to know where to look, what each route is supposed to render, and which source files control each visible part of the site.

The report does not make claims about content accuracy outside the repository. It treats the codebase, content files, and successful generation output as the evidence.

## Key findings

### 1. The website uses Nuxt file-based routing

Routes are defined by Vue files under `app/pages`. There is no separate custom router file. The route tree is:

| URL pattern | Source file | Type | Main content source |
| --- | --- | --- | --- |
| `/` | `app/pages/index.vue` | Static top-level page | `SITE_CONTENT`, home component markup |
| `/about` | `app/pages/about.vue` | Static top-level page | `SITE_CONTENT` |
| `/gallery` | `app/pages/gallery.vue` | Static top-level page | Hard-coded placeholder copy |
| `/timeline` | `app/pages/timeline.vue` | Static top-level page | Hard-coded placeholder heading |
| `/volunteer` | `app/pages/volunteer.vue` | Static top-level page | `SITE_CONTENT`, hard-coded volunteer copy |
| `/total-impact` | `app/pages/total-impact.vue` | Static top-level page | `SITE_CONTENT.impactMetrics` |
| `/blog/reflections` | `app/pages/blog/reflections/index.vue` | Blog index | `queryCollection('reflections')` |
| `/blog/reflections/[...slug]` | `app/pages/blog/reflections/[...slug].vue` | Blog detail | `queryCollection('reflections').path(route.path)` |
| `/blog/series` | `app/pages/blog/series/index.vue` | Blog series overview | `queryCollection('series')`, `SeriesEnergySpectrum` |
| `/blog/series/[series]` | `app/pages/blog/series/[series]/index.vue` | Single series index | `queryCollection('series')` filtered by `seriesSlug` |
| `/blog/series/[series]/[...slug]` | `app/pages/blog/series/[series]/[...slug].vue` | Series post detail | `queryCollection('series').path(route.path)` filtered by `seriesSlug` |

Manual review implication: start with `app/pages` to understand site navigation, then inspect shared content and components only where each page imports them.

### 2. Global layout is centralized in `app/app.vue`

Every route renders through the same app shell:

- `NuxtRouteAnnouncer`
- fixed `Navbar`
- conditional `Hero`
- `NuxtPage`
- `SiteFooter`

`Hero` is shown only when the current route has `route.meta.heroStages`. Pages opt into hero behavior using `definePageMeta`.

Manual review implication: if a page appears to have unexpected top spacing, overlapping navigation, or a missing hero, inspect both the route file and `app/app.vue`.

### 3. Navigation is data-driven but not CMS-driven

Primary navigation is controlled by `app/navbar/items.ts`.

Current top-level navigation:

1. Home — `/`
2. About Us — `/about`
3. Gallery — `/gallery`
4. Blog — `/blog/reflections`
5. Timeline — `/timeline`
6. Volunteer — `/volunteer`
7. Total Impact — `/total-impact`

The Blog navigation item is special. `Navbar.vue` renders a dropdown only for the item whose label is exactly `Blog`. That dropdown has two category links and three hard-coded featured post links.

Manual review implication: if blog posts are added or renamed, the dropdown does not update automatically. Update `NAVBAR_BLOG_POSTS` manually or replace it with a content query.

### 4. Top-level page copy lives in `SITE_CONTENT`

`app/content/siteContent.ts` stores the major non-blog content:

- initiative name
- strapline
- short description
- goal statement
- mission paragraphs
- impact metrics
- partner names, URLs, and logos
- testimonial text and note
- homepage page-preview cards
- contact placeholder

The Home, About, Total Impact, Volunteer, Hero text, impact metrics, and footer all depend on this object.

Manual review implication: this is the first file to check when reviewing factual content, impact numbers, partner links, or footer/contact state.

### 5. The blog uses `@nuxt/content` with two application collections

The application-level content collections are defined in `content.config.ts`:

- `reflections`: page content from `content/blog/reflections/*.md`
- `series`: page content from `content/blog/series/**/*.md`

Both share a base blog schema requiring title, subheading, excerpt, author default, date, thumbnail, thumbnail alt text, tags, featured flag, draft flag, and optional image credit/source URL.

Series posts extend the base schema with:

- `postExcerpt`
- `seriesTitle`
- `seriesDescription`
- `seriesSlug`
- `seriesPart`
- `energyTier`
- `complexityRating`

Current content inventory:

| Content group | Count | Notes |
| --- | ---: | --- |
| Reflections | 2 | Two dated reflection posts |
| Series: Detector Thinking | 4 | TeV tier, complexity 9 |
| Series: Field Notes from CMS | 4 | GeV tier, complexity 7 |
| Series: Nuclear Scale | 5 | MeV tier, complexity 6 |
| Series: Repeatable Sessions | 4 | eV tier, complexity 2 |
| Series: Student Inquiry Labs | 4 | keV tier, complexity 4 |
| Total Markdown files processed during generation | 23 | Matches generation output |

Manual review implication: inspect frontmatter first, then body copy. Route generation depends heavily on frontmatter consistency.

### 6. The hero animation is route-controlled and asset-dependent

Hero stages are defined in `app/hero/stages.ts`. Each stage maps:

- `modelFilename`
- visible label
- headline word

The homepage uses a multi-stage sequence: galaxy, earth, DNA, human, matter, collision. Most inner pages use a single stage, such as People for About, Camera for Gallery, Hourglass for Series/Timeline, Handshake for Volunteer, and EarthContinents for Total Impact.

Rendering path:

1. Page sets `definePageMeta({ heroStages: [...] })`.
2. `app/app.vue` checks whether `route.meta.heroStages` exists.
3. `Hero.vue` derives particle options and text options.
4. `ParticleCanvas.client.vue` creates or updates `ParticleExperience`.
5. `ParticleExperience` uses Three.js and GLB shapes from `public/models`.

Manual review implication: for visual or performance problems around the hero, check route metadata, `public/models`, and `app/hero/three` together.

### 7. The visual design system is SCSS-based

Global CSS entry: `app/assets/styles/base.scss`.

Core style modules:

- `_variables.scss`: color tokens, font families, spacing, breakpoints, transition values
- `_typography.scss`: font-face and heading/body type rules
- `_layout.scss`: `.wrap`, `.content-section`, `.section-heading`, `.lede`, `.stack`, `.visually-hidden`
- `_components.scss`: `.eyebrow`, `.readout`, `.channel`, `.button`, `.topbar`
- `_mixins.scss` and `_functions.scss`: shared style helpers
- `global.scss`: injected into Vue files through Vite SCSS `additionalData`

The design language is a dark particle/Cherenkov-inspired system using blues, cyan highlights, a black background, display/body/mono font roles, rounded cards, thin borders, and radial/glow effects.

Manual review implication: visual changes should usually start with tokens and shared styles, then page-scoped styles. Avoid duplicating one-off values unless a component truly needs a local exception.

### 8. Several pages are intentionally placeholders

Some pages currently hold minimal or permission-gated content:

- `/gallery`: placeholder because the source note says not to use the gallery drive yet.
- `/timeline`: currently only renders the heading `Timeline`.
- `/volunteer`: describes future volunteer-role/contact content but does not yet contain role details.
- Footer contact: displays `Email coming soon`.
- Testimonial note: says permission still needs to be confirmed.

Manual review implication: these are not broken pages, but they should be classified as incomplete content areas before launch.

### 9. Static generation succeeded, with warnings worth reviewing

Validation commands run:

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm run typecheck` | Passed | No type errors printed |
| `pnpm run generate` | Passed | 76 routes prerendered |

Generation warnings:

- Nuxt Studio production authentication is not configured.
- Build plugin timings reported significant time spent in plugins.
- Some client chunks are larger than 500 kB after minification.

Manual review implication: the structure currently builds, but production-readiness should include Studio auth decisions and bundle/performance review.

## Implications

### Editing content requires knowing which content system owns it

There are two content ownership models:

- TypeScript-owned site copy for the main pages and navigation.
- Markdown-owned blog posts for reflections and series.

A manual editor should not expect all visible copy to appear in Nuxt Studio content files. Some important website facts are hard-coded into TypeScript constants.

### Blog URLs are content-path-dependent

Blog detail pages are resolved with `queryCollection(...).path(route.path)`. This means that Markdown location and generated path must match the actual URL path.

For manual review, verify each published Markdown file by visiting its generated URL, not only by checking the index page.

### Series pages depend on consistent metadata across posts

The series index groups posts by `seriesSlug`. The single-series page derives title, description, and complexity from the first post returned after ordering by `seriesPart`.

Manual implication: metadata drift inside one series can create inconsistent display. Check that every post in a series uses the same `seriesSlug`, `seriesTitle`, `seriesDescription`, `energyTier`, and `complexityRating`.

### Hero assets affect both page identity and performance

Each page can trigger GLB loading. The homepage loads a sequence of multiple models and uses a particle count override. This creates the strongest visual identity but is also the most likely source of performance issues on lower-end devices.

Manual implication: test the homepage and blog index on mobile and reduced-motion settings, not only desktop.

### The Blog dropdown is a maintenance seam

The dropdown uses hard-coded featured post links. It can become stale even when the blog collection is correct.

Manual implication: every blog content update should include a quick check of `app/navbar/items.ts`.

## Recommendations

### 1. Use a route-first review order

Review routes in the same order a first-time visitor would encounter them:

1. `/`
2. `/about`
3. `/total-impact`
4. `/gallery`
5. `/blog/reflections`
6. reflection detail pages
7. `/blog/series`
8. each series index page
9. each series detail page
10. `/timeline`
11. `/volunteer`

This catches navigation, shared-shell, and content consistency issues before diving into component internals.

### 2. Treat `SITE_CONTENT` as the factual-content checklist

Before launch, verify:

- initiative name
- mission language
- short description
- 1,000-student goal date
- impact numbers
- partner names, URLs, and logos
- testimonial permission status
- contact email state

### 3. Add a content governance rule for blog frontmatter

For every new blog post, manually check:

- `draft` is explicit
- `date` is correct
- `thumbnail` exists under `public`
- `thumbnailAlt` is descriptive
- series metadata matches the rest of its series
- quoted numeric values are avoided for numeric fields such as `seriesPart` and `complexityRating`

The current build succeeds, but numeric fields are inconsistently written in a few files. Normalizing them will reduce future content-schema ambiguity.

### 4. Decide how production Studio should be handled

The build warned that Nuxt Studio needs production authentication setup, or Studio should be disabled in production config.

Before deployment, decide one of:

- configure Nuxt Studio authentication; or
- disable Studio in production if public editing is not intended.

### 5. Do a focused performance pass on animation and generated chunks

The generated client output includes large chunks and heavy animation dependencies. For manual review, check:

- homepage load time
- first interaction delay
- mobile GPU behavior
- reduced-motion experience
- whether Three.js and Nuxt Studio code should be further split or deferred

## Manual walkthrough guide

### Step 1: Confirm the global shell

Files:

- `app/app.vue`
- `app/components/Navbar.vue`
- `app/components/SiteFooter.vue`

Check:

- Navbar appears on every page.
- Fixed navbar does not obscure first content section.
- Footer appears after every page body.
- Blog dropdown opens on hover/focus and all links resolve.
- Active navigation state is clear, especially for nested blog routes.

### Step 2: Review top-level content data

Files:

- `app/content/siteContent.ts`
- `app/navbar/items.ts`

Check:

- All partner URLs open correctly.
- All partner logos exist under `public/logos`.
- Impact metrics are current.
- Contact email is intentionally placeholder or replaced.
- Testimonial permission note is resolved before publication.
- Blog dropdown posts are still the intended highlighted posts.

### Step 3: Review top-level routes

| Route | What the user sees | Manual checks |
| --- | --- | --- |
| `/` | Hero, mission, impact cards, partners, page previews, testimonial | Check copy, impact values, partner logos, page-preview links |
| `/about` | Initiative name, short description, mission paragraphs | Check mission accuracy and readability |
| `/gallery` | Permission-pending placeholder | Confirm placeholder is acceptable or replace after permissions |
| `/timeline` | Simple Timeline heading | Decide whether this is acceptable for launch |
| `/volunteer` | Volunteer intro and link to About | Add roles/contact path if needed |
| `/total-impact` | Goal and three impact metric cards | Verify figures and goal wording |

### Step 4: Review blog collection structure

Files:

- `content.config.ts`
- `content/blog/reflections/*.md`
- `content/blog/series/**/*.md`

Check:

- No published post has `draft: true` accidentally.
- Every thumbnail path resolves to a file under `public`.
- Every image has alt text.
- Date ordering is correct.
- Reflection posts have required base fields.
- Series posts have all extended fields.

### Step 5: Review Reflections

Files:

- `app/pages/blog/reflections/index.vue`
- `app/pages/blog/reflections/[...slug].vue`
- `app/components/BlogCard.vue`
- `app/components/BlogArticle.vue`

Check:

- `/blog/reflections` lists the expected two posts.
- Featured or active visual behavior is intentional.
- Scroll/accelerator canvas behavior works on desktop and mobile.
- Detail pages render title, subheading, author/date, thumbnail, image credit if present, and body content.

### Step 6: Review Series

Files:

- `app/pages/blog/series/index.vue`
- `app/pages/blog/series/[series]/index.vue`
- `app/pages/blog/series/[series]/[...slug].vue`
- `app/components/SeriesEnergySpectrum.vue`
- `app/components/BlogCard.vue`
- `app/components/BlogArticle.vue`
- `shared/energyTiers.ts`

Check:

- `/blog/series` groups all five series.
- Energy tiers match the intended progression:
  - eV: Atomic
  - keV: X-ray
  - MeV: Nuclear
  - GeV: Particle
  - TeV: Collider
- Series pages sort posts by `seriesPart`.
- Series complexity displays correctly.
- Each post detail page has a working back link.
- Desktop spectrum interactions and mobile fallback both work.

### Step 7: Review hero and 3D asset behavior

Files:

- `app/hero/stages.ts`
- `app/components/Hero.vue`
- `app/components/ParticleCanvas.client.vue`
- `app/hero/three/**`
- `public/models/**`

Check:

- Each route uses the intended model and headline word.
- Missing or slow GLB loads fail acceptably.
- Homepage morph sequence advances smoothly.
- Reduced-motion preference does not create distracting animation.
- Canvas has acceptable accessibility labeling.

### Step 8: Review styling and responsive behavior

Files:

- `app/assets/styles/base.scss`
- `app/assets/styles/_variables.scss`
- `app/assets/styles/_typography.scss`
- `app/assets/styles/_layout.scss`
- `app/assets/styles/_components.scss`
- scoped styles in each `.vue` page/component

Check at minimum:

- 320 px mobile width
- tablet width around 760–820 px
- desktop width
- keyboard focus visibility
- navbar overflow behavior
- blog card grids collapsing correctly
- color contrast for muted/faint text

## Appendix

### A. Source file map

```text
app/
  app.vue                         Global route shell
  assets/styles/                  SCSS design system
  blog/                           Blog-specific client helpers
  components/                     Shared Vue components
  content/siteContent.ts          Main non-blog content constants
  hero/                           Hero stage metadata and Three.js engine
  navbar/items.ts                 Primary navigation and blog dropdown constants
  pages/                          Nuxt route files
content/
  blog/reflections/               Reflection Markdown posts
  blog/series/                    Series Markdown posts grouped by series slug
public/
  fonts/                          Local font assets
  images/                         Blog and site images
  logos/                          WIEMO and partner logos
  models/                         GLB models used by hero animation
shared/
  energyTiers.ts                  Series energy tier definitions
```

### B. Current content counts

| Path | Count |
| --- | ---: |
| `content/blog/reflections/*.md` | 2 |
| `content/blog/series/detector-thinking/*.md` | 4 |
| `content/blog/series/field-notes-from-cms/*.md` | 4 |
| `content/blog/series/nuclear-scale/*.md` | 5 |
| `content/blog/series/repeatable-sessions/*.md` | 4 |
| `content/blog/series/student-inquiry-labs/*.md` | 4 |

### C. Validation record

| Check | Result |
| --- | --- |
| TypeScript/Nuxt typecheck | Passed |
| Static generation | Passed |
| Prerender count | 76 routes |
| Content files processed by Nuxt Content | 23 files |

Observed generation warnings:

- Nuxt Studio production authentication warning.
- Plugin timing warning.
- Large chunk warning for some generated client chunks.

### D. High-priority manual review questions

1. Are the impact numbers current and approved for publication?
2. Are all partner logos licensed or approved for this site?
3. Is the gallery intentionally placeholder at launch?
4. Is the testimonial approved, or should it remain hidden until permission is confirmed?
5. Should Nuxt Studio be available in production?
6. Should blog dropdown posts be hard-coded or content-driven?
7. Are the large generated chunks acceptable for the intended audience’s devices and network conditions?
8. Should the Timeline page remain a placeholder, or does it need real content before manual sign-off?

