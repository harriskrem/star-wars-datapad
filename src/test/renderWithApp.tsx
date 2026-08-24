import type { ReactElement } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom'
import { appRoutes } from '@/routes'
import AppProviders from '@/components/AppProviders'
import { createQueryClient } from '@/lib/queryClient'

type RenderWithAppOptions = {
  route?: string
}

export function renderWithApp(ui: ReactElement, options: RenderWithAppOptions = {}): RenderResult {
  return render(
    <AppProviders queryClient={createQueryClient({ retry: false })}>
      <MemoryRouter initialEntries={[options.route ?? '/']}>{ui}</MemoryRouter>
    </AppProviders>,
  )
}

export function renderAppAt(route: string): RenderResult {
  const router = createMemoryRouter(appRoutes, { initialEntries: [route] })

  return render(
    <AppProviders queryClient={createQueryClient({ retry: false })}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}
