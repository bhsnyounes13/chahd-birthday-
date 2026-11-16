# Chahd Birthday Surprise — Project Documentation

Use this document to plan the website in ChatGPT. It covers architecture, every component, styling, content, deployment, and customization points.

---

## 1. Project Overview

**Name:** Happy Birthday, Chahd (اليوم يومك يا شهد 💜)  
**Purpose:** A magical, interactive birthday surprise website for Chahd, built by her friends. Features an interactive candle-blowing moment, video gallery, handwritten-style messages, background music, and confetti.

**Audience:** Chahd (birthday girl) and her friends/family who visit the link.  
**Languages:** English + Arabic (bilingual, RTL support).

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **TanStack Start** (React Router + SSR) | Full-stack React framework with server functions |
| UI Library | **React 19** | Component framework |
| Styling | **Tailwind CSS v4** | Utility-first CSS |
| Animations | **Framer Motion** | Entrance/exit animations, gestures |
| Icons | **Lucide React** | Iconography |
| Forms | **React Hook Form** + **Zod** | Form validation |
| Build Tool | **Vite 8** | Bundling and dev server |
| SSR/Server | **Nitro** (vercel preset) | Server functions, edge deployment |
| Deployment | **Vercel** | Hosting, zero-config TanStack Start detection |
| Package Manager | **npm** (lockfile: `package-lock.json`) | Dependency management |

**Key config files:**
- `package.json` — dependencies and scripts (`dev`, `build`, `preview`, `lint`, `test`)
- `vite.config.ts` — Vite config using `@lovable.dev/vite-tanstack-config`; includes `nitro: { preset: "vercel" }`
- `vercel.json` — declares `"framework": "tanstack-start"`
- `tsconfig.json` — TypeScript config with strict mode and path alias `@/*` → `./src/*`
- `bunfig.toml` — Bun install config (24h supply-chain guard)

---

## 3. File Structure

```
chahd-birthday/
├── vercel.json                    # Vercel deployment config
├── vite.config.ts                 # Vite + Nitro config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies & scripts
├── bun.lock                       # Lockfile
├── bunfig.toml                    # Bun install config
├── eslint.config.js               # ESLint rules
├── vitest.config.ts               # Vitest config
├── .gitignore                     # Git ignore rules
├── AGENTS.md                      # Lovable project rules
├── README.md                      # Project README
├── PROJECT_DOCUMENTATION.md       # This file
├── public/
│   ├── favicon.ico                # Site favicon
│   └── robots.txt                 # SEO robots
├── src/
│   ├── assets/
│   │   ├── chahd-birthday-scene.png       # Hero background image
│   │   └── chahd-birthday-scene.png.asset.json  # Lovable asset metadata
│   ├── content/
│   │   └── birthday.ts              # ALL editable personal content (messages, video, music)
│   ├── components/
│   │   ├── birthday/                # Birthday-specific components
│   │   │   ├── BirthdayHero.tsx         # Hero section with candle & reveal
│   │   │   ├── BirthdayMessages.tsx     # Messages grid + FinalMessage
│   │   │   ├── BirthdayReveal.tsx       # Candle-blown reveal card
│   │   │   ├── GirlsVideo.tsx           # Video player section
│   │   │   ├── MusicPlayer.tsx          # Floating music player
│   │   │   ├── Confetti.tsx             # Confetti explosion
│   │   │   ├── FloatingParticles.tsx    # Background particles
│   │   │   ├── InteractiveCandle.tsx    # Candle flame overlay
│   │   │   ├── MessageCard.tsx          # Individual message card
│   │   │   └── SectionHeading.tsx       # Bilingual section headings
│   │   └── ui/                        # shadcn/ui component library (accordion, button, card, etc.)
│   ├── hooks/
│   │   └── use-mobile.tsx           # Mobile detection hook
│   ├── lib/
│   │   ├── birthday.ts              # Content (messages, video, music config)
│   │   ├── error-capture.ts         # SSR error capture utility
│   │   ├── error-page.ts            # SSR error page renderer
│   │   ├── lovable-error-reporting.ts # Lovable error telemetry
│   │   └── utils.ts                 # Utility functions (cn, etc.)
│   ├── routes/
│   │   ├── __root.tsx               # Root layout, QueryClient, error boundary
│   │   ├── index.tsx                # Home page route (assembles all sections)
│   │   ├── routeTree.gen.ts         # Auto-generated route tree
│   │   └── README.md
│   ├── router.tsx                   # Router setup
│   ├── server.ts                    # Nitro server entry (Vercel-compatible)
│   ├── start.ts                     # TanStack Start instance with middleware
│   ├── styles.css                   # Global CSS / Tailwind
│   └── test/
│       ├── setup.ts                 # Test setup
│       └── app-routing.test.tsx     # Routing tests
```

