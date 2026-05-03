import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useFilms } from '@/queries/useFilms'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import FilmCard from '@/components/common/FilmCard'
import FilmCardSkeleton from '@/components/common/FilmCardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import ListErrorState from '@/components/common/ListErrorState'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { scrollToTop } from '@/lib/scrollToTop'
import { paths } from '@/routes/paths'

const PAGE_SIZE = 10

export default function FilmsListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError, refetch } = useFilms()

  const urlSearch = searchParams.get('search') ?? ''
  const [inputValue, setInputValue] = useState(urlSearch)
  const [lastSyncedUrlSearch, setLastSyncedUrlSearch] = useState(urlSearch)
  const debouncedSearch = useDebouncedValue(inputValue, 250)
  const normalizedSearch = debouncedSearch.trim().toLowerCase()

  if (urlSearch !== lastSyncedUrlSearch) {
    setLastSyncedUrlSearch(urlSearch)
    setInputValue(urlSearch)
  }

  useEffect(() => {
    if (debouncedSearch === urlSearch) return
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set('search', debouncedSearch)
    } else {
      params.delete('search')
    }
    params.delete('page')
    setSearchParams(params, { replace: true })
  }, [debouncedSearch, urlSearch, searchParams, setSearchParams])

  const filtered = data?.filter((f) => f.title.toLowerCase().includes(normalizedSearch)) ?? []
  const totalCount = filtered.length
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, Math.trunc(requestedPage)), pageCount)
    : 1

  const startIndex = (page - 1) * PAGE_SIZE
  const visible = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  function handlePageChange(next: number) {
    const params = new URLSearchParams(searchParams)
    if (next === 1) {
      params.delete('page')
    } else {
      params.set('page', String(next))
    }
    setSearchParams(params)
    scrollToTop()
  }

  const showEmptyState = !isLoading && !isError && totalCount === 0 && normalizedSearch.length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Section</p>
        <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">Films</h1>
      </header>

      <div className="mb-8 max-w-md">
        <SearchInput
          label="Search films by title"
          value={inputValue}
          onChange={setInputValue}
          placeholder="Search by title…"
        />
      </div>

      {isError ? (
        <ListErrorState onRetry={() => refetch()} />
      ) : showEmptyState ? (
        <EmptyState
          title={`Nothing matched ‘${debouncedSearch.trim()}’`}
          description="Try a different title."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <FilmCardSkeleton key={i} />)
              : visible.map((f) => (
                  <Link
                    key={f.url}
                    to={paths.filmDetail(extractIdFromUrl(f.url))}
                    className="focus-visible:ring-brand group rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <FilmCard film={f} />
                  </Link>
                ))}
          </div>

          {!isLoading && pageCount > 1 && (
            <div className="mt-12">
              <Pagination
                currentPage={page}
                pageCount={pageCount}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
