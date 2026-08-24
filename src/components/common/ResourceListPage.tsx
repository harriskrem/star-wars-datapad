import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '@/components/common/EmptyState'
import ListErrorState from '@/components/common/ListErrorState'
import Pagination from '@/components/common/Pagination'
import ResourceCardSkeleton from '@/components/common/ResourceCardSkeleton'
import SearchInput from '@/components/common/SearchInput'
import { useListQueryState } from '@/hooks/useListQueryState'
import { extractIdFromUrl } from '@/lib/swapiUrl'
import type { ResourceConfig } from '@/config/resources'

type ResourceListPageProps<T> = {
  resource: ResourceConfig
  query: {
    data: T[] | undefined
    isLoading: boolean
    isError: boolean
    refetch: () => void
  }
  /** `query` arrives trimmed and lower-cased. */
  matches: (item: T, query: string) => boolean
  renderCard: (item: T) => ReactNode
}

/**
 * The searchable, paginated grid shared by the characters and films lists.
 * Everything that differs between the two lives in `resource` or in the props.
 */
export default function ResourceListPage<T extends { url: string }>({
  resource,
  query,
  matches,
  renderCard,
}: ResourceListPageProps<T>) {
  const {
    inputValue,
    setInputValue,
    searchQuery,
    hasSearch,
    visible,
    page,
    pageCount,
    totalCount,
    onPageChange,
  } = useListQueryState({ items: query.data, matches })

  const showEmptyState = !query.isLoading && !query.isError && totalCount === 0 && hasSearch

  return (
    <div className="flex justify-center px-4 py-12">
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <header>
          <h1 className="font-display text-4xl tracking-wide uppercase sm:text-5xl">
            {resource.plural}
          </h1>
        </header>

        <div className="flex max-w-md flex-col">
          <SearchInput
            label={resource.searchLabel}
            value={inputValue}
            onChange={setInputValue}
            placeholder={resource.searchPlaceholder}
          />
        </div>

        {query.isError ? (
          <ListErrorState onRetry={() => query.refetch()} />
        ) : showEmptyState ? (
          <EmptyState title={`Nothing matched ‘${searchQuery}’`} description={resource.emptyHint} />
        ) : (
          <div className="flex flex-col gap-12">
            <div
              key={query.isLoading ? 'loading' : `page-${page}`}
              className="pagination-grid card-grid"
            >
              {query.isLoading
                ? Array.from({ length: resource.skeletonCount }).map((_, i) => (
                    <ResourceCardSkeleton
                      key={i}
                      titleWidth={resource.skeletonTitleWidth}
                      metaWidth={resource.skeletonMetaWidth}
                    />
                  ))
                : visible.map((item) => (
                    <Link
                      key={item.url}
                      to={resource.detailPath(extractIdFromUrl(item.url))}
                      viewTransition
                      className="group rounded-xl focus-visible:outline-none"
                    >
                      {renderCard(item)}
                    </Link>
                  ))}
            </div>

            {!query.isLoading && pageCount > 1 && (
              <Pagination currentPage={page} pageCount={pageCount} onPageChange={onPageChange} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
