const valueStyles = {
  text: 'text-base',
  mono: 'font-mono text-base',
  /** For lower-cased API values like "blue" or "blond". */
  capitalize: 'text-base capitalize',
} as const

type DetailFieldProps = {
  label: string
  value: string
  variant?: keyof typeof valueStyles
}

export default function DetailField({ label, value, variant = 'text' }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
        {label}
      </h2>
      <p className={valueStyles[variant]}>{value}</p>
    </div>
  )
}
