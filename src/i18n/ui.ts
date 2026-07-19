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
    'nav.work': 'Work',
    'nav.writing': 'Writing',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.skipToContent': 'Skip to content',
    'nav.menu': 'Menu',
    'nav.closeMenu': 'Close menu',

    'hero.eyebrow': 'Senior Software Engineer',
    'hero.title': 'I build reliable backend systems and ship them to production.',
    'hero.subtitle':
      'Senior software engineer with 11+ years across backend, web, and mobile products. My focus is APIs, data flows, and maintainable cloud architecture with TypeScript/Node.js, Python, PostgreSQL, and AWS.',
    'hero.ctaWork': 'See case studies',
    'hero.ctaContact': 'Get in touch',
    'hero.yearsLabel': 'years shipping production software',
    'hero.available':
      'Open to senior backend and full-stack roles · Munich · hybrid/remote',
    'hero.proofTitle': 'At a glance',
    'hero.proofLocation': 'Base',
    'hero.proofFocus': 'Focus',
    'hero.proofRoles': 'Target roles',
    'hero.proofAvailability': 'Availability',
    'hero.proofMarkets': 'Recent markets',

    'home.selectedWork': 'Selected work',
    'home.selectedWorkSub':
      'Ticketing and event operations, a 2026 mobile-commerce platform, live IoT telemetry, and regulated clinical data — what I owned, what shipped, and the trade-offs behind it.',
    'home.viewAllWork': 'View all projects',
    'home.writing': 'Writing',
    'home.writingSub':
      'Notes on performance, runtime internals, and the trade-offs behind the frameworks we lean on.',
    'home.viewAllWriting': 'Read all posts',
    'home.stack': 'Stack',
    'home.stackSub': 'What I reach for, grouped by where it sits in the system.',
    'home.clients': 'Selected teams',

    'about.title': 'About',
    'about.heading': 'Production engineering, end to end.',

    'work.title': 'Work',
    'work.subtitle':
      'Case studies from production systems — the constraints, the architecture, and what actually shipped.',
    'work.filterAll': 'All',
    'work.empty': 'No projects match this filter yet.',

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

    'blog.title': 'Writing',
    'blog.subtitle':
      'Deep dives on the things that bite you in production — rendering costs, event loops, and security you cannot bolt on later.',
    'blog.readTime': 'min read',
    'blog.back': 'All posts',
    'blog.published': 'Published',
    'blog.updated': 'Updated',
    'blog.empty': 'No posts published yet.',
    'blog.rss': 'RSS feed',

    'contact.title': 'Contact',
    'contact.heading': "Let's talk about your system.",
    'contact.subtitle':
      'If you are hiring for a senior backend/full-stack role or need help with a production system, send me the context and I will reply within two business days.',
    'contact.emailLabel': 'Email me',
    'contact.callLabel': 'Book a 30-min call',
    'contact.callDesc':
      'Free consultation. Bring an architecture diagram or a slow query — whatever is on fire.',
    'contact.githubLabel': 'GitHub',
    'contact.linkedinLabel': 'LinkedIn',
    'contact.responseTime': 'Typical reply time: under 48 hours',

    'footer.builtWith': 'Built with Astro, Tailwind, and too much coffee.',
    'footer.rights': 'All rights reserved.',
    'footer.sourceCode': 'Source',

    'theme.toggle': 'Toggle theme',
    'lang.switch': 'Change language',

    '404.title': 'Page not found',
    '404.subtitle': 'That route does not exist. It may have moved.',
    '404.cta': 'Back home',

    'home.decisions': 'How I make calls',
    'home.decisionsSub':
      'Three production decisions — the constraint, the alternative I rejected, and the consequence of the choice.',
    'home.readDecision': 'Read the full decision',
    'home.openCaseStudy': 'Open case study',
    'home.carouselPrev': 'Previous project',
    'home.carouselNext': 'Next project',
    'home.stackStripNote':
      'Depth of use is in the case studies — every choice there has a trade-off attached.',

    'about.meta': 'Based in',
    'about.clientsLabel': 'Worked with',
    'about.status':
      'Open to senior backend and full-stack roles; selective consulting is still possible.',
    'about.fullBackground': 'Full background',
    'about.servicesDoor': 'Building something? See how I work',
    'about.careerTitle': 'Career',
    'about.stackTitle': 'Stack, in full',
    'about.languages': 'Languages',
    'about.seniority': 'Level',
    'profile.location': 'Munich, Germany',
    'profile.languagesValue': 'Spanish — native · English — C1 · German — A1/A2',
    'profile.focus': 'TypeScript/Node.js, Python, PostgreSQL, AWS',
    'profile.roles': 'Senior Backend Engineer · Senior Full-Stack Engineer',
    'profile.availability': 'Hybrid/remote from Munich, across EU timezones',
    'profile.markets': 'Germany and Austria',

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

    'services.title': 'Project work',
    'services.positioning':
      'I take on a small number of engagements a year, all in the same territory: systems where the data is the hard part.',
    'services.shape1Title': 'Architecture review',
    'services.shape1Duration': '1–2 weeks',
    'services.shape1Body':
      'You have a system that is slow, fragile, or about to double in load. I read the code, measure it, and hand you a written diagnosis with a prioritised plan. It ends with a document, not a dependency.',
    'services.shape2Title': 'Fixed-scope build',
    'services.shape2Duration': '6–12 weeks',
    'services.shape2Body':
      'One defined piece of system shipped to production: an ingest pipeline, a real-time dashboard, an API layer, a migration. Handed over with documentation your team can maintain.',
    'services.shape3Title': 'Embedded senior engineer',
    'services.shape3Duration': '3+ months',
    'services.shape3Body':
      'I join your team, own an area, and leave it better documented than I found it.',
    'services.floorLabel': 'Engagements typically start around',
    'services.floorNote':
      'Below that, an architecture review is usually the better use of your budget.',
    'services.availability': 'Currently booking from',
    'services.availabilityFallback': 'Selective availability on request',
    'services.antiAgency':
      'You are talking to the person who writes the code. There is no account manager.',
    'services.cta': 'Book 30 minutes',

    'contact.roleColumn': 'Talking about a role',
    'contact.roleDesc':
      'Senior backend and full-stack roles, hybrid from Munich or remote across EU timezones.',
    'contact.projectColumn': 'Talking about a project',
    'contact.projectDesc':
      'Bring an architecture diagram or a slow query — whatever is on fire.',
    'contact.seeServices': 'How I work',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.work': 'Proyectos',
    'nav.writing': 'Artículos',
    'nav.about': 'Sobre mí',
    'nav.contact': 'Contacto',
    'nav.skipToContent': 'Saltar al contenido',
    'nav.menu': 'Menú',
    'nav.closeMenu': 'Cerrar menú',

    'hero.eyebrow': 'Ingeniero de Software Senior',
    'hero.title': 'Construyo sistemas backend fiables y los llevo a producción.',
    'hero.subtitle':
      'Ingeniero de software senior con más de 11 años en productos backend, web y mobile. Mi foco está en APIs, flujos de datos y arquitectura cloud mantenible con TypeScript/Node.js, Python, PostgreSQL y AWS.',
    'hero.ctaWork': 'Ver casos de estudio',
    'hero.ctaContact': 'Hablemos',
    'hero.yearsLabel': 'años desarrollando software en producción',
    'hero.available':
      'Abierto a roles senior backend y full-stack · Múnich · híbrido/remoto',
    'hero.proofTitle': 'De un vistazo',
    'hero.proofLocation': 'Base',
    'hero.proofFocus': 'Foco',
    'hero.proofRoles': 'Roles objetivo',
    'hero.proofAvailability': 'Disponibilidad',
    'hero.proofMarkets': 'Mercados recientes',

    'home.selectedWork': 'Proyectos destacados',
    'home.selectedWorkSub':
      'Ticketing y operacion de eventos, una plataforma de mobile commerce en 2026, telemetria IoT en vivo y datos clinicos regulados: que asumi, que se entrego y que trade-offs hubo detras.',
    'home.viewAllWork': 'Ver todos los proyectos',
    'home.writing': 'Artículos',
    'home.writingSub':
      'Notas sobre rendimiento, internals de runtime y las decisiones detrás de los frameworks que usamos.',
    'home.viewAllWriting': 'Leer todos los artículos',
    'home.stack': 'Stack',
    'home.stackSub': 'Lo que uso, agrupado por su lugar en el sistema.',
    'home.clients': 'Equipos seleccionados',

    'about.title': 'Sobre mí',
    'about.heading': 'Ingeniería de producción, de punta a punta.',

    'work.title': 'Proyectos',
    'work.subtitle':
      'Casos de estudio de sistemas en producción: las restricciones, la arquitectura y lo que realmente se entregó.',
    'work.filterAll': 'Todos',
    'work.empty': 'Ningún proyecto coincide con este filtro todavía.',

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

    'blog.title': 'Artículos',
    'blog.subtitle':
      'Análisis a fondo de lo que duele en producción: costes de renderizado, event loops y seguridad que no se puede añadir al final.',
    'blog.readTime': 'min de lectura',
    'blog.back': 'Todos los artículos',
    'blog.published': 'Publicado',
    'blog.updated': 'Actualizado',
    'blog.empty': 'Aún no hay artículos publicados.',
    'blog.rss': 'Feed RSS',

    'contact.title': 'Contacto',
    'contact.heading': 'Hablemos de tu sistema.',
    'contact.subtitle':
      'Si estás contratando para un rol senior backend/full-stack o necesitas ayuda con un sistema en producción, envíame el contexto y te respondo en dos días hábiles.',
    'contact.emailLabel': 'Escríbeme',
    'contact.callLabel': 'Agenda 30 minutos',
    'contact.callDesc':
      'Consulta gratuita. Trae un diagrama de arquitectura o una query lenta: lo que esté ardiendo.',
    'contact.githubLabel': 'GitHub',
    'contact.linkedinLabel': 'LinkedIn',
    'contact.responseTime': 'Tiempo de respuesta habitual: menos de 48 horas',

    'footer.builtWith': 'Hecho con Astro, Tailwind y demasiado café.',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.sourceCode': 'Código',

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
    'home.stackStripNote':
      'La profundidad está en los casos de estudio: cada elección ahí tiene su trade-off explicado.',

    'about.meta': 'Ubicado en',
    'about.clientsLabel': 'He trabajado con',
    'about.status':
      'Abierto a roles senior backend y full-stack; la consultoría selectiva sigue siendo posible.',
    'about.fullBackground': 'Trayectoria completa',
    'about.servicesDoor': '¿Estás construyendo algo? Así trabajo',
    'about.careerTitle': 'Trayectoria',
    'about.stackTitle': 'Stack completo',
    'about.languages': 'Idiomas',
    'about.seniority': 'Nivel',
    'profile.location': 'Múnich, Alemania',
    'profile.languagesValue': 'Español — nativo · Inglés — C1 · Alemán — A1/A2',
    'profile.focus': 'TypeScript/Node.js, Python, PostgreSQL, AWS',
    'profile.roles': 'Ingeniero Backend Senior · Ingeniero Full-Stack Senior',
    'profile.availability': 'Híbrido/remoto desde Múnich, en zonas horarias europeas',
    'profile.markets': 'Alemania y Austria',

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

    'services.title': 'Trabajo por proyecto',
    'services.positioning':
      'Acepto un número reducido de proyectos al año, todos en el mismo territorio: sistemas donde los datos son la parte difícil.',
    'services.shape1Title': 'Revisión de arquitectura',
    'services.shape1Duration': '1–2 semanas',
    'services.shape1Body':
      'Tienes un sistema lento, frágil o a punto de duplicar su carga. Leo el código, lo mido y te entrego un diagnóstico escrito con un plan priorizado. Termina con un documento, no con una dependencia.',
    'services.shape2Title': 'Desarrollo de alcance cerrado',
    'services.shape2Duration': '6–12 semanas',
    'services.shape2Body':
      'Una pieza definida del sistema entregada a producción: un pipeline de ingesta, un dashboard en tiempo real, una capa de API, una migración. Con documentación que tu equipo pueda mantener.',
    'services.shape3Title': 'Ingeniero senior integrado',
    'services.shape3Duration': '3+ meses',
    'services.shape3Body':
      'Me integro en tu equipo, me hago responsable de un área y la dejo mejor documentada de como la encontré.',
    'services.floorLabel': 'Los proyectos suelen empezar alrededor de',
    'services.floorNote':
      'Por debajo de eso, una revisión de arquitectura suele aprovechar mejor tu presupuesto.',
    'services.availability': 'Disponible a partir de',
    'services.availabilityFallback': 'Disponibilidad selectiva bajo consulta',
    'services.antiAgency':
      'Hablas directamente con quien escribe el código. No hay gestor de cuentas.',
    'services.cta': 'Agenda 30 minutos',

    'contact.roleColumn': 'Sobre un puesto',
    'contact.roleDesc':
      'Roles senior backend y full-stack, híbrido desde Múnich o remoto en zonas horarias europeas.',
    'contact.projectColumn': 'Sobre un proyecto',
    'contact.projectDesc':
      'Trae un diagrama de arquitectura o una query lenta: lo que esté ardiendo.',
    'contact.seeServices': 'Cómo trabajo',
  },
  de: {
    'nav.home': 'Start',
    'nav.work': 'Projekte',
    'nav.writing': 'Artikel',
    'nav.about': 'Über mich',
    'nav.contact': 'Kontakt',
    'nav.skipToContent': 'Zum Inhalt springen',
    'nav.menu': 'Menü',
    'nav.closeMenu': 'Menü schließen',

    'hero.eyebrow': 'Senior Software Engineer',
    'hero.title': 'Ich entwickle zuverlässige Backend-Systeme und bringe sie in Produktion.',
    'hero.subtitle':
      'Senior Software Engineer mit über 11 Jahren Erfahrung in Backend-, Web- und Mobile-Produkten. Mein Schwerpunkt liegt auf APIs, Datenflüssen und wartbaren Cloud-Architekturen mit TypeScript/Node.js, Python, PostgreSQL und AWS.',
    'hero.ctaWork': 'Fallstudien ansehen',
    'hero.ctaContact': 'Kontakt aufnehmen',
    'hero.yearsLabel': 'Jahre Software in Produktion',
    'hero.available':
      'Offen für Senior-Backend- und Full-Stack-Positionen · München · hybrid/remote',
    'hero.proofTitle': 'Auf einen Blick',
    'hero.proofLocation': 'Standort',
    'hero.proofFocus': 'Schwerpunkt',
    'hero.proofRoles': 'Zielrollen',
    'hero.proofAvailability': 'Verfügbarkeit',
    'hero.proofMarkets': 'Jüngste Märkte',

    'home.selectedWork': 'Ausgewählte Projekte',
    'home.selectedWorkSub':
      'Ticketing und Event-Betrieb, eine Mobile-Commerce-Plattform aus 2026, Live-IoT-Telemetrie und regulierte klinische Daten - was ich verantwortet habe, was ausgeliefert wurde und welche Trade-offs dahinterstanden.',
    'home.viewAllWork': 'Alle Projekte ansehen',
    'home.writing': 'Artikel',
    'home.writingSub':
      'Notizen zu Performance, Runtime-Internals und den Abwägungen hinter den Frameworks, auf die wir setzen.',
    'home.viewAllWriting': 'Alle Artikel lesen',
    'home.stack': 'Stack',
    'home.stackSub': 'Womit ich arbeite, gruppiert nach Position im System.',
    'home.clients': 'Ausgewählte Teams',

    'about.title': 'Über mich',
    'about.heading': 'Produktionssysteme, von Anfang bis Ende.',

    'work.title': 'Projekte',
    'work.subtitle':
      'Fallstudien aus Produktivsystemen — die Rahmenbedingungen, die Architektur und was tatsächlich ausgeliefert wurde.',
    'work.filterAll': 'Alle',
    'work.empty': 'Noch keine Projekte für diesen Filter.',

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

    'blog.title': 'Artikel',
    'blog.subtitle':
      'Tiefgang zu den Dingen, die in Produktion wehtun — Rendering-Kosten, Event Loops und Sicherheit, die man nicht nachträglich anschrauben kann.',
    'blog.readTime': 'Min. Lesezeit',
    'blog.back': 'Alle Artikel',
    'blog.published': 'Veröffentlicht',
    'blog.updated': 'Aktualisiert',
    'blog.empty': 'Noch keine Artikel veröffentlicht.',
    'blog.rss': 'RSS-Feed',

    'contact.title': 'Kontakt',
    'contact.heading': 'Sprechen wir über dein System.',
    'contact.subtitle':
      'Wenn du für eine Senior-Backend-/Full-Stack-Rolle einstellst oder Unterstützung für ein Produktivsystem brauchst, schick mir den Kontext und ich antworte innerhalb von zwei Werktagen.',
    'contact.emailLabel': 'E-Mail schreiben',
    'contact.callLabel': '30 Minuten buchen',
    'contact.callDesc':
      'Bring ein Architekturdiagramm oder eine langsame Query mit — was auch immer gerade brennt.',
    'contact.githubLabel': 'GitHub',
    'contact.linkedinLabel': 'LinkedIn',
    'contact.responseTime': 'Übliche Antwortzeit: unter 48 Stunden',

    'footer.builtWith': 'Gebaut mit Astro, Tailwind und zu viel Kaffee.',
    'footer.rights': 'Alle Rechte vorbehalten.',
    'footer.sourceCode': 'Quellcode',

    'theme.toggle': 'Design wechseln',
    'lang.switch': 'Sprache wechseln',

    '404.title': 'Seite nicht gefunden',
    '404.subtitle': 'Diese Route existiert nicht. Vielleicht wurde sie verschoben.',
    '404.cta': 'Zurück zur Startseite',

    'home.decisions': 'Wie ich entscheide',
    'home.decisionsSub':
      'Drei Entscheidungen aus Produktivsystemen — die Rahmenbedingung, die verworfene Alternative und die Konsequenz der Wahl.',
    'home.readDecision': 'Die ganze Entscheidung lesen',
    'home.openCaseStudy': 'Fallstudie öffnen',
    'home.carouselPrev': 'Vorheriges Projekt',
    'home.carouselNext': 'Nächstes Projekt',
    'home.stackStripNote':
      'Wie tief das jeweils geht, steht in den Fallstudien — zu jeder Entscheidung dort gehört ein Trade-off.',

    'about.meta': 'Ansässig in',
    'about.clientsLabel': 'Gearbeitet mit',
    'about.status':
      'Offen für Senior-Backend- und Full-Stack-Positionen; ausgewählte Projektarbeit bleibt möglich.',
    'about.fullBackground': 'Vollständiger Werdegang',
    'about.servicesDoor': 'Du baust etwas? So arbeite ich',
    'about.careerTitle': 'Werdegang',
    'about.stackTitle': 'Kompletter Stack',
    'about.languages': 'Sprachen',
    'about.seniority': 'Level',
    'profile.location': 'München, Deutschland',
    'profile.languagesValue': 'Spanisch — Muttersprache · Englisch — C1 · Deutsch — A1/A2',
    'profile.focus': 'TypeScript/Node.js, Python, PostgreSQL, AWS',
    'profile.roles': 'Senior Backend Engineer · Senior Full-Stack Engineer',
    'profile.availability': 'Hybrid oder remote von München aus, in europäischen Zeitzonen',
    'profile.markets': 'Deutschland und Österreich',

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

    'services.title': 'Projektarbeit',
    'services.positioning':
      'Ich nehme pro Jahr nur wenige Projekte an, alle im selben Feld: Systeme, bei denen die Daten der schwierige Teil sind.',
    'services.shape1Title': 'Architektur-Review',
    'services.shape1Duration': '1–2 Wochen',
    'services.shape1Body':
      'Du hast ein System, das langsam oder fragil ist oder bald die doppelte Last tragen muss. Ich lese den Code, messe ihn und übergebe dir eine schriftliche Diagnose mit priorisiertem Plan. Am Ende steht ein Dokument, keine Abhängigkeit.',
    'services.shape2Title': 'Umsetzung mit festem Umfang',
    'services.shape2Duration': '6–12 Wochen',
    'services.shape2Body':
      'Ein klar definierter Teil des Systems, ausgeliefert in Produktion: eine Ingest-Pipeline, ein Echtzeit-Dashboard, eine API-Schicht, eine Migration. Übergeben mit Dokumentation, die dein Team pflegen kann.',
    'services.shape3Title': 'Eingebetteter Senior Engineer',
    'services.shape3Duration': 'ab 3 Monaten',
    'services.shape3Body':
      'Ich arbeite in deinem Team mit, übernehme Verantwortung für einen Bereich und hinterlasse ihn besser dokumentiert, als ich ihn vorgefunden habe.',
    'services.floorLabel': 'Projekte starten in der Regel ab',
    'services.floorNote':
      'Darunter ist ein Architektur-Review meist der bessere Einsatz deines Budgets.',
    'services.availability': 'Aktuell buchbar ab',
    'services.availabilityFallback': 'Ausgewählte Verfügbarkeit auf Anfrage',
    'services.antiAgency':
      'Du sprichst direkt mit der Person, die den Code schreibt. Es gibt keinen Account Manager.',
    'services.cta': '30 Minuten buchen',

    'contact.roleColumn': 'Über eine Festanstellung',
    'contact.roleDesc':
      'Senior-Backend- und Full-Stack-Positionen, hybrid in München oder remote in europäischen Zeitzonen.',
    'contact.projectColumn': 'Über ein Projekt',
    'contact.projectDesc':
      'Bring ein Architekturdiagramm oder eine langsame Query mit — was auch immer gerade brennt.',
    'contact.seeServices': 'So arbeite ich',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
