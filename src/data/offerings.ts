import type { Lang } from '@i18n/utils';

/**
 * Centralised commercial content: the problems Marco solves, the three
 * service areas, the four ways to buy the work, the engagement process, and
 * the homepage FAQ. Consumed by the homepage, /services, and /how-i-work so
 * none of it is duplicated per-page or per-language.
 *
 * Every locale is required on every entry (not optional + fallback) so a
 * missing translation fails `astro check` instead of silently showing English
 * on the German route.
 */
export type Localized = Record<Lang, string>;

export interface Problem {
  title: Localized;
  body: Localized;
}

export interface ServiceArea {
  slug: 'build-launch' | 'rescue-stabilize' | 'modernize-scale';
  title: Localized;
  /** The situation that leads someone to this service — answers "is this me?". */
  trigger: Localized;
  body: Localized;
  /** What is different once the engagement is done — kept qualitative, no invented metrics. */
  result: Localized;
  capabilities: Localized[];
  /** The explicit boundary of what "end-to-end" does and does not include. */
  scopeNote: Localized;
  /** Which /how-i-work formats typically fit this service. */
  suitableFormats: EngagementFormat['slug'][];
  /**
   * Slug of a verified, featured case study that demonstrates this pillar.
   * Left unset rather than pointing at a case study that does not genuinely
   * fit — an absent link is honest, a forced one is not.
   */
  caseStudySlug?: string;
}

export interface EngagementFormat {
  slug: 'technical-review' | 'delivery-sprint' | 'focused-mvp' | 'ongoing-partnership';
  title: Localized;
  duration: Localized;
  body: Localized;
  deliverables: Localized[];
  /**
   * No engagement floor is set in PROFILE (src/config.ts), so every format
   * uses the same honest fallback rather than a guessed number. If
   * PROFILE.engagementFloor is ever set, revisit this per-format.
   */
  priceNote: Localized;
}

export interface ProcessStep {
  title: Localized;
  body: Localized;
}

export interface Faq {
  question: Localized;
  answer: Localized;
}

