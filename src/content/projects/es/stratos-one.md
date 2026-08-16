---
title: Stratos One
description: Un estudio de producto construido como un solo monorepo, auth, configuración, UI y utilidades compartidas bajo seis apps, para que un producto nuevo empiece con un login funcionando en vez de una carpeta vacía.
order: 0.5
featured: false
year: 2025
role: Fundador e Ingeniero Principal
client: Stratos One
technologies:
  - Turborepo
  - pnpm
  - Expo
  - React Native
  - Next.js
  - TypeScript
  - Supabase
  - Flutter
sectors:
  - Plataforma
  - Mobile
  - SaaS
logo: /logos/stratos-one.svg
highlights:
  - value: '4'
    label: Paquetes compartidos
    consequence: Auth, configuración, design system y utilidades se escriben una vez y los consume cada app.
  - value: '2'
    label: Productos publicados
    consequence: Kin Relay y RaumHub llegaron a versiones publicadas sobre la misma base.
  - value: 1 login
    label: Reutilizado entre apps
    consequence: Un producto nuevo hereda una pantalla de acceso funcional en lugar de reimplementar el manejo de sesión.
outcome: Convertí seis ideas de app separadas en un solo código donde autenticación, theming y configuración se resuelven una vez, el segundo producto se publicó sin reescribir los cimientos del primero.
tradeoff: Elegí un workspace de pnpm con un resolver de Metro personalizado en lugar de repositorios independientes por app, aceptando una configuración de bundler móvil más difícil a cambio de una única ruta de actualización para todas las apps.
status: En desarrollo activo
engagement:
  duration: 'Desde septiembre de 2025'
  teamSize: Fundador en solitario
  scope: Arquitectura del monorepo, paquetes compartidos, backends en Supabase, ingeniería de releases y publicación en tiendas
decisionQuote:
  text: 'La parte cara de un segundo producto nunca es la idea; es descubrir que el primero escondió su login, su theming y su configuración dentro de sí mismo.'
github: null
liveDemo: null
video: null
draft: false
---

## Por qué un estudio y no una app

Stratos One nació de un patrón que se repetía. Cada idea de producto gastaba sus primeras dos semanas en el mismo trabajo: conectar la autenticación, decidir dónde vive la configuración, construir un design system que sobreviva a más de tres pantallas y montar un pipeline de release capaz de llegar de verdad a una tienda.

Nada de eso es el producto. Todo eso hace falta antes de que el producto pueda existir.

La parte cara de un segundo producto nunca es la idea; es descubrir que el primero escondió su login, su theming y su configuración dentro de sí mismo. Así que Stratos One está estructurado al revés: la base compartida es el artefacto principal, y cada app es una capa fina de marca y dominio encima.

## Qué se comparte realmente

Cuatro paquetes cargan con el peso, y cada app los consume por referencia de workspace en lugar de copiarlos:

- **`core-auth`**, manejo de sesión con Supabase más un componente `LoginScreen` que recibe colores de marca, logos y callbacks como props. Kin Relay bloquea todo su dashboard detrás de él; RaumHub reutiliza el mismo componente con otra paleta.
- **`core-ui`**, el design system, con un archivo de tema por marca. `kinRelayTheme` es una superficie oscura índigo y cian; `raumHubTheme` es una clara en verde. Los componentes no saben qué marca están renderizando.
- **`core-config`**, donde se resuelve la configuración de entorno y de flavour, para que ninguna app lea credenciales de un archivo empaquetado en tiempo de ejecución.
- **`core-utils`**, los helpers de formato, validación y manejo de resultados que si no se reinventan en cada app.

Seis apps se apoyan encima: Kin Relay, RaumHub, DreamNest, GreenWG, Stratos Search y TidyUp, cada una con una app móvil en Expo y su contraparte web en Next.js. Dos de ellas, Kin Relay y RaumHub, han llegado a versiones publicadas. El resto están andamiadas sobre la misma base, que es justamente el punto: el andamio ya es un esqueleto de app funcional.

## La restricción que dio forma al build

Compartir código nativo en un workspace de pnpm no sale gratis. Metro, el bundler de React Native, espera un `node_modules` plano y hoisted; pnpm le da deliberadamente un store con symlinks.

Las opciones honestas eran abandonar pnpm, copiar los paquetes compartidos dentro de cada app, o enseñarle a Metro a resolver un workspace. Tomé la tercera. Cada app móvil lleva un `metro.config.js` que extiende `@expo/metro-config` con `watchFolders` explícitos y overrides del resolver, y el `package.json` raíz fija `react`, `react-dom` y `react-native` mediante `overrides` para que ninguna app derive en silencio hacia otra versión de React.

El coste es real: la configuración del bundler es el conocimiento menos portable del repo, y tiene que sobrevivir a cada subida de SDK de Expo. Lo que gano a cambio es que una subida de SDK, una actualización del cliente de Supabase o un cambio de design token ocurre una vez y aterriza en todas partes.

## Backends separados a propósito

Las apps comparten código, pero no datos. Kin Relay y RaumHub apuntan a **proyectos de Supabase distintos**, y la configuración se resuelve por app y por flavour en lugar de venir de un entorno compartido.

Fue deliberado. Un producto de gestión de cuidados que maneja observaciones de salud y un marketplace de trasteros que maneja pagos no tienen casi nada en común en sus modelos de amenaza, sus requisitos de retención ni sus reglas de acceso. Compartir base de datos habría acoplado dos productos cuya única relación real es que los escribí yo. Compartir un *componente* de login es apalancamiento; compartir un *tenant* de login habría sido un pasivo.

## La cuestión de Flutter

Existe un segundo monorepo, un port a Flutter de Kin Relay y RaumHub, estructurado como un único pub workspace con `melos`, providers de Riverpod, configuración en tiempo de compilación mediante `--dart-define-from-file` y architecture decision records en `docs/adr/`.

Lo construí porque las apps de Expo respondieron la pregunta de producto pero dejaron abierta una de ingeniería: cuánto del argumento de la base compartida es del monorepo y cuánto es específico de React Native. Portar los mismos dos productos a otro toolchain, con los mismos límites de paquete, `stratos_core`, `stratos_config`, `stratos_ui`, `stratos_auth`, es la única forma de averiguarlo que no depende de especular.

## Qué haría distinto

Habría escrito la configuración de Metro para el workspace como un paquete compartido desde el primer día, en lugar de dejar que cada app cargue una copia casi idéntica. Es la única pieza del repo que viola su propia premisa, y es la que más probablemente se rompa durante una subida de SDK, exactamente el momento en el que menos quieres depurar cuatro configuraciones de bundler ligeramente distintas.
