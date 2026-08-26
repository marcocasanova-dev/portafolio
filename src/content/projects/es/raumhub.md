---
title: RaumHub
description: Un marketplace de trasteros y espacios de almacenaje en Alemania, descubrimiento en mapa, asistente de publicación y suscripciones de Stripe liquidadas en Edge Functions de Supabase, no en el móvil.
order: 1.7
featured: false
year: 2025
role: Fundador e Ingeniero Principal
client: Stratos One
technologies:
  - Expo
  - React Native
  - TypeScript
  - Supabase
  - Deno
  - Stripe
  - PostgreSQL
  - Next.js
sectors:
  - Comercio y Mobile
  - Productos Propios
logo: /logos/raumhub.png
highlights:
  - value: v1.2.1
    label: Publicado en Android
    consequence: Un AAB de producción construido con EAS y enviado a Play Store, no una build interna.
  - value: 'En servidor'
    label: Autoridad de pago
    consequence: El checkout y la cancelación corren en Edge Functions, así que el cliente móvil nunca guarda un secreto de Stripe.
  - value: 'Cero'
    label: Permisos de cámara
    consequence: Las fotos de los anuncios vienen del selector de documentos, así que la app nunca pide un permiso que no puede justificar.
outcome: Publiqué en Play Store un marketplace de dos lados donde los anfitriones publican espacio con un asistente y los inquilinos pagan por suscripción de Stripe, con la autoridad de pago en el servidor y el conjunto de permisos de Android recortado a lo que el producto usa de verdad.
tradeoff: Moví checkout y cancelación a Edge Functions de Supabase en lugar de llamar a Stripe desde la app, aceptando un salto de red extra y un runtime de Deno que mantener a cambio de no publicar nunca un secreto de pago dentro de un binario que los usuarios pueden abrir.
status: Publicado
engagement:
  duration: 'Desde septiembre de 2025'
  teamSize: Fundador en solitario
  scope: Esquema del marketplace, integración con Stripe, app en Expo, descubrimiento en mapa, pipeline de release con EAS y cumplimiento para Play Store
  relationship: independent
decisionQuote:
  text: 'Un permiso que no puedes justificar en una frase ante un revisor es un permiso que no deberías estar pidiendo, y quitarlo salió más barato que defenderlo.'
github: null
liveDemo: null
video: null
draft: true
---

## El producto

RaumHub es un marketplace de espacio de almacenaje. Por un lado, gente con un sótano, un garaje o una habitación sin usar lo publica; por otro, gente que necesita espacio lo encuentra cerca y lo alquila por meses. Funciona en ciudades alemanas, y por eso el flujo de dirección usa una lista fija de ciudades en vez de texto libre, un marketplace donde la mitad de los anuncios dice "München" y la otra mitad "Munich" no se puede buscar.

La app tiene dos mitades. **Explore** es navegar, filtrar, buscar y una vista de mapa. **My Hubs** es gestión de anuncios y un asistente de creación para espacios nuevos. El acceso va por Supabase, con un "recordar este dispositivo" opcional para que un anfitrión que revisa una reserva no tenga que autenticarse cada vez.

## Dónde se liquida el dinero

La decisión que dio forma a la arquitectura es que la app móvil no tiene autoridad de pago.

Checkout y cancelación son dos Edge Functions de Supabase corriendo sobre Deno, `create-hub-checkout`, que recibe un id de hub y un número de meses y devuelve una sesión de Stripe Checkout, y `cancel-subscription`. Ambas verifican el bearer token de quien llama con un cliente de anon key antes de hacer nada con el cliente de service role, y ambas sellan cada petición con un `requestId` generado que fluye a los logs y vuelve en el cuerpo de la respuesta.

La alternativa era llamar a Stripe desde la app con una clave publicable y dejar que el cliente construyera las sesiones. Son menos piezas móviles y un runtime menos que mantener. Lo descarté porque un binario móvil no es un entorno de confianza: cualquiera puede desempaquetar un APK, y el precio del alquiler de un trastero es exactamente el tipo de valor que no debería ensamblarse donde el usuario alcanza. El salto extra cuesta latencia en una pantalla. Equivocarse cuesta dinero que se ha ido de verdad.

Separar el cliente anon del cliente de service role dentro de la función importa por lo mismo. El cliente anon establece *quién pregunta*; el de service role hace el trabajo privilegiado. Fusionarlos en un solo cliente admin habría simplificado la función y convertido cada bug en ella en un bug de escalada de privilegios.

## El permiso que quité

RaumHub usaba originalmente `expo-image-picker` para que los anfitriones fotografiaran un espacio directamente al crear el anuncio. Es la implementación obvia, y requiere el permiso `CAMERA` de Android.

Google Play examina con lupa los permisos sensibles, y la app ya recoge ubicación, lo que de por sí exige una política de privacidad alojada públicamente. Ante una revisión que cuestionaría ambos, miré qué compraba realmente la cámara: los anfitriones fotografían el espacio primero y lo publican después, con lo que la cámara en el flujo servía a un camino minoritario al precio del aviso de permiso más alarmante de la app.

Un permiso que no puedes justificar en una frase ante un revisor es un permiso que no deberías estar pidiendo, y quitarlo salió más barato que defenderlo.

El asistente ahora usa `expo-document-picker`, que lee de la galería sin ninguna concesión de cámara. El manifest pide ubicación aproximada y precisa más almacenamiento externo, y nada más. La política de privacidad se publica por GitHub Pages para que Play Console tenga una URL pública estable a la que apuntar. El coste es un camino algo más largo para el anfitrión que quiere disparar fotos en el momento; el beneficio es un aviso de instalación que no le pide acceso a la cámara a un desconocido antes de que haya publicado nada.

## Ingeniería de releases

La build de Android va por EAS con dos perfiles: `preview` produce un APK instalable para pruebas internas, `production` produce el AAB que va a Play. La versión 1.2.1 es la release actual.

La app vive dentro del workspace de pnpm de Stratos One, que Metro no entiende de forma nativa, el bundler de React Native quiere un `node_modules` hoisted y pnpm le da symlinks. Un `metro.config.js` extiende `@expo/metro-config` con `watchFolders` explícitos y overrides del resolver, y tiene que seguir funcionando durante las builds de EAS, no solo en local, porque el paso de bundle también corre allí.

Una pieza de ese pipeline es un script `migrate-picture-keys`. Las imágenes de los anuncios se guardan con una clave en storage, y cuando ese esquema de claves cambió, los anuncios existentes tenían que moverse sin que los anfitriones volvieran a subir nada. No tiene glamour, y es la diferencia entre que un cambio de esquema sea un deploy o sea una disculpa.

## Qué haría distinto

Habría escrito el handler del webhook de Stripe a la vez que la función de checkout. Crear una sesión es la mitad fácil; reconciliar lo que Stripe *cree* que pasó con lo que registró la base de datos es donde una integración de pagos se gana la confianza de verdad, y construir las dos mitades de una pasada es mucho más fácil que reconstruir el hueco después.
