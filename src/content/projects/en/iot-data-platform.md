---
title: IoT Telemetry Platform
description: Replaced 30-second polling with live telemetry operators could trust on a construction site, across ingest, storage, and dashboard layers.
order: 2
featured: true
year: 2024
role: Lead Full-Stack Engineer
client: Kewazo
technologies:
  - Svelte
  - Node.js
  - WebSockets
  - D3.js
  - Python
  - TimescaleDB
sectors:
  - IoT
  - Data Analytics
logo: /logos/kewazo.webp
images:
  - kewazo_portafolio_1.png
  - kewazo_portafolio_2.png
  - kewazo_portafolio_3.png
  - kewazo_portafolio_4.png
  - kewazo_portafolio_5.png
highlights:
  - value: Batched
    label: Ingest pipeline
    consequence: MQTT payloads were validated and inserted in batches instead of one row per message.
  - value: Canvas
    label: Rendering path
    consequence: Full-shift views stayed responsive because the browser painted one surface, not thousands of DOM nodes.
  - value: Explicit
    label: Connection state
    consequence: Operators could see when data was stale instead of trusting silently outdated readings.
outcome: Replaced 30-second refreshes with live telemetry and explicit stale-state handling, so operators could act on the dashboard instead of walking to the machine.
tradeoff: Kept D3 for scales and time-axis math, but moved chart rendering from SVG to canvas to preserve 60fps on low-power tablets.
status: Production
engagement:
  duration: '2024 delivery'
  teamSize: Engineering, product, and operations
  scope: Ingest pipeline, WebSocket fan-out, canvas dashboard rendering, and stale-state UX
decisionQuote:
  text: 'Operators tolerate a dashboard that admits it is behind. They stop trusting one that silently shows old numbers as though they were current.'
github: null
liveDemo: null
video: null
draft: false
---

## The problem

Robotic scaffolding lifts operate on active construction sites — noisy RF environments, intermittent LTE, and operators wearing gloves looking at a tablet in direct sunlight. The existing monitoring was a polling dashboard that refreshed every 30 seconds. By the time a fault surfaced on screen, the machine had often already stopped.

The brief was simple to state and hard to deliver: **make the dashboard reflect machine state fast enough that an operator trusts it more than walking over to look.**

## Constraints that shaped the design

- **Unreliable uplinks.** LTE on a construction site drops constantly. The system had to degrade gracefully, not error out.
- **High write, low update.** Telemetry is append-only and time-ordered. Rows are never edited.
- **Wide time ranges.** Operators wanted both "the last 60 seconds" and "this whole shift" from the same UI.
- **Low-power clients.** Site tablets are not workstations. A dashboard that pinned the CPU would drain the battery before lunch.

## Architecture

```
Sensors (MQTT) → Python ingest workers → TimescaleDB hypertable
                                              │
                                     Node.js fan-out service
                                              │
                                    WebSocket ── Svelte client (D3)
```

**Ingest.** Python workers subscribe to MQTT topics per machine, validate payloads against a schema, and batch-insert into TimescaleDB. Batching was the single largest throughput win — inserting one row per message capped out early; batching on a 250ms window pushed ingest an order of magnitude further on the same hardware.

**Storage.** TimescaleDB hypertables partition by time automatically. Continuous aggregates pre-compute the 1-minute and 1-hour rollups, so a "last 8 hours" query reads a few hundred pre-aggregated rows instead of scanning millions of raw ones.

**Transport.** A Node.js service holds the WebSocket connections and fans out updates. Clients subscribe to a machine, not to everything — critical, because broadcasting all telemetry to all clients is the mistake that quietly kills these systems at scale.

**Client.** Svelte compiles away the framework runtime, which mattered on low-power tablets. D3 handles the scales and axes; the actual drawing goes to canvas, not SVG. This is the decision I would defend hardest.

## Why canvas instead of SVG

The first version rendered charts as SVG. It was clean, inspectable, and fell over at roughly 2,000 points — every datum became a DOM node the browser had to lay out and paint on each frame.

Moving to canvas changed the cost model. The browser paints one element regardless of how many points are in it. Rendering became a function of pixels, not data volume, and held 60fps through the full shift view. D3 stayed in the stack for what it is genuinely best at — scales, ticks, and time axis math — while giving up its DOM-binding layer.

## Handling connection loss

Rather than a reconnect loop that pretends nothing happened, the client tracks connection state explicitly and shows it. On reconnect it requests a delta from its last received timestamp rather than a full refetch, so recovering from a 40-second tunnel costs a small payload instead of the entire shift history.

The visible "stale data" state turned out to matter more than the reconnection logic itself. Operators tolerate a dashboard that admits it is behind. They stop trusting one that silently shows old numbers as though they were current.

## What I would do differently

The continuous aggregate refresh policy was tuned by hand, and it drifted as data volume grew. I would make refresh lag a monitored metric from day one rather than something discovered when a chart looked subtly wrong.
