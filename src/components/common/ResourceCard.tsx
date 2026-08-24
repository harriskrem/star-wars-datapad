import type { ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FavouriteToggle from '@/components/common/FavouriteToggle'
import { cn } from '@/lib/utils'
import type { FavouriteSnapshot, FavouriteType } from '@/stores/favouritesStore'

type ResourceCardProps = {
  type: FavouriteType
  id: string
  title: string
  snapshot: FavouriteSnapshot
  titleSize?: 'default' | 'sm'
  /** Dim the card when the resource is no longer in the API. */
  dimmed?: boolean
  /** The metadata row rendered under the title. */
  children?: ReactNode
}

/**
 * The card used for characters, films and favourites: a title, a metadata row,
 * and a favourite toggle pinned to the corner. The hover glow assumes an
 * ancestor with the `group` class (usually the wrapping <Link>).
 */
export default function ResourceCard({
  type,
  id,
  title,
  snapshot,
  titleSize = 'default',
  dimmed,
  children,
}: ResourceCardProps) {
  return (
    <Card className={cn('card-glow relative h-full', dimmed && 'opacity-70')}>
      <div className="absolute top-2 right-2">
        <FavouriteToggle type={type} id={id} itemName={title} snapshot={snapshot} />
      </div>
      <CardHeader>
        <CardTitle
          className={cn(
            'font-display pr-12 tracking-wide uppercase',
            titleSize === 'sm' ? 'text-xl' : 'text-2xl',
          )}
        >
          {title}
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
          {children}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
