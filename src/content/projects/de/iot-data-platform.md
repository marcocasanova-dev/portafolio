---
title: IoT-Telemetrieplattform
description: Ersetzte 30-Sekunden-Polling durch Live-Telemetrie, der Bediener auf einer Baustelle vertrauen konnten – über Ingest, Storage und Dashboard hinweg.
order: 2
featured: true
year: 2024
role: Leitender Full-Stack-Engineer
client: Kewazo
technologies:
  - Svelte
  - Node.js
  - WebSockets
  - D3.js
  - Python
  - TimescaleDB
sectors:
  - IoT
  - Datenanalyse
logo: /logos/kewazo.webp
images:
  - kewazo_portafolio_1.png
  - kewazo_portafolio_2.png
  - kewazo_portafolio_3.png
  - kewazo_portafolio_4.png
  - kewazo_portafolio_5.png
highlights:
  - value: Gebündelt
    label: Ingest-Pipeline
    consequence: MQTT-Payloads wurden validiert und gebündelt geschrieben, statt Zeile für Zeile eingefügt zu werden.
  - value: Canvas
    label: Rendering-Pfad
    consequence: Schichtansichten blieben responsiv, weil der Browser eine Fläche statt tausender DOM-Knoten zeichnete.
  - value: Explizit
    label: Verbindungszustand
    consequence: Bediener sahen, wenn Daten veraltet waren, statt stillschweigend falsche Aktualität zu unterstellen.
outcome: Ersetzte 30-Sekunden-Refreshes durch Live-Telemetrie und einen sichtbaren Stale-State, sodass Bediener dem Dashboard vertrauen konnten statt zur Maschine zu laufen.
tradeoff: Behielt D3 für Skalen und Zeitachsen-Mathematik, verlagerte das Rendering aber von SVG auf Canvas, um 60fps auf leistungsschwachen Tablets zu halten.
status: Produktion
engagement:
  duration: 'Auslieferung 2024'
  teamSize: Engineering, Produkt und Betrieb
  scope: Ingest-Pipeline, WebSocket-Fan-out, Canvas-Dashboard und Stale-State-UX
decisionQuote:
  text: 'Bediener tolerieren ein Dashboard, das offen zeigt, wenn Daten verzögert sind. Sie verlieren jedoch das Vertrauen in ein System, das alte Werte als aktuell darstellt.'
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Robotische Gerüstaufzüge arbeiten auf aktiven Baustellen: verrauschte HF-Umgebungen, unterbrochenes LTE und Bediener, die mit Handschuhen bei direkter Sonneneinstrahlung auf ein Tablet schauen. Das bestehende Monitoring war ein Polling-Dashboard, das sich alle 30 Sekunden aktualisierte. Bis eine Störung auf dem Bildschirm auftauchte, war die Maschine oft längst stehen geblieben.

Der Auftrag war leicht formuliert und schwer umzusetzen: **Das Dashboard soll den Maschinenzustand schnell genug abbilden, dass ein Bediener ihm mehr vertraut als dem Gang zur Maschine.**

## Randbedingungen, die das Design geprägt haben

- **Unzuverlässige Uplinks.** LTE fällt auf einer Baustelle ständig aus. Das System musste sich elegant degradieren, statt mit einem Fehler auszusteigen.
- **Viele Writes, wenige Updates.** Telemetrie ist append-only und zeitlich geordnet. Zeilen werden nie bearbeitet.
- **Weite Zeiträume.** Bediener wollten sowohl „die letzten 60 Sekunden" als auch „die ganze Schicht" aus derselben UI.
- **Leistungsschwache Clients.** Baustellen-Tablets sind keine Workstations. Ein Dashboard, das die CPU auslastet, hätte den Akku vor der Mittagspause leergesaugt.

## Architektur

```
Sensoren (MQTT) → Python-Ingest-Workers → TimescaleDB-Hypertable
                                               │
                                      Node.js-Fan-out-Service
                                               │
                                     WebSocket ── Svelte-Client (D3)
```

**Ingest.** Python-Workers abonnieren MQTT-Topics pro Maschine, validieren die Payloads gegen ein Schema und fügen sie gebündelt in TimescaleDB ein. Batching war mit Abstand der größte Throughput-Gewinn: eine Zeile pro Nachricht einzufügen stieß früh an die Grenze; das Bündeln in einem 250ms-Fenster brachte den Ingest auf derselben Hardware eine Größenordnung weiter.

**Storage.** TimescaleDB-Hypertables partitionieren automatisch nach Zeit. Continuous Aggregates berechnen die 1-Minuten- und 1-Stunden-Rollups vor, sodass eine Query über „die letzten 8 Stunden" ein paar hundert voraggregierte Zeilen liest, statt Millionen von Rohzeilen zu scannen.

**Transport.** Ein Node.js-Service hält die WebSocket-Verbindungen und verteilt die Updates per Fan-out. Clients abonnieren eine Maschine, nicht alles. Das ist entscheidend, denn sämtliche Telemetrie an alle Clients zu broadcasten ist der Fehler, der solche Systeme beim Skalieren leise umbringt.

**Client.** Svelte kompiliert die Framework-Runtime weg, was auf leistungsschwachen Tablets zählte. D3 übernimmt Skalen und Achsen; gezeichnet wird tatsächlich auf Canvas, nicht in SVG. Das ist die Entscheidung, die ich am entschiedensten verteidigen würde.

## Warum Canvas statt SVG

Die erste Version hat die Charts als SVG gerendert. Das war sauber und inspizierbar, und brach bei rund 2.000 Punkten zusammen: Jeder Datenpunkt wurde zu einem DOM-Knoten, den der Browser in jedem Frame layouten und zeichnen musste.

Der Wechsel auf Canvas hat das Kostenmodell verändert. Der Browser zeichnet ein einziges Element, egal wie viele Punkte darin stecken. Rendering wurde eine Funktion von Pixeln, nicht von Datenvolumen, und hielt 60fps über die komplette Schichtansicht durch. D3 blieb im Stack für das, worin es wirklich am besten ist (Skalen, Ticks und die Mathematik der Zeitachsen), und gab dafür seine DOM-Binding-Schicht auf.

## Umgang mit Verbindungsverlust

Statt einer Reconnect-Schleife, die so tut, als wäre nichts passiert, verfolgt der Client den Verbindungszustand explizit und zeigt ihn an. Beim Reconnect fordert er ein Delta ab seinem zuletzt empfangenen Timestamp an statt eines vollständigen Refetch, sodass die Erholung von 40 Sekunden im Tunnel eine kleine Payload kostet statt der gesamten Schichthistorie.

Der sichtbare Zustand „veraltete Daten" stellte sich als wichtiger heraus als die Reconnect-Logik selbst. Bediener tolerieren ein Dashboard, das zugibt, hinterherzuhinken. Sie hören auf, einem zu vertrauen, das stillschweigend alte Zahlen zeigt, als wären sie aktuell.

## Was ich anders machen würde

Die Refresh-Policy der Continuous Aggregates wurde von Hand getunt, und sie driftete mit wachsendem Datenvolumen. Ich würde den Refresh-Lag ab Tag eins zu einer überwachten Metrik machen, statt ihn erst zu entdecken, wenn ein Chart subtil falsch aussieht.
