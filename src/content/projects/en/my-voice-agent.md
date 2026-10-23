---
title: My Voice Agent
description: An AI phone line that answers a Twilio number, asks for consent, takes a caller's message and texts it to family, with privacy and observability built in from the first call.
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
  - AI & Voice
logo: /favicon.svg
images: []
highlights:
  - value: '0'
    label: Audio stored
    consequence: Twilio handles speech-to-text and text-to-speech, so the services only ever exchange text.
  - value: 30 days
    label: Automatic expiry
    consequence: Every call carries an expiry date and a purge job deletes expired data every six hours.
  - value: 1 trace
    label: Per call
    consequence: A single OpenTelemetry trace follows a call from the TypeScript gateway through SQL into the Python service.
outcome: Replaced missed calls and scribbled notes with an automated line that records who called and why, and texts the message to the family, flagging urgent calls.
tradeoff: Let Twilio do speech-to-text and text-to-speech instead of streaming raw audio, accepting slower turn-taking in exchange for never storing or processing audio.
status: Deployed
engagement:
  duration: '2026'
  teamSize: Solo
  scope: Twilio webhooks and TwiML, TypeScript/Fastify call state machine, Python/FastAPI reply service with LLM and rule-based modes, PostgreSQL schema, GDPR endpoints, observability, and Docker Compose deployment
  relationship: independent
verificationStatus: verified
github: null
liveDemo: null
video: null
draft: false
---

## The problem

Someone phones a family member who cannot pick up. A voicemail is easy to ignore and easy to lose, and nothing tells the family whether the call was routine or urgent. I wanted a phone line that answers like a person would: it says who it is, asks what the caller wants to pass on, and makes sure the right people hear about it.

## How a call works

A caller dials the Twilio number and a TypeScript/Fastify gateway answers with TwiML. It discloses that the line is automated and asks for explicit consent before anything is stored. After consent, each sentence the caller speaks is transcribed by Twilio and sent to a Python/FastAPI service that chooses the next reply and extracts the caller's name, message and urgency. When the call ends, the gateway texts the message to the family through Twilio SMS, prefixed `URGENT` when flagged.

## Decisions that mattered

- **Text only.** Twilio does speech-to-text and text-to-speech, so no audio ever reaches my code or my database. It is the simplest design and the smallest privacy surface.
- **The model cannot take the line down.** The reply service calls Claude, or any OpenAI-compatible API, and returns structured JSON. On any model error it falls back to a deterministic rule-based flow, so the caller never hears silence.
- **Privacy by construction.** Phone numbers are stored as keyed hashes, transcripts are redacted, refusing consent deletes the call at once, and data expires after 30 days. Access and erasure requests are served by admin endpoints with an audit log, and Twilio webhooks are signature-verified.
- **Observable from day one.** One OpenTelemetry trace per call crosses the TypeScript, SQL and Python layers, and Prometheus tracks call outcomes, turn latency, brain errors and failed SMS alerts.

## Where it stands

The system is deployed and runs with Docker Compose behind Caddy. It handles real calls, on average 6 to 10 a day. The repository includes unit tests for the conversation logic, redaction, hashing and webhook signature checks, plus a simulator that replays normal, urgent and refused calls without a phone.

## Limits I documented

The relayed message body is stored unredacted because relaying it is the point of the product, though it expires with everything else. Before wider use it needs signed data-processing agreements with Twilio and the model provider, a data-protection impact assessment, and admin access behind SSO or a VPN.
