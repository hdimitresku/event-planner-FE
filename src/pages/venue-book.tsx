"use client"

import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { format, addHours, isValid, parseISO } from "date-fns"
import {
  CalendarIcon,
  Clock,
  Users,
  Info,
  ArrowRight,
  Check,
  ChevronDown,
  MessageSquare,
  ChevronRight,
  MapPin,
  Star,
  DollarSign,
  ArrowLeft,
  Utensils,
  Music,
  Camera,
  Video,
  Car,
  Sparkles,
  ShieldCheck,
  User,
  PartyPopper,
  Lightbulb,
} from "lucide-react"
import { useLanguage } from "../context/language-context"
import { cn } from "../lib/utils"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import * as venueService from "../services/venueService"
import * as serviceService from "../services/serviceService"
import * as bookingService from "../services/bookingService"
import { EventType } from "@/models"

// Define interfaces for the API data structure
interface LocalizedText {
  en: string
  sq: string
}

interface Address {
  city: string
  state: string
  street: string
  country: string
  zipCode: string
  location: any | null
}

interface Person {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  birthday: string | null
  profilePicture: string | null
  role: string
  createdAt: string
  updatedAt: string
  address: Address
}

interface Price {
  type: string
  amount: number
  currency: string
}

interface Media {
  id: string
  url: string
  type: string
  entityType: string
  entityId: string
  createdAt: string
  updatedAt: string
}

interface DayAvailability {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

interface BlockedDate {
  startDate: string
  endDate: string
  isConfirmed: boolean
}

interface Metadata {
  blockedDates?: BlockedDate[]
  [key: string]: any
}

interface Review {
  id: string
  rating: number
  comment: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

interface Venue {
  id: string
  owner: Person
  name: LocalizedText
  description: LocalizedText
  type: string
  address: Address
  capacity: {
    max: number
    min: number
    recommended: number
  }
  price: Price
  amenities: string[]
  dayAvailability: DayAvailability
  isActive: boolean
  metadata: Metadata
  bookings: any[]
  media: Media[]
  reviews: Review[]
  createdAt: string
  updatedAt: string
}

interface ServiceOption {
  id: string
  name: LocalizedText
  description: LocalizedText
  price: Price
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
}

interface Service {
  icon: string
  id: string
  name: LocalizedText
  description: LocalizedText
  venueTypes: string[]
  type: string
  dayAvailability: DayAvailability
  isActive: boolean
  metadata: Metadata
  createdAt: string
  updatedAt: string
  provider: Person
  options: ServiceOption[]
  media: Media[]
}

interface ServiceType {
  type: string
  icon: string
}

// Helper function to get icon component by name
const getIconByName = (iconName: string) => {
  const icons: Record<string, React.ElementType> = {
    Utensils: Utensils,
    Music: Music,
    Sparkles: Sparkles,
    Camera: Camera,
    Video: Video,
    Car: Car,
    ShieldCheck: ShieldCheck,
    User: User,
    PartyPopper: PartyPopper,
    Lightbulb: Lightbulb,
  }

  return icons[iconName] || Info
}

// Service type mapping for display names
const serviceTypeNames: Record<string, { en: string; sq: string }> = {
  catering: { en: "Catering", sq: "Katering" },
  music: { en: "Music & Entertainment", sq: "Muzikë dhe Argëtim" },
  photography: { en: "Photography", sq: "Fotografi" },
  videography: { en: "Videography", sq: "Videografi" },
  transportation: { en: "Transportation", sq: "Transport" },
  decoration: { en: "Decoration", sq: "Dekorim" },
  security: { en: "Security", sq: "Siguri" },
  staffing: { en: "Staffing", sq: "Staf" },
  entertainment: { en: "Entertainment", sq: "Argëtim" },
  lighting: { en: "Lighting", sq: "Ndriçim" },
}

export default function VenueBookPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()

