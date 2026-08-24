import type { ReactNode } from 'react'
import { isNotFound } from '@/api/types'
import InShellNotFound from '@/components/common/InShellNotFound'
import ListErrorState from '@/components/common/ListErrorState'
import { backLabel, loadErrorTitle, type ResourceConfig } from '@/config/resources'

type DetailPageShellProps<T> = {
  resource: ResourceConfig
  query: {
    data: T | undefined
    isLoading: boolean
    isError: boolean
    error: unknown
    refetch: () => void
  }
  /** Full-page loading placeholder, including its own layout wrapper. */
  skeleton: ReactNode
  children: (data: T) => ReactNode
}

/**
 * The loading / 404 / error / loaded states shared by both detail pages, plus
 * the page wrapper. The body is a render prop so it only runs once data exists.
 */
export default function DetailPageShell<T>({
  resource,
  query,
  skeleton,
  children,
}: DetailPageShellProps<T>) {
  if (query.isLoading) return <>{skeleton}</>

  if (query.isError) {
    if (isNotFound(query.error)) {
      return (
        <InShellNotFound
          resourceName={resource.label}
          backHref={resource.listPath}
          backLabel={backLabel(resource)}
        />
      )
    }
    return (
      <div className="flex justify-center px-4 py-12">
        <div className="flex w-full max-w-4xl flex-col">
          <ListErrorState onRetry={() => query.refetch()} title={loadErrorTitle(resource)} />
        </div>
      </div>
    )
  }

  if (!query.data) return null

  return (
    <div className="flex justify-center px-4 py-12">
      <article className="flex w-full max-w-4xl flex-col gap-10">{children(query.data)}</article>
    </div>
  )
}
