import type { ReactElement } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from '@/routes'
import { Toaster } from '@/components/ui/sonner'
import { createQueryClient } from '@/lib/queryClient'

type RenderWithAppOptions = {
  route?: string
}

export function renderWithApp(ui: ReactElement, options: RenderWithAppOptions = {}): RenderResult {
  const queryClient = createQueryClient({ retry: false })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[options.route ?? '/']}>{ui}</MemoryRouter>
      <Toaster />
    </QueryClientProvider>,
  )
}

export function renderAppAt(route: string): RenderResult {
  return renderWithApp(<AppRoutes />, { route })
}
