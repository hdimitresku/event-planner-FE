"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { EditBookingModal } from "../../components/business/edit-booking-modal"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Calendar,
  Check,
  Clock,
  Search,
  X,
  User,
  Users,
  DollarSign,
  CalendarDays,
  Phone,
  Mail,
  PencilLine,
  AlertTriangle,
  Utensils,
  Car,
  Music,
  Palette,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  SlidersHorizontal,
  MapPin,
  CircleDot,
  Shield,
  Video,
  Camera,
  Drama,
  Star,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { toast } from "../../components/ui/use-toast"
import * as bookingService from "../../services/bookingService"
import { BookingStatus } from "@/models/booking"
import { LoadingSpinner } from "../../components/ui/loading-spinner"
import { DialogTrigger } from "../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Checkbox } from "../../components/ui/checkbox"
import type { ServiceType } from "@/models"
import { iconMap } from "@/services"
import { format } from "date-fns"
// Helper function to get the appropriate icon based on service type
const iconComponents: Record<string, React.ElementType> = {
  Utensils,
  Music,
  Palette,
  Camera,
  Video,
  Car,
  Shield,
  Users,
  Drama,
  CircleDot,
}

const getServiceIcon = (type: string, iconName?: string) => {
  const SelectedIcon =
      (iconName && iconComponents[iconName]) || iconComponents[iconMap[type as ServiceType]] || Utensils

  return <SelectedIcon className="h-8 w-8 text-primary" />
}

// Helper function to calculate service price for this specific service only
const calculateServicePrice = (booking: any) => {
  if (!booking.serviceOptions || booking.serviceOptions.length === 0) {
    return { serviceTotal: 0, priceType: "FIXED" }
  }
  let priceType = "FIXED"
  let basePrice = 0

  // Filter service options to only include the current service
  const currentServiceOptions = booking.serviceOptions.filter((option: any) => option.service?.id === booking.serviceId)

  let serviceTotal = 0
  currentServiceOptions.forEach((option: any) => {
    if (option.price?.type === "perPerson") {
      serviceTotal += option.price.amount * booking.numberOfGuests
      priceType = "perPerson"
      basePrice = option.price.amount
    } else if (option.price?.type === "perHour") {
      serviceTotal += option.price?.amount * (booking.endTime - booking.startTime)
      priceType = "perHour"
      basePrice = option.price?.amount
    } else {
      serviceTotal += option.price?.amount || 0
    }
  })

  return { serviceTotal, priceType: priceType, basePrice: basePrice }
}

// Helper function to get service status from metadata options
const getServiceStatus = (booking: any) => {
  if (booking?.metadata?.options && Array.isArray(booking.metadata.options)) {
    // Find the option that matches this service
    const serviceOption = booking.metadata.options.find(
        (option: any) => option.service?.id === booking.serviceId || option.serviceId === booking.serviceId,
    )
    return serviceOption?.status || null
  }
  return null
}

type SortOption = {
  field: string
  direction: "asc" | "desc"
}

type FilterOptions = {
  serviceTypes: string[]
  statuses: string[]
  priceRange: {
    min?: number
    max?: number
  }
  guestCount: {
    min?: number
    max?: number
  }
}

