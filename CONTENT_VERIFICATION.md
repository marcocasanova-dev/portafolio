## 2026-08-26 update — newer master brief supersedes several 08-17/08-18 items

Marco supplied a newer, more specific master brief on 2026-08-26 that resolves
several items the 08-17/08-18 pass had left conservative, and reverses one
decision. Applied in full; details below, organized to match the sections
further down this file that they supersede.

- **Kewazo/Industrial IoT stack (supersedes §2a)** — MQTT was **not**
  independently confirmed after all; it has been removed from
  `iot-data-platform.md` (all 3 locales), from the `technologies` list, the
  `engagement.scope` line, and the body prose. **WebSockets, D3.js, and
  WebGL** are now confirmed and were added back. Role changed from "Senior
  Software Developer" to **"Frontend Developer"** (Marco's actual title on
  that engagement) — `engagement.relationship: employee` is unchanged. The
  "What I worked on" section was rewritten to lead with the frontend framing
  (Svelte + D3.js/WebGL visualizations, WebSocket-based real-time updates)
  and describe the Python/FastAPI/TimescaleDB work as a contribution rather
  than primary ownership. `scripts/validate-content-safety.mjs` now bans
  "MQTT" for this case study as a regression guard (previously it was the
  opposite — MQTT was the confirmed technology and WebSockets/D3.js were
  banned; that banned-list entry was removed).
