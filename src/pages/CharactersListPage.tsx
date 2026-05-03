import { useSearchParams } from 'react-router-dom'
import { useCharacters } from '@/queries/useCharacters'
import CharacterCard from '@/components/common/CharacterCard'
import CharacterCardSkeleton from '@/components/common/CharacterCardSkeleton'
import ListErrorState from '@/components/common/ListErrorState'
import Pagination from '@/components/common/Pagination'

const PAGE_SIZE = 10

export default function CharactersListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, isLoading, isError, refetch } = useCharacters()

  const requestedPage = Number(searchParams.get('page') ?? '1')
  const totalCount = data?.length ?? 0
  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const page = Number.isFinite(requestedPage)
    ? Math.min(Math.max(1, Math.trunc(requestedPage)), pageCount)
    : 1

  const startIndex = (page - 1) * PAGE_SIZE
  const visible = data?.slice(startIndex, startIndex + PAGE_SIZE) ?? []

  function handlePageChange(next: number) {
    const params = new URLSearchParams(searchParams)
    if (next === 1) {
      params.delete('page')
    } else {
      params.set('page', String(next))
    }
    setSearchParams(params)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8 flex flex-col gap-2">
        <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Section</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Characters</h1>
      </header>

      {isError ? (
        <ListErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CharacterCardSkeleton key={i} />)
              : visible.map((c) => <CharacterCard key={c.url} character={c} />)}
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