export const problems: Problem[] = [
  {
    title: {
      en: 'An idea or requirement needs to become working software',
      de: 'Eine Idee oder Anforderung muss zu funktionierender Software werden',
      es: 'Una idea o un requisito debe convertirse en software funcionando',
    },
    body: {
      en: 'A validated idea or an important product requirement, and no engineer to take it from technical discovery through to a production release.',
      de: 'Eine validierte Idee oder eine wichtige Produktanforderung, aber niemand, der sie von der technischen Konzeption bis zum Produktivrelease trägt.',
      es: 'Una idea validada o un requisito importante del producto, sin nadie que lo lleve desde la exploración técnica hasta un release en producción.',
    },
  },
  {
    title: {
      en: 'A system is stalled, fragile, or nobody wants to touch it',
      de: 'Ein System steckt fest, ist instabil, oder niemand traut sich mehr heran',
      es: 'Un sistema está estancado, es frágil o nadie quiere tocarlo',
    },
    body: {
      en: 'An inherited codebase, an abandoned build, or a production system breaking in ways nobody fully understands. Someone has to make it legible again before anything else can ship.',
      de: 'Eine übernommene Codebasis, ein abgebrochener Build oder ein Produktivsystem, das auf unverstandene Weise ausfällt. Bevor irgendetwas anderes ausgeliefert werden kann, muss es erst wieder verständlich werden.',
      es: 'Una base de código heredada, un desarrollo abandonado o un sistema en producción que falla de formas que nadie entiende del todo. Antes de entregar nada más, alguien tiene que volver a hacerlo comprensible.',
    },
  },
  {
    title: {
      en: 'The product works, but every change now feels risky',
      de: 'Das Produkt läuft, aber jede Änderung fühlt sich riskant an',
      es: 'El producto funciona, pero cada cambio se siente arriesgado',
    },
    body: {
      en: 'Framework versions have drifted, the database groans under load, and a deploy is a small leap of faith. The system needs deliberate, incremental change, not a rewrite.',
      de: 'Framework-Versionen sind veraltet, die Datenbank ächzt unter Last, und jedes Deployment ist ein kleiner Vertrauensvorschuss. Das System braucht gezielte, schrittweise Änderungen, keinen Rewrite.',
      es: 'Las versiones de los frameworks han quedado atrás, la base de datos sufre bajo carga y cada despliegue es un pequeño acto de fe. El sistema necesita cambios deliberados e incrementales, no una reescritura.',
    },
  },
];

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'build-launch',
    title: {
      en: 'Build & Launch',
      de: 'Aufbauen & Launchen',
      es: 'Construir y Lanzar',
    },
    trigger: {
      en: 'You have a validated idea or an important requirement, and no engineer to take it from discovery to a production release.',
      de: 'Du hast eine validierte Idee oder eine wichtige Anforderung, aber niemanden, der sie von der Konzeption bis zum Produktivrelease trägt.',
      es: 'Tienes una idea validada o un requisito importante, y ningún ingeniero que la lleve desde la exploración hasta un release en producción.',
    },
    body: {
      en: 'Turn a validated idea or an important product requirement into working production software. I take ownership from technical discovery and architecture through implementation, deployment, and handover.',
      de: 'Eine validierte Idee oder eine wichtige Produktanforderung wird zu funktionierender Software in Produktion. Ich übernehme Verantwortung von der technischen Konzeption und Architektur über die Umsetzung bis zu Deployment und Übergabe.',
      es: 'Convierto una idea validada o un requisito importante del producto en software funcionando en producción. Me hago cargo desde la exploración técnica y la arquitectura hasta la implementación, el despliegue y la entrega.',
    },
    result: {
      en: 'A working production release with a technical handover your team can maintain, instead of a prototype that stalls after the demo.',
      de: 'Ein funktionierendes Produktivrelease mit technischer Übergabe, die dein Team weiterpflegen kann, statt eines Prototyps, der nach der Demo stecken bleibt.',
      es: 'Un release en producción funcionando, con un traspaso técnico que tu equipo puede mantener, en lugar de un prototipo que se estanca después de la demo.',
    },
    suitableFormats: ['focused-mvp', 'delivery-sprint'],
    caseStudySlug: 'mobile-commerce-platform',
    capabilities: [
      { en: 'Focused MVP development', de: 'Fokussierte MVP-Entwicklung', es: 'Desarrollo de MVP acotado' },
      { en: 'New product features', de: 'Neue Produktfunktionen', es: 'Nuevas funcionalidades de producto' },
      { en: 'Backend and API development', de: 'Backend- und API-Entwicklung', es: 'Desarrollo de backend y APIs' },
      { en: 'Web and mobile applications', de: 'Web- und Mobile-Anwendungen', es: 'Aplicaciones web y móviles' },
      { en: 'Third-party integrations', de: 'Integration von Drittanbietern', es: 'Integraciones con terceros' },
      { en: 'Deployment and technical handover', de: 'Deployment und technische Übergabe', es: 'Despliegue y traspaso técnico' },
    ],
    scopeNote: {
      en: '"End-to-end" means engineering delivery for a defined scope, not branding, marketing, legal work, or unlimited product design.',
      de: '„End-to-end" bedeutet technische Umsetzung für einen definierten Umfang, nicht Branding, Marketing, rechtliche Themen oder unbegrenztes Produktdesign.',
      es: '"De punta a punta" significa entrega de ingeniería para un alcance definido, no branding, marketing, trabajo legal ni diseño de producto ilimitado.',
    },
  },
  {
    slug: 'rescue-stabilize',
    title: {
      en: 'Rescue & Stabilize',
      de: 'Retten & Stabilisieren',
      es: 'Rescatar y Estabilizar',
    },
    trigger: {
      en: 'An inherited codebase, an abandoned build, or a production system is breaking in ways nobody on the team fully understands.',
      de: 'Eine übernommene Codebasis, ein abgebrochener Build oder ein Produktivsystem fällt auf eine Weise aus, die im Team niemand ganz versteht.',
      es: 'Una base de código heredada, un desarrollo abandonado o un sistema en producción falla de formas que nadie en el equipo entiende del todo.',
    },
    body: {
      en: 'Take control of a stalled, fragile, or inherited system. I identify the immediate risks, make the codebase understandable, and deliver the fixes needed to move the product forward.',
      de: 'Übernahme eines feststeckenden, instabilen oder ererbten Systems. Ich identifiziere die akuten Risiken, mache die Codebasis verständlich und liefere die Fixes, die das Produkt wieder vorwärtsbringen.',
      es: 'Tomo el control de un sistema estancado, frágil o heredado. Identifico los riesgos inmediatos, hago que el código sea comprensible y entrego las correcciones necesarias para que el producto avance.',
    },
    result: {
      en: 'A prioritised risk map, the most urgent fixes shipped, and a system your team can reason about again, instead of one everyone is afraid to touch.',
      de: 'Eine priorisierte Risikoübersicht, die dringendsten Fixes ausgeliefert und ein System, das dein Team wieder nachvollziehen kann, statt eines, das niemand anfassen will.',
      es: 'Un mapa de riesgos priorizado, las correcciones más urgentes entregadas y un sistema que tu equipo vuelve a entender, en lugar de uno que nadie se atreve a tocar.',
    },
    suitableFormats: ['technical-review', 'delivery-sprint'],
    capabilities: [
      { en: 'Project takeover and recovery', de: 'Projektübernahme und -rettung', es: 'Retoma y recuperación de proyectos' },
      { en: 'Critical and difficult bug investigation', de: 'Untersuchung kritischer, schwer fassbarer Bugs', es: 'Investigación de bugs críticos y complejos' },
      { en: 'Production stabilisation', de: 'Stabilisierung der Produktion', es: 'Estabilización de producción' },
      { en: 'Performance improvements', de: 'Performance-Verbesserungen', es: 'Mejoras de rendimiento' },
      { en: 'Integration failures', de: 'Fehlerhafte Integrationen', es: 'Fallos de integración' },
      { en: 'Technical-debt prioritisation', de: 'Priorisierung von technischen Schulden', es: 'Priorización de deuda técnica' },
      { en: 'Delivery recovery planning', de: 'Planung zur Wiederaufnahme der Lieferung', es: 'Planificación para retomar la entrega' },
    ],
    scopeNote: {
      en: 'Senior diagnostic and recovery work, scoped as a project, not inexpensive hourly bug-fixing.',
      de: 'Fundierte Diagnose- und Rettungsarbeit als abgegrenztes Projekt, keine günstige stundenweise Fehlerbehebung.',
      es: 'Trabajo senior de diagnóstico y recuperación con alcance de proyecto, no corrección de bugs económica por hora.',
    },
  },
  {
    slug: 'modernize-scale',
    title: {
      en: 'Modernize & Scale',
      de: 'Modernisieren & Skalieren',
      es: 'Modernizar y Escalar',
    },
    trigger: {
      en: 'The product works, framework versions have drifted, the database groans under load, and every deploy is a small leap of faith.',
      de: 'Das Produkt läuft, Framework-Versionen sind veraltet, die Datenbank ächzt unter Last, und jedes Deployment ist ein kleiner Vertrauensvorschuss.',
      es: 'El producto funciona, las versiones de los frameworks han quedado atrás, la base de datos sufre bajo carga y cada despliegue es un pequeño acto de fe.',
    },
    body: {
      en: 'Modernize an existing product without losing control of production. I plan and deliver incremental changes that improve maintainability, delivery speed, and operational reliability.',
      de: 'Ein bestehendes Produkt modernisieren, ohne die Kontrolle über die Produktion zu verlieren. Ich plane und liefere schrittweise Änderungen, die Wartbarkeit, Liefergeschwindigkeit und Betriebssicherheit verbessern.',
      es: 'Modernizo un producto existente sin perder el control de producción. Planifico y entrego cambios incrementales que mejoran la mantenibilidad, la velocidad de entrega y la fiabilidad operativa.',
    },
    result: {
      en: 'A system that is measurably easier to operate and change safely, delivered as incremental steps rather than a risky big-bang rewrite.',
      de: 'Ein System, das sich nachweisbar leichter betreiben und sicher ändern lässt, geliefert in schrittweisen Etappen statt als riskanter Big-Bang-Rewrite.',
      es: 'Un sistema que es demostrablemente más fácil de operar y cambiar con seguridad, entregado en pasos incrementales en lugar de una reescritura arriesgada de una sola vez.',
    },
    suitableFormats: ['delivery-sprint', 'ongoing-partnership'],
    caseStudySlug: 'iot-data-platform',
    capabilities: [
      { en: 'JavaScript-to-TypeScript migrations', de: 'Migration von JavaScript zu TypeScript', es: 'Migraciones de JavaScript a TypeScript' },
      { en: 'Framework and dependency upgrades', de: 'Framework- und Dependency-Upgrades', es: 'Actualización de frameworks y dependencias' },
      { en: 'API and service modernisation', de: 'Modernisierung von APIs und Services', es: 'Modernización de APIs y servicios' },
      { en: 'Database and data-flow improvements', de: 'Verbesserungen an Datenbank und Datenflüssen', es: 'Mejoras de base de datos y flujos de datos' },
      { en: 'AWS, serverless, and container migrations', de: 'Migrationen zu AWS, Serverless und Containern', es: 'Migraciones a AWS, serverless y contenedores' },
      { en: 'Docker and Kubernetes', de: 'Docker und Kubernetes', es: 'Docker y Kubernetes' },
      { en: 'CI/CD improvements', de: 'CI/CD-Verbesserungen', es: 'Mejoras de CI/CD' },
      { en: 'Monitoring and observability', de: 'Monitoring und Observability', es: 'Monitorización y observabilidad' },
      { en: 'Architecture decision support', de: 'Unterstützung bei Architekturentscheidungen', es: 'Apoyo en decisiones de arquitectura' },
    ],
    scopeNote: {
      en: 'Delivered as scoped engagements, not a 24/7 managed-operations or on-call SRE service.',
      de: 'Als abgegrenzte Projekte geliefert, kein 24/7-Managed-Operations- oder On-Call-SRE-Service.',
      es: 'Entregado como proyectos con alcance definido, no un servicio de operaciones gestionadas 24/7 ni de guardia SRE.',
    },
  },
];

