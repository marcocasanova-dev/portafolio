---
title: Viamor
description: Modelled complex relationship graphs and consent states for a production dating product built around polyamorous relationships.
order: 4
featured: false
year: 2023
role: Full-Stack Engineer
client: Viamor
technologies:
  - Flutter
  - Firebase
  - Ruby on Rails
  - Vue.js
  - PostgreSQL
sectors:
  - Commerce & Mobile
logo: /logos/viamor.webp
images:
  - viamor_1.png
  - viamor_2.png
  - viamor_3.png
  - viamor_4.png
  - viamor_5.png
  - viamor_6.png
  - viamor_7.png
highlights:
  - value: 'n:m'
    label: Relationship model
    consequence: Partnered users, couples, and overlapping relationships fit one shared structure.
  - value: Explicit
    label: Consent flow
    consequence: Invalid match states became unrepresentable instead of being handled later.
  - value: Shared
    label: Mobile stack
    consequence: One Flutter codebase shipped both platforms while backend rules stayed relational.
outcome: Gave the product a data model that could represent partnered users, group consent, and matching rules without piling on special cases.
tradeoff: Treated relationships as first-class entities and consent as a state machine instead of encoding both as user flags.
status: Production
engagement:
  duration: '2023 delivery'
  teamSize: Product engineering team
  scope: Relationship data model, consent state machine, mobile integrations, and backend boundaries
decisionQuote:
  text: 'Flags let you reach states nobody designed; a transition table does not.'
github: null
liveDemo: null
video: null
verificationStatus: partial
draft: false
---

## The problem

Every mainstream dating app encodes the same assumption in its schema: a user is single, looking for one partner, and a successful outcome removes them from the pool. For polyamorous users that model is not merely incomplete, it is actively wrong. It cannot express "I am partnered and my partner knows I am here", it cannot represent a couple seeking together, and it treats a match as terminal.

The interesting work on this project was almost entirely in the data model. The UI was the easy part.

## Modelling relationships properly

The central decision: **relationships are first-class entities, not a status field on a user.**

```
User ──< RelationshipMembership >── Relationship
                                        │
                                   (type, visibility, consent state)
```

A user has many memberships; a relationship has many members. This one indirection makes the hard cases expressible:

- A user partnered with two people who are not partnered with each other.
- A couple browsing as a unit, where both members must consent to a match.
- A relationship visible to matches but not to the public profile.
- Ending one relationship without touching the others.

The 1:1 schema cannot represent any of these without a pile of special cases. The n:m schema gets them nearly for free, and every downstream feature, matching, notifications, privacy, reads from the same structure instead of reimplementing its own idea of who is connected to whom.

## Consent as a state machine, not a boolean

When a match may involve more than two people, "did they both swipe right" stops being sufficient. Consent became an explicit state machine with a pending state that requires every affected party to act before a match materialises.

Modelling it as a state machine rather than a set of boolean flags meant invalid combinations were unrepresentable rather than merely unlikely. Flags let you reach states nobody designed; a transition table does not.

## Why Flutter, and where it hurt

One codebase, two platforms, a small team, Flutter was the right call and I would make it again. Where it hurt was exactly where you would expect: platform-specific integrations. Push notification handling, deep links, and permission flows all needed native attention on both sides. The 90% shared is real; budget properly for the 10% that is not.

## Firebase and Rails together

An unusual pairing that was deliberate. Firebase handles realtime chat and push, problems it solves better than I would. Rails owns the relational core: users, relationships, consent, matching. Postgres does the graph queries that Firestore is genuinely bad at.

The cost is a sync boundary, and sync boundaries are where bugs live. The rule that kept it manageable: **Postgres is the source of truth for anything relational; Firebase is the source of truth for message delivery.** Any field that needed both was a design smell to be resolved, not an integration to be written.

## What I would do differently

I would introduce the consent state machine earlier. It started as booleans and was refactored under pressure once group matches shipped. The refactor was correct but it touched notification logic, matching, and the mobile client simultaneously, all of which would have been cheaper had the state machine existed from the start.
