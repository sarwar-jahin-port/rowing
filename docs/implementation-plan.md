# 🚣 Oar & Blade — Detailed Implementation Plan

> **Document version**: 1.1  
> **Date**: October 1, 2026  
> **Agency name**: Oar & Blade *(confirmed)*  
> **Architecture**: Single-page scroll *(confirmed)*  
> **Theme direction**: White/off-white backgrounds + red & charcoal accents  
> **Reference**: [Zfuence.com](https://www.zfuence.com/) (structural patterns only — color direction is inverted)

### ✅ Confirmed Decisions

| Decision | Answer |
|---|---|
| Agency name | **Oar & Blade** |
| Page structure | **Single-page scroll** (all sections on one page) |
| Founder section | **Placeholder** — client will provide bio/photo later |
| Pricing | **Not visible** on the site |
| Video embed | **Yes** — YouTube VSL/showreel |
| Color palette | **Red + charcoal** on white/off-white backgrounds |
| Contact form | **Frontend only** — simple mail redirect (Formspree / Web3Forms) |
| Booking | **Calendly** integration |

---

## 0. Design System — Color Theme Overhaul

> [!IMPORTANT]
> The entire token system in `variables.css` must be updated **before** any section work begins. The architecture is already built for easy theme swaps — every value flows from `:root` custom properties.

### 0.1 New Color Palette

```
PRIMARY BACKGROUND          SURFACE / CARDS              ELEVATED SURFACE
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│                      │    │                      │    │                      │
│   #FFFFFF            │    │   #F8F7F4            │    │   #FFFFFF            │
│   Pure White         │    │   Warm Off-White      │    │   White + shadow     │
│                      │    │   (alternating sect.) │    │   (cards, nav)       │
│                      │    │                      │    │                      │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘

RADISH / ACCENT              TEXT PRIMARY                 TEXT SECONDARY
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│                      │    │                      │    │                      │
│   #C8102E            │    │   #111318            │    │   #555B6E            │
│   Rowing Crimson     │    │   Near-Black          │    │   Slate Gray         │
│   (brand red)        │    │   (headings, body)    │    │   (subtext, capts)   │
│                      │    │                      │    │                      │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

| Token | Dark Theme (old) | Light Theme (new) | Purpose |
|---|---|---|---|
| `--c-bg` | `#07080f` | `#FFFFFF` | Page background |
| `--c-bg-alt` | `#0b0d15` | `#F8F7F4` | Alternating section background |
| `--c-surface` | `#0e1018` | `#FFFFFF` | Card / component background |
| `--c-surface-raised` | `#161821` | `#FFFFFF` | Elevated cards (use shadow instead) |
| `--c-primary` | `#c8102e` | `#C8102E` | **Unchanged** — radish/crimson red |
| `--c-primary-hover` | `#e01535` | `#E01535` | Hover state for red |
| `--c-primary-muted` | `rgba(200,16,46,0.12)` | `rgba(200,16,46,0.06)` | Subtle red tint |
| `--c-accent` | `#d4a853` | `#2B2D33` | Charcoal accent (secondary) |
| `--c-text` | `#f0f0f2` | `#111318` | Primary text |
| `--c-text-2` | `#a0a3b1` | `#555B6E` | Secondary text |
| `--c-text-3` | `#6b6e7b` | `#8E92A0` | Tertiary / muted text |
| `--c-text-inverse` | `#07080f` | `#FFFFFF` | Text on dark/red backgrounds |
| `--c-border` | `rgba(255,255,255,0.06)` | `rgba(0,0,0,0.06)` | Subtle borders |
| `--c-border-hover` | `rgba(255,255,255,0.12)` | `rgba(0,0,0,0.10)` | Hover borders |
| `--c-divider` | `rgba(255,255,255,0.04)` | `rgba(0,0,0,0.04)` | Section dividers |

### 0.2 Noise Overlay Adjustment

The grain overlay must be inverted for a light background — dark noise particles on white:

```css
.noise {
  /* Change from white noise to dark noise */
  filter: invert(1);
  opacity: 0.02;   /* Lower opacity on light backgrounds */
}
```

### 0.3 Shadow System (Replaces Border-Heavy Dark Theme)

On a white background, elevation = shadows, not borders:

```
--shadow-sm:   0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)
--shadow-md:   0 4px 12px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)
--shadow-lg:   0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)
--shadow-xl:   0 20px 60px rgba(0,0,0,0.10)
--shadow-glow: 0 0 24px rgba(200,16,46,0.08)
```

### 0.4 Theme-Swap Architecture

All colors are already consumed via `var(--token)`. A future dark mode toggle only requires:

```css
[data-theme="dark"] {
  --c-bg: #07080f;
  --c-text: #f0f0f2;
  /* ...override tokens here... */
}
```

No component CSS changes needed — it just works.

### 0.5 Selection & Scrollbar

```css
::selection { background: var(--c-primary); color: #fff; }
scrollbar-color: #d4d4d8 transparent;   /* light thumb on white track */
```

---

## 1. Navigation Bar

### 1.1 Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  [LOGO]          Studio  Work  Testimonial  Pricing  Results  [CTA]│
└─────────────────────────────────────────────────────────────────────┘
```

- **Position**: `fixed` top, full width, `z-index: var(--z-sticky)`
- **Height**: `72px` (token: `--nav-height`)
- **Max-width**: Content constrained to `--max-width` (1200px), centered

### 1.2 Visual States

| State | Background | Border | Shadow | Text Color |
|---|---|---|---|---|
| **Default** (top of page) | `transparent` | none | none | `--c-text` (dark) |
| **Scrolled** (past 50px) | `rgba(255,255,255,0.92)` | bottom `1px solid --c-border` | `--shadow-sm` | `--c-text` |
| **Scrolled** also gets `backdrop-filter: blur(12px)` for frosted glass effect |

### 1.3 Logo

- Left-aligned
- `Oar & Blade` wordmark (image or SVG, ~140px wide)
- Fallback: text logo in heading font if image unavailable
- Links to `#` (top of page)

### 1.4 Nav Links

- **Font**: `var(--ff-body)`, `var(--fs-body-sm)`, `var(--fw-medium)`
- **Color**: `var(--c-text-2)` → hover: `var(--c-text)` → active section: `var(--c-primary)`
- **Hover effect**: Subtle underline or color shift, `transition: 200ms`
- **Links**: Home · Work · About · Process · Services · Contact *(no Pricing — confirmed invisible)*
- **Desktop only** — hidden below `768px`

### 1.5 CTA Button

- Right-aligned: `Book a Call`
- Uses `.btn--primary` (radish red background, white text)
- Links to **Calendly** booking page (`target="_blank"`, `rel="noopener"`)

### 1.6 Mobile Hamburger (`≤ 768px`)

- 3-line burger icon, animates to **X** on open
- Opens full-screen overlay menu:
  - Background: `var(--c-bg)` (white) with slight overlay
  - Nav links stacked vertically, large touch targets (`48px` min height)
  - CTA button at bottom
  - Smooth slide-in animation: `transform: translateY(-100%)` → `translateY(0)`, `400ms ease-out`
  - `body.menu-open` prevents background scroll (`overflow: hidden`)

### 1.7 Accessibility

- `<nav>` with `aria-label="Main navigation"`
- Burger: `aria-expanded="false/true"`, `aria-controls="mobileMenu"`
- Mobile menu: `role="dialog"`, `aria-hidden="true/false"`
- Focus trap inside mobile menu when open
- All links: `focus-visible` ring

### 1.8 Performance

- No JS for visual state — CSS handles the `.scrolled` class toggling
- JS only adds/removes the class via `passive: true` scroll listener
- Logo image: preloaded in `<head>` if above-the-fold

---

## 2. Hero Section

> [!IMPORTANT]
> This is the **most critical section** — it determines whether visitors stay or bounce. The first 3 seconds must communicate: **what you do**, **who it's for**, and **why they should care**.

### 2.1 Layout — Desktop (`≥ 1024px`)

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  ┌─ Eyebrow Pill ──────────────────┐                                     │
│  │ ● 03 spots available this month │                                     │
│  └─────────────────────────────────┘                                     │
│                                                                           │
│   Your Club Has the Story.                                                │
│   We Make Sure People See It.        ┌──────────────────────────────┐    │
│                                      │                              │    │
│   From training and race day to      │    [VIDEO / SHOWREEL]        │    │
│   new recruits and long-time         │    Embedded YouTube or       │    │
│   alumni, we turn every important    │    hero image/video          │    │
│   club moment into planned,          │                              │    │
│   on-brand, publish-ready social     │                              │    │
│   content.                           └──────────────────────────────┘    │
│                                                                           │
│   [Get a Free Club Content Audit →]  [See Our Work]                      │
│                                                                           │
│   ┌─ Trust Line ─────────────────────────────────────────────────────┐   │
│   │ ★★★★★  Rated 5/5 by the clubs we work with                      │   │
│   └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│   ┌─ Scrolling Marquee ─────────────────────────────────────────────────┐│
│   │ Regatta Content · Athlete Spotlights · Recruitment · Alumni · ...  ││
│   └─────────────────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Layout — Mobile (`< 768px`)

Single column stack: Pill → Headline → Subheadline → CTAs → Video/Image → Trust → Marquee

### 2.3 Detailed Specifications

#### Eyebrow Pill
- Uses `.pill` component with `.pulse` dot
- Text: `"03 spots available this month"`
- The number can auto-rotate (JS) or be manually updated
- Color: muted bg, subtle border, radish-red pulse dot

#### Headline
- **Tag**: `<h1>` (only one on the page — critical for SEO)
- **Font**: `var(--ff-heading)`, `var(--fs-display)` (clamp: 2.75rem → 4.5rem)
- **Weight**: `var(--fw-extrabold)` (800)
- **Color**: `var(--c-text)` (near-black)
- **Line height**: `var(--lh-tight)` (1.1)
- **Letter spacing**: `var(--ls-tight)` (-0.02em)
- **Max-width**: `~16ch` to create a strong typographic block

#### Subheadline
- **Tag**: `<p>`
- **Font**: `var(--fs-body)`, `var(--fw-regular)`, `var(--lh-relaxed)`
- **Color**: `var(--c-text-2)` (slate gray)
- **Max-width**: `52ch`

#### CTA Buttons
- Primary: `.btn--primary` → `Get a Free Club Content Audit →`
- Secondary: `.btn--secondary` → `See Our Work` (scrolls to portfolio)
- Both side by side on desktop, stacked full-width on mobile
- Arrow `→` animates right on hover (`translateX(3px)`)

#### Video / Media Panel
- Right column on desktop, below CTAs on mobile
- **YouTube `<iframe>` embed** (confirmed) — VSL or showreel video
  - `loading="lazy"`, `allow="autoplay; encrypted-media; picture-in-picture; fullscreen"`
  - Wrapped in responsive container with `aspect-ratio: 16/9`
- **Container**: rounded corners (`--radius-xl`), slight `--shadow-lg`

#### Trust Line
- Small cluster of avatar images (5 stacked circles with `-8px` negative margin overlap)
- `★★★★★` stars in gold (`var(--c-accent)`)
- Text: *"Rated 5/5 by the clubs and creators we work with"*

#### Scrolling Marquee
- Full-width horizontal infinite scroll
- Text items: `Club Stories · Regatta Moments · Athlete Spotlights · Recruitment Content · Alumni Visibility`
- Separated by `·` or small rowing blade SVG icons
- Speed: `~40px/s` (CSS `@keyframes` — no JS needed)
- Pauses on hover (optional)
- Duplicated `<div>` for seamless loop
- **Font**: uppercase, `var(--fs-small)`, `var(--fw-medium)`, `--ls-widest`, `var(--c-text-3)`
- **Border**: top and bottom `1px solid var(--c-border)` for visual separation

### 2.4 Animations

| Element | Animation | Trigger | Duration | Delay |
|---|---|---|---|---|
| Pill | Fade up | Page load | 500ms | 0ms |
| Headline | Fade up | Page load | 500ms | 100ms |
| Subheadline | Fade up | Page load | 500ms | 200ms |
| CTA buttons | Fade up | Page load | 500ms | 300ms |
| Video/image | Fade up + scale(0.97→1) | Page load | 600ms | 400ms |
| Trust line | Fade in | Page load | 500ms | 500ms |
| Marquee | Infinite `translateX` loop | Always | 30s linear | — |

> Hero elements should animate on **page load**, not scroll-reveal. They are above-the-fold and must be immediately visible. Use CSS `@keyframes` with `animation-fill-mode: both`, not IntersectionObserver.

### 2.5 SEO Considerations

- `<h1>` contains target keywords naturally: "club", "story", "content"
- Subheadline expands on the value proposition with long-tail phrases
- Semantic `<section>` with `aria-label="Hero"`
- `loading="lazy"` on video iframe (below visible threshold on some viewports)

---

## 3. Trust Strip / Logo Bar

### 3.1 Purpose

Instant credibility — show the rowing clubs whose content/branding the agency has worked with or featured.

### 3.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   Built specifically for rowing clubs and rowing programs.                │
│                                                                           │
│   ← [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] [Logo] →    │
│      infinite scroll marquee                                              │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Specifications

- **Section background**: `var(--c-bg-alt)` (warm off-white `#F8F7F4`) for visual contrast
- **Label text**: `var(--fs-small)`, `var(--fw-medium)`, `--ls-wider`, centered, `var(--c-text-2)`
- **Logos**: 10 club logos from `docs/1. logo of club featured/`
  - All converted to consistent size: `~80px` height, auto width
  - Applied `filter: grayscale(1) opacity(0.5)` → on hover: `grayscale(0) opacity(1)`
  - Smooth transition: `400ms ease-out`
- **Marquee**: CSS `@keyframes` infinite scroll, same technique as hero text marquee
- **Duplicated track**: 3× logo set for seamless loop regardless of viewport width
- **Speed**: Slower than text marquee (`~50s` per full cycle) — logos need time to be read
- **Gap**: `var(--sp-3xl)` between logos
- **Padding**: `var(--sp-2xl)` vertical

### 3.4 Image Optimization

All 10 logos must be:
1. Converted to **WebP** format
2. Resized to max `160px` height (retina: `320px` source)
3. Background removed / transparent PNG → WebP with transparency
4. Compressed to `<30KB` each
5. `alt` text: Club name (e.g., `alt="Leander Club"`)

---

## 4. Problem Section — "The Content Gap"

### 4.1 Purpose

Build **empathy** — make the visitor feel *"they understand my exact problem."* This section must hit before showing the solution.

### 4.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   THE CONTENT GAP                          ← section label (red)         │
│                                                                           │
│   Your club is active. Your social                                        │
│   media should show it.                    ← section headline            │
│                                                                           │
│   [Body copy about the problem...]         ← 2-3 lines                   │
│                                                                           │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐                  │
│   │ 📅            │ │ 🎨            │ │ 🏠            │                  │
│   │ Posting only  │ │ Every post    │ │ Great stories │                  │
│   │ when someone  │ │ looks like a  │ │ stay inside   │                  │
│   │ remembers     │ │ different     │ │ the boathouse │                  │
│   │               │ │ club          │ │               │                  │
│   │ [description] │ │ [description] │ │ [description] │                  │
│   └───────────────┘ └───────────────┘ └───────────────┘                  │
│                       3 pain-point cards                                  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Specifications

- **Background**: `var(--c-bg)` (white)
- **Section label**: `.section-label` — uppercase, `var(--c-primary)`, letter-spacing wide
- **Headline**: `<h2>`, `var(--fs-h2)`, near-black
- **Body copy**: `var(--c-text-2)`, max-width `60ch`
- **Pain cards**: 3 columns on desktop → 1 column on mobile
  - `.card` component with icon/emoji at top
  - Title: `var(--fs-h4)`, `var(--fw-semibold)`
  - Description: `var(--fs-body-sm)`, `var(--c-text-2)`
  - Hover: subtle lift + border highlight (`--c-primary-muted`)
  - **Staggered reveal**: cards appear 80ms apart on scroll
- **Copy source**: PRD § 3.3

### 4.4 Animations

All elements use `.reveal` class — fade up on scroll enter.  
Cards use `.reveal-stagger` wrapper for sequential appearance.

---

## 5. Why Choose Us

### 5.1 Purpose

Differentiation — why a **rowing-specific** content partner matters over a generic agency.

### 5.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  bg: var(--c-bg-alt)                                                      │
│                                                                           │
│   WHY A ROWING-SPECIFIC CONTENT PARTNER    ← label                       │
│                                                                           │
│   A generalist agency can make a post.                                    │
│   We understand what the post means.       ← headline                    │
│                                                                           │
│   [Body copy...]                                                          │
│                                                                           │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐                           │
│   │ Rowing     │ │ Content    │ │ Less work  │                           │
│   │ context    │ │ that fits  │ │ for        │                           │
│   │ built in   │ │ the club   │ │ volunteers │                           │
│   └────────────┘ └────────────┘ └────────────┘                           │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐                           │
│   │ Survives   │ │ Built for  │ │ Clear      │                           │
│   │ handovers  │ │ your goals │ │ monthly    │                           │
│   │            │ │            │ │ scope      │                           │
│   └────────────┘ └────────────┘ └────────────┘                           │
│                       6 benefit cards (3×2 grid)                          │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Specifications

- **Background**: `var(--c-bg-alt)` (off-white) — alternates from previous white section
- **Grid**: `3 × 2` on desktop → `2 × 3` on tablet → `1 × 6` on mobile
- **Cards**: `.card` component, each with:
  - Small icon (SVG or emoji) in `var(--c-primary)` color
  - Title: short, punchy (2-4 words)
  - Body: 1-2 sentences from PRD § 3.4
  - `.card--glow` variant — hover shows subtle red glow
- **Stagger animation**: 6 cards reveal in sequence, 80ms apart
- **Copy source**: PRD § 3.4

---

## 6. Services Section

### 6.1 Purpose

Show the **breadth** of content types the agency delivers. Make it feel comprehensive.

### 6.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   WHAT WE HELP YOU PUBLISH                 ← label                       │
│                                                                           │
│   Everything your club needs to stay                                      │
│   visible between race days.               ← headline                    │
│                                                                           │
│   [Intro copy...]                                                         │
│                                                                           │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                                │
│   │ Club     │ │ Regatta  │ │ Athlete  │                                │
│   │ News     │ │ Content  │ │ Spotlts  │                                │
│   ├──────────┤ ├──────────┤ ├──────────┤                                │
│   │ Recruit  │ │ Coaching │ │ Community│                                │
│   ├──────────┤ ├──────────┤ ├──────────┤                                │
│   │ Sponsor  │ │ Video    │ │ Calendar │                                │
│   │ Visibil. │ │ Editing  │ │ Planning │                                │
│   └──────────┘ └──────────┘ └──────────┘                                │
│                     9 service cards (3×3 grid)                            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 6.3 Specifications

- **Background**: `var(--c-bg)` (white)
- **Grid**: `3 × 3` on desktop → `2 × 5` (last one spanning) on tablet → `1 × 9` on mobile
- **Cards**: Slightly different treatment than benefit cards:
  - Left-aligned icon/emoji (relevant to content type)
  - Title: `var(--fs-h4)`, `var(--fw-semibold)`
  - One-liner description: `var(--c-text-2)`
  - **No hover lift** — these are informational, not clickable
  - Subtle top border accent: `3px solid var(--c-primary)` on hover
- **Copy source**: PRD § 3.5

---

## 7. How It Works — Process Section

### 7.1 Purpose

**Reduce perceived risk** — show that working with the agency is simple and structured. Critical for volunteer-run clubs who fear complexity.

### 7.2 Layout — Vertical Timeline

```
┌───────────────────────────────────────────────────────────────────────────┐
│  bg: var(--c-bg-alt)                                                      │
│                                                                           │
│   A SIMPLE SYSTEM FOR BUSY CLUBS           ← label                       │
│                                                                           │
│   From raw updates to ready-to-publish                                    │
│   content.                                 ← headline                    │
│                                                                           │
│        ①                                                                  │
│        │   Understand the Club                                            │
│        │   We learn about your audience, season, visual identity...       │
│        │                                                                  │
│        ②                                                                  │
│        │   Build the Content Plan                                         │
│        │   We organize what will be published each week...                │
│        │                                                                  │
│        ③                                                                  │
│        │   Create the Content                                             │
│        │   We turn your photos, results, names, and notes...              │
│        │                                                                  │
│        ④                                                                  │
│        │   Review and Refine                                              │
│        │   One designated club contact reviews the content...             │
│        │                                                                  │
│        ⑤                                                                  │
│            Keep the Rhythm Going                                          │
│            When one month ends, the next month's plan begins...           │
│                                                                           │
│   [See How the Monthly Workflow Works →]                                  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Specifications

- **Timeline line**: `2px` vertical line, `var(--c-border)`, left-side
- **Step numbers**: Circles (`40px` diameter), `var(--c-primary)` background, white number inside
  - On scroll-reveal: circle scales from `scale(0)` to `scale(1)` with a spring ease
- **Step content**: To the right of the line
  - Title: `var(--fs-h3)`, `var(--fw-semibold)`
  - Description: `var(--fs-body-sm)`, `var(--c-text-2)`, max-width `50ch`
- **Desktop alternative**: Could also use **horizontal** step cards with connecting arrows
- **Mobile**: Always vertical timeline
- **CTA at bottom**: `.btn--secondary` → scrolls to contact or opens a workflow explainer
- **Each step reveals on scroll** independently — creates a "building" effect as user scrolls
- **Copy source**: PRD § 3.6

---

## 8. Portfolio / Selected Work

### 8.1 Purpose

**Prove the quality.** This is where the sample posts, analytics, and visual work demonstrate capability.

### 8.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   SELECTED WORK                            ← label                       │
│                                                                           │
│   Content that feels like your club —                                     │
│   not a template.                          ← headline                    │
│                                                                           │
│   [Body copy about club-specific systems...]                              │
│                                                                           │
│   ┌─────────────────┐  ┌─────────────────┐                               │
│   │                 │  │                 │                               │
│   │  [Sample Post   │  │  [Sample Post   │                               │
│   │   Image]        │  │   Image]        │                               │
│   │                 │  │                 │                               │
│   │  Regatta Recap  │  │  Athlete        │                               │
│   │  System         │  │  Spotlight      │                               │
│   │  [description]  │  │  Series         │                               │
│   └─────────────────┘  └─────────────────┘                               │
│   ┌─────────────────┐  ┌─────────────────┐                               │
│   │                 │  │                 │                               │
│   │  [Sample Post   │  │  [Sample Post   │                               │
│   │   Image]        │  │   Image]        │                               │
│   │                 │  │                 │                               │
│   │  Recruitment    │  │  Sponsor        │                               │
│   │  Campaign       │  │  Visibility     │                               │
│   │  [description]  │  │  Package        │                               │
│   └─────────────────┘  └─────────────────┘                               │
│                                                                           │
│   Sample Concept — work will be customized around your club's brand.     │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 8.3 Specifications

- **Background**: `var(--c-bg)` (white)
- **Grid**: `2 × 2` on desktop → `1 × 4` on mobile
- **Portfolio cards**: Larger than standard cards
  - **Image**: Takes top ~60% of the card. Uses actual sample posts from `docs/2. Static Sample worked project/`
  - Image treatment: `border-radius: var(--radius-lg)` on top corners
  - `object-fit: cover`, `aspect-ratio: 4/5` (Instagram post ratio)
  - On hover: subtle `scale(1.02)` zoom on the image (overflow hidden on container)
  - **Title**: Below image, `var(--fs-h4)`, `var(--fw-semibold)`
  - **Description**: 1-2 lines from PRD § 3.7
  - **Tag/label**: Small pill showing content type (e.g., "Regatta", "Recruitment")
- **Disclaimer**: Italic, small text at bottom: *"Sample Concept — customized around your club's brand"*
- **Image optimization**: All portfolio images → WebP, max `800px` wide, `<100KB` each
- **Copy source**: PRD § 3.7

### 8.4 Optional Enhancement: Lightbox

On click, a portfolio image opens in a full-screen lightbox overlay with:
- Dark backdrop (`rgba(0,0,0,0.9)`)
- Full-size image
- Close button (X) top-right
- Left/right navigation arrows
- Keyboard navigable (Esc to close, ← → to navigate)
- **Pure CSS + minimal JS** — no external library

---

## 9. Results / Social Proof Section

### 9.1 Purpose

**Hard evidence.** Show real analytics numbers, real engagement, and real interactions from notable rowing figures.

### 9.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  bg: var(--c-bg-alt)                                                      │
│                                                                           │
│   THE NUMBERS                              ← label                       │
│                                                                           │
│   Results that speak for themselves.       ← headline                    │
│                                                                           │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                │
│   │  3.2M+   │  │  31.6K+  │  │  300K+   │  │  86%+    │                │
│   │ Monthly  │  │ Monthly  │  │ Peak     │  │ Growth   │                │
│   │ Views    │  │ Interact │  │ Daily    │  │ Rate     │                │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘                │
│                     4 stat counters                                       │
│                                                                           │
│   ┌──────────────────────────────────────────────────────────────────┐   │
│   │  "Does that make me a very minor Prince? 🤣"                     │   │
│   │   — Adrian Ellison, Olympic Gold Medallist                       │   │
│   │                                                                  │   │
│   │  [Screenshot of comment]                                         │   │
│   └──────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│   ┌──── Scrolling gallery of social proof screenshots ────┐              │
│   │  [SS1]  [SS2]  [SS3]  [SS4]  [SS5]  [SS6] ...        │              │
│   └───────────────────────────────────────────────────────┘              │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 9.3 Specifications

#### Stat Counters (4 across)
- **Numbers**: `var(--fs-display)`, `var(--fw-extrabold)`, `var(--c-text)`
- **Labels**: `var(--fs-small)`, `var(--c-text-2)`
- **Animation**: CountUp on scroll-reveal — numbers animate from 0 to final value over `1.5s`
  - Use `requestAnimationFrame` for smooth 60fps counting
  - Easing: decelerate (`ease-out`) — starts fast, slows at the end
- **Grid**: 4 columns on desktop → 2×2 on mobile

#### Featured Testimonial
- Highlight quote from **Adrian Ellison** (Olympic Gold Medallist) or another notable figure
- Large quote marks in `var(--c-primary-muted)` as decorative background
- Quote text: `var(--fs-h3)`, italic
- Attribution: Name + credential, `var(--fs-small)`, `var(--c-text-2)`
- Optional: small screenshot of the actual comment alongside

#### Social Proof Gallery
- Horizontal scrolling gallery of screenshots from `docs/5. SS comments-share-repost.../`
- CSS `overflow-x: auto` with snap points (`scroll-snap-type: x mandatory`)
- Each screenshot: `border-radius: var(--radius-md)`, `--shadow-sm`
- Custom scrollbar hidden on mobile (drag to scroll)
- Optional: auto-scroll with pause on hover
- Select **best 8-12 screenshots** (not all 33)

---

## 10. What We Need From Your Club

### 10.1 Purpose

Set expectations — reduce friction by showing how **little** the club needs to do.

### 10.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   ┌────────────────────────────┐  ┌──────────────────────────────┐       │
│   │                            │  │                              │       │
│   │   You bring the moments.   │  │  What we typically need:     │       │
│   │   We bring the system.     │  │                              │       │
│   │                            │  │  ✓ Photos & videos           │       │
│   │   [Body copy about how     │  │  ✓ Race results              │       │
│   │    little the club needs   │  │  ✓ Athlete names             │       │
│   │    to provide...]          │  │  ✓ Upcoming dates            │       │
│   │                            │  │  ✓ Important updates         │       │
│   │                            │  │                              │       │
│   └────────────────────────────┘  └──────────────────────────────┘       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

- 2-column layout: Left = headline + explanation, Right = checklist
- Checklist items get subtle checkmark icons in `var(--c-primary)`
- **Copy source**: PRD § 3.9

---

## 11. FAQ Section

### 11.1 Purpose

Overcome remaining objections. Each question addresses a real barrier to purchase.

### 11.2 Layout — Accordion

```
┌───────────────────────────────────────────────────────────────────────────┐
│  bg: var(--c-bg-alt)                                                      │
│                                                                           │
│   COMMON QUESTIONS                         ← label                       │
│                                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐    │
│   │  We are a volunteer-run club. Do we really need an agency?  [+] │    │
│   ├─────────────────────────────────────────────────────────────────┤    │
│   │  We don't always have great photos. Is that a problem?      [+] │    │
│   ├─────────────────────────────────────────────────────────────────┤    │
│   │  Do you only design, or do you also write captions?         [+] │    │
│   ├─────────────────────────────────────────────────────────────────┤    │
│   │  Do you publish the posts for us?                           [+] │    │
│   ├─────────────────────────────────────────────────────────────────┤    │
│   │  How quickly will we receive content?                       [+] │    │
│   ├─────────────────────────────────────────────────────────────────┤    │
│   │  Can we stop after one month?                               [+] │    │
│   ├─────────────────────────────────────────────────────────────────┤    │
│   │  We already work with another designer or agency.           [+] │    │
│   └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 11.3 Specifications

- **7 FAQ items** from PRD § 3.10
- **Accordion behavior**: Click to expand/collapse, only one open at a time
- **Expand/collapse animation**: `max-height` transition with `overflow: hidden`
  - Duration: `var(--duration)` (300ms)
  - Easing: `var(--ease-out)`
- **Toggle icon**: `+` → rotates to `×` on open (CSS `transform: rotate(45deg)`)
- **Question**: `var(--fs-body)`, `var(--fw-semibold)`, padding `var(--sp-lg)`
- **Answer**: `var(--fs-body-sm)`, `var(--c-text-2)`, `var(--lh-relaxed)`
- **Dividers**: `1px solid var(--c-border)` between items
- **Accessibility**: `<details>` + `<summary>` HTML elements (native, no JS required for basic function; JS only enhances animation)
- **JSON-LD**: Add `FAQPage` structured data for rich snippet potential in Google search
- **Max-width**: `var(--max-width-narrow)` (800px) — centered for readability
- **Copy source**: PRD § 3.10

### 11.4 SEO Bonus — FAQ Rich Snippet

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "We are a volunteer-run club. Do we really need an agency?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — especially when volunteer time is limited..."
      }
    }
    /* ... 6 more */
  ]
}
</script>
```

---

## 12. Contact / Final CTA Section

### 12.1 Purpose

**Convert.** This is the money section. Dual-path: contact form (for cautious visitors) and booking link (for ready-to-go visitors).

### 12.2 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   Your next season deserves a better                                      │
│   content rhythm.                          ← headline                    │
│                                                                           │
│   [Body copy — low-pressure invitation]                                   │
│                                                                           │
│   [Request a Free Club Content Audit →]    [Book a 15-Min Call →]         │
│                                                                           │
│   ──────────────── or ────────────────                                    │
│                                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐    │
│   │  Club name          [________________]                          │    │
│   │  Country / Region   [________________]                          │    │
│   │  Website or social  [________________]                          │    │
│   │  Biggest challenge  [________________]                          │    │
│   │  Main goal          [____ dropdown ___]                         │    │
│   │  Content support    [____ dropdown ___]                         │    │
│   │  Your name          [________________]                          │    │
│   │  Email              [________________]                          │    │
│   │  Preferred contact  [________________]                          │    │
│   │                                                                 │    │
│   │  [Request My Club Content Audit →]                              │    │
│   └─────────────────────────────────────────────────────────────────┘    │
│                                                                           │
│   This is not an automatic sales sequence. The purpose of the first      │
│   conversation is to understand whether this kind of support would        │
│   genuinely be useful for your club.       ← reassurance line            │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 12.3 Specifications

#### Form Design
- **Background**: Form on `var(--c-bg-alt)` card with `var(--shadow-lg)`, `var(--radius-xl)`
- **Inputs**: 
  - Height: `48px`
  - Background: `var(--c-bg)` (white)
  - Border: `1px solid var(--c-border)` → focus: `var(--c-primary)`
  - Font: `var(--fs-body-sm)`
  - Placeholder color: `var(--c-text-3)`
  - Border-radius: `var(--radius-md)`
  - `transition: border-color 200ms`
- **Labels**: Above inputs, `var(--fs-small)`, `var(--fw-medium)`, `var(--c-text-2)`
- **Submit button**: `.btn--primary`, full-width on mobile
- **Form action**: **Formspree** or **Web3Forms** endpoint *(confirmed — frontend-only mail redirect, no custom backend)*

#### Form Validation
- HTML5 `required`, `type="email"`, `pattern` attributes for client-side validation
- Custom styled validation messages (`:invalid:not(:placeholder-shown)` trick)
- No JS validation library — keep it native

#### Success State
- On submit: form fades out, success message fades in
- Success: green checkmark + *"We've received your request. We'll review your club's situation and reach out within 48 hours."*

#### Security
- Honeypot field (hidden input) to prevent spam bots
- `rel="noopener noreferrer"` on all external links
- CSP headers already configured in `.htaccess`

- **Copy source**: PRD § 3.11 + § 7

---

## 13. Footer

### 13.1 Layout

```
┌───────────────────────────────────────────────────────────────────────────┐
│  bg: var(--c-accent) or #111318 (dark footer)                             │
│                                                                           │
│   [LOGO]                                                                  │
│   Social media content for rowing clubs and rowing programs.              │
│                                                                           │
│   Home · Services · Work · About · How It Works · Contact                │
│                                                                           │
│   [Instagram]  [Facebook]  [Email]                                        │
│                                                                           │
│   ─────────────────────────────────────────────────────────               │
│   © 2026 Oar & Blade. Built for the rowing community.                    │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

