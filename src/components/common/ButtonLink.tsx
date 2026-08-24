import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonLinkProps = {
  to: string
  className?: string
  children: ReactNode
}

/** An internal link styled as a button — the CTA used by empty and 404 states. */
export default function ButtonLink({ to, className, children }: ButtonLinkProps) {
  return (
    <Link to={to} viewTransition className={cn(buttonVariants(), 'h-9 px-4', className)}>
      {children}
    </Link>
  )
}
