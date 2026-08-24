import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type BackLinkProps = {
  to: string
  children: string
}

export default function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link
      to={to}
      viewTransition
      className="kicker focus-ring hover:text-foreground inline-flex w-fit items-center gap-1.5 rounded-sm transition-colors"
    >
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      {children}
    </Link>
  )
}
