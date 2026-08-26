/**
 * Regenerates the dedicated 1200×630 Open Graph image from
 * `src/pages/og-image.astro` via Chromium screenshot (Playwright).
 *
 * Not part of `npm run build` and Playwright is deliberately NOT a project
 * dependency — same one-time-install pattern as generate-cv-pdf.mjs:
 *
 *   npm i -D playwright && npx playwright install chromium
 *   npm run preview -- --port 4322   # in a separate terminal
 *   node scripts/generate-og-image.mjs
 *   npm uninstall playwright
 */
import { chromium } from 'playwright';

const outPath = new URL('../public/images/og-image.png', import.meta.url).pathname;
const base = process.env.OG_IMAGE_BASE_URL ?? 'http://localhost:4322';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`${base}/og-image/`, { waitUntil: 'networkidle' });
await page.screenshot({
  path: outPath,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
});
console.log('wrote', outPath);
await browser.close();
