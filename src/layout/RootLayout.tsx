import { Outlet } from 'react-router-dom'
import Header from '@/layout/Header'

export default function RootLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
