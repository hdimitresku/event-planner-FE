"use client"

import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { format, addHours, isValid, parseISO, parse, set, isBefore, isAfter, addDays } from "date-fns"
import {
  CalendarIcon,
  Clock,
  Users,
  Info,
  ArrowRight,
  Check,
  ChevronDown,
  MessageSquare,
  MapPin,
  Star,
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
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { useLanguage } from "../context/language-context"
import { EXCHANGE_RATES, useCurrency, type Currency } from "../context/currency-context"
import { cn } from "../components/ui/utils"
import { Badge } from "../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { toast } from "sonner"
import * as venueService from "../services/venueService"
import * as serviceService from "../services/serviceService"
import * as bookingService from "../services/bookingService"
import { EventType } from "@/models"
import * as userService from "../services/userService"
import { useAuth } from "../context/auth-context"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { Label } from "../components/ui/label"
import type { User as UserType } from "../models/user"

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
  id: string
  name: LocalizedText
  description: LocalizedText
  type: string
  icon: string
  venueTypes: string[]
  dayAvailability: DayAvailability
  isActive: boolean
  metadata: Metadata
  provider: Person
  options: ServiceOption[]
  media: Media[]
  createdAt: string
  updatedAt: string
}

interface ServiceType {
  type: string
  icon: string
}

// Validation errors interface
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

// Update the ServiceTypesResponse interface
interface ServiceTypesResponse {
  serviceTypes: ServiceType[]
}

