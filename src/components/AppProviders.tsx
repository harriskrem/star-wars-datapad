import type { ComponentProps, ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

type AppProvidersProps = {
  queryClient: QueryClient
  toasterPosition?: ComponentProps<typeof Toaster>['position']
  children: ReactNode
}

/**
 * The app's provider stack. Shared by the real entry point and the test
 * renderers so they can't drift apart.
 */
export default function AppProviders({
  queryClient,
  toasterPosition,
  children,
}: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster position={toasterPosition} />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
