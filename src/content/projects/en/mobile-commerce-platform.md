---
title: Mobile Commerce Platform
description: Shipped cart, checkout, CMS, and loyalty flows for a production retail app serving Germany and Austria across mobile and API layers.
order: 2
featured: true
year: 2026
role: Senior Software Engineer
technologies:
  - React Native
  - Expo
  - TypeScript
  - Node.js
  - TanStack Query
  - RAG
  - LLM Tool Calling
  - Spryker
  - CI/CD
sectors:
  - Commerce & Mobile
logo: /favicon.svg
cover: cover-mobile-commerce-platform.webp
images:
  - mobile-commerce-1.svg
  - mobile-commerce-2.svg
  - mobile-commerce-3.svg
highlights:
  - value: DE + AT
    label: Markets shipped
    consequence: One mobile product supported releases across Germany and Austria.
  - value: '5'
    label: Core journeys built
    consequence: Customer, cart, checkout, CMS, and loyalty flows were implemented in the app end to end.
  - value: Production
    label: Retail application
    consequence: The work shipped in a live environment rather than a demo path.
outcome: Delivered core mobile-commerce journeys end to end across German and Austrian markets, from customer state and cart logic to checkout, CMS, and loyalty flows.
tradeoff: The platform kept business rules in shared APIs and query orchestration rather than duplicating market logic in the app, which made releases safer and behavior easier to trace.
status: Production
engagement:
  duration: 'June – August 2026'
  teamSize: Cross-functional retail product team
  scope: Customer flows, cart, checkout, CMS integration, loyalty, and release support
  relationship: contractor
decisionQuote:
  text: 'When a cart behaves differently by market, the rule belongs in the API, not in whichever screen happens to need it first.'
github: null
liveDemo: null
video: null
draft: false
---

## The problem

The product already had real customers, multiple markets, and the usual retail
pressure points: carts that had to survive app restarts, checkout that had to
behave consistently, CMS-driven content that changed without a client release,
and loyalty rules that could not drift between screens.

The hard part was not building one happy-path flow. It was making several
business-critical flows behave consistently as the product kept shipping.

## Constraints that shaped the design

- **Two active markets.** Germany and Austria shared most behaviour, but not
  all of it. Market-specific logic had to stay visible and testable.
- **Mobile state can go stale quickly.** A cart touched by pricing, stock, CMS,
  and loyalty data cannot assume the device has the latest truth.
- **Checkout failures are trust failures.** Recovery paths matter as much as the
  nominal path when money is involved.
- **Retail teams ship continuously.** Content, campaigns, and loyalty mechanics
  change faster than app releases do.

## What I built

I implemented customer, cart, checkout, CMS, and loyalty flows in the React
Native app, integrating with the shared Node.js backend-for-frontend (BFF)
that held market-specific rules and the API contracts those flows depended
on. On the app side, that included the state architecture in the client and
the delivery path that moved changes from branch to release.

## An AI shopping assistant

I also developed an AI shopping assistant that uses Retrieval-Augmented Generation (RAG) to retrieve product documentation and give customers context-aware answers. Through LLM tool calling against the Spryker commerce APIs, it could fetch live product information and store availability instead of answering from stale text. Prompt engineering and response validation kept answers accurate and let it handle missing or incomplete product information gracefully.

## Keeping market rules out of the client

The architectural principle behind the platform was to keep market-specific
rules in the shared API layer instead of letting them spread into whichever
screen needed a quick conditional first.

When a cart behaves differently by market, the rule belongs in the API, not in
whichever screen happens to need it first.

Building the app around that principle kept the React Native code focused on
orchestration, caching, and recovery states, while TanStack Query handled
fetch lifecycles and invalidation. It also meant checkout behaviour could be
changed once, upstream, and observed in one place, instead of being
reimplemented across multiple mobile paths.

## What shipped

The delivered scope covered customer state, cart behaviour, checkout,
CMS-driven surfaces, and loyalty journeys in a production retail app used
across German and Austrian markets. The result was a cleaner split between app
and backend responsibilities, more predictable releases, and a mobile codebase
that stayed easier to reason about as business rules changed.

## What I would do differently

I would document the market-variation model even earlier in the project. The
code-level separation was there, but giving product and QA the same vocabulary
for “shared rule” versus “market rule” sooner would have made edge-case review
faster.
