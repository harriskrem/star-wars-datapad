import { Outlet } from 'react-router-dom'
import Header from '@/layout/Header'
import StorageBanner from '@/components/common/StorageBanner'

export default function RootLayout() {
  return (
    <div className="bg-background text-foreground flex h-svh flex-col">
      <StorageBanner />
      <Header />
      <main id="main" className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
