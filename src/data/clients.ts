/**
 * Shared client roster — rendered by ClientMarquee (wordmark strip) and by the
 * About block (static scannable list).
 *
 * Ordered most-recognisable first: the strip is scanned, not read.
 *
 * TODO — review before publishing:
 *  · Confirm you are contractually free to name each of these.
 *  · The design review recommended cutting any name that cannot carry a
 *    specific, true, one-line scope — it flagged 'MedTech' and 'Creative' as
 *    reading like category placeholders rather than companies. They came from
 *    your original data, so they are kept here; your call whether they stay.
 */
export interface Client {
  name: string;
  /** Optional logo file. Unused while the wordmark variant is active. */
  logo: string | null;
}

export const clients: Client[] = [
  { name: 'ProSieben', logo: '/clients/prosieben.webp' },
  { name: 'Dehner', logo: null },
  { name: 'Kewazo', logo: '/logos/kewazo.webp' },
  { name: 'Cytolitics', logo: null },
  { name: 'WebCreek', logo: '/clients/webcreek.png' },
  { name: 'Viamor', logo: '/logos/viamor.webp' },
  { name: 'DreamNest', logo: '/clients/dreamnest.webp' },
  { name: 'DomTom', logo: '/clients/domtom.webp' },
];
