---
title: My Voice Agent
description: Una línea telefónica con IA que atiende un número de Twilio, pide consentimiento, toma el mensaje de quien llama y lo envía por SMS a la familia, con privacidad y observabilidad desde la primera llamada.
order: 1
featured: true
year: 2026
role: Software Engineer
client: Stratos One
technologies:
  - TypeScript
  - Fastify
  - Python
  - FastAPI
  - PostgreSQL
  - Twilio
  - Claude API
  - Docker
  - OpenTelemetry
  - Prometheus
sectors:
  - IA y Voz
logo: /favicon.svg
images: []
highlights:
  - value: '0'
    label: Audio almacenado
    consequence: Twilio gestiona la voz a texto y el texto a voz, así que los servicios solo intercambian texto.
  - value: 30 días
    label: Caducidad automática
    consequence: Cada llamada tiene fecha de caducidad y un proceso elimina los datos vencidos cada seis horas.
  - value: 1 traza
    label: Por llamada
    consequence: Una sola traza de OpenTelemetry sigue la llamada desde el gateway en TypeScript, pasando por SQL, hasta el servicio en Python.
outcome: Sustituyó las llamadas perdidas y las notas sueltas por una línea automática que registra quién llamó y por qué, y envía el mensaje por SMS a la familia, marcando las llamadas urgentes.
tradeoff: Dejar que Twilio haga la voz a texto y el texto a voz en lugar de transmitir audio en bruto, aceptando turnos algo más lentos a cambio de no almacenar ni procesar audio.
status: Desplegado
engagement:
  duration: '2026'
  teamSize: En solitario
  scope: Webhooks de Twilio y TwiML, máquina de estados de llamada en TypeScript/Fastify, servicio de respuestas en Python/FastAPI con modo LLM y modo basado en reglas, esquema PostgreSQL, endpoints RGPD, observabilidad y despliegue con Docker Compose
  relationship: independent
verificationStatus: verified
github: null
liveDemo: null
video: null
draft: false
---

## El problema

Alguien llama a un familiar que no puede contestar. Un buzón de voz es fácil de ignorar y de perder, y nada indica a la familia si la llamada era rutinaria o urgente. Quise una línea que conteste como lo haría una persona: dice quién es, pregunta qué quiere transmitir quien llama y se asegura de que las personas adecuadas se enteren.

## Cómo funciona una llamada

Quien llama marca el número de Twilio y un gateway en TypeScript/Fastify responde con TwiML. Informa de que la línea es automática y pide consentimiento explícito antes de guardar nada. Tras el consentimiento, Twilio transcribe cada frase y la envía a un servicio Python/FastAPI que elige la siguiente respuesta y extrae el nombre, el mensaje y la urgencia. Al terminar la llamada, el gateway envía el mensaje por SMS a la familia mediante Twilio, con el prefijo `URGENT` si se marcó como urgente.

## Decisiones clave

- **Solo texto.** Twilio hace la voz a texto y el texto a voz, por lo que ningún audio llega a mi código ni a mi base de datos. Es el diseño más simple y la menor superficie de privacidad.
- **El modelo no puede tumbar la línea.** El servicio llama a Claude, o a cualquier API compatible con OpenAI, y devuelve JSON estructurado. Ante cualquier error del modelo recurre a un flujo determinista basado en reglas, de modo que quien llama nunca oye silencio.
- **Privacidad por diseño.** Los teléfonos se guardan como hashes con clave, las transcripciones se redactan, rechazar el consentimiento borra la llamada al instante y los datos caducan a los 30 días. Las solicitudes de acceso y supresión se atienden con endpoints de administración y un registro de auditoría, y los webhooks de Twilio se verifican por firma.
- **Observable desde el primer día.** Una traza de OpenTelemetry por llamada atraviesa las capas TypeScript, SQL y Python, y Prometheus mide resultados de llamadas, latencia por turno, errores del servicio y fallos de SMS.

## Estado actual

El sistema está desplegado y funciona con Docker Compose tras Caddy. Atiende llamadas reales, en promedio de 6 a 10 al día. El repositorio incluye pruebas unitarias de la lógica de conversación, la redacción, el hashing y la firma de webhooks, además de un simulador que reproduce llamadas normales, urgentes y rechazadas sin teléfono.

## Límites documentados

El cuerpo del mensaje se guarda sin redactar porque transmitirlo es el propósito del producto, aunque caduca como el resto. Antes de un uso más amplio necesita contratos de encargado de tratamiento firmados con Twilio y el proveedor del modelo, una evaluación de impacto y el acceso de administración tras SSO o VPN.
