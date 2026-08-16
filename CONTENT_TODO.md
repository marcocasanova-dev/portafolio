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
- **Next availability** (`PROFILE.bookingFrom`) — currently `null`, so the
  hero, `/services`, and `/how-i-work` all correctly show "Availability on
  request" rather than a guessed date. Set it to a real month when you know
  one.
- **Engagement floor** (`PROFILE.engagementFloor`) — currently `null`, so no
  minimum-project-size figure is shown anywhere, per the brief's instruction
  not to publish an unapproved number. The Technical Review price line
  likewise reads "Fixed scope after an initial fit call" rather than a
  guessed "From €3,500."
- **hello@marcocasanova.de** — the brief suggested this address, but only the
  existing `m.casanova.dev@gmail.com` (confirmed working) is used anywhere on
  the site. Set up the alias and update `SITE.email` in `src/config.ts` if you
  want the branded address live instead.
- **Custom Open Graph image** — the site still uses the existing
  `/images/imac_desktop.jpg` for social sharing. A purpose-built card (name +
  positioning statement on the site's accent colour) would read better on
  LinkedIn/Twitter than a desk photo, but wasn't fabricated here since it
  needs a design pass, not invented content.
- **Professional capability-statement PDF** — not created. The repo's own
  README already documents that CV links stay hidden until a real PDF exists
  at the `PROFILE.cv` paths (currently Markdown files, intentionally excluded
  from the homepage hero per the brief).
- **Testimonials / references** — none exist in the repo, so none were added
  anywhere, including the homepage FAQ/CTA copy. Add them (with permission)
  to `src/data/` and a new homepage section once genuine quotes exist.
- **`kin-relay.md` / `raumhub.md` / `stratos-one.md`** — these were already
  present in the working tree (uncommitted) before this pass, fully written
  and `draft: false`. They were left untouched aside from `stratos-one`'s and
  the two-project `featured` flags (see below); they are **not** part of the
  7 historical drafts above and don't need re-verification here.
- **`nightowl.md` / `stratos-one.md` `featured` flag** — flipped to `false`
  in all three locales so the homepage's three featured case studies are
  exactly mobile commerce, IoT telemetry, and clinical data, per the brief.
  Both projects still appear in the "Additional projects" section of `/work`.