### 13.2 Specifications

- **Background**: Charcoal footer (`#2B2D33` — `var(--c-accent)`) — creates strong visual contrast against white body, signals "end of page"
- **Text**: White/off-white on dark
- **Logo**: White variant of the logo
- **Nav links**: Repeat the main nav links for SEO (internal linking) and UX
- **Social icons**: Minimal SVG icons for Instagram, Facebook, Email
  - Hover: `var(--c-primary)` color shift
- **Copyright**: Dynamic year via `<span id="currentYear"></span>` (JS already set up)
- **Copy source**: PRD § 3.12

---

## 14. Cross-Cutting Concerns

### 14.1 Scroll Reveal System

Every section uses `.reveal` for entrance animation:

| Behavior | Spec |
|---|---|
| Initial state | `opacity: 0; transform: translateY(24px)` |
| Revealed state | `opacity: 1; transform: translateY(0)` |
| Trigger | IntersectionObserver, 8% threshold, `-40px` root margin |
| Duration | `500ms` |
| Easing | `var(--ease-out)` — fast start, gentle stop |
| Fire | Once only — observer disconnects after reveal |

### 14.2 Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| `≥ 1200px` | Desktop (max-width container) |
| `1024px – 1199px` | Small desktop |
| `768px – 1023px` | Tablet |
| `640px – 767px` | Large mobile |
| `< 640px` | Mobile |

