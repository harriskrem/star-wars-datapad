import type { MouseEvent } from 'react'
import { Heart } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { toast } from 'sonner'
import {
  selectIsFavourite,
  useFavouritesStore,
  type FavouriteSnapshot,
  type FavouriteType,
} from '@/stores/favouritesStore'
import { cn } from '@/lib/utils'

const toggleVariants = cva(
  'focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl transition-colors hover:bg-muted',
  {
    variants: {
      size: {
        default: 'h-11 w-11',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

const iconSizes = {
  default: 'size-5',
  lg: 'size-6',
} as const

type FavouriteToggleProps = VariantProps<typeof toggleVariants> & {
  type: FavouriteType
  id: string
  /** Display name used in the aria-label (e.g. "Luke Skywalker"). */
  itemName: string
  snapshot: FavouriteSnapshot
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

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        isFavourite ? `Remove ${itemName} from favourites` : `Add ${itemName} to favourites`
      }
      aria-pressed={isFavourite}
      className={toggleVariants({ size })}
    >
      <Heart
        className={cn(
          iconSizes[size ?? 'default'],
          isFavourite ? 'fill-brand text-brand' : 'text-muted-foreground',
        )}
        aria-hidden="true"
      />
    </button>
  )
}
