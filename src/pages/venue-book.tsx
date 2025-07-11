"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { format, addHours, isValid, parseISO } from "date-fns"
import {
  CalendarIcon,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  Loader2,
  ChevronDown,
} from "lucide-react"
import { useLanguage } from "../context/language-context"
import { useCurrency, type Currency } from "../context/currency-context"
import { cn } from "../lib/utils"
import { toast } from "sonner"
import * as venueService from "../services/venueService"
import * as bookingService from "../services/bookingService"
import { useAuth } from "../context/auth-context"

// Define interfaces
interface Venue {
  id: string
  name: { en: string; sq: string }
  description: { en: string; sq: string }
  type: string
  address: {
    city: string
    country: string
    street: string
    state: string
    zipCode: string
  }
  capacity: {
    min: number
    max: number
    recommended: number
  }
  price: {
    amount: number
    currency: string
    type: string
  }
  media: Array<{
    id: string
    url: string
    type: string
  }>
  reviews: Array<{
    id: string
    rating: number
    comment: string
  }>
  amenities: string[]
  dayAvailability: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  metadata?: {
    blockedDates?: Array<{
      startDate: string
      endDate: string
      isConfirmed: boolean
    }>
  }
}

interface ValidationErrors {
  eventType?: string
  startDate?: string
  endDate?: string
  guests?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

const eventTypes = ["wedding", "birthday", "corporate", "conference", "party", "meeting", "celebration", "other"]

export default function VenueBookPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { t, language } = useLanguage()
  const { formatPrice, convertPrice, currency } = useCurrency()
  const { user } = useAuth()

  // Extract data from location state
  const {
    startDate: initialStartDate,
    endDate: initialEndDate,
    guests: initialGuests,
    eventType: initialEventType,
  } = location.state || {}

  // Parse dates from location state
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

