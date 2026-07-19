import { getCollection, type CollectionEntry } from 'astro:content';
import { splitLocaleId, type Lang } from '@i18n/utils';

/** Drafts stay visible in `astro dev` and are stripped from production builds. */
const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

export async function getProjects(
  lang: Lang
): Promise<CollectionEntry<'projects'>[]> {
  const entries = await getCollection('projects', isPublished);
  return entries
    .filter((entry) => splitLocaleId(entry.id).lang === lang)
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getFeaturedProjects(
  lang: Lang,
  limit = 3
): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getProjects(lang);
  const featured = projects.filter((p) => p.data.featured);
  // Fall back to the newest projects so the homepage is never empty if no
  // entry is flagged as featured.
  return (featured.length > 0 ? featured : projects).slice(0, limit);
}

export async function getPosts(
  lang: Lang
): Promise<CollectionEntry<'blog'>[]> {
  const entries = await getCollection('blog', isPublished);
  return entries
    .filter((entry) => splitLocaleId(entry.id).lang === lang)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Every distinct sector across a locale's projects, for the work index filter. */
export function collectSectors(
  projects: CollectionEntry<'projects'>[]
): string[] {
  const sectors = new Set<string>();
  for (const project of projects) {
    for (const sector of project.data.sectors) sectors.add(sector);
  }
  return [...sectors].sort((a, b) => a.localeCompare(b));
}
