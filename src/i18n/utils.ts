import { defaultLang, languages, ui, type Lang, type UIKey } from './ui';

export { defaultLang, languages, localeCodes, type Lang } from './ui';

export function isLang(value: string): value is Lang {
  return value in languages;
}

/** Reads the locale out of a URL like `/es/work/viamor`. Falls back to `en`. */
export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  return segment && isLang(segment) ? segment : defaultLang;
}

/**
 * Returns a `t()` bound to `lang`, falling back to the default locale so a
 * missing translation degrades to English instead of showing the key.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/** Builds a locale-prefixed path: `('es', 'work')` -> `/es/work`. */
export function localizePath(lang: Lang, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${lang}/${clean}` : `/${lang}`;
}

/**
 * Content ids are `<lang>/<slug>` because collections are stored per locale.
 * Anything without a recognised prefix is treated as default-locale content.
 */
export function splitLocaleId(id: string): { lang: Lang; slug: string } {
  const [maybeLang, ...rest] = id.split('/');
  if (maybeLang && isLang(maybeLang) && rest.length > 0) {
    return { lang: maybeLang, slug: rest.join('/') };
  }
  return { lang: defaultLang, slug: id };
}

/** Swaps the locale segment of the current path, preserving the rest of the route. */
export function switchLangPath(url: URL, target: Lang): string {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLang(segments[0]!)) {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  return `/${segments.join('/')}`;
}

const dateLocales: Record<Lang, string> = {
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
};

export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(dateLocales[lang], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
