import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { paths } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-6 px-4 py-12 text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">404</p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        These aren&rsquo;t the pages you&rsquo;re looking for.
      </h1>
      <p className="text-muted-foreground">
        The route you tried doesn&rsquo;t match anything in this datapad.
      </p>
      <Link to={paths.home} className={cn(buttonVariants(), 'h-9 px-4')}>
        Return home
      </Link>
    </div>
  )
}
