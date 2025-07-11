"use client"
import { useState, useEffect } from "react"

import { useParams, Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Calendar } from "../components/ui/calendar"
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
  ArrowLeft,
  Plus,
  Minus,
} from "lucide-react"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { format, isAfter, isBefore, parseISO, parse, set, addDays, addHours } from "date-fns"
import { isValid } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { useFavorites } from "../context/favorites-context"
import * as venueService from "../services/venueService"
import * as serviceService from "../services/serviceService"
import { type Venue, VenueAmenity } from "../models/venue"
import { PricingType } from "../models/common"
import { Separator } from "../components/ui/separator"
import { Label } from "../components/ui/label"

// Define service type interface
interface ServiceTypeData {
  type: string
  icon: string
}

// Define service interface
interface Service {
  id: string
  name: { [key: string]: string }
  description: { [key: string]: string }
  price: {
    amount: number
    currency: string
    type: PricingType
  }
  type: string
  isAvailable: boolean
  metadata?: {
    duration?: number
    capacity?: {
      min: number
      max: number
    }
    requirements?: string[]
  }
}

// Define booking form data interface
interface BookingFormData {
  startDate: Date | undefined
  endDate: Date | undefined
  guests: number
  eventType: string
  selectedServices: { [serviceId: string]: number }
  specialRequests: string
  contactInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
}