export const engagementFormats: EngagementFormat[] = [
  {
    slug: 'technical-review',
    title: {
      en: 'Technical Review',
      de: 'Technisches Review',
      es: 'Revisión Técnica',
    },
    duration: { en: '1–2 weeks', de: '1–2 Wochen', es: '1–2 semanas' },
    body: {
      en: 'An outside, senior look at your architecture, code, or a specific performance or reliability problem, before you commit budget to a larger build.',
      de: 'Ein externer, erfahrener Blick auf deine Architektur, deinen Code oder ein konkretes Performance- oder Zuverlässigkeitsproblem, bevor du Budget für einen größeren Umbau bindest.',
      es: 'Una mirada externa y senior a tu arquitectura, tu código o un problema concreto de rendimiento o fiabilidad, antes de comprometer presupuesto en un desarrollo mayor.',
    },
    deliverables: [
      { en: 'Architecture and code review', de: 'Architektur- und Code-Review', es: 'Revisión de arquitectura y código' },
      { en: 'Performance or reliability investigation', de: 'Untersuchung zu Performance oder Zuverlässigkeit', es: 'Investigación de rendimiento o fiabilidad' },
      { en: 'Prioritised risk map', de: 'Priorisierte Risikoübersicht', es: 'Mapa de riesgos priorizado' },
      { en: 'Recommended technical decisions', de: 'Empfohlene technische Entscheidungen', es: 'Decisiones técnicas recomendadas' },
      { en: 'A practical 30/60/90-day implementation plan', de: 'Ein praktischer 30/60/90-Tage-Umsetzungsplan', es: 'Un plan de implementación práctico a 30/60/90 días' },
      { en: 'Review handover call', de: 'Abschließender Übergabe-Call', es: 'Llamada de entrega del review' },
    ],
    priceNote: {
      en: 'Fixed scope after an initial fit call.',
      de: 'Fester Umfang nach einem ersten Kennenlern-Call.',
      es: 'Alcance fijo tras una primera llamada de encaje.',
    },
  },
  {
    slug: 'delivery-sprint',
    title: {
      en: 'Delivery or Recovery Sprint',
      de: 'Liefer- oder Recovery-Sprint',
      es: 'Sprint de Entrega o Recuperación',
    },
    duration: { en: 'Typically 4–8 weeks', de: 'In der Regel 4–8 Wochen', es: 'Normalmente 4–8 semanas' },
    body: {
      en: 'A defined objective, milestones, acceptance criteria, and a technical handover, whether the work is new delivery or recovering one that stalled.',
      de: 'Ein definiertes Ziel, Meilensteine, Abnahmekriterien und eine technische Übergabe, egal ob es um neue Lieferung oder die Rettung eines feststeckenden Projekts geht.',
      es: 'Un objetivo definido, hitos, criterios de aceptación y un traspaso técnico, ya sea para una entrega nueva o para recuperar una que se detuvo.',
    },
    deliverables: [
      { en: 'Agreed milestones and acceptance criteria', de: 'Vereinbarte Meilensteine und Abnahmekriterien', es: 'Hitos y criterios de aceptación acordados' },
      { en: 'Regular delivery check-ins', de: 'Regelmäßige Status-Updates', es: 'Seguimientos periódicos de avance' },
      { en: 'Documented technical handover', de: 'Dokumentierte technische Übergabe', es: 'Traspaso técnico documentado' },
    ],
    priceNote: {
      en: 'Fixed scope after an initial fit call.',
      de: 'Fester Umfang nach einem ersten Kennenlern-Call.',
      es: 'Alcance fijo tras una primera llamada de encaje.',
    },
  },
  {
    slug: 'focused-mvp',
    title: {
      en: 'Focused MVP',
      de: 'Fokussiertes MVP',
      es: 'MVP Acotado',
    },
    duration: { en: 'Approximately 6–12 weeks, depending on scope', de: 'Etwa 6–12 Wochen, je nach Umfang', es: 'Aproximadamente 6–12 semanas, según el alcance' },
    body: {
      en: 'A carefully limited product taken from technical discovery to a production release. Scope is fixed deliberately: an unlimited startup product cannot be guaranteed inside a fixed timeframe, so we agree what is in before work starts.',
      de: 'Ein bewusst begrenztes Produkt, geführt von der technischen Konzeption bis zum Produktivrelease. Der Umfang wird gezielt festgelegt: Ein unbegrenztes Startup-Produkt lässt sich nicht in einem festen Zeitrahmen garantieren, deshalb legen wir vor Beginn fest, was enthalten ist.',
      es: 'Un producto deliberadamente acotado, llevado desde la exploración técnica hasta un release en producción. El alcance se fija a propósito: un producto de startup sin límites no puede garantizarse en un plazo fijo, así que acordamos qué entra antes de empezar.',
    },
    deliverables: [
      { en: 'Technical discovery and scoping', de: 'Technische Konzeption und Scoping', es: 'Exploración técnica y definición de alcance' },
      { en: 'Architecture and build', de: 'Architektur und Umsetzung', es: 'Arquitectura y desarrollo' },
      { en: 'Production deployment', de: 'Produktiv-Deployment', es: 'Despliegue en producción' },
      { en: 'Handover documentation', de: 'Übergabedokumentation', es: 'Documentación de traspaso' },
    ],
    priceNote: {
      en: 'Fixed scope after an initial fit call.',
      de: 'Fester Umfang nach einem ersten Kennenlern-Call.',
      es: 'Alcance fijo tras una primera llamada de encaje.',
    },
  },
  {
    slug: 'ongoing-partnership',
    title: {
      en: 'Ongoing Delivery Partnership',
      de: 'Laufende Delivery-Partnerschaft',
      es: 'Colaboración Continua de Entrega',
    },
    duration: { en: '3+ months', de: 'ab 3 Monaten', es: 'a partir de 3 meses' },
    body: {
      en: 'A delivery partnership, not an embedded-employee relationship: independent working practices, sustained over time, delivered as a series of scoped phases rather than one open-ended commitment.',
      de: 'Eine Delivery-Partnerschaft, kein Angestelltenverhältnis: eigenständige Arbeitsweise über einen längeren Zeitraum, geliefert als Reihe abgegrenzter Phasen statt als eine offene Verpflichtung.',
      es: 'Una colaboración de entrega, no una relación de empleado integrado: forma de trabajo independiente sostenida en el tiempo, entregada como una serie de fases con alcance definido en lugar de un compromiso abierto.',
    },
    deliverables: [
      { en: 'A fixed-scope statement of work per phase, not one indefinite scope', de: 'Ein Angebot mit festem Umfang pro Phase, kein unbegrenzter Gesamtumfang', es: 'Una propuesta de alcance fijo por fase, no un alcance indefinido único' },
      { en: 'Direct ownership of an area of the system', de: 'Direkte Verantwortung für einen Systembereich', es: 'Responsabilidad directa sobre un área del sistema' },
      { en: 'Regular delivery reporting', de: 'Regelmäßiges Delivery-Reporting', es: 'Reporte periódico de avance' },
      { en: 'A review before each phase renews, so scope is re-agreed rather than assumed', de: 'Ein Review vor jeder Phasenverlängerung, sodass der Umfang neu vereinbart statt vorausgesetzt wird', es: 'Una revisión antes de renovar cada fase, para volver a acordar el alcance en lugar de asumirlo' },
    ],
    priceNote: {
      en: 'Scoped and priced phase by phase, each agreed before it starts.',
      de: 'Phase für Phase kalkuliert, jede Phase wird vor Beginn vereinbart.',
      es: 'Cotizada fase por fase, cada una acordada antes de comenzar.',
    },
  },
];

