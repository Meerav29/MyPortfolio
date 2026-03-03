# CLAUDE.md — Meera's Portfolio

Personal portfolio site built with Next.js 14 (App Router), deployed on Vercel. Showcases projects, research, career timeline, and a blog called "Sidequests."

---

## Development Commands

```bash
npm run dev      # local dev server → localhost:3000
npm run build    # production build (use this to verify changes)
npm run start    # serve production build locally
npm run lint     # ESLint via next lint
```

No test suite exists. Verify changes with `npm run build` and manual review in the dev server.

---

## Tech Stack

- **Framework:** Next.js 14.2.5 · React 18 · TypeScript 5.5
- **Styling:** Tailwind CSS 3.4 (dark mode via `.dark` class) · @tailwindcss/typography
- **3D:** Three.js + @react-three/fiber + @react-three/drei
- **Animation:** framer-motion
- **Icons:** lucide-react
- **Blog/MDX:** next-mdx-remote v6 · gray-matter · remark-gfm · rehype-slug · rehype-autolink-headings
- **Validation:** zod (frontmatter schema) · reading-time (auto-computed)
- **Analytics:** Vercel Analytics + Speed Insights (in `app/layout.tsx` — do not remove)

---

## Project Structure

```
app/                  # Next.js App Router routes
  page.tsx            # Home (hero + projects + contact)
  layout.tsx          # Root layout, metadata, ThemeProvider — ask before editing
  career-timeline/    # Career timeline page
  experience/         # Work experience page
  research/           # Research projects page
  sidequests/         # Blog listing + individual post pages
  pitch/              # Elevator pitch page
  robots.ts           # robots.txt generation
  sitemap.ts          # sitemap generation
  sidequests.xml/     # RSS feed route handler

components/           # Reusable UI
  Header.tsx          # Site nav
  Hero.tsx            # Home hero — mobile-optimized, be careful here
  PlanetCanvas.tsx    # Three.js 3D planet — mobile-optimized, be careful here
  CareerTimeline.tsx
  ResearchCard.tsx
  ThemeProvider.tsx   # Dark/light mode context
  sidequests/         # Blog-specific: SidequestCard, PostHeader, Prose,
                      #   Filters, Pagination, TagPill, EmptyState
  ui/
    Button.tsx

content/
  sidequests/         # MDX blog posts (YYYY-MM-DD-slug.mdx filenames)

data/
  research.ts         # Research project definitions

lib/
  sidequests.ts       # getAllSidequests(), getSidequestBySlug(), paginate(), etc.
  mdx.ts              # MDX compilation pipeline (mdxToContent())
  projects.ts         # Featured projects data (edit here to add/change projects)
  rss.ts              # RSS feed generation
  links.ts            # Nav and social links
  utils.ts            # General helpers
  theme.ts            # Theme utilities

public/
  images/sidequests/  # Sidequest post thumbnails
  resume.pdf
  favicon.svg
```

---

## Architecture Decisions

- **Server Components by default.** Add `"use client"` only when necessary: event handlers, hooks, browser APIs, Three.js canvas.
- **App Router only** — no `pages/` directory.
- **Path alias:** `@/` resolves to the project root (e.g., `import { ... } from "@/lib/sidequests"`).
- **Mobile performance is a priority.** `PlanetCanvas` and `Hero` have deliberate mobile optimizations (reduced geometry, disabled on very small screens). Don't break these when touching those files.
- **No environment variables** required to run. `.env` is gitignored for future use.

---

## Styling Conventions

- Tailwind utility classes throughout.
- Dark mode via `.dark` CSS class — `ThemeProvider` handles the toggle.
- **Custom CSS variables** in `tailwind.config.ts`: `--background`, `--foreground`, `--muted`, `--card`, `--accent`, `--border`, `--link-hover`.
- MDX prose styling uses `@tailwindcss/typography` via `components/sidequests/Prose.tsx`.

---

## Content System (Sidequests Blog)

MDX files in `content/sidequests/` with date-prefixed filenames: `YYYY-MM-DD-slug.mdx`.

**Required frontmatter:**
```yaml
---
title: "Post Title"
publishedAt: "2025-01-01"
excerpt: "Short teaser shown on listing page."
tags: ["Tag A", "Tag B"]
status: "published"        # "draft" hides from listing; "archived" also hides
---
```

**Optional:**
- `slug` — derived from filename if omitted
- `thumbnail` — path under `public/` (e.g., `/images/sidequests/example.png`)
- `updatedAt` — shown if different from `publishedAt`

**Rules:**
- `readingTime` is computed automatically.
- Tags are normalized to Title Case.
- Thumbnails belong in `public/images/sidequests/`.
- RSS feed at `/sidequests.xml`.
- URL: `/sidequests/<slug>`.
- Tag filtering: `?tag=Foo&tag=Bar`. Search: `?q=term`.

**Custom MDX components** (defined in `lib/mdx.ts`): `Button`, `Github`, `Satellite`, `Map` icons.

---

## Deployment

- Auto-deployed to **Vercel** from `main` branch.
- `app/layout.tsx` contains Vercel Analytics and Speed Insights — do not remove these.
- Sitemap and robots.txt are generated automatically from `app/sitemap.ts` and `app/robots.ts`.

---

## Claude Behavioral Rules

- **Never commit without being explicitly asked.** Always describe staged changes and wait for the user to request a commit.
- **Never force-push or use `--no-verify`** unless explicitly asked.
- **Prefer editing existing files** over creating new ones. Check `lib/`, `components/`, and `data/` for reusable utilities before writing new code.
- **Only touch files relevant to the task** — no opportunistic refactoring or formatting sweeps.
- **Ask before editing** `app/layout.tsx`, Vercel config, or anything deployment-related.
- **Branches:** active work happens on `ui-changes`; `main` is the branch for PRs and production.
- **No test suite** — use `npm run build` and the dev server to verify changes.
