---
title: Clinical Data Analysis Platform
description: Turned spreadsheet-based clinical analysis into a reproducible web workflow that generated audit-ready reports in minutes instead of a day.
order: 3
featured: true
year: 2024
role: Backend & Data Engineer
technologies:
  - Python
  - FastAPI
  - React
  - PostgreSQL
  - Celery
  - Docker
sectors:
  - Healthcare
  - AI & ML
logo: /logos/medtech.webp
images:
  - tecmed-1.png
  - tecmed-2.png
  - tecmed-3.png
  - tecmed-4.png
  - tecmed-5.png
highlights:
  - value: Immutable
    label: Audit model
    consequence: Each analysis stored dataset version, parameters, and pipeline version for later reproduction.
  - value: Worker-based
    label: Job execution
    consequence: Long-running analysis never blocked the request cycle.
  - value: Allowlisted
    label: Logging policy
    consequence: PHI stayed out of logs because only approved fields could be written.
outcome: Replaced manual spreadsheet analysis with reproducible pipelines and audit-ready reports that clinicians could regenerate and defend later.
tradeoff: Pushed authorization into the query layer and long-running analysis into workers instead of trusting route guards and request-time execution.
status: Production
engagement:
  duration: '2024 delivery'
  teamSize: Engineering and clinical stakeholders
  scope: API validation, worker orchestration, audit logging, and row-level access controls
decisionQuote:
  text: 'Policy that is not enforced by CI is a suggestion.'
github: null
liveDemo: null
video: null
draft: false
---

## The problem

Clinicians were exporting patient data to spreadsheets, running analysis by hand, and pasting results into report templates. It worked, but it was slow, inconsistent between people, and — most seriously — **not reproducible**. When a result was questioned months later, nobody could reconstruct exactly which data and which parameters produced it.

The goal was not primarily to make analysis faster. It was to make every published number traceable back to its inputs.

## Constraints that shaped the design

Healthcare data changes how you build. The non-negotiables:

- **Patient data never appears in logs.** Not in errors, not in traces, not in debug output.
- **Every analysis must be reproducible.** Given a report, you must be able to reconstruct the exact inputs and parameters.
- **Long-running jobs cannot block the API.** Some pipelines run for minutes.
- **Access is per-record, not per-endpoint.** Being authenticated does not mean seeing every patient.

## Architecture

```
React SPA ──► FastAPI (auth, validation, orchestration)
                 │
                 ├──► PostgreSQL (records + immutable audit log)
                 └──► Celery workers ──► analysis pipelines ──► PDF reports
```

**API layer.** FastAPI, chosen for Pydantic. Schema validation at the boundary meant malformed clinical data was rejected with a precise error before touching business logic — and the OpenAPI spec it generates became the contract the frontend consumed directly, which removed an entire category of integration drift.

**Job execution.** Analysis runs in Celery workers, never in the request cycle. The API returns a job id immediately; the client polls or subscribes for status. This is unglamorous and it is what keeps the API responsive under load.

**Reproducibility.** This is the core of the system. Every analysis writes an immutable record capturing the input dataset version, the parameters, the pipeline version, and a content hash of the source data. Reports reference that record. Re-running a hashed input with a pinned pipeline version reproduces the output exactly.

## Keeping PHI out of the logs

The hardest requirement to hold over time is a negative one: *this data must not leak into observability*. It is easy on day one and easy to violate accidentally on day ninety, because the natural debugging instinct is to log the payload.

Two things made it stick:

1. **A structured logging wrapper** that only accepts an explicit allowlist of fields. Passing a raw record is a type error, not a runtime surprise.
2. **A test that greps captured log output for PHI-shaped patterns** and fails the build on a hit. It catches the accidental `logger.debug(record)` that a code review will eventually miss.

The second one has caught real mistakes. Policy that is not enforced by CI is a suggestion.

## Row-level access control

Authorisation lives at the query layer, not the route layer. Every data access goes through a scoped session that applies the caller's access predicate, so a missing permission check produces an empty result rather than a leak. Route-level guards are the pattern that fails silently the day someone adds a new endpoint and forgets the decorator.

## Outcome

Report generation went from roughly a day of manual work to a couple of minutes of pipeline time. But the durable win was the audit trail: when a result is challenged, the answer is a lookup rather than an archaeology project.

## What I would do differently

I would version the analysis pipelines with explicit semantic versioning from the first commit rather than adding it once we needed to distinguish "same pipeline, fixed bug" from "different pipeline". Retrofitting version semantics onto existing audit records was more painful than getting it right initially.
