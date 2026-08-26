---
title: Die Höhen und Tiefen des Node.js Event Loop
description: Wie Node.js tausende gleichzeitige Verbindungen auf einem einzigen Thread bewältigt, in welchen Phasen Callbacks tatsächlich laufen und welche Fehler den gesamten Prozess blockieren.
pubDate: 2026-02-20
readTime: 6
image: /images/event_loop.gif
imageWidth: 880
imageHeight: 495
tags:
  - Node.js
  - Performance
  - Backend
draft: false
---

Node.js ist bekannt für nicht-blockierendes I/O und hohe Nebenläufigkeit, aber der Mechanismus dahinter, der **Event Loop**, wird weithin missverstanden. Dieses Missverständnis ist teuer: Fast jeder Vorfall vom Typ „unser Node-Service bricht unter Last zusammen" lässt sich darauf zurückführen, dass jemand den Loop blockiert hat.

> „Warum bewältigt Node so viele Requests ohne Threads? Was passiert da eigentlich unter der Haube?"

## Was der Event Loop ist

Der Event Loop erlaubt es Node, nicht-blockierendes I/O zu betreiben, obwohl JavaScript single-threaded ist. Node reicht Arbeit an das Betriebssystem oder an den Thread-Pool von libuv weiter und verarbeitet die Fertigstellungen in klar getrennten Phasen.

```js
while (queue.waitForMessages()) {
  queue.processNextMessage();
}
```

Die entscheidende Konsequenz: **Dein JavaScript läuft nie parallel zu sich selbst.** Nebenläufigkeit heißt hier „viele Operationen in Flight", nicht „viele Callbacks gleichzeitig in Ausführung". Eine einzige langsame synchrone Funktion stoppt alles, jede Verbindung, jeden Request, jeden Timer.

## Die Phasen

Jede Iteration des Loops durchläuft die Phasen in fester Reihenfolge, jede mit ihrer eigenen Callback-Queue:

1. **Timers**, Callbacks, die von `setTimeout` und `setInterval` geplant wurden.
2. **Pending Callbacks**, I/O-Callbacks, die aus der vorherigen Iteration verschoben wurden.
3. **Idle / Prepare**, intern.
4. **Poll**, neue I/O-Events abholen und ihre Callbacks ausführen. Hier verbringt der Loop die meiste Zeit, und hier blockiert er auch, während er auf Arbeit wartet.
5. **Check**, `setImmediate`-Callbacks.
6. **Close Callbacks**, `socket.on('close')` und Verwandte.

Diese Reihenfolge erklärt ein klassisches Rätsel: `setTimeout(fn, 0)` und `setImmediate(fn)` auf oberster Ebene feuern in nicht-deterministischer Reihenfolge, weil es davon abhängt, wie lange der Loop zum Starten gebraucht hat. Innerhalb eines I/O-Callbacks gewinnt `setImmediate` dagegen **immer**, der Loop ist bereits an der Timers-Phase vorbei und erreicht Check zuerst.

## Microtasks drängeln sich vor

Zwischen den Phasen, und zwischen einzelnen Callbacks, leert Node seine Microtask-Queues:

- `process.nextTick()`-Callbacks laufen zuerst.
- Promise-Continuations (`.then` und alles, wozu `await` entzuckert wird) laufen danach.

Microtasks laufen bis zur *Erschöpfung*, bevor der Loop weitergeht. Ein rekursives `process.nextTick()` lässt den Loop komplett verhungern: I/O wird nie fortgesetzt, Timer feuern nie, und der Prozess reagiert nicht mehr, während er 100 % CPU verbraucht.

```js
// Kehrt nie zum Event Loop zurück. Der Prozess hängt.
function starve() {
  process.nextTick(starve);
}
```

## Wie du den Loop aus Versehen blockierst

**CPU-gebundene Arbeit in einem Request-Handler.** Eine große JSON-Payload parsen, ein Passwort mit hohen Kostenfaktoren hashen, ein Bild skalieren oder eine Regex mit katastrophalem Backtracking laufen lassen. Solange das läuft, warten alle anderen Verbindungen.

**Synchrone Dateisystem-Aufrufe.** `fs.readFileSync` ist beim Start in Ordnung und in einem heißen Pfad eine Belastung.

**Große synchrone Serialisierung.** `JSON.stringify` auf einem tief verschachtelten Objekt ist nicht gratis, und es ist nicht unterbrechbar.

## Darauf achten

Der Event Loop sagt dir, wann er ins Straucheln gerät, wenn du fragst. Node stellt das direkt bereit:

```js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
  // Steigende p99-Verzögerung heißt: etwas blockiert. Hier alarmieren.
  console.log('loop lag p99 (ms):', h.percentile(99));
  h.reset();
}, 10_000);
```

Event-Loop-Lag ist die mit Abstand wertvollste Metrik für einen Node-Service. Sie steigt, bevor die Latenz steigt, und sie zeigt auf die Ursache statt auf das Symptom.

## Beheben

**Verlagere CPU-Arbeit vom Loop weg.** `worker_threads` für Parallelität im Prozess oder eine separate Queue und ein Worker-Service für schwerere Jobs. Ein Worker-Thread bekommt seinen eigenen Loop, ihn zu blockieren blockiert also nicht deinen.

**Gib in langen Schleifen ab.** Wenn du einen großen Batch im Prozess verarbeiten musst, zerlege ihn in Chunks und kehre zwischendurch zum Loop zurück, damit I/O nicht verhungert.

**Nutze Streams mit Backpressure.** Eine große Datei komplett in den Speicher zu lesen und danach zu verarbeiten verwandelt ein Streaming-Problem in ein blockierendes. Respektiere das `drain`-Signal, statt es zu ignorieren.

**Profile richtig.** `clinic.js`, `0x` und `--cpu-prof` zeigen dir, wohin die synchrone Zeit geht. Raten ist langsamer als messen.

## TL;DR

- Der Event Loop ist Nodes Nebenläufigkeitsmodell; dein JavaScript bleibt single-threaded.
- Callbacks laufen in Phasen: Timers → Pending → Poll → Check → Close.
- `process.nextTick` und Promise-Callbacks laufen zwischen den Phasen und können den Loop komplett aushungern.
- Den Loop zu blockieren verschlechtert *jede* Verbindung, nicht nur den langsamen Request.
- Überwache den Event-Loop-Lag. Lagere CPU-gebundene Arbeit in Worker-Threads aus.
