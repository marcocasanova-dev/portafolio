---
title: Bavarian Defence
description: A tower-defence strategy game in Unity, and an exercise in making hundreds of entities update every frame without dropping below 60fps on mid-range hardware.
order: 5
featured: false
year: 2023
role: Gameplay & Systems Programmer
client: Independent
technologies:
  - Unity
  - C#
sectors:
  - Gaming
  - Entertainment
logo: /logos/bavarian_defense.webp
images:
  - towerdefence-1.webp
  - towerdefence-2.webp
  - towerdefence-3.webp
  - towerdefence-4.webp
  - towerdefence-5.webp
  - towerdefence-6.webp
  - towerdefence-7.webp
highlights:
  - value: Pooled
    label: Entity lifecycle
    consequence: Enemies and projectiles reused memory instead of triggering mid-wave GC spikes.
  - value: Spatial hash
    label: Target search
    consequence: Towers looked at nearby enemies instead of scanning the entire map each frame.
  - value: Packed loops
    label: Movement update
    consequence: Hot movement data stayed cache-friendlier than per-object Update calls.
outcome: Kept late-wave simulation smooth by removing GC churn and bounding the work inside the hottest update paths.
tradeoff: Used manual data-oriented loops and a spatial hash instead of a simpler object-per-Update model because frame-time stability mattered more than editor convenience.
engagement:
  duration: '2023 personal project'
  teamSize: Solo
  scope: Gameplay systems, hot-path profiling, pooling, and spatial indexing
github: null
liveDemo: null
video: null
draft: false
---

## The problem

Tower defence is a deceptively demanding genre for performance. Late waves put hundreds of enemies on screen, each moving along a path, each a candidate target for dozens of towers, each with health bars and status effects. Done naively it is an O(towers × enemies) problem evaluated every single frame, and it degrades exactly when the game is at its most exciting.

This project was, in practice, a performance engineering exercise wearing a game costume.

## Killing the frame-time spikes

The first playable build ran fine early and stuttered badly in late waves. The Unity profiler pointed at two culprits, and neither was the rendering.

### 1. Garbage collection

Enemies were instantiated on spawn and destroyed on death. At a few enemies per second this is invisible. At forty per second, allocation churn triggered GC collections mid-wave, and every collection was a visible hitch at the worst possible moment.

The fix is standard and worth doing properly: **object pooling**. Enemies, projectiles, and damage numbers are allocated once at load and recycled. Spawning becomes taking from a free list and resetting state; dying becomes returning to the list. Steady-state allocation drops to zero, and with nothing to collect, the GC stops interrupting.

The subtlety is state reset. A pooled object carrying stale state from its previous life is one of the nastier bug classes in games, because it reproduces only under specific reuse orders. Every pooled type resets through a single `Reset()` that the pool calls, not through ad-hoc field assignment at the call site.

### 2. Target acquisition

Each tower scanning every enemy each frame is the naive O(n×m) loop. With 40 towers and 500 enemies that is 20,000 distance checks per frame, and it is pure waste, most enemies are nowhere near most towers.

Replacing it with a **spatial hash grid** bounded the work. The world is divided into cells sized to the largest tower range; a tower only examines enemies in its own cell and immediate neighbours. Cost per tower becomes roughly constant in total enemy count and proportional instead to local density.

Two details mattered:

- Enemies update their grid cell only when crossing a boundary, not every frame.
- Distance comparisons use squared magnitude. Square roots in a hot loop are avoidable; comparing squared distances gives the same ordering.

## Data-oriented movement

Enemy movement moved out of per-object `Update()` calls into a single system iterating contiguous arrays of positions and velocities. Hundreds of individual `Update()` invocations each frame carry real overhead, the managed/native boundary crossing is not free, and scattered object memory means the CPU cache misses constantly.

One loop over packed arrays is dramatically more cache-friendly. This is the same insight behind Unity's DOTS, applied by hand at a scale where the full ECS would have been overkill.

## What this project taught me

The performance techniques here are not game-specific. Pool expensive objects, bound your search space with the right data structure, keep hot data contiguous, and profile before optimising. I have applied all four to backend services since, the constraint of a 16ms frame budget just makes the lesson impossible to ignore.
