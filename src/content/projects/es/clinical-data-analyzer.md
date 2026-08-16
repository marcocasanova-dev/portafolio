---
title: Plataforma de análisis de datos clínicos
description: Transformó análisis clínicos basados en hojas de cálculo en un flujo web reproducible que generaba informes auditables en minutos en lugar de un día.
order: 3
featured: true
year: 2024
role: Ingeniero de Backend y Datos
technologies:
  - Python
  - FastAPI
  - React
  - PostgreSQL
  - Celery
  - Docker
sectors:
  - Salud
  - IA y ML
logo: /logos/medtech.webp
images:
  - tecmed-1.png
  - tecmed-2.png
  - tecmed-3.png
  - tecmed-4.png
  - tecmed-5.png
highlights:
  - value: Inmutable
    label: Modelo de auditoría
    consequence: Cada análisis almacenaba versión de dataset, parámetros y versión de pipeline para reproducirse después.
  - value: Workers
    label: Ejecución de jobs
    consequence: Los análisis largos nunca bloquearon el ciclo de request.
  - value: Allowlist
    label: Política de logging
    consequence: El PHI quedó fuera de los logs porque solo podían escribirse campos aprobados.
outcome: Sustituyó el análisis manual en hojas de cálculo por pipelines reproducibles e informes auditables que el equipo clínico podía regenerar y defender después.
tradeoff: Movió la autorización a la capa de consultas y los análisis largos a workers, en lugar de confiar en guards de rutas y ejecución durante el request.
status: Producción
engagement:
  duration: 'Entrega 2024'
  teamSize: Ingeniería y stakeholders clínicos
  scope: Validación de API, orquestación de workers, audit logging y controles de acceso a nivel de fila
decisionQuote:
  text: 'Una política que CI no hace cumplir es apenas una sugerencia.'
github: null
liveDemo: null
video: null
draft: false
---

## El problema

Los clínicos exportaban datos de pacientes a hojas de cálculo, corrían el análisis a mano y pegaban los resultados en plantillas de informe. Funcionaba, pero era lento, inconsistente entre personas y, lo más grave, **no era reproducible**. Cuando alguien cuestionaba un resultado meses después, nadie podía reconstruir exactamente qué datos y qué parámetros lo habían producido.

El objetivo no era principalmente hacer el análisis más rápido. Era hacer que cada número publicado fuera trazable hasta sus insumos.

## Restricciones que moldearon el diseño

Los datos de salud cambian la forma en que construyes. Lo innegociable:

- **Los datos de pacientes nunca aparecen en los logs.** Ni en errores, ni en trazas, ni en salida de debug.
- **Todo análisis debe ser reproducible.** Dado un informe, tienes que poder reconstruir los insumos y parámetros exactos.
- **Los jobs largos no pueden bloquear la API.** Algunos pipelines corren durante minutos.
- **El acceso es por registro, no por endpoint.** Estar autenticado no significa ver a todos los pacientes.

## Arquitectura

```
React SPA ──► FastAPI (auth, validación, orquestación)
                 │
                 ├──► PostgreSQL (registros + audit log inmutable)
                 └──► workers de Celery ──► pipelines de análisis ──► informes PDF
```

**Capa de API.** FastAPI, elegido por Pydantic. Validar el schema en el borde significaba que los datos clínicos malformados se rechazaban con un error preciso antes de tocar la lógica de negocio, y la spec de OpenAPI que genera se convirtió en el contrato que el frontend consumía directamente, lo que eliminó toda una categoría de desincronización en la integración.

**Ejecución de jobs.** El análisis corre en workers de Celery, nunca en el ciclo de request. La API devuelve un id de job de inmediato; el cliente hace polling o se suscribe para conocer el estado. Es poco glamoroso y es lo que mantiene a la API responsiva bajo carga.

**Reproducibilidad.** Este es el corazón del sistema. Cada análisis escribe un registro inmutable que captura la versión del dataset de entrada, los parámetros, la versión del pipeline y un hash del contenido de los datos fuente. Los informes referencian ese registro. Volver a correr una entrada hasheada con una versión fijada del pipeline reproduce la salida exactamente.

## Mantener el PHI fuera de los logs

El requisito más difícil de sostener en el tiempo es uno negativo: *estos datos no deben filtrarse a la observabilidad*. Es fácil el día uno y fácil de violar por accidente el día noventa, porque el instinto natural al depurar es loguear el payload.

Dos cosas lo hicieron durar:

1. **Un wrapper de logging estructurado** que solo acepta una allowlist explícita de campos. Pasar un registro crudo es un error de tipos, no una sorpresa en runtime.
2. **Un test que hace grep sobre la salida de logs capturada buscando patrones con forma de PHI** y rompe el build si encuentra alguno. Atrapa ese `logger.debug(record)` accidental que un code review tarde o temprano deja pasar.

El segundo ha atrapado errores reales. Una política que CI no hace cumplir es apenas una sugerencia.

## Control de acceso a nivel de fila

La autorización vive en la capa de consultas, no en la de rutas. Todo acceso a datos pasa por una sesión con scope que aplica el predicado de acceso de quien llama, así que una verificación de permisos faltante produce un resultado vacío en vez de una filtración. Los guards a nivel de ruta son el patrón que falla en silencio el día que alguien agrega un endpoint nuevo y se olvida del decorador.

## Resultado

La generación de informes pasó de aproximadamente un día de trabajo manual a un par de minutos de pipeline. Pero la victoria duradera fue el rastro de auditoría: cuando alguien cuestiona un resultado, la respuesta es una consulta y no un proyecto de arqueología.

## Qué haría diferente

Versionaría los pipelines de análisis con versionado semántico explícito desde el primer commit, en vez de agregarlo cuando necesitamos distinguir "mismo pipeline, bug corregido" de "pipeline distinto". Meter la semántica de versiones a la fuerza en registros de auditoría ya existentes dolió más que haberlo hecho bien desde el principio.
