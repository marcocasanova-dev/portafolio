---
title: Mobile-Commerce-Plattform
description: Lieferte Warenkorb-, Checkout-, CMS- und Loyalty-Flows für eine Retail-App in Produktion, die Deutschland und Österreich bedient.
order: 1
featured: true
year: 2026
role: Senior Software Engineer
technologies:
  - React Native
  - Expo
  - TypeScript
  - Node.js
  - TanStack Query
  - CI/CD
sectors:
  - Commerce & Mobile
logo: /favicon.svg
images:
  - mobile-commerce-1.svg
  - mobile-commerce-2.svg
  - mobile-commerce-3.svg
highlights:
  - value: DE + AT
    label: Ausgelieferte Märkte
    consequence: Ein mobiles Produkt unterstützte Releases in Deutschland und Österreich.
  - value: '5'
    label: Gebaute Kernflüsse
    consequence: Customer-, Cart-, Checkout-, CMS- und Loyalty-Flows wurden in der App Ende-zu-Ende umgesetzt.
  - value: Produktion
    label: Retail-Anwendung
    consequence: Die Arbeit lief in einer Live-Umgebung statt auf einem Demo-Pfad.
outcome: Lieferte zentrale Mobile-Commerce-Journeys über deutsche und österreichische Märkte hinweg Ende zu Ende aus, von Customer-State und Cart-Logik bis zu Checkout, CMS und Loyalty.
tradeoff: Die Plattform hielt Business-Regeln in gemeinsamen APIs und in der Query-Orchestrierung, statt Marktlogik in der App zu duplizieren, was Releases sicherer und Verhalten besser nachvollziehbar machte.
status: Produktion
engagement:
  duration: '2026'
  teamSize: Cross-funktionales Retail-Produktteam
  scope: Customer-Flows, Cart, Checkout, CMS-Integration, Loyalty und Release-Support
decisionQuote:
  text: 'Wenn sich ein Warenkorb je Markt unterschiedlich verhält, gehört die Regel in die API und nicht in den Bildschirm, der sie zuerst braucht.'
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Das Produkt hatte bereits echte Kundschaft, mehrere Märkte und die üblichen
Retail-Druckpunkte: Warenkörbe mussten App-Neustarts überstehen, Checkout musste
konsistent funktionieren, CMS-gesteuerte Inhalte sollten sich ohne Client-Release
ändern können, und Loyalty-Regeln durften nicht zwischen Screens auseinanderlaufen.

Die Schwierigkeit lag nicht darin, einen Happy Path zu bauen. Die Schwierigkeit
lag darin, mehrere geschäftskritische Flows konsistent zu halten, während das
Produkt weiterlieferte.

## Randbedingungen, die das Design geprägt haben

- **Zwei aktive Märkte.** Deutschland und Österreich teilten das meiste
  Verhalten, aber nicht alles. Marktspezifische Logik musste sichtbar und
  testbar bleiben.
- **Mobiler State veraltet schnell.** Ein Warenkorb, der Preise, Bestand,
  CMS-Inhalte und Loyalty-Daten berührt, kann nicht davon ausgehen, dass das
  Gerät die letzte Wahrheit hält.
- **Checkout-Fehler sind Vertrauensfehler.** Recovery-Pfade sind genauso
  wichtig wie der nominelle Pfad, wenn Geld im Spiel ist.
- **Retail-Teams releasen kontinuierlich.** Inhalte, Kampagnen und Loyalty-
  Mechaniken ändern sich schneller als App-Releases.

## Was ich gebaut habe

Ich implementierte Customer-, Cart-, Checkout-, CMS- und Loyalty-Flows in der
React-Native-App und integrierte dabei mit dem gemeinsamen Node.js-Backend-
for-Frontend (BFF), das marktspezifische Regeln und die API-Verträge hielt,
auf die diese Flows angewiesen waren. Auf App-Seite gehörten dazu die
State-Architektur im Client und der Delivery-Pfad von Branch bis Release.

## Marktregeln aus dem Client heraushalten

Das architektonische Prinzip hinter der Plattform war, marktspezifische
Regeln in der gemeinsamen API-Schicht zu halten, statt sie in den Screen
einziehen zu lassen, der zuerst eine schnelle Bedingung brauchte.

Wenn sich ein Warenkorb je Markt unterschiedlich verhält, gehört die Regel in
die API und nicht in den Bildschirm, der sie zuerst braucht.

Die App entlang dieses Prinzips zu bauen hielt den React-Native-Code
fokussiert auf Orchestrierung, Caching und Recovery-Zustände, während
TanStack Query Fetch-Lifecycles und Invalidierung übernahm. Gleichzeitig
ließ sich Checkout-Verhalten zentral, vorgelagert, an einer Stelle ändern und
beobachten, statt über mehrere mobile Pfade hinweg
neuimplementiert zu werden.

## Was ausgeliefert wurde

Der ausgelieferte Umfang deckte Customer-State, Cart-Verhalten, Checkout,
CMS-gesteuerte Oberflächen und Loyalty-Journeys in einer Produktiv-App für die
deutschen und österreichischen Märkte ab. Das Ergebnis war eine sauberere
Trennung zwischen App- und Backend-Verantwortung, berechenbarere Releases und
eine mobile Codebase, die trotz wechselnder Business-Regeln verständlich blieb.

## Was ich heute anders machen würde

Ich würde das Modell für Marktvariationen noch früher dokumentieren. Die
technische Trennung war da, aber Produkt und QA früher dieselbe Sprache für
„gemeinsame Regel“ versus „Marktregel“ zu geben, hätte die Prüfung von
Randfällen beschleunigt.
