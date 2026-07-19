---
title: NIGHTOWL
description: Built a production ticketing and event-management platform across Rails, React, and Flutter, covering organizer dashboards, ticket shops, and mobile entry.
order: 1.5
featured: true
year: 2025
role: Full-Stack Engineer
client: NIGHTOWL
technologies:
  - Ruby on Rails
  - React
  - Flutter
sectors:
  - Events
  - Ticketing
  - Mobile
logo: /logos/nightowl.svg
images:
  - nightowl-og.png
highlights:
  - value: Shared
    label: Ticketing rules
    consequence: Pricing phases, discounts, and scanner validation followed one backend model.
  - value: Web + mobile
    label: Product surface
    consequence: Organizers managed events in React while staff handled admission in Flutter.
  - value: Production
    label: Event operations
    consequence: The platform supported live ticket sales and real-world entry flows, not an internal demo.
outcome: Shipped a production event platform where organizers could publish ticket shops, track sales, and run entry from the same system across web and mobile.
tradeoff: Kept ticket phases, admission validation, and organizer state in Rails domain models and APIs rather than duplicating business rules separately in React and Flutter clients.
status: Production
engagement:
  duration: '2025 delivery'
  teamSize: Product and engineering team
  scope: Rails ticketing domain, React organizer flows, Flutter scanner app, and cross-surface business rules
decisionQuote:
  text: 'Ticket phases, scanner validation, and payouts are not three features; they are one inventory system seen from three different screens.'
github: null
liveDemo: https://nightowl.app/
video: null
draft: false
---

## The problem

NIGHTOWL sits in the part of software that looks simple from the landing page and gets complicated the moment money and doors are involved. Organizers need to create events quickly, publish ticket shops, manage discounts, track sales, and still move people through entry without the mobile app disagreeing with the web product.

The hard part was not building one dashboard or one scanner screen. It was keeping the same ticketing rules coherent across the Rails backend, the React surfaces, and the Flutter entry app.

## Constraints that shaped the design

- **Ticket state is shared.** A ticket phase change, a discount rule, or a refund cannot mean one thing in the dashboard and another thing at the door.
- **Entry is operational software.** If the scanner is slow or ambiguous, the problem shows up as a queue of real people rather than a QA bug report.
- **Organizers need one source of truth.** Sales, guest-list logic, payouts, and admission status have to reconcile without spreadsheet cleanup after the event.
- **Web and mobile move at different speeds.** The backend model has to absorb product growth without forcing the React and Flutter clients to each reinvent the business logic.

## One inventory system, three surfaces

The most important design choice was to treat ticketing as one domain, not as a collection of loosely related apps.

Ticket phases, scanner validation, and payouts are not three features; they are one inventory system seen from three different screens.

That is why the Rails layer mattered most. It held the state transitions and validation rules that both clients depended on, while React handled organizer-facing flows and Flutter handled entry operations. Once those rules live centrally, the web and mobile apps can focus on clarity, speed, and recovery states instead of each carrying their own interpretation of what a valid ticket is.

## Why Flutter made sense for entry

The public product promise includes a scanner app for iOS and Android, and that changes the engineering problem. Entry software lives in low-attention, high-pressure conditions: dim light, crowded doors, unstable venue connectivity, and operators who need a yes-or-no answer immediately.

Flutter was the right fit there. One codebase kept the validation UX aligned across both platforms, while the backend stayed responsible for the rules that actually decide whether a ticket is valid. That split kept the mobile app fast without turning it into a second source of truth.

## React where organizers live

React was the right place for the surfaces that change often: event setup, ticket-shop flows, sales visibility, and the controls organizers use before and during an event. Those screens benefit from fast iteration and clear state handling, but they only stay trustworthy if the backend decides the real business rules.

That backend-first boundary is what kept the product coherent. The dashboard, the public shop, and the scanner app were different experiences, but they all had to describe the same event state.

## What I would do differently

I would invest earlier in scenario tests around the boundary between sales and entry: refunded tickets, ticket-phase transitions near doors-open, and last-minute organizer edits while scanning is already in progress. Those are the cases where a ticketing platform earns or loses trust fastest.
