import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AppRoutes from '@/routes/AppRoutes'
import RootErrorBoundary from '@/components/error/RootErrorBoundary'
import { createQueryClient } from '@/lib/queryClient'

export default function App() {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootErrorBoundary>
          <AppRoutes />
        </RootErrorBoundary>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
