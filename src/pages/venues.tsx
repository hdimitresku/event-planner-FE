"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Slider } from "../components/ui/slider"
import { Checkbox } from "../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import {
  MapPin,
  Users,
  Search,
  Filter,
  Star,
  Wifi,
  ParkingMeterIcon as Parking,
  Music,
  Utensils,
  Tv,
  Heart,
  Clock,
  User,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Building2,
  Home,
  Warehouse,
  Trees,
  Mountain,
  Bath,
  ChevronDown,
} from "lucide-react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { useLanguage } from "../context/language-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { VenueSummary } from "../models/venue"
import { PricingType } from "../models/common"
import * as venueService from "../services/venueService"
import { useFavorites } from "../context/favorites-context"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useCurrency, type Currency } from "../context/currency-context"
import { toast } from "@/components/ui/use-toast"

// Define price type interface
type PriceType = "hourly" | "perPerson" | "fixed"

// Updated venue types to match API data
const VENUE_TYPES = {
  meetingRoom: "Meeting Room",
  ballroom: "Ballroom",
  loft: "Loft",
  garden: "Garden",
  rooftop: "Rooftop",
}

// Updated amenities to match API data
const VENUE_AMENITIES = {
  wifi: { label: "WiFi", icon: Wifi },
  parking: { label: "Parking", icon: Parking },
  sound_system: { label: "Sound System", icon: Music },
  kitchen: { label: "Kitchen", icon: Utensils },
  av_equipment: { label: "AV Equipment", icon: Tv },
  bathroom: { label: "Bathroom", icon: Bath },
}

// Format image URL to handle relative paths
const formatImageUrl = (url: string) => {
  if (!url) return "/placeholder.svg"

  // If it's already an absolute URL, return it as is
  if (url.startsWith("http")) return url

  // If it's a relative path, prepend the API URL
  const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
  return `${apiUrl}/${url.replace(/\\/g, "/")}`
}

// Get venue rating from reviews
const getVenueRating = (venue: VenueSummary) => {
  if (!venue.reviews || venue.reviews.length === 0) {
    return { average: 0, count: 0 }
  }

  const totalRating = venue.reviews.reduce((sum, review) => sum + review.rating, 0)
  const average = totalRating / venue.reviews.length

  return {
    average: Number.parseFloat(average.toFixed(1)),
    count: venue.reviews.length,
  }
}

// Check if a date is blocked for a venue
const isDateBlocked = (venue: VenueSummary, dateStr: string) => {
  if (!venue.metadata?.blockedDates || !dateStr) return false

  // Convert the date string to a Date object for comparison
  const selectedDate = new Date(dateStr)
  selectedDate.setHours(0, 0, 0, 0) // Normalize to start of day

  return venue.metadata.blockedDates.some((blockedDate: { startDate: string | Date; endDate: string | Date }) => {
    // Handle different date formats in the API
    const startDate =
      typeof blockedDate.startDate === "string" ? new Date(blockedDate.startDate) : new Date(blockedDate.startDate)

    const endDate =
      typeof blockedDate.endDate === "string" ? new Date(blockedDate.endDate) : new Date(blockedDate.endDate)

    startDate.setHours(0, 0, 0, 0)
    endDate.setHours(23, 59, 59, 999)

    return selectedDate >= startDate && selectedDate <= endDate
  })
}

// Get venue type icon
const getVenueTypeIcon = (type: string) => {
  switch (type) {
    case "meetingRoom":
      return Building2
    case "ballroom":
      return Warehouse
    case "loft":
      return Home
    case "garden":
      return Trees
    case "rooftop":
      return Mountain
    default:
      return Building2
  }
}

interface VenueCardProps {
  venue: VenueSummary
  language: string
  t: (key: string) => string
}

