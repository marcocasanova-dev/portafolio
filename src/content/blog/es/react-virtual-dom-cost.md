---
title: Dónde cuesta tiempo renderizar en React, y cuándo optimizar de verdad
description: Una mirada práctica a dónde gasta tiempo React, por qué los re-renders se vuelven caros y cuándo la optimización compensa su complejidad.
pubDate: 2026-04-12
readTime: 6
image: /images/slow.png
tags:
  - React
  - Rendimiento
  - Frontend
draft: false
---

En el mundo de los frameworks frontend, React destaca por su modelo declarativo de componentes y su ingenioso uso del **Virtual DOM**. Pero a medida que las aplicaciones crecen, hay una pregunta que aparece en casi todos los equipos:

> "¿Por qué mi app de React se vuelve más lenta con el tiempo? ¿No se supone que el Virtual DOM es rápido?"

El Virtual DOM nunca fue una funcionalidad de rendimiento. Es una funcionalidad de *ergonomía* que resulta lo bastante rápida, y entender esa distinción es la diferencia entre arreglar el problema y repartir `useMemo` por todos lados por pura inercia.

## Qué es realmente el Virtual DOM

El Virtual DOM es una representación en memoria del DOM real. En vez de mutar el DOM del navegador directamente en cada cambio de estado, React construye un árbol liviano, calcula qué cambió y aplica un conjunto de actualizaciones agrupadas.

```
Árbol de componentes
      │
      ▼
Virtual DOM  (la copia diffeable de React)
      │
      ▼
DOM real     (la UI que pinta el navegador)
```

La promesa es que las mutaciones del DOM agrupadas y mínimas le ganan a la manipulación directa e ingenua. Es cierto. Lo que se pierde de vista es que estás pagando CPU y memoria por ese privilegio.

## A dónde se va realmente el tiempo

### El diffing es caro a escala

React compara el árbol anterior con el nuevo para decidir qué commitear. Para árboles chicos esto es insignificante. Para árboles grandes que se actualizan seguido, la reconciliación se vuelve genuinamente limitada por CPU, y ocurre en el main thread, compitiendo con todo lo demás que el navegador necesita hacer.

### El render corre *antes* del diff

Esta es la parte que se pasa por alto. Antes de que React pueda comparar nada, tiene que **construir el árbol nuevo** llamando a tus funciones de componente. Un cambio de estado cerca de la raíz de un árbol sin memoizar vuelve a ejecutar cada componente debajo de él, asignando un grafo de objetos completamente nuevo, y solo *entonces* descubre que casi nada cambió.

El diff no es la parte cara. Generar aquello que se va a comparar normalmente sí lo es.

### Los hooks hacen que sea fácil disparar re-renders por accidente

Un objeto inline o una arrow function en las props son una referencia nueva en cada render, lo que anula la memoización en el hijo. Un `useEffect` con una dependencia inestable se vuelve a disparar. Individualmente son triviales, y en conjunto son la manera en que una app se vuelve lenta sin que ningún commit particular tenga la culpa.

### El batching no es universal

El batching automático mejoró bastante en React 18, pero las actualizaciones que se originan fuera del flujo de control de React todavía pueden producir más pasadas de render de las que esperas.

## El costo de dos árboles

Durante la reconciliación React mantiene **al menos dos** árboles completos: el commiteado y el que está en progreso.

| Fase | Trabajo | Costo |
| --- | --- | --- |
| `render()` | Construir un árbol nuevo a partir de los componentes | Alto, CPU y memoria |
| `diff()` | Comparar el anterior contra el siguiente | Medio a alto, escala con el tamaño del árbol |
| `commit()` | Aplicar los cambios al DOM real | Normalmente bajo |

Dos árboles significan aproximadamente el doble de memoria para la estructura de tus componentes, más la rotación de asignaciones que alimenta la presión sobre el GC, y eso aparece como jank más que como un número lento en un profile.

## Qué ayuda de verdad

**Mide primero.** Usa el React Profiler y averigua qué componentes renderizan y por qué. El cuello de botella rara vez está donde dice la intuición.

**Corta el re-render en su origen.** El arreglo de mayor palanca suele ser mover el estado *hacia abajo* para que haya menos componentes debajo de él:

```jsx
// Antes: escribir vuelve a renderizar todo el dashboard
function Dashboard() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ExpensiveChart />   {/* se re-renderiza con cada tecla */}
    </>
  );
}

// Después: el estado vive donde se usa
function Dashboard() {
  return (
    <>
      <SearchPanel />      {/* es dueño de su propio estado de query */}
      <ExpensiveChart />   {/* intacto al escribir */}
    </>
  );
}
```

No hace falta memoización. El re-render simplemente nunca llega al subárbol caro.

**Después memoiza con intención.** `React.memo`, `useMemo` y `useCallback` son herramientas puntuales, no valores por defecto. Cada una tiene un costo de comparación y agrega ruido; aplicadas en todos lados pueden hacer las cosas más lentas y el código más difícil de leer. (Si estás en el compilador de React 19, buena parte de esto ya se resuelve por ti, lo que refuerza la idea de que la memoización manual siempre fue un parche.)

**Virtualiza las listas largas.** Renderizar 10.000 filas cuando 20 son visibles es el error evitable más común de todos. `react-window` o `@tanstack/virtual` lo resuelven de una.

## Frameworks que evitan el trade-off

| Framework | Estrategia | Consecuencia |
| --- | --- | --- |
| Svelte | Compila y elimina el VDOM | Actualiza el DOM directamente |
| SolidJS | Reactividad de grano fino | Solo se actualizan los nodos que cambian; los componentes corren una vez |
| Qwik | Resumabilidad | Difiere la ejecución y evita el costo de hidratación |

No son estrictamente *mejores*, intercambian cosas distintas. Pero demuestran que el Virtual DOM es una decisión de diseño con alternativas, no una ley de la física.

## TL;DR

- React reconstruye un árbol de componentes en cada render y luego lo compara con el anterior.
- Construir el árbol nuevo suele ser más caro que compararlo.
- Mantener dos árboles cuesta memoria y genera presión sobre el GC.
- Mueve el estado hacia abajo antes de recurrir a la memoización: elimina el trabajo en vez de cachearlo.
- Virtualiza las listas largas. Perfila antes de optimizar cualquier cosa.
