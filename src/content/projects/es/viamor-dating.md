---
title: Viamor
description: Modeló grafos complejos de relaciones y estados de consentimiento para un producto de citas en producción centrado en relaciones poliamorosas.
order: 4
featured: false
year: 2023
role: Ingeniero Full-Stack
client: Viamor
technologies:
  - Flutter
  - Firebase
  - Ruby on Rails
  - Vue.js
  - PostgreSQL
sectors:
  - Social
  - Móvil
  - WebApp
logo: /logos/viamor.webp
images:
  - viamor_1.png
  - viamor_2.png
  - viamor_3.png
  - viamor_4.png
  - viamor_5.png
  - viamor_6.png
  - viamor_7.png
highlights:
  - value: 'n:m'
    label: Modelo de relaciones
    consequence: Usuarios con pareja, parejas y relaciones superpuestas encajaban en una sola estructura.
  - value: Explícito
    label: Flujo de consentimiento
    consequence: Los estados inválidos de match pasaron a ser irrepresentables en vez de “resolverse después”.
  - value: Compartido
    label: Stack móvil
    consequence: Una sola codebase en Flutter entregó ambas plataformas mientras las reglas del backend seguían siendo relacionales.
outcome: Le dio al producto un modelo de datos capaz de representar usuarios con pareja, consentimiento grupal y reglas de matching sin apilar casos especiales.
tradeoff: Trató las relaciones como entidades de primera clase y el consentimiento como una máquina de estados, en lugar de codificar ambos como flags de usuario.
status: Producción
engagement:
  duration: 'Entrega 2023'
  teamSize: Equipo de ingeniería de producto
  scope: Modelo de relaciones, máquina de estados de consentimiento, integraciones móviles y límites de backend
decisionQuote:
  text: 'Los flags te dejan llegar a estados que nadie diseñó; una tabla de transiciones no.'
github: null
liveDemo: null
video: null
draft: false
---

## El problema

Toda app de citas mainstream codifica el mismo supuesto en su schema: la persona usuaria es soltera, busca una sola pareja, y un resultado exitoso la saca del pool. Para usuarios poliamorosos ese modelo no es apenas incompleto, es directamente incorrecto. No puede expresar "tengo pareja y mi pareja sabe que estoy acá", no puede representar a una pareja buscando en conjunto, y trata al match como algo terminal.

El trabajo interesante de este proyecto estuvo casi por completo en el modelo de datos. La UI fue la parte fácil.

## Modelar las relaciones como corresponde

La decisión central: **las relaciones son entidades de primera clase, no un campo de estado en el usuario.**

```
User ──< RelationshipMembership >── Relationship
                                        │
                                   (tipo, visibilidad, estado de consentimiento)
```

Un usuario tiene muchas membresías; una relación tiene muchos miembros. Esa única indirección hace expresables los casos difíciles:

- Una persona con dos parejas que no son pareja entre sí.
- Una pareja navegando como unidad, donde ambos miembros deben consentir un match.
- Una relación visible para los matches pero no en el perfil público.
- Terminar una relación sin tocar las demás.

El schema 1:1 no puede representar ninguno de estos sin una pila de casos especiales. El schema n:m los resuelve casi gratis, y cada funcionalidad río abajo —matching, notificaciones, privacidad— lee de la misma estructura en vez de reimplementar su propia idea de quién está conectado con quién.

## El consentimiento como máquina de estados, no como booleano

Cuando un match puede involucrar a más de dos personas, "¿ambos hicieron swipe a la derecha?" deja de alcanzar. El consentimiento se volvió una máquina de estados explícita con un estado pendiente que exige que cada parte afectada actúe antes de que el match se materialice.

Modelarlo como máquina de estados en vez de como un conjunto de flags booleanos hizo que las combinaciones inválidas fueran irrepresentables, no apenas improbables. Los flags te dejan llegar a estados que nadie diseñó; una tabla de transiciones no.

## Por qué Flutter, y dónde dolió

Un solo codebase, dos plataformas, un equipo chico: Flutter fue la decisión correcta y la volvería a tomar. Donde dolió fue exactamente donde uno lo esperaría: las integraciones específicas de cada plataforma. El manejo de push notifications, los deep links y los flujos de permisos necesitaron atención nativa de ambos lados. El 90% compartido es real; presupuesta bien el 10% que no lo es.

## Firebase y Rails juntos

Un emparejamiento poco común y del todo deliberado. Firebase se encarga del chat en tiempo real y las push: problemas que resuelve mejor de lo que yo lo haría. Rails es dueño del núcleo relacional: usuarios, relaciones, consentimiento, matching. Postgres hace las consultas de grafo en las que Firestore es genuinamente malo.

El costo es un límite de sincronización, y los límites de sincronización son donde viven los bugs. La regla que lo mantuvo manejable: **Postgres es la fuente de verdad para todo lo relacional; Firebase es la fuente de verdad para la entrega de mensajes.** Cualquier campo que necesitara ambos era un olor de diseño a resolver, no una integración a escribir.

## Qué haría diferente

Introduciría la máquina de estados de consentimiento antes. Empezó como booleanos y se refactorizó bajo presión una vez que salieron los matches grupales. El refactor fue correcto, pero tocó la lógica de notificaciones, el matching y el cliente móvil al mismo tiempo, y todo eso habría salido más barato si la máquina de estados hubiera existido desde el principio.
