"use client"

import { useState, useEffect, useCallback } from "react"

export interface FavoriteStop {
  stopId: string
  stopName: string
  lineId: string
  directionIndex: number
}

interface LastUsedStop {
  stopId: string
  stopName: string
  lineId: string
  directionIndex: number
  stopIndex: number
}

const FAVORITES_KEY = "niepojade-favorites"
const LAST_USED_KEY = "niepojade-last-used"
const MAX_FAVORITES = 6

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStop[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]")
    } catch {
      return []
    }
  })

  const [lastUsed, setLastUsed] = useState<LastUsedStop | null>(() => {
    if (typeof window === "undefined") return null
    try {
      return JSON.parse(localStorage.getItem(LAST_USED_KEY) || "null")
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    } catch { }
  }, [favorites])

  const toggleFavorite = useCallback((stop: FavoriteStop) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (f) => f.stopId === stop.stopId && f.lineId === stop.lineId
      )

      if (exists) {
        return prev.filter(
          (f) => !(f.stopId === stop.stopId && f.lineId === stop.lineId)
        )
      }

      if (prev.length >= MAX_FAVORITES) {
        return [...prev.slice(1), stop]
      }

      return [...prev, stop]
    })
  }, [])

  const isFavorite = useCallback(
    (stopId: string, lineId: string) => {
      return favorites.some((f) => f.stopId === stopId && f.lineId === lineId)
    },
    [favorites]
  )

  const saveLastUsed = useCallback((stop: LastUsedStop) => {
    setLastUsed(stop)
    try {
      localStorage.setItem(LAST_USED_KEY, JSON.stringify(stop))
    } catch { }
  }, [])

  const clearLastUsed = useCallback(() => {
    setLastUsed(null)
    try {
      localStorage.removeItem(LAST_USED_KEY)
    } catch { }
  }, [])

  return {
    favorites,
    lastUsed,
    toggleFavorite,
    isFavorite,
    saveLastUsed,
    clearLastUsed,
  }
}