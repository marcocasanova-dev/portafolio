---
title: The Ups and Downs of the Node.js Event Loop
description: How Node.js handles thousands of concurrent connections on a single thread, the phases callbacks actually run in, and the mistakes that stall the whole process.
pubDate: 2026-02-20
readTime: 6
image: /images/event_loop.gif
tags:
  - Node.js
  - Performance
  - Backend
draft: false
---

Node.js is known for non-blocking I/O and high concurrency, but the mechanism behind it, the **event loop**, is widely misunderstood. That misunderstanding is expensive: nearly every "our Node service falls over under load" incident traces back to someone blocking the loop.

> "Why does Node handle so many requests without threads? What is actually happening under the hood?"

## What the event loop is

The event loop lets Node perform non-blocking I/O despite JavaScript being single-threaded. Node hands work off to the operating system or to libuv's thread pool, and processes completions in discrete phases.

```js
while (queue.waitForMessages()) {
  queue.processNextMessage();
}
```

The critical consequence: **your JavaScript never runs in parallel with itself.** Concurrency here means "many operations in flight", not "many callbacks executing at once". One slow synchronous function stops everything, every connection, every request, every timer.

## The phases

Each iteration of the loop moves through phases in a fixed order, each with its own callback queue:

1. **Timers**, callbacks scheduled by `setTimeout` and `setInterval`.
2. **Pending callbacks**, I/O callbacks deferred from the previous iteration.
3. **Idle / prepare**, internal.
4. **Poll**, retrieve new I/O events and run their callbacks. This is where the loop spends most of its time and where it will block waiting for work.
5. **Check**, `setImmediate` callbacks.
6. **Close callbacks**, `socket.on('close')` and friends.

This ordering explains a classic puzzle: `setTimeout(fn, 0)` and `setImmediate(fn)` at the top level fire in a non-deterministic order, because it depends on how long the loop took to start. Inside an I/O callback, however, `setImmediate` **always** wins, the loop is already past the timers phase and reaches check first.

## Microtasks jump the queue

Between phases, and between individual callbacks, Node drains its microtask queues:

- `process.nextTick()` callbacks run first.
- Promise continuations (`.then`, and everything `await` desugars to) run after.

Microtasks run to *exhaustion* before the loop advances. A recursive `process.nextTick()` will starve the loop completely: I/O never resumes, timers never fire, and the process becomes unresponsive while consuming 100% CPU.

```js
// Never returns to the event loop. The process hangs.
function starve() {
  process.nextTick(starve);
}
```

## How to block the loop by accident

**CPU-bound work in a request handler.** Parsing a large JSON payload, hashing a password with high cost factors, resizing an image, or running a regex with catastrophic backtracking. While that runs, every other connection waits.

**Synchronous filesystem calls.** `fs.readFileSync` is fine at startup and a liability in a hot path.

**Large synchronous serialisation.** `JSON.stringify` on a deeply nested object is not free, and it is not interruptible.

## Watching for it

The event loop tells you when it is struggling, if you ask. Node exposes this directly:

```js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
  // p99 lag climbing means something is blocking. Alert on this.
  console.log('loop lag p99 (ms):', h.percentile(99));
  h.reset();
}, 10_000);
```

Event loop lag is the single most valuable metric for a Node service. It rises before latency does and it points at the cause rather than the symptom.

## Fixing it

**Move CPU work off the loop.** `worker_threads` for in-process parallelism, or a separate queue and worker service for heavier jobs. A worker thread gets its own loop, so blocking it does not block yours.

**Yield in long loops.** If you must process a large batch in-process, break it into chunks and return to the loop between them so I/O is not starved.

**Use streams with backpressure.** Reading a large file into memory and then processing it converts a streaming problem into a blocking one. Respect the `drain` signal instead of ignoring it.

**Profile properly.** `clinic.js`, `0x`, and `--cpu-prof` show you where synchronous time goes. Guessing is slower than measuring.

## TL;DR

- The event loop is Node's concurrency model; your JavaScript is still single-threaded.
- Callbacks run in phases: timers → pending → poll → check → close.
- `process.nextTick` and promise callbacks run between phases and can starve the loop entirely.
- Blocking the loop degrades *every* connection, not just the slow request.
- Monitor event loop lag. Offload CPU-bound work to worker threads.
