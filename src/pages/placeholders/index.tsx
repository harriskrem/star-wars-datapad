type PlaceholderProps = {
  title: string
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-3">Coming soon.</p>
    </div>
  )
}
