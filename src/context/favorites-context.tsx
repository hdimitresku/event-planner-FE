"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { toast } from "../components/ui/use-toast"
import { useAuth } from "./auth-context"

// Define the shape of the context
interface FavoritesContextType {
  favorites: string[] // Array of venue/service IDs
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string, name: string) => void
  clearFavorites: () => void
}

// Create the context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Provider component
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (isAuthenticated) {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites))
        } catch (error) {
          console.error("Error parsing favorites:", error)
          setFavorites([])
        }
      }
    }
  }, [isAuthenticated])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites, isAuthenticated])

  // Check if an item is in favorites
  const isFavorite = (id: string): boolean => {
    return favorites.includes(id)
  }

  // Toggle an item in favorites
  const toggleFavorite = (id: string, name: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      })
      return
    }

    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        toast({
          title: "Removed from favorites",
          description: `${name} has been removed from your favorites`,
        })
        return prevFavorites.filter((favId) => favId !== id)
      } else {
        toast({
          title: "Added to favorites",
          description: `${name} has been added to your favorites`,
        })
        return [...prevFavorites, id]
      }
    })
  }

  // Clear all favorites
  const clearFavorites = () => {
    setFavorites([])
    toast({
      title: "Favorites cleared",
      description: "All items have been removed from your favorites",
    })
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Custom hook to use the favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
} 