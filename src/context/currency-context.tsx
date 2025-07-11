"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define available currencies
export type Currency = "EUR" | "USD" | "ALL"

// Define exchange rates (these should be fetched from an API in production)
export const EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  EUR: {
    EUR: 1,
    USD: 1.08,
    ALL: 105.5,
  },
  USD: {
    EUR: 0.92,
    USD: 1,
    ALL: 97.5,
  },
  ALL: {
    EUR: 0.0095,
    USD: 0.0103,
    ALL: 1,
  },
}

// Define the currency context type
interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatPrice: (amount: number, fromCurrency: Currency) => string
  convertPrice: (amount: number, fromCurrency: Currency) => number
}

// Create the context with default values
const CurrencyContext = createContext<CurrencyContextType>({
  currency: "EUR",
  setCurrency: () => {},
  formatPrice: (amount: number) => `${amount}`,
  convertPrice: (amount: number) => amount,
})

// Provider component that wraps your app and makes the currency context available
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    // Check if currency is stored in localStorage
    if (typeof window !== "undefined") {
      const savedCurrency = localStorage.getItem("currency") as Currency
      return savedCurrency || "EUR"
    }
    return "EUR"
  })

  useEffect(() => {
    // Update localStorage when currency changes
    localStorage.setItem("currency", currency)
  }, [currency])

  // Function to convert price from one currency to another
  const convertPrice = (amount: number, fromCurrency: Currency): number => {
    if (fromCurrency === currency) return amount
    return amount * EXCHANGE_RATES[fromCurrency][currency]
  }

  // Function to format price with currency symbol
  const formatPrice = (amount: number, fromCurrency: Currency): string => {
    const convertedAmount = convertPrice(amount, fromCurrency)
    const formattedAmount = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(convertedAmount)

    switch (currency) {
      case "EUR":
        return `€${formattedAmount}`
      case "USD":
        return `$${formattedAmount}`
      case "ALL":
        return `${formattedAmount} ALL`
      default:
        return `${formattedAmount}`
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

// Custom hook to use the currency context
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
