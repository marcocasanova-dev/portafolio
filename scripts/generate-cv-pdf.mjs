/**
 * Regenerates the one-page PDF profile from `src/pages/[lang]/cv-print.astro`
 * via Chromium's print-to-PDF (Playwright).
 *
 * Not part of `npm run build` and Playwright is deliberately NOT a project
 * dependency (the brief this was built against explicitly said not to add a
 * new heavy dependency for this) — install it once, run this manually
 * whenever PROFILE/SITE or the featured case studies change, then remove it:
 *
 *   npm i -D playwright && npx playwright install chromium
 *   npm run preview -- --port 4322   # in a separate terminal
 *   node scripts/generate-cv-pdf.mjs
 *   npm uninstall playwright
 *
 * Requires `astro build && astro preview` running on port 4322 first, since
 * this reads the built /cv-print/ route rather than the dev server.
 */
import { chromium } from 'playwright';

const outDir = new URL('../public/cv/', import.meta.url);
const base = process.env.CV_PDF_BASE_URL ?? 'http://localhost:4322';

const targets = [
  ['en', 'Marco-Casanova-Senior-Software-Engineer.pdf'],
  ['de', 'Marco-Casanova-Senior-Software-Engineer-de.pdf'],
  ['es', 'Marco-Casanova-Senior-Software-Engineer-es.pdf'],
];

const browser = await chromium.launch();
for (const [lang, filename] of targets) {
  const page = await browser.newPage();
  await page.goto(`${base}/${lang}/cv-print/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  const path = new URL(filename, outDir).pathname;
  await page.pdf({
    path,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
  });
  console.log('wrote', path);
  await page.close();
}
await browser.close();
