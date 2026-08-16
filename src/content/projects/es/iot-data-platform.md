---
title: Plataforma de telemetría IoT
description: Reemplazó el polling de 30 segundos por telemetría en vivo en la que los operarios podían confiar en una obra, desde la ingesta hasta el dashboard.
order: 2
featured: true
year: 2024
role: Ingeniero Full-Stack Líder
client: Kewazo
technologies:
  - Svelte
  - Node.js
  - WebSockets
  - D3.js
  - Python
  - TimescaleDB
sectors:
  - IoT
  - Análisis de Datos
logo: /logos/kewazo.webp
images:
  - kewazo_portafolio_1.png
  - kewazo_portafolio_2.png
  - kewazo_portafolio_3.png
  - kewazo_portafolio_4.png
  - kewazo_portafolio_5.png
highlights:
  - value: Lotes
    label: Pipeline de ingesta
    consequence: Los payloads MQTT se validaban e insertaban por lotes en vez de escribir una fila por mensaje.
  - value: Canvas
    label: Ruta de render
    consequence: Las vistas de turno siguieron siendo responsivas porque el navegador pintaba una sola superficie y no miles de nodos DOM.
  - value: Explícito
    label: Estado de conexión
    consequence: Los operarios podían ver cuándo los datos estaban atrasados en vez de confiar en lecturas silenciosamente viejas.
outcome: Sustituyó refrescos cada 30 segundos por telemetría en vivo y un estado visible de datos obsoletos, para que los operarios actuaran desde el dashboard en vez de caminar hasta la máquina.
tradeoff: Conservó D3 para escalas y ejes temporales, pero movió el renderizado de SVG a canvas para mantener 60fps en tablets poco potentes.
status: Producción
engagement:
  duration: 'Entrega 2024'
  teamSize: Ingeniería, producto y operación
  scope: Pipeline de ingesta, fan-out por WebSocket, dashboard en canvas y UX de estado atrasado
decisionQuote:
  text: 'Los operarios toleran un dashboard que admite que va atrasado. Dejan de confiar en uno que muestra números viejos en silencio como si fueran actuales.'
github: null
liveDemo: null
video: null
draft: false
---

## El problema

Los elevadores de andamiaje robótico operan en obras activas: entornos de RF ruidosos, LTE intermitente y operarios con guantes mirando una tablet bajo el sol directo. El monitoreo existente era un dashboard por polling que se refrescaba cada 30 segundos. Para cuando una falla aparecía en pantalla, la máquina normalmente ya se había detenido.

El encargo era fácil de enunciar y difícil de entregar: **hacer que el dashboard reflejara el estado de la máquina lo suficientemente rápido como para que el operario confiara más en él que en caminar hasta la máquina a mirar.**

## Restricciones que moldearon el diseño

- **Enlaces poco confiables.** El LTE en una obra se cae constantemente. El sistema tenía que degradarse con elegancia, no reventar con un error.
- **Muchas escrituras, pocas actualizaciones.** La telemetría es append-only y está ordenada por tiempo. Las filas nunca se editan.
- **Rangos de tiempo amplios.** Los operarios querían tanto "los últimos 60 segundos" como "todo el turno" desde la misma interfaz.
- **Clientes de baja potencia.** Las tablets de obra no son estaciones de trabajo. Un dashboard que clavara la CPU al 100% se comería la batería antes del almuerzo.

## Arquitectura

```
Sensores (MQTT) → workers de ingesta en Python → hypertable de TimescaleDB
                                                             │
                                              servicio de fan-out en Node.js
                                                             │
                                                   WebSocket ── cliente Svelte (D3)
```

**Ingesta.** Los workers en Python se suscriben a topics MQTT por máquina, validan los payloads contra un schema e insertan por lotes en TimescaleDB. El batching fue la mayor ganancia de throughput por mucho: insertar una fila por mensaje tocaba techo muy pronto; agrupar en una ventana de 250ms llevó la ingesta un orden de magnitud más lejos con el mismo hardware.

**Almacenamiento.** Las hypertables de TimescaleDB particionan por tiempo automáticamente. Los continuous aggregates precalculan los rollups de 1 minuto y 1 hora, así que una consulta de "las últimas 8 horas" lee unos pocos cientos de filas preagregadas en vez de escanear millones de filas crudas.

**Transporte.** Un servicio en Node.js mantiene las conexiones WebSocket y hace el fan-out de las actualizaciones. Los clientes se suscriben a una máquina, no a todo: algo crítico, porque hacer broadcast de toda la telemetría a todos los clientes es el error que mata en silencio a estos sistemas cuando escalan.

**Cliente.** Svelte compila y elimina el runtime del framework, lo cual importaba en tablets de baja potencia. D3 se encarga de las escalas y los ejes; el dibujado real va a canvas, no a SVG. Esta es la decisión que defendería con más ganas.

## Por qué canvas en lugar de SVG

La primera versión renderizaba los gráficos como SVG. Era limpio, inspeccionable, y se caía a pedazos alrededor de los 2.000 puntos: cada dato se convertía en un nodo del DOM que el navegador tenía que maquetar y pintar en cada frame.

Pasar a canvas cambió el modelo de costo. El navegador pinta un solo elemento sin importar cuántos puntos haya dentro. El renderizado pasó a ser función de los píxeles, no del volumen de datos, y sostuvo 60fps en la vista completa del turno. D3 se quedó en el stack para lo que realmente hace mejor (escalas, ticks y matemática de ejes temporales), renunciando a su capa de binding con el DOM.

## Cómo manejar la pérdida de conexión

En vez de un loop de reconexión que finge que no pasó nada, el cliente rastrea el estado de la conexión de forma explícita y lo muestra. Al reconectar pide un delta desde su último timestamp recibido en lugar de un refetch completo, así que recuperarse de 40 segundos en un túnel cuesta un payload pequeño en vez de todo el historial del turno.

El estado visible de "datos desactualizados" terminó importando más que la lógica de reconexión en sí. Los operarios toleran un dashboard que admite que va atrasado. Dejan de confiar en uno que muestra números viejos en silencio como si fueran actuales.

## Qué haría diferente

La política de refresco de los continuous aggregates se ajustó a mano, y se fue desviando a medida que creció el volumen de datos. Haría del lag de refresco una métrica monitoreada desde el día uno, en vez de algo que se descubre cuando un gráfico se ve sutilmente mal.