---

## 4. Route Architecture

### Single Page Application (SPA) on one route: `/`

**`src/routes/index.tsx`** assembles all sections in order:

```tsx
<main>
  <BirthdayHero />        // Section 1: Hero + candle
  <GirlsVideo />         // Section 2: Video gallery
  <BirthdayMessages />   // Section 3: Messages grid
  <FinalMessage />       // Section 4: Closing message
  <MusicPlayer />        // Section 5: Floating music player (fixed bottom-right)
</main>
```

**`src/routes/__root.tsx`** provides:
- Root HTML shell (`<html>`, `<head>`, `<body>`)
- `QueryClientProvider` (TanStack Query)
- `<HeadContent />` and `<Scripts />` placement
- SEO meta tags (Open Graph, Twitter cards)
- Bilingual font loading (Cairo, Playfair Display, Poppins from Google Fonts)
- 404 and error boundary components
- Lovable error reporting integration

---

## 5. Component Reference

### A. `BirthdayHero.tsx` — The Hero Section
**File:** `src/components/birthday/BirthdayHero.tsx`

**Purpose:** Opening section with background image, interactive candle, and reveal animation.

**Key features:**
- Displays `chahd-birthday-scene.png` (hero image, 1672×941 aspect ratio)
- Fixed-aspect box using `container-type: size` so the candle overlay stays aligned via `cqw` (container query width) units
- **Interactive candle:** Users click "Blow the candle" or use microphone (voice detection via Web Audio API) to blow it out
- When blown: candle flame disappears, smoke appears, golden burst, confetti explodes, image brightens
- **Reveal:** After blowing out, `BirthdayReveal` component appears with "Happy Birthday, Chahd!" and a "Discover your surprise" button that scrolls to the video section
- Microphone states: `off` / `listening` / `denied`
- Arabic heading: "اليوم يومك يا شهد 💜" (Today is your day, Chahd)

**Props:** None (self-contained state).

**Editable content:** None directly — uses `sceneUrl` import from asset file.

---

### B. `BirthdayReveal.tsx` — Post-Candle Reveal Card
**File:** `src/components/birthday/BirthdayReveal.tsx`

**Purpose:** Shown immediately after the candle is blown out.

**Content:**
- "Happy Birthday, Chahd! 💜" / "كل عام وأنتِ بخير يا شهد."
- Wishing text
- Button: "Discover your surprise" → scrolls to `#video` section

**Props:** None.

---

### C. `GirlsVideo.tsx` — Video Gallery Section
**File:** `src/components/birthday/GirlsVideo.tsx`

**Purpose:** Displays a birthday video or a placeholder if none is configured.

**Key features:**
- HTML5 `<video>` with play/pause, mute, volume slider, fullscreen
- Click-to-play overlay button
- Controls: play/pause, mute/unmute, volume range, fullscreen
- **Placeholder state:** When `videoSrc` is empty, shows "Our video is on its way…" with a heart icon
- Section heading: "Memories Made with Love" / "لحظات جمعتنا، وذكريات لن ننساها"

**Config source:** `videoSrc` and `videoPoster` from `src/content/birthday.ts`

**Props:** None.

---

### D. `BirthdayMessages.tsx` — Messages Section
**File:** `src/components/birthday/BirthdayMessages.tsx`

**Purpose:** Grid of message cards from Chahd's friends + closing "Final Message."

**Key features:**
- Renders `MessageCard` for each message in the `messages` array
- Expandable cards (tap to read full message, line-clamp-3 when collapsed)
- Responsive grid: 1 col mobile, 2 col sm, 3 col lg
- Floating petal particles background
- Closing section: "With all our love, your girls. 💜" + Arabic

