"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { EditBookingModal } from "../../components/business/edit-booking-modal"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Calendar,
  Check,
  Clock,
  Search,
  X,
  User,
  MapPin,
  Users,
  DollarSign,
  CalendarDays,
  Phone,
  Mail,
  PencilLine,
  AlertTriangle,
  CheckCircle,
  ArrowUpDown,
  SlidersHorizontal,
  Building2,
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
import * as venueService from "../../services/venueService"
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
  venueTypes: string[]
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

export default function BusinessBookingsPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const [venues, setVenues] = useState<any[]>([])
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
    venueTypes: [],
    statuses: [],
    priceRange: {},
    guestCount: {},
  })

  // Get unique venue types from bookings
  const uniqueVenueTypes = [...new Set(bookings.map((booking) => booking.venue?.type))].filter(Boolean)

  // Get unique statuses from bookings
  const uniqueStatuses = [...new Set(bookings.map((booking) => booking.status))].filter(Boolean)

  // Calculate venue price based on pricing type
  const calculateVenuePrice = (booking: any) => {
    if (!booking.venuePrice) return 0

    const basePrice = booking.venuePrice.amount || 0
    const priceType = booking.venuePrice.type || "FIXED"

    let calculatedPrice = basePrice
    if (priceType === "perPerson" || priceType === "perperson") {
      calculatedPrice = basePrice * booking.numberOfGuests
    } else if (priceType === "perHour" || priceType === "perhour") {
      // Calculate hours between start and end time
      const startTime = new Date(`2000-01-01 ${booking.startTime}`)
      const endTime = new Date(`2000-01-01 ${booking.endTime}`)
      const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
      calculatedPrice = basePrice * hours
    }

    return calculatedPrice
  }

  // Get price type display text
  const getPriceTypeDisplay = (priceType: string) => {
    if (!priceType) return t("business.bookings.fixedRate") || "Fixed Rate"

    const type = priceType.toUpperCase()
    if (type === "PER_PERSON" || type === "PERPERSON") {
      return t("business.serviceNew.perPerson") || "Per Person"
    } else if (type === "hourly" || type === "HOURLY") {
      return t("business.serviceNew.perHour") || "Per Hour"
    }
    return t("business.pricing.fixed") || "Fixed Price"
  }

  // Fetch venues and their bookings
  useEffect(() => {
    const fetchVenuesAndBookings = async () => {
      try {
        setLoading(true)
        const venueDetails = await venueService.getVenueByOwner()
        setVenues(venueDetails)
        const allBookings = venueDetails.flatMap((venue: any) => {
          return venue.bookings.map((booking: any) => {
            // Extract venue price information
            const venuePrice = venue.price || { amount: 0, type: "FIXED" }

            // Create booking with venue information
            const enhancedBooking = {
              ...booking,
              venueName: venue.name,
              image: formatImageUrl(venue.media?.[0]?.url || "/placeholder.svg?height=80&width=80&text=Venue"),
              venueId: venue.id,
              venuePrice: venuePrice,
              venue: venue,
              customer: {
                name: `${booking.metadata?.contactDetails?.firstName || ""} ${booking.metadata?.contactDetails?.lastName || ""}`.trim(),
                email: booking.metadata?.contactDetails?.email || "",
                phone: booking.metadata?.contactDetails?.phone || "",
              },
            }

            // Calculate and add venue cost
            enhancedBooking.venueCost = calculateVenuePrice(enhancedBooking)

            return enhancedBooking
          })
        })

        setBookings(allBookings)
      } catch (err) {
        setError("Failed to fetch venues and bookings")
        console.error("Error fetching venues:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVenuesAndBookings()
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

    // Search in venue details
    const venueName = (booking.venueName?.[language] || booking.venueName?.en || "").toLowerCase()
    const venueType = (booking.venue?.type || "").toLowerCase()
    const venueLocation = (booking.venue?.address?.city || "").toLowerCase()

    // Search in booking details
    const bookingId = booking.id?.toLowerCase() || ""
    const eventType = (booking.eventType || "").toLowerCase()
    const startDate = booking.startDate || ""
    const startTime = booking.startTime || ""
    const endTime = booking.endTime || ""
    const guestCount = String(booking.numberOfGuests || "")
    const status = (booking.status || "").toLowerCase()
    const price = String(booking.venueCost || "")

    // Check if search term is in any of these fields
    return (
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        customerPhone.includes(searchLower) ||
        venueName.includes(searchLower) ||
        venueType.includes(searchLower) ||
        venueLocation.includes(searchLower) ||
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
    // Filter by venue type
    if (filters.venueTypes.length > 0 && !filters.venueTypes.includes(booking.venue?.type)) {
      return false
    }

    // Filter by status
    if (filters.statuses.length > 0 && !filters.statuses.includes(booking.status)) {
      return false
    }

    // Filter by price range
    const price = booking.venueCost || 0
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
          valueA = a.venueCost || 0
          valueB = b.venueCost || 0
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
        await bookingService.updateBookingVenueStatus(confirmAction.booking.id, BookingStatus.CONFIRMED)
        toast({
          title: t("business.bookings.bookingApproved") || "Booking Approved",
          description:
              t("business.bookings.bookingApprovedDescription") || "The booking has been successfully approved.",
        })
      } else {
        await bookingService.updateBookingVenueStatus(confirmAction.booking.id, BookingStatus.CANCELLED)
        toast({
          title: t("business.bookings.bookingDeclined") || "Booking Declined",
          description: t("business.bookings.bookingDeclinedDescription") || "The booking has been declined.",
        })
      }

      // Refresh venues data
      const venueDetails = await venueService.getVenueByOwner()
      setVenues(venueDetails)
      const allBookings = venueDetails.flatMap((venue: any) => {
        return venue.bookings.map((booking: any) => {
          const venuePrice = venue.price || { amount: 0, type: "FIXED" }
          const enhancedBooking = {
            ...booking,
            venueName: venue.name,
            image: formatImageUrl(venue.media?.[0]?.url || "/placeholder.svg?height=80&width=80&text=Venue"),
            venueId: venue.id,
            venuePrice: venuePrice,
            venue: venue,
            customer: {
              name: `${booking.metadata?.contactDetails?.firstName || ""} ${booking.metadata?.contactDetails?.lastName || ""}`.trim(),
              email: booking.metadata?.contactDetails?.email || "",
              phone: booking.metadata?.contactDetails?.phone || "",
            },
          }
          enhancedBooking.venueCost = calculateVenuePrice(enhancedBooking)
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
    if (filterOptions.venueTypes.length > 0) count++
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
      venueTypes: [],
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
          <h1 className="text-3xl font-bold tracking-tight">{t("business.bookings.title") || "Venue Bookings"}</h1>
          <p className="text-muted-foreground">{t("business.bookings.subtitle") || "Manage your venue bookings"}</p>
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
                  {/* Venue Type Filter */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("business.bookings.venueType") || "Venue Type"}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueVenueTypes.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                                id={`venue-type-${type}`}
                                checked={filterOptions.venueTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  setFilterOptions((prev) => ({
                                    ...prev,
                                    venueTypes: checked
                                        ? [...prev.venueTypes, type]
                                        : prev.venueTypes.filter((t) => t !== type),
                                  }))
                                }}
                            />
                            <label
                                htmlFor={`venue-type-${type}`}
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
                          venueTypes: [],
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

              {filterOptions.venueTypes.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {t("business.bookings.venueTypes") || "Venue Types"}: {filterOptions.venueTypes.length}
                    <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterOptions((prev) => ({ ...prev, venueTypes: [] }))}
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

        {/* Venues Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t("business.bookings.venuesOverview") || "Bookings by Venue"}</h2>
          {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <LoadingSpinner size="lg" text="Loading venues..." className="col-span-full py-8" />
              </div>
          ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {venues.map((venue) => {
                  const venueBookings = venue.bookings || []
                  const pendingCount = venueBookings.filter((b: any) => b.status === "pending").length
                  const confirmedCount = venueBookings.filter((b: any) => b.status === "confirmed").length
                  const totalCount = venueBookings.length

                  return (
                      <div key={venue.id} className="bg-background border rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium text-lg mb-2">{venue.name[language] || venue.name.en}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {venue.address.street}, {venue.address.city}, {venue.address.state}
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
                  )
                })}
              </div>
          )}
        </div>

        {/* View Booking Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t("business.bookings.bookingDetails")}</DialogTitle>
            </DialogHeader>

            {selectedBooking && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      {selectedBooking.venueName[language] || selectedBooking.venueName.en}
                    </h3>
                    <Badge className={getStatusBadgeClass(selectedBooking.status)}>
                      {selectedBooking.status === "confirmed"
                          ? t("business.bookings.confirmed") || "Confirmed"
                          : selectedBooking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : selectedBooking.status === "completed"
                                  ? t("business.bookings.completed") || "Completed"
                                  : t("business.bookings.cancelled") || "Cancelled"}
                    </Badge>
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
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">{t("business.bookings.venue")}</h4>
                        <p>{selectedBooking.venueName[language] || selectedBooking.venueName.en}</p>
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

                    {/* Venue Pricing */}
                    <div>
                      <h4 className="font-medium mb-2">{t("business.bookings.venuePricing") || "Venue Pricing"}</h4>
                      <div className="bg-secondary/20 p-3 rounded-md space-y-2">
                        {/* Venue Base Price */}
                        <div className="flex justify-between">
                      <span>
                        {t("business.bookings.venueBasePrice") || "Venue Base Price"}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({getPriceTypeDisplay(selectedBooking.venuePrice?.type || "FIXED")})
                        </span>
                      </span>
                          <span>${(selectedBooking.venuePrice?.amount || 0).toFixed(2)}</span>
                        </div>

                        {/* Calculation Breakdown */}
                        <div className="text-xs text-muted-foreground">
                          {(() => {
                            if (!selectedBooking.venuePrice) return null

                            const priceType = selectedBooking.venuePrice.type?.toUpperCase() || "FIXED"
                            const basePrice = selectedBooking.venuePrice.amount || 0

                            if (priceType === "PER_PERSON" || priceType === "PERPERSON") {
                              return (
                                  <div className="flex justify-between">
                                    <span>{t("business.bookings.calculation")}:</span>
                                    <span>
                                ${basePrice.toFixed(2)} × {selectedBooking.numberOfGuests} guests
                              </span>
                                  </div>
                              )
                            } else if (priceType === "perHour" || priceType === "PERHOUR") {
                              const startTime = new Date(`2000-01-01 ${selectedBooking.startTime}`)
                              const endTime = new Date(`2000-01-01 ${selectedBooking.endTime}`)
                              const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
                              return (
                                  <div className="flex justify-between">
                              <span>
                                ${basePrice.toFixed(2)} × {hours} hours
                              </span>
                                  </div>
                              )
                            }
                            return null
                          })()}
                        </div>

                        {/* Total Venue Cost */}
                        <div className="flex justify-between font-medium">
                          <span>{t("business.bookings.venueTotalCost") || "Total Venue Cost"}</span>
                          <span>${selectedBooking.venueCost?.toFixed(2) || "0.00"}</span>
                        </div>

                      </div>
                    </div>

                    {selectedBooking.notes && (
                        <div>
                          <h4 className="font-medium">{t("business.bookings.notes")}</h4>
                          <p className="text-muted-foreground">{selectedBooking.notes}</p>
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
                    {selectedBooking.status === "pending" && (
                        <>
                          <Button
                              variant="outline"
                              className="border-green-600 text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveBooking(selectedBooking.id)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            {t("business.bookings.approve") || "Approve"}
                          </Button>
                          <Button
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineBooking(selectedBooking.id)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            {t("business.bookings.decline") || "Decline"}
                          </Button>
                        </>
                    )}
                    {(selectedBooking.status === "confirmed" || selectedBooking.status === "pending") && (
                        <Button
                            variant="outline"
                            onClick={() => {
                              setIsViewModalOpen(false)
                              handleEditBooking(selectedBooking)
                            }}
                        >
                          <PencilLine className="mr-1 h-4 w-4" />
                          {t("business.common.edit") || "Edit"}
                        </Button>
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

        {/* Cancel Booking Confirmation Dialog */}
        <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {t("business.bookings.cancelBooking") || "Cancel Booking"}
              </DialogTitle>
              <DialogDescription>
                {t("business.bookings.cancelBookingConfirmation") ||
                    "Are you sure you want to cancel this booking? This action cannot be undone."}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <AlertTriangle className="h-16 w-16 text-destructive" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
                {t("business.common.cancel") || "Cancel"}
              </Button>
              <Button variant="destructive" onClick={handleCancelBooking}>
                {t("business.bookings.confirmCancel") || "Yes, Cancel Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">{t("business.bookings.upcoming") || "Upcoming"}</TabsTrigger>
            <TabsTrigger value="completed">{t("business.bookings.completed") || "Completed"}</TabsTrigger>
            <TabsTrigger value="cancelled">{t("business.bookings.cancelled") || "Cancelled"}</TabsTrigger>
            <TabsTrigger value="all">{t("business.bookings.all") || "All Bookings"}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="space-y-4">
              {loading && <LoadingSpinner size="lg" text="Loading bookings..." className="py-8" />}

              {!loading && filteredBookings.length === 0 && (
                  <div className="text-center py-12 bg-secondary/30 rounded-lg">
                    <h3 className="text-lg font-medium">{t("business.bookings.noBookingsFound") || "No bookings found"}</h3>
                    <p className="text-muted-foreground mt-2">
                      {activeTab === "upcoming"
                          ? t("business.bookings.noUpcomingBookings") || "No upcoming bookings at the moment"
                          : activeTab === "completed"
                              ? t("business.bookings.noCompletedBookings") || "No completed bookings yet"
                              : activeTab === "cancelled"
                                  ? t("business.bookings.noCancelledBookings") || "No cancelled bookings"
                                  : t("business.bookings.noBookingsAvailable") || "No bookings available"}
                    </p>
                  </div>
              )}
              {filteredBookings.map((booking) => (
                  <div
                      key={booking.id}
                      className="bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            <img
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.venueName[language] || booking.venueName.en}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {booking.venueName[language] || booking.venueName.en}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {t(`business.venueTypes.${booking.venue?.type}`)} • {booking.venue?.address?.city}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("business.bookings.bookingId") || "ID"}: {booking.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusBadgeClass(booking.status)}>
                            {booking.status === "confirmed"
                                ? t("business.bookings.confirmed") || "Confirmed"
                                : booking.status === "pending"
                                    ? t("business.bookings.pending") || "Pending"
                                    : booking.status === "completed"
                                        ? t("business.bookings.completed") || "Completed"
                                        : t("business.bookings.cancelled") || "Cancelled"}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              ${Number.parseFloat(calculateVenuePrice(booking)).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("business.venueBookings.totalPrice") || "Total Price"}
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
                            <p className="text-sm font-medium text-foreground">{t(`business.venueBookings.basePrice`)}</p>
                            <p className="text-xs text-muted-foreground">
                              {t(`venues.filters.priceType.${booking.venue?.price?.type}`)}: ${booking.venue?.price?.amount}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                        {booking.status === "pending" && (
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
                                      {t("business.bookings.approve") || "Approve"}
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
                                      {t("business.bookings.decline") || "Decline"}
                                    </>
                                )}
                              </Button>
                            </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                          {t("business.common.view") || "View"}
                        </Button>
                        {(booking.status === "confirmed" || booking.status === "pending") && (
                            <Button variant="outline" size="sm" onClick={() => handleEditBooking(booking)}>
                              <PencilLine className="mr-1 h-3 w-3" />
                              {t("business.common.edit") || "Edit"}
                            </Button>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="space-y-4">
              {loading && <LoadingSpinner size="lg" text="Loading bookings..." className="py-8" />}

              {!loading && filteredBookings.length === 0 && (
                  <div className="text-center py-12 bg-secondary/30 rounded-lg">
                    <h3 className="text-lg font-medium">{t("business.bookings.noBookingsFound") || "No bookings found"}</h3>
                    <p className="text-muted-foreground mt-2">
                      {t("business.bookings.noCompletedBookings") || "No completed bookings yet"}
                    </p>
                  </div>
              )}
              {filteredBookings.map((booking) => (
                  <div
                      key={booking.id}
                      className="bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            <img
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.venueName[language] || booking.venueName.en}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {booking.venueName[language] || booking.venueName.en}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {t(`business.venueTypes.${booking.venue?.type}`)} • {booking.venue?.address?.city}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("business.bookings.bookingId") || "ID"}: {booking.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusBadgeClass(booking.status)}>
                            {t("business.bookings.completed") || "Completed"}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              ${Number.parseFloat(calculateVenuePrice(booking)).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("business.venueBookings.totalPrice") || "Total Price"}
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
                            <p className="text-sm font-medium text-foreground">{t(`business.venueBookings.basePrice`)}</p>
                            <p className="text-xs text-muted-foreground">
                              {t(`venues.filters.priceType.${booking.venue?.price?.type}`)}: ${booking.venue?.price?.amount}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                        <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                          {t("business.common.view") || "View"}
                        </Button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <div className="space-y-4">
              {loading && <LoadingSpinner size="lg" text="Loading bookings..." className="py-8" />}

              {!loading && filteredBookings.length === 0 && (
                  <div className="text-center py-12 bg-secondary/30 rounded-lg">
                    <h3 className="text-lg font-medium">{t("business.bookings.noBookingsFound") || "No bookings found"}</h3>
                    <p className="text-muted-foreground mt-2">
                      {t("business.bookings.noCancelledBookings") || "No cancelled bookings"}
                    </p>
                  </div>
              )}
              {filteredBookings.map((booking) => (
                  <div
                      key={booking.id}
                      className="bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            <img
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.venueName[language] || booking.venueName.en}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {booking.venueName[language] || booking.venueName.en}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {t(`business.venueTypes.${booking.venue?.type}`)} • {booking.venue?.address?.city}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("business.bookings.bookingId") || "ID"}: {booking.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusBadgeClass(booking.status)}>
                            {t("business.bookings.cancelled") || "Cancelled"}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              ${Number.parseFloat(calculateVenuePrice(booking)).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("business.venueBookings.totalPrice") || "Total Price"}
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
                            <p className="text-sm font-medium text-foreground">{t(`business.venueBookings.basePrice`)}</p>
                            <p className="text-xs text-muted-foreground">
                              {t(`venues.filters.priceType.${booking.venue?.price?.type}`)}: ${booking.venue?.price?.amount}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                        <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                          {t("business.common.view") || "View"}
                        </Button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {loading && <LoadingSpinner size="lg" text="Loading bookings..." className="py-8" />}

              {!loading && filteredBookings.length === 0 && (
                  <div className="text-center py-12 bg-secondary/30 rounded-lg">
                    <h3 className="text-lg font-medium">{t("business.bookings.noBookingsFound") || "No bookings found"}</h3>
                    <p className="text-muted-foreground mt-2">
                      {t("business.bookings.noBookingsAvailable") || "No bookings available"}
                    </p>
                  </div>
              )}
              {filteredBookings.map((booking) => (
                  <div
                      key={booking.id}
                      className="bg-background border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                            <img
                                src={booking.image || "/placeholder.svg"}
                                alt={booking.venueName[language] || booking.venueName.en}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {booking.venueName[language] || booking.venueName.en}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5" />
                              {t(`business.venueTypes.${booking.venue?.type}`)} • {booking.venue?.address?.city}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {t("business.bookings.bookingId") || "ID"}: {booking.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusBadgeClass(booking.status)}>
                            {booking.status === "confirmed"
                                ? t("business.bookings.confirmed") || "Confirmed"
                                : booking.status === "pending"
                                    ? t("business.bookings.pending") || "Pending"
                                    : booking.status === "completed"
                                        ? t("business.bookings.completed") || "Completed"
                                        : t("business.bookings.cancelled") || "Cancelled"}
                          </Badge>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">
                              ${Number.parseFloat(calculateVenuePrice(booking)).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("business.venueBookings.totalPrice") || "Total Price"}
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
                            <p className="text-sm font-medium text-foreground">{t(`business.venueBookings.basePrice`)}</p>
                            <p className="text-xs text-muted-foreground">
                              {t(`venues.filters.priceType.${booking.venue?.price?.type}`)}: ${booking.venue?.price?.amount}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                        {booking.status === "pending" && (
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
                                      {t("business.bookings.approve") || "Approve"}
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
                                      {t("business.bookings.decline") || "Decline"}
                                    </>
                                )}
                              </Button>
                            </>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                          {t("business.common.view") || "View"}
                        </Button>
                        {(booking.status === "confirmed" || booking.status === "pending") && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEditBooking(booking)}>
                                <PencilLine className="mr-1 h-3 w-3" />
                                {t("business.common.edit") || "Edit"}
                              </Button>

                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => openCancelDialog(booking.id)}
                              >
                                {t("business.common.cancel") || "Cancel"}
                              </Button>
                            </>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </BusinessLayout>
  )
}
