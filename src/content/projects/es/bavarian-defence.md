---
title: Bavarian Defence
description: Un juego de estrategia tower defence en Unity, y un ejercicio para lograr que cientos de entidades se actualicen en cada frame sin bajar de 60fps en hardware de gama media.
order: 5
featured: false
year: 2023
role: Programador de Gameplay y Sistemas
technologies:
  - Unity
  - C#
sectors:
  - Productos Propios
logo: /logos/bavarian_defense.webp
images:
  - towerdefence-1.webp
  - towerdefence-2.webp
  - towerdefence-3.webp
  - towerdefence-4.webp
  - towerdefence-5.webp
  - towerdefence-6.webp
  - towerdefence-7.webp
highlights:
  - value: Pooling
    label: Ciclo de vida de entidades
    consequence: Enemigos y proyectiles reutilizaron memoria en vez de disparar picos de GC en plena oleada.
  - value: Spatial hash
    label: Búsqueda de objetivos
    consequence: Las torres miraban enemigos cercanos en lugar de escanear todo el mapa en cada frame.
  - value: Loops compactos
    label: Actualización de movimiento
    consequence: Los datos calientes de movimiento se mantuvieron más amigables con la cache que los `Update()` por objeto.
outcome: Mantuvo fluida la simulación en las oleadas tardías al quitar el churn del GC y acotar el trabajo en los hot paths de actualización.
tradeoff: Usó loops manuales orientados a datos y una grilla hash espacial en lugar de un modelo más simple de objeto-por-`Update()`, porque la estabilidad del frame time importaba más que la comodidad del editor.
engagement:
  duration: 'Proyecto personal 2023'
  teamSize: Solo
  scope: Sistemas de gameplay, profiling de hot paths, pooling e indexación espacial
  relationship: independent
github: null
liveDemo: null
video: null
draft: false
---

*Proyecto personal e independiente, desarrollado y publicado por iniciativa propia. Sin afiliación, contrato ni relación con ninguna entidad gubernamental, estatal o militar, ni en Baviera ni en ningún otro lugar; el nombre hace referencia únicamente al género tower defence.*

## El problema

El tower defence es un género engañosamente exigente en rendimiento. Las oleadas tardías ponen cientos de enemigos en pantalla, cada uno moviéndose por un camino, cada uno candidato a ser objetivo de decenas de torres, cada uno con barras de vida y efectos de estado. Hecho de forma ingenua es un problema O(torres × enemigos) evaluado en cada frame, y se degrada justo cuando el juego está en su punto más emocionante.

Este proyecto fue, en la práctica, un ejercicio de ingeniería de rendimiento disfrazado de videojuego.

## Matar los picos de frame time

La primera build jugable corría bien al principio y tartamudeaba feo en las oleadas tardías. El profiler de Unity apuntó a dos culpables, y ninguno era el renderizado.

### 1. Recolección de basura

Los enemigos se instanciaban al aparecer y se destruían al morir. Con unos pocos enemigos por segundo esto es invisible. A cuarenta por segundo, la rotación de asignaciones disparaba colecciones del GC en medio de la oleada, y cada colección era un tirón visible en el peor momento posible.

La solución es estándar y vale la pena hacerla bien: **object pooling**. Enemigos, proyectiles y números de daño se asignan una sola vez al cargar y se reciclan. Aparecer pasa a ser tomar de una free list y resetear el estado; morir pasa a ser devolverlo a la lista. La asignación en estado estable baja a cero y, sin nada que recolectar, el GC deja de interrumpir.

La sutileza está en el reseteo del estado. Un objeto del pool que arrastra estado viejo de su vida anterior es una de las clases de bug más desagradables en juegos, porque se reproduce solo bajo órdenes de reutilización específicos. Cada tipo del pool se resetea a través de un único `Reset()` que invoca el pool, no mediante asignaciones de campos ad-hoc en cada punto de llamada.

### 2. Adquisición de objetivos

Que cada torre escanee a cada enemigo en cada frame es el loop ingenuo O(n×m). Con 40 torres y 500 enemigos son 20.000 chequeos de distancia por frame, y es puro desperdicio: la mayoría de los enemigos no están ni cerca de la mayoría de las torres.

Reemplazarlo por un **spatial hash grid** acotó el trabajo. El mundo se divide en celdas dimensionadas según el mayor rango de torre; una torre solo examina los enemigos de su propia celda y las vecinas inmediatas. El costo por torre pasa a ser aproximadamente constante respecto al total de enemigos y proporcional, en cambio, a la densidad local.

Dos detalles importaron:

- Los enemigos actualizan su celda de la grilla solo al cruzar un borde, no en cada frame.
- Las comparaciones de distancia usan magnitud al cuadrado. Las raíces cuadradas en un hot loop son evitables; comparar distancias al cuadrado da el mismo orden.

## Movimiento orientado a datos

El movimiento de los enemigos salió de las llamadas a `Update()` por objeto hacia un único sistema que itera arreglos contiguos de posiciones y velocidades. Cientos de invocaciones individuales de `Update()` en cada frame tienen un overhead real (cruzar el límite entre código manejado y nativo no es gratis) y la memoria dispersa de los objetos hace que la cache de la CPU falle constantemente.

Un solo loop sobre arreglos empaquetados es dramáticamente más amigable con la cache. Es la misma idea detrás de DOTS de Unity, aplicada a mano en una escala donde el ECS completo habría sido excesivo.

## Qué me enseñó este proyecto

Las técnicas de rendimiento de acá no son específicas de los videojuegos. Poolea los objetos caros, acota tu espacio de búsqueda con la estructura de datos correcta, mantén los datos calientes contiguos y perfila antes de optimizar. Desde entonces he aplicado las cuatro a servicios de backend; la restricción de un presupuesto de 16ms por frame solo hace que la lección sea imposible de ignorar.