export default function ServiceBookingsPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [bookingToDecline, setBookingToDecline] = useState<any | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "decline"
    booking: any
  } | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [services, setServices] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string
    endDate?: string
  }>({})
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false)
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>({ field: "startDate", direction: "desc" })
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    serviceTypes: [],
    statuses: [],
    priceRange: {},
    guestCount: {},
  })

  // Get unique service types from bookings
  const uniqueServiceTypes = [...new Set(bookings.map((booking) => booking.serviceType))].filter(Boolean)

  // Get unique statuses from bookings
  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))].filter(Boolean)

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "dd/MM")
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString: string) => {
    try {
      return timeString.slice(0, 5)
    } catch (error) {
      return timeString
    }
  }


  // Fetch service bookings
  const fetchServiceBookings = async () => {
    try {
      setLoading(true)
      setError(null)
      const serviceData = await bookingService.getServiceBookings()

      // Store the services
      if (serviceData) {
        setServices(serviceData)

        // Extract all bookings from all services
        const allBookings: any[] = []
        if (Array.isArray(serviceData)) {
          serviceData.forEach((service: any) => {
            if (service.bookings && service.bookings.length > 0) {
              service.bookings.forEach((booking: any) => {
                // Enhance booking with service information
                const enhancedBooking = {
                  ...booking,
                  serviceId: service.id,
                  serviceName: service.name,
                  serviceType: service.type,
                  serviceIcon: service.icon,
                  // Extract customer info from metadata if available
                  customer: {
                    name: booking.metadata?.contactDetails
                        ? `${booking.metadata.contactDetails.firstName || ""} ${booking.metadata.contactDetails.lastName || ""}`.trim()
                        : "Unknown Customer",
                    email: booking.metadata?.contactDetails?.email || "",
                    phone: booking.metadata?.contactDetails?.phone || "",
                  },
                }

                // Calculate service price
                const servicePrice = calculateServicePrice(enhancedBooking)
                enhancedBooking.calculatedPrice = servicePrice.serviceTotal

                allBookings.push(enhancedBooking)
              })
            }
          })
        }

        setBookings(allBookings)
      }
    } catch (err: any) {
      console.error("Error fetching service bookings:", err)
      setError(err.message || "Failed to fetch service bookings")
      toast({
        title: t("common.error") || "Error",
        description: err.message || "Failed to fetch service bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServiceBookings()
  }, [])

  // Apply search filter
  const applySearchFilter = (booking: any, searchTerm: string) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()

    // Search in customer details
    const customerName = booking.customer?.name?.toLowerCase() || ""
    const customerEmail = booking.customer?.email?.toLowerCase() || ""
    const customerPhone = booking.customer?.phone?.toLowerCase() || ""

    // Search in service details
    const serviceName = (booking.serviceName?.[language] || booking.serviceName?.en || "").toLowerCase()
    const serviceType = (booking.serviceType || "").toLowerCase()

    // Search in booking details
    const bookingId = booking.id?.toLowerCase() || ""
    const eventType = (booking.eventType || "").toLowerCase()
    const startDate = booking.startDate || ""
    const startTime = booking.startTime || ""
    const endTime = booking.endTime || ""
    const guestCount = String(booking.numberOfGuests || "")
    const status = (booking.status || "").toLowerCase()
    const price = String(calculateServicePrice(booking).serviceTotal || "")

    // Check if search term is in any of these fields
    return (
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        customerPhone.includes(searchLower) ||
        serviceName.includes(searchLower) ||
        serviceType.includes(searchLower) ||
        bookingId.includes(searchLower) ||
        eventType.includes(searchLower) ||
        startDate.includes(searchLower) ||
        startTime.includes(searchLower) ||
        endTime.includes(searchLower) ||
        guestCount.includes(searchLower) ||
        status.includes(searchLower) ||
        price.includes(searchLower)
    )
  }

  // Apply date filter
  const applyDateFilter = (booking: any, dateFilter: { startDate?: string; endDate?: string }) => {
    if (!dateFilter.startDate && !dateFilter.endDate) return true

    const bookingDate = new Date(booking.startDate)

    if (dateFilter.startDate) {
      const filterStartDate = new Date(dateFilter.startDate)
      if (bookingDate < filterStartDate) {
        return false
      }
    }

    if (dateFilter.endDate) {
      const filterEndDate = new Date(dateFilter.endDate)
      filterEndDate.setHours(23, 59, 59, 999) // Include the entire end date
      if (bookingDate > filterEndDate) {
        return false
      }
    }

    return true
  }

  // Apply advanced filters
  const applyAdvancedFilters = (booking: any, filters: FilterOptions) => {
    // Filter by service type
    if (filters.serviceTypes.length > 0 && !filters.serviceTypes.includes(booking.serviceType)) {
      return false
    }

    // Filter by status
    if (filters.statuses.length > 0 && !filters.statuses.includes(booking.status)) {
      return false
    }

    // Filter by price range
    const price = calculateServicePrice(booking).serviceTotal
    if (filters.priceRange.min !== undefined && price < filters.priceRange.min) {
      return false
    }
    if (filters.priceRange.max !== undefined && price > filters.priceRange.max) {
      return false
    }

    // Filter by guest count
    const guestCount = booking.numberOfGuests || 0
    if (filters.guestCount.min !== undefined && guestCount < filters.guestCount.min) {
      return false
    }
    if (filters.guestCount.max !== undefined && guestCount > filters.guestCount.max) {
      return false
    }

    return true
  }

  // Apply tab filter
  const applyTabFilter = (booking: any, activeTab: string) => {
    const bookingDate = new Date(booking.startDate).toISOString().split("T")[0]
    const today = new Date().toISOString().split("T")[0]
    const serviceStatus = getServiceStatus(booking)

    if (activeTab === "upcoming") {
      // Exclude cancelled/rejected services from upcoming
      if (serviceStatus === "rejected" || serviceStatus === "cancelled") {
        return false
      }
      // Only show confirmed or pending bookings that are today or in the future
      if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.PENDING) {
        return false
      }
      if (bookingDate < today) {
        return false
      }
      return true
    } else if (activeTab === "completed") {
      // Only show completed bookings, regardless of service status
      return booking.status === BookingStatus.COMPLETED
    } else if (activeTab === "cancelled") {
      // Show all bookings with cancelled/rejected services OR cancelled booking status
      return serviceStatus === "rejected" || serviceStatus === "cancelled" || booking.status === BookingStatus.CANCELLED
    }

    return true // "all" tab shows everything
  }

  // Sort bookings
  const sortBookings = (bookings: any[], sortOption: SortOption) => {
    return [...bookings].sort((a, b) => {
      let valueA, valueB

      switch (sortOption.field) {
        case "startDate":
          valueA = new Date(a.startDate).getTime()
          valueB = new Date(b.startDate).getTime()
          break
        case "price":
          valueA = calculateServicePrice(a).serviceTotal
          valueB = calculateServicePrice(b).serviceTotal
          break
        case "customerName":
          valueA = a.customer?.name?.toLowerCase() || ""
          valueB = b.customer?.name?.toLowerCase() || ""
          break
        case "guestCount":
          valueA = a.numberOfGuests || 0
          valueB = b.numberOfGuests || 0
          break
        default:
          valueA = a[sortOption.field]
          valueB = b[sortOption.field]
      }

      // Handle undefined values
      if (valueA === undefined)
        valueA = sortOption.direction === "asc" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER
      if (valueB === undefined)
        valueB = sortOption.direction === "asc" ? Number.MIN_SAFE_INTEGER : Number.MAX_SAFE_INTEGER

      // Sort direction
      const direction = sortOption.direction === "asc" ? 1 : -1

      // Compare
      if (valueA < valueB) return -1 * direction
      if (valueA > valueB) return 1 * direction
      return 0
    })
  }

  // Apply all filters and sorting
  const filteredBookings = sortBookings(
      bookings.filter(
          (booking) =>
              applySearchFilter(booking, searchTerm) &&
              applyDateFilter(booking, dateFilter) &&
              applyAdvancedFilters(booking, filterOptions) &&
              applyTabFilter(booking, activeTab),
      ),
      sortOption,
  )

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsViewModalOpen(true)
  }

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsEditModalOpen(true)
  }

  const handleSaveBooking = (updatedBooking: any) => {
    toast({
      title: t("business.bookings.bookingUpdated") || "Booking Updated",
      description:
          t("business.bookings.bookingUpdatedDescription") || "The service booking has been successfully updated.",
      variant: "default",
    })

    setIsEditModalOpen(false)
    // Refresh data after successful update
    fetchServiceBookings()
  }

  const openCancelDialog = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setIsCancelModalOpen(true)
  }

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return

    try {
      await bookingService.updateBookingVenueStatus(bookingToCancel, BookingStatus.CANCELLED)

      toast({
        title: t("business.bookings.bookingCancelled") || "Booking Cancelled",
        description: t("business.bookings.bookingCancelledDescription") || "The service booking has been cancelled.",
        variant: "default",
      })

      // Refresh data after successful cancellation
      fetchServiceBookings()
    } catch (error: any) {
      console.error("Error cancelling booking:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelModalOpen(false)
      setBookingToCancel(null)
    }
  }

  const openDeclineDialog = (booking: any) => {
    setBookingToDecline(booking)
    setRejectionReason("")
    setIsDeclineModalOpen(true)
  }

  const openApproveConfirmation = (booking: any) => {
    setConfirmAction({ type: "approve", booking })
  }

  const openDeclineConfirmation = (booking: any) => {
    setConfirmAction({ type: "decline", booking })
    setRejectionReason("")
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    setActionLoading(confirmAction.booking.id)
    try {
      if (confirmAction.type === "approve") {
        const result = await bookingService.updateBookingServiceStatus(
            confirmAction.booking.id,
            confirmAction.booking.serviceId,
            BookingStatus.CONFIRMED,
        )

        if (result.success) {
          toast({
            title: t("business.serviceBookings.serviceApproved") || "Service Approved",
            description:
                t("business.serviceBookings.serviceApprovedDescription") ||
                "The service booking has been successfully approved.",
          })
        } else {
          throw new Error(result.error || "Failed to approve service booking")
        }
      } else {
        const result = await bookingService.updateBookingServiceStatus(
            confirmAction.booking.id,
            confirmAction.booking.serviceId,
            BookingStatus.CANCELLED,
            rejectionReason,
        )

        if (result.success) {
          toast({
            title: t("business.serviceBookings.serviceDeclined") || "Service Declined",
            description:
                t("business.serviceBookings.serviceDeclinedDescription") || "The service booking has been declined.",
          })
        } else {
          throw new Error(result.error || "Failed to decline service booking")
        }
      }

      // Refresh service bookings data
      await fetchServiceBookings()
      setIsViewModalOpen(false)
    } catch (error: any) {
      console.error("Error updating service booking:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to update service booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
      setRejectionReason("")
    }
  }

  const handleApproveBooking = async (booking: any) => {
    try {
      const result = await bookingService.updateBookingServiceStatus(
          booking.id,
          booking.serviceId,
          BookingStatus.CONFIRMED,
      )

      if (result.success) {
        // Update local state - find and update the specific service option
        setBookings((prev) =>
            prev.map((b) => {
              if (b.id === booking.id) {
                const updatedMetadata = { ...b.metadata }
                if (updatedMetadata.options && Array.isArray(updatedMetadata.options)) {
                  updatedMetadata.options = updatedMetadata.options.map((option: any) => {
                    if (option.service?.id === booking.serviceId || option.serviceId === booking.serviceId) {
                      return { ...option, status: "confirmed" }
                    }
                    return option
                  })
                }
                return { ...b, metadata: updatedMetadata }
              }
              return b
            }),
        )

        setIsViewModalOpen(false)
        toast({
          title: t("business.serviceBookings.serviceApproved") || "Service Approved",
          description:
              t("business.serviceBookings.serviceApprovedDescription") ||
              "The service booking has been successfully approved.",
        })

        // Refresh data after successful approval
        fetchServiceBookings()
      } else {
        throw new Error(result.error || "Failed to approve service booking")
      }
    } catch (error: any) {
      console.error("Error approving service booking:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to approve service booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineBooking = async () => {
    if (!bookingToDecline) return

    setActionLoading(bookingToDecline.id)
    try {
      const result = await bookingService.updateBookingServiceStatus(
          bookingToDecline.id,
          bookingToDecline.serviceId,
          BookingStatus.CANCELLED,
          rejectionReason,
      )

      if (result.success) {
        // Update local state - find and update the specific service option
        setBookings((prev) =>
            prev.map((b) => {
              if (b.id === bookingToDecline.id) {
                const updatedMetadata = { ...b.metadata }
                if (updatedMetadata.options && Array.isArray(updatedMetadata.options)) {
                  updatedMetadata.options = updatedMetadata.options.map((option: any) => {
                    if (
                        option.service?.id === bookingToDecline.serviceId ||
                        option.serviceId === bookingToDecline.serviceId
                    ) {
                      return { ...option, status: "rejected", rejectionReason }
                    }
                    return option
                  })
                }
                return { ...b, metadata: updatedMetadata }
              }
              return b
            }),
        )

        toast({
          title: t("business.serviceBookings.serviceDeclined") || "Service Declined",
          description:
              t("business.serviceBookings.serviceDeclinedDescription") || "The service booking has been declined.",
        })

        // Refresh data after successful decline
        fetchServiceBookings()
      } else {
        throw new Error(result.error || "Failed to decline service booking")
      }
    } catch (error: any) {
      console.error("Error declining service booking:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to decline service booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setIsDeclineModalOpen(false)
      setBookingToDecline(null)
      setIsViewModalOpen(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/90 dark:bg-emerald-600/90 text-white hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70"
      case "pending":
        return "bg-orange-500/90 dark:bg-orange-600/90 text-white hover:bg-orange-500/70 dark:hover:bg-orange-600/70"
      case "completed":
        return "bg-blue-500/90 dark:bg-blue-600/90 text-white hover:bg-blue-500/70 dark:hover:bg-blue-600/70"
      case "cancelled":
        return "bg-red-500/90 dark:bg-red-600/90 text-white hover:bg-red-500/70 dark:hover:bg-red-600/70"
      default:
        return "bg-gray-500/90 dark:bg-gray-600/90 text-white hover:bg-gray-500/70 dark:hover:bg-gray-600/70"
    }
  }

  const getServiceStatusBadge = (serviceStatus: string | null) => {
    if (!serviceStatus) return null

    switch (serviceStatus) {
      case "accepted":
      case "confirmed":
        return (
            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">
              <CheckCircle className="mr-1 h-3 w-3" />
              {t("business.serviceBookings.serviceApproved") || "Service Approved"}
            </Badge>
        )
      case "rejected":
      case "cancelled":
        return (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">
              <XCircle className="mr-1 h-3 w-3" />
              {t("business.serviceBookings.serviceDeclined") || "Service Declined"}
            </Badge>
        )
      case "pending":
        return (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {t("business.serviceBookings.servicePending") || "Service Pending"}
            </Badge>
        )
      default:
        return <Badge variant="outline">{serviceStatus}</Badge>
    }
  }

  // Group bookings by service for the overview section
  const bookingsByService = services.map((service) => {
    const serviceBookings = bookings.filter((booking) => booking.serviceId === service.id)
    const pendingCount = serviceBookings.filter((b) => b.status === "pending").length
    const confirmedCount = serviceBookings.filter((b) => b.status === "confirmed").length
    const totalCount = serviceBookings.length

    return {
      service,
      pendingCount,
      confirmedCount,
      totalCount,
    }
  })

  const getPriceTypeDisplay = (priceType: string) => {
    if (!priceType) return t("business.serviceNew.fixed") || "Fixed Rate"

    const type = priceType.toUpperCase()
    if (type === "PER_PERSON" || type === "PERPERSON") {
      return t("business.serviceNew.perPerson") || "Per Person"
    } else if (type === "PER_HOUR" || type === "PERHOUR") {
      return t("business.serviceNew.perHour") || "Per Hour"
    }
    return t("business.serviceNew.fixed") || "Fixed Rate"
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    if (dateFilter.startDate || dateFilter.endDate) count++
    if (filterOptions.serviceTypes.length > 0) count++
    if (filterOptions.statuses.length > 0) count++
    if (filterOptions.priceRange.min !== undefined || filterOptions.priceRange.max !== undefined) count++
    if (filterOptions.guestCount.min !== undefined || filterOptions.guestCount.max !== undefined) count++
    return count
  }

  // Reset all filters
  const resetAllFilters = () => {
    setSearchTerm("")
    setDateFilter({})
    setFilterOptions({
      serviceTypes: [],
      statuses: [],
      priceRange: {},
      guestCount: {},
    })
    setSortOption({ field: "startDate", direction: "desc" })
  }

  if (error) {
    return (
        <BusinessLayout>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("common.error") || "Error"}</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchServiceBookings}>{t("common.retry") || "Try Again"}</Button>
            </div>
          </div>
        </BusinessLayout>
    )
  }

  return (
      <BusinessLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("business.serviceBookings.title") || "Service Bookings"}
          </h1>
          <p className="text-muted-foreground">
            {t("business.serviceBookings.subtitle") || "Manage your service bookings"}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={t("business.serviceBookings.searchBookings") || "Search service bookings..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {t("business.bookings.sort") || "Sort"}
                  {sortOption.field !== "startDate" && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                        {sortOption.field === "price"
                            ? t("business.bookings.price") || "Price"
                            : sortOption.field === "customerName"
                                ? t("business.bookings.customer") || "Customer"
                                : sortOption.field === "guestCount"
                                    ? t("business.bookings.guests") || "Guests"
                                    : sortOption.field}{" "}
                        {sortOption.direction === "asc" ? "↑" : "↓"}
                      </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t("business.bookings.sortBy") || "Sort by"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "startDate", direction: "desc" })}
                    className={sortOption.field === "startDate" && sortOption.direction === "desc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.dateNewest") || "Date (newest first)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "startDate", direction: "asc" })}
                    className={sortOption.field === "startDate" && sortOption.direction === "asc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.dateOldest") || "Date (oldest first)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "price", direction: "desc" })}
                    className={sortOption.field === "price" && sortOption.direction === "desc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.priceHighest") || "Price (highest first)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "price", direction: "asc" })}
                    className={sortOption.field === "price" && sortOption.direction === "asc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.priceLowest") || "Price (lowest first)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "customerName", direction: "asc" })}
                    className={sortOption.field === "customerName" && sortOption.direction === "asc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.customerAZ") || "Customer (A-Z)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "customerName", direction: "desc" })}
                    className={sortOption.field === "customerName" && sortOption.direction === "desc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.customerZA") || "Customer (Z-A)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "guestCount", direction: "desc" })}
                    className={sortOption.field === "guestCount" && sortOption.direction === "desc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.guestsHighest") || "Guests (highest first)"}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setSortOption({ field: "guestCount", direction: "asc" })}
                    className={sortOption.field === "guestCount" && sortOption.direction === "asc" ? "bg-secondary" : ""}
                >
                  {t("business.bookings.guestsLowest") || "Guests (lowest first)"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter */}
            <Dialog open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("business.bookings.filterByDate") || "Filter by Date"}
                  {(dateFilter.startDate || dateFilter.endDate) && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                        {dateFilter.startDate && dateFilter.endDate
                            ? `${new Date(dateFilter.startDate).toLocaleDateString()} - ${new Date(dateFilter.endDate).toLocaleDateString()}`
                            : dateFilter.startDate
                                ? `From ${new Date(dateFilter.startDate).toLocaleDateString()}`
                                : `Until ${new Date(dateFilter.endDate!).toLocaleDateString()}`}
                      </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{t("business.bookings.filterByDate") || "Filter by Date"}</DialogTitle>
                  <DialogDescription>
                    {t("business.bookings.filterByDateDescription") || "Select a date range to filter bookings"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="start-date" className="text-sm font-medium">
                      {t("business.bookings.startDate") || "Start Date"}
                    </label>
                    <Input
                        id="start-date"
                        type="date"
                        value={dateFilter.startDate || ""}
                        onChange={(e) => setDateFilter((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="end-date" className="text-sm font-medium">
                      {t("business.bookings.endDate") || "End Date"}
                    </label>
                    <Input
                        id="end-date"
                        type="date"
                        value={dateFilter.endDate || ""}
                        onChange={(e) => setDateFilter((prev) => ({ ...prev, endDate: e.target.value }))}
                        min={dateFilter.startDate || undefined}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                      variant="outline"
                      onClick={() => {
                        setDateFilter({})
                        setIsDateFilterOpen(false)
                      }}
                  >
                    {t("business.common.clear") || "Clear"}
                  </Button>
                  <Button onClick={() => setIsDateFilterOpen(false)}>{t("business.common.apply") || "Apply"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Advanced Filter */}
            <Dialog open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t("business.bookings.advancedFilters") || "Filters"}
                  {countActiveFilters() > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                        {countActiveFilters()}
                      </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t("business.bookings.advancedFilters") || "Advanced Filters"}</DialogTitle>
                  <DialogDescription>
                    {t("business.bookings.advancedFiltersDescription") || "Filter bookings by multiple criteria"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  {/* Service Type Filter */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("business.bookings.serviceType") || "Service Type"}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueServiceTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={`service-type-${type}`}
                                checked={filterOptions.serviceTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  setFilterOptions((prev) => ({
                                    ...prev,
                                    serviceTypes: checked
                                        ? [...prev.serviceTypes, type]
                                        : prev.serviceTypes.filter((t) => t !== type),
                                  }))
                                }}
                            />
                            <label
                                htmlFor={`service-type-${type}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("business.bookings.status") || "Status"}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueStatuses.map((status) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                                id={`status-${status}`}
                                checked={filterOptions.statuses.includes(status)}
                                onCheckedChange={(checked) => {
                                  setFilterOptions((prev) => ({
                                    ...prev,
                                    statuses: checked
                                        ? [...prev.statuses, status]
                                        : prev.statuses.filter((s) => s !== status),
                                  }))
                                }}
                            />
                            <label
                                htmlFor={`status-${status}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </label>
                          </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("business.bookings.priceRange") || "Price Range"}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="min-price" className="text-xs text-muted-foreground">
                          {t("business.bookings.minPrice") || "Min Price"}
                        </label>
                        <Input
                            id="min-price"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={filterOptions.priceRange.min || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : undefined
                              setFilterOptions((prev) => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, min: value },
                              }))
                            }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="max-price" className="text-xs text-muted-foreground">
                          {t("business.bookings.maxPrice") || "Max Price"}
                        </label>
                        <Input
                            id="max-price"
                            type="number"
                            min="0"
                            placeholder="1000"
                            value={filterOptions.priceRange.max || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : undefined
                              setFilterOptions((prev) => ({
                                ...prev,
                                priceRange: { ...prev.priceRange, max: value },
                              }))
                            }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest Count Filter */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("business.bookings.guestCount") || "Guest Count"}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="min-guests" className="text-xs text-muted-foreground">
                          {t("business.bookings.minGuests") || "Min Guests"}
                        </label>
                        <Input
                            id="min-guests"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={filterOptions.guestCount.min || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : undefined
                              setFilterOptions((prev) => ({
                                ...prev,
                                guestCount: { ...prev.guestCount, min: value },
                              }))
                            }}
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="max-guests" className="text-xs text-muted-foreground">
                          {t("business.bookings.maxGuests") || "Max Guests"}
                        </label>
                        <Input
                            id="max-guests"
                            type="number"
                            min="0"
                            placeholder="100"
                            value={filterOptions.guestCount.max || ""}
                            onChange={(e) => {
                              const value = e.target.value ? Number(e.target.value) : undefined
                              setFilterOptions((prev) => ({
                                ...prev,
                                guestCount: { ...prev.guestCount, max: value },
                              }))
                            }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                      variant="outline"
                      onClick={() => {
                        setFilterOptions({
                          serviceTypes: [],
                          statuses: [],
                          priceRange: {},
                          guestCount: {},
                        })
                        setIsAdvancedFilterOpen(false)
                      }}
                  >
                    {t("business.common.clear") || "Clear"}
                  </Button>
                  <Button onClick={() => setIsAdvancedFilterOpen(false)}>{t("business.common.apply") || "Apply"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary">
              <Clock className="mr-2 h-4 w-4" />
              {t("business.bookings.export") || "Export"}
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm ||
            dateFilter.startDate ||
            dateFilter.endDate ||
            countActiveFilters() > 0 ||
            sortOption.field !== "startDate") && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">{t("business.bookings.activeFilters") || "Active filters:"}</span>

              {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.search") || "Search"}: {searchTerm}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
              )}

              {(dateFilter.startDate || dateFilter.endDate) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.date") || "Date"}:
                    {dateFilter.startDate && dateFilter.endDate
                        ? `${new Date(dateFilter.startDate).toLocaleDateString()} - ${new Date(dateFilter.endDate).toLocaleDateString()}`
                        : dateFilter.startDate
                            ? `From ${new Date(dateFilter.startDate).toLocaleDateString()}`
                            : `Until ${new Date(dateFilter.endDate!).toLocaleDateString()}`}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setDateFilter({})} />
                  </Badge>
              )}

              {filterOptions.serviceTypes.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.serviceTypes") || "Service Types"}: {filterOptions.serviceTypes.length}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterOptions((prev) => ({ ...prev, serviceTypes: [] }))}
                    />
                  </Badge>
              )}

              {filterOptions.statuses.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.statuses") || "Statuses"}: {filterOptions.statuses.length}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterOptions((prev) => ({ ...prev, statuses: [] }))}
                    />
                  </Badge>
              )}

              {(filterOptions.priceRange.min !== undefined || filterOptions.priceRange.max !== undefined) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.price") || "Price"}:
                    {filterOptions.priceRange.min !== undefined && filterOptions.priceRange.max !== undefined
                        ? `$${filterOptions.priceRange.min} - $${filterOptions.priceRange.max}`
                        : filterOptions.priceRange.min !== undefined
                            ? `Min $${filterOptions.priceRange.min}`
                            : `Max $${filterOptions.priceRange.max}`}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterOptions((prev) => ({ ...prev, priceRange: {} }))}
                    />
                  </Badge>
              )}

              {(filterOptions.guestCount.min !== undefined || filterOptions.guestCount.max !== undefined) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.guests") || "Guests"}:
                    {filterOptions.guestCount.min !== undefined && filterOptions.guestCount.max !== undefined
                        ? `${filterOptions.guestCount.min} - ${filterOptions.guestCount.max}`
                        : filterOptions.guestCount.min !== undefined
                            ? `Min ${filterOptions.guestCount.min}`
                            : `Max ${filterOptions.guestCount.max}`}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterOptions((prev) => ({ ...prev, guestCount: {} }))}
                    />
                  </Badge>
              )}

              {sortOption.field !== "startDate" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.sortedBy") || "Sorted by"}:
                    {sortOption.field === "price"
                        ? t("business.bookings.price") || "Price"
                        : sortOption.field === "customerName"
                            ? t("business.bookings.customer") || "Customer"
                            : sortOption.field === "guestCount"
                                ? t("business.bookings.guests") || "Guests"
                                : sortOption.field}{" "}
                    {sortOption.direction === "asc" ? "↑" : "↓"}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSortOption({ field: "startDate", direction: "desc" })}
                    />
                  </Badge>
              )}

              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetAllFilters}>
                {t("business.bookings.clearAll") || "Clear all"}
              </Button>
            </div>
        )}

        {/* Services Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {t("business.serviceBookings.servicesOverview") || "Bookings by Service"}
          </h2>
          {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <LoadingSpinner size="lg" text="Loading services..." className="col-span-full py-8" />
              </div>
          ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {bookingsByService.map(({ service, pendingCount, confirmedCount, totalCount }) => (
                    <div key={service.id} className="bg-background border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        {getServiceIcon(service.type, service.icon)}
                        <h3 className="font-medium text-lg">{service.name[language] || service.name.en}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {service.description?.[language] || service.description?.en || "Service description"}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-lg font-semibold text-primary">{totalCount}</div>
                          <div className="text-xs text-muted-foreground">Total</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-warning">{pendingCount}</div>
                          <div className="text-xs text-muted-foreground">Pending</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-success">{confirmedCount}</div>
                          <div className="text-xs text-muted-foreground">Confirmed</div>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {confirmAction?.type === "approve"
                    ? t("business.serviceBookings.confirmApprove") || "Confirm Service Approval"
                    : t("business.serviceBookings.confirmDecline") || "Confirm Service Decline"}
              </DialogTitle>
              <DialogDescription>
                {confirmAction?.type === "approve"
                    ? t("business.serviceBookings.confirmApproveDescription") ||
                    "Are you sure you want to approve this service booking?"
                    : t("business.serviceBookings.confirmDeclineDescription") ||
                    "Please provide a reason for declining this service booking."}
              </DialogDescription>
            </DialogHeader>

            {confirmAction?.type === "decline" ? (
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t("business.serviceBookings.rejectionReason") || "Rejection Reason"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                        placeholder={
                            t("business.serviceBookings.rejectionReasonPlaceholder") ||
                            "We are not available during the requested time slot..."
                        }
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="min-h-[100px]"
                    />
                  </div>
                </div>
            ) : (
                <div className="flex justify-center py-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmAction(null)} disabled={!!actionLoading}>
                {t("business.common.cancel") || "Cancel"}
              </Button>
              <Button
                  variant={confirmAction?.type === "approve" ? "default" : "destructive"}
                  onClick={handleConfirmAction}
                  disabled={!!actionLoading || (confirmAction?.type === "decline" && !rejectionReason.trim())}
              >
                {actionLoading ? (
                    <LoadingSpinner size="sm" />
                ) : confirmAction?.type === "approve" ? (
                    t("business.serviceBookings.confirmApprove") || "Yes, Approve Service"
                ) : (
                    t("business.serviceBookings.confirmDecline") || "Yes, Decline Service"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Booking Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {t("business.serviceBookings.bookingDetails") || "Service Booking Details"}
              </DialogTitle>
            </DialogHeader>

            {selectedBooking && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {selectedBooking.serviceName[language] || selectedBooking.serviceName.en}
                    </h3>
                    <div className="flex gap-2">
                      <Badge className={getStatusBadgeClass(selectedBooking.status)}>
                        {selectedBooking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : selectedBooking.status === "pending"
                                ? t("business.bookings.pending") || "Pending"
                                : selectedBooking.status === "completed"
                                    ? t("business.bookings.completed") || "Completed"
                                    : t("business.bookings.cancelled") || "Cancelled"}
                      </Badge>
                      {getServiceStatusBadge(getServiceStatus(selectedBooking))}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t("business.bookings.customer")}</h4>
                        <p>{selectedBooking.customer.name}</p>
                        <div className="mt-1 flex flex-col text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {selectedBooking.customer.email}
                      </span>
                          {selectedBooking.customer?.phone && (
                              <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                                {selectedBooking.customer.phone}
                        </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      {getServiceIcon(selectedBooking.serviceType, selectedBooking.serviceIcon)}
                      <div>
                        <h4 className="font-medium">{t("nav.services")}</h4>
                        <p>{selectedBooking.serviceName[language] || selectedBooking.serviceName.en}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">{t("business.bookings.date")}</h4>
                          <p>
                            {formatDate(selectedBooking.startDate)} - {formatDate(selectedBooking.endDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">{t("business.bookings.time")}</h4>
                          <p>
                            {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">{t("business.bookings.guests")}</h4>
                          <p>
                            {selectedBooking.numberOfGuests} {t("business.bookings.guests")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">{t("business.bookings.total")}</h4>
                          <p>${Number.parseFloat(selectedBooking.totalAmount).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Calculation */}
                    <div>
                      <h4 className="font-medium mb-2">{t("business.bookings.servicePricing") || "Service Pricing"}</h4>
                      <div className="bg-secondary/20 p-3 rounded-md space-y-2">
                        {/* Service Base Price */}
                        <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground ml-1">
                        {t("business.bookings.serviceBasePrice") || "Service Base Price"}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({getPriceTypeDisplay(calculateServicePrice(selectedBooking).priceType)})
                        </span>
                      </span>
                          <span className="text-sm text-muted-foreground ml-1">
                        ${(calculateServicePrice(selectedBooking).basePrice || 0).toFixed(2)}
                      </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground ml-1">
                          {t("business.bookings.calculation")}:
                        </span>
                            <span className="text-sm text-muted-foreground ml-1">
                          ${calculateServicePrice(selectedBooking).basePrice.toFixed(2)} ×{" "}
                              {selectedBooking.numberOfGuests} guests
                        </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between font-medium">
                        <span className="text-lg text-foreground ml-1">
                          {" "}
                          {t("business.bookings.serviceTotalCost")}{" "}
                        </span>
                          </div>
                          {(() => {
                            const servicePrice = calculateServicePrice(selectedBooking)
                            if (!servicePrice.serviceTotal) {
                              return null
                            }

                            const priceType = servicePrice.priceType?.toUpperCase() || "FIXED"
                            const basePrice = servicePrice.basePrice || 0

                            if (priceType === "perPerson" || priceType === "PERPERSON") {
                              return (
                                  <>
                                    <div className="flex justify-between">
                                <span className="text-lg text-foreground ml-1">
                                  {" "}
                                  ${servicePrice.serviceTotal.toFixed(2)}{" "}
                                </span>
                                    </div>
                                  </>
                              )
                            } else if (priceType === "perHour" || priceType === "PERHOUR") {
                              const startTime = new Date(`2000-01-01 ${selectedBooking.startTime}`)
                              const endTime = new Date(`2000-01-01 ${selectedBooking.endTime}`)
                              const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
                              return (
                                  <div className="flex justify-between font-medium">
                              <span>
                                ${basePrice.toFixed(2)} × {hours} hours
                              </span>
                                  </div>
                              )
                            } else {
                              return (
                                  <div className="flex justify-between">
                              <span className="text-lg text-foreground ml-1">
                                {" "}
                                ${servicePrice.serviceTotal.toFixed(2)}{" "}
                              </span>
                                  </div>
                              )
                            }
                            return null
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Venue Information */}
                    {selectedBooking.venue && (
                        <div>
                          <h4 className="font-medium mb-2">{t("business.bookings.venue") || "Venue"}</h4>
                          <div className="bg-secondary/20 p-3 rounded-md">
                            <div className="font-medium">
                              {selectedBooking.venue.name?.[language] || selectedBooking.venue.name?.en}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {selectedBooking.venue.address?.city}, {selectedBooking.venue.address?.country}
                            </div>
                          </div>
                        </div>
                    )}

                    {selectedBooking.specialRequests && (
                        <div>
                          <h4 className="font-medium">{t("business.bookings.specialRequests") || "Special Requests"}</h4>
                          <p className="text-muted-foreground">{selectedBooking.specialRequests}</p>
                        </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-end gap-2 pt-4">
                    {!selectedBooking?.metadata?.options && selectedBooking.status !== "cancelled" && (
                        <>
                          <Button
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50"
                              onClick={() => openApproveConfirmation(selectedBooking)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {t("business.bookings.approve") || "Accept Service"}
                          </Button>
                          <Button
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => openDeclineConfirmation(selectedBooking)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            {t("business.bookings.decline") || "Reject Service"}
                          </Button>
                        </>
                    )}
                    
                    <Button onClick={() => setIsViewModalOpen(false)}>{t("business.common.close") || "Close"}</Button>
                  </div>
                </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Booking Modal */}
        {selectedBooking && (
            <EditBookingModal
                booking={selectedBooking}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveBooking}
            />
        )}

        {/* Decline Booking Modal */}
        <Dialog open={isDeclineModalOpen} onOpenChange={setIsDeclineModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {t("business.serviceBookings.declineService") || "Decline Service"}
              </DialogTitle>
              <DialogDescription>
                {t("business.serviceBookings.declineServiceDescription") ||
                    "Please provide a reason for declining this service booking."}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("business.serviceBookings.rejectionReason") || "Rejection Reason"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                    placeholder={
                        t("business.serviceBookings.rejectionReasonPlaceholder") ||
                        "We are not available during the requested time slot..."
                    }
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeclineModalOpen(false)
                    setRejectionReason("")
                  }}
                  disabled={!!actionLoading}
              >
                {t("business.common.cancel") || "Cancel"}
              </Button>
              <Button
                  variant="destructive"
                  onClick={handleDeclineBooking}
                  disabled={!!actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? (
                    <LoadingSpinner size="sm" />
                ) : (
                    t("business.serviceBookings.decline") || "Decline Service"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upcoming">{t("business.bookings.upcoming") || "Upcoming"}</TabsTrigger>
            <TabsTrigger value="completed">{t("business.bookings.completed") || "Completed"}</TabsTrigger>
            <TabsTrigger value="cancelled">{t("business.bookings.cancelled") || "Cancelled"}</TabsTrigger>
            <TabsTrigger value="all">{t("business.bookings.all") || "All"}</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" text="Loading service bookings..." />
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {t("business.serviceBookings.noBookings") || "No service bookings found"}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm || dateFilter.startDate || dateFilter.endDate || countActiveFilters() > 0
                        ? t("business.serviceBookings.noBookingsFiltered") || "No bookings match your current filters."
                        : t("business.serviceBookings.noBookingsYet") || "You don't have any service bookings yet."}
                  </p>
                </div>
            ) : (
                <div className="space-y-4">
                  {filteredBookings.map((booking) => {
                    const serviceStatus = getServiceStatus(booking)
                    const { serviceTotal } = calculateServicePrice(booking)
                    const hasServiceOptions =
                        booking?.metadata?.options &&
                        Array.isArray(booking.metadata.options) &&
                        booking.metadata.options.some(
                            (option: any) =>
                                (option.service?.id === booking.serviceId || option.serviceId === booking.serviceId) &&
                                option.status,
                        )

                    return (
                        <div
                            key={`${booking.id}-${booking.serviceId}`}
                            className="bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                  {getServiceIcon(booking.serviceType, booking.serviceIcon)}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground">
                                    {booking.serviceName[language] || booking.serviceName.en}
                                  </h3>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5" />
                                    {booking.serviceType?.charAt(0).toUpperCase() + booking.serviceType?.slice(1)} Service
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {t("business.bookings.bookingId") || "ID"}: {booking.id}
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-2">
                                  <Badge className={getStatusBadgeClass(booking.status)}>
                                    {booking.status === "confirmed"
                                        ? t("business.bookings.confirmed") || "Confirmed"
                                        : booking.status === "pending"
                                            ? t("business.bookings.pending") || "Pending"
                                            : booking.status === "completed"
                                                ? t("business.bookings.completed") || "Completed"
                                                : t("business.bookings.cancelled") || "Cancelled"}
                                  </Badge>
                                  {getServiceStatusBadge(serviceStatus)}
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-foreground">${serviceTotal.toFixed(2)}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {t("business.bookings.serviceTotalCost") || "Total Price"}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                                <div className="p-2 bg-primary/10 rounded-full">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{booking.customer.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{booking.customer.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                                <div className="p-2 bg-blue-500/10 rounded-full">
                                  <CalendarDays className="h-4 w-4 text-blue-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                                <div className="p-2 bg-green-500/10 rounded-full">
                                  <Users className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {booking.numberOfGuests} {t("business.bookings.guests")}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{t(`venueBook.${booking.eventType}`) || "Event"}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                                <div className="p-2 bg-orange-500/10 rounded-full">
                                  <DollarSign className="h-4 w-4 text-orange-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {t("business.bookings.servicePricing") || "Service Price"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ${calculateServicePrice(booking).basePrice?.toFixed(2) || "0.00"} {getPriceTypeDisplay(calculateServicePrice(booking).priceType)}

                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                              {!hasServiceOptions && booking.status !== "cancelled" && (
                                  <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300"
                                        onClick={() => openApproveConfirmation(booking)}
                                        disabled={actionLoading === booking.id}
                                    >
                                      {actionLoading === booking.id ? (
                                          <LoadingSpinner size="sm" />
                                      ) : (
                                          <>
                                            <Check className="mr-1 h-3 w-3" />
                                            {t("business.bookings.approve") || "Accept"}
                                          </>
                                      )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        onClick={() => openDeclineConfirmation(booking)}
                                        disabled={actionLoading === booking.id}
                                    >
                                      {actionLoading === booking.id ? (
                                          <LoadingSpinner size="sm" />
                                      ) : (
                                          <>
                                            <X className="mr-1 h-3 w-3" />
                                            {t("business.bookings.decline") || "Reject"}
                                          </>
                                      )}
                                    </Button>
                                  </>
                              )}
                              <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                                {t("business.common.view") || "View"}
                              </Button>
                            </div>
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}
          </TabsContent>
        </Tabs>
      </BusinessLayout>
  )
}
