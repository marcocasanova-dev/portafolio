export const languages = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
} as const;

export const defaultLang = 'en' satisfies keyof typeof languages;

export type Lang = keyof typeof languages;

/** OG/`hreflang` locale codes. */
export const localeCodes: Record<Lang, string> = {
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
};

/**
 * All user-facing chrome. Keys are shared across locales so a missing Spanish
 * string falls back to English rather than rendering the raw key.
 */
export const ui = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.howIWork': 'How I Work',
    'nav.about': 'About',
    'nav.insights': 'Insights',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to content',
    'nav.menu': 'Menu',
    'nav.closeMenu': 'Close menu',

    'hero.eyebrow': 'Independent senior software engineer · Munich · Europe and US remote',
    'hero.title': 'I build, rescue and modernize data-heavy web and mobile products.',
    'hero.subtitle':
      'From focused MVPs and stalled projects to API migrations and production reliability, I help product teams deliver software that works in the real world. TypeScript/Node.js, Python/FastAPI, PostgreSQL, AWS, and React Native.',
    'hero.ctaPrimary': 'Discuss a project',
    'hero.ctaSecondary': 'See relevant work',
    'hero.yearsLabel': 'years shipping production software',
    'hero.proofDomains': 'Commerce, industrial IoT, healthcare and event technology',
    'hero.proofHeading': 'Ways to work together',
    'hero.nextAvailability': 'Next availability',

    'home.selectedWork': 'Featured case studies',
    'home.selectedWorkSub':
      'Mobile commerce, industrial IoT telemetry, and clinical data systems: the constraints, the decisions, and what shipped.',
    'home.viewAllWork': 'See all work',
    'home.clients': 'Selected teams',
    'home.problemsHeading': 'Problems I get called in for',
    'home.problemsSub':
      'If one of these sounds familiar, that is usually where the conversation starts.',
    'home.servicesHeading': 'Three ways I help',
    'home.servicesSub':
      'Each area is outcome-focused, not a generic technology list. See the full scope of each on the Services page.',
    'home.servicesCta': 'See all services',
    'home.formatsHeading': 'How you can engage me',
    'home.formatsSub':
      'Separate from what I do is how you buy it: a fixed-scope engagement shaped to the size of the problem.',
    'home.formatsCta': 'See how I work',
    'home.processHeading': 'How the engagement works',
    'home.processSub': 'The same four steps whether the work is a review or a multi-month build.',
    'home.faqHeading': 'Frequently asked questions',
    'home.faqSub': 'The questions that usually come up before a fit call.',
    'home.finalCtaSub':
      'Share the situation and the timeframe. A 30-minute call is the fastest way to find out if it is a fit.',

    'about.title': 'About',
    'about.heading': 'Production engineering, end to end.',

    'work.title': 'Work',
    'work.subtitle':
      'Case studies from production systems: the constraints, the architecture, and what actually shipped.',
    'work.filterAll': 'All',
    'work.empty': 'No projects match this filter yet.',
    'work.featuredHeading': 'Featured case studies',
    'work.additionalHeading': 'Additional projects',

    'project.role': 'Role',
    'project.year': 'Year',
    'project.client': 'Client',
    'project.stack': 'Stack',
    'project.sectors': 'Sectors',
    'project.viewSource': 'View source',
    'project.liveDemo': 'Live demo',
    'project.watchDemo': 'Watch demo',
    'project.back': 'All projects',
    'project.next': 'Next project',
    'project.gallery': 'Screens',

    'blog.title': 'Insights',
    'blog.subtitle':
      'Deep dives on the things that bite you in production: rendering costs, event loops, and security you cannot bolt on later.',
    'blog.readTime': 'min read',
    'blog.back': 'All posts',
    'blog.published': 'Published',
    'blog.updated': 'Updated',
    'blog.empty': 'No posts published yet.',
    'blog.rss': 'RSS feed',

    'contact.title': 'Contact',
    'contact.heading': 'Tell me what needs to ship, improve or recover.',
    'contact.subtitle':
      'Share the current situation, the result you need, and the timeframe. I will tell you honestly whether I am a good fit and what the most practical next step would be.',
    'contact.emailLabel': 'Email me',
    'contact.callLabel': 'Book a 30-minute fit call',
    'contact.callDesc':
      'A free 30-minute call. Bring an architecture diagram, a slow query, or whatever is currently on fire.',
    'contact.githubLabel': 'GitHub',
    'contact.linkedinLabel': 'LinkedIn',
    'contact.responseTime': 'Typical reply time: under 48 hours',
    'contact.mailtoSubject': 'Project inquiry',
    'contact.fieldCompany': 'Company',
    'contact.fieldNeed': 'What do you need help with?',
    'contact.fieldTimeline': 'Desired timeline',
    'contact.fieldBudget': 'Approximate budget range',
    'contact.fieldMessage': 'Message',
    'contact.projectColumn': 'Start a project',
    'contact.projectDesc':
      'Bring an architecture diagram, a slow query, or whatever is currently on fire.',

    'footer.builtWith': 'Built with Astro, Tailwind, and too much coffee.',
    'footer.rights': 'All rights reserved.',
    'footer.sourceCode': 'Source',
    'footer.legalImpressum': 'Impressum',
    'footer.legalPrivacy': 'Privacy',

    'theme.toggle': 'Toggle theme',
    'lang.switch': 'Change language',

    '404.title': 'Page not found',
    '404.subtitle': 'That route does not exist. It may have moved.',
    '404.cta': 'Back home',

    'home.decisions': 'How I make calls',
    'home.decisionsSub':
      'Three production decisions: the constraint, the alternative I rejected, and the consequence of the choice.',
    'home.readDecision': 'Read the full decision',
    'home.openCaseStudy': 'Open case study',
    'home.carouselPrev': 'Previous project',
    'home.carouselNext': 'Next project',

    'about.meta': 'Based in',
    'about.clientsLabel': 'Worked with',
    'about.servicesDoor': 'Building something? See how I work',
    'about.stackTitle': 'Stack, in full',
    'about.languages': 'Languages',
    'about.seniority': 'Level',
    'profile.location': 'Munich, Germany',
    'profile.locationShort': 'Munich-based',
    'profile.languagesValue': 'Spanish: native · English: C1 · German: A1/A2',

    'cv.download': 'Download profile',

    'project.outcome': 'Outcome',
    'project.tradeoff': 'Key decision',
    'project.status': 'Status',
    'project.engagement': 'Engagement',
    'project.duration': 'Duration',
    'project.teamSize': 'Team',
    'project.ownership': 'I owned',
    'project.relationship': 'Relationship',
    'project.relationshipEmployee': 'Employee',
    'project.relationshipContractor': 'Contractor',
    'project.relationshipDirect': 'Direct client',

    'services.title': 'Services',
    'services.positioning':
      'Independent senior software engineer for data-heavy web, mobile and backend products. Three outcome-focused areas, each scoped to a defined engagement rather than open-ended hours.',
    'services.capabilitiesLabel': 'What this includes',
    'services.floorLabel': 'Engagements typically start around',
    'services.floorNote':
      'Below that, a technical review is usually the better use of your budget.',
    'services.availability': 'Next availability',
    'services.availabilityFallback': 'Availability on request.',
    'services.antiAgency':
      'You are talking to the person who writes the code. There is no account manager.',
    'services.cta': 'Book a fit call',

    'howiwork.eyebrow': 'How I Work',
    'howiwork.heading': 'Four ways to buy the work, one honest process.',
    'howiwork.subtitle':
      'The service areas describe what I do; this page describes how an engagement is shaped, scoped, and delivered.',
    'howiwork.formatsHeading': 'Engagement formats',
    'howiwork.formatsSub':
      'Pick the shape that matches the problem: each is a fixed-scope engagement, not an open-ended retainer.',
    'howiwork.deliverablesLabel': 'Typically includes',
    'howiwork.processHeading': 'The process',
    'howiwork.processSub': 'The same four steps regardless of engagement format.',
    'howiwork.faqCta': 'Common questions are answered on the homepage FAQ.',

    'legal.draftBanner':
      'Draft: pending legal review. This page is not yet a complete Impressum or privacy notice; contact me directly for anything that depends on it.',
    'legal.backHome': 'Back to homepage',

    'seo.homeTitle': 'Freelance Backend & Product Engineer Munich',
    'seo.homeDescription':
      'Independent senior software engineer for TypeScript/Node.js, Python/FastAPI, PostgreSQL, AWS and React Native projects. MVP delivery, project recovery, and software modernisation.',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.work': 'Proyectos',
    'nav.howIWork': 'Cómo Trabajo',
    'nav.about': 'Sobre mí',
    'nav.insights': 'Perspectivas',
    'nav.contact': 'Contacto',
    'nav.skipToContent': 'Saltar al contenido',
    'nav.menu': 'Menú',
    'nav.closeMenu': 'Cerrar menú',

    'hero.eyebrow': 'Ingeniero de software senior independiente · Múnich · Europa y remoto en EE. UU.',
    'hero.title': 'Construyo, rescato y modernizo productos web y móviles con mucho peso de datos.',
    'hero.subtitle':
      'Desde MVPs acotados y proyectos estancados hasta migraciones de API y fiabilidad en producción, ayudo a equipos de producto a entregar software que funciona en el mundo real. TypeScript/Node.js, Python/FastAPI, PostgreSQL, AWS y React Native.',
    'hero.ctaPrimary': 'Hablemos de tu proyecto',
    'hero.ctaSecondary': 'Ver proyectos relevantes',
    'hero.yearsLabel': 'años desarrollando software en producción',
    'hero.proofDomains': 'Comercio, IoT industrial, salud y tecnología de eventos',
    'hero.proofHeading': 'Formas de colaborar',
    'hero.nextAvailability': 'Próxima disponibilidad',

    'home.selectedWork': 'Casos de estudio destacados',
    'home.selectedWorkSub':
      'Mobile commerce, telemetría IoT industrial y sistemas de datos clínicos: las restricciones, las decisiones y qué se entregó.',
    'home.viewAllWork': 'Ver todos los proyectos',
    'home.clients': 'Equipos seleccionados',
    'home.problemsHeading': 'Los problemas por los que suelen llamarme',
    'home.problemsSub': 'Si algo de esto te suena familiar, ahí suele empezar la conversación.',
    'home.servicesHeading': 'Tres formas de ayudar',
    'home.servicesSub':
      'Cada área está orientada a resultados, no es una lista genérica de tecnologías. El alcance completo de cada una está en la página de Servicios.',
    'home.servicesCta': 'Ver todos los servicios',
    'home.formatsHeading': 'Cómo puedes contratarme',
    'home.formatsSub':
      'Además de qué hago, importa cómo se compra: un proyecto de alcance fijo, ajustado al tamaño del problema.',
    'home.formatsCta': 'Ver cómo trabajo',
    'home.processHeading': 'Cómo funciona la colaboración',
    'home.processSub': 'Los mismos cuatro pasos, ya sea una revisión o un desarrollo de varios meses.',
    'home.faqHeading': 'Preguntas frecuentes',
    'home.faqSub': 'Lo que suele preguntarse antes de una llamada de encaje.',
    'home.finalCtaSub':
      'Cuéntame la situación y el plazo. Una llamada de 30 minutos es la forma más rápida de saber si encajamos.',

    'about.title': 'Sobre mí',
    'about.heading': 'Ingeniería de producción, de punta a punta.',

    'work.title': 'Proyectos',
    'work.subtitle':
      'Casos de estudio de sistemas en producción: las restricciones, la arquitectura y lo que realmente se entregó.',
    'work.filterAll': 'Todos',
    'work.empty': 'Ningún proyecto coincide con este filtro todavía.',
    'work.featuredHeading': 'Casos de estudio destacados',
    'work.additionalHeading': 'Proyectos adicionales',

    'project.role': 'Rol',
    'project.year': 'Año',
    'project.client': 'Cliente',
    'project.stack': 'Stack',
    'project.sectors': 'Sectores',
    'project.viewSource': 'Ver código',
    'project.liveDemo': 'Demo en vivo',
    'project.watchDemo': 'Ver demo',
    'project.back': 'Todos los proyectos',
    'project.next': 'Siguiente proyecto',
    'project.gallery': 'Pantallas',

    'blog.title': 'Perspectivas',
    'blog.subtitle':
      'Análisis a fondo de lo que duele en producción: costes de renderizado, event loops y seguridad que no se puede añadir al final.',
    'blog.readTime': 'min de lectura',
    'blog.back': 'Todos los artículos',
    'blog.published': 'Publicado',
    'blog.updated': 'Actualizado',
    'blog.empty': 'Aún no hay artículos publicados.',
    'blog.rss': 'Feed RSS',

    'contact.title': 'Contacto',
    'contact.heading': 'Cuéntame qué necesitas entregar, mejorar o recuperar.',
    'contact.subtitle':
      'Cuéntame la situación actual, el resultado que necesitas y el plazo. Te diré con honestidad si encajo y cuál sería el siguiente paso más práctico.',
    'contact.emailLabel': 'Escríbeme',
    'contact.callLabel': 'Reserva una llamada de encaje de 30 minutos',
    'contact.callDesc':
      'Una llamada gratuita de 30 minutos. Trae un diagrama de arquitectura, una query lenta o lo que esté ardiendo ahora mismo.',
    'contact.githubLabel': 'GitHub',
    'contact.linkedinLabel': 'LinkedIn',
    'contact.responseTime': 'Tiempo de respuesta habitual: menos de 48 horas',
    'contact.mailtoSubject': 'Consulta de proyecto',
    'contact.fieldCompany': 'Empresa',
    'contact.fieldNeed': '¿En qué necesitas ayuda?',
    'contact.fieldTimeline': 'Plazo deseado',
    'contact.fieldBudget': 'Rango de presupuesto aproximado',
    'contact.fieldMessage': 'Mensaje',
    'contact.projectColumn': 'Empecemos un proyecto',
    'contact.projectDesc':
      'Trae un diagrama de arquitectura, una query lenta o lo que esté ardiendo ahora mismo.',

    'footer.builtWith': 'Hecho con Astro, Tailwind y demasiado café.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.sourceCode': 'Código',
    'footer.legalImpressum': 'Impressum',
    'footer.legalPrivacy': 'Privacidad',

    'theme.toggle': 'Cambiar tema',
    'lang.switch': 'Cambiar idioma',

    '404.title': 'Página no encontrada',
    '404.subtitle': 'Esa ruta no existe. Puede que se haya movido.',
    '404.cta': 'Volver al inicio',

    'home.decisions': 'Cómo tomo decisiones',
    'home.decisionsSub':
      'Tres decisiones de producción: la restricción, la alternativa que descarté y la consecuencia de la elección.',
    'home.readDecision': 'Leer la decisión completa',
    'home.openCaseStudy': 'Abrir caso de estudio',
    'home.carouselPrev': 'Proyecto anterior',
    'home.carouselNext': 'Siguiente proyecto',

    'about.meta': 'Ubicado en',
    'about.clientsLabel': 'He trabajado con',
    'about.servicesDoor': '¿Estás construyendo algo? Así trabajo',
    'about.stackTitle': 'Stack completo',
    'about.languages': 'Idiomas',
    'about.seniority': 'Nivel',
    'profile.location': 'Múnich, Alemania',
    'profile.locationShort': 'Con base en Múnich',
    'profile.languagesValue': 'Español: nativo · Inglés: C1 · Alemán: A1/A2',

    'cv.download': 'Descargar perfil',

    'project.outcome': 'Resultado',
    'project.tradeoff': 'Decisión clave',
    'project.status': 'Estado',
    'project.engagement': 'Colaboración',
    'project.duration': 'Duración',
    'project.teamSize': 'Equipo',
    'project.ownership': 'Yo era responsable de',
    'project.relationship': 'Relación',
    'project.relationshipEmployee': 'Empleado',
    'project.relationshipContractor': 'Contratista',
    'project.relationshipDirect': 'Cliente directo',

    'services.title': 'Servicios',
    'services.positioning':
      'Ingeniero de software senior independiente para productos web, móviles y backend con mucho peso de datos. Tres áreas orientadas a resultados, cada una con el alcance de un proyecto definido y no de horas abiertas.',
    'services.capabilitiesLabel': 'Qué incluye',
    'services.floorLabel': 'Los proyectos suelen empezar alrededor de',
    'services.floorNote':
      'Por debajo de eso, una revisión técnica suele aprovechar mejor tu presupuesto.',
    'services.availability': 'Próxima disponibilidad',
    'services.availabilityFallback': 'Disponibilidad a consultar.',
    'services.antiAgency':
      'Hablas directamente con quien escribe el código. No hay gestor de cuentas.',
    'services.cta': 'Reservar una llamada de encaje',

    'howiwork.eyebrow': 'Cómo Trabajo',
    'howiwork.heading': 'Cuatro formas de contratar el trabajo, un proceso honesto.',
    'howiwork.subtitle':
      'Las áreas de servicio describen qué hago; esta página describe cómo se define, acota y entrega una colaboración.',
    'howiwork.formatsHeading': 'Formatos de colaboración',
    'howiwork.formatsSub':
      'Elige el formato que encaje con el problema, cada uno es un proyecto de alcance fijo, no una retención abierta.',
    'howiwork.deliverablesLabel': 'Suele incluir',
    'howiwork.processHeading': 'El proceso',
    'howiwork.processSub': 'Los mismos cuatro pasos, sea cual sea el formato de colaboración.',
    'howiwork.faqCta': 'Las preguntas más comunes están respondidas en las FAQ de la portada.',

    'legal.draftBanner':
      'Borrador: pendiente de revisión legal. Esta página aún no es un Impressum o aviso de privacidad completo; escríbeme directamente para cualquier cuestión que dependa de ella.',
    'legal.backHome': 'Volver al inicio',

    'seo.homeTitle': 'Ingeniero de Software Freelance en Múnich',
    'seo.homeDescription':
      'Ingeniero de software senior independiente para proyectos de TypeScript/Node.js, Python/FastAPI, PostgreSQL, AWS y React Native. Desarrollo de MVPs, recuperación de proyectos y modernización de software.',
  },
  de: {
    'nav.home': 'Start',
    'nav.services': 'Leistungen',
    'nav.work': 'Projekte',
    'nav.howIWork': 'So arbeite ich',
    'nav.about': 'Über mich',
    'nav.insights': 'Einblicke',
    'nav.contact': 'Kontakt',
    'nav.skipToContent': 'Zum Inhalt springen',
    'nav.menu': 'Menü',
    'nav.closeMenu': 'Menü schließen',

    'hero.eyebrow': 'Unabhängiger Senior Software Engineer · München · Europa und remote in den USA',
    'hero.title': 'Ich baue, rette und modernisiere datenintensive Web- und Mobile-Produkte.',
    'hero.subtitle':
      'Von fokussierten MVPs und ins Stocken geratenen Projekten bis zu API-Migrationen und Produktionsstabilität, ich helfe Produktteams, Software auszuliefern, die in der Praxis funktioniert. TypeScript/Node.js, Python/FastAPI, PostgreSQL, AWS und React Native.',
    'hero.ctaPrimary': 'Projekt besprechen',
    'hero.ctaSecondary': 'Relevante Projekte ansehen',
    'hero.yearsLabel': 'Jahre Software in Produktion',
    'hero.proofDomains': 'Handel, industrielles IoT, Gesundheitswesen und Event-Technologie',
    'hero.proofHeading': 'Formen der Zusammenarbeit',
    'hero.nextAvailability': 'Nächste Verfügbarkeit',

    'home.selectedWork': 'Ausgewählte Fallstudien',
    'home.selectedWorkSub':
      'Mobile Commerce, industrielle IoT-Telemetrie und klinische Datensysteme: die Rahmenbedingungen, die Entscheidungen und was ausgeliefert wurde.',
    'home.viewAllWork': 'Alle Projekte ansehen',
    'home.clients': 'Ausgewählte Teams',
    'home.problemsHeading': 'Womit man mich üblicherweise ruft',
    'home.problemsSub': 'Klingt eines davon vertraut, fängt das Gespräch meistens genau dort an.',
    'home.servicesHeading': 'Drei Arten, wie ich helfe',
    'home.servicesSub':
      'Jeder Bereich ist ergebnisorientiert, keine generische Technologieliste. Den vollen Umfang zeigt die Leistungen-Seite.',
    'home.servicesCta': 'Alle Leistungen ansehen',
    'home.formatsHeading': 'Wie du mich engagieren kannst',
    'home.formatsSub':
      'Neben dem Was zählt auch das Wie: ein Projekt mit festem Umfang, zugeschnitten auf die Größe des Problems.',
    'home.formatsCta': 'So arbeite ich',
    'home.processHeading': 'So läuft die Zusammenarbeit ab',
    'home.processSub': 'Dieselben vier Schritte, ob Review oder mehrmonatiger Aufbau.',
    'home.faqHeading': 'Häufige Fragen',
    'home.faqSub': 'Was vor einem Kennenlern-Call meistens gefragt wird.',
    'home.finalCtaSub':
      'Schildere die Situation und den Zeitrahmen. Ein 30-minütiger Call ist der schnellste Weg herauszufinden, ob es passt.',

    'about.title': 'Über mich',
    'about.heading': 'Produktionssysteme, von Anfang bis Ende.',

    'work.title': 'Projekte',
    'work.subtitle':
      'Fallstudien aus Produktivsystemen: die Rahmenbedingungen, die Architektur und was tatsächlich ausgeliefert wurde.',
    'work.filterAll': 'Alle',
    'work.empty': 'Noch keine Projekte für diesen Filter.',
    'work.featuredHeading': 'Ausgewählte Fallstudien',
    'work.additionalHeading': 'Weitere Projekte',

    'project.role': 'Rolle',
    'project.year': 'Jahr',
    'project.client': 'Kunde',
    'project.stack': 'Stack',
    'project.sectors': 'Branchen',
    'project.viewSource': 'Quellcode ansehen',
    'project.liveDemo': 'Live-Demo',
    'project.watchDemo': 'Demo ansehen',
    'project.back': 'Alle Projekte',
    'project.next': 'Nächstes Projekt',
    'project.gallery': 'Screens',

    'blog.title': 'Einblicke',
    'blog.subtitle':
      'Tiefgang zu den Dingen, die in Produktion wehtun: Rendering-Kosten, Event Loops und Sicherheit, die man nicht nachträglich anschrauben kann.',
    'blog.readTime': 'Min. Lesezeit',
    'blog.back': 'Alle Artikel',
    'blog.published': 'Veröffentlicht',
    'blog.updated': 'Aktualisiert',
    'blog.empty': 'Noch keine Artikel veröffentlicht.',
    'blog.rss': 'RSS-Feed',

    'contact.title': 'Kontakt',
    'contact.heading': 'Sag mir, was ausgeliefert, verbessert oder gerettet werden muss.',
    'contact.subtitle':
      'Schildere die aktuelle Situation, das gewünschte Ergebnis und den Zeitrahmen. Ich sage dir ehrlich, ob ich der richtige bin und was der praktikabelste nächste Schritt wäre.',
    'contact.emailLabel': 'E-Mail schreiben',
    'contact.callLabel': '30-minütigen Kennenlern-Call buchen',
    'contact.callDesc':
      'Ein kostenloser 30-minütiger Call. Bring ein Architekturdiagramm, eine langsame Query oder was auch immer gerade brennt.',
    'contact.githubLabel': 'GitHub',
    'contact.linkedinLabel': 'LinkedIn',
    'contact.responseTime': 'Übliche Antwortzeit: unter 48 Stunden',
    'contact.mailtoSubject': 'Projektanfrage',
    'contact.fieldCompany': 'Unternehmen',
    'contact.fieldNeed': 'Wobei brauchst du Unterstützung?',
    'contact.fieldTimeline': 'Gewünschter Zeitrahmen',
    'contact.fieldBudget': 'Ungefähres Budget',
    'contact.fieldMessage': 'Nachricht',
    'contact.projectColumn': 'Projekt starten',
    'contact.projectDesc':
      'Bring ein Architekturdiagramm, eine langsame Query oder was auch immer gerade brennt.',

    'footer.builtWith': 'Gebaut mit Astro, Tailwind und zu viel Kaffee.',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.sourceCode': 'Quellcode',
    'footer.legalImpressum': 'Impressum',
    'footer.legalPrivacy': 'Datenschutz',

    'theme.toggle': 'Design wechseln',
    'lang.switch': 'Sprache wechseln',

    '404.title': 'Seite nicht gefunden',
    '404.subtitle': 'Diese Route existiert nicht. Vielleicht wurde sie verschoben.',
    '404.cta': 'Zurück zur Startseite',

    'home.decisions': 'Wie ich entscheide',
    'home.decisionsSub':
      'Drei Entscheidungen aus Produktivsystemen: die Rahmenbedingung, die verworfene Alternative und die Konsequenz der Wahl.',
    'home.readDecision': 'Die ganze Entscheidung lesen',
    'home.openCaseStudy': 'Fallstudie öffnen',
    'home.carouselPrev': 'Vorheriges Projekt',
    'home.carouselNext': 'Nächstes Projekt',

    'about.meta': 'Ansässig in',
    'about.clientsLabel': 'Gearbeitet mit',
    'about.servicesDoor': 'Du baust etwas? So arbeite ich',
    'about.stackTitle': 'Kompletter Stack',
    'about.languages': 'Sprachen',
    'about.seniority': 'Level',
    'profile.location': 'München, Deutschland',
    'profile.locationShort': 'Aus München',
    'profile.languagesValue': 'Spanisch: Muttersprache · Englisch: C1 · Deutsch: A1/A2',

    'cv.download': 'Profil herunterladen',

    'project.outcome': 'Ergebnis',
    'project.tradeoff': 'Zentrale Entscheidung',
    'project.status': 'Status',
    'project.engagement': 'Zusammenarbeit',
    'project.duration': 'Dauer',
    'project.teamSize': 'Team',
    'project.ownership': 'Meine Verantwortung',
    'project.relationship': 'Verhältnis',
    'project.relationshipEmployee': 'Angestellt',
    'project.relationshipContractor': 'Freiberuflich',
    'project.relationshipDirect': 'Direktkunde',

    'services.title': 'Leistungen',
    'services.positioning':
      'Unabhängiger Senior Software Engineer für datenintensive Web-, Mobile- und Backend-Produkte. Drei ergebnisorientierte Bereiche, jeweils als abgegrenztes Projekt statt offener Stunden.',
    'services.capabilitiesLabel': 'Was das umfasst',
    'services.floorLabel': 'Projekte starten in der Regel ab',
    'services.floorNote':
      'Darunter ist ein technisches Review meist der bessere Einsatz deines Budgets.',
    'services.availability': 'Nächste Verfügbarkeit',
    'services.availabilityFallback': 'Verfügbarkeit auf Anfrage.',
    'services.antiAgency':
      'Du sprichst direkt mit der Person, die den Code schreibt. Es gibt keinen Account Manager.',
    'services.cta': 'Kennenlern-Call buchen',

    'howiwork.eyebrow': 'So arbeite ich',
    'howiwork.heading': 'Vier Wege, die Arbeit zu beauftragen, ein ehrlicher Prozess.',
    'howiwork.subtitle':
      'Die Leistungsbereiche beschreiben, was ich tue; diese Seite beschreibt, wie ein Projekt zugeschnitten, abgegrenzt und geliefert wird.',
    'howiwork.formatsHeading': 'Formen der Zusammenarbeit',
    'howiwork.formatsSub':
      'Wähle die Form, die zum Problem passt: jede ist ein Projekt mit festem Umfang, kein offenes Dauermandat.',
    'howiwork.deliverablesLabel': 'Umfasst in der Regel',
    'howiwork.processHeading': 'Der Ablauf',
    'howiwork.processSub': 'Dieselben vier Schritte, unabhängig von der gewählten Form.',
    'howiwork.faqCta': 'Häufige Fragen sind in den FAQ auf der Startseite beantwortet.',

    'legal.draftBanner':
      'Entwurf: ausstehende rechtliche Prüfung. Diese Seite ist noch kein vollständiges Impressum bzw. keine vollständige Datenschutzerklärung; schreib mir direkt für alles, was davon abhängt.',
    'legal.backHome': 'Zur Startseite',

    'seo.homeTitle': 'Freelance Backend- & Produkt-Entwickler München',
    'seo.homeDescription':
      'Unabhängiger Senior Software Engineer für TypeScript/Node.js-, Python/FastAPI-, PostgreSQL-, AWS- und React-Native-Projekte. MVP-Entwicklung, Projektrettung und Software-Modernisierung.',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
