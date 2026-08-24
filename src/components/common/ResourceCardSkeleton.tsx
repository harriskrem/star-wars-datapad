import { Card, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type ResourceCardSkeletonProps = {
  /** Width utilities, so the placeholder roughly matches the real content. */
  titleWidth?: string
  metaWidth?: string
}

export default function ResourceCardSkeleton({
  titleWidth = 'w-32',
  metaWidth = 'w-48',
}: ResourceCardSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className={cn('h-6', titleWidth)} />
        <Skeleton className={cn('mt-2 h-4', metaWidth)} />
      </CardHeader>
    </Card>
  )
}
