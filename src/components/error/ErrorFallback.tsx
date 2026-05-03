import { Button } from '@/components/ui/button'

type ErrorFallbackProps = {
  error: unknown
  resetErrorBoundary: () => void
}

export default function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-12 text-center"
    >
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Error</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Something went wrong.</h1>
      <p className="text-muted-foreground">
        An unexpected error interrupted this page. You can try again, or return to the dashboard.
      </p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}
