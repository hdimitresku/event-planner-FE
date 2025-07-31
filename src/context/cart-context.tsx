"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { useAuth } from "./auth-context"
import { useLanguage } from "./language-context"
import { useCurrency } from "./currency-context"
import type { Venue } from "../models/venue"
import type { Service, ServiceOption } from "../models/service"

// Cart item interfaces
export interface CartVenueItem {
  id: string
  venue: Venue
  startDate: Date
  endDate: Date
  guests: number
  eventType: string
  specialRequests?: string
  contactDetails?: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export interface CartServiceItem {
  id: string
  service: Service
  option: ServiceOption
  quantity: number
  venueBookingId: string // Links to the venue booking
}

export interface CartItem {
  venue?: CartVenueItem
  services: CartServiceItem[]
  totalAmount: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

interface CartContextType {
  cartItems: CartItem[]
  isCartOpen: boolean
  addVenueToCart: (venueItem: CartVenueItem) => void
  addServiceToCart: (serviceItem: CartServiceItem) => void
  removeServiceFromCart: (serviceId: string, optionId: string) => void
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
  saveCartToStorage: () => void
  restoreCartFromStorage: () => void
  getCurrentBooking: () => CartItem | null
  setCurrentBooking: (booking: CartItem | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [currentBooking, setCurrentBookingState] = useState<CartItem | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()
  const { convertPrice, currency } = useCurrency()

  // Storage keys
  const CART_STORAGE_KEY = "eventBookingCart"
  const CURRENT_BOOKING_KEY = "currentBooking"

  // Save cart to localStorage
  const saveCartToStorage = () => {
    try {
      const cartData = {
        items: cartItems,
        currentBooking: currentBooking,
        timestamp: new Date().toISOString(),
        userId: user?.id || null,
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData))
    } catch (error) {
      console.error("Error saving cart to storage:", error)
    }
  }

  // Restore cart from localStorage
  const restoreCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const cartData = JSON.parse(savedCart)

        // Only restore if it's for the same user or if no user was logged in
        if (!cartData.userId || cartData.userId === user?.id) {
          setCartItems(cartData.items || [])
          setCurrentBookingState(cartData.currentBooking || null)

          if (cartData.items?.length > 0 || cartData.currentBooking) {
            toast.success(t("cart.restored") || "Your booking has been restored", {
              description: t("cart.restoredDescription") || "Welcome back! Your booking information has been restored.",
            })
          }
        }
      }
    } catch (error) {
      console.error("Error restoring cart from storage:", error)
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }

