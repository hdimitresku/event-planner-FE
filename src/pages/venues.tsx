"use client"

import React from "react"

import { useState, useEffect, useRef } from "react"
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
} from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { type VenueSummary, VenueType, VenueAmenity } from "../models/venue"
import { PricingType } from "../models/common"
import * as venueService from "../services/venueService"
import { useFavorites } from "../context/favorites-context"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

// Define price type interface
type PriceType = "hourly" | "perPerson" | "fixed" | "custom"

// Define venue interface with price type
interface Venue {
  id: number
  name: {
    en: string
    sq: string
  }
  location: {
    en: string
    sq: string
  }
  rating: number
  reviews: number
  price: number
  priceType: PriceType
  type: string
  amenities: string[]
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

// VenueCard Component
const VenueCard = ({ venue, language, t }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [currentSlide, setCurrentSlide] = useState(0)
  const carouselRef = useRef(null)
  const timerRef = useRef(null)
  const rating = getVenueRating(venue)
  const CARD_HEIGHT = 350 // Total card height
  const CAROUSEL_HEIGHT = CARD_HEIGHT / 2 // Half the card height

  // Auto-scroll functionality
  useEffect(() => {
    if (venue.media && venue.media.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % venue.media.length)
        if (carouselRef.current && carouselRef.current.api) {
          carouselRef.current.api.scrollNext()
        }
      }, 3000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [venue.media])

  // Function to get venue type display name
  const getVenueTypeDisplay = (type: string) => {
    switch (type) {
      case VenueType.MEETING_ROOM:
        return t("business.venueTypes.meetingRoom")
      case VenueType.PARTY_VENUE:
        return t("business.venueTypes.ballroom")
      case VenueType.PHOTOGRAPHY_STUDIO:
        return t("business.venueTypes.loft")
      case VenueType.WEDDING_VENUE:
        return t("business.venueTypes.ballroom")
      case VenueType.OUTDOOR_SPACE:
        return t("business.venueTypes.garden")
      default:
        return type
    }
  }

  // Get price display based on price type and language
  const getPriceDisplay = (venue: VenueSummary) => {
    const formatPrice = (price: number) => `$${price}`

    switch (venue.price.type) {
      case PricingType.HOURLY:
        return `${formatPrice(venue.price.amount)}/${t("business.serviceNew.hourly")}`
      case PricingType.PER_PERSON:
        return `${formatPrice(venue.price.amount)}/${t("business.serviceNew.perPerson")}`
      case PricingType.FIXED:
        return formatPrice(venue.price.amount)
      case PricingType.CUSTOM:
        return t("business.serviceNew.flatFee")
      default:
        return formatPrice(venue.price.amount)
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

  // Handle carousel navigation button clicks
  const handleCarouselButtonClick = (e, direction) => {
    e.preventDefault()
    e.stopPropagation()

    if (carouselRef.current && carouselRef.current.api) {
      if (direction === "prev") {
        carouselRef.current.api.scrollPrev()
      } else {
        carouselRef.current.api.scrollNext()
      }
    }
  }

  return (
    <div className="flex flex-col h-[350px] bg-white/95 dark:bg-slate-800/95 border border-gray-200/80 dark:border-slate-700 shadow-lg hover:shadow-xl hover:shadow-gray-500/10 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
      {/* Image Carousel - Top Half */}
      <div className="relative h-[175px] w-full overflow-hidden">
        {venue.media && venue.media.length > 0 ? (
          <Carousel
            className="w-full h-full"
            ref={carouselRef}
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent className="h-full">
              {venue.media.map((image, index) => (
                <CarouselItem key={image.id || index} className="h-full">
                  <div className="h-full w-full relative">
                    <img
                      src={formatImageUrl(image.url) || "/placeholder.svg"}
                      alt={`${venue.name[language]} - Image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {/* Add a gradient overlay to ensure badge visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div
              onClick={(e) => handleCarouselButtonClick(e, "prev")}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-none z-20 rounded-full flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </div>
            <div
              onClick={(e) => handleCarouselButtonClick(e, "next")}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/80 hover:bg-white border-none z-20 rounded-full flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </div>
          </Carousel>
        ) : (
          <div className="h-full w-full relative">
            <img src="/placeholder.svg" alt={venue.name[language]} className="h-full w-full object-cover" />
            {/* Add a gradient overlay to ensure badge visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          </div>
        )}
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium shadow-sm border border-gray-100">
            {getPriceTypeBadge(venue.price.type)}
          </Badge>
        </div>
        {/* Add venue type badge at bottom left */}
        <div className="absolute bottom-2 left-2 z-10">
          <Badge variant="outline" className="bg-black/60 text-white border-none font-medium shadow-sm">
            {getVenueTypeDisplay(venue.type)}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-2 top-2 h-8 w-8 rounded-full z-10 ${
            isFavorite(venue.id)
              ? "bg-white text-red-500 hover:text-red-600"
              : "bg-white/80 text-gray-400 hover:text-red-500"
          } hover:bg-white shadow-sm border border-gray-100`}
          onClick={(e) => {
            e.preventDefault() // Prevent navigation
            e.stopPropagation() // Prevent event bubbling
            toggleFavorite(venue.id, venue.name[language])
          }}
        >
          <Heart className={`h-4 w-4 ${isFavorite(venue.id) ? "fill-current" : ""}`} />
          <span className="sr-only">Add to favorites</span>
        </Button>
      </div>

      {/* Venue Info - Bottom Half */}
      <div className="flex flex-col flex-grow p-4 space-y-3">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
          {venue.name[language]}
        </h3>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="flex-shrink-0 mr-1 h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
          <span className="truncate">{venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}</span>
        </div>
        <div className="flex items-center">
          <div className="flex items-center">
            <Star className="flex-shrink-0 h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-800 dark:text-gray-200">{rating.average}</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1 truncate">
            ({rating.count} {t("business.bookings.reviews")})
          </span>
        </div>
        <div className="mt-auto">
          <p className="font-medium text-sky-600 dark:text-sky-400">{getPriceDisplay(venue)}</p>
        </div>
      </div>
    </div>
  )
}

export default function VenuesPage() {
  const { t, language } = useLanguage()
  const [priceRange, setPriceRange] = useState<number[]>([250])
  const [venueTypes, setVenueTypes] = useState<Record<string, boolean>>({
    [VenueType.MEETING_ROOM]: false,
    [VenueType.PARTY_VENUE]: false,
    [VenueType.PHOTOGRAPHY_STUDIO]: false,
    [VenueType.WEDDING_VENUE]: false,
    [VenueType.OUTDOOR_SPACE]: false,
  })
  const [priceTypes, setPriceTypes] = useState<Record<PricingType, boolean>>({
    [PricingType.HOURLY]: false,
    [PricingType.PER_PERSON]: false,
    [PricingType.FIXED]: false,
    [PricingType.CUSTOM]: false,
    [PricingType.PER_DAY]: false,
  })
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    [VenueAmenity.WIFI]: false,
    [VenueAmenity.PARKING]: false,
    [VenueAmenity.SOUND_SYSTEM]: false,
    [VenueAmenity.KITCHEN]: false,
    [VenueAmenity.AV_EQUIPMENT]: false,
  })
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    guests: "",
  })
  const [venues, setVenues] = useState<VenueSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  })

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    setLoading(true)
    try {
      const selectedVenueTypes = Object.entries(venueTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type as VenueType)

      const selectedPriceTypes = Object.entries(priceTypes)
        .filter(([_, selected]) => selected)
        .map(([type]) => type as PricingType)

      const selectedAmenities = Object.entries(amenities)
        .filter(([_, selected]) => selected)
        .map(([amenity]) => amenity as VenueAmenity)

      const filters = {
        priceMax: priceRange[0],
        venueTypes: selectedVenueTypes.length > 0 ? selectedVenueTypes : undefined,
        priceTypes: selectedPriceTypes.length > 0.0 ? selectedPriceTypes : undefined,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
        location: searchParams.location || undefined,
        guests: searchParams.guests ? Number.parseInt(searchParams.guests) : undefined,
        page: pagination.page,
        limit: pagination.limit,
      }

      const result = await venueService.getVenues(filters)
      setVenues(result)
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
      })
    } catch (error) {
      console.error("Error fetching venues:", error)
    } finally {
      setLoading(false)
    }
  }

  const [date, setDate] = React.useState<Date>()

  // Filter venues based on selected filters
  const filteredVenues = venues.filter((venue) => {
    // Price filter
    if (venue.price.amount > priceRange[0]) return false

    // Venue type filter
    const selectedTypes = Object.entries(venueTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type as VenueType)
    if (selectedTypes.length > 0 && !selectedTypes.includes(venue.type)) return false

    // Price type filter
    const selectedPriceTypes = Object.entries(priceTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type as PricingType)
    if (selectedPriceTypes.length > 0 && !selectedPriceTypes.includes(venue.price.type)) return false

    // Amenities filter
    const selectedAmenities = Object.entries(amenities)
      .filter(([_, selected]) => selected)
      .map(([amenity]) => amenity as VenueAmenity)
    if (selectedAmenities.length > 0 && !selectedAmenities.every((amenity) => venue.amenities.includes(amenity)))
      return false

    // Search filters
    if (
      searchParams.location &&
      venue.address &&
      !venue.address.city.toLowerCase().includes(searchParams.location.toLowerCase()) &&
      !venue.address.country.toLowerCase().includes(searchParams.location.toLowerCase())
    )
      return false

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
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const selectedDate = searchParams.date ? new Date(searchParams.date) : ""

  const handleDateChange = (date: Date | undefined) => {
    setDate(date)
    handleSearchChange({
      target: {
        name: "date",
        value: date ? format(date, "yyyy-MM-dd") : "",
      },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  const handleSearch = () => {
    pagination.page = 1
    fetchVenues()
  }

  const clearAllFilters = () => {
    setPriceRange([250])
    setVenueTypes({
      [VenueType.MEETING_ROOM]: false,
      [VenueType.PARTY_VENUE]: false,
      [VenueType.PHOTOGRAPHY_STUDIO]: false,
      [VenueType.WEDDING_VENUE]: false,
      [VenueType.OUTDOOR_SPACE]: false,
    })
    setPriceTypes({
      [PricingType.HOURLY]: false,
      [PricingType.PER_PERSON]: false,
      [PricingType.FIXED]: false,
      [PricingType.CUSTOM]: false,
      [PricingType.PER_DAY]: false,
    })
    setAmenities({
      [VenueAmenity.WIFI]: false,
      [VenueAmenity.PARKING]: false,
      [VenueAmenity.SOUND_SYSTEM]: false,
      [VenueAmenity.KITCHEN]: false,
      [VenueAmenity.AV_EQUIPMENT]: false,
    })
    setSearchParams({
      location: "",
      date: "",
      guests: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-8 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-400 bg-gradient-to-r from-sky-100 to-sky-50 dark:bg-sky-900/40 rounded-full mb-3 border border-sky-200/60 dark:border-sky-700/50">
            <span>{t("venues.discover") || "Discover"}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mb-2">
            {t("venues.heading") || "Find Your Perfect Venue"}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl">
            {t("venues.subheading") || "Browse our curated selection of unique venues for your next event"}
          </p>
        </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <div className="space-y-3 bg-white/95 dark:bg-slate-800/95 rounded-xl border border-gray-200/80 dark:border-slate-700 shadow-lg p-6 backdrop-blur-sm">
            <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-50 mb-5 flex items-center">
              <Search className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-400" />
              {t("venues.searchBar.title") || "Search"}
            </h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="location">
                  {t("venues.searchBar.location") || "Location"}
                </label>
                <div className="flex items-center gap-2 border border-gray-200 dark:border-slate-600 rounded-md p-3 bg-gray-50/80 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-sky-300 dark:focus-within:border-sky-500 transition-all">
                  <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleSearchChange}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-900 dark:text-gray-100"
                    placeholder={t("venues.searchBar.locationPlaceholder") || "City, neighborhood, or address"}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="date">
                  {t("venues.searchBar.date") || "Date"}
                </label>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-sky-300 dark:focus-within:border-sky-500 transition-all hover:bg-gray-100 dark:hover:bg-slate-600",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                        weekStartsOn={0} // 0 for Sunday, 1 for Monday, etc.
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-800 dark:text-gray-200" htmlFor="guests">
                  {t("venues.searchBar.guests") || "Guests"}
                </label>
                <div className="flex items-center gap-2 border border-gray-200 dark:border-slate-600 rounded-md p-3 bg-gray-50/80 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-sky-300 dark:focus-within:border-sky-500 transition-all">
                  <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <Input
                    id="guests"
                    name="guests"
                    value={searchParams.guests}
                    onChange={handleSearchChange}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-gray-900 dark:text-gray-100"
                    type="number"
                    placeholder={t("venues.searchBar.guestsPlaceholder") || "Number of guests"}
                  />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" /> {t("venues.searchBar.button") || "Search"}
              </Button>
            </div>
          </div>
          <div className="space-y-3 bg-white/95 dark:bg-slate-800/95 rounded-xl border border-gray-200/80 dark:border-slate-700 shadow-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-50 flex items-center">
                <Filter className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-400" />
                {t("venues.filters.title") || "Filters"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                onClick={clearAllFilters}
              >
                {t("venues.filters.clearAll") || "Clear All"}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {t("venues.filters.priceRange") || "Price Range"}
                </h3>
                <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="py-2" />
                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                  <div className="font-medium">$0</div>
                  <div className="font-medium text-sky-600 dark:text-sky-400">${priceRange[0]}</div>
                  <div className="font-medium">$500</div>
                </div>
              </div>

              {/* Price Type Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.filters.priceType") || "Price Type"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-hourly"
                      checked={priceTypes[PricingType.HOURLY]}
                      onCheckedChange={(checked) => handlePriceTypeChange(PricingType.HOURLY, checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-hourly"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.serviceNew.hourly")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-perPerson"
                      checked={priceTypes[PricingType.PER_PERSON]}
                      onCheckedChange={(checked) => handlePriceTypeChange(PricingType.PER_PERSON, checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-perPerson"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.serviceNew.perPerson")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-fixed"
                      checked={priceTypes[PricingType.FIXED]}
                      onCheckedChange={(checked) => handlePriceTypeChange(PricingType.FIXED, checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-fixed"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.serviceNew.flatFee")}
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.venueType") || "Venue Type"}
                </h3>
                <div className="space-y-3">
                  {Object.keys(venueTypes).map((type) => {
                    // Map venue types to keys for business.venueTypes translations
                    const typeKey =
                      type === VenueType.MEETING_ROOM
                        ? "meetingRoom"
                        : type === VenueType.PARTY_VENUE
                          ? "ballroom"
                          : type === VenueType.PHOTOGRAPHY_STUDIO
                            ? "loft"
                            : type === VenueType.WEDDING_VENUE
                              ? "ballroom"
                              : type === VenueType.OUTDOOR_SPACE
                                ? "garden"
                                : "other"

                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={venueTypes[type]}
                          onCheckedChange={(checked) => handleVenueTypeChange(type, checked === true)}
                          className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                        >
                          {t(`business.venueTypes.${typeKey}`)}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.amenities") || "Amenities"}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: t("venues.amenities.wifi") || "WiFi", icon: Wifi, key: VenueAmenity.WIFI },
                    { label: t("venues.amenities.parking") || "Parking", icon: Parking, key: VenueAmenity.PARKING },
                    {
                      label: t("venues.amenities.soundSystem") || "Sound System",
                      icon: Music,
                      key: VenueAmenity.SOUND_SYSTEM,
                    },
                    { label: t("venues.amenities.kitchen") || "Kitchen", icon: Utensils, key: VenueAmenity.KITCHEN },
                    {
                      label: t("venues.amenities.avEquipment") || "AV Equipment",
                      icon: Tv,
                      key: VenueAmenity.AV_EQUIPMENT,
                    },
                  ].map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.key}`}
                        checked={amenities[amenity.key]}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.key, checked === true)}
                        className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                      />
                      <label
                        htmlFor={`amenity-${amenity.key}`}
                        className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                      >
                        <amenity.icon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
                <Filter className="mr-2 h-4 w-4" /> {t("venues.filters.applyFilters") || "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-hover bg-background rounded-lg overflow-hidden shadow-soft space-y-0 flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
            <h1 className="text-xl font-bold  text-gray-800 dark:text-gray-50">
              {t("venues.title") || "Venues in New York"}
            </h1>
            <div className="rounded-md bg-background border border-muted shadow-sm hover:border-primary hover:ring-1 hover:ring-primary">
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50">
                  <SelectValue placeholder={t("venues.sortBy") || "Sort by"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">{t("venues.sort.recommended") || "Recommended"}</SelectItem>
                  <SelectItem value="price-low">{t("venues.sort.priceLowToHigh") || "Price: Low to High"}</SelectItem>
                  <SelectItem value="price-high">{t("venues.sort.priceHighToLow") || "Price: High to Low"}</SelectItem>
                  <SelectItem value="rating">{t("venues.sort.topRated") || "Top Rated"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <Link to={`/venues/${venue.id}`} key={venue.id} className="group">
                <VenueCard venue={venue} language={language} t={t} />
              </Link>
            ))}
          </div>
          {filteredVenues.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="h-16 w-16 mx-auto rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-50">
                {t("venues.noResults") || "No venues found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t("venues.tryAdjusting") || "Try adjusting your filters or search criteria"}
              </p>
              <Button
                variant="outline"
                className="mt-4 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                onClick={clearAllFilters}
              >
                {t("venues.filters.clearAll") || "Clear all filters"}
              </Button>
            </div>
          )}
          {filteredVenues.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                disabled
                className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                <span className="sr-only">{t("venues.previousPage") || "Previous page"}</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-sky-500 bg-sky-500 text-white" disabled>
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                4
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                5
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                <span className="sr-only">{t("venues.nextPage") || "Next page"}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
