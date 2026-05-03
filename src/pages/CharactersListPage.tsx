import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCharacters } from '@/queries/useCharacters'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import CharacterCard from '@/components/common/CharacterCard'
import CharacterCardSkeleton from '@/components/common/CharacterCardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import ListErrorState from '@/components/common/ListErrorState'
import Pagination from '@/components/common/Pagination'
import SearchInput from '@/components/common/SearchInput'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import { paths } from '@/routes/paths'

const PAGE_SIZE = 10

export default function CharactersListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError, refetch } = useCharacters()

  const urlSearch = searchParams.get('search') ?? ''
  const [inputValue, setInputValue] = useState(urlSearch)
  const [lastSyncedUrlSearch, setLastSyncedUrlSearch] = useState(urlSearch)
  const debouncedSearch = useDebouncedValue(inputValue, 250)
  const normalizedSearch = debouncedSearch.trim().toLowerCase()

  // Sync URL → input when URL changes externally (back/forward, fresh load).
  if (urlSearch !== lastSyncedUrlSearch) {
    setLastSyncedUrlSearch(urlSearch)
    setInputValue(urlSearch)
  }

  // Debounced input → URL (resets page on search change).
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

  const filtered = data?.filter((c) => c.name.toLowerCase().includes(normalizedSearch)) ?? []
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
  }

  const showEmptyState = !isLoading && !isError && totalCount === 0 && normalizedSearch.length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Section</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Characters</h1>
      </header>

      <div className="mb-8 max-w-md">
        <SearchInput
          label="Search characters by name"
          value={inputValue}
          onChange={setInputValue}
          placeholder="Search by name…"
        />
      </div>

      {isError ? (
        <ListErrorState onRetry={() => refetch()} />
      ) : showEmptyState ? (
        <EmptyState
          title={`Nothing matched ‘${debouncedSearch.trim()}’`}
          description="Try a different name."
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CharacterCardSkeleton key={i} />)
              : visible.map((c) => (
                  <Link
                    key={c.url}
                    to={paths.characterDetail(extractIdFromUrl(c.url))}
                    className="focus-visible:ring-brand group rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <CharacterCard character={c} />
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
