# Portfolio — Marco Casanova

Static, trilingual (EN/DE/ES) freelance-engineering site built with **Astro + TypeScript**, styled with **Tailwind CSS v4**, with services, projects, and articles authored in **Markdown**/structured content, deployed automatically to **GitHub Pages** via **GitHub Actions**.

Positioning: independent senior software engineer for data-heavy web, mobile, and backend products — see `CONTENT_TODO.md` for open content items, especially the seven draft historical projects awaiting verified facts before publication.

No client-side framework ships to the browser. No web fonts are downloaded. Every page is pre-rendered HTML.

---

## Run it locally

Requires **Node 20+** (`.nvmrc` pins 20).

```bash
npm install
npm run dev
```

Open **<http://localhost:4321>** — it redirects to `/en` (or `/es` if your browser is set to Spanish).

### All commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload at `localhost:4321` |
| `npm run build` | Type-check, then build the static site to `dist/` |
| `npm run preview` | Serve the built `dist/` — use this to verify before deploying |
| `npm run check` | Type-check only (Astro + TypeScript + content schemas) |
| `npm run sync` | Regenerate content collection types after schema edits |

> `npm run build` runs `astro check` first, so a type error or invalid Markdown frontmatter fails the build instead of shipping broken.

---

## Project structure

```
src/
├── config.ts               # Name, email, social links, domain — edit this first
├── content.config.ts       # Zod schemas validating all Markdown frontmatter
├── content/
│   ├── projects/{en,es,de}/ # Case studies (Markdown)
│   └── blog/{en,es,de}/     # Articles (Markdown)
├── i18n/
│   ├── ui.ts               # Every UI string, EN + ES
│   └── utils.ts            # Locale detection, path helpers, date formatting
├── components/             # Header, Footer, cards, Hero, SEO, ...
├── layouts/BaseLayout.astro
├── lib/content.ts          # Typed content queries
├── pages/
│   ├── index.astro         # Root — detects language, redirects
│   ├── [lang]/             # All localized routes
│   ├── rss-[lang].xml.ts   # Per-locale RSS feeds
│   └── robots.txt.ts
└── styles/global.css       # Design tokens + Tailwind theme

public/                     # Images, logos, screenshots, CNAME, favicon
```

Routes are generated per locale from `src/pages/[lang]/`, so adding a language means adding an entry to `src/i18n/ui.ts` and a content folder — no new page files.

---

## Adding content

### A new project

Create `src/content/projects/en/my-project.md` (and `es/` for the Spanish version — same filename):

```markdown
---
title: My Project
description: One line shown on the card and in search results.
order: 1              # lower sorts first
featured: true        # surfaces it on the homepage
year: 2026
role: Lead Engineer
client: Acme
technologies: [TypeScript, PostgreSQL]
sectors: [Fintech]
logo: /logos/acme.webp
images: [acme-1.png, acme-2.png]   # files in public/portafolio/
highlights:
  - value: '40ms'
    label: p95 latency
github: https://github.com/you/repo
liveDemo: null
video: null
draft: false
---

## The problem

Markdown body goes here.
```

The schema in [src/content.config.ts](src/content.config.ts) validates every field — a typo fails the build with a precise message rather than rendering blank.

### A new article

Create `src/content/blog/en/my-post.md`:

```markdown
---
title: My Post
description: Shown on the card, in meta tags, and in the RSS feed.
pubDate: 2026-07-18
readTime: 6
image: /images/my-post.jpg
tags: [Performance]
draft: false
---
```

Set `draft: true` to keep something visible in `npm run dev` but excluded from the production build.

---

## Before you deploy — edit these

1. **[src/config.ts](src/config.ts)** — domain, email, GitHub, LinkedIn, Calendly, career start year.
2. **[astro.config.mjs](astro.config.mjs)** — the `site` field must match your domain (it drives canonical URLs, the sitemap, and RSS).
3. **[public/CNAME](public/CNAME)** — your custom domain, one line, no protocol.
4. **Project metrics** — the `highlights` values in each case study are placeholders. Each project file carries a `NOTE:` comment where they need replacing with your real figures.
5. **Links** — some `github` / `liveDemo` fields from the old data were placeholders and are set to `null`. Fill in the real ones.

---

## Deploying to GitHub Pages

The workflow in [.github/workflows/deploy.yml](.github/workflows/deploy.yml) builds and deploys on every push to `main`.

One-time setup:

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. **Settings → Pages → Custom domain** — enter your domain and save.
4. At your DNS provider, point the domain at GitHub:
   - Apex (`example.com`) — four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Subdomain (`www`) — one `CNAME` record to `<username>.github.io`
5. Wait for DNS to propagate, then tick **Enforce HTTPS**.

Push to `main` and the site deploys. [.github/workflows/ci.yml](.github/workflows/ci.yml) runs the same build on pull requests so a broken change never reaches `main`.

---

## SEO

Included out of the box: per-page canonical URLs, `hreflang` alternates linking the EN and ES versions of every route, Open Graph and Twitter Card tags, JSON-LD (`Person` sitewide, `BlogPosting` on articles), an auto-generated sitemap with locale annotations, `robots.txt`, and per-locale RSS feeds at `/rss-en.xml` and `/rss-es.xml`.

---

## Notes

- **Dark mode** is class-based and remembers your choice; it defaults to your OS preference. The theme is applied by an inline script before first paint, so there is no flash.
- **The 91 MB `.mov`** from the original repo was deliberately left out — it is too large for a Git repo and would slow the site badly. Host demo video on YouTube or Vimeo and put the URL in the project's `video` field.
- **Images** are served from `public/` as-is. If you want Astro to optimize and generate responsive variants, move them into `src/assets/` and use the `<Image />` component from `astro:assets`.
