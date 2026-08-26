import type { CollectionEntry } from 'astro:content';
import type { UIKey } from '@i18n/ui';

type Relationship = NonNullable<
  NonNullable<CollectionEntry<'projects'>['data']['engagement']>['relationship']
>;

/**
 * Shared employment/consulting/independent labelling, used by both the work
 * index cards and the case-study detail page so the two never drift apart.
 * The `client` frontmatter field only names an organization — the *label* it
 * renders under must match the real relationship, or a former employer like
 * Kewazo reads as a freelance client, which this site must never do.
 */
export function getRelationshipLabels(t: (key: UIKey) => string) {
  return {
    employee: t('project.relationshipEmployee'),
    contractor: t('project.relationshipContractor'),
    direct: t('project.relationshipDirect'),
    independent: t('project.relationshipIndependent'),
  } satisfies Record<Relationship, string>;
}

export function getOrganizationLabel(t: (key: UIKey) => string, relationship?: Relationship) {
  const labels = {
    employee: t('project.employer'),
    contractor: t('project.engagedVia'),
    direct: t('project.client'),
    independent: t('project.studio'),
  } satisfies Record<Relationship, string>;
  return labels[relationship ?? 'direct'];
}

/**
 * Labels `engagement.scope`. Defaults to the neutral "Scope" — "I owned" is
 * only used where the relationship is confirmed as `direct` or
 * `independent`, i.e. Marco was demonstrably the primary/sole engineer.
 * Team-contribution work (`employee`/`contractor`) and anything with no
 * relationship confirmed yet (e.g. an anonymous-client case study whose
 * body text says "contributed to ... as part of a team") must not be
 * upgraded to an ownership claim the rest of the page does not make.
 */
export function getScopeLabel(t: (key: UIKey) => string, relationship?: Relationship) {
  if (relationship === 'direct' || relationship === 'independent') return t('project.ownership');
  return t('project.scope');
}
