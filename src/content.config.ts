import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content lives in per-locale folders: `src/content/projects/en/foo.md`.
 * The glob loader therefore produces ids like `en/foo`, which `splitLocaleId()`
 * in src/i18n/utils.ts splits back into { lang, slug }.
 */

const technologies = z.array(z.string()).min(1);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One-line summary used on cards, meta description, and OG tags. */
    description: z.string(),
    /** Controls ordering on the index — lower shows first. */
    order: z.number().default(99),
    featured: z.boolean().default(false),
    year: z.number(),
    role: z.string(),
    /** Client or product name, shown as an eyebrow label. */
    client: z.string().optional(),
    technologies,
    sectors: z.array(z.string()).default([]),
    /** Client/product logo, relative to /public. */
    logo: z.string(),
    /** Screenshot filenames inside /public/portafolio. */
    images: z.array(z.string()).default([]),
    /**
     * Headline outcomes rendered as a stat strip on the case study.
     * `value` is coerced because YAML parses bare `2` as a number and these are
     * always displayed as text (`2`, `~40ms`, `n:m`).
     * `consequence` pairs the number with what it meant, so a non-technical
     * reader can calibrate it: "~40ms p95 → operators see rig state live".
     */
    highlights: z
      .array(
        z.object({
          value: z.coerce.string(),
          label: z.string(),
          consequence: z.string().optional(),
        })
      )
      .default([]),

    /*
     * Proof fields. All optional so existing files keep validating and the ES
     * translation can lag EN without failing the build.
     */

    /** One before/after sentence a non-engineer can calibrate. Card + outcome row. */
    outcome: z.string().optional(),
    /** One sentence naming the decision AND the alternative it beat. */
    tradeoff: z.string().optional(),
    /** Operational state of the work, e.g. Production or Internal. */
    status: z.string().optional(),
    /**
     * Verbatim pull-quote for the "How I make calls" homepage section.
     * `text` must be copied word-for-word from this file's own prose — the
     * section's value is that it hoists real reasoning, not a new summary.
     * `source` is optional; the project title is used when it is absent.
     */
    decisionQuote: z
      .object({ text: z.string(), source: z.string().optional() })
      .optional(),
    /**
     * Scope of the engagement — the Senior-vs-Staff signal. Reviewers infer
     * downward when this is absent, so state it explicitly.
     */
    engagement: z
      .object({
        duration: z.string(),
        teamSize: z.string(),
        scope: z.string(),
        /**
         * Rendered as a restrained badge so a reader never has to guess
         * whether this was employment, a consulting/contractor arrangement,
         * a direct freelance client, or Marco's own independent product.
         * 'employee' and 'contractor' predate this field; 'direct' means a
         * client hired Marco directly (not through an employer); 'independent'
         * means a self-directed product with no external client at all.
         */
        relationship: z.enum(['employee', 'contractor', 'direct', 'independent']).optional(),
      })
      .optional(),
    /**
     * Internal authoring signal, not rendered publicly. 'verified' is the
     * default and the only status a `featured` project should carry — every
     * fact in the file has a known source. 'partial' means some facts are
     * confirmed and others still need a source. 'needs-review' means the
     * file was written before this level of scrutiny existed and must not
     * be trusted until it is re-checked against CONTENT_VERIFICATION.md.
     */
    verificationStatus: z.enum(['verified', 'partial', 'needs-review']).default('verified'),
    github: z.string().url().nullable().default(null),
    liveDemo: z.string().url().nullable().default(null),
    video: z.string().url().nullable().default(null),
    draft: z.boolean().default(false),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readTime: z.number(),
    /** Card/hero image, relative to /public. */
    image: z.string().optional(),
    /**
     * The image's real pixel dimensions — required whenever `image` is set,
     * so the <img> tag can carry width/height and the browser reserves the
     * right space before it loads instead of shifting the layout (CLS).
     */
    imageWidth: z.number().optional(),
    imageHeight: z.number().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * Long-form bio. One file per locale (`en.md`, `es.md`) rather than string
 * literals in ui.ts, so it stays editable as prose.
 */
const about = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/about' }),
  schema: z.object({
    headline: z.string(),
    /** Short version rendered in the homepage About block. */
    summary: z.string(),
  }),
});

export const collections = { projects, blog, about };
