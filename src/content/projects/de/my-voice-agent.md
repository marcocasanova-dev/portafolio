---
title: My Voice Agent
description: Eine KI-Telefonleitung, die eine Twilio-Nummer annimmt, um Einwilligung bittet, die Nachricht des Anrufers aufnimmt und per SMS an die Familie weiterleitet, mit Datenschutz und Observability von Anfang an.
order: 1
featured: true
year: 2026
role: Software Engineer
client: Stratos One
technologies:
  - TypeScript
  - Fastify
  - Python
  - FastAPI
  - PostgreSQL
  - Twilio
  - Claude API
  - Docker
  - OpenTelemetry
  - Prometheus
sectors:
  - KI & Sprache
logo: /favicon.svg
images: []
highlights:
  - value: '0'
    label: Gespeichertes Audio
    consequence: Twilio übernimmt Speech-to-Text und Text-to-Speech, die Dienste tauschen also nur Text aus.
  - value: 30 Tage
    label: Automatischer Ablauf
    consequence: Jeder Anruf hat ein Ablaufdatum, und ein Job löscht abgelaufene Daten alle sechs Stunden.
  - value: 1 Trace
    label: Pro Anruf
    consequence: Ein einziger OpenTelemetry-Trace folgt dem Anruf vom TypeScript-Gateway über SQL bis in den Python-Dienst.
outcome: Verpasste Anrufe und lose Notizen durch eine automatische Leitung ersetzt, die festhält, wer angerufen hat und warum, und die Nachricht per SMS an die Familie sendet, dringende Anrufe markiert.
tradeoff: Twilio übernimmt Speech-to-Text und Text-to-Speech, statt Roh-Audio zu streamen; dafür etwas langsamere Gesprächsrunden, aber kein gespeichertes oder verarbeitetes Audio.
status: Produktiv
engagement:
  duration: '2026'
  teamSize: Allein
  scope: Twilio-Webhooks und TwiML, Anruf-Zustandsautomat in TypeScript/Fastify, Antwortdienst in Python/FastAPI mit LLM- und Regelmodus, PostgreSQL-Schema, DSGVO-Endpunkte, Observability und Deployment mit Docker Compose
  relationship: independent
verificationStatus: verified
github: null
liveDemo: null
video: null
draft: false
---

## Das Problem

Jemand ruft ein Familienmitglied an, das nicht abnehmen kann. Eine Mailbox ist leicht zu ignorieren und leicht zu verlieren, und nichts sagt der Familie, ob der Anruf Routine oder dringend war. Ich wollte eine Leitung, die sich wie ein Mensch meldet: Sie sagt, wer sie ist, fragt, was der Anrufer ausrichten möchte, und sorgt dafür, dass die richtigen Personen davon erfahren.

## Wie ein Anruf abläuft

Der Anrufer wählt die Twilio-Nummer, und ein TypeScript/Fastify-Gateway antwortet mit TwiML. Es weist darauf hin, dass die Leitung automatisiert ist, und holt eine ausdrückliche Einwilligung ein, bevor etwas gespeichert wird. Danach transkribiert Twilio jeden Satz und schickt ihn an einen Python/FastAPI-Dienst, der die nächste Antwort wählt und Name, Nachricht und Dringlichkeit extrahiert. Am Ende des Anrufs sendet das Gateway die Nachricht per Twilio-SMS an die Familie, bei Dringlichkeit mit dem Präfix `URGENT`.

## Entscheidungen, auf die es ankam

- **Nur Text.** Twilio übernimmt Speech-to-Text und Text-to-Speech, daher erreicht kein Audio meinen Code oder meine Datenbank. Das ist das einfachste Design mit der kleinsten Datenschutzfläche.
- **Das Modell kann die Leitung nicht lahmlegen.** Der Dienst ruft Claude oder eine beliebige OpenAI-kompatible API auf und liefert strukturiertes JSON. Bei jedem Modellfehler greift ein deterministischer, regelbasierter Ablauf, sodass der Anrufer nie Stille hört.
- **Datenschutz durch Technikgestaltung.** Telefonnummern werden als Hash mit Schlüssel gespeichert, Transkripte geschwärzt, bei verweigerter Einwilligung wird der Anruf sofort gelöscht, und Daten laufen nach 30 Tagen ab. Auskunfts- und Löschanfragen bedienen Admin-Endpunkte mit Audit-Log, und Twilio-Webhooks werden per Signatur geprüft.
- **Von Anfang an beobachtbar.** Ein OpenTelemetry-Trace pro Anruf durchquert TypeScript-, SQL- und Python-Schicht, und Prometheus misst Anrufergebnisse, Antwortzeit pro Runde, Dienstfehler und fehlgeschlagene SMS.

## Aktueller Stand

Das System ist produktiv und läuft mit Docker Compose hinter Caddy. Er nimmt echte Anrufe entgegen, durchschnittlich 6 bis 10 pro Tag. Das Repository enthält Unit-Tests für Gesprächslogik, Schwärzung, Hashing und Webhook-Signatur sowie einen Simulator, der normale, dringende und abgelehnte Anrufe ohne Telefon durchspielt.

## Dokumentierte Grenzen

Der Nachrichtentext wird ungeschwärzt gespeichert, weil die Weiterleitung der Zweck des Produkts ist, läuft aber wie alles andere ab. Vor breiterer Nutzung braucht es unterzeichnete Auftragsverarbeitungsverträge mit Twilio und dem Modellanbieter, eine Datenschutz-Folgenabschätzung und den Admin-Zugang hinter SSO oder VPN.
