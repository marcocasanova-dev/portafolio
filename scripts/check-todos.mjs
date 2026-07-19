/**
 * Warns about unfilled PROFILE placeholders and missing proof fields.
 * Runs before `astro build` so a placeholder can never ship unnoticed.
 * Exits 0 by design — this warns, it does not block a deploy.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const y = (s) => `\x1b[33m${s}\x1b[0m`;
const d = (s) => `\x1b[2m${s}\x1b[0m`;
const warnings = [];

const config = readFileSync('src/config.ts', 'utf8');
for (const m of config.matchAll(/(\w+):\s*TODO\('([^']+)'\)/g)) {
  warnings.push(`PROFILE.${m[1]} — ${m[2]}`);
}
if (/linkedin: 'https:\/\/www\.linkedin\.com\/in\/marcocasanova-dev'/.test(config)) {
  warnings.push('SITE.linkedin — assumed slug, never verified against a real profile');
}
if (/cv: \{\s*\n\s*en: null/.test(config)) {
  warnings.push('PROFILE.cv.en / .es — no CV PDF; every CV link is hidden');
}

const projectsDir = 'src/content/projects/en';
if (existsSync(projectsDir)) {
  for (const file of readdirSync(projectsDir).filter((f) => f.endsWith('.md'))) {
    const src = readFileSync(join(projectsDir, file), 'utf8');
    const slug = file.replace(/\.md$/, '');
    for (const field of ['outcome', 'tradeoff', 'engagement']) {
      if (!new RegExp(`^${field}:`, 'm').test(src)) {
        warnings.push(`projects/en/${slug} — missing '${field}'`);
      }
    }
    if (/NOTE: replace the `highlights` metrics/.test(src)) {
      warnings.push(`projects/en/${slug} — highlights are still unverified placeholders`);
    }
  }
}

if (warnings.length) {
  console.log(y(`\n⚠  ${warnings.length} unfilled item(s) before this site is interview-ready:\n`));
  for (const w of warnings) console.log(`   ${y('•')} ${w}`);
  console.log(d('\n   Fill these in src/config.ts and the project frontmatter.'));
  console.log(d('   Placeholders render as amber TODO chips on the page.\n'));
} else {
  console.log('\x1b[32m✓ No unfilled placeholders.\x1b[0m');
}
