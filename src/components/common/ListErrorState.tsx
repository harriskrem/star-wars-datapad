import { Button } from '@/components/ui/button'

type ListErrorStateProps = {
  onRetry: () => void
  title?: string
  message?: string
}

export default function ListErrorState({
  onRetry,
  title = "Couldn't load this list",
  message = 'A network or server error interrupted the request.',
}: ListErrorStateProps) {
  return (
    <div
      role="alert"
      className="border-border/60 bg-card/50 flex flex-col items-center gap-3 rounded-lg border p-8 text-center"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      <Button onClick={onRetry} className="mt-2">
        Try again
      </Button>
    </div>
  )
}
