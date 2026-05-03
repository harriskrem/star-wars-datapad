import type { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '@/components/error/ErrorFallback'

type RootErrorBoundaryProps = {
  children: ReactNode
  /** Static node used as the fallback when a child throws. Overrides the default <ErrorFallback />. */
  fallback?: ReactNode
}

export default function RootErrorBoundary({ children, fallback }: RootErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallbackRender={
        fallback
          ? () => <>{fallback}</>
          : ({ error, resetErrorBoundary }) => (
              <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
            )
      }
    >
      {children}
    </ErrorBoundary>
  )
}