export default function VenueBookPage() {
  const { t, language } = useLanguage()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()

  // Extract data from location state
  const {
    startDate: initialStartDate,
    endDate: initialEndDate,
    guests: initialGuests,
    eventType: initialEventType,
    selectedServices: initialSelectedServices,
  } = location.state || {}

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

  // Booking form state
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    startDate: parseDate(initialStartDate) || getEarliestAvailableDate(),
    endDate: parseDate(initialEndDate) || addHours(parseDate(initialStartDate) || getEarliestAvailableDate(), 3),
    guests: initialGuests || 1,
    eventType: initialEventType || "",
    selectedServices: initialSelectedServices || {},
    specialRequests: "",
    contactInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  // Update dates when blocked dates change
  useEffect(() => {
    if (blockedDates.length > 0) {
      const earliestDate = getEarliestAvailableDate()
      if (!bookingForm.startDate || !isDateAvailable(bookingForm.startDate)) {
        setBookingForm((prev) => ({
          ...prev,
          startDate: earliestDate,
          endDate: addHours(earliestDate, 3),
        }))
      }
    }
  }, [blockedDates])

  // Update date selection handlers
  const handleStartDateSelect = (date: Date | undefined) => {
    // If trying to deselect, set to earliest available date
    if (!date) {
      const earliestDate = getEarliestAvailableDate()
      setBookingForm((prev) => ({
        ...prev,
        startDate: earliestDate,
        endDate: addHours(earliestDate, 3),
      }))
      return
    }
    setBookingForm((prev) => ({
      ...prev,
      startDate: date,
      endDate: prev.endDate && prev.endDate > date ? prev.endDate : addHours(date, 3),
    }))
    if (date) {
      setValidationErrors((prev) => ({ ...prev, startDate: undefined, startTime: undefined }))
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    // If trying to deselect, set to start date + 3 hours
    if (!date && bookingForm.startDate) {
      setBookingForm((prev) => ({
        ...prev,
        endDate: addHours(prev.startDate!, 3),
      }))
      return
    }
    setBookingForm((prev) => ({
      ...prev,
      endDate: date,
    }))
    if (date) {
      setValidationErrors((prev) => ({ ...prev, endDate: undefined, endTime: undefined }))
    }
  }

  const [availableServiceTypes, setAvailableServiceTypes] = useState<ServiceTypeData[]>([])
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState("details")
  const [validationErrors, setValidationErrors] = useState<{
    startDate?: string
    endDate?: string
    startTime?: string
    endTime?: string
    guests?: string
    contactInfo?: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    }
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
    if (!bookingForm.startDate) {
      errors.startDate = t("venueDetail.validation.startDateRequired")
    } else if (!isDateAvailable(bookingForm.startDate)) {
      errors.startDate = t("venueDetail.validation.dateNotAvailable")
    } else if (!isTimeWithinOperatingHours(bookingForm.startDate)) {
      errors.startTime = t("venueDetail.validation.timeOutsideOperatingHours")
    }

    // Validate end date
    if (!bookingForm.endDate) {
      errors.endDate = t("venueDetail.validation.endDateRequired")
    } else if (!isDateAvailable(bookingForm.endDate)) {
      errors.endDate = t("venueDetail.validation.dateNotAvailable")
    } else if (!isTimeWithinOperatingHours(bookingForm.endDate)) {
      errors.endTime = t("venueDetail.validation.timeOutsideOperatingHours")
    } else if (bookingForm.startDate && bookingForm.endDate <= bookingForm.startDate) {
      errors.endDate = t("venueDetail.validation.endDateAfterStart")
    }

    // Validate guests
    if (venue) {
      if (bookingForm.guests < venue.capacity.min) {
        errors.guests = t("venueDetail.validation.guestsMinimum", { min: venue.capacity.min })
      } else if (bookingForm.guests > venue.capacity.max) {
        errors.guests = t("venueDetail.validation.guestsMaximum", { max: venue.capacity.max })
      }
    }

    // Validate contact info
    const contactErrors: any = {}
    if (!bookingForm.contactInfo.firstName.trim()) {
      contactErrors.firstName = t("venueBook.validation.firstNameRequired")
    }
    if (!bookingForm.contactInfo.lastName.trim()) {
      contactErrors.lastName = t("venueBook.validation.lastNameRequired")
    }
    if (!bookingForm.contactInfo.email.trim()) {
      contactErrors.email = t("venueBook.validation.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.contactInfo.email)) {
      contactErrors.email = t("venueBook.validation.emailInvalid")
    }
    if (!bookingForm.contactInfo.phone.trim()) {
      contactErrors.phone = t("venueBook.validation.phoneRequired")
    }

    if (Object.keys(contactErrors).length > 0) {
      errors.contactInfo = contactErrors
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleGuestsChange = (value: number) => {
    setBookingForm((prev) => ({
      ...prev,
      guests: value,
    }))
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
          const serviceTypesResult = await serviceService.getServiceTypesByVenueType(venueData?.type)
          const servicesResult = await serviceService.getServicesByVenueId(id)

          // Get unique service types only (remove duplicates)
          const uniqueServiceTypes = serviceTypesResult.filter(
            (serviceType, index, self) => index === self.findIndex((st) => st.type === serviceType.type),
          )

          setAvailableServiceTypes(uniqueServiceTypes)
          setAvailableServices(servicesResult)
          setVenue(venueData)

          if (venueData?.capacity?.min && !initialGuests) {
            setBookingForm((prev) => ({
              ...prev,
              guests: venueData.capacity.min,
            }))
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
      if (bookingForm.startDate && !isDateAvailable(bookingForm.startDate)) {
        const earliestDate = getEarliestAvailableDate()
        setBookingForm((prev) => ({
          ...prev,
          startDate: earliestDate,
          endDate: addHours(earliestDate, 3),
        }))
      }
      // Update end date to 3 hours after start date if current selection is blocked
      if (bookingForm.endDate && !isDateAvailable(bookingForm.endDate)) {
        setBookingForm((prev) => ({
          ...prev,
          endDate: addHours(prev.startDate || getEarliestAvailableDate(), 3),
        }))
      }
    }
  }, [venue])

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

  // Calculate total price based on price type
  const calculateVenueTotal = () => {
    if (!venue || !venue.price) return 0

    const duration = calculateDuration()

    switch (venue.price.type) {
      case PricingType.HOURLY:
        return venue.price.amount * duration
      case PricingType.PER_PERSON:
        return venue.price.amount * bookingForm.guests
      case PricingType.FIXED:
      case PricingType.CUSTOM:
      default:
        return venue.price.amount
    }
  }

  // Calculate services total
  const calculateServicesTotal = () => {
    return availableServices.reduce((total, service) => {
      const quantity = bookingForm.selectedServices[service.id] || 0
      if (quantity > 0) {
        switch (service.price.type) {
          case PricingType.HOURLY:
            return total + service.price.amount * quantity * calculateDuration()
          case PricingType.PER_PERSON:
            return total + service.price.amount * quantity * bookingForm.guests
          case PricingType.FIXED:
          default:
            return total + service.price.amount * quantity
        }
      }
      return total
    }, 0)
  }

  // Calculate total price
  const calculateTotal = () => {
    return calculateVenueTotal() + calculateServicesTotal()
  }

  // Calculate duration between start and end date
  const calculateDuration = () => {
    if (!bookingForm.startDate || !bookingForm.endDate) return 0
    return Math.max(1, Math.ceil((bookingForm.endDate.getTime() - bookingForm.startDate.getTime()) / (1000 * 60 * 60)))
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

  // Handle service quantity change
  const handleServiceQuantityChange = (serviceId: string, change: number) => {
    setBookingForm((prev) => ({
      ...prev,
      selectedServices: {
        ...prev.selectedServices,
        [serviceId]: Math.max(0, (prev.selectedServices[serviceId] || 0) + change),
      },
    }))
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateBookingInputs()) {
      return
    }

    try {
      // Here you would typically submit the booking to your API
      console.log("Booking form data:", bookingForm)

      // Navigate to confirmation page
      navigate(`/venues/${id}/confirmation`, {
        state: {
          venue,
          bookingForm,
          total: calculateTotal(),
          venueTotal: calculateVenueTotal(),
          servicesTotal: calculateServicesTotal(),
          duration: calculateDuration(),
        },
      })
    } catch (error) {
      console.error("Error submitting booking:", error)
    }
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link to={`/venues/${id}`}>
                  <Button variant="outline" size="icon" className="rounded-full bg-transparent">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">{t("venueBook.title")}</h1>
                  <p className="text-muted-foreground">{venue.name[language]}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
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

            <div className="grid gap-8 md:grid-cols-[1fr_400px]">
              <div className="space-y-8">
                {/* Venue Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={
                          venue.media && venue.media.length > 0
                            ? formatImageUrl(venue.media[0].url)
                            : `/placeholder.svg?height=120&width=120&text=${venue.name[language]}`
                        }
                        alt={venue.name[language]}
                        className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <Badge className={`${getPriceTypeBadge(venue.price.type).bgColor} mr-2`}>
                              {getPriceTypeBadge(venue.price.type).text}
                            </Badge>
                            <h2 className="text-xl font-semibold mt-1">{venue.name[language]}</h2>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{getPriceDisplay(venue)}</div>
                            <div className="flex items-center text-sm">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>
                                {rating.average} ({rating.count})
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>
                              {venue.capacity.min}-{venue.capacity.max} {t("venueDetail.guests")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Form Tabs */}
                <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="details">{t("venueBook.bookingDetails")}</TabsTrigger>
                    <TabsTrigger value="services">{t("venueBook.services")}</TabsTrigger>
                    <TabsTrigger value="contact">{t("venueBook.contactInfo")}</TabsTrigger>
                  </TabsList>

                  {/* Booking Details Tab */}
                  <TabsContent value="details" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("venueBook.eventDetails")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Start Date/Time */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{t("venueDetail.startDateTime")}</Label>
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
                                {bookingForm.startDate ? (
                                  format(bookingForm.startDate, "PPP p")
                                ) : (
                                  <span>{t("venueDetail.pickStartDateTime")}</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={bookingForm.startDate}
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
                                  <Label className="text-sm font-medium">{t("venueDetail.time")}</Label>
                                  <Input
                                    type="time"
                                    value={bookingForm.startDate ? format(bookingForm.startDate, "HH:mm") : "10:00"}
                                    onChange={(e) => {
                                      if (e.target.value && bookingForm.startDate) {
                                        const [hours, minutes] = e.target.value.split(":").map(Number)
                                        const newDate = new Date(bookingForm.startDate)
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
                                        bookingForm.startDate
                                          ?.toLocaleDateString("en-US", { weekday: "long" })
                                          .toLowerCase()
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
                          <Label className="text-sm font-medium">{t("venueDetail.endDateTime")}</Label>
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
                                {bookingForm.endDate ? (
                                  format(bookingForm.endDate, "PPP p")
                                ) : (
                                  <span>{t("venueDetail.pickEndDateTime")}</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={bookingForm.endDate}
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
                                  <Label className="text-sm font-medium">{t("venueDetail.time")}</Label>
                                  <Input
                                    type="time"
                                    value={bookingForm.endDate ? format(bookingForm.endDate, "HH:mm") : "13:00"}
                                    onChange={(e) => {
                                      if (e.target.value && bookingForm.endDate) {
                                        const [hours, minutes] = e.target.value.split(":").map(Number)
                                        const newDate = new Date(bookingForm.endDate)
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
                                        bookingForm.endDate
                                          ?.toLocaleDateString("en-US", { weekday: "long" })
                                          .toLowerCase()
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
                          <Label className="text-sm font-medium">{t("venueDetail.guests")}</Label>
                          <Input
                            type="number"
                            min={venue.capacity.min}
                            max={venue.capacity.max}
                            value={bookingForm.guests}
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
                          <Label className="text-sm font-medium">{t("venueDetail.eventType")}</Label>
                          <Input
                            type="text"
                            placeholder={t("venueDetail.eventTypePlaceholder")}
                            value={bookingForm.eventType}
                            onChange={(e) => setBookingForm((prev) => ({ ...prev, eventType: e.target.value }))}
                            className="w-full"
                          />
                        </div>

                        {/* Special Requests */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">{t("venueBook.specialRequests")}</Label>
                          <Textarea
                            placeholder={t("venueBook.specialRequestsPlaceholder")}
                            value={bookingForm.specialRequests}
                            onChange={(e) => setBookingForm((prev) => ({ ...prev, specialRequests: e.target.value }))}
                            className="w-full min-h-[100px]"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Services Tab */}
                  <TabsContent value="services" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("venueBook.additionalServices")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {availableServices.length === 0 ? (
                          <div className="text-center p-8">
                            <p className="text-muted-foreground">{t("venueDetail.noServices")}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {availableServices.map((service) => (
                              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    {getServiceTypeIcon("Info")}
                                    <h4 className="font-medium">{service.name[language]}</h4>
                                    <Badge className="ml-2 text-xs">
                                      {formatPrice(service.price.amount, service.price.currency as Currency)}
                                      {service.price.type === PricingType.HOURLY && `/${t("business.pricing.hourly")}`}
                                      {service.price.type === PricingType.PER_PERSON &&
                                        `/${t("business.pricing.perPerson")}`}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{service.description[language]}</p>
                                  {service.metadata?.duration && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {t("venueBook.duration")}: {service.metadata.duration} {t("venueDetail.hours")}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => handleServiceQuantityChange(service.id, -1)}
                                    disabled={!bookingForm.selectedServices[service.id]}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-8 text-center text-sm">
                                    {bookingForm.selectedServices[service.id] || 0}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => handleServiceQuantityChange(service.id, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Contact Info Tab */}
                  <TabsContent value="contact" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("venueBook.contactInformation")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">{t("venueBook.firstName")}</Label>
                            <Input
                              id="firstName"
                              value={bookingForm.contactInfo.firstName}
                              onChange={(e) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  contactInfo: { ...prev.contactInfo, firstName: e.target.value },
                                }))
                              }
                              className={cn(validationErrors.contactInfo?.firstName ? "border-red-500" : "")}
                            />
                            {validationErrors.contactInfo?.firstName && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {validationErrors.contactInfo.firstName}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">{t("venueBook.lastName")}</Label>
                            <Input
                              id="lastName"
                              value={bookingForm.contactInfo.lastName}
                              onChange={(e) =>
                                setBookingForm((prev) => ({
                                  ...prev,
                                  contactInfo: { ...prev.contactInfo, lastName: e.target.value },
                                }))
                              }
                              className={cn(validationErrors.contactInfo?.lastName ? "border-red-500" : "")}
                            />
                            {validationErrors.contactInfo?.lastName && (
                              <p className="text-sm text-red-600 dark:text-red-400">
                                {validationErrors.contactInfo.lastName}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("venueBook.email")}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={bookingForm.contactInfo.email}
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                contactInfo: { ...prev.contactInfo, email: e.target.value },
                              }))
                            }
                            className={cn(validationErrors.contactInfo?.email ? "border-red-500" : "")}
                          />
                          {validationErrors.contactInfo?.email && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {validationErrors.contactInfo.email}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("venueBook.phone")}</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={bookingForm.contactInfo.phone}
                            onChange={(e) =>
                              setBookingForm((prev) => ({
                                ...prev,
                                contactInfo: { ...prev.contactInfo, phone: e.target.value },
                              }))
                            }
                            className={cn(validationErrors.contactInfo?.phone ? "border-red-500" : "")}
                          />
                          {validationErrors.contactInfo?.phone && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                              {validationErrors.contactInfo.phone}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Booking Summary */}
              <div className="space-y-6">
                <div className="sticky top-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("venueBook.bookingSummary")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Venue Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t("venueBook.venue")}</span>
                          <span className="font-medium">{venue.name[language]}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t("venueDetail.duration")}</span>
                          <span>
                            {calculateDuration()} {t("venueDetail.hours")}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{t("venueDetail.guests")}</span>
                          <span>{bookingForm.guests}</span>
                        </div>
                        {bookingForm.startDate && (
                          <div className="flex justify-between text-sm">
                            <span>{t("venueDetail.startDateTime")}</span>
                            <span>{format(bookingForm.startDate, "PPP p")}</span>
                          </div>
                        )}
                        {bookingForm.endDate && (
                          <div className="flex justify-between text-sm">
                            <span>{t("venueDetail.endDateTime")}</span>
                            <span>{format(bookingForm.endDate, "PPP p")}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Pricing Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{t("venueBook.venuePrice")}</span>
                          <span>{formatPrice(calculateVenueTotal(), venue.price.currency as Currency)}</span>
                        </div>

                        {/* Services */}
                        {Object.entries(bookingForm.selectedServices).some(([_, quantity]) => quantity > 0) && (
                          <>
                            <div className="text-sm font-medium">{t("venueBook.services")}:</div>
                            {availableServices.map((service) => {
                              const quantity = bookingForm.selectedServices[service.id] || 0
                              if (quantity > 0) {
                                let serviceTotal = 0
                                switch (service.price.type) {
                                  case PricingType.HOURLY:
                                    serviceTotal = service.price.amount * quantity * calculateDuration()
                                    break
                                  case PricingType.PER_PERSON:
                                    serviceTotal = service.price.amount * quantity * bookingForm.guests
                                    break
                                  case PricingType.FIXED:
                                  default:
                                    serviceTotal = service.price.amount * quantity
                                }
                                return (
                                  <div key={service.id} className="flex justify-between text-sm pl-4">
                                    <span>
                                      {service.name[language]} x{quantity}
                                    </span>
                                    <span>{formatPrice(serviceTotal, service.price.currency as Currency)}</span>
                                  </div>
                                )
                              }
                              return null
                            })}
                            <div className="flex justify-between text-sm">
                              <span>{t("venueBook.servicesTotal")}</span>
                              <span>{formatPrice(calculateServicesTotal(), venue.price.currency as Currency)}</span>
                            </div>
                          </>
                        )}
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between font-semibold">
                        <span>{t("venueDetail.total")}</span>
                        <span>{formatPrice(calculateTotal(), venue.price.currency as Currency)}</span>
                      </div>

                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleSubmit}
                      >
                        {t("venueBook.confirmBooking")}
                      </Button>

                      <p className="text-xs text-muted-foreground text-center">{t("venueBook.bookingTerms")}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
