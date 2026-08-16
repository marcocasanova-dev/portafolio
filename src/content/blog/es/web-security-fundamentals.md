---
title: Fundamentos de seguridad web que no puedes agregar después
description: Las clases de vulnerabilidad que realmente causan brechas, por qué sobreviven al code review y las defensas estructurales que hacen difícil volver a introducirlas.
pubDate: 2025-11-08
readTime: 6
tags:
  - Seguridad
  - Backend
  - Buenas Prácticas
draft: false
---

El desarrollo web no se trata solo de interfaces y APIs, también se trata de defenderlas. La seguridad no es una funcionalidad que agregas en un sprint de hardening; es una propiedad de cómo está construido el sistema. Las vulnerabilidades que causan brechas reales rara vez son exóticas. Son el mismo puñado de clases de siempre, reintroducidas por código ordinario escrito contra una fecha de entrega.

## Las amenazas que realmente importan

**Cross-Site Scripting (XSS).** Script controlado por el atacante ejecutándose en los navegadores de tus usuarios, con acceso total a su sesión. Sigue siendo la falla grave más común del lado del cliente.

**Inyección SQL.** Entrada no confiable que cambia la estructura de una consulta en vez de ser tratada como dato. Tiene décadas y se sigue enviando a producción.

**Cross-Site Request Forgery (CSRF).** El navegador de un usuario haciendo una request autenticada que esa persona no pretendía, usando cookies que adjunta automáticamente.

**Control de acceso roto.** El más subestimado del grupo. La autenticación responde *quién eres*; la autorización responde *si puedes tocar este registro en particular*. Los sistemas que aciertan en lo primero y fallan en lo segundo filtran datos a usuarios legítimamente logueados.

**Mala configuración de seguridad.** Credenciales por defecto, stack traces verbosos en producción, CORS permisivo, un panel de administración alcanzable desde internet.

## Defensas que sobreviven al contacto con un equipo real

Consejos como "valida tu entrada" son correctos y casi inútiles, porque todo el mundo ya tiene esa intención. Lo que importa es hacer que la versión insegura sea *difícil de escribir*.

### Haz que la inyección sea irrepresentable

No sanitices SQL. Usa consultas parametrizadas, en todos lados, sin excepción:

```js
// Vulnerable, la entrada pasa a formar parte de la estructura de la consulta
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Seguro, la entrada solo puede ser un valor
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

La razón para prohibir de plano el SQL armado con strings en lugar de decir "ten cuidado" es que el cuidado no sobrevive a una fecha límite. Una regla de lint que rechaza template literals dentro de llamadas a query vale más que un párrafo en una guía de estilo.

### Escapa por defecto en la salida

Los frameworks modernos escapan los valores interpolados automáticamente. Las vulnerabilidades aparecen donde te sales de eso: `dangerouslySetInnerHTML`, `v-html`, `innerHTML`. Trata cada uno como algo que requiere justificación, y sanitiza con una librería mantenida como DOMPurify en vez de con una regex.

### Agrega una Content Security Policy

La CSP es la red de seguridad para el XSS que no atrapaste. Una política estricta significa que el script inyectado no se ejecuta aunque llegue a la página:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; object-src 'none'; base-uri 'none'
```

Empieza en modo report-only, junta las violaciones y después aplícala. Desplegar una CSP estricta a ciegas te va a romper el sitio.

### Aplica la autorización en la capa de datos

Las verificaciones de permisos a nivel de ruta fallan siempre de la misma forma: alguien agrega un endpoint y se olvida del decorador. Nada da error, simplemente la verificación no está.

Empujar la autorización a la capa de consultas invierte el modo de falla. Si el scope de acceso lo aplica la sesión que emite las consultas, una verificación olvidada devuelve *nada* en vez de *todo*. Falla cerrado, por estructura.

### Guarda las credenciales correctamente

Hashea las contraseñas con bcrypt, scrypt o Argon2, algoritmos diseñados deliberadamente para ser lentos. Nunca SHA-256, que es rápido y por lo tanto excelente para los atacantes. Nunca en texto plano, nunca con cifrado reversible.

### Configura los headers

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-Frame-Options: DENY
```

Las cookies que llevan sesiones necesitan `HttpOnly`, `Secure` y `SameSite=Lax` o más estricto: `SameSite` por sí sola elimina la mayor parte de la exposición a CSRF.

### Mantén las dependencias al día

La mayor parte del código en producción es código que no escribiste. `npm audit`, Dependabot, Snyk u OWASP Dependency-Check deberían correr en CI, y actualizar debería ser rutina y no un evento. La distancia entre la divulgación y la explotación de un paquete popular se mide en días.

## Hazlo estructural

La seguridad que depende de que todos se acuerden se degrada con cada nueva contratación. La seguridad que hacen cumplir el sistema de tipos, el query builder, la configuración del linter y CI sigue funcionando.

Métela en el pipeline: escaneo de dependencias, detección de secretos en los commits, SAST en los pull requests y tests que verifiquen que los fallos de autorización devuelven resultados vacíos y no completos.

## Herramientas que vale la pena conocer

- [OWASP](https://owasp.org), el Top 10 y la Cheat Sheet Series
- Mozilla Observatory, califica tus headers en segundos
- Lighthouse, incluye chequeos básicos de seguridad junto con los de rendimiento

## TL;DR

- Parametriza cada consulta. Prohíbe el SQL armado con strings mediante una regla de lint.
- Escapa en la salida; trata las APIs de HTML crudo como algo que requiere justificación.
- Despliega una CSP estricta como red de seguridad contra XSS, primero en report-only.
- Aplica la autorización en la capa de datos para que los errores fallen cerrado.
- Hashea con bcrypt/scrypt/Argon2. Configura los headers de seguridad. Parcha las dependencias en CI.