export default function VenueBookPage() {
 const { id } = useParams<{ id: string }>()
 const navigate = useNavigate()
 const location = useLocation()
 const { t, language } = useLanguage()
 const { formatPrice, convertPrice, currency } = useCurrency()
 const { user } = useAuth()

 // Refs for scrolling to fields
 const eventTypeRef = useRef<HTMLDivElement>(null)
 const dateRangeRef = useRef<HTMLDivElement>(null)
 const guestsRef = useRef<HTMLDivElement>(null)
 const firstNameRef = useRef<HTMLDivElement>(null)
 const lastNameRef = useRef<HTMLDivElement>(null)
 const emailRef = useRef<HTMLDivElement>(null)
 const phoneRef = useRef<HTMLDivElement>(null)

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
 const [selectedServices, setSelectedServices] = useState<Record<string, string[]>>({})
 const [services, setServices] = useState<Service[]>([])
 const [serviceTypes, setServiceTypes] = useState<Record<string, ServiceType>>({})
 const [venue, setVenue] = useState<Venue | null>(null)
 const [isLoading, setIsLoading] = useState(true)
 const [eventType, setEventType] = useState(initialEventType || "")
 const [expandedTypes, setExpandedTypes] = useState<string[]>([])
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [selectedOptionDetails, setSelectedOptionDetails] = useState<{
   service: Service
   option: ServiceOption
 } | null>(null)
 const [selectedImageGallery, setSelectedImageGallery] = useState<Media[] | null>(null)
 const [currentImageIndex, setCurrentImageIndex] = useState(0)
 const [userData, setUserData] = useState<UserType | null>(null)
 const [formValues, setFormValues] = useState({
   firstName: "",
   lastName: "",
   email: "",
   phone: "",
   phonePrefix: "+355", // Albanian prefix as default
 })
 const [specialRequests, setSpecialRequests] = useState("")
 const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
 const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
 const [blockedDates, setBlockedDates] = useState<Date[]>([])
 const [selectedDate, setSelectedDate] = useState<Date | null>(null)
 const [showConfirmationModal, setShowConfirmationModal] = useState(false)
 const [confirmationData, setConfirmationData] = useState<any>(null)

 // Phone prefixes with country codes and flags
 const phonePrefix = [
   { code: "+355", country: "AL", name: "Albania", flag: "🇦🇱" },
   { code: "+1", country: "US", name: "United States", flag: "🇺🇸" },
   { code: "+44", country: "GB", name: "United Kingdom", flag: "🇬🇧" },
   { code: "+49", country: "DE", name: "Germany", flag: "🇩🇪" },
   { code: "+33", country: "FR", name: "France", flag: "🇫🇷" },
   { code: "+39", country: "IT", name: "Italy", flag: "🇮🇹" },
   { code: "+34", country: "ES", name: "Spain", flag: "🇪🇸" },
   { code: "+31", country: "NL", name: "Netherlands", flag: "🇳🇱" },
   { code: "+41", country: "CH", name: "Switzerland", flag: "🇨🇭" },
   { code: "+43", country: "AT", name: "Austria", flag: "🇦🇹" },
   { code: "+61", country: "AU", name: "Australia", flag: "🇦🇺" },
   { code: "+81", country: "JP", name: "Japan", flag: "🇯🇵" },
   { code: "+49", country: "AT", name: "Austria", flag: "🇦🇹" },
   { code: "+86", country: "CN", name: "China", flag: "🇨🇳" },
   { code: "+91", country: "IN", name: "India", flag: "🇮🇳" },
   { code: "+7", country: "RU", name: "Russia", flag: "🇷🇺" },
   { code: "+27", country: "ZA", name: "South Africa", flag: "🇿🇦" },
   { code: "+64", country: "NZ", name: "New Zealand", flag: "🇳🇿" },
   { code: "+82", country: "KR", name: "South Korea", flag: "🇰🇷" },
   { code: "+47", country: "NO", name: "Norway", flag: "🇳🇴" },
   { code: "+46", country: "SE", name: "Sweden", flag: "🇸🇪" },
   { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
   { code: "+420", country: "CZ", name: "Czech Republic", flag: "🇨🇿" },
   { code: "+36", country: "HU", name: "Hungary", flag: "🇭🇺" },
   { code: "+370", country: "LT", name: "Lithuania", flag: "🇱🇹" },
   { code: "+371", country: "LV", name: "Latvia", flag: "🇱🇻" },
   { code: "+372", country: "EE", name: "Estonia", flag: "🇪🇪" },
   { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
   { code: "+45", country: "DK", name: "Denmark", flag: "🇩🇰" },
   { code: "+40", country: "RO", name: "Romania", flag: "🇷🇴" },
   { code: "+48", country: "PL", name: "Poland", flag: "🇵🇱" },
   { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
   { code: "+352", country: "LU", name: "Luxembourg", flag: "🇱🇺" },
   { code: "+353", country: "IE", name: "Ireland", flag: "🇮🇪" },
   { code: "+380", country: "UA", name: "Ukraine", flag: "🇺🇦" },
   { code: "+254", country: "KE", name: "Kenya", flag: "🇰🇪" },
   { code: "+234", country: "NG", name: "Nigeria", flag: "🇳🇬" },
   { code: "+966", country: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
   { code: "+972", country: "IL", name: "Israel", flag: "🇮🇱" },
   { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" },
   { code: "+60", country: "MY", name: "Malaysia", flag: "🇲🇾" },
   { code: "+351", country: "PT", name: "Portugal", flag: "🇵🇹" },
   { code: "+358", country: "FI", name: "Finland", flag: "🇫🇮" },
   { code: "+65", country: "SG", name: "Singapore", flag: "🇸🇬" }
 ];
 

 // Handle phone number input with automatic 0 removal
 const handlePhoneChange = (value: string) => {
   // Remove leading 0 if present (common in local formats)
   const cleanedValue = value.startsWith('0') ? value.substring(1) : value
   handleFormChange("phone", cleanedValue)
 }

 const handleViewOptionDetails = (service: Service, option: ServiceOption) => {
   setSelectedOptionDetails({ service, option })
 }

 const closeOptionDetails = () => {
   setSelectedOptionDetails(null)
 }

 // Validation functions
 const validateEmail = (email: string): boolean => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   return emailRegex.test(email)
 }

 const validatePhone = (phone: string): boolean => {
   const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
   // Clean the phone number: remove spaces, dashes, brackets, and leading 0
   let cleanedPhone = phone.replace(/[\s\-$$$$]/g, "")
   // Remove leading 0 if present (common in local formats like Albanian)
   if (cleanedPhone.startsWith('0')) {
     cleanedPhone = cleanedPhone.substring(1)
   }
   return phoneRegex.test(cleanedPhone)
 }

 const validateField = (fieldName: string, value: any): string | undefined => {
   switch (fieldName) {
     case "eventType":
       return !value ? t("venueBook.validation.eventTypeRequired") || "Event type is required" : undefined

     case "startDate":
       if (!value) return t("venueBook.validation.startDateRequired") || "Start date is required"
       // Compare dates without time component
       const today = new Date()
       today.setHours(0, 0, 0, 0)
       const selectedDate = new Date(value)
       selectedDate.setHours(0, 0, 0, 0)
       if (selectedDate < today) return t("venueBook.validation.startDateFuture") || "Start date must be in the future"
       return undefined

     case "endDate":
       if (!value) return t("venueBook.validation.endDateRequired") || "End date is required"
       if (startDate && value <= startDate)
         return t("venueBook.validation.endDateAfterStart") || "End date must be after start date"
       return undefined

     case "guests":
       if (!value || value < 1) return t("venueBook.validation.guestsRequired") || "Number of guests is required"
       if (venue && value < venue.capacity.min)
         return (
             t("venueBook.validation.guestsMin", { min: venue.capacity.min }) ||
             `Minimum ${venue.capacity.min} guests required`
         )
       if (venue && value > venue.capacity.max)
         return (
             t("venueBook.validation.guestsMax", { max: venue.capacity.max }) ||
             `Maximum ${venue.capacity.max} guests allowed`
         )
       return undefined

     case "firstName":
       return !value?.trim() ? t("venueBook.validation.firstNameRequired") || "First name is required" : undefined

     case "lastName":
       return !value?.trim() ? t("venueBook.validation.lastNameRequired") || "Last name is required" : undefined

     case "email":
       if (!value?.trim()) return t("venueBook.validation.emailRequired") || "Email is required"
       if (!validateEmail(value)) return t("venueBook.validation.emailInvalid") || "Please enter a valid email address"
       return undefined

     case "phone":
       if (!value?.trim()) return t("venueBook.validation.phoneRequired") || "Phone number is required"
       if (!validatePhone(value)) return t("venueBook.validation.phoneInvalid") || "Please enter a valid phone number"
       return undefined

     default:
       return undefined
   }
 }

 const validateAllFields = (): ValidationErrors => {
   const errors: ValidationErrors = {}

   const eventTypeError = validateField("eventType", eventType)
   if (eventTypeError) errors.eventType = eventTypeError

   const startDateError = validateField("startDate", startDate)
   if (startDateError) errors.startDate = startDateError

   const endDateError = validateField("endDate", endDate)
   if (endDateError) errors.endDate = endDateError

   const guestsError = validateField("guests", guests)
   if (guestsError) errors.guests = guestsError

   const firstNameError = validateField("firstName", formValues.firstName)
   if (firstNameError) errors.firstName = firstNameError

   const lastNameError = validateField("lastName", formValues.lastName)
   if (lastNameError) errors.lastName = lastNameError

   const emailError = validateField("email", formValues.email)
   if (emailError) errors.email = emailError

   const phoneError = validateField("phone", formValues.phone)
   if (phoneError) errors.phone = phoneError

   return errors
 }

 const scrollToField = (fieldName: string) => {
   const refs: Record<string, React.RefObject<HTMLDivElement>> = {
     eventType: eventTypeRef,
     startDate: dateRangeRef,
     endDate: dateRangeRef,
     guests: guestsRef,
     firstName: firstNameRef,
     lastName: lastNameRef,
     email: emailRef,
     phone: phoneRef,
   }

   const ref = refs[fieldName]
   if (ref?.current) {
     ref.current.scrollIntoView({
       behavior: "smooth",
       block: "center",
     })

     // Focus the input if it exists
     setTimeout(() => {
       const input = ref.current?.querySelector("input, select, textarea") as HTMLElement
       if (input) {
         input.focus()
       }
     }, 500)
   }
 }

 const handleFieldBlur = (fieldName: string, value: any) => {
   setTouchedFields((prev) => ({ ...prev, [fieldName]: true }))

   const error = validateField(fieldName, value)
   setValidationErrors((prev) => ({
     ...prev,
     [fieldName]: error,
   }))
 }

 const handleFieldChange = (fieldName: string, value: any) => {
   // Clear error when user starts typing
   if (validationErrors[fieldName as keyof ValidationErrors]) {
     setValidationErrors((prev) => ({
       ...prev,
       [fieldName]: undefined,
     }))
   }
 }

 // Fetch venue and services data
 useEffect(() => {
   const fetchData = async () => {
     setIsLoading(true)
     try {
       if (id) {
         const venueData = await venueService.getVenueById(id)
         if (venueData) {
           // Cast venueData to Venue type since we know it has all required properties
           const fullVenueData = {
             ...venueData,
             owner: venueData.owner || {} as Person,
             description: venueData.description || { en: '', sq: '' },
             dayAvailability: venueData.dayAvailability || {} as DayAvailability,
             isActive: venueData.isActive || true,
             metadata: venueData.metadata || {},
             bookings: venueData.bookings || [],
             media: venueData.media || [],
             reviews: venueData.reviews || [],
           } 
           setVenue(fullVenueData)

           // Set initial guests to min capacity if available
           if (venueData.capacity?.min && !initialGuests) {
             setGuests(venueData.capacity.min)
           }

           // Fetch service types for this venue type
           if (venueData.type) {
             const serviceTypesData = await serviceService.getServiceTypesByVenueType(venueData.type) as ServiceTypesResponse
             
             // Convert service types array to a map for easier lookup
             const serviceTypesMap: Record<string, ServiceType> = {}
             serviceTypesData.forEach((type: ServiceType) => {
               serviceTypesMap[type.type] = type
             })
             setServiceTypes(serviceTypesMap)

             // Fetch services for this venue type
             const servicesData = await serviceService.getServicesByVenue(venueData.id)
             console.log(servicesData)
             const fullServices = servicesData.services.map(service => ({
               ...service,
               icon: service.icon || 'Info',
               venueTypes: service.venueTypes || [],
               dayAvailability: service.dayAvailability || {} as DayAvailability,
               metadata: service.metadata || {},
               provider: service.provider || {} as Person,
             })) as Service[]
             setServices(fullServices)

             // Expand the first service type by default if there are any
             if (serviceTypesData.length > 0) {
               setExpandedTypes([serviceTypesData[0].type])
             }
           }
         }
       }
     } catch (error) {
       console.error("Error fetching data:", error)
       toast.error(t("common.error"), {
         description: t("venueBook.errorFetchingData"),
         icon: <AlertCircle className="h-4 w-4" />,
       })
     } finally {
       setIsLoading(false)
     }
   }

   fetchData()
 }, [id, initialGuests, t])

 // Fetch user data and autofill form
 useEffect(() => {
   const fetchUserData = async () => {
     if (user?.id) {
       try {
         const currentUser = await userService.getUserById(user.id)
         if (currentUser) {
           setUserData(currentUser)
           // Autofill form with user data
           setFormValues({
             firstName: currentUser.firstName || "",
             lastName: currentUser.lastName || "",
             email: currentUser.email || "",
             phone: currentUser.phoneNumber || "",
             phonePrefix: "+355", // Albanian prefix as default
           })
         }
       } catch (error) {
         console.error("Error fetching user data:", error)
         // If user is logged in but we can't fetch data, try to use auth context data
         if (user) {
           setFormValues({
             firstName: user.firstName || "",
             lastName: user.lastName || "",
             email: user.email || "",
             phone: user.phoneNumber || "",
             phonePrefix: "+355", // Albanian prefix as default
           })
         }
       }
     }
   }

   fetchUserData()
 }, [user])

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

 // Count selected options for a service type
 const countSelectedOptionsForType = (type: string) => {
   let count = 0
   const servicesOfType = servicesByType[type] || []

   servicesOfType.forEach((service) => {
     count += selectedServices[service.id]?.length || 0
   })

   return count
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

 const toggleTypeExpansion = (type: string) => {
   setExpandedTypes((prev) => {
     if (prev.includes(type)) {
       return prev.filter((t) => t !== type)
     } else {
       return [...prev, type]
     }
   })
 }

 const handleFormChange = (field: string, value: string) => {
   setFormValues((prev) => ({
     ...prev,
     [field]: value,
   }))
   handleFieldChange(field, value)
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setIsSubmitting(true)

   try {
     // Validate all fields
     const errors = validateAllFields()

     if (Object.keys(errors).length > 0) {
       setValidationErrors(errors)

       // Find the first error and scroll to it
       const errorFields = Object.keys(errors)
       const firstErrorField = errorFields[0]

       toast.error(t("common.error"), {
         description: t("venueBook.validation.pleaseFixErrors") || "Please fix the errors below",
         icon: <AlertCircle className="h-4 w-4" />,
       })

       // Scroll to the first error field
       scrollToField(firstErrorField)
       setIsSubmitting(false)
       return
     }

     // Calculate detailed breakdown and prepare confirmation data
     const breakdown = calculateDetailedBreakdown()
     
     // Debug logging to verify pricing calculations
     console.log("=== PRICING BREAKDOWN DEBUG ===")
     console.log("User selected currency:", currency)
     console.log("Venue pricing:", {
       original: `${breakdown.venue?.originalAmount} ${breakdown.venue?.originalCurrency}`,
       selectedCurrency: `${breakdown.venue?.convertedAmount} ${currency}`,
       USD: `${breakdown.venue?.convertedAmountUSD} USD`
     })
     breakdown.services.forEach((service: any, index: number) => {
       console.log(`Service ${index + 1}:`, {
         name: `${service.serviceName.en} - ${service.optionName.en}`,
         original: `${service.originalAmount} ${service.originalCurrency}`,
         selectedCurrency: `${service.convertedAmount} ${currency}`,
         USD: `${service.convertedAmountUSD} USD`
       })
     })
     console.log("Totals:", {
       subtotalSelectedCurrency: `${breakdown.totals.subtotal} ${currency}`,
       subtotalUSD: `${breakdown.totals.subtotalUSD} USD`,
       totalSelectedCurrency: `${breakdown.totals.total} ${currency}`,
       totalUSD: `${breakdown.totals.totalUSD} USD`
     })
     console.log("================================")

     // Use form values from state
     const { firstName, lastName, email, phone, phonePrefix } = formValues
     // Remove leading 0 from phone number before combining with prefix
     const cleanPhone = phone.startsWith('0') ? phone.substring(1) : phone
     const fullPhoneNumber = `${phonePrefix}${cleanPhone}`

     // Format dates and times
     const formattedStartDate = startDate ? format(startDate, "yyyy-MM-dd") : ""
     const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : ""
     const formattedStartTime = startDate ? format(startDate, "HH:mm") : ""
     const formattedEndTime = endDate ? format(endDate, "HH:mm") : ""

     // Collect all selected service option IDs
     const serviceOptionIds = Object.values(selectedServices).flat()

     // Prepare booking data with pricing breakdown
     const bookingData = {
       venueId: id || "",
       startDate: formattedStartDate,
       endDate: formattedEndDate,
       startTime: formattedStartTime,
       endTime: formattedEndTime,
       numberOfGuests: guests,
       serviceOptionIds,
       specialRequests,
       eventType,
       pricing: {
         venue: breakdown.venue,
         services: breakdown.services,
         totals: breakdown.totals,
         breakdown: breakdown,
         // Ensure USD total is always included at top level
         totalUSD: breakdown.totals.totalUSD,
         totalSelectedCurrency: breakdown.totals.total,
         currency: currency
       },
       metadata: {
         contactDetails: {
           firstName,
           lastName,
           email,
           phone: fullPhoneNumber,
         },
       },
     }

     // Set confirmation data and show modal
     setConfirmationData({ bookingData, breakdown })
     setShowConfirmationModal(true)
     setIsSubmitting(false)

   } catch (error: any) {
     console.error("Error preparing booking:", error)
     toast.error(t("common.error"), {
       description: t("venueBook.bookingFailed"),
       icon: <AlertCircle className="h-4 w-4" />,
     })
     setIsSubmitting(false)
   }
 }

 const handleConfirmBooking = async () => {
   if (!confirmationData) return
   
   setIsSubmitting(true)
   try {
     const response = await bookingService.createBooking(confirmationData.bookingData)

     if (response.success && response.bookingId) {
       toast.success(t("common.success"), {
         description: t("venueBook.bookingCreated"),
         icon: <CheckCircle className="h-4 w-4" />,
       })

       // Redirect to dashboard with success state
       navigate("/dashboard", {
         state: {
           bookingId: response.bookingId,
           bookingSuccess: true,
           ...confirmationData.bookingData,
         },
       })
     } else {
       throw new Error(response.error || t("venueBook.bookingFailed"))
     }
   } catch (error: any) {
     console.error("Error creating booking:", error)

     // Extract error message from response
     let errorMessage = t("venueBook.bookingFailed")
     if (error.response?.data?.message) {
       errorMessage = error.response.data.message
     } else if (error.message) {
       errorMessage = error.message
     }

     toast.error(t("common.error"), {
       description: errorMessage,
       icon: <AlertCircle className="h-4 w-4" />,
     })
   } finally {
     setIsSubmitting(false)
     setShowConfirmationModal(false)
     setConfirmationData(null)
   }
 }

 const calculateDuration = () => {
   if (!startDate || !endDate) return 0
   return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
 }

 // Calculate total price for the booking
 const calculateTotal = () => {
   const { formatPrice, convertPrice, currency } = useCurrency()
   let basePrice = 0
   let servicesCost = 0
   const defaultCurrency = "USD" // Fallback currency

   // Add venue price
   if (venue) {
     const venuePrice = venue.price.amount
     const venueCurrency = venue.price.currency || defaultCurrency
     if (venue.price.type === "perPerson") {
       basePrice = convertPrice(venuePrice * (guests || 0), venueCurrency as Currency)
     } else {
       basePrice = convertPrice(venuePrice, venueCurrency as Currency)
     }
   }

   // Add selected services prices
   Object.entries(selectedServices).forEach(([serviceId, optionIds]) => {
     const service = services.find((s) => s.id === serviceId)
     if (service) {
       optionIds.forEach(optionId => {
         const selectedOption = service.options.find((opt) => opt.id === optionId)
         if (selectedOption) {
           const optionPrice = selectedOption.price.amount
           const optionCurrency = selectedOption.price.currency || defaultCurrency
           if (selectedOption.price.type === "perPerson") {
             servicesCost += convertPrice(optionPrice * (guests || 0), optionCurrency as Currency)
           } else {
             servicesCost += convertPrice(optionPrice, optionCurrency as Currency)
           }
         }
       })
     }
   })

   // Calculate service fee (e.g., 10% of total)

   // Calculate total
   const total = basePrice + servicesCost

   // Use the current selected currency for formatting all amounts
   return {
     basePrice: formatPrice(basePrice, currency),
     servicesCost: formatPrice(servicesCost, currency),
     total: formatPrice(total, currency)
   }
 }

 // Calculate detailed price breakdown in all currencies
 const calculateDetailedBreakdown = () => {
   const defaultCurrency = "USD"
   
   const convertToUSD = (amount: number, fromCurrency: string): number => {
     if (fromCurrency === "USD") return amount
     return amount * EXCHANGE_RATES[fromCurrency as Currency]["USD"]
   }
   
   let totalInSelectedCurrency = 0
   let totalInUSD = 0
   const breakdown: any = {
     venue: null,
     services: [],
     totals: {}
   }

   // Calculate duration in hours for hourly pricing
   const calculateDuration = () => {
     if (!startDate || !endDate) return 0
     return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
   }

   // Venue pricing
   if (venue) {
     const venuePrice = venue.price.amount
     const venueCurrency = venue.price.currency || defaultCurrency
     let finalVenuePrice = venuePrice
     
     // Calculate venue price based on type
     if (venue.price.type === "perPerson") {
       finalVenuePrice = venuePrice * (guests || 0)
     } else if (venue.price.type === "hourly") {
       const hours = calculateDuration()
       finalVenuePrice = venuePrice * hours
     }
     // For "fixed" type, finalVenuePrice remains as venuePrice
     
     const convertedVenuePrice = convertPrice(finalVenuePrice, venueCurrency as Currency)
     const convertedVenuePriceUSD = convertToUSD(finalVenuePrice, venueCurrency)
     totalInSelectedCurrency += convertedVenuePrice
     totalInUSD += convertedVenuePriceUSD
     
     breakdown.venue = {
       originalAmount: venuePrice,
       originalCurrency: venueCurrency,
       finalAmount: finalVenuePrice,
       convertedAmount: convertedVenuePrice,
       convertedAmountUSD: convertedVenuePriceUSD,
       type: venue.price.type,
       guests: guests,
       hours: venue.price.type === "hourly" ? calculateDuration() : undefined
     }
   }

   // Service options pricing
   Object.entries(selectedServices).forEach(([serviceId, optionIds]) => {
     const service = services.find((s) => s.id === serviceId)
     if (service) {
       optionIds.forEach(optionId => {
         const selectedOption = service.options.find((opt) => opt.id === optionId)
         if (selectedOption) {
           const optionPrice = selectedOption.price.amount
           const optionCurrency = selectedOption.price.currency || defaultCurrency
           let finalOptionPrice = optionPrice
           
           // Calculate service option price based on type
           if (selectedOption.price.type === "perPerson") {
             finalOptionPrice = optionPrice * (guests || 0)
           } else if (selectedOption.price.type === "hourly") {
             const hours = calculateDuration()
             finalOptionPrice = optionPrice * hours
           }
           // For "fixed" type, finalOptionPrice remains as optionPrice
           
           const convertedOptionPrice = convertPrice(finalOptionPrice, optionCurrency as Currency)
           const convertedOptionPriceUSD = convertToUSD(finalOptionPrice, optionCurrency)
           totalInSelectedCurrency += convertedOptionPrice
           totalInUSD += convertedOptionPriceUSD
           
           breakdown.services.push({
             serviceName: service.name,
             optionName: selectedOption.name,
             originalAmount: optionPrice,
             originalCurrency: optionCurrency,
             finalAmount: finalOptionPrice,
             convertedAmount: convertedOptionPrice,
             convertedAmountUSD: convertedOptionPriceUSD,
             type: selectedOption.price.type,
             guests: guests,
             hours: selectedOption.price.type === "hourly" ? calculateDuration() : undefined
           })
         }
       })
     }
   })



   breakdown.totals = {
     subtotal: totalInSelectedCurrency,
     subtotalUSD: totalInUSD,
     total: totalInSelectedCurrency,
     totalUSD: totalInUSD,
     currency: currency
   }

   return breakdown
 }

 // Update the toggleService function to allow deselection
 const toggleService = (serviceId: string, optionId: string) => {
   setSelectedServices((prev) => {
     const newServices = { ...prev }
     
     // If this option is already selected, deselect it
     if (newServices[serviceId]?.includes(optionId)) {
       delete newServices[serviceId]
       return newServices
     }
     
     // Otherwise, select only this option for this service
     return {
       ...newServices,
       [serviceId]: [optionId]
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

 const { basePrice, servicesCost, total } = calculateTotal()
 const duration = calculateDuration()



 // Get badge color and text for price type
 const getPriceTypeBadge = (priceType: string) => {
   switch (priceType) {
     case "hourly":
       return {
         text: t("business.pricing.hourly"),
         bgColor: "bg-primary/10 text-primary border-primary/20",
       }
     case "perPerson":
       return {
         text: t("business.pricing.perPerson"),
         bgColor: "bg-secondary/10 text-secondary border-secondary/20",
       }
     case "fixed":
       return {
         text: t("business.pricing.fixed"),
         bgColor: "bg-accent/10 text-accent border-accent/20",
       }
     case "custom":
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

 // Auto-scroll effect for service images
 useEffect(() => {
   if (selectedOptionDetails?.service.media && selectedOptionDetails.service.media.length > 1) {
     const interval = setInterval(() => {
       setCurrentImageIndex((prev) => (prev + 1) % selectedOptionDetails.service.media.length)
     }, 3000) // Change image every 3 seconds

     return () => clearInterval(interval)
   }
 }, [selectedOptionDetails])

 // Get blocked dates from venue metadata
 const getBlockedDates = () => {
   if (!venue || !venue.metadata || !venue.metadata.blockedDates) return []

   return venue.metadata.blockedDates.map((date) => {
     // Handle both string and ISO date formats
     const startDate = typeof date.startDate === "string"
       ? date.startDate.includes("T")
         ? parseISO(date.startDate)
         : new Date(date.startDate)
       : date.startDate

     const endDate = typeof date.endDate === "string"
       ? date.endDate.includes("T")
         ? parseISO(date.endDate)
         : new Date(date.endDate)
       : date.endDate

     return {
       start: startDate,
       end: endDate || startDate // If no end date, use start date as end date
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

 // Helper function to check if time is within operating hours
 const isTimeWithinOperatingHours = (date: Date) => {
   if (!venue?.dayAvailability) return true

   const dayName = date.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
   const operatingHours = venue.dayAvailability[dayName]
   if (!operatingHours || operatingHours === "Closed") return false

   const [openTimeStr, closeTimeStr] = operatingHours.split(" - ")
   const baseDate = new Date()
   const openTime = parse(openTimeStr, "h:mm a", baseDate)
   let closeTime = parse(closeTimeStr, "h:mm a", baseDate)

   if (closeTimeStr === "12:00 AM") {
     closeTime = set(closeTime, { hours: 0, minutes: 0 })
     closeTime.setDate(closeTime.getDate() + 1)
   }

   const selectedTime = set(baseDate, {
     hours: date.getHours(),
     minutes: date.getMinutes(),
     seconds: 0,
     milliseconds: 0,
   })

   if (isBefore(closeTime, openTime)) {
     return (
       isAfter(selectedTime, openTime) ||
       selectedTime.getTime() === openTime.getTime() ||
       isBefore(selectedTime, closeTime) ||
       selectedTime.getTime() === closeTime.getTime()
     )
   } else {
     return (
       (isAfter(selectedTime, openTime) || selectedTime.getTime() === openTime.getTime()) &&
       (isBefore(selectedTime, closeTime) || selectedTime.getTime() === closeTime.getTime())
     )
   }
 }

 // Update date selection handlers
 const handleStartDateSelect = (date: Date | undefined) => {
   // If trying to deselect, set to earliest available date
   if (!date) {
     const today = new Date()
     today.setHours(0, 0, 0, 0)
     const earliestDate = isDateAvailable(today) ? today : addDays(today, 1)
     setStartDate(earliestDate)
     return
   }
   setStartDate(date)
   if (date) {
     setValidationErrors((prev) => ({ ...prev, startDate: undefined, startTime: undefined }))
   }
 }

 const handleEndDateSelect = (date: Date | undefined) => {
   // If trying to deselect, set to start date + 3 hours
   if (!date && startDate) {
     setEndDate(addHours(startDate, 3))
     return
   }
   setEndDate(date)
   if (date) {
     setValidationErrors((prev) => ({ ...prev, endDate: undefined, endTime: undefined }))
   }
 }

 // Update useEffect to set blocked dates
 useEffect(() => {
   if (venue) {
     setBlockedDates(getBlockedDates())
   }
 }, [venue])

 if (isLoading || !venue) {
   return (
       <div className="container px-4 md:px-6 py-8">
         <div className="flex items-center justify-center h-[60vh]">
           <div className="text-center">
             <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-muted-foreground">{t("common.loading")}</p>
           </div>
         </div>
       </div>
   )
 }

 return (
   <>
     <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-gray-100 via-primary/5 to-accent/10 dark:from-slate-900 dark:to-slate-800">
       {/* Enhanced abstract background elements with better contrast */}
       <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-10">
         <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/30 to-secondary/40 blur-3xl"></div>
         <div className="absolute top-40 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-accent/30 to-primary/40 blur-3xl"></div>
         <div className="absolute bottom-20 left-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-secondary/20 to-accent/30 blur-2xl opacity-60"></div>
       </div>

       {/* Subtle texture overlay for light mode */}
       <div className="absolute inset-0 opacity-[0.03] dark:opacity-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(0,0,0,0.15)_1px,_transparent_0)] bg-[length:20px_20px]"></div>

       <div className="container px-4 md:px-8 py-8 md:py-12 relative">
         <div className="max-w-4xl mx-auto">
           <div className="mb-8 flex items-center justify-between">
             <div>
               <h1 className="text-2xl font-bold md:text-3xl mb-2">{t("venueBook.title")}</h1>
               <p className="text-muted-foreground">{t("venueBook.subtitle", { venue: venue.name[language] })}</p>
             </div>
             <Button variant="outline" onClick={handleBackToVenueDetail} className="flex items-center bg-transparent">
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
                       <span className="font-medium">{basePrice}</span>
                     </div>
                   </div>
                 </div>
               </div>

               {/* Event Details Card */}
               <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                 <h2 className="text-xl font-semibold">{t("venueBook.eventDetails")}</h2>

                 <div ref={eventTypeRef} className="space-y-3">
                   <label className="text-sm font-medium" htmlFor="event-type">
                     {t("venueBook.eventType")} <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <select
                         id="event-type"
                         value={eventType}
                         onChange={(e) => {
                           setEventType(e.target.value)
                           handleFieldChange("eventType", e.target.value)
                         }}
                         onBlur={(e) => handleFieldBlur("eventType", e.target.value)}
                         className={cn(
                             "hover:border-primary hover:shadow-sm w-full p-3 pr-10 border rounded-md bg-background appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                             validationErrors.eventType && touchedFields.eventType
                                 ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                 : "",
                         )}
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
                   {validationErrors.eventType && touchedFields.eventType && (
                       <p className="text-sm text-red-500 flex items-center">
                         <AlertCircle className="h-4 w-4 mr-1" />
                         {validationErrors.eventType}
                       </p>
                   )}
                 </div>

                 <div className="grid gap-4">
                   <div className="grid gap-2">
                     <Label htmlFor="start-date" className="flex items-center gap-2">
                       <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                       {t("business.bookings.startDate") || "Start Date & Time"}
                     </Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant="outline"
                           className={cn(
                             "w-full justify-start text-left font-normal",
                             !startDate && "text-muted-foreground",
                             validationErrors.startDate && "border-destructive"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {startDate ? format(startDate, "PPP p") : <span>{t("venueBook.selectDate") || "Select date"}</span>}
                         </Button>
                       </PopoverTrigger>
                       <PopoverContent className="w-auto p-0" align="start">
                         <Calendar
                           mode="single"
                           selected={startDate}
                           onSelect={handleStartDateSelect}
                           initialFocus
                           modifiers={{
                             available: isDateAvailable,
                             unavailable: (date) => !isDateAvailable(date),
                           }}
                           modifiersClassNames={{
                             available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
                             unavailable: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 line-through opacity-50 cursor-not-allowed",
                           }}
                           disabled={(date) => !isDateAvailable(date)}
                           className="rounded-md border"
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
                       <p className="text-sm text-destructive">{validationErrors.startDate}</p>
                     )}
                   </div>

                   <div className="grid gap-2">
                     <Label htmlFor="end-date" className="flex items-center gap-2">
                       <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                       {t("business.bookings.endDate") || "End Date & Time"}
                     </Label>
                     <Popover>
                       <PopoverTrigger asChild>
                         <Button
                           variant="outline"
                           className={cn(
                             "w-full justify-start text-left font-normal",
                             !endDate && "text-muted-foreground",
                             validationErrors.endDate && "border-destructive"
                           )}
                         >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           {endDate ? format(endDate, "PPP p") : <span>{t("venueBook.selectDate") || "Select date"}</span>}
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
                             available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
                             unavailable: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 line-through opacity-50 cursor-not-allowed",
                           }}
                           disabled={(date) => !isDateAvailable(date)}
                           className="rounded-md border"
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
                     {validationErrors.endDate && (
                       <p className="text-sm text-destructive">{validationErrors.endDate}</p>
                     )}
                   </div>
                 </div>

                 <div ref={guestsRef} className="space-y-3">
                   <label className="text-sm font-medium">
                     {t("venueBook.guests")} <span className="text-red-500">*</span>
                   </label>
                   <div
                       className={cn(
                           "flex items-center border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors hover:border-primary hover:shadow-sm",
                           validationErrors.guests
                               ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
                               : "",
                       )}
                   >
                     <Users className="ml-3 h-4 w-4 text-muted-foreground" />
                     <Input
                         type="number"
                         min={venue.capacity.min}
                         max={venue.capacity.max}
                         value={guests}
                         onChange={(e) => {
                           const value = Number.parseInt(e.target.value)
                           setGuests(value)
                           handleFieldChange("guests", value)
                         }}
                         onBlur={(e) => handleFieldBlur("guests", Number.parseInt(e.target.value))}
                         className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                   {Object.keys(serviceTypes).length > 0 ? (
                       Object.entries(serviceTypes).map(([type, serviceType]) => {
                         const isTypeExpanded = expandedTypes.includes(type)
                         const selectedCount = countSelectedOptionsForType(type)
                         const typeDisplayName = serviceTypeNames[type]?.[language] || type

                         // Get the icon from the service type data
                         const IconComponent = getIconByName(serviceType.icon)

                         // Count unique providers
                         const uniqueProviders = new Set(services.filter((s) => s.type === type).map((s) => s.provider.id)).size

                         return (
                             <div
                                 key={type}
                                 className="service-type-section border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden"
                             >
                               {/* Service Type Header */}
                               <div
                                   className="service-type-header p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between cursor-pointer"
                                   onClick={() => toggleTypeExpansion(type)}
                               >
                                 <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center space-x-2">
                                     <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                       {React.createElement(getIconByName(serviceType.icon), {
                                         className: "h-5 w-5 text-primary"
                                       })}
                                     </div>
                                     <h3 className="font-medium">{serviceTypeNames[type]?.[language] || type}</h3>
                                   </div>
                                   <div className="flex items-center space-x-2 min-w-[100px] justify-end">
                                     {countSelectedOptionsForType(type) > 0 && (
                                       <Badge variant="secondary" className="text-xs">
                                         {countSelectedOptionsForType(type)} {t("venueBook.selected")}
                                       </Badge>
                                     )}
                                   </div>
                                 </div>
                               </div>

                               {/* All Providers and Services for this type */}
                               {isTypeExpanded && (
                                   <div className="service-content p-4 space-y-4 border-t border-gray-100 dark:border-gray-700">
                                     {/* Group services by provider */}
                                     {(() => {
                                       // Group services by provider
                                       const servicesByProvider: Record<string, Service[]> = {}
                                       services.forEach((service) => {
                                         if (service.type === type) {
                                           const providerId = service.provider.id
                                           if (!servicesByProvider[providerId]) {
                                             servicesByProvider[providerId] = []
                                           }
                                           servicesByProvider[providerId].push(service)
                                         }
                                       })

                                       return Object.entries(servicesByProvider).map(([providerId, providerServices]) => {
                                         const provider = providerServices[0].provider
                                         const totalSelectedForProvider = providerServices.reduce(
                                             (sum, service) => sum + (selectedServices[service.id]?.length || 0),
                                             0,
                                         )

                                         return (
                                             <div key={providerId} className="provider-section space-y-3">
                                               {/* Provider Header */}
                                               <div className="provider-header flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-lg">
                                                 <div className="flex items-center">
                                                   <Avatar className="h-8 w-8 mr-3">
                                                     <AvatarImage
                                                         src={
                                                           provider?.profilePicture
                                                               ? formatImageUrl(provider?.profilePicture)
                                                               : "/placeholder.svg?height=32&width=32"
                                                         }
                                                         alt={`${provider?.firstName} ${provider?.lastName}`}
                                                     />
                                                     <AvatarFallback>
                                                       {provider?.firstName?.charAt(0)}
                                                       {provider?.lastName?.charAt(0)}
                                                     </AvatarFallback>
                                                   </Avatar>
                                                   <div>
                                                     <h4 className="font-medium text-sm">
                                                       {provider?.firstName} {provider?.lastName}
                                                     </h4>
                                                     <p className="text-xs text-muted-foreground">
                                                       {providerServices.length}{" "}
                                                       {providerServices.length === 1
                                                           ? t("venueBook.service")
                                                           : t("venueBook.services")}
                                                     </p>
                                                   </div>
                                                 </div>
                                                 <div className="flex items-center">
                                                   <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                                     <MessageSquare className="h-3 w-3 mr-1" />
                                                     {t("venueBook.contactProvider")}
                                                   </Button>
                                                 </div>
                                               </div>

                                               {/* All Services from this Provider */}
                                               <div className="provider-services space-y-4">
                                                 {providerServices.map((service) => (
                                                     <div key={service.id} className="service-section">
                                                       {/* Service Name (if provider has multiple services) */}
                                                       {providerServices.length > 1 && (
                                                           <div className="service-header mb-2">
                                                             <h5 className="font-medium text-sm">{service.name[language]}</h5>
                                                             <p className="text-xs text-muted-foreground">
                                                               {service.description[language]}
                                                             </p>
                                                           </div>
                                                       )}

                                                       {/* Service Options */}
                                                       {service.options && service.options.length > 0 ? (
                                                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                             {service.options.map((option) => {
                                                               const isSelected = selectedServices[service.id]?.includes(option.id)
                                                               return (
                                                                   <div
                                                                       key={option.id}
                                                                       className={cn(
                                                                           "service-option flex flex-col p-3 relative rounded-lg border-2 border-transparent hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-200 h-[140px]",
                                                                           isSelected
                                                                               ? "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30"
                                                                               : "bg-gray-50 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/70",
                                                                       )}
                                                                   >
                                                                     {isSelected && (
                                                                         <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                                                                     )}
                                                                     <div className="flex-1 min-h-0">
                                                                       <span className="font-medium text-sm mb-2 line-clamp-1 block">
                                                                         {option.name[language]}
                                                                       </span>
                                                                       <div className="flex items-center mb-3">
                                                                         <Badge
                                                                           className={`text-xs ${getPriceTypeBadge(option.price.type).bgColor} mr-2`}
                                                                         >
                                                                           {getPriceTypeBadge(option.price.type).text}
                                                                         </Badge>
                                                                         <span className="font-medium">{formatPrice(convertPrice(option.price.amount, (option.price.currency || "USD") as Currency), currency)}</span>
                                                                       </div>
                                                                     </div>
                                                                     <div className="flex gap-2 mt-auto">
                                                                       <button
                                                                         type="button"
                                                                         onClick={() => toggleService(service.id, option.id)}
                                                                         className={cn(
                                                                             "flex-1 px-3 py-2 text-xs rounded-md transition-colors",
                                                                             isSelected
                                                                                 ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                                                 : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600",
                                                                         )}
                                                                       >
                                                                         {isSelected ? t("venueBook.selected") : t("venueBook.select")}
                                                                       </button>
                                                                       <button
                                                                         type="button"
                                                                         onClick={() => handleViewOptionDetails(service, option)}
                                                                         className="px-3 py-2 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                                       >
                                                                         <Info className="h-3 w-3" />
                                                                       </button>
                                                                     </div>
                                                                   </div>
                                                               )
                                                             })}
                                                           </div>
                                                       ) : (
                                                           <p className="text-sm text-muted-foreground">
                                                             {t("venueBook.noOptionsAvailable")}
                                                           </p>
                                                       )}
                                                     </div>
                                                 ))}
                                               </div>
                                             </div>
                                         )
                                       })
                                     })()}
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
                   <div ref={firstNameRef} className="space-y-2">
                     <label className="text-sm font-medium" htmlFor="first-name">
                       {t("venueBook.firstName")} <span className="text-red-500">*</span>
                     </label>
                     <Input
                         id="first-name"
                         value={formValues.firstName}
                         onChange={(e) => handleFormChange("firstName", e.target.value)}
                         onBlur={(e) => handleFieldBlur("firstName", e.target.value)}
                         className={cn(
                             "hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                             validationErrors.firstName && touchedFields.firstName
                                 ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                 : "",
                         )}
                         required
                     />
                     {validationErrors.firstName && touchedFields.firstName && (
                         <p className="text-sm text-red-500 flex items-center">
                           <AlertCircle className="h-4 w-4 mr-1" />
                           {validationErrors.firstName}
                         </p>
                     )}
                   </div>

                   <div ref={lastNameRef} className="space-y-2">
                     <label className="text-sm font-medium" htmlFor="last-name">
                       {t("venueBook.lastName")} <span className="text-red-500">*</span>
                     </label>
                     <Input
                         id="last-name"
                         value={formValues.lastName}
                         onChange={(e) => handleFormChange("lastName", e.target.value)}
                         onBlur={(e) => handleFieldBlur("lastName", e.target.value)}
                         className={cn(
                             "hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                             validationErrors.lastName && touchedFields.lastName
                                 ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                 : "",
                         )}
                         required
                     />
                     {validationErrors.lastName && touchedFields.lastName && (
                         <p className="text-sm text-red-500 flex items-center">
                           <AlertCircle className="h-4 w-4 mr-1" />
                           {validationErrors.lastName}
                         </p>
                     )}
                   </div>
                 </div>

                 <div ref={emailRef} className="space-y-2">
                   <label className="text-sm font-medium" htmlFor="email">
                     {t("venueBook.email")} <span className="text-red-500">*</span>
                   </label>
                   <Input
                       id="email"
                       type="email"
                       value={formValues.email}
                       onChange={(e) => handleFormChange("email", e.target.value)}
                       onBlur={(e) => handleFieldBlur("email", e.target.value)}
                       className={cn(
                           "hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                           validationErrors.email && touchedFields.email
                               ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                 : "",
                         )}
                         required
                     />
                     {validationErrors.email && touchedFields.email && (
                         <p className="text-sm text-red-500 flex items-center">
                           <AlertCircle className="h-4 w-4 mr-1" />
                           {validationErrors.email}
                         </p>
                     )}
                   </div>

                 <div ref={phoneRef} className="space-y-2">
                   <label className="text-sm font-medium" htmlFor="phone">
                     {t("venueBook.phone")} <span className="text-red-500">*</span>
                   </label>
                   <div className="flex gap-2">
                     <select
                       value={formValues.phonePrefix}
                       onChange={(e) => handleFormChange("phonePrefix", e.target.value)}
                       className={cn(
                         "h-10 w-32 px-3 py-2 text-sm border border-input bg-background rounded-md ring-offset-background",
                         "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                         "disabled:cursor-not-allowed disabled:opacity-50",
                         "hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                       )}
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
                         onBlur={(e) => handleFieldBlur("phone", e.target.value)}
                         className={cn(
                             "flex-1 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors",
                             validationErrors.phone && touchedFields.phone
                                 ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                                 : "",
                         )}
                         placeholder="69 123 4567"
                         required
                     />
                   </div>
                   {validationErrors.phone && touchedFields.phone && (
                       <p className="text-sm text-red-500 flex items-center">
                         <AlertCircle className="h-4 w-4 mr-1" />
                         {validationErrors.phone}
                       </p>
                   )}
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
                       value={specialRequests}
                       onChange={(e) => setSpecialRequests(e.target.value)}
                       placeholder={t("venueBook.specialRequestsPlaceholder")}
                       className="min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                   />
                 </div>
               </div>
             </form>

             <div className="space-y-6">
               {/* Booking Summary Card */}
               <div className="sticky top-6 venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                   <h2 className="text-xl font-semibold">{t("venueBook.summary")}</h2>

                   <div className="space-y-4">
                       <div className="flex items-start gap-4">
                           <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                               <img
                                   src={venue.media && venue.media.length > 0 ? formatImageUrl(venue.media[0].url) : "/placeholder.svg"}
                                   alt={venue.name[language]}
                                   className="w-full h-full object-cover"
                               />
                           </div>
                           <div className="flex-1 min-w-0">
                               <h3 className="font-medium truncate">{venue.name[language]}</h3>
                               <p className="text-sm text-muted-foreground truncate">
                                   {venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}
                               </p>
                               <div className="flex items-center mt-2">
                                   <Badge className={`${getPriceTypeBadge(venue.price.type).bgColor} mr-2`}>
                                       {getPriceTypeBadge(venue.price.type).text}
                                   </Badge>
                                   <span className="font-medium">{basePrice}</span>
                               </div>
                           </div>
                       </div>

                       <div className="space-y-3 pt-2">
                           <div className="flex items-center text-sm">
                               <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                               <span className="truncate">{startDate ? format(startDate, "PPP") : t("venueBook.date")}</span>
                           </div>

                           <div className="flex items-center text-sm">
                               <Clock className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                               <span className="truncate">
                                   {startDate ? format(startDate, "p") : ""} - {endDate ? format(endDate, "p") : ""}
                                   {duration > 0 && ` (${duration} ${t("venueBook.hours")})`}
                               </span>
                           </div>

                           <div className="flex items-center text-sm">
                               <Users className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
                               <span className="truncate">
                                   {guests} {t("venueBook.guests")}
                               </span>
                           </div>
                       </div>
                   </div>

                   <Button
                       type="submit"
                       disabled={isSubmitting}
                       className="w-full cta-button mt-6 bg-primary hover:bg-primary/90 hover:translate-y-[-2px] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                       onClick={handleSubmit}
                   >
                       {isSubmitting ? (
                           <>
                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                               {t("venueBook.processing")}
                           </>
                       ) : (
                           <>
                               {t("venueBook.continueToBook")} <ArrowRight className="ml-2 h-4 w-4" />
                           </>
                       )}
                   </Button>

                   <p className="text-xs text-muted-foreground text-center mt-4">{t("venueBook.cancellationPolicy")}</p>
               </div>

               {/* Selected Services Summary */}
               {Object.keys(selectedServices).length > 0 && (
                   <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                       <h3 className="font-medium">{t("venueBook.selectedServices")}</h3>
                       <div className="space-y-3">
                           {Object.entries(selectedServices).map(([serviceId, optionIds]) => {
                               const service = services.find((s) => s.id === serviceId)
                               if (!service) return null

                               return optionIds.map(optionId => {
                                   const option = service.options.find((opt) => opt.id === optionId)
                                   if (!option) return null

                                   return (
                                       <div key={`${serviceId}-${optionId}`} className="flex items-center justify-between text-sm">
                                           <div className="flex-1 min-w-0">
                                               <p className="font-medium truncate">{option.name[language]}</p>
                                               <p className="text-muted-foreground text-xs truncate">
                                                   {service.provider.firstName} {service.provider.lastName}
                                               </p>
                                           </div>
                                           <span className="font-medium ml-2">
                                               {formatPrice(convertPrice(option.price.amount, (option.price.currency || "USD") as Currency), currency)}
                                           </span>
                                       </div>
                                   )
                               })
                           })}
                       </div>
                   </div>
               )}

               {/* Pricing Breakdown */}
               <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                   <h3 className="font-medium">{t("venueBook.pricingBreakdown")}</h3>
                   <div className="space-y-3">
                       <div className="flex justify-between text-sm">
                           <span>{t("venueBook.venuePrice")}</span>
                           <span>{basePrice}</span>
                       </div>
                       {Object.keys(selectedServices).length > 0 && (
                           <div className="flex justify-between text-sm">
                               <span>{t("venueBook.servicesPrice")}</span>
                               <span>{servicesCost}</span>
                           </div>
                       )}
                       <div className="border-t pt-3">
                           <div className="flex justify-between font-semibold">
                               <span>{t("venueBook.total")}</span>
                               <span>{total}</span>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
     </div>
   </section>

   {/* Service Option Details Modal */}
   {selectedOptionDetails && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6">
                   <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xl font-semibold">{selectedOptionDetails.option.name[language]}</h3>
                       <Button variant="ghost" size="icon" onClick={closeOptionDetails}>
                           <ArrowLeft className="h-4 w-4" />
                       </Button>
                   </div>

                   {/* Service Images */}
                   {selectedOptionDetails.service.media && selectedOptionDetails.service.media.length > 0 && (
                       <div className="mb-6">
                           <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                               <img
                                   src={formatImageUrl(selectedOptionDetails.service.media[currentImageIndex]?.url) || "/placeholder.svg"}
                                   alt={selectedOptionDetails.option.name[language]}
                                   className="w-full h-full object-cover"
                               />
                               {selectedOptionDetails.service.media.length > 1 && (
                                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                       {selectedOptionDetails.service.media.map((_, index) => (
                                           <button
                                               key={index}
                                               className={cn(
                                                   "w-2 h-2 rounded-full transition-colors",
                                                   index === currentImageIndex ? "bg-white" : "bg-white/50"
                                               )}
                                               onClick={() => setCurrentImageIndex(index)}
                                           />
                                       ))}
                                   </div>
                               )}
                           </div>
                       </div>
                   )}

                   {/* Provider Info */}
                   <div className="flex items-center mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                       <Avatar className="h-10 w-10 mr-3">
                           <AvatarImage
                               src={
                                   selectedOptionDetails.service.provider?.profilePicture
                                       ? formatImageUrl(selectedOptionDetails.service.provider.profilePicture)
                                       : "/placeholder.svg?height=40&width=40"
                               }
                               alt={`${selectedOptionDetails.service.provider?.firstName} ${selectedOptionDetails.service.provider?.lastName}`}
                           />
                           <AvatarFallback>
                               {selectedOptionDetails.service.provider?.firstName?.charAt(0)}
                               {selectedOptionDetails.service.provider?.lastName?.charAt(0)}
                           </AvatarFallback>
                       </Avatar>
                       <div className="flex-1">
                           <h4 className="font-medium">
                               {selectedOptionDetails.service.provider?.firstName} {selectedOptionDetails.service.provider?.lastName}
                           </h4>
                           <p className="text-sm text-muted-foreground">{selectedOptionDetails.service.name[language]}</p>
                       </div>
                       <Button variant="outline" size="sm">
                           <MessageSquare className="h-4 w-4 mr-2" />
                           {t("venueBook.contact")}
                       </Button>
                   </div>

                   {/* Option Details */}
                   <div className="space-y-4">
                       <div>
                           <h4 className="font-medium mb-2">{t("venueBook.description")}</h4>
                           <p className="text-muted-foreground">{selectedOptionDetails.option.description[language]}</p>
                       </div>

                       <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                           <div>
                               <div className="flex items-center mb-2">
                                   <Badge className={`${getPriceTypeBadge(selectedOptionDetails.option.price.type).bgColor} mr-2`}>
                                       {getPriceTypeBadge(selectedOptionDetails.option.price.type).text}
                                   </Badge>
                                   <span className="font-semibold">
                                       {formatPrice(convertPrice(selectedOptionDetails.option.price.amount, (selectedOptionDetails.option.price.currency || "USD") as Currency), currency)}
                                   </span>
                               </div>
                               {selectedOptionDetails.option.metadata && (
                                   <div className="text-sm text-muted-foreground">
                                       {selectedOptionDetails.option.metadata.duration && (
                                           <p>{t("venueBook.duration")}: {selectedOptionDetails.option.metadata.duration} {t("venueBook.hours")}</p>
                                       )}
                                       {selectedOptionDetails.option.metadata.capacity && (
                                           <p>
                                               {t("venueBook.capacity")}: {selectedOptionDetails.option.metadata.capacity.min}-{selectedOptionDetails.option.metadata.capacity.max} {t("venueBook.people")}
                                           </p>
                                       )}
                                   </div>
                               )}
                           </div>
                       </div>

                       {/* Requirements */}
                       {selectedOptionDetails.option.metadata?.requirements && selectedOptionDetails.option.metadata.requirements.length > 0 && (
                           <div>
                               <h4 className="font-medium mb-2">{t("venueBook.requirements")}</h4>
                               <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                   {selectedOptionDetails.option.metadata.requirements.map((requirement: string, index: number) => (
                                       <li key={index}>{requirement}</li>
                                   ))}
                               </ul>
                           </div>
                       )}
                   </div>

                   {/* Action Buttons */}
                   <div className="flex gap-3 mt-6">
                       <Button
                           variant="outline"
                           className="flex-1 bg-transparent"
                           onClick={closeOptionDetails}
                       >
                           {t("common.close")}
                       </Button>
                       <Button
                           className="flex-1 bg-primary hover:bg-primary/90"
                           onClick={() => {
                               toggleService(selectedOptionDetails.service.id, selectedOptionDetails.option.id)
                               closeOptionDetails()
                           }}
                       >
                           {selectedServices[selectedOptionDetails.service.id]?.includes(selectedOptionDetails.option.id)
                               ? t("venueBook.removeService")
                               : t("venueBook.addService")}
                       </Button>
                   </div>
               </div>
           </div>
       </div>
   )}

   {/* Confirmation Modal */}
   {showConfirmationModal && confirmationData && (
       <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
           <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="p-6">
                   <div className="flex items-center justify-between mb-6">
                       <h3 className="text-xl font-semibold">{t("venueBook.confirmBooking")}</h3>
                       <Button variant="ghost" size="icon" onClick={() => setShowConfirmationModal(false)}>
                           <ArrowLeft className="h-4 w-4" />
                       </Button>
                   </div>

                   {/* Booking Summary */}
                   <div className="space-y-6">
                       {/* Venue Details */}
                       <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                           <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                               <img
                                   src={venue.media && venue.media.length > 0 ? formatImageUrl(venue.media[0].url) : "/placeholder.svg"}
                                   alt={venue.name[language]}
                                   className="w-full h-full object-cover"
                               />
                           </div>
                           <div className="flex-1">
                               <h4 className="font-medium">{venue.name[language]}</h4>
                               <p className="text-sm text-muted-foreground">
                                   {venue.address ? `${venue.address.city}, ${venue.address.country}` : ""}
                               </p>
                               <div className="flex items-center mt-2 text-sm">
                                   <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                                   <span>{startDate ? format(startDate, "PPP") : ""}</span>
                               </div>
                               <div className="flex items-center mt-1 text-sm">
                                   <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                                   <span>
                                       {startDate ? format(startDate, "p") : ""} - {endDate ? format(endDate, "p") : ""}
                                   </span>
                               </div>
                               <div className="flex items-center mt-1 text-sm">
                                   <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                                   <span>{guests} {t("venueBook.guests")}</span>
                               </div>
                           </div>
                       </div>

                       {/* Contact Information */}
                       <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                           <h4 className="font-medium mb-3">{t("venueBook.contactInformation")}</h4>
                           <div className="grid grid-cols-2 gap-4 text-sm">
                               <div>
                                   <span className="text-muted-foreground">{t("venueBook.name")}:</span>
                                   <p className="font-medium">{formValues.firstName} {formValues.lastName}</p>
                               </div>
                               <div>
                                   <span className="text-muted-foreground">{t("venueBook.email")}:</span>
                                   <p className="font-medium">{formValues.email}</p>
                               </div>
                               <div>
                                   <span className="text-muted-foreground">{t("venueBook.phone")}:</span>
                                   <p className="font-medium">{formValues.phonePrefix}{formValues.phone}</p>
                               </div>
                               <div>
                                   <span className="text-muted-foreground">{t("venueBook.eventType")}:</span>
                                   <p className="font-medium">{t(`venueBook.${eventType}`)}</p>
                               </div>
                           </div>
                       </div>

                       {/* Selected Services */}
                       {Object.keys(selectedServices).length > 0 && (
                           <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                               <h4 className="font-medium mb-3">{t("venueBook.selectedServices")}</h4>
                               <div className="space-y-2">
                                   {Object.entries(selectedServices).map(([serviceId, optionIds]) => {
                                       const service = services.find((s) => s.id === serviceId)
                                       if (!service) return null

                                       return optionIds.map(optionId => {
                                           const option = service.options.find((opt) => opt.id === optionId)
                                           if (!option) return null

                                           return (
                                               <div key={`${serviceId}-${optionId}`} className="flex justify-between text-sm">
                                                   <span>{option.name[language]}</span>
                                                   <span className="font-medium">
                                                       {formatPrice(convertPrice(option.price.amount, (option.price.currency || "USD") as Currency), currency)}
                                                   </span>
                                               </div>
                                           )
                                       })
                                   })}
                               </div>
                           </div>
                       )}

                       {/* Special Requests */}
                       {specialRequests && (
                           <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                               <h4 className="font-medium mb-2">{t("venueBook.specialRequests")}</h4>
                               <p className="text-sm text-muted-foreground">{specialRequests}</p>
                           </div>
                       )}

                       {/* Final Pricing */}
                       <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                           <h4 className="font-medium mb-3">{t("venueBook.finalPricing")}</h4>
                           <div className="space-y-2 text-sm">
                               <div className="flex justify-between">
                                   <span>{t("venueBook.venuePrice")}</span>
                                   <span>{basePrice}</span>
                               </div>
                               {Object.keys(selectedServices).length > 0 && (
                                   <div className="flex justify-between">
                                       <span>{t("venueBook.servicesPrice")}</span>
                                       <span>{servicesCost}</span>
                                   </div>
                               )}
                               <div className="border-t border-primary/20 pt-2 mt-2">
                                   <div className="flex justify-between font-semibold text-base">
                                       <span>{t("venueBook.total")}</span>
                                       <span>{total}</span>
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex gap-3 mt-6">
                       <Button
                           variant="outline"
                           className="flex-1 bg-transparent"
                           onClick={() => setShowConfirmationModal(false)}
                           disabled={isSubmitting}
                       >
                           {t("common.cancel")}
                       </Button>
                       <Button
                           className="flex-1 bg-primary hover:bg-primary/90"
                           onClick={handleConfirmBooking}
                           disabled={isSubmitting}
                       >
                           {isSubmitting ? (
                               <>
                                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                   {t("venueBook.processing")}
                               </>
                           ) : (
                               <>
                                   {t("venueBook.confirmAndPay")}
                                   <ArrowRight className="ml-2 h-4 w-4" />
                               </>
                           )}
                       </Button>
                   </div>
               </div>
           </div>
       </div>
   )}

   {/* Custom Styles */}
   <style jsx>{scrollbarStyles}</style>
 </>
)\
}
