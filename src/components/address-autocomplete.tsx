"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { MapPin, Loader2, X } from "lucide-react"
import type { Address } from "../models/common"

// Mock API for address suggestions
const mockAddressSuggestions = [
  {
    id: "1",
    text: "123 Main St, New York, NY 10001, USA",
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    location: { latitude: 40.7128, longitude: -74.006 },
  },
  {
    id: "2",
    text: "456 Park Ave, New York, NY 10022, USA",
    street: "456 Park Ave",
    city: "New York",
    state: "NY",
    zipCode: "10022",
    country: "USA",
    location: { latitude: 40.7624, longitude: -73.9738 },
  },
  {
    id: "3",
    text: "789 Broadway, New York, NY 10003, USA",
    street: "789 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    country: "USA",
    location: { latitude: 40.7308, longitude: -73.9973 },
  },
  {
    id: "4",
    text: "1010 5th Ave, New York, NY 10028, USA",
    street: "1010 5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10028",
    country: "USA",
    location: { latitude: 40.7789, longitude: -73.9637 },
  },
]

interface AddressAutocompleteProps {
  onAddressSelect: (address: Address) => void
  defaultAddress?: Partial<Address>
  label?: string
  disabled?: boolean
}

export function AddressAutocomplete({
  onAddressSelect,
  defaultAddress,
  label = "Address",
  disabled = false,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<typeof mockAddressSuggestions>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<(typeof mockAddressSuggestions)[0] | null>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)

  // Format default address for display if provided
  useEffect(() => {
    if (defaultAddress && defaultAddress.street) {
      const addressParts = [
        defaultAddress.street,
        defaultAddress.city,
        defaultAddress.state,
        defaultAddress.zipCode,
        defaultAddress.country,
      ].filter(Boolean)

      if (addressParts.length > 0) {
        setQuery(addressParts.join(", "))
      }
    }
  }, [defaultAddress])

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Mock API call for address suggestions
  const searchAddresses = (searchQuery: string) => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSuggestions([])
      } else {
        const filtered = mockAddressSuggestions.filter((address) =>
          address.text.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSuggestions(filtered)
      }
      setIsLoading(false)
    }, 500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedAddress(null)

    if (value.length > 2) {
      searchAddresses(value)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectAddress = (address: (typeof mockAddressSuggestions)[0]) => {
    setSelectedAddress(address)
    setQuery(address.text)
    setSuggestions([])
    setIsFocused(false)

    const selectedAddressData: Address = {
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      location: address.location,
    }

    onAddressSelect(selectedAddressData)
  }

  const clearAddress = () => {
    setQuery("")
    setSelectedAddress(null)
    setSuggestions([])
    onAddressSelect({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    })
  }

  return (
    <div className="relative w-full">
      <Label htmlFor="address-autocomplete" className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        {label}
      </Label>

      <div className="relative mt-1.5">
        <Input
          id="address-autocomplete"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          placeholder="Start typing to search for an address..."
          className="pr-10"
          disabled={disabled}
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full rounded-l-none"
            onClick={clearAddress}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div
          ref={suggestionRef}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : (
            <ul className="divide-y">
              {suggestions.map((address) => (
                <li
                  key={address.id}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-muted"
                  onClick={() => handleSelectAddress(address)}
                >
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                    <span>{address.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
