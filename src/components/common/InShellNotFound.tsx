import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type InShellNotFoundProps = {
  resourceName: string
  backHref: string
  backLabel: string
}

export default function InShellNotFound({
  resourceName,
  backHref,
  backLabel,
}: InShellNotFoundProps) {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">404</p>
      <h1 className="font-display mt-2 text-4xl tracking-wide uppercase sm:text-5xl">
        {resourceName} not found
      </h1>
      <p className="text-muted-foreground mt-3">
        We couldn&rsquo;t find a {resourceName.toLowerCase()} with that id.
      </p>
      <Link to={backHref} className={cn(buttonVariants(), 'mt-6 h-9 px-4')}>
        {backLabel}
      </Link>
    </div>
  )
}
