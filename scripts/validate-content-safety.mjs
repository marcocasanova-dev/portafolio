/**
 * Regression gate for the specific fabrication/misspelling/accessibility risks
 * this site has already been burned by once. Runs after `astro build` (needs
 * `dist/`) and EXITS NON-ZERO on failure — these are not "fill this in later"
 * warnings, they are facts and baseline-quality bars that must never silently
 * regress.
 *
 * Checks:
 *  1. "Cytolitics" (the wrong spelling) must never appear in the built site.
 *     The correct spelling is "Cytolytics" — see src/data/clients.ts.
 *  2. No public link may point at a Markdown CV/profile file. The CV is a
 *     PDF generated from src/pages/[lang]/cv-print.astro — see
 *     scripts/generate-cv-pdf.mjs.
 *  3. The Kewazo (Industrial IoT) case study must not contain any of the
 *     specific metrics/claims that were never independently verified, and
 *     must not reference MQTT or a Node.js WebSocket fan-out service — the
 *     confirmed real-time mechanism is WebSockets, which must remain present.
 *  4. The Clinical Imaging case study must contain every confirmed fact
 *     (React, FastAPI, PostgreSQL, row-level access control, audit-ready
 *     reporting, AWS, Docker, DICOM, OpenSearch, Ansible) and must not
 *     contain any of the still-unconfirmed claims (Celery, PHI-specific
 *     logging, immutable audit records, reproducible pipelines, a "day to
 *     minutes" figure, or a claim of having personally designed the full
 *     system architecture).
 *  5. RaumHub must not be reachable, linked, or listed anywhere in the built
 *     site or its sitemap — it is unpublished (`draft: true`) by design.
 *  6. No public content contains the old Gmail address, and every rendered
 *     `mailto:` link's address is exactly the current one
 *     (marco.casanova.de@outlook.com) — some links legitimately append a
 *     `?subject=&body=` prefill query, only the address itself is checked.
 *  7. The Open Graph image is the dedicated 1200×630 portfolio card, not the
 *     old generic photo, and actually exists at build time.
 *  8. The sitemap never lists the bare domain root as a second English URL
 *     alongside /en/ (see astro.config.mjs's sitemap `filter`).
 *  9. Every JSON-LD block parses as valid JSON.
 *  10. Every page has exactly one <h1> (the root `/` gateway is a noindex
 *      redirect stub, not a content page, and is exempted).
 *  11. Every <img> has an `alt` attribute (empty alt is fine for decorative
 *      images; a missing attribute is not).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const failures = [];

function walk(dir, exts) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full, exts));
    else if (exts.includes(extname(full))) out.push(full);
  }
  return out;
}

const htmlFiles = walk('dist', ['.html']);
if (htmlFiles.length === 0) {
  console.error(red('No dist/**/*.html found — run `astro build` before this script.'));
  process.exit(1);
}
const htmlContents = new Map(htmlFiles.map((f) => [f, readFileSync(f, 'utf8')]));

// --- 1. Misspelling check, across the whole built site -------------------
for (const [file, html] of htmlContents) {
  if (/cytolitics/i.test(html)) {
    failures.push(`${file} — contains the misspelling "Cytolitics" (correct: "Cytolytics")`);
  }
}

// --- 2. No public link to a Markdown CV/profile file ----------------------
for (const [file, html] of htmlContents) {
  const matches = html.match(/href="[^"]*\/cv\/[^"]*\.md"/gi) ?? [];
  for (const m of matches) failures.push(`${file} — public link to a Markdown CV: ${m}`);
}
const staleCvMd = walk('public/cv', ['.md']);
for (const file of staleCvMd) {
  failures.push(`${file} — a Markdown CV file still exists in public/cv/`);
}

// --- 3. Kewazo / Industrial IoT: banned claims + required confirmed facts --
const KEWAZO_BANNED = [
  'MQTT',
  'Node.js WebSocket fan-out',
  'D3-to-canvas',
  '60fps',
  '60 fps',
  '30-second polling',
  'order of magnitude',
  '250ms batching',
  '250 ms batching',
  'continuous-aggregate',
];
const KEWAZO_REQUIRED = ['WebSocket'];
const iotFiles = walk('src/content/projects', ['.md']).filter((f) =>
  f.includes('iot-data-platform')
);
for (const file of iotFiles) {
  const text = readFileSync(file, 'utf8');
  for (const phrase of KEWAZO_BANNED) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${file} — contains unverified Kewazo claim: "${phrase}"`);
    }
  }
  for (const phrase of KEWAZO_REQUIRED) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${file} — missing confirmed Kewazo fact: "${phrase}"`);
    }
  }
}

