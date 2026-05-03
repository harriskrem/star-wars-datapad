import { describe, it, expect } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderAppAt } from '@/test/renderWithApp'
import { useFavouritesStore } from '@/stores/favouritesStore'
import { useStorageStatusStore } from '@/stores/storageStatus'

describe('favouritesStore persistence and resilience', () => {
  it('syncs favourites across tabs via the storage event', async () => {
    renderAppAt('/')

    expect(screen.queryByTestId('favourites-count-badge')).not.toBeInTheDocument()

    // Simulate another tab writing a favourite to localStorage.
    const newValue = JSON.stringify({
      state: {
        schemaVersion: 1,
        items: [
          {
            type: 'character',
            id: '1',
            addedAt: 1000,
            snapshot: { name: 'Luke Skywalker', birth_year: '19BBY' },
          },
        ],
      },
      version: 1,
    })
    localStorage.setItem('datapad.favourites', newValue)

    window.dispatchEvent(new StorageEvent('storage', { key: 'datapad.favourites', newValue }))

    await waitFor(() => {
      expect(screen.getByTestId('favourites-count-badge')).toHaveTextContent('1')
    })
  })

  it('shows the storage-blocked banner when storage is not persistent', () => {
    useStorageStatusStore.setState({ isPersistent: false })

    renderAppAt('/')

    expect(screen.getByText(/blocking storage/i)).toBeInTheDocument()
  })

  it('resets the store and shows a warning toast when persisted state is corrupted', async () => {
    localStorage.setItem('datapad.favourites', 'this-is-not-json{')

    renderAppAt('/')
    await useFavouritesStore.persist.rehydrate()

    expect(await screen.findByText(/corrupted/i)).toBeInTheDocument()
    expect(useFavouritesStore.getState().items).toHaveLength(0)
  })
})