export const processSteps: ProcessStep[] = [
  {
    title: { en: '30-minute fit call', de: '30-minütiger Kennenlern-Call', es: 'Llamada de encaje de 30 minutos' },
    body: {
      en: 'We talk through the current situation, the outcome you need, and the timeframe. You get an honest read on whether it is a good fit.',
      de: 'Wir besprechen die aktuelle Situation, das gewünschte Ergebnis und den Zeitrahmen. Du bekommst eine ehrliche Einschätzung, ob es passt.',
      es: 'Hablamos sobre la situación actual, el resultado que necesitas y el plazo. Recibes una valoración honesta de si encajamos.',
    },
  },
  {
    title: { en: 'Scope and proposal', de: 'Umfang und Angebot', es: 'Alcance y propuesta' },
    body: {
      en: 'For anything beyond a review, I send a short written proposal: scope, milestones, and what "done" looks like.',
      de: 'Für alles über ein Review hinaus schicke ich ein kurzes schriftliches Angebot: Umfang, Meilensteine und was „fertig" bedeutet.',
      es: 'Para cualquier trabajo más allá de una revisión, envío una propuesta breve por escrito: alcance, hitos y qué significa "terminado".',
    },
  },
  {
    title: { en: 'Delivery', de: 'Umsetzung', es: 'Entrega' },
    body: {
      en: 'Work happens in the open: regular check-ins, visible progress, and decisions explained as they are made, not after the fact.',
      de: 'Die Arbeit läuft transparent ab: regelmäßige Updates, sichtbarer Fortschritt und Entscheidungen, die erklärt werden, sobald sie fallen.',
      es: 'El trabajo avanza de forma transparente: seguimientos regulares, progreso visible y decisiones explicadas en el momento en que se toman.',
    },
  },
  {
    title: { en: 'Handover', de: 'Übergabe', es: 'Traspaso' },
    body: {
      en: 'Every engagement ends with documentation your team can maintain, not a dependency on me staying involved.',
      de: 'Jedes Projekt endet mit einer Dokumentation, die dein Team pflegen kann, nicht mit einer Abhängigkeit von meiner fortlaufenden Beteiligung.',
      es: 'Cada colaboración termina con documentación que tu equipo puede mantener, no con una dependencia de que yo siga involucrado.',
    },
  },
];

