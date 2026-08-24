import { Button } from '@/components/ui/button'
import StatusPanel from '@/components/common/StatusPanel'

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
    <StatusPanel role="alert">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-muted-foreground max-w-md text-sm">{message}</p>
      <Button onClick={onRetry} className="mt-2">
        Try again
      </Button>
    </StatusPanel>
  )
}
