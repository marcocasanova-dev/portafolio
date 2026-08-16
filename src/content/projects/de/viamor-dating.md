---
title: Viamor
description: Modellierte komplexe Beziehungsgraphen und Consent-Zustände für ein Produktionsprodukt rund um polyamore Beziehungen.
order: 4
featured: false
year: 2023
role: Full-Stack-Engineer
client: Viamor
technologies:
  - Flutter
  - Firebase
  - Ruby on Rails
  - Vue.js
  - PostgreSQL
sectors:
  - Social
  - Mobile
  - WebApp
logo: /logos/viamor.webp
images:
  - viamor_1.png
  - viamor_2.png
  - viamor_3.png
  - viamor_4.png
  - viamor_5.png
  - viamor_6.png
  - viamor_7.png
highlights:
  - value: 'n:m'
    label: Beziehungsmodell
    consequence: Verpartnerte Nutzende, Paare und überlappende Beziehungen passten in dieselbe Struktur.
  - value: Explizit
    label: Consent-Flow
    consequence: Ungültige Match-Zustände wurden undarstellbar, statt später “behandelt” zu werden.
  - value: Geteilt
    label: Mobiler Stack
    consequence: Eine Flutter-Codebase lieferte beide Plattformen aus, während die Backend-Regeln relational blieben.
outcome: Gab dem Produkt ein Datenmodell, das verpartnerte Nutzende, Gruppen-Consent und Matching-Regeln ohne Sonderfall-Stapel abbilden konnte.
tradeoff: Behandelte Beziehungen als eigenständige Entitäten und Consent als State Machine, statt beides in User-Flags zu kodieren.
status: Produktion
engagement:
  duration: 'Auslieferung 2023'
  teamSize: Produkt-Engineering-Team
  scope: Beziehungsdatenmodell, Consent-State-Machine, mobile Integrationen und Backend-Grenzen
decisionQuote:
  text: 'Mit Flags erreichst du Zustände, die niemand entworfen hat; eine Übergangstabelle lässt das nicht zu.'
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Jede gängige Dating-App kodiert dieselbe Annahme in ihrem Schema: Eine Nutzerin ist Single, sucht eine Person und wird durch einen Erfolg aus dem Pool entfernt. Für polyamore Nutzende ist dieses Modell nicht bloß unvollständig, es ist schlicht falsch. Es kann nicht ausdrücken „ich bin in einer Beziehung und mein Partner weiß, dass ich hier bin", es kann kein gemeinsam suchendes Paar abbilden, und es behandelt ein Match als Endzustand.

Die interessante Arbeit an diesem Projekt steckte fast vollständig im Datenmodell. Die UI war der einfache Teil.

## Beziehungen richtig modellieren

Die zentrale Entscheidung: **Beziehungen sind eigenständige Entitäten, kein Statusfeld an einer Nutzerin.**

```
User ──< RelationshipMembership >── Relationship
                                        │
                                   (Typ, Sichtbarkeit, Consent-Status)
```

Eine Nutzerin hat viele Memberships; eine Beziehung hat viele Mitglieder. Diese eine Indirektion macht die schwierigen Fälle ausdrückbar:

- Eine Person, die mit zwei Menschen liiert ist, die untereinander nicht liiert sind.
- Ein Paar, das als Einheit browst, wobei beide Mitglieder einem Match zustimmen müssen.
- Eine Beziehung, die für Matches sichtbar ist, aber nicht im öffentlichen Profil.
- Das Beenden einer Beziehung, ohne die anderen anzufassen.

Das 1:1-Schema kann nichts davon ohne einen Berg an Sonderfällen abbilden. Das n:m-Schema bekommt sie beinahe geschenkt, und jedes nachgelagerte Feature, Matching, Benachrichtigungen, Privatsphäre, liest aus derselben Struktur, statt sich eine eigene Vorstellung davon zu bauen, wer mit wem verbunden ist.

## Consent als State Machine, nicht als Boolean

Wenn an einem Match mehr als zwei Personen beteiligt sein können, reicht „haben beide nach rechts gewischt" nicht mehr. Consent wurde zu einer expliziten State Machine mit einem Pending-Zustand, der von jeder betroffenen Partei eine Handlung verlangt, bevor ein Match zustande kommt.

Es als State Machine statt als Satz boolescher Flags zu modellieren bedeutete, dass ungültige Kombinationen nicht darstellbar statt bloß unwahrscheinlich waren. Mit Flags erreichst du Zustände, die niemand entworfen hat; eine Übergangstabelle lässt das nicht zu.

## Warum Flutter, und wo es wehtat

Eine Codebase, zwei Plattformen, ein kleines Team, Flutter war die richtige Wahl, und ich würde sie wieder treffen. Wehgetan hat es genau dort, wo du es erwartest: bei plattformspezifischen Integrationen. Push-Benachrichtigungen, Deep Links und Permission-Flows brauchten auf beiden Seiten native Aufmerksamkeit. Die 90 % geteilter Code sind real; kalkuliere die 10 % ordentlich ein, die es nicht sind.

## Firebase und Rails zusammen

Eine ungewöhnliche Kombination, und eine bewusste. Firebase übernimmt Realtime-Chat und Push, Probleme, die es besser löst, als ich es würde. Rails besitzt den relationalen Kern: Nutzende, Beziehungen, Consent, Matching. Postgres erledigt die Graph-Queries, in denen Firestore wirklich schlecht ist.

Der Preis ist eine Sync-Grenze, und an Sync-Grenzen wohnen die Bugs. Die Regel, die es handhabbar hielt: **Postgres ist die Source of Truth für alles Relationale; Firebase ist die Source of Truth für die Zustellung von Nachrichten.** Jedes Feld, das beides brauchte, war ein Design-Geruch, den man auflöst, und keine Integration, die man schreibt.

## Was ich anders machen würde

Ich würde die Consent-State-Machine früher einführen. Sie startete als Booleans und wurde unter Druck refaktoriert, nachdem Gruppen-Matches ausgeliefert waren. Das Refactoring war richtig, aber es berührte Benachrichtigungslogik, Matching und den Mobile-Client gleichzeitig, all das wäre günstiger gewesen, hätte es die State Machine von Anfang an gegeben.
