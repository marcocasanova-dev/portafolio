---
title: Kin Relay
description: 'Una plataforma de coordinación de cuidados donde familias y cuidadores profesionales registran el día de la misma persona en un único historial tipado: 6 categorías, 65 subtipos y una escala de gravedad que aguanta una auditoría.'
order: 1.6
featured: false
year: 2025
role: Fundador e Ingeniero Principal
client: Stratos One
technologies:
  - Next.js
  - React
  - TypeScript
  - Supabase
  - PostgreSQL
  - Expo
  - next-intl
  - Zod
  - Leaflet
sectors:
  - Salud
  - Productos Propios
logo: /logos/kinrelay.svg
highlights:
  - value: '65'
    label: Subtipos de actividad tipados
    consequence: Una caída, una visita perdida y una glucemia son registros distintos en vez de tres notas de texto libre.
  - value: '11'
    label: Idiomas de interfaz
    consequence: Cuidadores y familiares leen el mismo historial en su idioma, incluidos árabe, turco y ucraniano.
  - value: '5'
    label: Roles de pertenencia
    consequence: Un familiar observador, un cuidador contratado y un responsable de servicio ven el mismo círculo con distinta autoridad.
outcome: Sustituí las notas de cuidado en texto libre por un historial tipado y multilingüe donde cada evento registrado lleva categoría, gravedad y autor, de modo que un relevo entre un familiar y un cuidador de agencia ya no pierde información.
tradeoff: Modelé los eventos de cuidado como una sola tabla con seis columnas de subtipo específicas por categoría en lugar de seis tablas separadas, aceptando columnas dispersas a cambio de una única línea temporal consultable por persona.
status: Publicado
engagement:
  duration: 'Desde 2025'
  teamSize: Fundador en solitario
  scope: Esquema en Postgres, reglas de acceso en Supabase, app web en Next.js, app móvil en Expo y superficie de traducción a once idiomas
  relationship: independent
decisionQuote:
  text: 'El texto libre es lo más rápido de escribir y lo más caro de leer; un historial de cuidados se escribe una vez y se lee bajo presión.'
github: null
liveDemo: null
video: null
draft: false
---

## El problema

El cuidado de una persona casi nunca lo presta una sola parte. Un padre, un hermano, un servicio ambulante y un cuidador contratado aparecen durante la misma semana, y cada uno anota lo que pasó en un sitio que los demás no ven: un hilo de WhatsApp, una carpeta de papel en el pasillo, el sistema interno de una agencia.

El modo de fallo no es dramático. Nadie pierde un registro. Lo que ocurre es que un cuidador llega sin saber de la caída del martes, o la familia se entera de un cambio de medicación tres días tarde, y la información que lo habría evitado existía todo el tiempo en un formato que nadie podía buscar.

El texto libre es lo más rápido de escribir y lo más caro de leer; un historial de cuidados se escribe una vez y se lee bajo presión.

## Restricciones que dieron forma al esquema

- **Varias organizaciones, una persona.** Un círculo familiar, un piso compartido de mayores y un servicio ambulante tienen estructuras genuinamente distintas, así que el tipo de círculo se modela explícitamente: `family`, `senior_wg`, `ambulant_service`.
- **La autoridad no es binaria.** Cinco roles, owner, manager, carer, family, viewer, porque "puede esta persona editar medicaciones" y "puede esta persona leer las notas de ayer" son preguntas distintas.
- **Quien lee puede no compartir el idioma de quien escribe.** El trabajo de cuidados en Alemania es multilingüe por defecto. La interfaz se publica en once idiomas, y una persona cuidada lleva su idioma principal como dato, no como preferencia de UI.
- **Parte de esto es clínico.** Una glucemia y una sospecha de ictus no son el mismo tipo de nota que un paseo por el parque, y el historial tiene que saber la diferencia sin pedirle a quien registra que escriba un párrafo.

## Una línea temporal, seis categorías

La decisión central fue que cada evento registrado sea una fila en una sola tabla `activities`, categorizada en seis tipos: seguridad, observación de salud, AVD, entorno, servicio y participación, con una columna de subtipo específica por categoría.

Eso da 65 subtipos tipados en total: 11 eventos de seguridad (caídas, error de medicación, protección, cuasi incidente), 22 observaciones de salud (dolor torácico, signos de ictus, glucemia, deterioro cutáneo), 14 actividades de la vida diaria, 3 riesgos del entorno, 5 incidencias de servicio y 10 actividades de participación, desde leer hasta un paseo al aire libre.

La alternativa eran seis tablas separadas, una por categoría. Habría dado un esquema más limpio sobre el papel y un producto mucho peor: la pregunta más frecuente, *qué le ha pasado a esta persona esta semana*, se habría convertido en un union de seis vías en cada consulta, en cada vista, en cada exportación. Preferí columnas dispersas a un join en abanico, porque la línea temporal es la funcionalidad.

Junto a la categoría viven dos escalas ortogonales, porque aplican a todas: `harm_severity` va de `no_harm_prevented` pasando por `no_harm_unprevented`, `low`, `moderate`, `severe`, hasta `death`, y `assistance_level` registra si la persona fue independiente, supervisada, asistida parcialmente o asistida por completo. La gravedad está deliberadamente separada de la categoría: una caída puede ser un cuasi incidente y un error de medicación puede ser mortal.

## Migrar una taxonomía sin romper el historial

Los subtipos de AVD arrastran dos generaciones de valores solapadas. El conjunto original (`mobility_transfer`, `nutrition_meal`, `sleep_rest`) resultó demasiado grueso cuando empezó el registro real, así que lo sustituyó uno más fino: `transfer`, `ambulation_walk`, `bathing_hygiene`, `dressing_grooming`, `feeding`, y entradas separadas de continencia vesical e intestinal.

Los valores antiguos siguen siendo válidos en el tipo. No es un descuido: borrarlos habría invalidado cada fila ya escrita, y un historial de cuidados que reescribe su propia historia es peor que uno con un enum algo desordenado. Las entradas nuevas usan la taxonomía fina; las filas viejas siguen significando lo que significaban cuando se escribieron.

## Dónde corre

La app web es Next.js 15 con React 19, `next-intl` para los once idiomas, Zod para validar entradas y Leaflet para el mapa de cuidados que sitúa geográficamente a cuidadores y personas cuidadas. Supabase aporta Postgres, autenticación y las reglas de acceso que hacen cumplir el modelo de roles. La app móvil es Expo, publicada en la versión 1.0.1 bajo `com.stratos.kinrelay`, y comparte su pantalla de acceso con el resto del estudio Stratos One.

Ambas superficies leen las mismas tablas. No hay un esquema móvil aparte ni campos exclusivos de móvil, una decisión que cuesta algo de ergonomía móvil y compra la garantía de que el historial es el historial, lo abras donde lo abras.

## Qué haría distinto

Habría diseñado el formato de exportación antes de la tercera categoría, no después de la sexta. Parte del valor de un historial de cuidados es poder entregárselo a un médico, a una aseguradora o a un juzgado, y adaptar a posteriori una representación externa estable sobre una taxonomía que ya migró una vez es bastante más difícil que definirla de entrada.
