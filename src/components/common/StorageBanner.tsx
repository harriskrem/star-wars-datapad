import { useStorageStatusStore } from '@/stores/storageStatus'

export default function StorageBanner() {
  const isPersistent = useStorageStatusStore((s) => s.isPersistent)

  if (isPersistent) return null

  return (
    <div
      role="status"
      className="border-border bg-muted text-muted-foreground border-b px-4 py-2 text-center text-sm"
    >
      Your browser is blocking storage; favourites won&rsquo;t persist this session.
    </div>
  )
}
