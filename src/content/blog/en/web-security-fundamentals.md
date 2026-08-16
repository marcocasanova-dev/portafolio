---
title: Web Security Fundamentals You Cannot Bolt On Later
description: The vulnerability classes that actually cause breaches, why they survive code review, and the structural defences that make them hard to reintroduce.
pubDate: 2025-11-08
readTime: 6
tags:
  - Security
  - Backend
  - Best Practices
draft: false
---

Web development is not only about interfaces and APIs, it is also about defending them. Security is not a feature you add in a hardening sprint; it is a property of how the system is built. The vulnerabilities that cause real breaches are rarely exotic. They are the same handful of classes, reintroduced by ordinary code written under deadline.

## The threats that actually matter

**Cross-Site Scripting (XSS).** Attacker-controlled script executing in your users' browsers, with full access to their session. Still the most common serious client-side flaw.

**SQL injection.** Untrusted input changing the structure of a query rather than being treated as data. Decades old and still shipping.

**Cross-Site Request Forgery (CSRF).** A user's browser making an authenticated request they did not intend, using cookies it attaches automatically.

**Broken access control.** The most under-rated of the set. Authentication answers *who are you*; authorisation answers *may you touch this specific record*. Systems that get the first right and the second wrong leak data to legitimately logged-in users.

**Security misconfiguration.** Default credentials, verbose stack traces in production, permissive CORS, an admin panel reachable from the internet.

## Defences that survive contact with a real team

Advice like "validate your input" is correct and nearly useless, because everyone already intends to. What matters is making the insecure version *hard to write*.

### Make injection unrepresentable

Do not sanitise SQL. Use parameterised queries, everywhere, without exception:

```js
// Vulnerable, input becomes part of the query structure
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Safe, input can only ever be a value
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

The reason to ban string-built SQL outright rather than "be careful" is that carefulness does not survive a deadline. A lint rule that rejects template literals in query calls is worth more than a paragraph in a style guide.

### Escape by default on output

Modern frameworks escape interpolated values automatically. The vulnerabilities appear where you opt out: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`. Treat every one as requiring justification, and sanitise with a maintained library like DOMPurify rather than a regex.

### Add a Content Security Policy

CSP is the backstop for the XSS you did not catch. A strict policy means injected script does not execute even if it reaches the page:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; object-src 'none'; base-uri 'none'
```

Start in report-only mode, collect violations, then enforce. Deploying a strict CSP blind will break your site.

### Enforce authorisation at the data layer

Route-level permission checks fail the same way every time: someone adds an endpoint and forgets the decorator. Nothing errors, the check simply is not there.

Pushing authorisation into the query layer inverts the failure mode. If access scoping is applied by the session that issues queries, a forgotten check returns *nothing* rather than *everything*. Fail closed, structurally.

### Store credentials correctly

Hash passwords with bcrypt, scrypt, or Argon2, algorithms deliberately designed to be slow. Never SHA-256, which is fast and therefore excellent for attackers. Never plaintext, never reversible encryption.

### Set the headers

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
```

Cookies carrying sessions need `HttpOnly`, `Secure`, and `SameSite=Lax` or stricter, `SameSite` alone removes most CSRF exposure.

### Keep dependencies current

Most production code is code you did not write. `npm audit`, Dependabot, Snyk, or OWASP Dependency-Check should run in CI, and updating should be routine rather than an event. The gap between disclosure and exploitation of a popular package is measured in days.

## Make it structural

Security that depends on everyone remembering degrades with every new hire. Security that is enforced by the type system, the query builder, the lint config, and CI keeps working.

Put it in the pipeline: dependency scanning, secret detection on commits, SAST on pull requests, and tests that assert authorisation failures return empty rather than full results.

## Tools worth knowing

- [OWASP](https://owasp.org), the Top 10 and the Cheat Sheet Series
- Mozilla Observatory, grades your headers in seconds
- Lighthouse, includes basic security checks alongside performance

## TL;DR

- Parameterise every query. Ban string-built SQL with a lint rule.
- Escape on output; treat raw-HTML APIs as requiring justification.
- Deploy a strict CSP as your XSS backstop, report-only first.
- Enforce authorisation at the data layer so mistakes fail closed.
- Hash with bcrypt/scrypt/Argon2. Set security headers. Patch dependencies in CI.
