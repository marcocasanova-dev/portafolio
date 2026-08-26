---
title: Stratos One
description: A product studio built as one monorepo, shared auth, config, UI, and utilities under six apps, so a new product starts with a working login instead of an empty folder.
order: 0.5
featured: false
year: 2025
role: Founder & Principal Engineer
client: Stratos One
technologies:
  - Turborepo
  - pnpm
  - Expo
  - React Native
  - Next.js
  - TypeScript
  - Supabase
  - Flutter
sectors:
  - Events & Platforms
  - Independent Products
logo: /logos/stratos-one.svg
highlights:
  - value: '4'
    label: Shared packages
    consequence: Auth, config, design system, and utilities are written once and consumed by every app.
  - value: '2'
    label: Products shipped
    consequence: Kin Relay and RaumHub both reached versioned releases on the same foundation.
  - value: 1 login
    label: Reused across apps
    consequence: A new product inherits a working sign-in screen instead of reimplementing session handling.
outcome: Turned six separate app ideas into one codebase where authentication, theming, and configuration are solved once, the second product shipped without rewriting the first product's foundation.
tradeoff: Chose a pnpm workspace with a custom Metro resolver over independent per-app repositories, accepting harder mobile bundler configuration in exchange for a single upgrade path across every app.
status: Active development
engagement:
  duration: 'Since September 2025'
  teamSize: Solo founder
  scope: Monorepo architecture, shared packages, Supabase backends, release engineering, and store submission
  relationship: independent
decisionQuote:
  text: 'The expensive part of a second product is never the idea; it is discovering that the first product hid its login, its theming, and its config inside itself.'
github: null
liveDemo: null
video: null
draft: false
---

## Why a studio, not an app

Stratos One started from a pattern I kept hitting. Every new product idea spent its first two weeks on the same work: wire up authentication, decide where configuration lives, build a design system that survives more than three screens, and set up a release pipeline that can actually reach a store.

None of that is the product. All of it is required before the product can exist.

The expensive part of a second product is never the idea; it is discovering that the first product hid its login, its theming, and its config inside itself. So Stratos One is structured the other way around: the shared foundation is the primary artefact, and each app is a thin brand and domain layer on top of it.

## What is actually shared

Four packages carry the weight, and every app consumes them by workspace reference rather than copy:

- **`core-auth`**, Supabase session handling plus a `LoginScreen` component that takes brand colours, logos, and callbacks as props. Kin Relay gates its entire dashboard behind it; RaumHub reuses the same component with a different palette.
- **`core-ui`**, the design system, with one theme file per brand. `kinRelayTheme` is a dark indigo-and-cyan surface; `raumHubTheme` is a light green one. The components do not know which brand they are rendering.
- **`core-config`**, where environment and flavour configuration is resolved, so no app reads credentials from a bundled file at runtime.
- **`core-utils`**, the formatting, validation, and result-handling helpers that otherwise get reinvented per app.

Six apps sit on top: Kin Relay, RaumHub, DreamNest, GreenWG, Stratos Search, and TidyUp, each with an Expo mobile app and a Next.js web counterpart. Two of them, Kin Relay and RaumHub, have reached versioned releases. The rest are scaffolded against the same foundation, which is the point: the scaffold is already a working app shell.

## The constraint that shaped the build

Sharing native code across a pnpm workspace is not free. React Native's Metro bundler expects a flat, hoisted `node_modules`; pnpm deliberately gives it a symlinked store instead.

The honest options were to abandon pnpm, vendor the shared packages into each app, or teach Metro how to resolve a workspace. I took the third. Each mobile app carries a `metro.config.js` that extends `@expo/metro-config` with explicit `watchFolders` and resolver overrides, and the root `package.json` pins `react`, `react-dom`, and `react-native` through `overrides` so no app can silently drift onto a different React version.

The cost is real: bundler configuration is the least portable knowledge in the repo, and it has to survive every Expo SDK upgrade. What I get back is that an SDK bump, a Supabase client upgrade, or a design-token change happens once and lands everywhere.

## Separate backends on purpose

The apps share code but not data. Kin Relay and RaumHub point at **different Supabase projects**, and configuration is resolved per app and per flavour rather than from one shared environment.

This was deliberate. A care-management product handling health observations and a storage marketplace handling payments have almost nothing in common in their threat models, their retention requirements, or their access rules. Sharing a database would have coupled two products whose only real relationship is that I wrote both. Sharing a login *component* is leverage; sharing a login *tenant* would have been a liability.

## The Flutter question

There is a second monorepo, a Flutter port of Kin Relay and RaumHub, structured as a single pub workspace with `melos`, Riverpod providers, compile-time configuration through `--dart-define-from-file`, and architecture decision records under `docs/adr/`.

I built it because the Expo apps answered the product question but left an engineering one open: how much of the shared-foundation argument is about the monorepo, and how much is about React Native specifically. Porting the same two products onto a different toolchain, with the same package boundaries, `stratos_core`, `stratos_config`, `stratos_ui`, `stratos_auth`, is the only way to find out that does not rely on speculation.

## What I would do differently

I would have written the Metro workspace configuration as a shared package on day one instead of letting each app carry a near-identical copy. It is the one piece of the repo that violates its own premise, and it is the piece most likely to break during an SDK upgrade, which is exactly the moment you least want to debug four slightly different bundler configs.
