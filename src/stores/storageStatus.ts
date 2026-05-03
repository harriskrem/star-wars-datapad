import { create } from 'zustand'

type StorageStatusState = {
  isPersistent: boolean
}

type StorageStatusActions = {
  setIsPersistent: (v: boolean) => void
}

export const useStorageStatusStore = create<StorageStatusState & StorageStatusActions>((set) => ({
  isPersistent: true,
  setIsPersistent: (v) => set({ isPersistent: v }),
}))