- **Clinical Imaging stack (supersedes §2c)** — **React, Python, FastAPI,
  PostgreSQL, row-level access control, audit-ready reporting, AWS, and
  Docker are now confirmed** in addition to the already-published DICOM,
  OpenSearch, and Ansible. Added to `clinical-data-analyzer.md` (all 3
  locales): the `technologies` array, `engagement.scope`, the "What I worked
  on" section (now describes building product functionality with
  React/FastAPI/PostgreSQL and implementing row-level access control), and
  the outcome line (now mentions searchability and audit-ready reporting
  rather than the vaguer "easier to process, locate, and operate"). Still
  absent, per the brief's explicit prohibited list: Celery, PHI-specific
  logging language, immutable-audit-record claims, a "reproducible
  pipelines" architecture claim, any precise time-reduction figure, and any
  claim that Marco personally designed the full system architecture — the
  "note on scope" paragraph was reworded slightly ("not the full system
  architecture" instead of "not architecture details") to stay clearly on
  the safe side of that last one. `scripts/validate-content-safety.mjs`'s
  banned-word list for this case study had 'FastAPI', 'PostgreSQL', and
  'row-level access' **removed** (they're now required facts, not banned
  ones) and gained positive "must contain" assertions for all ten confirmed
  facts instead.
- **RaumHub (reverses §3's 2026-08-17 "no publication risk found" review)** —
  the newer brief is explicit and unconditional: RaumHub must not be public.
  All three `raumhub.md` locale files are now `draft: true`. Verified absent
  from the work grid, sitemap, RSS, JSON-LD, and internal links (see
  `scripts/validate-content-safety.mjs`, section 5, and a full `npm run
  build` + link check). The Stratos One case study's prose mentions of the
  app name "RaumHub" (describing it as one of several apps in Marco's own
  independent monorepo) were deliberately left as plain text — they are not
  links to the old `/work/raumhub` route and don't describe RaumHub as a
  client or public case study, so they don't conflict with the new
  instruction. No dedicated redirect route was added for the old URL; it now
  falls through to the site's existing `404.astro` (GitHub Pages has no
  server-side redirect capability, and the site was never confirmed to be
  live/indexed yet — see the still-open Impressum-address blocker below — so
  there is no known indexed URL to protect with a soft-redirect stub). If
  the domain goes live and Search Console later shows `/work/raumhub` was
  indexed, add a client-side redirect page at that path pointing to `/work`,
  matching the pattern already used for the `/` locale gateway.
- **Contact email (supersedes §5's "left unchanged" note)** — `SITE.email` in
  `src/config.ts` changed from `m.casanova.dev@gmail.com` to
  **`marco.casanova.de@outlook.com`**, the exact address given as confirmed
  source of truth. This is a single central change; it propagates to every
  mailto: link, the Person/ProfessionalService JSON-LD, the RSS `<author>`
  field, and the CV PDF (regenerated — see below). Verified: zero remaining
  occurrences of the old address in the built site, and every rendered
  `mailto:` resolves to exactly the new address (see
  `scripts/validate-content-safety.mjs`, section 6).
- **CV PDFs and OG image regenerated** — both were already implemented (a
  prior pass built the Playwright-based generation pipeline), but the CV PDFs
  on disk still baked in the old Gmail address from before this email change,
  so all three locale PDFs and the OG image were regenerated against the
  corrected `SITE.email`/`src/config.ts`. Verified: 1 page each, real
  (non-rasterized) text via Playwright's native PDF text layer, OG image is
  exactly 1200×630.
- **Grid-blowout horizontal-overflow bug (new, not in the brief but found
  during Phase 7/9 QA)** — `/contact` and four other pages used a Tailwind
  `grid` container with only an `lg:grid-cols-[...]` override and no base
  `grid-cols-1`, which lets the browser size the single implicit mobile
  column to its widest child's max-content instead of the container's actual
  width (confirmed root cause via computed `grid-template-columns`, not
  guessed). Fixed by adding an explicit `grid-cols-1` base to all five
  (`contact.astro`, `about.astro` ×2, `work/[...slug].astro`,
  `blog/[...slug].astro`), plus a defensive `overflow-x: clip` on `body` in
  `global.css`. Verified with a 77-combination automated Playwright sweep
  (5 viewports × light mode × 6 pages, plus dark mode and full-viewport
  passes on the case studies and other detail pages) checking real
  scrollability (`window.scrollTo` + `scrollX` readback, not just
  `scrollWidth`, which over-reports on `clip`/`hidden` ancestors) — 0
  failures after the fix.
- **`work.disclosure` UI string added** — the brief's Phase 5 disclosure
  ("Case studies describe Marco's contribution to work delivered through
  employment, consulting, and independent product development. Confidential
  details are intentionally limited.") is now shown under the `/work` index
  page's subtitle, in all three locales.
- **Root `/` gateway hreflang gap fixed** — `src/pages/index.astro` was
  missing the `de-DE` `<link rel="alternate">` (only en-US/es-ES were
  present, even though the redirect script itself already handled German).
  Added.
- **`backend-api-modernization` landing page's MQTT mention** — "Real-time
  and time-series data (MQTT, TimescaleDB)" was changed to "... (WebSockets,
  TimescaleDB)" since its only backing case study (Kewazo) no longer confirms
  MQTT.

---

# Content Verification Checklist (private — not built into the site)

This file lives at the repo root, outside `src/` and `public/`, so it is
never part of the Astro build output. It exists to track every claim on the
live site that still needs Marco's direct confirmation, and the private
handoff notes for legal review. Do not copy any of this into public pages
until the corresponding item is resolved.

Companion file: `CONTENT_TODO.md` tracks the 7 unpublished (`draft: true`)
historical project entries and their missing facts — that list is not
duplicated here.

---

## 0. CRITICAL — screenshots removed, real patient/client data was live on the site

While writing better `alt` text for the three featured case studies I opened
every screenshot file to see what was actually in them (not just the
filename). Two of the three sets turned out to be real product screenshots,
not mockups, and both exposed data that should never have been public:

- **Clinical Data Analysis Platform** (`tecmed-1.png` … `tecmed-5.png`): full
  patient names, dates of birth, sex, assigned physician names, and a
  clinical note ("Echo shows severe mitral stenosis") rendered directly in
  the screenshots — this is PHI-shaped data, displayed on the very case
  study whose entire narrative is "patient data never appears in logs." I
  cannot tell whether these are real patients or seeded demo data, and it
  does not matter for the decision: either way it should never have shipped
  publicly, and I treated it as a hard stop rather than something to ask
  about first.
- **IoT Telemetry Platform** (`kewazo_portafolio_1.png` … `_5.png`): a full
  grid of what read as real customer/company names (construction and
  scaffolding firms) functioning as a client roster, plus a specific real
  street address (`4360 Brahmin Wy, Mather, CA 95655, USA`) in a "Daily
  Report" panel.

**What I did about it, already, without waiting for confirmation:**

1. Set `images: []` in `iot-data-platform.md` and `clinical-data-analyzer.md`
   for all three locales (6 files) — the case study pages no longer render a
   gallery, and the homepage carousel/card preview for both falls back to
   the existing Monogram-initials placeholder (an already-built fallback,
   not a new hack).
2. Physically moved all 10 image files out of `public/portafolio/` (which
   ships verbatim to the built site regardless of whether any page
   references the file) into `private-assets-not-for-web/` at the repo
   root, and added that folder to `.gitignore` so it can't be committed by
   accident. The files are not deleted, just out of anything web-servable.
3. Did **not** attempt to redact/crop/blur the images myself and re-add
   them — that still risks missing something, and the brief is explicit
   that confidential data must not be revealed, not "revealed carefully."

**What I need from Marco before any screenshots go back on these two case
studies:**

- [ ] Confirm the Clinical Data Analyzer screenshots use synthetic/seeded
      demo data, not real patients — and even if so, whether you're
      comfortable with PHI-*shaped* screenshots being public at all, or
      whether new screenshots should be captured against a demo account
      with obviously fake data (e.g. "Test Patient One") and no realistic
      DOB/clinical notes.
- [ ] Confirm whether Kewazo authorized you to publish screenshots that
      show their customers' names and site addresses. If not, either get
      sign-off or provide/produce a version with that data redacted or
      replaced before it's used again.
- [ ] Separately from images: the client roster question in §4 below
      (whether "Kewazo" can be named at all) is unaffected by this and
      still needs an answer either way.

Until these are answered, both case studies stay screenshot-free rather than
guessing at what's safe to restore.

---

## 1. Legal — requires professional review before commercial launch

**This has NOT been reviewed by a lawyer.** The Impressum and Datenschutz
pages were updated to cite current law (DDG §5 instead of the retired TMG
§5) and to remove the discontinued EU ODR platform link, and the privacy
notice now covers legal basis, retention, and third-country transfer at a
generic level — but none of this is a substitute for a *Rechtsanwalt* or
*Fachanwalt für IT-Recht* sign-off before the domain is used commercially.
Specifically ask a lawyer to check:

- § 7 DDG ("Beschränkte Verantwortlichkeit"/limited liability) — I fetched
  the actual statutory text directly (not just a summary) after Marco asked
  what it was, and tightened the Impressum wording to match it: it applies
  the EU DSA (Reg. (EU) 2022/2065) to all providers, sets specific rules for
  open-WiFi providers, and gives a liability shield against damages/
  injunctions for illegal third-party content a provider merely transmits
  or hosts, unless they knowingly collaborate in it. The current page text
  reflects that. Still ask a lawyer to confirm this is the right provision
  to lead with for a one-person freelance portfolio site specifically (vs.
  e.g. citing the DSA's own Art. 4-6 more directly), and that nothing from
  the old §§ 8–10 TMG needs a separate mention.
- Whether the GDPR legal-basis, retention, and third-country-transfer
  language is sufficient given Marco's actual data flows once the address
  and any invoicing/CRM tooling are added.
- Whether a sole trader in Marco's situation needs a *Handelsregister* entry
  or USt-IdNr disclosed, and whether *Kleinunternehmerregelung* (§ 19 UStG)
  applies and should be stated.

### BLOCKER — Impressum address

`PROFILE.legal.fullAddress` in `src/config.ts` is still a placeholder. It
renders as a loud amber "TODO" chip on `/en/legal/impressum` (and in the
Datenschutz controller section) by design — the codebase's `Todo` component
makes an unfilled legal-required fact impossible to miss rather than
silently blank. **This is not fabricable. Do not deploy or point real
traffic at this domain until Marco supplies his real, complete service
address** (street, house number, postal code, city) and it is entered in
`src/config.ts`. Once entered, the chip disappears automatically on both
pages, all three locales.

- [ ] Marco's real business/service address for the Impressum.
- [ ] Confirm whether a VAT ID (`USt-IdNr.`) applies (`PROFILE.legal.vatId`).
- [ ] Confirm whether a commercial register entry applies
      (`PROFILE.legal.commercialRegister`).

---

## 2. Featured case study risks (all three currently homepage-featured studies)

### 2a. Industrial IoT Monitoring Platform (Kewazo) — RESOLVED

**RESOLVED (Master Brief, 2026-08-17).** Marco supplied the confirmed stack
and a conservative case-study direction. `iot-data-platform.md` (en/de/es)
has been fully rewritten:

- Title changed to "Industrial IoT Monitoring Platform."
- Technologies changed to the confirmed set: Svelte, Python, FastAPI, MQTT,
  TimescaleDB, Bash, Linux. Node.js, WebSockets, and D3.js — none of them
  confirmed — were removed.
- Role changed to "Senior Software Developer"; `engagement.relationship` set
  to `employee` (this was employment, not a freelance client — the case
  study sidebar now labels Kewazo "Employer," not "Client," see the new
  organization-label logic in `work/[...slug].astro`).
- Removed entirely: the architecture diagram, the "why canvas instead of
  SVG" narrative, the 30-second-polling claim, the 250ms batching window,
  the "order of magnitude" throughput claim, continuous-aggregate details,
  and the 60fps figure — none of these were independently verifiable.
- `highlights` (the stat strip) and `decisionQuote` are now empty/absent
  rather than carrying unverified specifics.
- `verificationStatus: verified` — every remaining claim traces to the
  confirmed facts in the master brief.

No further action needed unless Marco wants to add back specific,
independently verifiable metrics later.

### 2b. Mobile Commerce Platform — tightened further

### 2b. Mobile Commerce Platform — ownership wording softened, not resolved

Per the master brief's instruction to distinguish app implementation from
integration with a shared Node.js backend-for-frontend (BFF), the case study
now says Marco implemented the React Native app's flows and *integrated
with* the shared Node.js BFF that held market-specific rules and API
contracts — not that he built or owned the BFF itself. The "What I owned"
heading is now "What I built"; the architecture-decision section frames the
API-layer principle as the platform's, not personally Marco's decision.
Applied to all three locales.

- [ ] Still open: confirm whether you personally implemented any part of the
      Node.js BFF itself, beyond integrating with it from the app. If so,
      the copy can be strengthened again — with specifics.
- [ ] Confirm the year (currently 2026 — is that correct, or should it read
      differently for a case study published before that date?).

### 2c. Clinical Imaging Data Platform — RESOLVED

**Client identity resolved (Marco, 2026-08-17): a different, confidential
client — explicitly not Cytolytics.** Stays anonymous, as before.

**Content resolved (Master Brief, 2026-08-17).** Rewritten in all three
locales to only the confirmed facts: **DICOM, OpenSearch, Ansible**.
Removed entirely, because they were not confirmed: Celery, PHI-specific
logging controls, FastAPI, PostgreSQL, immutable audit records, row-level
access control, the "reproducible pipelines" architecture narrative, the
full architecture diagram, and every specific outcome claim including "a day
to a couple of minutes." Title changed to "Clinical Imaging Data Platform"
to match what's actually being described. Role changed to the safe fallback
"Software Engineer" since the previous "Backend & Data Engineer" title was
part of the same unverified narrative. `verificationStatus: verified`.

- [ ] Still open: confirm the year (currently `2024`). Change only if you
      confirm the underlying work happened in 2025–2026 — I did not guess a
      replacement year.
- [ ] Still open: if you want a stronger outcome statement or additional
      verified technologies added back, send the specifics and a source.

### 2d. Sidebar "I owned" label contradicted the body text — RESOLVED (2026-08-18)

Found by actually reading the rendered Clinical case study page, not the
source: the aside sidebar showed **"I OWNED: DICOM imaging data,
OpenSearch-backed indexing and search, and Ansible automation"** directly
under body copy that says *"I contributed to that work as part of a team."*
Same contradiction existed on the IoT/Kewazo page ("I OWNED" vs. "I was part
of the engineering team..."). The label was a single shared translation key
(`project.ownership`) applied to every case study regardless of relationship.

Fixed in `src/lib/engagement.ts` (`getScopeLabel`): the label now reads
**"Scope"** by default, and only upgrades to **"I owned"** when
`engagement.relationship` is confirmed as `direct` or `independent` — i.e.
where Marco was demonstrably the primary/sole engineer. Effect on every
published case study:

| Project | Relationship | Label now |
|---|---|---|
| Industrial IoT (Kewazo) | employee | Scope |
| Clinical Imaging | unset (team, unconfirmed type) | Scope |
| Mobile Commerce | unset | Scope |
| NIGHTOWL | unset (`verificationStatus: partial`) | Scope |
| Viamor | unset (`verificationStatus: partial`) | Scope |
| Stratos One / Kin Relay / RaumHub / Bavarian Defence | independent | I owned |

---

## 3. Other published projects — employment relationship, production status, live links

For each, confirm whether the engagement was direct freelance/independent
work, or delivered through an employer/agency (the site must not present
employer work as though the company hired Marco directly as an independent
consultant):

- **NIGHTOWL** (`nightowl.md`) — role "Full-Stack Engineer," client
  "NIGHTOWL," `liveDemo: https://nightowl.app/`. Now marked
  `verificationStatus: partial` in frontmatter (all three locales) so this
  uncertainty is tracked in the content itself, not just this document.
  - [ ] Was this a direct client relationship, or delivered via an employer?
        Once known, set `engagement.relationship` accordingly (`employee` /
        `contractor` / `direct`) — the case-study sidebar will then show the
        correct label ("Employer" / "Engaged via" / "Client") automatically.
  - [ ] Is `https://nightowl.app/` still live and accurate to link publicly?
- **Viamor** (`viamor-dating.md`) — role "Full-Stack Engineer," client
  "Viamor," no live link. Also now `verificationStatus: partial`.
  - [ ] Direct client, or via an employer/agency?
- **Kin Relay**, **RaumHub**, **Stratos One**, **Bavarian Defence** — all
  four now explicitly carry `engagement.relationship: independent` (a new
  schema value added this pass), so their case-study sidebars show "Studio"
  (or, for Bavarian Defence, no organization line at all — the placeholder
  `client: Independent` text was removed as redundant once the relationship
  badge itself says "Independent") instead of ever implying a client
  relationship. Please confirm:
  - [ ] Kin Relay and RaumHub's production/release status as currently
        stated (Kin Relay: "Released"; RaumHub: "Released," v1.2.1 on the
        Play Store) is still accurate today.
  - [ ] Stratos One's status, currently "Active development," is still
        accurate.
- **RaumHub — reviewed for IP/publication risk (Master Brief, 2026-08-17).**
  Read the full case study body looking for exposed third-party secrets,
  trademarks, or confidential material. Found none: it names only
  technologies (Stripe, Supabase, Expo, Deno) and Marco's own architectural
  reasoning, carries zero screenshots, and describes a product Marco founded
  and owns outright. No `publish: false`/`draft: true` gate applied — I
  found no basis for one. If there's a permission concern I couldn't see
  from the text (e.g. Play Store asset licensing), let me know and I'll gate
  it immediately.
- **RaumHub screenshots** — `public/portafolio/` is not populated with
  RaumHub images yet (no `images:` entries in the current file), so no
  screenshots are currently displayed. If you add screenshots later,
  confirm you're entitled to publish them (App/Play Store assets you own,
  not third-party or user-submitted content) before adding them.

---

## 4. Client roster (`src/data/clients.ts`)

This file already carried its own pre-existing TODO comment (kept, not
written by this pass): confirm you are contractually free to name each of
the following, and whether "MedTech" and "Creative"-style generic entries
should stay or be cut:

- [ ] ProSieben — confirm namable.
- [ ] Dehner — confirm namable.
- [ ] Kewazo — confirm namable (also see §2a above).
- [ ] Cytolytics (spelling now corrected from "Cytolitics") — confirm
      namable.
- [ ] WebCreek — confirm namable.
- [ ] Viamor — confirm namable.
- [ ] DreamNest — confirm namable.
- [ ] DomTom — confirm namable.

The "Selected teams and products I have worked with" framing (see homepage
changes) already avoids implying all of these were direct freelance
clients, but each name still needs your go-ahead to display at all.

---

## 5. Trust and contact — external actions only Marco can take

- [x] **Contact email.** RESOLVED 2026-08-26: `SITE.email` in `src/config.ts`
      is `marco.casanova.de@outlook.com`, the single source every contact
      surface reads from. A domain address (`hello@marcocasanova.de` or
      similar) stays unwired until you confirm that mailbox exists and
      receives mail.
- [ ] **LinkedIn.** `SITE.linkedin` is `null`, so every LinkedIn link/schema
      field is hidden. Send the exact profile URL to enable it.
- [ ] **GitHub.** Kept as-is (`https://github.com/marcocasanova-dev`) since
      it supports the senior positioning in principle, but before it's
      doing real work in a sales funnel it needs, in order of impact:
      1. A profile README.
      2. 3–6 pinned, representative repositories (ideally including at
         least one polished backend/data project with visible tests, CI,
         Docker, and architecture notes).
      3. Old/irrelevant forks cleared out or unpinned.
      I did not touch any GitHub repository or setting — no access, and out
      of scope even if I had it.
- [ ] **Downloadable PDF profile.** `PROFILE.cv` is now `null` for every
      locale, so the "Download profile" action is hidden site-wide rather
      than serving the old `.md` files (which violated "must not download
      Markdown"). To bring it back: send the latest verified CV content —
      positioning, core services, verified experience, 2–3 concise case
      studies, tech focus, location/working model, contact — and I (or you)
      can typeset it into
      `public/cv/Marco-Casanova-Freelance-Software-Engineer.pdf` and point
      `PROFILE.cv` at it. I did not generate PDF content from the old
      Markdown CVs, since I can't confirm they're still accurate.
- [ ] **Testimonials.** None exist in the repo and none were added. If you
      want real ones published, send exact approved wording + name + role +
      company + explicit permission to publish, per person.
- [ ] **Availability wording.** `PROFILE.bookingFrom` is `null` (renders
      "Availability on request" everywhere, never an invented date). Send
      the real wording (e.g. a specific month) if you want a concrete date
      shown, and confirm you want it published before it goes live.
- [ ] **Engagement floor / pricing.** `PROFILE.engagementFloor` is `null` —
      no minimum-project-size figure appears anywhere. The task brief
      suggested "Projects generally start at €3,500" as a possible number;
      it is **not** published anywhere on the site. Confirm the number (or
      a different one) before I add it. The old €95/hour rate does not
      appear anywhere in the repository — confirmed by search — and I did
      not add it.
- [ ] **Google Search Console.** Once real content is deployed (see the
      canonical/sitemap fixes in this pass), request re-indexing for
      `/en/`, `/de/`, `/es/` — I have no access to Search Console and did
      not attempt this.

---

## 6. Explicitly NOT changed without your confirmation

To be clear about restraint, not just action — these were flagged in the
brief but I deliberately left alone because changing them would mean
guessing a fact:

- Kewazo/IoT technologies and architecture (§2a).
- Clinical Data Analyzer's year (§2c — client identity now resolved: not Cytolytics).
- NIGHTOWL/Viamor employment relationship (§3).
- The Impressum address (blocker, §1).
- Any new testimonial content (none exists; none invented).
- Any new metric, date, or outcome not already present in a project file.
