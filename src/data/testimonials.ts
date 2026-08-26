import type { Lang } from '@i18n/utils';

export interface Testimonial {
  quote: Record<Lang, string>;
  name: string;
  role: string;
  company: string;
  /**
   * Must be `true`, and only ever set to `true` after the named person has
   * explicitly approved publishing this exact quote under their name and
   * title. This field exists so a testimonial cannot be added by accident —
   * TypeScript will not let you push an entry into `testimonials` below
   * without it.
   */
  permissionConfirmed: true;
}

/**
 * No testimonials are published yet. Every entry added here must be:
 *  - a real quote from a real person (never AI-generated, never a
 *    paraphrase attributed to someone who did not say those words),
 *  - explicitly approved by that person for publication under their name,
 *    role, and company (see CONTENT_VERIFICATION.md before adding one),
 *  - kept out of this file entirely if the person will only approve an
 *    anonymous or company-only attribution — that is a UI this component
 *    does not support yet rather than a reason to fabricate a name.
 *
 * `src/pages/[lang]/index.astro` reads `testimonials.length` to decide
 * whether to render this section at all — an empty array here means the
 * homepage falls back to verified case-study evidence instead, not an
 * empty "Testimonials" heading with nothing under it.
 */
export const testimonials: Testimonial[] = [];
