import { paths } from '@/routes/paths'
import type { FavouriteType } from '@/stores/favouritesStore'

export type ResourceConfig = {
  /** Singular, title-cased: used in 404 and error copy. */
  label: string
  /** Plural, title-cased: page headings and nav labels. */
  plural: string
  listPath: string
  detailPath: (id: string | number) => string
  searchLabel: string
  searchPlaceholder: string
  /** Shown under the "nothing matched" heading. */
  emptyHint: string
  /** How many card skeletons to show while the list loads. */
  skeletonCount: number
  /** Placeholder widths, sized to this resource's typical title/meta length. */
  skeletonTitleWidth: string
  skeletonMetaWidth: string
}

export const resources: Record<FavouriteType, ResourceConfig> = {
  character: {
    label: 'Character',
    plural: 'Characters',
    listPath: paths.characters,
    detailPath: paths.characterDetail,
    searchLabel: 'Search characters by name',
    searchPlaceholder: 'Search by name…',
    emptyHint: 'Try a different name.',
    skeletonCount: 10,
    skeletonTitleWidth: 'w-32',
    skeletonMetaWidth: 'w-48',
  },
  film: {
    label: 'Film',
    plural: 'Films',
    listPath: paths.films,
    detailPath: paths.filmDetail,
    searchLabel: 'Search films by title',
    searchPlaceholder: 'Search by title…',
    emptyHint: 'Try a different title.',
    skeletonCount: 3,
    skeletonTitleWidth: 'w-40',
    skeletonMetaWidth: 'w-56',
  },
}

/** "Back to characters" — used by the detail back-link and the 404 CTA. */
export function backLabel(resource: ResourceConfig) {
  return `Back to ${resource.plural.toLowerCase()}`
}

/** "Couldn't load this character" */
export function loadErrorTitle(resource: ResourceConfig) {
  return `Couldn't load this ${resource.label.toLowerCase()}`
}

/**
 * The app's top-level destinations, in nav order. Consumed by both the header
 * nav and the home page's section cards so the two can't drift apart.
 */
export const navSections = [
  { to: resources.character.listPath, label: resources.character.plural },
  { to: resources.film.listPath, label: resources.film.plural },
  { to: paths.favourites, label: 'Favourites' },
] as const