**Exports:**
- `BirthdayMessages` — the messages grid section
- `FinalMessage` — standalone closing section (used separately in index route)

**Config source:** `messages` array from `src/content/birthday.ts`

---

### E. `MessageCard.tsx` — Individual Message Card
**File:** `src/components/birthday/MessageCard.tsx`

**Purpose:** Displays one friend's message with expand/collapse.

**Key features:**
- Emoji avatar circle
- Sender name
- Message text (auto-detects Arabic via regex `/[\u0600-\u06FF]/` for RTL direction)
- Line-clamp-3 when collapsed, full text when expanded
- Open/close toggle buttons
- Glassmorphism styling when open

**Props:**
- `item: GirlMessage` — `{ name, message, emoji? }`
- `open: boolean` — expanded state
- `onToggle: () => void` — toggle handler
- `index: number` — for staggered animation delay

---

### F. `FinalMessage.tsx` — Closing Section
**File:** `src/components/birthday/BirthdayMessages.tsx` (exported from same file)

**Purpose:** Final full-screen-style message after the messages grid.

**Content:** Bilingual "To our beautiful Chahd" / "إلى شهد الجميلة" with love message.

**Props:** None.

---

### G. `MusicPlayer.tsx` — Background Music
**File:** `src/components/birthday/MusicPlayer.tsx`

**Purpose:** Floating music control button (bottom-right corner).

**Key features:**
- Play/pause toggle
- Volume slider (appears on hover/open)
- **Two modes:**
  1. If `musicSrc` is set: plays an MP3 file (looped)
  2. If `musicSrc` is empty: synthesizes a gentle music-box melody using Web Audio API oscillators
- Auto-cleans up on unmount

**Config source:** `musicSrc` from `src/content/birthday.ts`

**Props:** None.

---

### H. `SectionHeading.tsx` — Bilingual Section Header
**File:** `src/components/birthday/SectionHeading.tsx`

**Purpose:** Reusable bilingual heading for each section.

**Props:**
- `en: string` — English heading
- `ar: string` — Arabic heading (RTL)
- `sub: string` — English subtitle
- `subAr?: string` — Arabic subtitle (optional)

**Animation:** Framer Motion entrance on viewport entry.

---

### I. `Confetti.tsx` — Confetti Explosion
**File:** `src/components/birthday/Confetti.tsx`

**Purpose:** 60-piece confetti explosion triggered when candle is blown.

**Features:**
- Random colors (royal, lavender, lilac, candle, violet)
- Random positions, delays, durations, rotations
- Respects `prefers-reduced-motion`

---

### J. `FloatingParticles.tsx` — Background Particles
**File:** `src/components/birthday/FloatingParticles.tsx`

**Purpose:** Ambient floating decoration particles.

**Variants:**
- `sparkle` — small glowing dots
- `petal` — lavender petal shapes
- `butterfly` — 🦋 emoji with wing-flap animation

**Props:**
- `count?: number` — number of particles
- `variant?: "sparkle" | "petal" | "butterfly"`
- `className?: string`

---

### K. `InteractiveCandle.tsx` — Candle Flame Overlay
**File:** `src/components/birthday/InteractiveCandle.tsx`

**Purpose:** Animated candle flame drawn in `cqw` units over the hero image's painted candle.

**States:**
- `lit: true` — flickering flame with ambient glow
- `lit: false` — smoke rising + golden burst particles

**Positioning:** Uses `left: 50%, top: 22.6%` with `cqw` (container query width) units so it stays on the painted candle regardless of screen size.

---

## 6. Content Configuration (`src/content/birthday.ts`)

This is the **single file to edit** for all personal content. Do not touch components to change text/media.

```typescript
export const videoSrc = "";        // MP4 path/URL or "" for placeholder
export const videoPoster = "";     // Poster image URL
export const musicSrc = "";        // MP3 path/URL or "" for synthesized melody

export type GirlMessage = { name: string; message: string; emoji?: string };

export const messages: GirlMessage[] = [
  { name: "Friend One", emoji: "🌸", message: "..." },
  // ... add more
];
```

**Customization:**
- Add video: put `.mp4` in `/public/videos/` and set `videoSrc = "/videos/girls.mp4"`
- Add music: put `.mp3` in `/public/audio/` and set `musicSrc = "/audio/birthday.mp3"`
- Add messages: push objects to the `messages` array
- Arabic text auto-detects and applies RTL