export const faqs: Faq[] = [
  {
    question: {
      en: 'Do you work with early-stage startups or only established companies?',
      de: 'Arbeitest du mit Startups in der Frühphase oder nur mit etablierten Unternehmen?',
      es: '¿Trabajas con startups en fase temprana o solo con empresas ya establecidas?',
    },
    answer: {
      en: 'Both: it depends on scope, not company size. A focused MVP or a technical review fits an early-stage team well; a recovery sprint or ongoing partnership tends to suit a product that already has real users.',
      de: 'Beides: Es hängt vom Umfang ab, nicht von der Unternehmensgröße. Ein fokussiertes MVP oder ein technisches Review passt gut zu einem frühen Team; ein Recovery-Sprint oder eine laufende Partnerschaft passt eher zu einem Produkt mit echten Nutzern.',
      es: 'Ambos: depende del alcance, no del tamaño de la empresa. Un MVP acotado o una revisión técnica encajan bien con un equipo en fase temprana; un sprint de recuperación o una colaboración continua suelen encajar con un producto que ya tiene usuarios reales.',
    },
  },
  {
    question: {
      en: 'Can you work with clients outside Germany?',
      de: 'Arbeitest du auch mit Kunden außerhalb Deutschlands?',
      es: '¿Trabajas con clientes fuera de Alemania?',
    },
    answer: {
      en: 'Yes. I am based in Munich and work with clients across Germany and the EU, plus US clients in compatible time zones.',
      de: 'Ja. Ich bin in München ansässig und arbeite mit Kunden in Deutschland und der EU sowie mit US-Kunden in kompatiblen Zeitzonen.',
      es: 'Sí. Estoy en Múnich y trabajo con clientes en Alemania y la UE, además de clientes en EE. UU. en husos horarios compatibles.',
    },
  },
  {
    question: {
      en: 'How do you price a project?',
      de: 'Wie kalkulierst du ein Projekt?',
      es: '¿Cómo se calcula el precio de un proyecto?',
    },
    answer: {
      en: 'Every engagement is scoped and priced after an initial fit call, once I understand what needs to happen. You get a fixed-scope proposal, not an open-ended hourly estimate.',
      de: 'Jedes Projekt wird nach einem ersten Kennenlern-Call kalkuliert, sobald klar ist, worum es geht. Du bekommst ein Angebot mit festem Umfang, keine offene Stundenschätzung.',
      es: 'Cada colaboración se define y se cotiza después de una primera llamada de encaje, una vez que entiendo qué hay que hacer: recibes una propuesta de alcance fijo, no una estimación abierta por horas.',
    },
  },
  {
    question: {
      en: 'Do you sign NDAs?',
      de: 'Unterschreibst du NDAs?',
      es: '¿Firmas acuerdos de confidencialidad (NDA)?',
    },
    answer: {
      en: 'Yes. Several of the case studies on this site are already described at the level of detail their clients agreed to, or with names withheld. The same practice applies to new engagements.',
      de: 'Ja. Mehrere Fallstudien auf dieser Seite sind bereits nur in dem Detailgrad beschrieben, dem die jeweiligen Kunden zugestimmt haben, oder ohne Namensnennung. Dieselbe Praxis gilt für neue Projekte.',
      es: 'Sí. Varios de los casos de estudio de este sitio ya están descritos con el nivel de detalle que sus clientes autorizaron, o sin mencionar el nombre, la misma práctica se aplica a proyectos nuevos.',
    },
  },
  {
    question: {
      en: 'What is the typical response time if I reach out?',
      de: 'Wie schnell antwortest du normalerweise?',
      es: '¿Cuál es el tiempo de respuesta habitual si te escribo?',
    },
    answer: {
      en: 'Under 48 hours, typically. Booking a fit call directly skips the back-and-forth entirely.',
      de: 'In der Regel unter 48 Stunden. Ein direkt gebuchter Kennenlern-Call spart das Hin und Her.',
      es: 'Normalmente menos de 48 horas. Reservar una llamada de encaje directamente evita el ida y vuelta de correos.',
    },
  },
  {
    question: {
      en: 'What languages do you work in?',
      de: 'In welchen Sprachen arbeitest du?',
      es: '¿En qué idiomas trabajas?',
    },
    answer: {
      en: 'English and Spanish day to day. German is at an early conversational level and improving. Most client work happens in English regardless of where the team is based.',
      de: 'Im Alltag Englisch und Spanisch. Deutsch befindet sich auf einem frühen Konversationsniveau und wird laufend besser. Die meiste Kundenarbeit läuft ohnehin auf Englisch, unabhängig vom Standort des Teams.',
      es: 'En el día a día, inglés y español. El alemán está en un nivel conversacional inicial y sigue mejorando: la mayor parte del trabajo con clientes se hace en inglés, independientemente de dónde esté el equipo.',
    },
  },
  {
    question: {
      en: 'What industries have you worked in?',
      de: 'In welchen Branchen hast du bereits gearbeitet?',
      es: '¿En qué industrias has trabajado?',
    },
    answer: {
      en: 'Commerce and retail, industrial IoT, healthcare and clinical data, and event and ticketing platforms. The case studies on this site walk through examples of each.',
      de: 'Handel und Retail, industrielles IoT, Gesundheitswesen und klinische Daten sowie Event- und Ticketing-Plattformen. Die Fallstudien auf dieser Seite zeigen Beispiele aus jedem Bereich.',
      es: 'Comercio y retail, IoT industrial, salud y datos clínicos, y plataformas de eventos y ticketing: los casos de estudio de este sitio muestran ejemplos de cada una.',
    },
  },
];
