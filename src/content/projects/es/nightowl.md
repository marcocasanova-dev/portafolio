---
title: NIGHTOWL
description: Construi una plataforma de ticketing y gestion de eventos en produccion con Rails, React y Flutter, desde dashboards para organizadores y ticket shops hasta el acceso movil.
order: 3
featured: false
year: 2025
role: Ingeniero Full-Stack
client: NIGHTOWL
technologies:
  - Ruby on Rails
  - React
  - Flutter
sectors:
  - Eventos y Plataformas
logo: /logos/nightowl.svg
cover: cover-nightowl.webp
images:
  - nightowl-og.png
highlights:
  - value: Compartido
    label: Reglas de ticketing
    consequence: Las fases de precio, los descuentos y la validacion del scanner seguian un mismo modelo backend.
  - value: Web + mobile
    label: Superficies de producto
    consequence: Los organizadores trabajaban en React mientras el equipo de acceso operaba en Flutter.
  - value: Produccion
    label: Operacion de eventos
    consequence: La plataforma soportaba ventas reales y flujos reales de acceso, no una demo interna.
outcome: Entregue una plataforma de eventos en produccion donde los organizadores podian publicar ticket shops, seguir ventas y operar el acceso desde el mismo sistema en web y mobile.
tradeoff: Mantener fases de ticket, validacion de acceso y estado operativo en modelos de dominio y APIs de Rails en lugar de duplicar reglas de negocio por separado en clientes React y Flutter.
status: Produccion
engagement:
  duration: 'Entrega 2025'
  teamSize: Equipo de producto e ingenieria
  scope: Dominio de ticketing en Rails, flujos para organizadores en React, app de scanner en Flutter y reglas de negocio compartidas
decisionQuote:
  text: 'Las fases de ticket, la validacion del scanner y los payouts no son tres features; son un unico sistema de inventario visto desde tres pantallas distintas.'
github: null
liveDemo: https://nightowl.app/
video: null
verificationStatus: partial
draft: false
---

## El problema

NIGHTOWL vive en esa parte del software que parece simple desde la landing page y se complica en cuanto entran dinero y puertas. Los organizadores necesitan crear eventos rapido, publicar ticket shops, gestionar descuentos, seguir ventas y aun asi mover gente por el acceso sin que la app movil contradiga al producto web.

La parte dificil no era construir un dashboard o una pantalla de scanner aislada. La parte dificil era mantener coherentes las mismas reglas de ticketing entre el backend en Rails, las superficies en React y la app de acceso en Flutter.

## Restricciones que moldearon el diseno

- **El estado del ticket es compartido.** Un cambio de fase de precio, una regla de descuento o un reembolso no puede significar una cosa en el dashboard y otra distinta en la puerta.
- **El acceso es software operativo.** Si el scanner es lento o ambiguo, el problema aparece como una cola de personas reales, no como un bug de QA.
- **Los organizadores necesitan una sola fuente de verdad.** Ventas, logica de listas, payouts y estado de acceso tienen que cuadrar sin limpieza manual en hojas de calculo despues del evento.
- **Web y mobile evolucionan a ritmos distintos.** El modelo backend tiene que absorber el crecimiento del producto sin obligar a los clientes React y Flutter a reinventar cada uno su propia version de la logica de negocio.

## Un sistema de inventario, tres superficies

La decision de arquitectura mas importante fue tratar el ticketing como un solo dominio y no como una coleccion de apps relacionadas de forma suelta.

Las fases de ticket, la validacion del scanner y los payouts no son tres features; son un unico sistema de inventario visto desde tres pantallas distintas.

Por eso la capa de Rails era la pieza mas importante. Alli vivian las transiciones de estado y las reglas de validacion de las que dependian ambos clientes, mientras React resolvia las superficies para organizadores y Flutter resolvia la operacion del acceso. Cuando esas reglas viven en un solo sitio, las apps web y mobile pueden centrarse en claridad, velocidad y estados de recuperacion en vez de cargar cada una con su propia interpretacion de lo que es un ticket valido.

## Por que Flutter tenia sentido para el acceso

La promesa publica del producto incluye una app de scanner para iOS y Android, y eso cambia el problema de ingenieria. El software de acceso vive en condiciones de poca atencion y mucha presion: luz deficiente, puertas llenas, conectividad inestable y equipos que necesitan una respuesta de si o no de inmediato.

Flutter era la eleccion correcta ahi. Una sola base de codigo mantuvo alineada la experiencia de validacion en ambas plataformas, mientras el backend siguio siendo responsable de las reglas que realmente deciden si un ticket es valido. Esa separacion mantuvo rapida la app movil sin convertirla en una segunda fuente de verdad.

## React donde trabajan los organizadores

React era la mejor opcion para las superficies que cambian con frecuencia: configuracion de eventos, flujos de ticket shop, visibilidad de ventas y controles que los organizadores usan antes y durante un evento. Esas pantallas se benefician de iteracion rapida y buen manejo de estado, pero solo siguen siendo confiables si el backend decide las reglas reales del negocio.

Ese limite backend-first fue lo que mantuvo coherente el producto. El dashboard, la tienda publica y la app de scanner eran experiencias distintas, pero todas tenian que describir el mismo estado del evento.

## Que haria diferente

Invertiria antes en tests de escenario en la frontera entre venta y acceso: tickets reembolsados, cambios de fase poco antes de abrir puertas y ediciones de ultimo minuto mientras ya se esta escaneando. Esos son los casos en los que una plataforma de ticketing gana o pierde confianza mas rapido.
