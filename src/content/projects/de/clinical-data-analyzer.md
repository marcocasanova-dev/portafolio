---
title: Plattform für klinische Datenanalyse
description: Verwandelte tabellenbasierte klinische Analysen in einen reproduzierbaren Web-Workflow, der auditfähige Berichte in Minuten statt in einem Tag erzeugte.
order: 3
featured: true
year: 2024
role: Backend- & Data-Engineer
technologies:
  - Python
  - FastAPI
  - React
  - PostgreSQL
  - Celery
  - Docker
sectors:
  - Gesundheitswesen
  - KI & ML
logo: /logos/medtech.webp
images:
  - tecmed-1.png
  - tecmed-2.png
  - tecmed-3.png
  - tecmed-4.png
  - tecmed-5.png
highlights:
  - value: Unveränderlich
    label: Audit-Modell
    consequence: Jede Analyse speicherte Datensatzversion, Parameter und Pipeline-Version für spätere Reproduktion.
  - value: Worker-basiert
    label: Job-Ausführung
    consequence: Langlaufende Analysen blockierten nie den Request-Zyklus.
  - value: Allowlist
    label: Logging-Regel
    consequence: PHI blieb aus Logs heraus, weil nur freigegebene Felder geschrieben werden durften.
outcome: Ersetzte manuelle Tabellenanalyse durch reproduzierbare Pipelines und auditfähige Berichte, die Klinikerinnen und Kliniker später erneut erzeugen und verteidigen konnten.
tradeoff: Verlagerte Autorisierung in die Query-Schicht und langlaufende Analysen in Worker, statt Route-Guards und Request-Zeit-Ausführung zu vertrauen.
status: Produktion
engagement:
  duration: 'Auslieferung 2024'
  teamSize: Engineering und klinische Stakeholder
  scope: API-Validierung, Worker-Orchestrierung, Audit-Logging und Row-Level-Access-Controls
decisionQuote:
  text: 'Eine Regel, die nicht von der CI durchgesetzt wird, ist nur ein Vorschlag.'
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Klinisches Personal exportierte Patientendaten in Tabellen, führte die Analyse von Hand durch und kopierte die Ergebnisse in Berichtsvorlagen. Das funktionierte, war aber langsam, von Person zu Person unterschiedlich und — am schwersten wiegend — **nicht reproduzierbar**. Wurde ein Ergebnis Monate später angezweifelt, konnte niemand rekonstruieren, welche Daten und welche Parameter es genau erzeugt hatten.

Das Ziel war nicht in erster Linie, die Analyse schneller zu machen. Es war, jede veröffentlichte Zahl bis zu ihren Eingaben zurückverfolgbar zu machen.

## Randbedingungen, die das Design geprägt haben

Gesundheitsdaten verändern die Art, wie du baust. Die nicht verhandelbaren Punkte:

- **Patientendaten tauchen niemals in Logs auf.** Nicht in Fehlern, nicht in Traces, nicht in Debug-Ausgaben.
- **Jede Analyse muss reproduzierbar sein.** Zu einem Bericht musst du die exakten Eingaben und Parameter rekonstruieren können.
- **Langlaufende Jobs dürfen die API nicht blockieren.** Manche Pipelines laufen minutenlang.
- **Zugriffskontrolle greift pro Datensatz, nicht pro Endpunkt.** Authentifiziert zu sein heißt nicht, jede Patientin und jeden Patienten zu sehen.

## Architektur

```
React SPA ──► FastAPI (Auth, Validierung, Orchestrierung)
                 │
                 ├──► PostgreSQL (Datensätze + unveränderliches Audit-Log)
                 └──► Celery-Workers ──► Analyse-Pipelines ──► PDF-Berichte
```

**API-Schicht.** FastAPI, gewählt wegen Pydantic. Schema-Validierung an der Grenze bedeutete, dass fehlerhafte klinische Daten mit einer präzisen Fehlermeldung abgelehnt wurden, bevor sie die Business-Logik berührten — und die generierte OpenAPI-Spezifikation wurde zum Vertrag, den das Frontend direkt konsumierte, was eine ganze Kategorie von Integrations-Drift beseitigte.

**Job-Ausführung.** Analysen laufen in Celery-Workers, nie im Request-Zyklus. Die API gibt sofort eine Job-ID zurück; der Client pollt oder abonniert den Status. Das ist unspektakulär und genau das, was die API unter Last responsiv hält.

**Reproduzierbarkeit.** Das ist der Kern des Systems. Jede Analyse schreibt einen unveränderlichen Datensatz, der die Version des Eingabedatensatzes, die Parameter, die Pipeline-Version und einen Content-Hash der Quelldaten festhält. Berichte referenzieren diesen Datensatz. Führt man eine gehashte Eingabe mit einer gepinnten Pipeline-Version erneut aus, entsteht exakt dieselbe Ausgabe.

## PHI aus den Logs heraushalten

Die über die Zeit am schwersten durchzuhaltende Anforderung ist eine negative: *Diese Daten dürfen nicht in die Observability sickern*. An Tag eins ist das leicht, an Tag neunzig verletzt man es leicht aus Versehen, weil der natürliche Debugging-Instinkt lautet, die Payload zu loggen.

Zwei Dinge haben es dauerhaft gemacht:

1. **Ein Wrapper für strukturiertes Logging**, der nur eine explizite Allowlist von Feldern akzeptiert. Einen Rohdatensatz zu übergeben ist ein Typfehler, keine Überraschung zur Laufzeit.
2. **Ein Test, der die aufgezeichnete Log-Ausgabe nach PHI-artigen Mustern durchsucht** und den Build bei einem Treffer scheitern lässt. Er fängt das versehentliche `logger.debug(record)` ab, das ein Code-Review irgendwann übersieht.

Der zweite hat echte Fehler gefunden. Eine Regel, die nicht von der CI durchgesetzt wird, ist nur ein Vorschlag.

## Zugriffskontrolle auf Zeilenebene

Die Autorisierung sitzt in der Query-Schicht, nicht in der Route-Schicht. Jeder Datenzugriff läuft über eine gescopte Session, die das Zugriffsprädikat des Aufrufers anwendet — eine fehlende Berechtigungsprüfung liefert damit ein leeres Ergebnis statt eines Lecks. Guards auf Route-Ebene sind das Muster, das an dem Tag stillschweigend versagt, an dem jemand einen neuen Endpunkt hinzufügt und den Decorator vergisst.

## Ergebnis

Die Berichtserstellung ging von rund einem Tag Handarbeit auf ein paar Minuten Pipeline-Laufzeit zurück. Der dauerhafte Gewinn war aber der Audit-Trail: Wird ein Ergebnis angezweifelt, ist die Antwort ein Lookup statt eines Archäologieprojekts.

## Was ich anders machen würde

Ich würde die Analyse-Pipelines ab dem ersten Commit mit explizitem Semantic Versioning versionieren, statt es erst hinzuzufügen, als wir „gleiche Pipeline, Bug behoben" von „andere Pipeline" unterscheiden mussten. Versions-Semantik nachträglich auf bestehende Audit-Datensätze zu setzen war schmerzhafter, als es von Anfang an richtig zu machen.
