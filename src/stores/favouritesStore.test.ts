import { describe, it, expect } from 'vitest'
import { useFavouritesStore } from '@/stores/favouritesStore'

describe('favouritesStore', () => {
  it('adds an item on toggle when not previously favourited', () => {
    const result = useFavouritesStore.getState().toggle({
      type: 'character',
      id: '1',
      snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
    })

    expect(result).toBe('added')
    const items = useFavouritesStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      type: 'character',
      id: '1',
      snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
    })
    expect(items[0].addedAt).toBeGreaterThan(0)
  })

  it('removes an item when toggled twice', () => {
    const { toggle } = useFavouritesStore.getState()
    toggle({ type: 'character', id: '1', snapshot: { name: 'Luke' } })
    const result = toggle({ type: 'character', id: '1', snapshot: { name: 'Luke' } })

    expect(result).toBe('removed')
    expect(useFavouritesStore.getState().items).toHaveLength(0)
  })

  it('treats character and film with the same id as distinct entries', () => {
    const { toggle } = useFavouritesStore.getState()
    toggle({ type: 'character', id: '1', snapshot: { name: 'Luke' } })
    toggle({ type: 'film', id: '1', snapshot: { name: 'A New Hope', episode_id: 4 } })

    expect(useFavouritesStore.getState().items).toHaveLength(2)
  })

  it('persists state to localStorage', () => {
    useFavouritesStore.getState().toggle({
      type: 'character',
      id: '1',
      snapshot: { name: 'Luke' },
    })

    const raw = localStorage.getItem('datapad.favourites')
    expect(raw).not.toBeNull()
    const persisted = JSON.parse(raw!) as {
      state: { schemaVersion: number; items: { id: string }[] }
    }
    expect(persisted.state.schemaVersion).toBe(1)
    expect(persisted.state.items).toHaveLength(1)
    expect(persisted.state.items[0].id).toBe('1')
  })
})