### 14.3 Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint | `< 1.2s` |
| Largest Contentful Paint | `< 2.5s` |
| Total page weight | `< 1.5MB` (including images) |
| CSS total | `< 30KB` |
| JS total | `< 15KB` |
| Number of HTTP requests | `< 30` |

### 14.4 Image Strategy

1. **All images**: Convert to **WebP** with PNG/JPG fallback via `<picture>` element
2. **Above-the-fold images**: `loading="eager"`, `fetchpriority="high"`
3. **Below-the-fold images**: `loading="lazy"`, `decoding="async"`
4. **Srcset**: Provide 1x and 2x variants for retina displays
5. **Alt text**: Descriptive, keyword-rich but natural (SEO + accessibility)

### 14.5 Font Loading Strategy

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="...fonts..." rel="stylesheet">
```

- `font-display: swap` (included in Google Fonts URL by default)
- Fallback stack: `system-ui, -apple-system, sans-serif`
- Only load weights actually used: Geist 300–800, Inter 300–600

---

## 15. Implementation Order

> [!TIP]
> Build in this exact order — each step builds on the previous, and the site is always in a presentable state at any checkpoint.

| Step | Section | Priority | Estimated Effort |
|---|---|---|---|
| **0** | ~~Design tokens + infra~~ | ✅ Done | — |
| **1** | Color theme update (white + red/charcoal) | 🔴 Critical | Small |
| **2** | Navigation bar + mobile menu | 🔴 Critical | Medium |
| **3** | Hero section (with YouTube VSL embed) | 🔴 Critical | Large |
| **4** | Trust strip / logo marquee | 🟡 High | Medium |
| **5** | Problem section (The Content Gap) | 🟡 High | Medium |
| **6** | Why Choose Us (benefit cards) | 🟡 High | Medium |
| **7** | Services section (9 cards) | 🟡 High | Medium |
| **8** | How It Works (process timeline) | 🟡 High | Medium |
| **9** | Portfolio / Selected Work | 🔴 Critical | Large |
| **10** | Results / Social Proof | 🟡 High | Large |
| **11** | What We Need From Your Club | 🟢 Medium | Small |
| **12** | FAQ (accordion + JSON-LD) | 🟡 High | Medium |
| **13** | Contact / Final CTA + form (Formspree + Calendly) | 🔴 Critical | Medium |
| **14** | Footer (charcoal bg) | 🟢 Medium | Small |
| **15** | Image optimization pass | 🔴 Critical | Medium |
| **16** | Final SEO audit + meta polish | 🟡 High | Small |
| **17** | Cross-browser + mobile QA | 🔴 Critical | Medium |

> **Removed**: Pricing/Deliverables section — pricing will not be visible on the site.  
> **Founder section**: Placeholder will be added; client will provide bio/photo later.

---

> **Next action**: Update `variables.css` with the new white/radish color tokens, then build Section 1 (Navigation).
