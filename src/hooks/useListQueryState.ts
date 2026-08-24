import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

const PAGE_SIZE = 10
const DEBOUNCE_MS = 250

type UseListQueryStateOptions<T> = {
  items: T[] | undefined
  /** `query` arrives trimmed and lower-cased. */
  matches: (item: T, query: string) => boolean
  pageSize?: number
}

/**
 * Client-side search + pagination held in the query string, with the search box
 * kept in sync both ways. `?search=` and `?page=` are omitted when empty/first.
 */
export function useListQueryState<T>({
  items,
  matches,
  pageSize = PAGE_SIZE,
}: UseListQueryStateOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlSearch = searchParams.get('search') ?? ''
  const [inputValue, setInputValue] = useState(urlSearch)
  const [lastSyncedUrlSearch, setLastSyncedUrlSearch] = useState(urlSearch)
  const debouncedSearch = useDebouncedValue(inputValue, DEBOUNCE_MS)
  const normalizedSearch = debouncedSearch.trim().toLowerCase()

  // Sync URL → input when the URL changes externally (back/forward, fresh load).
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

  const filtered = items?.filter((item) => matches(item, normalizedSearch)) ?? []
  const totalCount = filtered.length
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, Math.trunc(requestedPage)), pageCount)
    : 1

  const startIndex = (page - 1) * pageSize
  const visible = filtered.slice(startIndex, startIndex + pageSize)

  function onPageChange(next: number) {
    const params = new URLSearchParams(searchParams)
    if (next === 1) {
      params.delete('page')
    } else {
      params.set('page', String(next))
    }
    setSearchParams(params)
    document.getElementById('main')?.scrollTo?.({ top: 0, behavior: 'instant' })
  }

  return {
    inputValue,
    setInputValue,
    /** Trimmed, original-case — for echoing back in the empty state. */
    searchQuery: debouncedSearch.trim(),
    hasSearch: normalizedSearch.length > 0,
    visible,
    page,
    pageCount,
    totalCount,
    onPageChange,
  }
}
