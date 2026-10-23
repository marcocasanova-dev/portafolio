---
title: NIGHTOWL
description: Entwickelte eine produktive Ticketing- und Event-Management-Plattform mit Rails, React und Flutter - von Organizer-Dashboards und Ticketshops bis zum mobilen Einlass.
order: 3
featured: false
year: 2025
role: Full-Stack-Engineer
client: NIGHTOWL
technologies:
  - Ruby on Rails
  - React
  - Flutter
sectors:
  - Events & Plattformen
logo: /logos/nightowl.svg
cover: cover-nightowl.webp
images:
  - nightowl-og.png
highlights:
  - value: Zentral
    label: Ticketing-Regeln
    consequence: Preisphasen, Rabatte und Scanner-Validierung folgten demselben Backend-Modell.
  - value: Web + Mobile
    label: Produktflaechen
    consequence: Veranstalter arbeiteten in React, waehrend das Einlass-Team in Flutter scannte.
  - value: Produktion
    label: Event-Betrieb
    consequence: Die Plattform lief mit echten Ticketverkaeufen und echtem Einlass statt nur als internes Demo-System.
outcome: Lieferte eine produktive Event-Plattform, in der Veranstalter Ticketshops veroeffentlichen, Verkaeufe verfolgen und den Einlass ueber dasselbe System auf Web und Mobile abwickeln konnten.
tradeoff: Behielt Ticketphasen, Einlass-Validierung und Organizer-Zustand in Rails-Domainmodellen und APIs, statt dieselben Geschaeftsregeln getrennt in React- und Flutter-Clients zu duplizieren.
status: Produktion
engagement:
  duration: 'Auslieferung 2025'
  teamSize: Produkt- und Engineering-Team
  scope: Rails-Ticketing-Domaene, React-Flaechen fuer Veranstalter, Flutter-Scanner-App und uebergreifende Geschaeftsregeln
decisionQuote:
  text: 'Ticketphasen, Scanner-Validierung und Auszahlungen sind keine drei Features; sie sind ein einziges Inventarsystem aus drei verschiedenen Perspektiven.'
github: null
liveDemo: https://nightowl.app/
video: null
verificationStatus: partial
draft: false
---

## Das Problem

NIGHTOWL sitzt in genau dem Teil von Software, der auf der Landingpage simpel wirkt und in dem Moment komplex wird, in dem Geld und Tueren ins Spiel kommen. Veranstalter muessen schnell Events anlegen, Ticketshops veroeffentlichen, Rabatte verwalten, Verkaeufe verfolgen und trotzdem Menschen am Einlass abfertigen koennen, ohne dass die mobile App dem Web-Produkt widerspricht.

Die eigentliche Schwierigkeit war nicht ein einzelnes Dashboard oder einen einzelnen Scanner-Screen zu bauen. Die Schwierigkeit war, dieselben Ticketing-Regeln ueber das Rails-Backend, die React-Flaechen und die Flutter-Einlass-App konsistent zu halten.

## Randbedingungen, die das Design gepraegt haben

- **Ticket-Zustand ist gemeinsam.** Eine Preisphasen-Aenderung, eine Rabattregel oder eine Rueckerstattung darf im Dashboard nicht etwas anderes bedeuten als am Einlass.
- **Einlass ist Betriebsoftware.** Wenn der Scanner langsam oder unklar ist, zeigt sich das nicht als QA-Bug, sondern als Schlange echter Menschen.
- **Veranstalter brauchen eine Quelle der Wahrheit.** Verkaeufe, Gaestelistenlogik, Auszahlungen und Einlassstatus muessen ohne Tabellenkalkulations-Aufraeumen nach dem Event zusammenpassen.
- **Web und Mobile entwickeln sich unterschiedlich schnell.** Das Backend-Modell muss Produktwachstum auffangen, ohne dass React- und Flutter-Clients jeweils ihre eigene Version der Business-Logik neu erfinden.

## Ein Inventarsystem, drei Oberflaechen

Die wichtigste Architekturentscheidung war, Ticketing als eine Domäne zu behandeln und nicht als Sammlung lose verbundener Apps.

Ticketphasen, Scanner-Validierung und Auszahlungen sind keine drei Features; sie sind ein einziges Inventarsystem aus drei verschiedenen Perspektiven.

Darum war die Rails-Schicht der wichtigste Teil. Dort lagen die Zustandsuebergaenge und Validierungsregeln, auf die beide Clients angewiesen waren, waehrend React die Organizer-Flaechen und Flutter die Einlassablaeufe abbildete. Sobald diese Regeln zentral leben, koennen sich Web- und Mobile-Apps auf Klarheit, Geschwindigkeit und Recovery-Zustaende konzentrieren, statt jeweils ihre eigene Interpretation eines gueltigen Tickets mitzutragen.

## Warum Flutter fuer den Einlass sinnvoll war

Das oeffentliche Produktversprechen enthaelt eine Scanner-App fuer iOS und Android - und das veraendert das Engineering-Problem. Einlasssoftware lebt in Situationen mit wenig Aufmerksamkeit und hohem Druck: wenig Licht, volle Tueren, instabile Venue-Konnektivitaet und Teams, die sofort eine Ja-oder-Nein-Antwort brauchen.

Flutter war dort die richtige Wahl. Eine gemeinsame Codebasis hielt die Validierungs-UX auf beiden Plattformen aligned, waehrend das Backend fuer die Regeln verantwortlich blieb, die tatsaechlich ueber ein gueltiges Ticket entscheiden. Diese Aufteilung hielt die mobile App schnell, ohne sie zu einer zweiten Quelle der Wahrheit zu machen.

## React dort, wo Veranstalter arbeiten

React war die passende Wahl fuer die Oberflaechen, die sich haeufig aendern: Event-Setup, Ticketshop-Flows, Sales-Insights und die Steuerelemente, die Veranstalter vor und waehrend eines Events brauchen. Diese Screens profitieren von schneller Iteration und sauberem State-Handling, bleiben aber nur dann vertrauenswuerdig, wenn das Backend die eigentlichen Business-Regeln entscheidet.

Genau diese Backend-zuerst-Grenze hielt das Produkt zusammen. Dashboard, oeffentlicher Shop und Scanner-App waren unterschiedliche Erlebnisse, mussten aber denselben Event-Zustand beschreiben.

## Was ich anders machen wuerde

Ich wuerde frueher in Szenario-Tests an der Grenze zwischen Verkauf und Einlass investieren: erstattete Tickets, Preisphasen-Wechsel kurz vor Einlassbeginn und spaete Organizer-Aenderungen, waehrend bereits gescannt wird. Genau in diesen Faellen gewinnt oder verliert eine Ticketing-Plattform am schnellsten Vertrauen.
