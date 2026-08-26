/**
 * Single source of truth for site-wide identity.
 * Edit this file (and `site` in astro.config.mjs) when the domain changes.
 */

export const SITE = {
  /** Must match `site` in astro.config.mjs, used for canonical URLs and JSON-LD. */
  url: 'https://marcocasanova.de',
  name: 'Marco Casanova',
  /** Commercial framing, not a job title, drives <title> fallback, Person JSON-LD, and the footer. */
  role: {
    en: 'Independent Senior Software Engineer',
    es: 'Ingeniero de Software Senior Independiente',
    de: 'Unabhängiger Senior Software Engineer',
  },
  /** One-line positioning statement, used in the hero eyebrow and meta descriptions. */
  positioning: {
    en: 'Independent senior software engineer for data-heavy web, mobile and backend products.',
    es: 'Ingeniero de software senior independiente para productos web, móviles y backend con mucho peso de datos.',
    de: 'Unabhängiger Senior Software Engineer für datenintensive Web-, Mobile- und Backend-Produkte.',
  },
  /**
   * Default Open Graph/Twitter preview image, 1200×630, generated from
   * src/pages/og-image.astro via scripts/generate-og-image.mjs — regenerate
   * both if `name`, `role.en`, or `url` above ever change.
   */
  ogImage: '/images/og-image.png',
  email: 'marco.casanova.de@outlook.com',
  calendly: 'https://calendly.com/m-casanova-dev',
  github: 'https://github.com/marcocasanova-dev',
  linkedin: null as string | null,
} as const;

/** Years of experience, rendered in the hero. Update the start year, not the count. */
export const CAREER_START_YEAR = 2015;

/**
 * ============================================================================
 *  ⚠️  FACTS ONLY YOU CAN SUPPLY
 * ============================================================================
 * Anything left as `TODO(...)` renders on the page wrapped in a loud amber
 * marker, and `npm run build` prints a warning listing every one. That is
 * deliberate: a placeholder that ships silently is how "~40ms p95" ends up in
 * front of an interviewer who then asks how it was measured.
 *
 * Replace the value, or set it to `null` to hide the feature entirely.
 * Never guess. An omitted fact is recoverable; a wrong one is not.
 */
export const TODO_MARKER = '__TODO__';
export const TODO = (hint: string) => `${TODO_MARKER}${hint}`;

export const PROFILE = {
  city: 'Munich',
  country: 'Germany',
  timezone: 'Europe/Berlin · CET/CEST',
  languages: ['Spanish, Native', 'English, C1', 'German, basic conversational (actively improving)'],

  /** State it; do not let a reader infer it. 'Senior' or 'Staff'. */
  seniority: 'Senior',

  /**
   * Month you can start new project work. The single editable source for
   * "next availability" everywhere it's shown (hero, /services,
   * /how-i-work) — never duplicate this string elsewhere. null renders
   * "Availability on request" rather than a guess.
   */
  bookingFrom: 'September 2026' as string | null,

  /**
   * Engagement floor for longer partnerships, e.g. '€15,000'. Distinct from
   * `reviewStartingPrice` below — this is for delivery/recovery sprints and
   * partnerships, not the entry-level technical review. Set to null to omit
   * the line entirely; publishing a wrong number is worse than publishing none.
   */
  engagementFloor: null as string | null,

  /**
   * Starting price for a standalone technical review, shown as soft price
   * qualification so the homepage doesn't read as a commodity rate card.
   * Delivery sprints and longer engagements are scoped after a fit call and
   * deliberately have no published number (see `engagementFloor`).
   */
  reviewStartingPrice: '€1,900' as string | null,

  /**
   * A one-page PDF generated from `src/pages/[lang]/cv-print.astro` via
   * `scripts/generate-cv-pdf.mjs` (Playwright print-to-PDF) — every fact on
   * it is pulled from PROFILE/SITE and the featured case studies, so it
   * cannot drift out of sync with the rest of the site. Re-run the script
   * and this stays pointed at the same paths whenever those sources change.
   */
  cv: {
    en: '/cv/Marco-Casanova-Senior-Software-Engineer.pdf' as string | null,
    es: '/cv/Marco-Casanova-Senior-Software-Engineer-es.pdf' as string | null,
    de: '/cv/Marco-Casanova-Senior-Software-Engineer-de.pdf' as string | null,
  },

  /**
   * A real photograph. Not stock, not AI-generated, on a site whose whole
   * argument is verifiability, a synthetic face is a catastrophic own goal.
   */
  photo: null as string | null, // '/images/marco.jpg'

  /**
   * Facts required for a compliant German Impressum (DDG §5, formerly TMG
   * §5) and a real Datenschutzerklärung. The address renders as a loud TODO
   * chip until filled in, and per the Phase 2 launch-blocker review this
   * page must not go live/be deployed until it is. Do not guess a street
   * address or tax ID.
   */
  legal: {
    fullAddress: TODO('full postal address (street, house number, postal code) for the Impressum'),
    vatId: null as string | null, // e.g. 'DE123456789', set only if you have a USt-IdNr.
    /** Freelancers without a trade-register entry can usually omit this, confirm with a tax advisor. */
    commercialRegister: null as string | null,
  },
} as const;

/** True when a string still carries an unfilled TODO placeholder. */
export function isTodo(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(TODO_MARKER);
}

/** Strips the marker prefix so the hint can be displayed on its own. */
export function todoHint(value: string): string {
  return value.slice(TODO_MARKER.length);
}
