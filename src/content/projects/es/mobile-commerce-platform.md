---
title: Plataforma de mobile commerce
description: Entregó flujos de carrito, checkout, CMS y loyalty para una app retail en producción que opera en Alemania y Austria.
order: 1
featured: true
year: 2026
role: Ingeniero de Software Senior
technologies:
  - React Native
  - Expo
  - TypeScript
  - Node.js
  - TanStack Query
  - CI/CD
sectors:
  - Comercio y Mobile
logo: /favicon.svg
images:
  - mobile-commerce-1.svg
  - mobile-commerce-2.svg
  - mobile-commerce-3.svg
highlights:
  - value: DE + AT
    label: Mercados entregados
    consequence: Un solo producto móvil soportó releases en Alemania y Austria.
  - value: '5'
    label: Recorridos clave construidos
    consequence: Customer, carrito, checkout, CMS y loyalty se implementaron en la app de punta a punta.
  - value: Producción
    label: Aplicación retail
    consequence: El trabajo salió en un entorno real y no en una ruta de demo.
outcome: Entregó recorridos clave de mobile commerce de punta a punta para los mercados alemán y austríaco, desde estado del cliente y lógica del carrito hasta checkout, CMS y loyalty.
tradeoff: La plataforma mantuvo las reglas de negocio en APIs compartidas y en la orquestación de queries, en lugar de duplicar lógica por mercado dentro de la app, lo que volvió más seguras las releases y más fácil de rastrear el comportamiento.
status: Producción
engagement:
  duration: '2026'
  teamSize: Equipo retail multifuncional
  scope: Flujos de customer, carrito, checkout, integración CMS, loyalty y soporte de releases
decisionQuote:
  text: 'Cuando un carrito se comporta distinto según el mercado, la regla debe vivir en la API y no en la pantalla que primero la necesite.'
github: null
liveDemo: null
video: null
draft: false
---

## El problema

El producto ya tenía clientes reales, varios mercados y los puntos de presión
habituales del retail: carritos que debían sobrevivir reinicios de la app,
checkout que debía comportarse de forma consistente, contenido gobernado por
CMS que cambiaba sin una release del cliente y reglas de loyalty que no podían
derivar entre pantallas.

La dificultad no era construir un único happy path. La dificultad era mantener
consistentes varios flujos críticos para el negocio mientras el producto seguía
entregando cambios.

## Restricciones que moldearon el diseño

- **Dos mercados activos.** Alemania y Austria compartían gran parte del
  comportamiento, pero no todo. La lógica específica por mercado tenía que
  quedar visible y ser comprobable.
- **El estado móvil envejece rápido.** Un carrito tocado por precios, stock,
  CMS y loyalty no puede asumir que el dispositivo tiene siempre la última
  verdad.
- **Un fallo en checkout es una pérdida de confianza.** Los caminos de
  recuperación importan tanto como el camino nominal cuando hay dinero de por
  medio.
- **Los equipos retail lanzan continuamente.** Contenido, campañas y mecánicas
  de loyalty cambian más rápido que las releases de la app.

## Qué construí

Implementé flujos de customer, carrito, checkout, CMS y loyalty en la app de
React Native, integrando con el backend-for-frontend (BFF) compartido en
Node.js que contenía las reglas específicas de mercado y los contratos de API
de los que dependían esos recorridos. Del lado de la app, eso incluyó la
arquitectura de estado en el cliente y la ruta de entrega que llevaba los
cambios desde la rama hasta la release.

## Mantener las reglas de mercado fuera del cliente

El principio arquitectónico detrás de la plataforma era mantener las reglas
específicas de cada mercado en la capa de APIs compartidas, en lugar de dejar
que se filtraran a la pantalla que primero necesitara un condicional rápido.

Cuando un carrito se comporta distinto según el mercado, la regla debe vivir en
la API y no en la pantalla que primero la necesite.

Construir la app siguiendo ese principio dejó al código de React Native
enfocado en orquestación, caché y estados de recuperación, mientras TanStack
Query se ocupaba del ciclo de vida de
las peticiones y de la invalidación. También permitió cambiar y observar el
comportamiento de checkout en un solo lugar, en vez de reimplementarlo a través
de múltiples caminos móviles.

## Qué se entregó

El alcance entregado cubrió estado de customer, comportamiento del carrito,
checkout, superficies gobernadas por CMS y recorridos de loyalty en una app
retail en producción usada en los mercados alemán y austríaco. El resultado fue
una separación más limpia entre responsabilidades de app y backend, releases
más predecibles y una codebase móvil que siguió siendo razonable de entender a
medida que cambiaban las reglas del negocio.

## Qué haría distinto hoy

Documentaría antes el modelo de variación por mercado. La separación a nivel de
código estaba ahí, pero darles antes a producto y QA el mismo lenguaje para
“regla compartida” frente a “regla de mercado” habría acelerado la revisión de
casos límite.
