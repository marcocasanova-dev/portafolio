---
title: Mobile Commerce Platform
description: Shipped cart, checkout, CMS, and loyalty flows for a production retail app serving Germany and Austria across mobile and API layers.
order: 1
featured: true
year: 2026
role: Senior Software Engineer
technologies:
  - React Native
  - Expo
  - TypeScript
  - Node.js
  - TanStack Query
  - CI/CD
sectors:
  - Retail
  - Mobile
  - E-commerce
logo: /favicon.svg
images:
  - mobile-commerce-1.svg
  - mobile-commerce-2.svg
  - mobile-commerce-3.svg
highlights:
  - value: DE + AT
    label: Markets shipped
    consequence: One mobile product supported releases across Germany and Austria.
  - value: '5'
    label: Core journeys owned
    consequence: Customer, cart, checkout, CMS, and loyalty flows were delivered end to end.
  - value: Production
    label: Retail application
    consequence: The work shipped in a live environment rather than a demo path.
outcome: Delivered core mobile-commerce journeys end to end across German and Austrian markets, from customer state and cart logic to checkout, CMS, and loyalty flows.
tradeoff: Kept business rules in shared APIs and query orchestration rather than duplicating market logic in the app, which made releases safer and behavior easier to trace.
status: Production
engagement:
  duration: '2026'
  teamSize: Cross-functional retail product team
  scope: Customer flows, cart, checkout, CMS integration, loyalty, and release support
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

## What I owned

I owned and implemented customer, cart, checkout, CMS, and loyalty flows across
the React Native app and the Node.js APIs behind it. That included the state
architecture in the client, the API contracts those flows depended on, and the
delivery path that moved changes from branch to release.

## Keeping market rules out of the client

The most important architectural call was to keep market-specific rules in the
shared API layer instead of letting them spread into whichever screen needed a
quick conditional first.

When a cart behaves differently by market, the rule belongs in the API, not in
whichever screen happens to need it first.

That choice kept the React Native app focused on orchestration, caching, and
recovery states, while TanStack Query handled fetch lifecycles and invalidation.
It also meant checkout behaviour could be changed once and observed in one
place, instead of being reimplemented across multiple mobile paths.

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
