import type { StateStorage } from 'zustand/middleware'
import { toast } from 'sonner'
import { useStorageStatusStore } from '@/stores/storageStatus'

const PROBE_KEY = '__datapad_storage_probe__'

function probeLocalStorage(): boolean {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return false
  }
  try {
    window.localStorage.setItem(PROBE_KEY, 'x')
    window.localStorage.removeItem(PROBE_KEY)
    return true
  } catch {
    return false
  }
}

function isValidPersistedShape(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null) return false
    const state = (parsed as { state?: unknown }).state
    if (typeof state !== 'object' || state === null) return false
    const items = (state as { items?: unknown }).items
    return Array.isArray(items)
  } catch {
    return false
  }
}

const memoryFallback = new Map<string, string>()
let usingMemory = !probeLocalStorage()
let corruptionNotified = false
let quotaNotified = false

useStorageStatusStore.getState().setIsPersistent(!usingMemory)

function fallbackToMemory() {
  usingMemory = true
  useStorageStatusStore.getState().setIsPersistent(false)
}

export const persistentStorage: StateStorage = {
  getItem: (name) => {
    if (usingMemory) return memoryFallback.get(name) ?? null
    try {
      const raw = window.localStorage.getItem(name)
      if (raw === null) return null
      if (!isValidPersistedShape(raw)) {
        try {
          window.localStorage.removeItem(name)
        } catch {
          /* ignore */
        }
        if (!corruptionNotified) {
          corruptionNotified = true
          toast.warning('Saved favourites were corrupted and have been reset.')
        }
        return null
      }
      return raw
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    if (usingMemory) {
      memoryFallback.set(name, value)
      return
    }
    try {
      window.localStorage.setItem(name, value)
    } catch {
      memoryFallback.set(name, value)
      fallbackToMemory()
      if (!quotaNotified) {
        quotaNotified = true
        toast.warning("Browser storage is full; favourites won't persist beyond this session.")
      }
    }
  },
  removeItem: (name) => {
    if (usingMemory) {
      memoryFallback.delete(name)
      return
    }
    try {
      window.localStorage.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}

export function _resetPersistentStorageForTests() {
  memoryFallback.clear()
  corruptionNotified = false
  quotaNotified = false
  usingMemory = !probeLocalStorage()
  useStorageStatusStore.getState().setIsPersistent(!usingMemory)
}
