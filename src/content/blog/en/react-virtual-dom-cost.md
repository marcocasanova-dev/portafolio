---
title: Where React Rendering Actually Costs Time, and When Optimisation Matters
description: A practical look at where React spends time, why re-renders get expensive, and when optimisation is worth the complexity.
pubDate: 2026-04-12
readTime: 6
image: /images/slow.png
imageWidth: 2174
imageHeight: 1478
tags:
  - React
  - Performance
  - Frontend
draft: false
---

In the world of frontend frameworks, React stands out for its declarative component model and its clever use of the **Virtual DOM**. But as applications grow, a question surfaces on nearly every team:

> "Why is my React app getting slower over time? Isn't the Virtual DOM supposed to be fast?"

The Virtual DOM was never a performance feature. It is an *ergonomics* feature that is fast enough, and understanding that distinction is the difference between fixing the problem and cargo-culting `useMemo` everywhere.

## What the Virtual DOM actually is

The Virtual DOM is an in-memory representation of the real DOM. Rather than mutating the browser's DOM directly on every state change, React builds a lightweight tree, works out what changed, and applies a batched set of updates.

```
Component tree
      │
      ▼
Virtual DOM  (React's diffable copy)
      │
      ▼
Real DOM     (browser-rendered UI)
```

The pitch is that batched, minimal DOM mutations beat naive direct manipulation. That is true. The part that gets lost is that you are paying CPU and memory for the privilege.

## Where the time actually goes

### Diffing is expensive at scale

React compares the previous tree with the new one to decide what to commit. For small trees this is negligible. For large trees updated frequently, reconciliation becomes genuinely CPU-bound, and it happens on the main thread, competing with everything else the browser needs to do.

### Rendering runs *before* the diff

This is the part people miss. Before React can diff anything, it has to **build the new tree** by calling your component functions. A state change near the root of an unmemoised tree re-executes every component beneath it, allocating a whole new object graph, and only *then* discovers almost nothing changed.

The diff is not the expensive part. Generating the thing to diff usually is.

### Hooks make re-renders easy to trigger accidentally

An inline object or arrow function in props is a new reference every render, which defeats memoisation on the child. A `useEffect` with an unstable dependency re-fires. These are individually trivial and collectively how an app becomes slow without any single commit being at fault.

### Batching is not universal

Automatic batching improved substantially in React 18, but updates originating outside React's control flow can still produce more render passes than you expect.

## The cost of two trees

During reconciliation React holds **at least two** complete trees: the committed one and the work-in-progress one.

| Phase | Work | Cost |
| --- | --- | --- |
| `render()` | Build a new tree from components | High, CPU and memory |
| `diff()` | Compare previous vs. next | Medium to high, scales with tree size |
| `commit()` | Apply changes to the real DOM | Usually low |

Two trees means roughly double the memory for your component structure, plus allocation churn feeding GC pressure, which shows up as jank rather than as a slow number in a profile.

## What actually helps

**Measure first.** Use the React Profiler and find which components render and why. The bottleneck is rarely where intuition says.

**Cut the re-render at the source.** The highest-leverage fix is usually moving state *down* so fewer components sit beneath it:

```jsx
// Before: typing re-renders the entire dashboard
function Dashboard() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ExpensiveChart />   {/* re-renders on every keystroke */}
    </>
  );
}

// After: the state lives where it is used
function Dashboard() {
  return (
    <>
      <SearchPanel />      {/* owns its own query state */}
      <ExpensiveChart />   {/* untouched by typing */}
    </>
  );
}
```

No memoisation required. The re-render simply never reaches the expensive subtree.

**Then memoise deliberately.** `React.memo`, `useMemo`, and `useCallback` are targeted tools, not defaults. Each has a comparison cost and adds noise; applied everywhere they can make things slower while making the code harder to read. (If you are on React 19's compiler, much of this is handled for you, which reinforces the point that manual memoisation was always a workaround.)

**Virtualise long lists.** Rendering 10,000 rows when 20 are visible is the single most common avoidable mistake. `react-window` or `@tanstack/virtual` fixes it outright.

## Frameworks that avoid the trade-off

| Framework | Strategy | Consequence |
| --- | --- | --- |
| Svelte | Compiles the VDOM away | Updates the DOM directly |
| SolidJS | Fine-grained reactivity | Only changed nodes update; components run once |
| Qwik | Resumability | Defers execution and avoids hydration cost |

These are not strictly *better*, they trade different things. But they demonstrate that the Virtual DOM is a design choice with alternatives, not a law of physics.

## TL;DR

- React rebuilds a component tree on every render, then diffs it against the previous one.
- Building the new tree is usually more expensive than diffing it.
- Holding two trees costs memory and creates GC pressure.
- Move state down before reaching for memoisation, it removes the work instead of caching it.
- Virtualise long lists. Profile before optimising anything.
