import type { MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import {
  selectIsFavourite,
  useFavouritesStore,
  type FavouriteSnapshot,
  type FavouriteType,
} from '@/stores/favouritesStore'
import { cn } from '@/lib/utils'

type FavouriteToggleProps = {
  type: FavouriteType
  id: string
  /** Display name used in the aria-label (e.g. "Luke Skywalker"). */
  itemName: string
  snapshot: FavouriteSnapshot
  size?: 'default' | 'lg'
}

export default function FavouriteToggle({
  type,
  id,
  itemName,
  snapshot,
  size = 'default',
}: FavouriteToggleProps) {
  const isFavourite = useFavouritesStore(selectIsFavourite(type, id))
  const toggle = useFavouritesStore((s) => s.toggle)

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    // The button is rendered inside a card-level <Link>; stop the click
    // from bubbling so we don't navigate when toggling.
    e.preventDefault()
    e.stopPropagation()
    const result = toggle({ type, id, snapshot })
    toast.success(result === 'added' ? 'Added to favourites' : 'Removed from favourites')
  }

  const dimension = size === 'lg' ? 'h-12 w-12' : 'h-11 w-11'
  const iconSize = size === 'lg' ? 'size-6' : 'size-5'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isFavourite ? `Remove ${itemName} from favourites` : `Add ${itemName} to favourites`
      }
      aria-pressed={isFavourite}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors',
        'hover:bg-muted',
        'focus-visible:ring-brand focus-visible:ring-2 focus-visible:outline-none',
        dimension,
      )}
    >
      <Heart
        className={cn(iconSize, isFavourite ? 'fill-brand text-brand' : 'text-muted-foreground')}
        aria-hidden="true"
      />
    </button>
  )
}
