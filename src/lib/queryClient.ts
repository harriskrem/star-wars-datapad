import { QueryClient } from '@tanstack/react-query'

const ONE_HOUR_MS = 1000 * 60 * 60
const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7

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
