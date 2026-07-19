---
title: Los altibajos del event loop de Node.js
description: Cómo Node.js maneja miles de conexiones concurrentes en un solo hilo, las fases en las que realmente corren los callbacks y los errores que dejan colgado todo el proceso.
pubDate: 2026-02-20
readTime: 6
image: /images/event_loop.gif
tags:
  - Node.js
  - Rendimiento
  - Backend
draft: false
---

Node.js es conocido por su I/O no bloqueante y su alta concurrencia, pero el mecanismo detrás de eso —el **event loop**— es ampliamente malentendido. Ese malentendido sale caro: casi todo incidente del tipo "nuestro servicio de Node se cae bajo carga" se remonta a alguien bloqueando el loop.

> "¿Por qué Node maneja tantas requests sin hilos? ¿Qué está pasando realmente por debajo?"

## Qué es el event loop

El event loop le permite a Node hacer I/O no bloqueante a pesar de que JavaScript es de un solo hilo. Node delega el trabajo al sistema operativo o al thread pool de libuv, y procesa las finalizaciones en fases discretas.

```js
while (queue.waitForMessages()) {
  queue.processNextMessage();
}
```

La consecuencia crítica: **tu JavaScript nunca corre en paralelo consigo mismo.** Concurrencia acá significa "muchas operaciones en vuelo", no "muchos callbacks ejecutándose a la vez". Una sola función síncrona lenta detiene todo: cada conexión, cada request, cada timer.

## Las fases

Cada iteración del loop recorre las fases en un orden fijo, cada una con su propia cola de callbacks:

1. **Timers** — callbacks agendados por `setTimeout` y `setInterval`.
2. **Pending callbacks** — callbacks de I/O diferidos desde la iteración anterior.
3. **Idle / prepare** — internas.
4. **Poll** — recupera nuevos eventos de I/O y ejecuta sus callbacks. Acá es donde el loop pasa la mayor parte del tiempo y donde se bloqueará esperando trabajo.
5. **Check** — callbacks de `setImmediate`.
6. **Close callbacks** — `socket.on('close')` y compañía.

Este orden explica un acertijo clásico: `setTimeout(fn, 0)` y `setImmediate(fn)` en el nivel superior se disparan en un orden no determinista, porque depende de cuánto tardó el loop en arrancar. Dentro de un callback de I/O, en cambio, `setImmediate` gana **siempre**: el loop ya pasó la fase de timers y llega antes a check.

## Las microtareas se saltan la fila

Entre fases —y entre callbacks individuales— Node vacía sus colas de microtareas:

- Los callbacks de `process.nextTick()` corren primero.
- Las continuaciones de promesas (`.then`, y todo aquello en lo que `await` se traduce) corren después.

Las microtareas corren hasta *agotarse* antes de que el loop avance. Un `process.nextTick()` recursivo va a matar de hambre al loop por completo: el I/O nunca se reanuda, los timers nunca se disparan y el proceso queda sin responder mientras consume el 100% de la CPU.

```js
// Nunca vuelve al event loop. El proceso se cuelga.
function starve() {
  process.nextTick(starve);
}
```

## Cómo bloquear el loop sin querer

**Trabajo intensivo de CPU en un handler de request.** Parsear un payload JSON grande, hashear una contraseña con factores de costo altos, redimensionar una imagen o correr una regex con backtracking catastrófico. Mientras eso corre, todas las demás conexiones esperan.

**Llamadas síncronas al sistema de archivos.** `fs.readFileSync` está bien al arrancar y es un pasivo en un hot path.

**Serialización síncrona grande.** `JSON.stringify` sobre un objeto profundamente anidado no es gratis, y no es interrumpible.

## Cómo vigilarlo

El event loop te avisa cuando está sufriendo, si se lo preguntas. Node lo expone directamente:

```js
import { monitorEventLoopDelay } from 'node:perf_hooks';

const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();

setInterval(() => {
  // Si el lag p99 sube, algo está bloqueando. Alerta sobre esto.
  console.log('loop lag p99 (ms):', h.percentile(99));
  h.reset();
}, 10_000);
```

El lag del event loop es la métrica más valiosa de un servicio Node. Sube antes que la latencia y apunta a la causa en vez de al síntoma.

## Cómo arreglarlo

**Saca el trabajo de CPU del loop.** `worker_threads` para paralelismo dentro del proceso, o una cola aparte con un servicio worker para jobs más pesados. Un worker thread tiene su propio loop, así que bloquearlo no bloquea el tuyo.

**Cede el control en loops largos.** Si tienes que procesar un lote grande dentro del proceso, divídelo en chunks y vuelve al loop entre uno y otro para no matar de hambre al I/O.

**Usa streams con backpressure.** Cargar un archivo grande a memoria y luego procesarlo convierte un problema de streaming en uno bloqueante. Respeta la señal `drain` en vez de ignorarla.

**Perfila como corresponde.** `clinic.js`, `0x` y `--cpu-prof` te muestran a dónde se va el tiempo síncrono. Adivinar es más lento que medir.

## TL;DR

- El event loop es el modelo de concurrencia de Node; tu JavaScript sigue siendo de un solo hilo.
- Los callbacks corren en fases: timers → pending → poll → check → close.
- `process.nextTick` y los callbacks de promesas corren entre fases y pueden matar de hambre al loop por completo.
- Bloquear el loop degrada *todas* las conexiones, no solo la request lenta.
- Monitorea el lag del event loop. Descarga el trabajo intensivo de CPU a worker threads.
