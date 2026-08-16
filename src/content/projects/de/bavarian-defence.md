---
title: Bavarian Defence
description: Ein Tower-Defence-Strategiespiel in Unity, und eine Übung darin, hunderte Entitäten in jedem Frame zu aktualisieren, ohne auf Mittelklasse-Hardware unter 60fps zu fallen.
order: 5
featured: false
year: 2023
role: Gameplay- & Systems-Programmierer
client: Independent
technologies:
  - Unity
  - C#
sectors:
  - Gaming
  - Unterhaltung
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
  - value: Gepoolt
    label: Objektlebenszyklus
    consequence: Gegner und Projektile wurden wiederverwendet, statt mitten in der Welle GC-Spitzen auszulösen.
  - value: Spatial Hash
    label: Zielsuche
    consequence: Türme prüften nur nahe Gegner, statt in jedem Frame die ganze Karte zu scannen.
  - value: Gepackte Loops
    label: Bewegungs-Update
    consequence: Heiße Bewegungsdaten blieben cache-freundlicher als verteilte `Update()`-Aufrufe pro Objekt.
outcome: Hielt die Simulation in späten Wellen flüssig, indem GC-Churn entfernt und die Arbeit in den heißesten Update-Pfaden begrenzt wurde.
tradeoff: Nutzte manuelle datenorientierte Loops und ein räumliches Hash-Gitter statt eines einfacheren Objekt-pro-`Update()`-Modells, weil stabile Framezeiten wichtiger waren als Editor-Komfort.
engagement:
  duration: 'Persönliches Projekt 2023'
  teamSize: Solo
  scope: Gameplay-Systeme, Hot-Path-Profiling, Pooling und räumliche Indizierung
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Tower Defence ist ein Genre, das an die Performance täuschend hohe Ansprüche stellt. Späte Wellen bringen hunderte Gegner auf den Bildschirm, jeder bewegt sich entlang eines Pfads, jeder ist ein Kandidat für dutzende Türme, jeder hat Lebensbalken und Statuseffekte. Naiv umgesetzt ist das ein O(Türme × Gegner)-Problem, das in jedem einzelnen Frame ausgewertet wird, und es bricht genau dann ein, wenn das Spiel am spannendsten ist.

Dieses Projekt war in der Praxis eine Performance-Engineering-Übung im Spielkostüm.

## Die Frametime-Spitzen abstellen

Der erste spielbare Build lief früh gut und ruckelte in späten Wellen stark. Der Unity-Profiler zeigte auf zwei Schuldige, und keiner davon war das Rendering.

### 1. Garbage Collection

Gegner wurden beim Spawn instanziiert und beim Tod zerstört. Bei ein paar Gegnern pro Sekunde ist das unsichtbar. Bei vierzig pro Sekunde löste der Allokations-Churn mitten in der Welle GC-Läufe aus, und jeder Lauf war ein sichtbarer Hänger im denkbar schlechtesten Moment.

Die Lösung ist Standard und lohnt es, sie sauber zu machen: **Object Pooling**. Gegner, Projektile und Schadenszahlen werden einmal beim Laden allokiert und wiederverwendet. Spawnen wird zum Entnehmen aus einer Free-List plus State-Reset; Sterben wird zum Zurückgeben in die Liste. Die Allokation im eingeschwungenen Zustand fällt auf null, und weil es nichts mehr einzusammeln gibt, hört der GC auf zu unterbrechen.

Die Feinheit ist der State-Reset. Ein gepooltes Objekt, das veralteten Zustand aus seinem vorherigen Leben mitschleppt, gehört zu den unangenehmeren Bug-Klassen in Spielen, weil es sich nur unter bestimmten Wiederverwendungsreihenfolgen reproduzieren lässt. Jeder gepoolte Typ setzt sich über ein einziges `Reset()` zurück, das der Pool aufruft, nicht über Ad-hoc-Feldzuweisungen an der Aufrufstelle.

### 2. Zielerfassung

Dass jeder Turm in jedem Frame jeden Gegner durchgeht, ist die naive O(n×m)-Schleife. Bei 40 Türmen und 500 Gegnern sind das 20.000 Distanzprüfungen pro Frame, und es ist reine Verschwendung, die meisten Gegner sind nirgends in der Nähe der meisten Türme.

Der Ersatz durch ein **räumliches Hash-Gitter** hat den Aufwand begrenzt. Die Welt wird in Zellen unterteilt, die so groß sind wie die größte Turmreichweite; ein Turm betrachtet nur Gegner in seiner eigenen Zelle und den direkten Nachbarzellen. Die Kosten pro Turm werden damit in etwa konstant bezüglich der Gesamtzahl der Gegner und stattdessen proportional zur lokalen Dichte.

Zwei Details waren wichtig:

- Gegner aktualisieren ihre Gitterzelle nur beim Überschreiten einer Grenze, nicht in jedem Frame.
- Distanzvergleiche verwenden die quadrierte Länge. Wurzeln in einer heißen Schleife sind vermeidbar; der Vergleich quadrierter Distanzen ergibt dieselbe Reihenfolge.

## Datenorientierte Bewegung

Die Gegnerbewegung wanderte aus den `Update()`-Aufrufen pro Objekt in ein einzelnes System, das über zusammenhängende Arrays von Positionen und Geschwindigkeiten iteriert. Hunderte einzelne `Update()`-Aufrufe pro Frame bringen echten Overhead mit, der Übergang zwischen managed und native ist nicht gratis, und verstreuter Objektspeicher heißt, dass die CPU ständig Cache-Misses produziert.

Eine Schleife über gepackte Arrays ist dramatisch cache-freundlicher. Das ist dieselbe Einsicht, die hinter Unitys DOTS steckt, hier von Hand angewandt in einem Maßstab, in dem das volle ECS überdimensioniert gewesen wäre.

## Was mir dieses Projekt beigebracht hat

Die Performance-Techniken hier sind nicht spielspezifisch. Poole teure Objekte, begrenze deinen Suchraum mit der richtigen Datenstruktur, halte heiße Daten zusammenhängend, und profile, bevor du optimierst. Ich habe seither alle vier auf Backend-Services angewandt, der Zwang eines 16ms-Frame-Budgets macht die Lektion nur unmöglich zu ignorieren.
