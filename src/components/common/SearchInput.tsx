import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'

type SearchInputProps = {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchInput({
  id = 'search-input',
  label,
  value,
  onChange,
  placeholder = 'Search…',
}: SearchInputProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-9 pl-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground focus-ring absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}
