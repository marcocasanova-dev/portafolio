---
title: Kin Relay
description: "A care-coordination platform where families and professional carers log the same person's day into one typed record: 6 categories, 65 subtypes, and a severity scale that survives an audit."
order: 1.6
featured: false
year: 2025
role: Founder & Principal Engineer
client: Stratos One
technologies:
  - Next.js
  - React
  - TypeScript
  - Supabase
  - PostgreSQL
  - Expo
  - next-intl
  - Zod
  - Leaflet
sectors:
  - Healthcare
  - Mobile
  - WebApp
logo: /logos/kinrelay.svg
highlights:
  - value: '65'
    label: Typed activity subtypes
    consequence: A fall, a missed visit, and a glucose reading are distinct records rather than three free-text notes.
  - value: '11'
    label: Interface languages
    consequence: Carers and family members read the same record in their own language, including Arabic, Turkish, and Ukrainian.
  - value: '5'
    label: Membership roles
    consequence: A family viewer, a paid carer, and a service manager see the same circle with different authority.
outcome: Replaced free-text care notes with a typed, multilingual record where every logged event carries a category, a severity, and an author, so a handover between a family member and an agency carer no longer loses information.
tradeoff: Modelled care events as one table with six category-specific subtype columns rather than six separate tables, accepting sparse columns in exchange for one queryable timeline per person.
status: Released
engagement:
  duration: 'Since 2025'
  teamSize: Solo founder
  scope: Postgres schema, Supabase access rules, Next.js web app, Expo mobile app, and eleven-locale translation surface
decisionQuote:
  text: 'Free text is the fastest thing to write and the most expensive thing to read; a care record is written once and read under pressure.'
github: null
liveDemo: null
video: null
draft: false
---

## The problem

Care for one person is almost never delivered by one party. A parent, a sibling, an ambulant service, and a paid carer all show up during the same week, and each of them writes down what happened somewhere the others cannot see: a WhatsApp thread, a paper folder in the hallway, an agency's internal system.

The failure mode is not dramatic. Nobody loses a record. What happens is that a carer arrives without knowing about the fall on Tuesday, or the family finds out about a medication change three days late, and the information that would have prevented it existed the whole time in a format nobody could search.

Free text is the fastest thing to write and the most expensive thing to read; a care record is written once and read under pressure.

## Constraints that shaped the schema

- **Multiple organisations, one person.** A family circle, a senior shared flat, and an ambulant service have genuinely different structures, so the circle type is modelled explicitly: `family`, `senior_wg`, `ambulant_service`.
- **Authority is not binary.** Five roles, owner, manager, carer, family, viewer, because "can this person edit medications" and "can this person read yesterday's notes" are different questions.
- **The reader may not share the writer's language.** Care work in Germany is multilingual by default. The interface ships in eleven languages, and a care recipient carries their own primary language as data, not as a UI preference.
- **Some of this is clinical.** A glucose value and a suspected stroke are not the same kind of note as a walk in the park, and the record has to know the difference without asking the person logging it to write a paragraph.

## One timeline, six categories

The central decision was to make every logged event a row in one `activities` table, categorised into six kinds: safety, health observation, ADL, environment, service, and engagement, with a category-specific subtype column for each.

That gives 65 typed subtypes in total: 11 safety events (falls, medication error, safeguarding, near miss), 22 health observations (chest pain, stroke-like signs, glucose value, skin breakdown), 14 activities of daily living, 3 environment hazards, 5 service issues, and 10 engagement activities from reading to an outdoor walk.

The alternative was six separate tables, one per category. It would have produced a cleaner schema on paper and a much worse product: the single most common question, *what happened to this person this week*, would have become a six-way union in every query, in every view, in every export. I took sparse columns over a fan-out join, because the timeline is the feature.

Two orthogonal scales sit alongside the category, because they apply across all of them: `harm_severity` runs from `no_harm_prevented` through `no_harm_unprevented`, `low`, `moderate`, `severe`, to `death`, and `assistance_level` records whether the person was independent, supervised, partially assisted, or fully assisted. Severity is deliberately separate from category: a fall can be a near miss and a medication error can be fatal.

## Migrating a taxonomy without breaking history

The ADL subtypes carry two overlapping generations of values. The original set (`mobility_transfer`, `nutrition_meal`, `sleep_rest`) turned out to be too coarse once real logging started, so a finer set replaced it: `transfer`, `ambulation_walk`, `bathing_hygiene`, `dressing_grooming`, `feeding`, and separate bladder and bowel continence entries.

The old values are still valid in the type. That is not an oversight: deleting them would have invalidated every row already written, and a care record that rewrites its own history is worse than one with a slightly untidy enum. New entries use the finer taxonomy; old rows keep meaning what they meant when they were written.

## Where it runs

The web app is Next.js 15 with React 19, `next-intl` for the eleven locales, Zod for input validation, and Leaflet for the care map that places carers and recipients geographically. Supabase provides Postgres, authentication, and the access rules that enforce the role model. The mobile app is Expo, released at version 1.0.1 under `com.stratos.kinrelay`, sharing its sign-in screen with the rest of the Stratos One studio.

Both surfaces read the same tables. There is no separate mobile schema, and no mobile-only fields, a decision that costs some mobile ergonomics and buys the guarantee that the record is the record, wherever you opened it.

## What I would do differently

I would have designed the export format before the third category, not after the sixth. A care record's value is partly that you can hand it to a doctor, an insurer, or a court, and retrofitting a stable external representation onto a taxonomy that has already migrated once is meaningfully harder than defining it up front.
