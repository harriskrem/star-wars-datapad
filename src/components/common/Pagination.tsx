import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

const buttonBase =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent px-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40'

export default function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)
  const isFirst = currentPage === 1
  const isLast = currentPage === pageCount

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Previous page"
        className={cn(buttonBase, 'hover:bg-muted')}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pages.map((p) => {
        const isActive = p === currentPage
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              buttonBase,
              isActive
                ? 'border-brand bg-muted text-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {p}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Next page"
        className={cn(buttonBase, 'hover:bg-muted')}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
