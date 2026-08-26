/**
 * Crawls dist/**\/*.html for every internal href/src and confirms it
 * resolves to a real file in the build output. Also spot-checks that the
 * sitemap's URLs correspond to real routes. External (http/https/mailto)
 * links are counted but not fetched — no network access here, and that is
 * a different, separate check.
 *
 * Exits non-zero on any broken internal link, matching validate-content-
 * safety.mjs's "hard rule, not a warning" stance.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const DIST = 'dist';

function walk(dir, exts) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, exts));
    else if (exts.includes(extname(full))) out.push(full);
  }
  return out;
}

/** `/en/work/foo` or `/en/work/foo/` -> does dist/en/work/foo/index.html (or foo.html, or the file itself) exist? */
function resolves(pathname) {
  const clean = pathname.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return existsSync(join(DIST, 'index.html'));
  // Strip both leading and trailing slashes before building candidates —
  // otherwise `${rel}.html` for a trailing-slash path like `/404/` builds
  // the nonsensical `404/.html` instead of `404.html`.
  const rel = clean.replace(/^\/+/, '').replace(/\/+$/, '');
  const candidates = [
    join(DIST, rel), // exact file (e.g. /rss-en.xml, /images/foo.png)
    join(DIST, rel, 'index.html'), // directory route
    join(DIST, `${rel}.html`), // flat build output (e.g. Astro's special-cased /404.html)
  ];
  return candidates.some((c) => existsSync(c));
}

const htmlFiles = walk(DIST, ['.html']);
if (htmlFiles.length === 0) {
  console.error(red('No dist/**/*.html found — run `astro build` before this script.'));
  process.exit(1);
}

const broken = [];
let internalCount = 0;
let externalCount = 0;

const attrPattern = /(?:href|src)="([^"]+)"/g;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(attrPattern)) {
    const url = match[1];
    if (!url || url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:')) continue;
    if (/^https?:\/\//.test(url)) {
      externalCount++;
      continue;
    }
    internalCount++;
    if (!resolves(url)) {
      broken.push(`${file} -> ${url}`);
    }
  }
}

// Sitemap URLs should all be real, buildable routes too.
const sitemapFiles = walk(DIST, ['.xml']).filter((f) => f.includes('sitemap'));
let sitemapUrlCount = 0;
for (const file of sitemapFiles) {
  const xml = readFileSync(file, 'utf8');
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (!match[1].endsWith('.xml')) {
      sitemapUrlCount++;
      const pathname = new URL(match[1]).pathname;
      if (!resolves(pathname)) broken.push(`${file} (sitemap) -> ${match[1]}`);
    }
  }
}

if (broken.length > 0) {
  console.error(red(`\n✗ link check failed (${broken.length} broken):\n`));
  for (const b of [...new Set(broken)]) console.error(`  ${red('•')} ${b}`);
  process.exit(1);
}

console.log(
  green(
    `✓ link check passed (${htmlFiles.length} pages, ${internalCount} internal links, ${sitemapUrlCount} sitemap URLs, ${externalCount} external links not fetched)`
  )
);
console.log(dim('  External links were counted, not fetched — no network access in this check.'));
