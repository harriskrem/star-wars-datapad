import { QueryClient } from '@tanstack/react-query'
import { ONE_HOUR_MS, SEVEN_DAYS_MS } from '@/lib/time'

type CreateQueryClientOptions = {
  retry?: boolean | number
}

export function createQueryClient(options: CreateQueryClientOptions = {}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ONE_HOUR_MS,
        gcTime: SEVEN_DAYS_MS,
        retry: options.retry ?? 3,
      },
    },
  })
}
