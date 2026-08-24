import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { appRoutes } from '@/routes'
import AppProviders from '@/components/AppProviders'
import RootErrorBoundary from '@/components/error'
import { createQueryClient } from '@/lib/queryClient'

const router = createBrowserRouter(appRoutes)

export default function App() {
  const [queryClient] = useState(() => createQueryClient())

  return (
    <AppProviders queryClient={queryClient} toasterPosition="bottom-right">
      <RootErrorBoundary>
        <RouterProvider router={router} />
      </RootErrorBoundary>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </AppProviders>
  )
}