  // Extract data from location state
  const {
    startDate: initialStartDate,
    endDate: initialEndDate,
    guests: initialGuests,
    eventType: initialEventType,
    selectedServices: initialSelectedServices,
  } = location.state || {}

  // Parse dates from location state
  const parseDate = (dateValue: any): Date | undefined => {
    if (!dateValue) return undefined

    // If it's already a Date object
    if (dateValue instanceof Date) return dateValue

    // If it's a string (ISO format)
    try {
      const parsedDate = typeof dateValue === "string" ? parseISO(dateValue) : new Date(dateValue)
      return isValid(parsedDate) ? parsedDate : undefined
    } catch (e) {
      console.error("Error parsing date:", e)
      return undefined
    }
  }

  const [startDate, setStartDate] = useState<Date | undefined>(parseDate(initialStartDate) || new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(parseDate(initialEndDate) || addHours(new Date(), 3))
  const [guests, setGuests] = useState(initialGuests || 50)
  const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>(initialSelectedServices || {})
  const [services, setServices] = useState<Service[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [venue, setVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [eventType, setEventType] = useState(initialEventType || "")
  const [expandedTypes, setExpandedTypes] = useState<string[]>([])
  const [expandedProviders, setExpandedProviders] = useState<string[]>([])

  // Fetch venue and services data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch venue data
        if (id) {
          const venueData = await venueService.getVenueById(id)
          setVenue(venueData)

          // Set initial guests to min capacity if available
          if (venueData?.capacity?.min && !initialGuests) {
            setGuests(venueData.capacity.min)
          }

          // Fetch service types for this venue type
          const serviceTypesData = await serviceService.getServiceTypesByVenueType(venueData?.type)
          setServiceTypes(serviceTypesData)

          // Fetch services for this venue type
          const servicesData = await serviceService.getServicesByVenue(venueData?.id)
          setServices(servicesData.services)


          // Expand the first service type by default if there are any
          if (serviceTypesData.length > 0) {
            setExpandedTypes([serviceTypesData[0].type])
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, initialGuests])

  // Group services by type
  const servicesByType = React.useMemo(() => {
    const grouped: Record<string, Service[]> = {}

    services.forEach((service) => {
      const serviceType = service.type
      if (!grouped[serviceType]) {
        grouped[serviceType] = []
      }
      grouped[serviceType].push(service)
    })

    return grouped
  }, [services])

  // Format image URL to handle relative paths
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"

    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) return url

    // If it's a relative path, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get form data
    const firstName = (document.getElementById('first-name') as HTMLInputElement).value
    const lastName = (document.getElementById('last-name') as HTMLInputElement).value
    const email = (document.getElementById('email') as HTMLInputElement).value
    const phone = (document.getElementById('phone') as HTMLInputElement).value
    const specialRequests = (document.getElementById('special-requests') as HTMLTextAreaElement).value

    // Format dates and times
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : ''
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : ''
    const formattedStartTime = startDate ? format(startDate, 'HH:mm') : ''
    const formattedEndTime = endDate ? format(endDate, 'HH:mm') : ''

    // Collect all selected service option IDs
    const serviceOptionIds = Object.values(selectedServices).flat()

    // Prepare booking data
    const bookingData = {
      venueId: id || '',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      numberOfGuests: guests,
      serviceOptionIds,
      specialRequests,
      metadata: {
        contactDetails: {
          firstName,
          lastName,
          email,
          phone
        },
        eventType
      }
    }

    try {
      const response = await bookingService.createBooking(bookingData)
      if (response.success && response.bookingId) {
        // Redirect to dashboard instead of checkout
        navigate('/dashboard', { 
          state: { 
            bookingId: response.bookingId,
            ...bookingData
          }
        })
      } else {
        // Handle error - you might want to show an error message to the user
        console.error('Failed to create booking:', response.error)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
  }

  const calculateTotal = () => {
    if (!venue) return { basePrice: 0, serviceFee: 0, servicesCost: 0, total: 0 }

    const duration = calculateDuration()
    let basePrice = 0

    // Calculate base price based on venue price type
    if (venue.price.type === "hourly") {
      basePrice = venue.price.amount * duration
    } else if (venue.price.type === "perPerson") {
      basePrice = venue.price.amount * guests
    } else {
      basePrice = venue.price.amount
    }

    const serviceFee = Math.round(basePrice * 0.15)

    // Calculate additional services cost
    let servicesCost = 0
    Object.entries(selectedServices).forEach(([serviceId, optionIds]) => {
      if (optionIds && optionIds.length > 0) {
        const service = services.find((s) => s.id === serviceId)
        if (service) {
          optionIds.forEach((optionId) => {
            const option = service.options.find((o) => o.id === optionId)
            if (option) {
              if (option.price.type === "perPerson") {
                servicesCost += option.price.amount * guests
              } else {
                servicesCost += option.price.amount
              }
            }
          })
        }
      }
    })

    return {
      basePrice,
      serviceFee,
      servicesCost,
      total: basePrice + serviceFee + servicesCost,
    }
  }

  const toggleService = (serviceId: string, optionId: string) => {
    setSelectedServices((prev) => {
      const newServices = { ...prev }

      // Initialize array if it doesn't exist
      if (!newServices[serviceId]) {
        newServices[serviceId] = []
      }

      // Check if option is already selected
      const optionIndex = newServices[serviceId].indexOf(optionId)

      if (optionIndex === -1) {
        // Add option if not selected
        newServices[serviceId] = [...newServices[serviceId], optionId]
      } else {
        // Remove option if already selected
        newServices[serviceId] = newServices[serviceId].filter((opt) => opt !== optionId)

        // Remove service entry if no options left
        if (newServices[serviceId].length === 0) {
          delete newServices[serviceId]
        }
      }

      return { ...newServices }
    })
  }

  const toggleTypeExpansion = (type: string) => {
    setExpandedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  const toggleProviderExpansion = (providerId: string) => {
    setExpandedProviders((prev) => {
      if (prev.includes(providerId)) {
        return prev.filter((id) => id !== providerId)
      } else {
        return [...prev, providerId]
      }
    })
  }

  // Handle navigation back to venue detail with state
  const handleBackToVenueDetail = () => {
    navigate(`/venues/${id}`, {
      state: {
        startDate,
        endDate,
        guests,
        eventType,
        selectedServices,
      },
    })
  }

  const { basePrice, serviceFee, servicesCost, total } = calculateTotal()
  const duration = calculateDuration()

  // Get price display based on price type and language
  const getPriceDisplay = (price: Price, count = 1) => {
    const amount = price.amount * count
    switch (price.type) {
      case "hourly":
        return `$${amount}/${t("business.pricing.hourly")}`
      case "perPerson":
        return `$${amount}/${t("business.pricing.perPerson")}`
      case "fixed":
        return `$${amount}`
      case "custom":
        return t("business.pricing.custom")
      default:
        return `$${amount}`
    }
  }

  // Get badge color and text for price type
  const getPriceTypeBadge = (priceType: string) => {
    switch (priceType) {
      case "hourly":
        return {
          text: t("business.pricing.hourly"),
          bgColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-400",
        }
      case "perPerson":
        return {
          text: t("business.pricing.perPerson"),
          bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
        }
      case "fixed":
        return {
          text: t("business.pricing.fixed"),
          bgColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
        }
      case "custom":
        return {
          text: t("business.pricing.custom"),
          bgColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
        }
      default:
        return {
          text: "",
          bgColor: "",
        }
    }
  }

  // Count selected options for a service type
  const countSelectedOptionsForType = (type: string) => {
    let count = 0
    const servicesOfType = servicesByType[type] || []

    servicesOfType.forEach((service) => {
      count += selectedServices[service.id]?.length || 0
    })

    return count
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

  if (isLoading || !venue) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-sky-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl mb-2">{t("venueBook.title")}</h1>
              <p className="text-muted-foreground">{t("venueBook.subtitle", { venue: venue.name[language] })}</p>
            </div>
            <Button variant="outline" onClick={handleBackToVenueDetail} className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("venueBook.backToVenue")}
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Venue Information Card */}
              <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{t("venueBook.venueDetails")}</h2>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">
                      {venue.reviews && venue.reviews.length > 0
                        ? (
                          venue.reviews.reduce((sum, review) => sum + review.rating, 0) / venue.reviews.length
                        ).toFixed(1)
                        : "0.0"}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">({venue.reviews?.length || 0})</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={
                        venue.media && venue.media.length > 0
                          ? formatImageUrl(venue.media[0].url)
                          : "/placeholder.svg?height=96&width=96&text=Venue"
                      }
                      alt={venue.name[language]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{venue.name[language]}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge className={`${getPriceTypeBadge(venue.price.type).bgColor} mr-2`}>
                        {getPriceTypeBadge(venue.price.type).text}
                      </Badge>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                        <span className="font-medium">{venue.price.amount}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Details Card */}
              <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-semibold">{t("venueBook.eventDetails")}</h2>

                <div className="space-y-3">
                  <label className="text-sm font-medium" htmlFor="event-type">
                    {t("venueBook.eventType")}
                  </label>
                  <div className="relative">
                    <select
                      id="event-type"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="hover:border-primary hover:shadow-sm w-full p-3 pr-10 border rounded-md bg-background appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    >
                      <option value="">{t("venueBook.selectEventType")}</option>
                      {Object.values(EventType).map((type) => (
                        <option key={type} value={type}>
                          {t(`venueBook.${type}`)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">{t("venueBook.dateRange")}</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date Display */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{t("venueBook.from")}</label>
                    <div className="flex items-center border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{startDate ? format(startDate, "PPP p") : t("venueBook.startDateTime")}</span>
                    </div>
                  </div>

                  {/* End Date Display */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">{t("venueBook.to")}</label>
                    <div className="flex items-center border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50">
                      <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                      <span>{endDate ? format(endDate, "PPP p") : t("venueBook.endDateTime")}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground">
                  {duration > 0 && (
                    <span>
                      {t("venueBook.duration")}: {duration} {t("venueBook.hours")}
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">{t("venueBook.guests")}</label>
                <div className="flex items-center border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors hover:border-primary hover:shadow-sm">
                  <Users className="ml-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={venue.capacity.min}
                    max={venue.capacity.max}
                    value={guests}
                    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("venueBook.guestCapacity", { min: venue.capacity.min, max: venue.capacity.max })}
                </p>
              </div>
          </div>

          {/* Services Section - Grouped by Type */}
          <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <div>
              <h2 className="text-xl font-semibold">{t("venueBook.services")}</h2>
              <p className="text-muted-foreground text-sm mt-1">{t("venueBook.servicesSubtitle")}</p>
            </div>

            {/* Scrollable Services Container */}
            <div className="services-container max-h-[500px] overflow-y-auto pr-2 space-y-6">
              {/* Render services grouped by type */}
              {serviceTypes.length > 0 ? (
                serviceTypes.map((serviceType) => {
                  const isTypeExpanded = expandedTypes.includes(serviceType.type)
                  const servicesOfType = servicesByType[serviceType.type] || []
                  const selectedCount = countSelectedOptionsForType(serviceType.type)
                  const typeDisplayName = serviceTypeNames[serviceType.type]?.[language] || serviceType.type
                  const IconComponent = getIconByName(serviceType.icon)

                  return (
                    <div
                      key={serviceType.type}
                      className="service-type-section border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      {/* Service Type Header */}
                      <div
                        className="service-type-header p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleTypeExpansion(serviceType.type)}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mr-3">
                            <IconComponent className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">{typeDisplayName}</h3>
                            <p className="text-xs text-muted-foreground">
                              {servicesOfType.length} {t("venueBook.providersAvailable")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {selectedCount > 0 && (
                            <Badge className="mr-3 bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-400">
                              {selectedCount} {t("venueBook.selected")}
                            </Badge>
                          )}
                          <ChevronRight
                            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isTypeExpanded ? "rotate-90" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Providers for this service type */}
                      {isTypeExpanded && (
                        <div className="service-providers p-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
                          {servicesOfType.length > 0 ? (
                            servicesOfType.map((service) => {
                              const isProviderExpanded = expandedProviders.includes(service.provider.id)
                              const selectedOptionsCount = selectedServices[service.id]?.length || 0

                              return (
                                <div
                                  key={service.id}
                                  className="provider-section border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden"
                                >
                                  {/* Provider Header */}
                                  <div
                                    className="provider-header p-3 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleProviderExpansion(service.provider.id)}
                                  >
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2">
                                        <AvatarImage
                                          src={
                                            service.provider.profilePicture
                                              ? formatImageUrl(service.provider.profilePicture)
                                              : "/placeholder.svg?height=32&width=32"
                                          }
                                          alt={`${service.provider.firstName} ${service.provider.lastName}`}
                                        />
                                        <AvatarFallback>
                                          {service.provider.firstName.charAt(0)}
                                          {service.provider.lastName.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h4 className="font-medium text-sm">
                                          {service.provider.firstName} {service.provider.lastName}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{service.name[language]}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      {selectedOptionsCount > 0 && (
                                        <Badge className="mr-2 text-xs bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-400">
                                          {selectedOptionsCount} {t("venueBook.selected")}
                                        </Badge>
                                      )}
                                      <ChevronRight
                                        className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isProviderExpanded ? "rotate-90" : ""}`}
                                      />
                                    </div>
                                  </div>

                                  {/* Service Options */}
                                  {isProviderExpanded && (
                                    <div className="service-options p-3 space-y-3 border-t border-gray-100 dark:border-gray-700">
                                      <div className="text-sm text-muted-foreground mb-2">
                                        {service.description[language]}
                                      </div>

                                      {service.options && service.options.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          {service.options.map((option) => {
                                            const isSelected = selectedServices[service.id]?.includes(option.id)
                                            return (
                                              <button
                                                key={option.id}
                                                type="button"
                                                className={cn(
                                                  "service-option flex flex-col items-start justify-center p-3 relative rounded-lg border-2 border-transparent hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-200",
                                                  isSelected
                                                    ? "bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800"
                                                    : "bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/70",
                                                )}
                                                onClick={() => toggleService(service.id, option.id)}
                                              >
                                                {isSelected && (
                                                  <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                                                )}
                                                <div className="flex flex-col items-start">
                                                  <span className="font-medium text-sm">
                                                    {option.name[language]}
                                                  </span>
                                                  <p className="text-xs text-muted-foreground mt-1 text-left">
                                                    {option.description[language]}
                                                  </p>
                                                  <div className="flex items-center mt-2">
                                                    <Badge
                                                      className={`text-xs ${getPriceTypeBadge(option.price.type).bgColor} mr-2`}
                                                    >
                                                      {getPriceTypeBadge(option.price.type).text}
                                                    </Badge>
                                                    <span className="font-medium">
                                                      ${option.price.amount}
                                                    </span>
                                                  </div>
                                                </div>
                                              </button>
                                            )
                                          })}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">
                                          {t("venueBook.noOptionsAvailable")}
                                        </p>
                                      )}

                                      {/* Contact Provider Button */}
                                      <div className="flex justify-end mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <Button variant="outline" size="sm" className="text-xs">
                                          <MessageSquare className="h-3 w-3 mr-1" />
                                          {t("venueBook.contactProvider")}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          ) : (
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                              <p className="text-muted-foreground">{t("venueBook.noProvidersAvailable")}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                  <p className="text-muted-foreground">{t("venueDetail.noServices")}</p>
                </div>
              )}
            </div>
          </div>

          <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold">{t("venueBook.contactDetails")}</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 ">
                <label className="text-sm font-medium" htmlFor="first-name">
                  {t("venueBook.firstName")}
                </label>
                <Input
                  id="first-name"
                  className="hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="last-name">
                  {t("venueBook.lastName")}
                </label>
                <Input
                  id="last-name"
                  className="hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                {t("venueBook.email")}
              </label>
              <Input
                id="email"
                type="email"
                className="hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                {t("venueBook.phone")}
              </label>
              <Input
                id="phone"
                type="tel"
                className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold">{t("venueBook.additionalInfo")}</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="special-requests">
                {t("venueBook.specialRequests")}
              </label>
              <Textarea
                id="special-requests"
                placeholder={t("venueBook.specialRequestsPlaceholder")}
                className="min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </form>

        <div className="space-y-6">
          <div className="sticky top-6 venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-semibold">{t("venueBook.summary")}</h2>

            <div className="space-y-3">
              <h3 className="font-medium">{venue.name[language]}</h3>
              <p className="text-sm text-muted-foreground">
                {venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}
              </p>

              <div className="flex items-center text-sm pt-2">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{startDate ? format(startDate, "PPP") : t("venueBook.date")}</span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {startDate ? format(startDate, "p") : ""} - {endDate ? format(endDate, "p") : ""}
                  {duration > 0 && ` (${duration} ${t("venueBook.hours")})`}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {guests} {t("venueBook.guests")}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span>{t("venueBook.venueRental")}</span>
                  <Badge className={`ml-2 text-[10px] ${getPriceTypeBadge(venue.price.type).bgColor}`}>
                    {getPriceTypeBadge(venue.price.type).text}
                  </Badge>
                </div>
                <span>${basePrice}</span>
              </div>

              {/* Services summary */}
              {Object.entries(selectedServices).map(([serviceId, optionIds]) =>
                optionIds.map((optionId) => {
                  const service = services.find((s) => s.id === serviceId)
                  if (!service) return null

                  const option = service.options.find((o) => o.id === optionId)
                  if (!option) return null

                  let price = option.price.amount
                  if (option.price.type === "perPerson") {
                    price = option.price.amount * guests
                  }

                  return (
                    <div key={`${serviceId}-${optionId}`} className="flex justify-between text-sm">
                      <div>
                        <span>{service.name[language]}</span>
                        <span className="text-muted-foreground ml-1">({option.name[language]})</span>
                        {option.price.type === "perPerson" && (
                          <span className="text-xs text-muted-foreground ml-1">
                            (${option.price.amount} × {guests})
                          </span>
                        )}
                      </div>
                      <span>${price}</span>
                    </div>
                  )
                }),
              )}

              <div className="flex justify-between">
                <div className="flex items-center">
                  <span>{t("venueBook.serviceFee")}</span>
                  <div className="relative ml-1 group">
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                      {t("venueBook.serviceFeeInfo")}
                    </div>
                  </div>
                </div>
                <span>${serviceFee}</span>
              </div>

              <div className="flex justify-between font-bold pt-2 border-t">
                <span>{t("venueBook.total")}</span>
                <span>${total}</span>
              </div>
            </div>

            <Button
              className="w-full cta-button mt-4 bg-sky-500 hover:bg-sky-600 hover:translate-y-[-2px] transition-all duration-200 shadow-md hover:shadow-lg"
              onClick={handleSubmit}
            >
              {t("venueBook.continueToBook")} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-4">{t("venueBook.cancellationPolicy")}</p>
          </div>
        </div>
      </div>
    </div >
      </div >
    </>
  )
}
