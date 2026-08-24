import { Button } from '@/components/ui/button'
import MessagePage from '@/components/common/MessagePage'

type ErrorFallbackProps = {
  error: unknown
  resetErrorBoundary: () => void
}

export default function ErrorFallback({ resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <MessagePage
      role="alert"
      eyebrow="Error"
      title="Something went wrong."
      description="An unexpected error interrupted this page. You can try again, or return to the dashboard."
      action={<Button onClick={resetErrorBoundary}>Try again</Button>}
    />
  )
}
