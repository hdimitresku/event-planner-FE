"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useParams, Link, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Calendar } from "../components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { useLanguage } from "../context/language-context"
import { useCurrency, type Currency } from "../context/currency-context"
import { cn } from "../components/ui/utils"
import {
  MapPin,
  Star,
  Users,
  Clock,
  CalendarIcon,
  Wifi,
  ParkingMeterIcon as Parking,
  Music,
  Utensils,
  Tv,
  Heart,
  Share2,
  MessageSquare,
  ChevronRight,
  Info,
  CheckCircle2,
  DollarSign,
  User,
  Lightbulb,
  ShieldCheck,
  PartyPopper,
  Car,
  Camera,
  Sparkles,
  Building2,
  MapPinIcon,
  TagsIcon,
  DollarSignIcon,
  PackageIcon,
  RefreshCw,
} from "lucide-react"
import { Input } from "../components/ui/input"
import { format, isAfter, isBefore, parseISO, parse, set, addDays, addHours } from "date-fns"
import { isValid } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { useFavorites } from "../context/favorites-context"
import * as venueService from "../services/venueService"
import * as serviceService from "../services/serviceService"
import { type Venue, VenueAmenity } from "../models/venue"
import { PricingType } from "../models/common"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip"

// Define service type interface
interface ServiceTypeData {
  type: string
  icon: string
}

// Define similar venue interface with match criteria
interface SimilarVenue extends Venue {
  matchCriteria: {
    venueType: boolean
    location: boolean
    capacity: boolean
    services: boolean
    price: boolean
    amenities: boolean
  }
  similarityScore: number
}

// Define similarity criterion type
interface SimilarityCriterion {
  id: string
  label: string
  icon: React.ReactNode
  color: string
}

