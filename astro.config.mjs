// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Canonical origin. Change this + public/CNAME + SITE.url in src/config.ts together.
  site: 'https://marcocasanova.dev',
  base: '/',
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'de'],
    routing: {
      // Both locales are explicit in the URL (/en/, /es/) so neither is a
      // second-class citizen for crawlers.
      prefixDefaultLocale: true,
      // Astro's built-in root redirect emits a 2-second meta refresh and cannot
      // detect the visitor's language. src/pages/index.astro replaces it with an
      // instant redirect that honours navigator.language.
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en-US', es: 'es-ES', de: 'de-DE' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],

  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },

  build: {
    // Emit `about/index.html` rather than `about.html` for clean URLs.
    format: 'directory',
    inlineStylesheets: 'auto',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