---

## 7. Styling & Design System

**Tailwind CSS v4** with custom design tokens:

| Token | Usage |
|-------|-------|
| `bg-primary` / `text-primary-foreground` | Primary brand color (royal gradient) |
| `bg-background` / `text-foreground` | Surface and main text |
| `bg-card` / `text-card-foreground` | Card surfaces |
| `text-lilac`, `text-lavender`, `text-violet`, `text-royal`, `text-candle` | Accent colors |
| `bg-royal-gradient` | Gradient background for buttons |
| `shadow-glow` | Glow shadow utility |
| `glass` | Glassmorphism backdrop-blur utility |
| `font-display` | Display font (Playfair Display) |
| `font-body` | Body font (Cairo / Poppins) |

**Responsive breakpoints:** Tailwind defaults (sm, md, lg).  
**RTL support:** Arabic text uses `dir="rtl"` and `lang="ar"` attributes.

---

## 8. Deployment (Vercel)

**Repository:** `https://github.com/bhsnyounes13/chahd-birthday-`  
**Branch:** `main`

**Vercel setup:**
1. Go to `vercel.com/new`
2. Import the GitHub repository
3. Vercel auto-detects **TanStack Start** + **Nitro**
4. Deploy — no build command or output directory overrides needed
5. Every push to `main` triggers automatic deployment

**Vercel config files:**
- `vercel.json` — `{"$schema": "...", "framework": "tanstack-start"}`
- `vite.config.ts` — `nitro: { preset: "vercel" }`
- `src/server.ts` — Nitro-compatible server entry (exports `default { fetch }`)

**Environment variables:** Add in Vercel Dashboard > Settings > Environment Variables. Prefix with `VITE_` for client-side access.

---

## 9. Current Limitations

| Area | Limitation |
|------|-----------|
| Messages | Hardcoded in `birthday.ts`; no user submissions yet |
| Video | Placeholder only; no video file configured |
| Music | Synthesized melody only; no MP3 configured |
| Database | No backend/database connected |
| Authentication | None (public site) |
| Analytics | None configured |
| Multi-page | Single route (`/`); no additional pages |

---

## 10. Planned Enhancement: User-Submitted Messages (Guestbook)

**Goal:** Replace static messages with a guestbook where visitors submit their own name + message.

**Components to build/modify:**
1. **`MessageForm`** (new) — name input + message textarea + submit button
2. **`BirthdayMessages.tsx`** — fetch + display submitted messages instead of static array
3. **Server function** — TanStack Start server function to insert submissions
4. **Database table** — `guestbook_messages` (id, name, message, created_at, is_published)

**Database setup** (via Lovable — per AGENTS.md, cannot edit migrations directly):
- Ask Lovable to create `guestbook_messages` table via Supabase integration

**Flow:**
1. Visitor fills name + message → clicks submit
2. Server function saves to database
3. Page refetches and displays new message

**Open decisions needed:**
- Publish immediately or require admin approval?
- Supabase connected?
- CAPTCHA or rate limiting?
- Name required or optional?

---

## 11. How to Use This in ChatGPT

Copy and paste this documentation into ChatGPT with a prompt like:

> "I have a TanStack Start birthday website with this architecture [paste documentation]. I want to add a guestbook feature where visitors can submit their name and message. Help me plan the database schema, server functions, and React components needed."

Or ask specific questions like:
- "How do I connect Supabase to this TanStack Start project?"
- "Write a server function to insert guestbook messages"
- "How do I modify BirthdayMessages.tsx to fetch from an API instead of static content?"

---

## 12. Quick Customization Checklist

- [ ] Edit `src/content/birthday.ts` — update messages, add video/music URLs
- [ ] Replace `src/assets/chahd-birthday-scene.png` — new hero image (keep 16:9 aspect)
- [ ] Update `__root.tsx` — change title, description, Open Graph tags
- [ ] Add database table via Lovable — for guestbook feature
- [ ] Deploy to Vercel — push to `main` branch on GitHub

---

**Repository:** `https://github.com/bhsnyounes13/chahd-birthday-`  
**Last updated:** Nov 15, 2026