export default function VenueDetailPage() {
  const { t, language } = useLanguage()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const { formatPrice } = useCurrency()

  // Extract data from location state if coming back from venue-book
  const {
    startDate: initialStartDate,
    endDate: initialEndDate,
    guests: initialGuests,
    eventType: initialEventType,
    selectedServices: initialSelectedServices,
  } = location.state || {}

  // Define available similarity criteria
  const availableCriteria: SimilarityCriterion[] = [
    {
      id: "type",
      label: t("venueDetail.similarityType"),
      icon: <Building2 className="h-4 w-4" />,
      color: "text-primary",
    },
    {
      id: "location",
      label: t("venueDetail.similarityLocation"),
      icon: <MapPinIcon className="h-4 w-4" />,
      color: "text-secondary",
    },
    {
      id: "capacity",
      label: t("venueDetail.similarityCapacity"),
      icon: <Users className="h-4 w-4" />,
      color: "text-accent",
    },
    {
      id: "amenities",
      label: t("venueDetail.similarityAmenities"),
      icon: <PackageIcon className="h-4 w-4" />,
      color: "text-primary",
    },
    {
      id: "price",
      label: t("venueDetail.similarityPrice"),
      icon: <DollarSignIcon className="h-4 w-4" />,
      color: "text-secondary",
    },
  ]

  // Helper functions
  const parseDate = (dateValue: any): Date | undefined => {
    if (!dateValue) return undefined

    if (dateValue instanceof Date) return dateValue

    try {
      const parsedDate = typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue)
      return isValid(parsedDate) ? parsedDate : undefined
    } catch (e) {
      console.error("Error parsing date:", e)
      return undefined
    }
  }

  // Get blocked dates from venue metadata
  const getBlockedDates = () => {
    if (!venue || !venue.metadata || !venue.metadata.blockedDates) return []

    return venue.metadata.blockedDates.map((date) => {
      // Handle both string and ISO date formats
      const startDate =
        typeof date.startDate === "string"
          ? date.startDate.includes("T")
            ? parseISO(date.startDate)
            : new Date(date.startDate)
          : date.startDate

      const endDate =
        typeof date.endDate === "string"
          ? date.endDate.includes("T")
            ? parseISO(date.endDate)
            : new Date(date.endDate)
          : date.endDate

      return {
        start: startDate,
        end: endDate || startDate, // If no end date, use start date as end date
      }
    })
  }

  // Helper function to check if date is available
  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date < today) return false

    // Check if the date falls within any blocked range
    return !blockedDates.some(({ start, end }) => {
      const startDate = new Date(start)
      const endDate = new Date(end)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      return date >= startDate && date <= endDate
    })
  }

  // State declarations
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [blockedDates, setBlockedDates] = useState<Array<{ start: Date; end: Date }>>([])

  // Helper function to get earliest available date based on blocked dates
  const getEarliestAvailableDate = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // If today is not blocked, return today
    if (
      !blockedDates.some(({ start, end }) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        return today >= startDate && today <= endDate
      })
    ) {
      return today
    }

    // Find the first available date after today
    let currentDate = addDays(today, 1)
    while (
      blockedDates.some(({ start, end }) => {
        const startDate = new Date(start)
        const endDate = new Date(end)
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 999)
        return currentDate >= startDate && currentDate <= endDate
      })
    ) {
      currentDate = addDays(currentDate, 1)
    }
    return currentDate
  }

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const initialDate = parseDate(initialStartDate)
    if (initialDate) {
      return initialDate
    }
    return getEarliestAvailableDate()
  })

  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const initialDate = parseDate(initialEndDate)
    if (initialDate) {
      return initialDate
    }
    const startDate = parseDate(initialStartDate) || getEarliestAvailableDate()
    return addHours(startDate, 3)
  })

  // Update dates when blocked dates change
  useEffect(() => {
    if (blockedDates.length > 0) {
      const earliestDate = getEarliestAvailableDate()
      if (!selectedDate || !isDateAvailable(selectedDate)) {
        setSelectedDate(earliestDate)
        setEndDate(addHours(earliestDate, 3))
      }
    }
  }, [blockedDates])

  // Update date selection handlers
  const handleStartDateSelect = (date: Date | undefined) => {
    // If trying to deselect, set to earliest available date
    if (!date) {
      setSelectedDate(getEarliestAvailableDate())
      return
    }
    setSelectedDate(date)
    if (date) {
      setValidationErrors((prev) => ({ ...prev, startDate: undefined, startTime: undefined }))
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    // If trying to deselect, set to start date + 3 hours
    if (!date && selectedDate) {
      setEndDate(addHours(selectedDate, 3))
      return
    }
    setEndDate(date)
    if (date) {
      setValidationErrors((prev) => ({ ...prev, endDate: undefined, endTime: undefined }))
    }
  }

  const [guests, setGuests] = useState<number | undefined>(initialGuests)
  const [activeTab, setActiveTab] = useState("overview")
  const [availableServiceTypes, setAvailableServiceTypes] = useState<ServiceTypeData[]>([])
  const [selectedServices, setSelectedServices] = useState(initialSelectedServices || {})
  const [eventType, setEventType] = useState(initialEventType || "")
  const [similarVenues, setSimilarVenues] = useState<SimilarVenue[]>([])
  const [loadingSimilarVenues, setLoadingSimilarVenues] = useState(false)
  const [similarityCriteria, setSimilarityCriteria] = useState<string[]>(["type", "location"])
  const [refreshingSimilarVenues, setRefreshingSimilarVenues] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
    guests?: string
  }>({})

  // Updated function to check if a given date/time is within operating hours
  const isTimeWithinOperatingHours = (date: Date) => {
    if (!venue?.dayAvailability) return true

    // Get the day name in lowercase (e.g., "monday")
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const operatingHours = venue.dayAvailability[dayName]
    if (!operatingHours || operatingHours === "Closed") return false

    // Parse the operating hours (e.g., "9:00 AM - 10:00 PM")
    const [openTimeStr, closeTimeStr] = operatingHours.split(" - ")

    // Parse opening and closing times using date-fns
    const baseDate = new Date() // Use a dummy date for parsing
    const openTime = parse(openTimeStr, "h:mm a", baseDate)
    let closeTime = parse(closeTimeStr, "h:mm a", baseDate)

    // Handle cases where closing time is past midnight (e.g., "12:00 AM")
    if (closeTimeStr === "12:00 AM") {
      closeTime = set(closeTime, { hours: 0, minutes: 0 }) // Set to 00:00 of the same day
      closeTime.setDate(closeTime.getDate() + 1) // Move to the next day
    }

    // Extract the hours and minutes from the input date
    const selectedTime = set(baseDate, {
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: 0,
      milliseconds: 0,
    })

    // Compare the times
    // If closing time is on the next day, adjust the comparison
    if (isBefore(closeTime, openTime)) {
      // Closing time is on the next day (e.g., 12:00 AM is after 9:00 AM)
      return (
        isAfter(selectedTime, openTime) ||
        selectedTime.getTime() === openTime.getTime() ||
        isBefore(selectedTime, closeTime) ||
        selectedTime.getTime() === closeTime.getTime()
      )
    } else {
      // Same-day comparison
      return (
        (isAfter(selectedTime, openTime) || selectedTime.getTime() === openTime.getTime()) &&
        (isBefore(selectedTime, closeTime) || selectedTime.getTime() === closeTime.getTime())
      )
    }
  }

  // Validation function
  const validateBookingInputs = () => {
    const errors: typeof validationErrors = {}

    // Validate start date
    if (!selectedDate) {
      errors.startDate = t("venueDetail.validation.startDateRequired")
    } else if (!isDateAvailable(selectedDate)) {
      errors.startDate = t("venueDetail.validation.dateNotAvailable")
    } else if (!isTimeWithinOperatingHours(selectedDate)) {
      errors.startTime = t("venueDetail.validation.timeOutsideOperatingHours")
    }

    // Validate end date
    if (!endDate) {
      errors.endDate = t("venueDetail.validation.endDateRequired")
    } else if (!isDateAvailable(endDate)) {
      errors.endDate = t("venueDetail.validation.dateNotAvailable")
    } else if (!isTimeWithinOperatingHours(endDate)) {
      errors.endTime = t("venueDetail.validation.timeOutsideOperatingHours")
    } else if (selectedDate && endDate <= selectedDate) {
      errors.endDate = t("venueDetail.validation.endDateAfterStart")
    }

    // Validate guests
    const guestCount = guests || venue?.capacity.min || 0
    if (venue) {
      if (guestCount < venue.capacity.min) {
        errors.guests = t("venueDetail.validation.guestsMinimum", { min: venue.capacity.min })
      } else if (guestCount > venue.capacity.max) {
        errors.guests = t("venueDetail.validation.guestsMaximum", { max: venue.capacity.max })
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGuestsChange = (value: number) => {
    setGuests(value)
    // Clear validation errors for guests
    setValidationErrors((prev) => ({ ...prev, guests: undefined }))
  }

  // Effects
  useEffect(() => {
    const fetchVenueData = async () => {
      setLoading(true)
      try {
        if (id) {
          const venueData = await venueService.getVenueById(id)
          const result = await serviceService.getServiceTypesByVenueType(venueData?.type)

          // Get unique service types only (remove duplicates)
          const uniqueServiceTypes = result.filter(
            (serviceType, index, self) => index === self.findIndex((st) => st.type === serviceType.type),
          )

          setAvailableServiceTypes(uniqueServiceTypes)
          setVenue(venueData)

          if (venueData?.capacity?.min && !initialGuests) {
            setGuests(venueData.capacity.min)
          }
        }
      } catch (error) {
        console.error("Error fetching venue:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVenueData()
  }, [id, initialGuests])

  // Update blocked dates when venue changes
  useEffect(() => {
    if (venue) {
      setBlockedDates(getBlockedDates())
      // Update selected date to earliest available if current selection is blocked
      if (selectedDate && !isDateAvailable(selectedDate)) {
        setSelectedDate(getEarliestAvailableDate())
      }
      // Update end date to 3 hours after start date if current selection is blocked
      if (endDate && !isDateAvailable(endDate)) {
        setEndDate(addHours(selectedDate || getEarliestAvailableDate(), 3))
      }
    }
  }, [venue])

  // Fetch similar venues when criteria change or when explicitly refreshed
  useEffect(() => {
    if (venue && id && (similarityCriteria.length > 0 || refreshingSimilarVenues)) {
      fetchSimilarVenues(id)
    }
  }, [similarityCriteria, refreshingSimilarVenues, venue, id])

  // Fetch similar venues based on matching criteria
  const fetchSimilarVenues = async (venueId: string) => {
    setLoadingSimilarVenues(true)
    setRefreshingSimilarVenues(false)
    try {
      // Use the current similarityCriteria state to fetch venues
      const venues = await venueService.getSimilarVenues(venueId, similarityCriteria, 3)
      setSimilarVenues(venues)
    } catch (error) {
      console.error("Error fetching similar venues:", error)
      setSimilarVenues([])
    } finally {
      setLoadingSimilarVenues(false)
    }
  }

  // Toggle a criterion in the similarityCriteria array
  const toggleCriterion = (criterionId: string) => {
    setSimilarityCriteria((prev) =>
      prev.includes(criterionId) ? prev.filter((c) => c !== criterionId) : [...prev, criterionId],
    )
  }

  // Refresh similar venues with current criteria
  const refreshSimilarVenues = () => {
    setRefreshingSimilarVenues(true)
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="container px-4 md:px-6 py-8 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t("venueDetail.notFound")}</h2>
          <p className="text-muted-foreground mb-6">{t("venueDetail.venueNotFound")}</p>
          <Link to="/venues">
            <Button>{t("venueDetail.backToVenues")}</Button>
          </Link>
        </div>
      </div>
    )
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

  // Get price display based on price type and language
  const getPriceDisplay = (venue: Venue) => {
    if (!venue || !venue.price) return ""

    const price = venue.price.amount
    switch (venue.price.type) {
      case PricingType.HOURLY:
        return `$${price}/${t("business.pricing.hourly")}`
      case PricingType.PER_PERSON:
        return `$${price}/${t("business.pricing.perPerson")}`
      case PricingType.FIXED:
        return `$${price}`
      case PricingType.CUSTOM:
        return t("business.pricing.custom")
      default:
        return `$${price}`
    }
  }

  // Get badge color and text for price type
  const getPriceTypeBadge = (priceType: PricingType) => {
    switch (priceType) {
      case PricingType.HOURLY:
        return {
          text: t("business.pricing.hourly"),
          bgColor: "bg-primary/10 text-primary border-primary/20",
        }
      case PricingType.PER_PERSON:
        return {
          text: t("business.pricing.perPerson"),
          bgColor: "bg-secondary/10 text-secondary border-secondary/20",
        }
      case PricingType.FIXED:
        return {
          text: t("business.pricing.fixed"),
          bgColor: "bg-accent/10 text-accent border-accent/20",
        }
      case PricingType.CUSTOM:
        return {
          text: t("business.pricing.custom"),
          bgColor: "bg-muted text-muted-foreground border-border",
        }
      default:
        return {
          text: "",
          bgColor: "",
        }
    }
  }

  // Get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case VenueAmenity.WIFI:
        return <Wifi className="h-4 w-4 mr-2" />
      case VenueAmenity.PARKING:
        return <Parking className="h-4 w-4 mr-2" />
      case VenueAmenity.SOUND_SYSTEM:
        return <Music className="h-4 w-4 mr-2" />
      case VenueAmenity.KITCHEN:
        return <Utensils className="h-4 w-4 mr-2" />
      case VenueAmenity.AV_EQUIPMENT:
        return <Tv className="h-4 w-4 mr-2" />
      default:
        return <CheckCircle2 className="h-4 w-4 mr-2" />
    }
  }

  // Get icon for price type
  const getPriceTypeIcon = (priceType: PricingType) => {
    switch (priceType) {
      case PricingType.HOURLY:
        return <Clock className="h-4 w-4 mr-2" />
      case PricingType.PER_PERSON:
        return <User className="h-4 w-4 mr-2" />
      case PricingType.FIXED:
      case PricingType.CUSTOM:
      default:
        return <DollarSign className="h-4 w-4 mr-2" />
    }
  }

  // Custom scrollbar styling
  const scrollbarStyles = `
 .services-container::-webkit-scrollbar {
   width: 6px;
 }
 .services-container::-webkit-scrollbar-track {
   background: transparent;
 }
 .services-container::-webkit-scrollbar-thumb {
   background-color: rgba(156, 163, 175, 0.5);
   border-radius: 20px;
 }
 .services-container::-webkit-scrollbar-thumb:hover {
   background-color: rgba(156, 163, 175, 0.7);
 }
 .dark .services-container::-webkit-scrollbar-thumb {
   background-color: rgba(100, 116, 139, 0.5);
 }
 .dark .services-container::-webkit-scrollbar-thumb:hover {
   background-color: rgba(100, 116, 139, 0.7);
 }
`

  // Calculate total price based on price type
  const calculateTotal = () => {
    if (!venue || !venue.price) return 0

    const duration = calculateDuration()

    const numberOfGuests = guests || venue.capacity.min

    switch (venue.price.type) {
      case PricingType.HOURLY:
        return venue.price.amount * duration
      case PricingType.PER_PERSON:
        return venue.price.amount * numberOfGuests
      case PricingType.FIXED:
      case PricingType.CUSTOM:
      default:
        return venue.price.amount
    }
  }

  // Calculate duration between start and end date
  const calculateDuration = () => {
    if (!selectedDate || !endDate) return 0
    return Math.max(1, Math.ceil((endDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60)))
  }

  // Get service icon based on service type
  const getServiceTypeIcon = (iconName: string) => {
    switch (iconName) {
      case "Utensils":
        return <Utensils className="h-5 w-5 text-primary mr-2" />
      case "Music":
        return <Music className="h-5 w-5 text-primary mr-2" />
      case "Sparkles":
        return <Sparkles className="h-5 w-5 text-primary mr-2" />
      case "Camera":
        return <Camera className="h-5 w-5 text-primary mr-2" />
      case "PartyPopper":
        return <PartyPopper className="h-5 w-5 text-primary mr-2" />
      case "Tv":
        return <Tv className="h-5 w-5 text-primary mr-2" />
      case "Car":
        return <Car className="h-5 w-5 text-primary mr-2" />
      case "ShieldCheck":
        return <ShieldCheck className="h-5 w-5 text-primary mr-2" />
      case "User":
        return <User className="h-5 w-5 text-primary mr-2" />
      case "Lightbulb":
        return <Lightbulb className="h-5 w-5 text-primary mr-2" />
      default:
        return <Info className="h-5 w-5 text-primary mr-2" />
    }
  }

  // Get venue rating from reviews
  const getVenueRating = () => {
    if (!venue || !venue.reviews || venue.reviews.length === 0) {
      return { average: 0, count: 0 }
    }

    const totalRating = venue.reviews.reduce((sum, review) => sum + review.rating, 0)
    const average = totalRating / venue.reviews.length

    return {
      average: Number.parseFloat(average.toFixed(1)),
      count: venue.reviews.length,
    }
  }

  // Get match criteria icons for similar venues
  const getMatchCriteriaIcons = (matchCriteria: any) => {
    return (
      <div className="flex space-x-1">
        <TooltipProvider>
          {matchCriteria.venueType && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="p-1">
                  <Building2 className="h-3 w-3 text-primary" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("venueDetail.similarityType")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {matchCriteria.location && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="p-1">
                  <MapPinIcon className="h-3 w-3 text-secondary" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("venueDetail.similarityLocation")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {matchCriteria.capacity && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="p-1">
                  <Users className="h-3 w-3 text-accent" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("venueDetail.similarityCapacity")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {matchCriteria.services && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="p-1">
                  <TagsIcon className="h-3 w-3 text-primary" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("venueDetail.similarityServices")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {matchCriteria.amenities && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="p-1">
                  <PackageIcon className="h-3 w-3 text-secondary" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("venueDetail.similarityAmenities")}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {matchCriteria.price && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="p-1">
                  <DollarSignIcon className="h-3 w-3 text-accent" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("venueDetail.similarityPrice")}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    )
  }

  const rating = getVenueRating()

  return (
    <div className="relative min-h-screen bg-background">
      {/* Beautiful background styling */}
      <div className="fixed inset-0 overflow-hidden opacity-40 dark:opacity-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-secondary/40 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-accent/30 to-primary/40 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-secondary/20 to-accent/30 blur-2xl opacity-60"></div>
      </div>

      {/* Subtle texture overlay for light mode */}
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

      <div className="relative z-10">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <Link to="/venues" className="hover:text-foreground transition-colors">
                {t("venues.title")}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-foreground font-medium">{venue.name[language]}</span>
            </div>

            {/* Image Gallery */}
            <div className="mb-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {venue.media && venue.media.length > 0 ? (
                    venue.media.map((image, index) => (
                      <CarouselItem key={image.id || index} className="md:basis-1/1">
                        <div className="p-1">
                          <div className="overflow-hidden rounded-xl">
                            <img
                              src={formatImageUrl(image.url) || "/placeholder.svg"}
                              alt={`${venue.name[language]} - Image ${index + 1}`}
                              className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem className="md:basis-1/1">
                      <div className="p-1">
                        <div className="overflow-hidden rounded-xl">
                          <img
                            src="/placeholder.svg?height=600&width=800&text=No Images Available"
                            alt="No Images Available"
                            className="w-full h-[400px] md:h-[500px] object-cover"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_350px]">
              <div className="space-y-8">
                {/* Venue Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className={`${getPriceTypeBadge(venue.price.type).bgColor} mr-2`}>
                        {getPriceTypeBadge(venue.price.type).text}
                      </Badge>
                      <h1 className="text-3xl font-bold mt-2">{venue.name[language]}</h1>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${isFavorite(id || "") ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"}`}
                        onClick={() => toggleFavorite(id || "", venue?.name[language] || "")}
                      >
                        <Heart className={`h-5 w-5 ${isFavorite(id || "") ? "fill-current" : ""}`} />
                        <span className="sr-only">{t("venues.addToFavorites")}</span>
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">{t("venues.share")}</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span>
                        <strong>{rating.average}</strong> ({rating.count} {t("venueDetail.reviews")})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {venue.capacity.min}-{venue.capacity.max} {t("venueDetail.guests")}
                      </span>
                    </div>
                    <div className="flex items-center"></div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-6">
                    <TabsTrigger value="overview">{t("venueDetail.overview")}</TabsTrigger>
                    <TabsTrigger value="amenities">{t("venues.amenities")}</TabsTrigger>
                    <TabsTrigger value="availability">{t("venueDetail.availability")}</TabsTrigger>
                    <TabsTrigger value="reviews">{t("venueDetail.reviews")}</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6">
                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <h2 className="text-xl font-semibold">{t("venueDetail.about")}</h2>
                      <p className="text-muted-foreground">{venue.description[language]}</p>
                    </div>

                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <h2 className="text-xl font-semibold">{t("venueDetail.services")}</h2>

                      {availableServiceTypes.length === 0 ? (
                        <div className="text-center p-4">
                          <p className="text-muted-foreground">{t("venueDetail.noServices")}</p>
                        </div>
                      ) : (
                        <div className="services-container max-h-[400px] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {availableServiceTypes.map((serviceType) => (
                            <div key={serviceType.type} className="space-y-2 bg-muted/50 p-4 rounded-lg">
                              <div className="flex items-center">
                                {getServiceTypeIcon(serviceType.icon)}
                                <h3 className="font-medium">
                                  {t(`venueBook.${serviceType.type.toLowerCase()}`) || serviceType.type}
                                </h3>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <h2 className="text-xl font-semibold">{t("venueDetail.host")}</h2>
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage
                            src={venue.owner?.profilePicture || "/placeholder.svg"}
                            alt={`${venue.owner?.firstName} ${venue.owner?.lastName}`}
                          />
                          <AvatarFallback>
                            {venue.owner?.firstName?.[0]}
                            {venue.owner?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                          <h3 className="font-medium">{`${venue.owner?.firstName} ${venue.owner?.lastName}`}</h3>
                          <div className="text-sm text-muted-foreground">
                            <p>
                              {t("venueDetail.hostSince")} {format(new Date(venue.owner?.createdAt), "MMMM yyyy")}
                            </p>
                            <p>{venue.owner?.email}</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {t("venueDetail.contactHost")}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">{t("venueDetail.similarVenues")}</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={refreshSimilarVenues}
                          disabled={loadingSimilarVenues}
                          className="h-8 px-2"
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 ${loadingSimilarVenues ? "animate-spin" : ""}`} />
                          {t("venueDetail.refresh")}
                        </Button>
                      </div>

                      {/* Similarity Criteria Selection */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <p className="text-sm text-muted-foreground w-full mb-1">{t("venueDetail.filterBy")}:</p>
                        {availableCriteria.map((criterion) => (
                          <TooltipProvider key={criterion.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant={similarityCriteria.includes(criterion.id) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-8 px-3 ${similarityCriteria.includes(criterion.id) ? criterion.color : ""}`}
                                  onClick={() => toggleCriterion(criterion.id)}
                                >
                                  <span className="mr-1">{criterion.icon}</span>
                                  <span className="text-xs">{criterion.label}</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {similarityCriteria.includes(criterion.id)
                                    ? t("venueDetail.removeFilter")
                                    : t("venueDetail.addFilter")}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>

                      {loadingSimilarVenues ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : similarVenues?.length > 0 ? (
                        <div className="space-y-4 mt-2">
                          {similarVenues.map((similarVenue) => (
                            <Link
                              key={similarVenue.id}
                              to={`/venues/${similarVenue.id}`}
                              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                            >
                              <img
                                src={
                                  similarVenue.media && similarVenue.media.length > 0
                                    ? formatImageUrl(similarVenue.media[0].url)
                                    : `/placeholder.svg?height=80&width=80&text=${similarVenue.name[language]}`
                                }
                                alt={similarVenue.name[language]}
                                className="h-16 w-16 rounded-md object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm truncate">{similarVenue.name[language]}</h4>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {similarVenue.similarityScore}/ 6
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{getPriceDisplay(similarVenue)}</p>
                                <div className="flex items-center mt-2">
                                  <div className="flex items-center mr-3">
                                    <Users className="h-3 w-3 text-muted-foreground mr-1" />
                                    <span className="text-xs">
                                      {similarVenue.capacity.min}-{similarVenue.capacity.max}
                                    </span>
                                  </div>
                                  {similarVenue.address && (
                                    <div className="flex items-center">
                                      <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                                      <span className="text-xs truncate">{similarVenue.address.city}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="mt-2">{getMatchCriteriaIcons(similarVenue.matchCriteria)}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">
                            {similarityCriteria.length === 0
                              ? t("venueDetail.selectCriteria")
                              : t("venueDetail.noSimilarVenues")}
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Amenities Tab */}
                  <TabsContent value="amenities" className="space-y-6">
                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <h2 className="text-xl font-semibold">{t("venueDetail.amenities")}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {venue.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-4 bg-muted/50 rounded-lg">
                            {getAmenityIcon(amenity)}
                            <span>{t(`venues.amenities.${amenity.toLowerCase().replace(" ", "")}`) || amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Availability Tab */}
                  <TabsContent value="availability" className="space-y-6">
                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <h2 className="text-xl font-semibold">{t("venueDetail.availability")}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="font-medium">{t("venueDetail.operatingHours")}</h3>
                          <div className="space-y-2">
                            {venue.dayAvailability &&
                              Object.entries(venue.dayAvailability).map(([day, hours]) => (
                                <div key={day} className="flex justify-between text-sm py-2 border-b last:border-0">
                                  <span className="capitalize">{t(`venueDetail.days.${day}`)}</span>
                                  <span>{hours}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-medium">{t("venueDetail.availabilityCalendar")}</h3>
                          <div className="space-y-4">
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="text-sm text-muted-foreground mb-3">{t("venueDetail.availabilityInfo")}</p>
                              <Calendar
                                mode="single"
                                selected={undefined}
                                className="rounded-md border"
                                modifiers={{
                                  available: (date) => {
                                    const today = new Date()
                                    today.setHours(0, 0, 0, 0)
                                    return (
                                      date >= today &&
                                      !blockedDates.some(({ start, end }) => {
                                        const startDate = new Date(start)
                                        const endDate = new Date(end)
                                        startDate.setHours(0, 0, 0, 0)
                                        endDate.setHours(23, 59, 59, 999)
                                        return date >= startDate && date <= endDate
                                      })
                                    )
                                  },
                                  unavailable: (date) => {
                                    return blockedDates.some(({ start, end }) => {
                                      const startDate = new Date(start)
                                      const endDate = new Date(end)
                                      startDate.setHours(0, 0, 0, 0)
                                      endDate.setHours(23, 59, 59, 999)
                                      return date >= startDate && date <= endDate
                                    })
                                  },
                                }}
                                modifiersClassNames={{
                                  available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                  unavailable:
                                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 line-through",
                                }}
                              />
                              <div className="flex items-center justify-center mt-4 space-x-4 text-sm">
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500 mr-2"></div>
                                  <span>{t("venueDetail.available")}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500 mr-2"></div>
                                  <span>{t("venueDetail.unavailable")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="space-y-6">
                    <div className="venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                          {t("venueDetail.reviews")} ({rating.count})
                        </h2>
                        <div className="flex items-center">
                          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium text-lg">{rating.average}</span>
                        </div>
                      </div>

                      {venue.reviews && venue.reviews.length > 0 ? (
                        <div className="space-y-6 mt-6">
                          {venue.reviews.map((review) => (
                            <div key={review.id} className="p-4 bg-muted/50 rounded-lg">
                              <div className="flex items-start space-x-4">
                                <Avatar>
                                  <AvatarFallback>{review.id.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <h4 className="font-medium">Guest</h4>
                                      <span className="mx-2">•</span>
                                      <span className="text-sm text-muted-foreground">
                                        {format(new Date(review.createdAt), "MMMM yyyy")}
                                      </span>
                                    </div>
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={cn(
                                            "h-4 w-4",
                                            i < review.rating
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
                                          )}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                                  {review.isVerified && (
                                    <Badge variant="outline" className="mt-2 text-xs">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      {t("venueDetail.verifiedReview")}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">{t("venueDetail.noReviews")}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Booking Card */}
              <div className="space-y-6">
                <div className="sticky top-6 venue-card p-6 space-y-5 bg-card rounded-xl border border-border shadow-sm">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge className={`${getPriceTypeBadge(venue.price.type).bgColor} mr-2`}>
                          {getPriceTypeBadge(venue.price.type).text}
                        </Badge>
                        <div className="flex items-center">
                          {getPriceTypeBadge(venue.price.type).icon}
                          <span className="font-medium">
                            {formatPrice(venue.price.amount, venue.price.currency as Currency)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium">
                          {rating.average} ({rating.count})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-medium">{t("venueDetail.bookingDetails")}</h3>

                    {/* Start Date/Time */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{t("venueDetail.startDateTime")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-dashed",
                              validationErrors.startDate || validationErrors.startTime
                                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                : "",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "PPP p")
                            ) : (
                              <span>{t("venueDetail.pickStartDateTime")}</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleStartDateSelect}
                            initialFocus
                            modifiers={{
                              available: isDateAvailable,
                              unavailable: (date) => !isDateAvailable(date),
                            }}
                            modifiersClassNames={{
                              available:
                                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
                              unavailable:
                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 line-through opacity-50 cursor-not-allowed",
                            }}
                            disabled={(date) => !isDateAvailable(date)}
                            className="rounded-md border"
                          />
                          <div className="p-3 border-t border-border">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t("venueDetail.time")}</label>
                              <Input
                                type="time"
                                value={selectedDate ? format(selectedDate, "HH:mm") : "10:00"}
                                onChange={(e) => {
                                  if (e.target.value && selectedDate) {
                                    const [hours, minutes] = e.target.value.split(":").map(Number)
                                    const newDate = new Date(selectedDate)
                                    newDate.setHours(hours, minutes)
                                    handleStartDateSelect(newDate)
                                  }
                                }}
                                className={cn("w-full", validationErrors.startTime ? "border-red-500" : "")}
                              />
                              {venue?.dayAvailability && (
                                <p className="text-xs text-muted-foreground">
                                  {t("venueDetail.operatingHours")}:{" "}
                                  {venue.dayAvailability[
                                    selectedDate?.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
                                  ] || "Closed"}
                                </p>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      {(validationErrors.startDate || validationErrors.startTime) && (
                        <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                          <Info className="h-4 w-4 mr-1" />
                          <span>{validationErrors.startDate || validationErrors.startTime}</span>
                        </div>
                      )}
                    </div>

                    {/* End Date/Time */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{t("venueDetail.endDateTime")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-dashed",
                              validationErrors.endDate || validationErrors.endTime
                                ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                                : "",
                            )}
                          >
                            <Clock className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP p") : <span>{t("venueDetail.pickEndDateTime")}</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={handleEndDateSelect}
                            initialFocus
                            modifiers={{
                              available: isDateAvailable,
                              unavailable: (date) => !isDateAvailable(date),
                            }}
                            modifiersClassNames={{
                              available:
                                "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
                              unavailable:
                                "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 line-through opacity-50 cursor-not-allowed",
                            }}
                            disabled={(date) => !isDateAvailable(date)}
                            className="rounded-md border"
                          />
                          <div className="p-3 border-t border-border">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t("venueDetail.time")}</label>
                              <Input
                                type="time"
                                value={endDate ? format(endDate, "HH:mm") : "13:00"}
                                onChange={(e) => {
                                  if (e.target.value && endDate) {
                                    const [hours, minutes] = e.target.value.split(":").map(Number)
                                    const newDate = new Date(endDate)
                                    newDate.setHours(hours, minutes)
                                    handleEndDateSelect(newDate)
                                  }
                                }}
                                className={cn("w-full", validationErrors.endTime ? "border-red-500" : "")}
                              />
                              {venue?.dayAvailability && (
                                <p className="text-xs text-muted-foreground">
                                  {t("venueDetail.operatingHours")}:{" "}
                                  {venue.dayAvailability[
                                    endDate?.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
                                  ] || "Closed"}
                                </p>
                              )}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      {(validationErrors.endDate || validationErrors.endTime) && (
                        <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                          <Info className="h-4 w-4 mr-1" />
                          <span>{validationErrors.endDate || validationErrors.endTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Guests */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{t("venueDetail.guests")}</label>
                      <Input
                        type="number"
                        min={venue.capacity.min}
                        max={venue.capacity.max}
                        value={guests || venue.capacity.min}
                        onChange={(e) => handleGuestsChange(Number.parseInt(e.target.value))}
                        className={cn("w-full", validationErrors.guests ? "border-red-500" : "")}
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("venueDetail.capacityRange", {
                          min: venue.capacity.min,
                          max: venue.capacity.max,
                        })}
                      </p>
                      {validationErrors.guests && (
                        <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                          <Info className="h-4 w-4 mr-1" />
                          <span>{validationErrors.guests}</span>
                        </div>
                      )}
                    </div>

                    {/* Event Type */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium">{t("venueDetail.eventType")}</label>
                      <Input
                        type="text"
                        placeholder={t("venueDetail.eventTypePlaceholder")}
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Duration and Total */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>{t("venueDetail.duration")}</span>
                        <span>
                          {calculateDuration()} {t("venueDetail.hours")}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>{t("venueDetail.total")}</span>
                        <span>{formatPrice(calculateTotal(), venue.price.currency as Currency)}</span>
                      </div>
                    </div>

                    <Link
                      to={`/venues/${id}/book`}
                      state={{
                        startDate: selectedDate,
                        endDate: endDate,
                        guests: guests || venue.capacity.min,
                        eventType,
                        selectedServices,
                      }}
                      onClick={(e) => {
                        if (!validateBookingInputs()) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        {t("venueDetail.bookNow")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{scrollbarStyles}</style>
    </div>
  )
}