// VenueCard Component
const VenueCard = ({ venue, language, t }: VenueCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { formatPrice } = useCurrency()
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const rating = getVenueRating(venue)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })

    // Auto-scroll functionality
    const autoScroll = setInterval(() => {
      if (venue.media && venue.media.length > 1) {
        api.scrollNext()
      }
    }, 4000)

    return () => {
      clearInterval(autoScroll)
    }
  }, [api, venue.media])

  // Function to get venue type display name
  const getVenueTypeDisplay = (type: keyof typeof VENUE_TYPES) => {
    return VENUE_TYPES[type] || type
  }

  // Get price display based on price type and language
  const getPriceDisplay = (venue: VenueSummary) => {
    switch (venue.price.type) {
      case PricingType.HOURLY:
        return `${formatPrice(venue.price.amount, venue.price.currency as Currency)}/${t("business.serviceNew.hourly")}`
      case PricingType.PER_PERSON:
        return `${formatPrice(venue.price.amount, venue.price.currency as Currency)}/${t("business.serviceNew.perPerson")}`
      case PricingType.FIXED:
        return formatPrice(venue.price.amount, venue.price.currency as Currency)
      default:
        return formatPrice(venue.price.amount, venue.price.currency as Currency)
    }
  }

  // Get badge color and text for price type
  const getPriceTypeBadge = (priceType: PricingType) => {
    switch (priceType) {
      case PricingType.HOURLY:
        return t("business.serviceNew.hourly")
      case PricingType.PER_PERSON:
        return t("business.serviceNew.perPerson")
      case PricingType.FIXED:
        return t("business.serviceNew.flatFee")
      default:
        return null
    }
  }

  // Get guest capacity display
  const getGuestCapacity = (venue: VenueSummary) => {
    if (!venue.capacity) return null

    if (venue.capacity.min === venue.capacity.max) {
      return `${venue.capacity.min} guests`
    }

    return `${venue.capacity.min}-${venue.capacity.max} guests`
  }

  // Get venue type icon component
  const VenueTypeIcon = getVenueTypeIcon(venue.type)



  return (
    <div className="flex flex-col h-[400px] bg-card rounded-xl overflow-hidden venue-card group transition-all duration-300">
      {/* Image Carousel - Top Half */}
      <div className="relative h-[190px] w-full overflow-hidden">
        {venue.media && venue.media.length > 0 ? (
          <Carousel
            setApi={setApi}
            className="w-full h-full"
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent className="h-full">
              {venue.media.map((image: { id?: string; url: string }, index: number) => (
                <CarouselItem key={image.id || index} className="h-full">
                  <div className="h-full w-full relative">
                    <img
                      src={formatImageUrl(image.url) || "/placeholder.svg"}
                      alt={venue.name?.[language as keyof typeof venue.name] || "Venue"}
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom navigation buttons */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CarouselPrevious className="h-8 w-8 bg-white/90 hover:bg-white border-none shadow-soft" />
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <CarouselNext className="h-8 w-8 bg-white/90 hover:bg-white border-none shadow-soft" />
            </div>
          </Carousel>
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <img src="/placeholder.svg" alt="No image available" className="w-16 h-16 opacity-50" />
          </div>
        )}

        {/* Price type badge - More visible */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary text-primary-foreground font-medium shadow-lg border-0 px-3 py-1">
            {getPriceTypeBadge(venue.price.type)}
          </Badge>
        </div>

        {/* Venue type badge - Updated for better visibility */}
        <div className="absolute bottom-3 left-3 z-10">
          <Badge
            variant="secondary"
            className="bg-secondary text-secondary-foreground border-none font-medium shadow-lg px-3 py-1 hover:bg-secondary/80 transition-colors flex items-center gap-1.5"
          >
            <VenueTypeIcon className="h-3.5 w-3.5" />
            {t(`business.venueTypes.${venue.type}`)}
          </Badge>
        </div>

        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-3 top-3 h-8 w-8 rounded-full z-10 shadow-lg transition-all duration-200 ${isFavorite(venue.id)
              ? "bg-white text-red-500 hover:text-red-600 hover:bg-white"
              : "bg-white/90 text-muted-foreground hover:text-red-500 hover:bg-white"
            }`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleFavorite(venue.id, venue.name[language])
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current" : ""}`} />
          <span className="sr-only">Add to favorites</span>
        </Button>
      </div>

      {/* Venue Info - Bottom Half */}
      <div className="flex flex-col flex-grow p-5 space-y-3">
        <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
          {venue.name[language]}
        </h3>

        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="flex-shrink-0 mr-1 h-3.5 w-3.5" />
          <span className="truncate">{venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}</span>
        </div>

        {/* Guest capacity */}
        {getGuestCapacity(venue) && (
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="flex-shrink-0 mr-1 h-3.5 w-3.5" />
            <span>{getGuestCapacity(venue)}</span>
          </div>
        )}

        <div className="flex items-center">
          <div className="flex items-center">
            <Star className="flex-shrink-0 h-4 w-4 text-amber-500 mr-1 fill-current" />
            <span className="text-sm text-card-foreground font-medium">{rating.average}</span>
          </div>
          <span className="text-sm text-muted-foreground ml-1 truncate">
            ({rating.count} {t("business.bookings.reviews")})
          </span>
        </div>

        <div className="mt-auto">
          <p className="font-semibold text-primary text-lg">{getPriceDisplay(venue)}</p>
        </div>
      </div>
    </div>
  )
}

export default function VenuesPage() {
  const { t, language } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Initialize state from URL parameters
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000])
  const [usePriceFilter, setUsePriceFilter] = useState(false)
  const [venueTypes, setVenueTypes] = useState<Record<string, boolean>>({
    meetingRoom: false,
    ballroom: false,
    loft: false,
    garden: false,
    rooftop: false,
  })
  const [priceTypes, setPriceTypes] = useState<Record<PricingType, boolean>>({
    [PricingType.HOURLY]: false,
    [PricingType.PER_PERSON]: false,
    [PricingType.FIXED]: false,
  })
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    wifi: false,
    parking: false,
    sound_system: false,
    kitchen: false,
    av_equipment: false,
    bathroom: false,
  })
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    date: "",
    guests: "",
  })
  const [venues, setVenues] = useState<VenueSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVenues, setTotalVenues] = useState(0)
  const venuesPerPage = 9

  const [date, setDate] = React.useState<Date>()
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState("recommended")

  // Initialize filters from URL parameters on component mount
  useEffect(() => {
    const location = searchParams.get("location") || ""
    const dateParam = searchParams.get("date") || ""
    const guests = searchParams.get("guests") || ""

    // Update search filters state
    setSearchFilters({
      location,
      date: dateParam,
      guests,
    })

    if (dateParam) {
      setDate(new Date(dateParam))
    }

    // Fetch venues with URL parameters
    const fetchInitialVenues = async () => {
      setLoading(true)
      try {
        const filters = {
          location: location || undefined,
          guests: guests ? Number.parseInt(guests) : undefined,
          date: dateParam || undefined,
          page: 1,
          limit: venuesPerPage,
        }
        
        const result = await venueService.getVenues(filters)
        setVenues(Array.isArray(result) ? result : result.data)
        setTotalVenues(Array.isArray(result) ? result.length : result.total)
        setTotalPages(Math.ceil((Array.isArray(result) ? result.length : result.total) / venuesPerPage))
        setCurrentPage(1)
      } catch (error) {
        console.error("Error fetching venues:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialVenues()
  }, [searchParams]) // Re-run when URL parameters change

  // Sort venues based on selected option
  const sortVenues = (venues: VenueSummary[]) => {
    const sortedVenues = [...venues]
    
    switch (sortBy) {
      case "price-low":
        return sortedVenues.sort((a, b) => a.price.amount - b.price.amount)
      case "price-high":
        return sortedVenues.sort((a, b) => b.price.amount - a.price.amount)
      case "capacity-low":
        return sortedVenues.sort((a, b) => (a.capacity?.min || 0) - (b.capacity?.min || 0))
      case "capacity-high":
        return sortedVenues.sort((a, b) => (b.capacity?.max || 0) - (a.capacity?.max || 0))
      case "recommended":
      default:
        // Sort by rating first, then by number of reviews
        return sortedVenues.sort((a, b) => {
          const ratingA = getVenueRating(a)
          const ratingB = getVenueRating(b)
          
          if (ratingA.average !== ratingB.average) {
            return ratingB.average - ratingA.average
          }
          return ratingB.count - ratingA.count
        })
    }
  }

  // Update the filtered venues to use sorting and frontend filters
  const filteredAndSortedVenues = sortVenues(venues).filter((venue) => {
    // Apply venue type filter
    const selectedVenueTypes = Object.entries(venueTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type)
    if (selectedVenueTypes.length > 0 && !selectedVenueTypes.includes(venue.type)) {
      return false
    }

    // Apply price type filter
    const selectedPriceTypes = Object.entries(priceTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type as PricingType)
    if (selectedPriceTypes.length > 0 && !selectedPriceTypes.includes(venue.price.type)) {
      return false
    }

    // Apply amenities filter
    const selectedAmenities = Object.entries(amenities)
      .filter(([_, selected]) => selected)
      .map(([amenity]) => amenity)
    if (selectedAmenities.length > 0 && !selectedAmenities.every(amenity => venue.amenities.includes(amenity))) {
      return false
    }

    return true
  })

  const handleVenueTypeChange = (type: string, checked: boolean) => {
    setVenueTypes((prev) => ({ ...prev, [type]: checked }))
  }

  const handlePriceTypeChange = (type: PricingType, checked: boolean) => {
    setPriceTypes((prev) => ({ ...prev, [type]: checked }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setAmenities((prev) => ({ ...prev, [amenity]: checked }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    setSearchFilters((prev) => ({
      ...prev,
      date: date ? format(date, "yyyy-MM-dd") : "",
    }))
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchVenues(1)

    // Update URL parameters
    const params = new URLSearchParams()
    if (searchFilters.location) params.set("location", searchFilters.location)
    if (searchFilters.date) params.set("date", searchFilters.date)
    if (searchFilters.guests) params.set("guests", searchFilters.guests)
    setSearchParams(params)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchVenues(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearAllFilters = async () => {
    // First clear all the filter states
    setPriceRange([0, 1000])
    setUsePriceFilter(false)
    setVenueTypes({
      meetingRoom: false,
      ballroom: false,
      loft: false,
      garden: false,
      rooftop: false,
    })
    setPriceTypes({
      [PricingType.HOURLY]: false,
      [PricingType.PER_PERSON]: false,
      [PricingType.FIXED]: false,
    })
    setAmenities({
      wifi: false,
      parking: false,
      sound_system: false,
      kitchen: false,
      av_equipment: false,
      bathroom: false,
    })
    setSearchFilters({
      location: "",
      date: "",
      guests: "",
    })
    setDate(undefined)
    setCurrentPage(1)
    
    // Clear URL parameters
    setSearchParams({})

    // Make the API call with empty filters
    setLoading(true)
    try {
      const response = await venueService.getVenues({
        page: 1,
        limit: venuesPerPage
      })
      
      if (Array.isArray(response)) {
        setVenues(response)
        setTotalVenues(response.length)
        setTotalPages(Math.ceil(response.length / venuesPerPage))
      } else {
        setVenues(response.data || [])
        setTotalVenues(response.total || 0)
        setTotalPages(Math.ceil((response.total || 0) / venuesPerPage))
      }
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast({
        title: "Error",
        description: "Failed to load venues. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Generate pagination buttons
  const generatePaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={`h-8 w-8 ${currentPage === i ? "btn-primary" : "border-primary text-primary hover:bg-primary/10"}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>,
      )
    }

    return buttons
  }

  const fetchVenues = async (page = 1) => {
    setLoading(true)
    try {
      const selectedVenueTypes = Object.entries(venueTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type)

      const selectedPriceTypes = Object.entries(priceTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type as PricingType)

      const selectedAmenities = Object.entries(amenities)
        .filter(([_, selected]) => selected)
        .map(([amenity]) => amenity)

      const filters = {
        priceMin: usePriceFilter && priceRange[0] > 0 ? priceRange[0] : undefined,
        priceMax: usePriceFilter && priceRange[1] < 1000 ? priceRange[1] : undefined,
        venueTypes: selectedVenueTypes.length > 0 ? selectedVenueTypes : undefined,
        priceTypes: selectedPriceTypes.length > 0 ? selectedPriceTypes : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        location: searchFilters.location || undefined,
        guests: searchFilters.guests ? Number.parseInt(searchFilters.guests) : undefined,
        date: searchFilters.date || undefined,
        page,
        limit: venuesPerPage,
      }

      const response = await venueService.getVenues(filters)
      
      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        setVenues(response)
        setTotalVenues(response.length)
        setTotalPages(Math.ceil(response.length / venuesPerPage))
      } else {
        setVenues(response.data || [])
        setTotalVenues(response.total || 0)
        setTotalPages(Math.ceil((response.total || 0) / venuesPerPage))
      }
      
      setCurrentPage(page)
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast({
        title: "Error",
        description: "Failed to load venues. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Beautiful background styling */}
      <div className="fixed inset-0 overflow-hidden opacity-40 dark:opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-sky-300 to-sky-400 dark:bg-sky-700 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-emerald-300 to-emerald-400 dark:bg-emerald-700 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-violet-200 to-purple-300 dark:bg-purple-700 blur-2xl opacity-60"></div>
      </div>

      {/* Subtle texture overlay for light mode */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10">
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-8 md:mb-12">
              <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full mb-3">
                <span>{t("venues.discover") || "Discover"}</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
                {t("venues.heading") || "Find Your Perfect Venue"}
              </h1>
              <p className="text-muted-foreground text-lg max-w-3xl">
                {t("venues.subheading") || "Browse our curated selection of unique venues for your next event"}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[320px_1fr]">
              <div className="space-y-6">
                {/* Search Card */}
                <div className="card-hover bg-card rounded-xl border shadow-soft p-6">
                  <h2 className="font-semibold text-lg text-card-foreground mb-6 flex items-center">
                    <Search className="mr-2 h-5 w-5 text-primary" />
                    {t("venues.searchBar.title") || "Search"}
                  </h2>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground" htmlFor="location">
                        {t("venues.searchBar.location") || "Location"}
                      </label>
                      <div className="form-input flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                          id="location"
                          name="location"
                          value={searchFilters.location}
                          onChange={handleSearchChange}
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                          placeholder={t("venues.searchBar.locationPlaceholder") || "City, neighborhood, or address"}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground" htmlFor="date">
                        {t("venues.searchBar.date") || "Date"}
                      </label>
                      <div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal form-input",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={handleDateChange}
                              initialFocus
                              className="rounded-md border"
                              weekStartsOn={0}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-card-foreground" htmlFor="guests">
                        {t("venues.searchBar.guests") || "Guests"}
                      </label>
                      <div className="form-input flex items-center gap-3">
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <Input
                          id="guests"
                          name="guests"
                          value={searchFilters.guests}
                          onChange={handleSearchChange}
                          className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          type="number"
                          placeholder={t("venues.searchBar.guestsPlaceholder") || "Number of guests"}
                        />
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-card-foreground" htmlFor="price-range">
                          {t("venues.filters.priceRange") || "Price Range"}
                        </label>
                        <Checkbox
                          id="use-price-filter"
                          checked={usePriceFilter}
                          onCheckedChange={(checked) => setUsePriceFilter(checked === true)}
                          className="checkbox-modern"
                        />
                      </div>
                      <div className="px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={1000}
                          step={10}
                          className="py-2"
                          disabled={!usePriceFilter}
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                          <div className="font-medium">$0</div>
                          <div className={`font-medium ${usePriceFilter ? "text-primary" : "text-muted-foreground"}`}>
                            {priceRange[0] === 0 && priceRange[1] === 1000 ? (
                              "Any price"
                            ) : (
                              <>
                                {priceRange[0] > 0 && priceRange[1] === 1000 && `From $${priceRange[0]}`}
                                {priceRange[0] === 0 && priceRange[1] < 1000 && `Up to $${priceRange[1]}`}
                                {priceRange[0] > 0 && priceRange[1] < 1000 && `$${priceRange[0]} - $${priceRange[1]}`}
                              </>
                            )}
                          </div>
                          <div className="font-medium">$1000</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button className="w-full btn-primary" onClick={handleSearch}>
                        <Search className="mr-2 h-4 w-4" /> {t("venues.searchBar.button") || "Search"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          // Reset all search filters
                          setSearchFilters({
                            location: "",
                            date: "",
                            guests: "",
                          })
                          setDate(undefined)
                          setPriceRange([0, 1000])
                          setUsePriceFilter(false)
                          
                          // Reset all other filters
                          setVenueTypes({
                            meetingRoom: false,
                            ballroom: false,
                            loft: false,
                            garden: false,
                            rooftop: false,
                          })
                          setPriceTypes({
                            [PricingType.HOURLY]: false,
                            [PricingType.PER_PERSON]: false,
                            [PricingType.FIXED]: false,
                          })
                          setAmenities({
                            wifi: false,
                            parking: false,
                            sound_system: false,
                            kitchen: false,
                            av_equipment: false,
                            bathroom: false,
                          })
                          
                          // Clear URL parameters
                          setSearchParams({})
                          
                          // Reset to first page and fetch venues
                          setCurrentPage(1)
                          fetchVenues(1)
                        }}
                      >
                        {t("venues.searchBar.reset") || "Reset Search"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Filters Card - Collapsible */}
                <Collapsible
                  open={isFiltersOpen}
                  onOpenChange={setIsFiltersOpen}
                  className="card-hover bg-card rounded-xl border shadow-soft"
                >
                  <CollapsibleTrigger className="w-full p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-5 w-5 text-primary" />
                      <h2 className="font-semibold text-lg text-card-foreground">
                        {t("venues.filters.title") || "Filters"}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                        onClick={(e) => {
                          e.stopPropagation()
                          setVenueTypes({
                            meetingRoom: false,
                            ballroom: false,
                            loft: false,
                            garden: false,
                            rooftop: false,
                          })
                          setPriceTypes({
                            [PricingType.HOURLY]: false,
                            [PricingType.PER_PERSON]: false,
                            [PricingType.FIXED]: false,
                          })
                          setAmenities({
                            wifi: false,
                            parking: false,
                            sound_system: false,
                            kitchen: false,
                            av_equipment: false,
                            bathroom: false,
                          })
                        }}
                      >
                        {t("venues.filters.clearAll") || "Clear All"}
                      </Button>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isFiltersOpen ? "transform rotate-180" : ""}`} />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-6 pt-0">
                    <div className="space-y-6">
                      {/* Price Type Filter */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-card-foreground">
                          {t("venues.filters.priceType") || "Price Type"}
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="price-type-hourly"
                              checked={priceTypes[PricingType.HOURLY]}
                              onCheckedChange={(checked) => handlePriceTypeChange(PricingType.HOURLY, checked === true)}
                              className="checkbox-modern"
                            />
                            <label
                              htmlFor="price-type-hourly"
                              className="flex items-center text-sm font-medium text-card-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {t("business.serviceNew.hourly")}
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="price-type-perPerson"
                              checked={priceTypes[PricingType.PER_PERSON]}
                              onCheckedChange={(checked) => handlePriceTypeChange(PricingType.PER_PERSON, checked === true)}
                              className="checkbox-modern"
                            />
                            <label
                              htmlFor="price-type-perPerson"
                              className="flex items-center text-sm font-medium text-card-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              {t("business.serviceNew.perPerson")}
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="price-type-fixed"
                              checked={priceTypes[PricingType.FIXED]}
                              onCheckedChange={(checked) => handlePriceTypeChange(PricingType.FIXED, checked === true)}
                              className="checkbox-modern"
                            />
                            <label
                              htmlFor="price-type-fixed"
                              className="flex items-center text-sm font-medium text-card-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                              {t("business.serviceNew.flatFee")}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Venue Types */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-card-foreground">{t("venues.venueType") || "Venue Type"}</h3>
                        <div className="space-y-3">
                          {Object.entries(VENUE_TYPES).map(([type, label]) => {
                            const TypeIcon = getVenueTypeIcon(type)
                            return (
                              <div key={type} className="flex items-center space-x-3">
                                <Checkbox
                                  id={`type-${type}`}
                                  checked={venueTypes[type]}
                                  onCheckedChange={(checked) => handleVenueTypeChange(type, checked === true)}
                                  className="checkbox-modern"
                                />
                                <label
                                  htmlFor={`type-${type}`}
                                  className="flex items-center text-sm font-medium text-card-foreground hover:text-primary transition-colors cursor-pointer"
                                >
                                  <TypeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                  {label}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-card-foreground">{t("venues.amenities") || "Amenities"}</h3>
                        <div className="space-y-3">
                          {Object.entries(VENUE_AMENITIES).map(([key, { label, icon: Icon }]) => (
                            <div key={key} className="flex items-center space-x-3">
                              <Checkbox
                                id={`amenity-${key}`}
                                checked={amenities[key]}
                                onCheckedChange={(checked) => handleAmenityChange(key, checked === true)}
                                className="checkbox-modern"
                              />
                              <label
                                htmlFor={`amenity-${key}`}
                                className="flex items-center text-sm font-medium text-card-foreground hover:text-primary transition-colors cursor-pointer"
                              >
                                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between bg-card rounded-xl border shadow-soft p-6">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground">{t("venues.title") || "Venues"}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Showing {filteredAndSortedVenues.length > 0 ? (currentPage - 1) * venuesPerPage + 1 : 0}-
                      {Math.min(currentPage * venuesPerPage, totalVenues)} of {totalVenues} venues
                    </p>
                  </div>
                  <div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] form-input">
                        <SelectValue placeholder={t("venues.sortBy") || "Sort by"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recommended">{t("venues.sort.recommended") || "Recommended"}</SelectItem>
                        <SelectItem value="price-low">{t("venues.sort.priceLowToHigh") || "Price: Low to High"}</SelectItem>
                        <SelectItem value="price-high">{t("venues.sort.priceHighToLow") || "Price: High to Low"}</SelectItem>
                        <SelectItem value="capacity-low">{t("venues.sort.capacityLowToHigh") || "Capacity: Low to High"}</SelectItem>
                        <SelectItem value="capacity-high">{t("venues.sort.capacityHighToLow") || "Capacity: High to Low"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-card rounded-xl border shadow-soft p-6 animate-pulse">
                        <div className="h-48 bg-muted rounded-lg mb-4"></div>
                        <div className="h-4 bg-muted rounded mb-2"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Venue Grid */}
                {!loading && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedVenues.map((venue) => (
                      <Link to={`/venues/${venue.id}`} key={venue.id} className="group">
                        <VenueCard venue={venue} language={language} t={t} />
                      </Link>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!loading && filteredAndSortedVenues.length === 0 && (
                  <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
                    <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-2">{t("venues.noResults") || "No venues found"}</h3>
                    <p className="text-muted-foreground mb-6">
                      {t("venues.tryAdjusting") || "Try adjusting your filters or search criteria"}
                    </p>

                  </div>
                )}

                {/* Pagination */}
                {!loading && filteredAndSortedVenues.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === 1}
                      className="border-primary/20 text-muted-foreground disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {generatePaginationButtons()}

                    <Button
                      variant="outline"
                      size="icon"
                      disabled={currentPage === totalPages}
                      className="border-primary text-primary hover:bg-primary/10 disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
