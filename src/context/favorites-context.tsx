"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface FavoritesContextType {
  favorites: string[]
  isFavorite: (venueId: string) => boolean
  toggleFavorite: (venueId: string, venueName?: string) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error)
    }
  }, [])

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error)
    }
  }, [favorites])

  const isFavorite = (venueId: string): boolean => {
    return favorites.includes(venueId)
  }

  const toggleFavorite = (venueId: string, venueName?: string) => {
    setFavorites(prevFavorites => {
      const isCurrentlyFavorite = prevFavorites.includes(venueId)
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        return prevFavorites.filter(id => id !== venueId)
      } else {
        // Add to favorites
        return [...prevFavorites, venueId]
      }
    })
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
