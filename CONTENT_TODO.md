# Content TODO

Facts only Marco can supply, tracked in one place. Nothing below was invented —
where a detail was unknown, the site either omits it or renders a visible
`draft: true` entry / amber TODO chip instead of guessing.

## How to publish a draft project

1. Confirm every fact in that project's section below.
2. Edit the three locale files (`src/content/projects/{en,es,de}/<slug>.md`):
   - Replace `role`, `year`, and `technologies` with real values.
   - Add `client` only if you're free to name them; otherwise keep it unset
     and use an honest generic descriptor in `description` (e.g. "European
     hospitality platform") — see `src/config.ts`'s `TODO()` pattern for the
     philosophy this repo follows.
   - Replace `logo: /favicon.svg` with a real logo **only if you have
     permission** to use that mark. If not, leave the Monogram-initials
     fallback (remove the `logo` override isn't possible — the field is
     required by the schema — but no component currently reads `data.logo`
     for rendering, so `/favicon.svg` is safe to leave as a harmless
     placeholder even post-publish if permission is never granted).
   - Add real screenshots to `public/portafolio/` and list them in `images`.
   - Write the full case-study body: Situation → Business problem →
     Constraints → Role → What I personally delivered → Technical decisions →
     Verified outcome → Duration → confidentiality note if relevant. Follow
     the structure already used in `mobile-commerce-platform.md`,
     `iot-data-platform.md`, and `clinical-data-analyzer.md` as the template.
   - Only add `outcome`, `tradeoff`, `engagement`, `decisionQuote`, or
     `highlights` once you have a verified, specific claim for each — leave
     the field out entirely otherwise.
3. Set `draft: false`.
4. Decide `featured` — homepage only ever shows mobile commerce, IoT
   telemetry, and clinical data (see "Homepage case studies" below); leave
   `featured: false` for everything else so it lives in the "Additional
   projects" section of `/work` instead.
5. Run `npm run build` — `scripts/check-todos.mjs` will flag anything the
   schema still considers incomplete.

Until all of this happens, these 7 entries stay `draft: true` and are
excluded from the production build, the sitemap, search results, and
structured data (verified — see "Verification results" in the delivery
summary).

---

## 1. Aladin Hotel (`src/content/projects/*/aladin-hotel.md`)

- [ ] Correct spelling: **Aladin** or **Aladdin**?
- [ ] Official product / client name, and whether it can be named publicly.
- [ ] What the product actually did (booking engine? PMS? guest app?).
- [ ] Marco's role and personal contribution vs. any team.
- [ ] Year(s) and duration of the engagement.
- [ ] Technologies actually used.
- [ ] Any verifiable outcome (only if you can stand behind a specific number).
- [ ] Screenshots/logo, and permission to use them if the brand is named.

## 2. QR Promotion Scanner (`qr-promotion-scanner.md`)

- [ ] Official product name (working title only right now).
- [ ] Client name and whether it can be named publicly.
- [ ] What was scanned/redeemed and in what context (retail? events?).
- [ ] Marco's role, technologies, year, duration.
- [ ] Any verifiable outcome.
- [ ] Screenshots/logo and permissions.

## 3. A Pensar — Unity game (`a-pensar.md`)

- [ ] Confirm this is the correct/full title.
- [ ] Genre, platform(s), and release status (shipped? prototype?).
- [ ] Solo or team project — and if team, what Marco specifically owned.
- [ ] Technologies (Unity version, language, notable systems).
- [ ] Year and duration.
- [ ] Screenshots and, if applicable, a store/demo link.

## 4. Willow (`willow.md`)

- [ ] Should this be described as a **private** or a **confidential** social
      network — and what's the practical difference for what can be shown?
- [ ] Client/company name and whether it can be named publicly.
- [ ] What the product did and Marco's role.
- [ ] Technologies, year, duration.
- [ ] Any verifiable outcome.
- [ ] Screenshots/logo and permissions.

## 5. TrackFile / WRO oil company (`trackfile-wro.md`)

- [ ] Exact project name (working title "TrackFile" is a guess from the brief).
- [ ] Exact company name behind "WRO," and whether it can be named publicly.
      If not, keep the generic framing ("an oil-industry client").
- [ ] What was tracked and why (assets, documents, compliance, logistics?).
- [ ] Marco's role, technologies, year, duration.
- [ ] Any verifiable outcome.
- [ ] Screenshots/logo and permissions.

## 6. Wintrdo (`wintrdo.md`)

- [ ] Confirm the correct spelling — "Wintrdo" is transcribed as given, unverified.
- [ ] What the project was for and who the client was.
- [ ] Marco's role, technologies, year, duration.
- [ ] Whether this project is even worth publishing, or should stay internal.
- [ ] Screenshots/logo and permissions, if published.

## 7. Univision / Doctor Juan (`univision-doctor-juan.md`)

- [ ] Exact product name.
- [ ] Whether the **Univision** name can be used publicly. If not, use an
      honest generic descriptor instead — e.g. "US Spanish-language media
      platform" — exactly as instructed for cases like this.
- [ ] What "Doctor Juan" refers to (a show, a segment, a personal brand?) and
      whether that name can be used publicly either.
- [ ] Marco's role, technologies, year, duration.
- [ ] Any verifiable outcome.
- [ ] Screenshots/logo and permissions.

---

## Other outstanding items (not project-specific)

These already render as visible amber TODO chips on the site (via
`src/config.ts`'s `TODO()` marker) or are called out here because they don't
have a UI-visible placeholder yet.

- **Impressum address** (`PROFILE.legal.fullAddress` in `src/config.ts`) —
  full street address required for a compliant German Impressum. The
  `/legal/impressum` and `/legal/datenschutz` pages are marked `noindex` and
  carry a visible "draft, pending legal review" banner until this — and a
  lawyer's sign-off on the boilerplate liability/dispute-resolution text — are
  in place.
- **VAT ID** (`PROFILE.legal.vatId`) — set only if you have a `USt-IdNr.`;
  confirm with a tax advisor whether one applies to your setup.
- **LinkedIn URL** (`SITE.linkedin` in `src/config.ts`) — currently `null`, so
  every LinkedIn link on the site is hidden. Add the real profile URL once
  you've confirmed it's the one you want public-facing.
- **Next availability** (`PROFILE.bookingFrom`) — RESOLVED 2026-09-01: now a
  per-locale object (`{ en, es, de }`), not a single string, because a bare
  English month rendered unchanged on the /es and /de routes. Set to
  `'Late September 2026'` / `'Finales de septiembre de 2026'` /
  `'Ende September 2026'`. Every page that shows availability (hero,
  /services, /contact, the CV PDF) reads it from here.
  **Review this monthly** — it is the fastest fact on the site to go stale,
  and a bare month ("September 2026") reads as "available now" to anyone
  visiting mid-month, which is why it carries a qualifier. Re-run
  `scripts/generate-cv-pdf.mjs` after changing it, since the CV PDFs bake
  the value in.
- **Engagement floor** (`PROFILE.engagementFloor`) — still `null`; no
  minimum-project-size figure is shown, per the brief's instruction not to
  publish an unapproved number. Separately, `PROFILE.reviewStartingPrice` IS
  now set (`'€1,900'`, RESOLVED 2026-08-26) — that is the technical-review
  soft-price qualifier shown on the homepage/hero, a different field from the
  engagement floor.
- **Contact email** — RESOLVED 2026-08-26: `SITE.email` is now
  `marco.casanova.de@outlook.com` (confirmed source of truth), replacing the
  old `m.casanova.dev@gmail.com` everywhere (mailto links, JSON-LD, RSS
  author, the CV PDF). `hello@marcocasanova.de` remains unused; do not switch
  to it without an explicit future confirmation.
- **Custom Open Graph image** — RESOLVED 2026-08-26: `public/images/og-image.png`
  (1200×630, generated from `src/pages/og-image.astro` via
  `scripts/generate-og-image.mjs`) replaced the old `imac_desktop.jpg` as
  `SITE.ogImage`. Regenerate it (documented Playwright-temp-install workflow
  in the script's header comment) any time `SITE.name`/`SITE.role.en`/`SITE.url`
  changes.
- **Professional capability-statement PDF** — RESOLVED 2026-08-26: a one-page,
  print-optimized PDF now exists per locale at the `PROFILE.cv` paths
  (`public/cv/Marco-Casanova-Senior-Software-Engineer{,-de,-es}.pdf`),
  generated from `src/pages/[lang]/cv-print.astro` via
  `scripts/generate-cv-pdf.mjs`. Every fact on it is pulled live from
  PROFILE/SITE/featured case studies, so re-run the script after changing any
  of those rather than hand-editing the PDF. The old Markdown CV download was
  already removed in an earlier pass and stays removed.
- **Testimonials / references** — still none in the repo; `src/data/testimonials.ts`
  stays an empty, typed array (a `permissionConfirmed: true` field makes it
  impossible to add one without express, on-the-record approval). Add them
  (with permission) once genuine quotes exist — `Testimonials.astro` and the
  homepage already render nothing when the array is empty, so no page
  restructuring is needed later.
- **RaumHub** — RESOLVED 2026-08-26 (reversing the 2026-08-17 decision below):
  the newer master brief explicitly requires RaumHub to stay unpublished. All
  three locale files are now `draft: true`; it no longer appears in the work
  grid, sitemap, or anywhere else in the built site (verified — see the
  content-safety script's RaumHub checks). Source content is preserved on
  disk, just not built. Do not flip it back to `draft: false` without an
  explicit new instruction, since the 2026-08-17 "no IP/publication risk
  found" review below is superseded, not disproven.
- **`kin-relay.md` / `raumhub.md` / `stratos-one.md`** — these were already
  present in the working tree (uncommitted) before this pass, fully written
  and `draft: false`. They were left untouched aside from `stratos-one`'s and
  the two-project `featured` flags (see below); they are **not** part of the
  7 historical drafts above and don't need re-verification here.
- **`nightowl.md` / `stratos-one.md` `featured` flag** — flipped to `false`
  in all three locales so the homepage's three featured case studies are
  exactly mobile commerce, IoT telemetry, and clinical data, per the brief.
  Both projects still appear in the "Additional projects" section of `/work`.
