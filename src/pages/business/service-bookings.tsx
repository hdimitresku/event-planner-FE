"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../../context/language-context"
import { useCurrency, type Currency } from "../../context/currency-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Calendar, Clock, Search, X, CheckCircle, ArrowUpDown, SlidersHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import { toast } from "../../components/ui/use-toast"
import * as serviceService from "../../services/serviceService"
import * as bookingService from "../../services/bookingService"
import { BookingStatus } from "../../models/booking"
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
import { format } from "date-fns"

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

export default function BusinessServiceBookingsPage() {
  const { t, language } = useLanguage()
  const { formatPrice, currency } = useCurrency()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const [services, setServices] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "decline"
    booking: any
  } | null>(null)

  // New filter and sort states
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
  const uniqueServiceTypes = [...new Set(bookings.map((booking) => booking.service?.category))].filter(Boolean)

  // Get unique statuses from bookings
  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))].filter(Boolean)

  // Calculate service price based on pricing type
  const calculateServicePrice = (booking: any) => {
    if (!booking.servicePrice) return formatPrice(0, "USD" as Currency)

    const basePrice = booking.servicePrice.amount || 0
    const priceType = booking.servicePrice.type || "FIXED"
    const currency = booking.servicePrice.currency as Currency

    let calculatedPrice = basePrice
    if (priceType === "perPerson" || priceType === "perperson") {
      calculatedPrice = basePrice * booking.numberOfGuests
    } else if (priceType === "hourly" || priceType === "hourly") {
      // Calculate hours between start and end time
      const startTime = new Date(`2000-01-01 ${booking.startTime}`)
      const endTime = new Date(`2000-01-01 ${booking.endTime}`)
      const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
      calculatedPrice = basePrice * hours
    }

    return formatPrice(calculatedPrice, currency)
  }

  // Get price type display text
  const getPriceTypeDisplay = (priceType: string) => {
    if (!priceType) return t("business.bookings.fixedRate") || "Fixed Rate"

    const type = priceType.toUpperCase()
    if (type === "PER_PERSON" || type === "PERPERSON") {
      return t("business.serviceNew.perPerson") || "Per Person"
    } else if (type === "hourly" || type === "hourly") {
      return t("venues.filters.priceType.hourly") || "Per orë"
    }
    return t("business.pricing.fixed") || "Fixed Price"
  }

  // Fetch services and their bookings
  useEffect(() => {
    const fetchServicesAndBookings = async () => {
      try {
        setLoading(true)
        const serviceDetails = await serviceService.getServicesByOwner()
        setServices(serviceDetails)
        const allBookings = serviceDetails.flatMap((service: any) => {
          return service.bookings.map((booking: any) => {
            // Extract service price information
            const servicePrice = service.price || { amount: 0, type: "FIXED" }

            // Create booking with service information
            const enhancedBooking = {
              ...booking,
              serviceName: service.name,
              image: formatImageUrl(service.media?.[0]?.url || "/placeholder.svg?height=80&width=80&text=Service"),
              serviceId: service.id,
              servicePrice: servicePrice,
              service: service,
              customer: {
                name: `${booking.metadata?.contactDetails?.firstName || ""} ${booking.metadata?.contactDetails?.lastName || ""}`.trim(),
                email: booking.metadata?.contactDetails?.email || "",
                phone: booking.metadata?.contactDetails?.phone || "",
              },
            }

            // Calculate and add service cost
            enhancedBooking.serviceCost = calculateServicePrice(enhancedBooking)

            return enhancedBooking
          })
        })

        setBookings(allBookings)
      } catch (err) {
        setError("Failed to fetch services and bookings")
        console.error("Error fetching services:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServicesAndBookings()
  }, [])

  // Format image URL to handle relative paths
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"

    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) return url

    // If it's a relative path, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

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
    const serviceCategory = (booking.service?.category || "").toLowerCase()
    const serviceLocation = (booking.service?.location?.city || "").toLowerCase()

    // Search in booking details
    const bookingId = booking.id?.toLowerCase() || ""
    const eventType = (booking.eventType || "").toLowerCase()
    const startDate = booking.startDate || ""
    const startTime = booking.startTime || ""
    const endTime = booking.endTime || ""
    const guestCount = String(booking.numberOfGuests || "")
    const status = (booking.status || "").toLowerCase()
    const price = String(booking.serviceCost || "")

    // Check if search term is in any of these fields
    return (
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        customerPhone.includes(searchLower) ||
        serviceName.includes(searchLower) ||
        serviceCategory.includes(searchLower) ||
        serviceLocation.includes(searchLower) ||
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
    if (filters.serviceTypes.length > 0 && !filters.serviceTypes.includes(booking.service?.category)) {
      return false
    }

    // Filter by status
    if (filters.statuses.length > 0 && !filters.statuses.includes(booking.status)) {
      return false
    }

    // Filter by price range
    const price = booking.serviceCost || 0
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

    if (activeTab === "upcoming") {
      // Only show confirmed or pending bookings that are today or in the future
      if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.PENDING) {
        return false
      }
      if (bookingDate < today) {
        return false
      }
      return true
    } else if (activeTab === "completed") {
      // Only show completed bookings
      return booking.status === BookingStatus.COMPLETED
    } else if (activeTab === "cancelled") {
      // Show cancelled bookings
      return booking.status === BookingStatus.CANCELLED
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
          valueA = a.serviceCost || 0
          valueB = b.serviceCost || 0
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
    console.log(booking)
    setIsViewModalOpen(true)
  }

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsEditModalOpen(true)
  }

  const handleSaveBooking = (updatedBooking: any) => {
    // In a real app, this would update the booking in the database

    toast({
      title: t("business.bookings.bookingUpdated") || "Booking Updated",
      description: t("business.bookings.bookingUpdatedDescription") || "The booking has been successfully updated.",
      variant: "default",
    })

    setIsEditModalOpen(false)
  }

  const openCancelDialog = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setIsCancelModalOpen(true)
  }

  const handleCancelBooking = () => {
    // In a real app, this would update the booking status in the database

    toast({
      title: t("business.bookings.bookingCancelled") || "Booking Cancelled",
      description: t("business.bookings.bookingCancelledDescription") || "The booking has been cancelled.",
      variant: "default",
    })

    setIsCancelModalOpen(false)
    setBookingToCancel(null)
  }

  const openApproveConfirmation = (booking: any) => {
    setConfirmAction({ type: "approve", booking })
  }

  const openDeclineConfirmation = (booking: any) => {
    setConfirmAction({ type: "decline", booking })
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    setActionLoading(confirmAction.booking.id)
    try {
      if (confirmAction.type === "approve") {
        await bookingService.updateBookingServiceStatus(confirmAction.booking.id, BookingStatus.CONFIRMED)
        toast({
          title: t("business.bookings.bookingApproved") || "Booking Approved",
          description:
              t("business.bookings.bookingApprovedDescription") || "The booking has been successfully approved.",
        })
      } else {
        await bookingService.updateBookingServiceStatus(confirmAction.booking.id, BookingStatus.CANCELLED)
        toast({
          title: t("business.bookings.bookingDeclined") || "Booking Declined",
          description: t("business.bookings.bookingDeclinedDescription") || "The booking has been declined.",
        })
      }

      // Refresh services data
      const serviceDetails = await serviceService.getServicesByOwner()
      setServices(serviceDetails)
      const allBookings = serviceDetails.flatMap((service: any) => {
        return service.bookings.map((booking: any) => {
          const servicePrice = service.price || { amount: 0, type: "FIXED" }
          const enhancedBooking = {
            ...booking,
            serviceName: service.name,
            image: formatImageUrl(service.media?.[0]?.url || "/placeholder.svg?height=80&width=80&text=Service"),
            serviceId: service.id,
            servicePrice: servicePrice,
            service: service,
            customer: {
              name: `${booking.metadata?.contactDetails?.firstName || ""} ${booking.metadata?.contactDetails?.lastName || ""}`.trim(),
              email: booking.metadata?.contactDetails?.email || "",
              phone: booking.metadata?.contactDetails?.phone || "",
            },
          }
          enhancedBooking.serviceCost = calculateServicePrice(enhancedBooking)
          return enhancedBooking
        })
      })
      setBookings(allBookings)
      setIsViewModalOpen(false)
    } catch (error: any) {
      console.error("Error updating booking:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to update booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-500/90 dark:bg-emerald-600/90 text-success-foreground hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70"
      case "pending":
        return "bg-warning text-warning-foreground hover:bg-warning/80"
      case "completed":
        return "bg-info text-info-foreground hover:bg-info/80"
      case "cancelled":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/80"
      default:
        return "bg-muted text-muted-foreground"
    }
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

  // Add effect to recalculate service costs when currency changes
  useEffect(() => {
    if (bookings.length > 0) {
      const updatedBookings = bookings.map(booking => ({
        ...booking,
        serviceCost: calculateServicePrice(booking)
      }))
      setBookings(updatedBookings)
    }
  }, [currency])

  return (
      <BusinessLayout>
        {/* Confirmation Dialog */}
        <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {confirmAction?.type === "approve"
                    ? t("business.bookings.confirmApprove") || "Confirm Approval"
                    : t("business.bookings.confirmDecline") || "Confirm Decline"}
              </DialogTitle>
              <DialogDescription>
                {confirmAction?.type === "approve"
                    ? t("business.bookings.confirmApproveDescription") || "Are you sure you want to approve this booking?"
                    : t("business.bookings.confirmDeclineDescription") || "Are you sure you want to decline this booking?"}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              {confirmAction?.type === "approve" ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                  <X className="h-16 w-16 text-red-500" />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmAction(null)} disabled={!!actionLoading}>
                {t("business.common.cancel") || "Cancel"}
              </Button>
              <Button
                  variant={confirmAction?.type === "approve" ? "default" : "destructive"}
                  onClick={handleConfirmAction}
                  disabled={!!actionLoading}
              >
                {actionLoading ? (
                    <LoadingSpinner size="sm" />
                ) : confirmAction?.type === "approve" ? (
                    t("business.bookings.confirmApprove") || "Yes, Approve"
                ) : (
                    t("business.bookings.confirmDecline") || "Yes, Decline"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("business.serviceBookings.title") || "Service Bookings"}</h1>
          <p className="text-muted-foreground">{t("business.serviceBookings.subtitle") || "Manage your service bookings"}</p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder={t("business.bookings.searchBookings") || "Search bookings..."}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary bg-transparent">
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
                <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary bg-transparent">
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
                <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary bg-transparent">
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

            <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary bg-transparent">
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
                        ? `${new Date(\
