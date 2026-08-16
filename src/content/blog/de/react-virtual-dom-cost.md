---
title: Wo React-Rendering wirklich Zeit kostet, und wann Optimierung sinnvoll ist
description: Ein praktischer Blick darauf, wo React Zeit verbringt, warum Re-Renders teuer werden und wann sich Optimierung wirklich lohnt.
pubDate: 2026-04-12
readTime: 6
image: /images/slow.png
tags:
  - React
  - Performance
  - Frontend
draft: false
---

In der Welt der Frontend-Frameworks sticht React durch sein deklaratives Komponentenmodell und den cleveren Einsatz des **Virtual DOM** hervor. Doch mit wachsenden Anwendungen taucht in fast jedem Team dieselbe Frage auf:

> „Warum wird meine React-App mit der Zeit langsamer? Sollte das Virtual DOM nicht schnell sein?"

Das Virtual DOM war nie ein Performance-Feature. Es ist ein *Ergonomie*-Feature, das schnell genug ist, und diese Unterscheidung zu verstehen ist der Unterschied zwischen dem Beheben des Problems und dem gedankenlosen Verteilen von `useMemo` über die gesamte Codebase.

## Was das Virtual DOM tatsächlich ist

Das Virtual DOM ist eine Repräsentation des echten DOM im Speicher. Statt bei jeder State-Änderung direkt am Browser-DOM zu mutieren, baut React einen leichtgewichtigen Baum auf, ermittelt, was sich geändert hat, und wendet ein gebündeltes Set an Updates an.

```
Komponentenbaum
      │
      ▼
Virtual DOM  (Reacts diffbare Kopie)
      │
      ▼
Real DOM     (vom Browser gerendertes UI)
```

Das Versprechen: Gebündelte, minimale DOM-Mutationen schlagen naive Direktmanipulation. Das stimmt. Was dabei untergeht: Du bezahlst dieses Privileg mit CPU und Speicher.

## Wohin die Zeit tatsächlich geht

### Diffing ist bei großen Bäumen teuer

React vergleicht den vorherigen Baum mit dem neuen, um zu entscheiden, was committet wird. Bei kleinen Bäumen ist das vernachlässigbar. Bei großen, häufig aktualisierten Bäumen wird die Reconciliation wirklich CPU-gebunden, und sie läuft auf dem Main Thread, in Konkurrenz zu allem anderen, was der Browser erledigen muss.

### Das Rendering läuft *vor* dem Diff

Das ist der Teil, den die meisten übersehen. Bevor React überhaupt etwas diffen kann, muss es **den neuen Baum aufbauen**, indem es deine Komponentenfunktionen aufruft. Eine State-Änderung nahe der Wurzel eines nicht memoisierten Baums führt jede Komponente darunter erneut aus und allokiert einen komplett neuen Objektgraphen, um *dann erst* festzustellen, dass sich fast nichts geändert hat.

Der Diff ist nicht der teure Teil. Das Erzeugen dessen, was gediffed wird, ist es meistens.

### Hooks machen versehentliche Re-Renders leicht

Ein inline erzeugtes Objekt oder eine Arrow Function in den Props ist bei jedem Render eine neue Referenz, was die Memoisierung im Kind aushebelt. Ein `useEffect` mit einer instabilen Dependency feuert erneut. Einzeln sind das Kleinigkeiten, und gemeinsam sind sie der Weg, auf dem eine App langsam wird, ohne dass ein einzelner Commit schuld wäre.

### Batching gilt nicht überall

Automatisches Batching hat sich in React 18 deutlich verbessert, aber Updates, die außerhalb von Reacts Kontrollfluss entstehen, können weiterhin mehr Render-Durchläufe erzeugen, als du erwartest.

## Die Kosten zweier Bäume

Während der Reconciliation hält React **mindestens zwei** vollständige Bäume: den committeten und den Work-in-Progress-Baum.

| Phase | Arbeit | Kosten |
| --- | --- | --- |
| `render()` | Neuen Baum aus den Komponenten aufbauen | Hoch, CPU und Speicher |
| `diff()` | Vorher mit Nachher vergleichen | Mittel bis hoch, skaliert mit der Baumgröße |
| `commit()` | Änderungen auf das echte DOM anwenden | Meist gering |

Zwei Bäume bedeuten ungefähr den doppelten Speicherbedarf für deine Komponentenstruktur, dazu Allokations-Churn, der GC-Druck erzeugt, was sich als Ruckeln zeigt und nicht als schlechte Zahl in einem Profil.

## Was wirklich hilft

**Zuerst messen.** Nutze den React Profiler und finde heraus, welche Komponenten rendern und warum. Der Flaschenhals liegt selten dort, wo die Intuition ihn vermutet.

**Den Re-Render an der Quelle abschneiden.** Der wirkungsvollste Eingriff ist meist, State *nach unten* zu verschieben, damit weniger Komponenten darunter liegen:

```jsx
// Vorher: Tippen rendert das gesamte Dashboard neu
function Dashboard() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ExpensiveChart />   {/* rendert bei jedem Tastendruck neu */}
    </>
  );
}

// Nachher: der State lebt dort, wo er benutzt wird
function Dashboard() {
  return (
    <>
      <SearchPanel />      {/* besitzt seinen eigenen Query-State */}
      <ExpensiveChart />   {/* vom Tippen unberührt */}
    </>
  );
}
```

Keine Memoisierung nötig. Der Re-Render erreicht den teuren Teilbaum schlicht nie.

**Danach gezielt memoisieren.** `React.memo`, `useMemo` und `useCallback` sind gezielte Werkzeuge, keine Voreinstellung. Jedes hat Vergleichskosten und erzeugt Rauschen; überall angewandt können sie Dinge langsamer und den Code schwerer lesbar machen. (Wenn du den Compiler von React 19 nutzt, wird vieles davon für dich erledigt, was den Punkt untermauert, dass manuelle Memoisierung immer ein Workaround war.)

**Lange Listen virtualisieren.** 10.000 Zeilen zu rendern, wenn 20 sichtbar sind, ist der mit Abstand häufigste vermeidbare Fehler. `react-window` oder `@tanstack/virtual` behebt ihn vollständig.

## Frameworks, die diesen Trade-off umgehen

| Framework | Strategie | Konsequenz |
| --- | --- | --- |
| Svelte | Kompiliert das VDOM weg | Aktualisiert das DOM direkt |
| SolidJS | Feingranulare Reaktivität | Nur geänderte Nodes aktualisieren sich; Komponenten laufen einmal |
| Qwik | Resumability | Verzögert die Ausführung und vermeidet Hydration-Kosten |

Diese sind nicht per se *besser*, sie tauschen andere Dinge ein. Aber sie zeigen, dass das Virtual DOM eine Design-Entscheidung mit Alternativen ist und kein Naturgesetz.

## TL;DR

- React baut bei jedem Render einen Komponentenbaum neu auf und diffed ihn dann gegen den vorherigen.
- Den neuen Baum zu bauen ist meist teurer, als ihn zu diffen.
- Zwei Bäume zu halten kostet Speicher und erzeugt GC-Druck.
- Verschiebe State nach unten, bevor du zur Memoisierung greifst, das entfernt die Arbeit, statt sie zu cachen.
- Virtualisiere lange Listen. Profile, bevor du irgendetwas optimierst.
