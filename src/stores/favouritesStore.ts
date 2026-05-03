import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { persistentStorage } from '@/lib/persistentStorage'

export type FavouriteType = 'character' | 'film'

export type FavouriteSnapshot = {
  name: string
  birth_year?: string
  episode_id?: number
  release_date?: string
}

export type Favourite = {
  type: FavouriteType
  id: string
  addedAt: number
  snapshot: FavouriteSnapshot
}

type FavouritesState = {
  schemaVersion: 1
  items: Favourite[]
}

type FavouritesActions = {
  toggle: (input: {
    type: FavouriteType
    id: string
    snapshot: FavouriteSnapshot
  }) => 'added' | 'removed'
}

type FavouritesStore = FavouritesState & FavouritesActions

const STORAGE_KEY = 'datapad.favourites'

export const useFavouritesStore = create<FavouritesStore>()(
  persist(
    (set, get) => ({
      schemaVersion: 1,
      items: [],
      toggle: ({ type, id, snapshot }) => {
        const existing = get().items.find((i) => i.type === type && i.id === id)
        if (existing) {
          set({ items: get().items.filter((i) => !(i.type === type && i.id === id)) })
          return 'removed'
        }
        set({
          items: [...get().items, { type, id, addedAt: Date.now(), snapshot }],
        })
        return 'added'
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state) => ({
        schemaVersion: state.schemaVersion,
        items: state.items,
      }),
    },
  ),
)

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      void useFavouritesStore.persist.rehydrate()
    }
  })
}

export function selectIsFavourite(type: FavouriteType, id: string) {
  return (state: FavouritesStore) => state.items.some((i) => i.type === type && i.id === id)
}

export const selectFavouritesCount = (state: FavouritesStore) => state.items.length
