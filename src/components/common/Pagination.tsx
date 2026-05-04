import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type PaginationProps = {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

const buttonBase =
  'inline-flex h-9 min-w-9 cursor-pointer items-center justify-center rounded-md border border-transparent px-2 text-sm select-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40'

const WINDOW_SIZE = 5

function getVisiblePages(currentPage: number, pageCount: number): number[] {
  if (pageCount <= WINDOW_SIZE) {
    return Array.from({ length: pageCount }, (_, i) => i + 1)
  }
  const half = Math.floor(WINDOW_SIZE / 2)
  let start = Math.max(1, currentPage - half)
  const end = Math.min(pageCount, start + WINDOW_SIZE - 1)
  start = Math.max(1, end - WINDOW_SIZE + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function Pagination({ currentPage, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null

  const pages = getVisiblePages(currentPage, pageCount)
  const isFirst = currentPage === 1
  const isLast = currentPage === pageCount

  return (
    <nav
      aria-label="Pagination"
      className="pagination-nav flex items-center justify-center gap-1"
    >
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
                ? 'bg-brand text-background border-brand font-semibold'
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