  // State
  const [venue, setVenue] = useState<Venue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(parseDate(initialStartDate) || new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(parseDate(initialEndDate) || addHours(new Date(), 3))
  const [guests, setGuests] = useState(initialGuests || 50)
  const [eventType, setEventType] = useState(initialEventType || "")
  const [specialRequests, setSpecialRequests] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phonePrefix: "+355",
  })

  // Phone prefixes
  const phonePrefix = [
    { code: "+355", country: "AL", name: "Albania", flag: "🇦🇱" },
    { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
    { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
    { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
    { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
    { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
  ]

  // Fetch venue data
  useEffect(() => {
    const fetchVenue = async () => {
      if (!id) return

      setIsLoading(true)
      try {
        const venueData = await venueService.getVenueById(id)
        if (venueData) {
          setVenue(venueData as Venue)
          if (venueData.capacity?.min && !initialGuests) {
            setGuests(venueData.capacity.min)
          }
        }
      } catch (error) {
        console.error("Error fetching venue:", error)
        toast.error(t("common.error"), {
          description: "Failed to load venue details",
          icon: <AlertCircle className="h-4 w-4" />,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVenue()
  }, [id, initialGuests, t])

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormValues({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        phonePrefix: "+355",
      })
    }
  }, [user])

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    const cleanedPhone = phone.replace(/[\s\-()]/g, "")
    return phoneRegex.test(cleanedPhone)
  }

  const validateAllFields = (): ValidationErrors => {
    const errors: ValidationErrors = {}

    if (!eventType) errors.eventType = "Event type is required"
    if (!startDate) errors.startDate = "Start date is required"
    if (!endDate) errors.endDate = "End date is required"
    if (!guests || guests < 1) errors.guests = "Number of guests is required"
    if (venue && guests < venue.capacity.min) errors.guests = `Minimum ${venue.capacity.min} guests required`
    if (venue && guests > venue.capacity.max) errors.guests = `Maximum ${venue.capacity.max} guests allowed`
    if (!formValues.firstName.trim()) errors.firstName = "First name is required"
    if (!formValues.lastName.trim()) errors.lastName = "Last name is required"
    if (!formValues.email.trim()) errors.email = "Email is required"
    else if (!validateEmail(formValues.email)) errors.email = "Please enter a valid email address"
    if (!formValues.phone.trim()) errors.phone = "Phone number is required"
    else if (!validatePhone(formValues.phone)) errors.phone = "Please enter a valid phone number"

    return errors
  }

  // Calculate pricing
  const calculateTotal = () => {
    if (!venue) return { basePrice: "$0", total: "$0" }

    let basePrice = venue.price.amount
    if (venue.price.type === "perPerson") {
      basePrice = venue.price.amount * guests
    }

    const convertedPrice = convertPrice(basePrice, venue.price.currency as Currency)
    return {
      basePrice: formatPrice(convertedPrice, currency),
      total: formatPrice(convertedPrice, currency),
    }
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
  }

  // Get price type badge
  const getPriceTypeBadge = (priceType: string) => {
    switch (priceType) {
      case "hourly":
        return {
          text: "Per Hour",
          bgColor: "bg-primary/10 text-primary border-primary/20",
        }
      case "perPerson":
        return {
          text: "Per Person",
          bgColor: "bg-secondary/10 text-secondary border-secondary/20",
        }
      case "fixed":
        return {
          text: "Fixed Price",
          bgColor: "bg-accent/10 text-accent border-accent/20",
        }
      default:
        return {
          text: "Fixed Price",
          bgColor: "bg-accent/10 text-accent border-accent/20",
        }
    }
  }

  // Format image URL
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"
    if (url.startsWith("http")) return url
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

  // Handle form changes
  const handleFormChange = (field: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  // Handle phone number input
  const handlePhoneChange = (value: string) => {
    const cleanedValue = value.startsWith("0") ? value.substring(1) : value
    handleFormChange("phone", cleanedValue)
  }

  // Handle date selection
  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    if (date && endDate && date >= endDate) {
      setEndDate(addHours(date, 3))
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const errors = validateAllFields()
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        toast.error("Please fix the errors below")
        setIsSubmitting(false)
        return
      }

      const { firstName, lastName, email, phone, phonePrefix } = formValues
      const cleanPhone = phone.startsWith("0") ? phone.substring(1) : phone
      const fullPhoneNumber = `${phonePrefix}${cleanPhone}`

      const bookingData = {
        venueId: id || "",
        startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
        endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
        startTime: startDate ? format(startDate, "HH:mm") : "",
        endTime: endDate ? format(endDate, "HH:mm") : "",
        numberOfGuests: guests,
        serviceOptionIds: [],
        specialRequests,
        eventType,
        metadata: {
          contactDetails: {
            firstName,
            lastName,
            email,
            phone: fullPhoneNumber,
          },
        },
      }

      const response = await bookingService.createBooking(bookingData)

      if (response.success && response.bookingId) {
        toast.success("Booking created successfully!", {
          icon: <CheckCircle className="h-4 w-4" />,
        })

        navigate("/dashboard", {
          state: {
            bookingId: response.bookingId,
            bookingSuccess: true,
          },
        })
      } else {
        throw new Error(response.error || "Failed to create booking")
      }
    } catch (error: any) {
      console.error("Error creating booking:", error)
      toast.error("Failed to create booking", {
        description: error.message || "Please try again",
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle back navigation
  const handleBackToVenueDetail = () => {
    navigate(`/venues/${id}`, {
      state: {
        startDate,
        endDate,
        guests,
        eventType,
      },
    })
  }

  if (isLoading || !venue) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  const { basePrice, total } = calculateTotal()
  const duration = calculateDuration()

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-warm-cream via-primary/5 to-accent/10 dark:from-slate-900 dark:to-slate-800">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-secondary/40 blur-3xl"></div>
        <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-accent/30 to-primary/40 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-secondary/20 to-accent/30 blur-2xl opacity-60"></div>
      </div>

      <div className="container px-4 md:px-8 py-8 md:py-12 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl mb-2">Book Venue</h1>
              <p className="text-muted-foreground">Complete your booking for {venue.name[language]}</p>
            </div>
            <Button variant="outline" onClick={handleBackToVenueDetail} className="flex items-center bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Venue
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Venue Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Venue Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                      <img
                        src={
                          venue.media && venue.media.length > 0
                            ? formatImageUrl(venue.media[0].url)
                            : "/placeholder.svg?height=80&width=80&text=Venue"
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
                        <Badge className={getPriceTypeBadge(venue.price.type).bgColor}>
                          {getPriceTypeBadge(venue.price.type).text}
                        </Badge>
                        <span className="ml-2 font-medium">{basePrice}</span>
                      </div>
                    </div>
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
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Event Type */}
                  <div className="space-y-2">
                    <Label htmlFor="event-type">
                      Event Type <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <select
                        id="event-type"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className={cn(
                          "w-full p-3 pr-10 border rounded-md bg-background appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                          validationErrors.eventType ? "border-red-500" : "border-input",
                        )}
                        required
                      >
                        <option value="">Select event type</option>
                        {eventTypes.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                    {validationErrors.eventType && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {validationErrors.eventType}
                      </p>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Start Date & Time</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground",
                              validationErrors.startDate && "border-red-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP p") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={handleStartDateSelect}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                          <div className="p-3 border-t">
                            <Input
                              type="time"
                              value={startDate ? format(startDate, "HH:mm") : ""}
                              onChange={(e) => {
                                if (startDate) {
                                  const [hours, minutes] = e.target.value.split(":")
                                  const newDate = new Date(startDate)
                                  newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                                  handleStartDateSelect(newDate)
                                }
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      {validationErrors.startDate && (
                        <p className="text-sm text-red-500">{validationErrors.startDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>End Date & Time</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                              validationErrors.endDate && "border-red-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP p") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={handleEndDateSelect}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                          <div className="p-3 border-t">
                            <Input
                              type="time"
                              value={endDate ? format(endDate, "HH:mm") : ""}
                              onChange={(e) => {
                                if (endDate) {
                                  const [hours, minutes] = e.target.value.split(":")
                                  const newDate = new Date(endDate)
                                  newDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                                  handleEndDateSelect(newDate)
                                }
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      {validationErrors.endDate && <p className="text-sm text-red-500">{validationErrors.endDate}</p>}
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="space-y-2">
                    <Label htmlFor="guests">
                      Number of Guests <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                      <Users className="ml-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="guests"
                        type="number"
                        min={venue.capacity.min}
                        max={venue.capacity.max}
                        value={guests}
                        onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                        className={cn(
                          "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
                          validationErrors.guests && "text-red-500",
                        )}
                        required
                      />
                    </div>
                    {validationErrors.guests && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {validationErrors.guests}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Capacity: {venue.capacity.min}-{venue.capacity.max} guests
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formValues.firstName}
                        onChange={(e) => handleFormChange("firstName", e.target.value)}
                        className={cn(
                          "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                          validationErrors.firstName && "border-red-500",
                        )}
                        required
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-500">{validationErrors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formValues.lastName}
                        onChange={(e) => handleFormChange("lastName", e.target.value)}
                        className={cn(
                          "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                          validationErrors.lastName && "border-red-500",
                        )}
                        required
                      />
                      {validationErrors.lastName && <p className="text-sm text-red-500">{validationErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formValues.email}
                      onChange={(e) => handleFormChange("email", e.target.value)}
                      className={cn(
                        "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                        validationErrors.email && "border-red-500",
                      )}
                      required
                    />
                    {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <select
                        value={formValues.phonePrefix}
                        onChange={(e) => handleFormChange("phonePrefix", e.target.value)}
                        className="h-10 w-32 px-3 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {phonePrefix.map((prefix) => (
                          <option key={prefix.code} value={prefix.code}>
                            {prefix.flag} {prefix.code}
                          </option>
                        ))}
                      </select>
                      <Input
                        id="phone"
                        type="tel"
                        value={formValues.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className={cn(
                          "flex-1 focus:ring-2 focus:ring-primary/20 focus:border-primary",
                          validationErrors.phone && "border-red-500",
                        )}
                        placeholder="69 123 4567"
                        required
                      />
                    </div>
                    {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requirements or requests for your event..."
                      className="min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            </form>

            {/* Booking Summary */}
            <div className="space-y-6">
              <div className="sticky top-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                        <img
                          src={
                            venue.media && venue.media.length > 0
                              ? formatImageUrl(venue.media[0].url)
                              : "/placeholder.svg"
                          }
                          alt={venue.name[language]}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{venue.name[language]}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{startDate ? format(startDate, "PPP") : "Date"}</span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">
                          {startDate ? format(startDate, "p") : ""} - {endDate ? format(endDate, "p") : ""}
                          {duration > 0 && ` (${duration} hours)`}
                        </span>
                      </div>

                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{guests} guests</span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>{total}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Confirm Booking <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By booking, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
