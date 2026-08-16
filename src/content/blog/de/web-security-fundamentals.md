---
title: Web-Security-Grundlagen, die sich nicht nachträglich anschrauben lassen
description: Die Schwachstellenklassen, die tatsächlich zu Breaches führen, warum sie das Code-Review überleben und welche strukturellen Verteidigungen sie schwer wieder einführbar machen.
pubDate: 2025-11-08
readTime: 6
tags:
  - Sicherheit
  - Backend
  - Best Practices
draft: false
---

Webentwicklung dreht sich nicht nur um Oberflächen und APIs, sie dreht sich auch darum, sie zu verteidigen. Sicherheit ist kein Feature, das du in einem Hardening-Sprint hinzufügst; sie ist eine Eigenschaft davon, wie das System gebaut ist. Die Schwachstellen, die echte Breaches verursachen, sind selten exotisch. Es sind dieselben paar Klassen, wieder eingeschleppt durch gewöhnlichen Code, der unter Termindruck geschrieben wurde.

## Die Bedrohungen, auf die es wirklich ankommt

**Cross-Site Scripting (XSS).** Vom Angreifer kontrollierter Code, der in den Browsern deiner Nutzenden läuft, mit vollem Zugriff auf deren Session. Immer noch der häufigste ernste clientseitige Fehler.

**SQL-Injection.** Nicht vertrauenswürdige Eingaben, die die Struktur einer Query verändern, statt als Daten behandelt zu werden. Jahrzehnte alt und immer noch im Auslieferungszustand.

**Cross-Site Request Forgery (CSRF).** Der Browser einer Person setzt einen authentifizierten Request ab, den sie nicht beabsichtigt hat, mithilfe von Cookies, die er automatisch anhängt.

**Fehlerhafte Zugriffskontrolle.** Die am meisten unterschätzte der Gruppe. Authentifizierung beantwortet *wer bist du*; Autorisierung beantwortet *darfst du genau diesen Datensatz anfassen*. Systeme, die das Erste richtig und das Zweite falsch machen, leaken Daten an legitim eingeloggte Nutzende.

**Sicherheits-Fehlkonfiguration.** Standard-Zugangsdaten, ausführliche Stacktraces in Produktion, permissives CORS, ein Admin-Panel, das aus dem Internet erreichbar ist.

## Verteidigungen, die den Kontakt mit einem echten Team überleben

Ratschläge wie „validiere deine Eingaben" sind korrekt und nahezu nutzlos, weil das ohnehin alle vorhaben. Worauf es ankommt, ist, die unsichere Variante *schwer schreibbar* zu machen.

### Injection undarstellbar machen

Sanitize kein SQL. Nutze parametrisierte Queries, überall, ausnahmslos:

```js
// Verwundbar, die Eingabe wird Teil der Query-Struktur
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Sicher, die Eingabe kann immer nur ein Wert sein
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

Der Grund, per String zusammengebautes SQL rundheraus zu verbieten statt zu „Vorsicht" zu mahnen, ist, dass Vorsicht keinen Abgabetermin überlebt. Eine Lint-Regel, die Template Literals in Query-Aufrufen ablehnt, ist mehr wert als ein Absatz im Styleguide.

### Beim Output standardmäßig escapen

Moderne Frameworks escapen interpolierte Werte automatisch. Die Schwachstellen entstehen dort, wo du dich davon abmeldest: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`. Behandle jede einzelne Stelle als begründungspflichtig und sanitize mit einer gepflegten Bibliothek wie DOMPurify statt mit einer Regex.

### Eine Content Security Policy ergänzen

CSP ist das Auffangnetz für das XSS, das du nicht erwischt hast. Eine strikte Policy sorgt dafür, dass eingeschleuster Code nicht ausgeführt wird, selbst wenn er die Seite erreicht:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; object-src 'none'; base-uri 'none'
```

Starte im Report-Only-Modus, sammle Verstöße, erzwinge dann. Eine strikte CSP blind auszurollen zerlegt deine Seite.

### Autorisierung in der Datenschicht durchsetzen

Berechtigungsprüfungen auf Route-Ebene scheitern jedes Mal auf dieselbe Weise: Jemand fügt einen Endpunkt hinzu und vergisst den Decorator. Nichts wirft einen Fehler, die Prüfung ist einfach nicht da.

Die Autorisierung in die Query-Schicht zu schieben dreht den Fehlermodus um. Wenn das Zugriffs-Scoping von der Session angewandt wird, die die Queries absetzt, liefert eine vergessene Prüfung *nichts* statt *alles*. Strukturell nach dem Prinzip Fail Closed.

### Zugangsdaten korrekt speichern

Hashe Passwörter mit bcrypt, scrypt oder Argon2, Algorithmen, die bewusst langsam entworfen wurden. Niemals SHA-256, das schnell und damit hervorragend für Angreifer ist. Niemals Klartext, niemals umkehrbare Verschlüsselung.

### Die Header setzen

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
```

Cookies, die Sessions transportieren, brauchen `HttpOnly`, `Secure` und `SameSite=Lax` oder strenger, `SameSite` allein beseitigt den größten Teil der CSRF-Angriffsfläche.

### Abhängigkeiten aktuell halten

Der meiste Produktionscode ist Code, den du nicht geschrieben hast. `npm audit`, Dependabot, Snyk oder OWASP Dependency-Check sollten in der CI laufen, und Aktualisieren sollte Routine sein statt ein Ereignis. Der Abstand zwischen der Veröffentlichung einer Lücke in einem populären Paket und ihrer Ausnutzung wird in Tagen gemessen.

## Mach es strukturell

Sicherheit, die davon abhängt, dass alle daran denken, verfällt mit jeder neuen Einstellung. Sicherheit, die vom Typsystem, vom Query Builder, von der Lint-Konfiguration und von der CI durchgesetzt wird, funktioniert weiter.

Pack es in die Pipeline: Dependency-Scanning, Secret-Erkennung auf Commits, SAST auf Pull Requests und Tests, die sicherstellen, dass Autorisierungsfehler leere statt vollständige Ergebnisse zurückgeben.

## Werkzeuge, die man kennen sollte

- [OWASP](https://owasp.org), die Top 10 und die Cheat Sheet Series
- Mozilla Observatory, bewertet deine Header in Sekunden
- Lighthouse, enthält neben Performance auch grundlegende Sicherheitsprüfungen

## TL;DR

- Parametrisiere jede Query. Verbiete per String gebautes SQL mit einer Lint-Regel.
- Escape beim Output; behandle Raw-HTML-APIs als begründungspflichtig.
- Rolle eine strikte CSP als XSS-Auffangnetz aus, zuerst Report-Only.
- Setze Autorisierung in der Datenschicht durch, damit Fehler nach dem Prinzip Fail Closed enden.
- Hashe mit bcrypt/scrypt/Argon2. Setze Security-Header. Patche Abhängigkeiten in der CI.
