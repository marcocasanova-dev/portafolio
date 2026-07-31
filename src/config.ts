/**
 * Single source of truth for site-wide identity.
 * Edit this file (and `site` in astro.config.mjs) when the domain changes.
 */

export const SITE = {
  /** Must match `site` in astro.config.mjs — used for canonical URLs and JSON-LD. */
  url: 'https://marcocasanova.de',
  name: 'Marco Casanova',
  role: {
    en: 'Senior Backend & Full-Stack Engineer',
    es: 'Ingeniero Senior Backend y Full-Stack',
    de: 'Senior Backend- & Full-Stack-Engineer',
  },
  /** Fallback Open Graph image, relative to /public. */
  ogImage: '/images/imac_desktop.jpg',
  email: 'm.casanova.dev@gmail.com',
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
  languages: ['Spanish — Native', 'English — C1', 'German — A1/A2'],

  /** State it; do not let a reader infer it. 'Senior' or 'Staff'. */
  seniority: 'Senior',

  /** Full-time candidacy and project work are declared separately and plainly. */
  openToRoles: true,
  openToProjects: true,

  /**
   * Month you can start project work, e.g. 'September 2026'. Shown on /services
   * only. A month is maintainable; a slot count decays faster than you'll edit it.
   */
  bookingFrom: null as string | null,

  /**
   * Engagement floor for /services, e.g. '€15,000'. Set to null to omit the line
   * entirely — publishing a wrong number is worse than publishing none.
   */
  engagementFloor: null as string | null,

  /** Drop PDFs at these paths, then set them. null hides every CV link. */
  cv: {
    en: '/cv/marco-casanova-profile-en.md',
    es: '/cv/marco-casanova-profile-es.md',
    de: '/cv/marco-casanova-profile-de.md',
  },

  /**
   * A real photograph. Not stock, not AI-generated — on a site whose whole
   * argument is verifiability, a synthetic face is a catastrophic own goal.
   */
  photo: null as string | null, // '/images/marco.jpg'
} as const;

/** True when a string still carries an unfilled TODO placeholder. */
export function isTodo(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(TODO_MARKER);
}

/** Strips the marker prefix so the hint can be displayed on its own. */
export function todoHint(value: string): string {
  return value.slice(TODO_MARKER.length);
}