// --- 4. Clinical Imaging: banned claims + required confirmed facts ---------
// FastAPI/PostgreSQL/row-level access control are now confirmed for this
// project (2026-08-26 update) and must be PRESENT, not banned — they remain
// real and verified for other projects on this site regardless.
const CLINICAL_BANNED = [
  'Celery',
  'PHI',
  'immutable audit',
  'reproducible pipeline',
  'reproducible workflow',
  'day to minutes',
  'full architecture',
];
// 'audit' (not the English phrase 'audit-ready') so it matches the German
// ("auditfähig") and Spanish ("auditoría") translations too, not just English.
const CLINICAL_REQUIRED = [
  'React',
  'FastAPI',
  'PostgreSQL',
  'row-level access',
  'audit',
  'AWS',
  'Docker',
  'DICOM',
  'OpenSearch',
  'Ansible',
];
const clinicalFiles = walk('src/content/projects', ['.md']).filter((f) =>
  f.includes('clinical-data-analyzer')
);
for (const file of clinicalFiles) {
  const text = readFileSync(file, 'utf8');
  for (const phrase of CLINICAL_BANNED) {
    if (text.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${file} — contains unverified clinical-project claim: "${phrase}"`);
    }
  }
  for (const phrase of CLINICAL_REQUIRED) {
    if (!text.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${file} — missing confirmed clinical-project fact: "${phrase}"`);
    }
  }
}

// --- 5. RaumHub must be unpublished and unreachable -------------------------
const raumhubFiles = walk('src/content/projects', ['.md']).filter((f) =>
  f.includes('raumhub')
);
for (const file of raumhubFiles) {
  const text = readFileSync(file, 'utf8');
  if (!/^draft:\s*true\s*$/m.test(text)) {
    failures.push(`${file} — RaumHub must stay draft: true (unpublished, per content policy)`);
  }
}
for (const [file, html] of htmlContents) {
  const matches = html.match(/href="[^"]*\/work\/raumhub[^"]*"/gi) ?? [];
  for (const m of matches) failures.push(`${file} — links to the unpublished RaumHub route: ${m}`);
}
const sitemapFiles = walk('dist', ['.xml']).filter((f) => f.includes('sitemap'));
for (const file of sitemapFiles) {
  const xml = readFileSync(file, 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (/raumhub/i.test(match[1])) failures.push(`${file} — sitemap lists a RaumHub URL: ${match[1]}`);
  }
}

// --- 6. Contact email: no stale address, every mailto: is the current one --
const OLD_EMAIL = 'm.casanova.dev@gmail.com';
const CURRENT_EMAIL = 'marco.casanova.de@outlook.com';
for (const [file, html] of htmlContents) {
  if (html.toLowerCase().includes(OLD_EMAIL)) {
    failures.push(`${file} — still contains the retired Gmail address`);
  }
  for (const match of html.matchAll(/href="mailto:([^"]*)"/gi)) {
    const address = decodeURIComponent(match[1].split('?')[0]).toLowerCase();
    if (address !== CURRENT_EMAIL) {
      failures.push(`${file} — mailto: link resolves to "${address}", expected "${CURRENT_EMAIL}"`);
    }
  }
}

// --- 7. Open Graph image: dedicated 1200×630 card, not the old photo -------
const ogImagePath = 'dist/images/og-image.png';
if (!existsSync(ogImagePath)) {
  failures.push(`${ogImagePath} — missing; run scripts/generate-og-image.mjs and rebuild`);
} else {
  try {
    const { default: sharp } = await import('sharp');
    const meta = await sharp(ogImagePath).metadata();
    if (meta.width !== 1200 || meta.height !== 630) {
      failures.push(
        `${ogImagePath} — is ${meta.width}×${meta.height}, expected exactly 1200×630`
      );
    }
  } catch {
    failures.push(`${ogImagePath} — could not read image dimensions (is 'sharp' installed?)`);
  }
}
for (const [file, html] of htmlContents) {
  if (/imac_desktop\.jpg/i.test(html)) {
    failures.push(`${file} — still references the old generic imac_desktop.jpg as social preview`);
  }
}

// --- 8. Sitemap must not list the bare domain root as a 2nd English URL ----
for (const file of sitemapFiles) {
  const xml = readFileSync(file, 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const pathname = new URL(match[1]).pathname;
    if (pathname === '' || pathname === '/') {
      failures.push(`${file} — sitemap lists the bare "/" root as its own URL: ${match[1]}`);
    }
  }
}

// --- 9. Every JSON-LD block must parse ---------------------------------------
for (const [file, html] of htmlContents) {
  for (const match of html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      failures.push(`${file} — invalid JSON-LD: ${e.message}`);
    }
  }
}

// --- 10. Exactly one <h1> per page (the noindex "/" gateway is exempt) -----
for (const [file, html] of htmlContents) {
  if (file === join('dist', 'index.html')) continue; // locale-detection redirect stub, not content
  const count = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (count !== 1) {
    failures.push(`${file} — has ${count} <h1> elements, expected exactly 1`);
  }
}

// --- 11. Every <img> has an alt attribute (empty is fine, missing is not) --
for (const [file, html] of htmlContents) {
  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\salt=/i.test(match[0])) {
      failures.push(`${file} — <img> missing alt attribute: ${match[0].slice(0, 120)}`);
    }
  }
}

// --- Report -----------------------------------------------------------------
if (failures.length > 0) {
  console.error(red(`\n✗ content-safety check failed (${failures.length}):\n`));
  for (const f of failures) console.error(`  ${red('•')} ${f}`);
  console.error(dim('\nThese are hard rules, not warnings — fix the content, not this script.\n'));
  process.exit(1);
}

console.log(
  green(
    `✓ content-safety check passed (${htmlFiles.length} pages, ${iotFiles.length} Kewazo file(s), ${clinicalFiles.length} clinical file(s), ${raumhubFiles.length} RaumHub file(s) confirmed unpublished)`
  )
);