  // Add venue to cart (creates a new booking)
  const addVenueToCart = (venueItem: CartVenueItem) => {
    const newBooking: CartItem = {
      venue: venueItem,
      services: [],
      totalAmount: calculateVenuePrice(venueItem),
      currency: currency,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCurrentBookingState(newBooking)
    toast.success(t("cart.venueAdded") || "Venue added to booking", {
      description: venueItem.venue.name.en,
    })
  }

  // Add service to current booking
  const addServiceToCart = (serviceItem: CartServiceItem) => {
    if (!currentBooking) {
      toast.error(t("cart.noVenueSelected") || "Please select a venue first")
      return
    }

    setCurrentBookingState((prev) => {
      if (!prev) return null

      const existingServiceIndex = prev.services.findIndex(
        (s) => s.service.id === serviceItem.service.id && s.option.id === serviceItem.option.id,
      )

      const updatedServices = [...prev.services]

      if (existingServiceIndex >= 0) {
        // Update existing service
        updatedServices[existingServiceIndex] = {
          ...updatedServices[existingServiceIndex],
          quantity: serviceItem.quantity,
        }
      } else {
        // Add new service
        updatedServices.push(serviceItem)
      }

      const updatedBooking = {
        ...prev,
        services: updatedServices,
        totalAmount: calculateBookingTotal(prev.venue!, updatedServices),
        updatedAt: new Date(),
      }

      return updatedBooking
    })

    toast.success(t("cart.serviceAdded") || "Service added to booking", {
      description: serviceItem.option.name.en,
    })
  }

  // Remove service from current booking
  const removeServiceFromCart = (serviceId: string, optionId: string) => {
    setCurrentBookingState((prev) => {
      if (!prev) return null

      const updatedServices = prev.services.filter((s) => !(s.service.id === serviceId && s.option.id === optionId))

      return {
        ...prev,
        services: updatedServices,
        totalAmount: calculateBookingTotal(prev.venue!, updatedServices),
        updatedAt: new Date(),
      }
    })

    toast.success(t("cart.serviceRemoved") || "Service removed from booking")
  }

  // Update cart item
  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setCartItems((prev) =>
      prev.map((item) => (item.venue?.id === itemId ? { ...item, ...updates, updatedAt: new Date() } : item)),
    )
  }

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.venue?.id !== itemId))
    toast.success(t("cart.itemRemoved") || "Item removed from cart")
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
    setCurrentBookingState(null)
    localStorage.removeItem(CART_STORAGE_KEY)
    toast.success(t("cart.cleared") || "Cart cleared")
  }

  // Complete current booking (move to cart items)
  const completeCurrentBooking = () => {
    if (currentBooking) {
      setCartItems((prev) => [...prev, currentBooking])
      setCurrentBookingState(null)
    }
  }

  // Calculate venue price based on type and duration
  const calculateVenuePrice = (venueItem: CartVenueItem): number => {
    const { venue, guests, startDate, endDate } = venueItem
    const basePrice = venue.price.amount

    switch (venue.price.type) {
      case "perPerson":
        return basePrice * guests
      case "hourly":
        const hours = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
        return basePrice * hours
      case "fixed":
      default:
        return basePrice
    }
  }

  // Calculate service price
  const calculateServicePrice = (serviceItem: CartServiceItem, venueItem: CartVenueItem): number => {
    const { option, quantity } = serviceItem
    const { guests, startDate, endDate } = venueItem
    const basePrice = option.price.amount

    switch (option.price.type) {
      case "perPerson":
        return basePrice * guests * quantity
      case "hourly":
        const hours = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
        return basePrice * hours * quantity
      case "fixed":
      default:
        return basePrice * quantity
    }
  }

  // Calculate total for a booking
  const calculateBookingTotal = (venueItem: CartVenueItem, services: CartServiceItem[]): number => {
    const venuePrice = calculateVenuePrice(venueItem)
    const servicesPrice = services.reduce((total, service) => {
      return total + calculateServicePrice(service, venueItem)
    }, 0)

    return venuePrice + servicesPrice
  }

  // Get cart total
  const getCartTotal = (): number => {
    const cartTotal = cartItems.reduce((total, item) => total + item.totalAmount, 0)
    const currentBookingTotal = currentBooking ? currentBooking.totalAmount : 0
    return cartTotal + currentBookingTotal
  }

  // Get cart item count
  const getCartItemCount = (): number => {
    const cartCount = cartItems.length
    const currentBookingCount = currentBooking ? 1 : 0
    return cartCount + currentBookingCount
  }

  // Cart controls
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  // Get current booking
  const getCurrentBooking = () => currentBooking

  // Set current booking
  const setCurrentBooking = (booking: CartItem | null) => {
    setCurrentBookingState(booking)
  }

  // Auto-save cart when it changes
  useEffect(() => {
    if (cartItems.length > 0 || currentBooking) {
      saveCartToStorage()
    }
  }, [cartItems, currentBooking, user])

  // Restore cart when user logs in
  useEffect(() => {
    if (user) {
      restoreCartFromStorage()
    }
  }, [user])

  // Initial cart restoration
  useEffect(() => {
    restoreCartFromStorage()
  }, [])

  const value: CartContextType = {
    cartItems,
    isCartOpen,
    addVenueToCart,
    addServiceToCart,
    removeServiceFromCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    getCartTotal,
    getCartItemCount,
    saveCartToStorage,
    restoreCartFromStorage,
    getCurrentBooking,
    setCurrentBooking,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
