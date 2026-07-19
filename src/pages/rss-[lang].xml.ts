import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '@/config';
import { getPosts } from '@/lib/content';
import { languages, localeCodes, localizePath, splitLocaleId, type Lang } from '@i18n/utils';

/** One feed per locale: /rss-en.xml and /rss-es.xml. */
export function getStaticPaths() {
  return (Object.keys(languages) as Lang[]).map((lang) => ({
    params: { lang },
  }));
}

export async function GET(context: APIContext) {
  const lang = context.params.lang as Lang;
  const posts = await getPosts(lang);
  const site = context.site ?? new URL(SITE.url);

  return rss({
    title: `${SITE.name} — ${SITE.role[lang]}`,
    description:
      lang === 'es'
        ? 'Artículos sobre rendimiento, arquitectura de sistemas y desarrollo de software.'
        : 'Writing on performance, systems architecture, and software engineering.',
    site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      author: SITE.email,
      link: localizePath(lang, `blog/${splitLocaleId(post.id).slug}`),
    })),
    customData: `<language>${localeCodes[lang]}</language>`,
  });
}
