import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import type { ResourceConfig } from '@/config/resources'

type ChipQuery<T> = {
  isLoading: boolean
  data?: T
}

type RelatedChipListProps<T> = {
  /** The `useQueries` results for the related resources. */
  queries: ChipQuery<T>[]
  /** Where each chip links to. */
  resource: ResourceConfig
  renderChip: (item: T) => ReactNode
  className?: string
}

/**
 * The row of pill links between a detail page and its related resources.
 * Each chip resolves independently, showing a skeleton until its query lands.
 */
export default function RelatedChipList<T extends { url: string }>({
  queries,
  resource,
  renderChip,
  className,
}: RelatedChipListProps<T>) {
  return (
    <ul className="flex flex-wrap gap-2">
      {queries.map((q, i) => {
        if (q.isLoading) {
          return (
            <li key={i}>
              <Skeleton className="h-7 w-32" />
            </li>
          )
        }
        if (!q.data) return null
        return (
          <li key={q.data.url}>
            <Link
              to={resource.detailPath(extractIdFromUrl(q.data.url))}
              viewTransition
              className={cn(
                'bg-muted hover:bg-muted/70 focus-ring inline-flex items-center rounded-md px-3 py-1 text-sm transition-colors',
                className,
              )}
            >
              {renderChip(q.data)}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
