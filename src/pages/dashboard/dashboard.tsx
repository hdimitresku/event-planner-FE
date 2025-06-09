"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import { Clock, Calendar, MapPin, CreditCard, CalendarPlus, FileText, AlertTriangle, Eye, Pencil } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useLanguage } from "../../context/language-context"
import * as bookingService from "../../services/bookingService"
import * as userService from "../../services/userService"
import { type Booking, BookingStatus, PaymentStatus } from "../../models/booking"
import type { Venue } from "../../models/venue"
import type { User as UserModel } from "../../models/user"
import { format } from "date-fns"
import { toast } from "../../components/ui/use-toast"
import { EditBookingModal } from "../../components/dashboard/edit-booking-modal"
import { BookingDetailsModal } from "../../components/dashboard/booking-details-module"

export default function Dashboard() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [venues, setVenues] = useState<Record<string, Venue | null>>({})
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    // Fetch current user - for demo we'll use a hardcoded ID
    const fetchUser = async () => {
      const user = await userService.getLoggedInUser()
      setCurrentUser(user)
    }

    fetchUser()
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoadingBookings(true)
    try {
      // Fetch bookings for the current user
      const result = await bookingService.getBookings()
      setBookings(result)

      // Create a map of venues from the bookings
      const venueDetails: Record<string, Venue | null> = {}
      result.forEach((booking) => {
        if (booking.venue) {
          venueDetails[booking.venue.id] = booking.venue
        }
      })

      setVenues(venueDetails)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingBookings(false)
    }
  }

  const openCancelDialog = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setIsCancelModalOpen(true)
  }

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      // In a real app, this would call an API to update the booking
      console.log(`Updating booking ${bookingId} to status: ${status}`)

      // Update local state
      setBookings((prev) => prev.map((booking) => (booking.id === bookingId ? { ...booking, status } : booking)))

      toast({
        title:
          status === BookingStatus.CANCELLED
            ? t("dashboard.bookingCancelled") || "Booking Cancelled"
            : t("dashboard.bookingUpdated") || "Booking Updated",
        description:
          status === BookingStatus.CANCELLED
            ? t("dashboard.bookingCancelledDescription") || "Your booking has been cancelled."
            : t("dashboard.bookingUpdatedDescription") || "Your booking has been updated.",
      })

      setIsCancelModalOpen(false)
      setBookingToCancel(null)
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"

    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) return url

    // If it's a relative path, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return <Badge className="bg-emerald-500">{t("bookings.status.confirmed") || "Confirmed"}</Badge>
      case BookingStatus.PENDING:
        return <Badge className="bg-yellow-500">{t("bookings.status.pending") || "Pending"}</Badge>
      case BookingStatus.COMPLETED:
        return <Badge className="bg-blue-500">{t("bookings.status.completed") || "Completed"}</Badge>
      case BookingStatus.CANCELLED:
        return <Badge className="bg-red-500">{t("bookings.status.cancelled") || "Cancelled"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return <Badge className="bg-green-500">{t("bookings.paymentStatus.paid") || "Paid"}</Badge>
      case PaymentStatus.PARTIALLY_PAID:
        return <Badge className="bg-yellow-500">{t("bookings.paymentStatus.partiallyPaid") || "Partially Paid"}</Badge>
      case PaymentStatus.PENDING:
        return <Badge className="bg-orange-500">{t("bookings.paymentStatus.pending") || "Pending"}</Badge>
      case PaymentStatus.REFUNDED:
        return <Badge className="bg-purple-500">{t("bookings.paymentStatus.refunded") || "Refunded"}</Badge>
      case PaymentStatus.FAILED:
        return <Badge className="bg-red-500">{t("bookings.paymentStatus.failed") || "Failed"}</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Check if booking has cancelled services
  const hasCancelledServices = (booking: Booking) => {
    if (!booking?.metadata?.options || !Array.isArray(booking.metadata.options)) return false

    return booking.metadata.options.some((option: any) => option.status === "cancelled" || option.status === "rejected")
  }

  // Filter bookings based on tab
  const getBookingsForTab = (tabValue: string) => {
    const now = new Date()
    now.setHours(0, 0, 0, 0) // Reset time for accurate date comparison

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.startDate)
      bookingDate.setHours(0, 0, 0, 0) // Reset time for accurate date comparison
      console.log(bookingDate >= now)
      switch (tabValue) {
        case "upcoming":
          return (
            bookingDate >= now &&
            (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING)
          )
        case "past":
          return bookingDate < now || booking.status === BookingStatus.COMPLETED
        case "cancelled":
          return booking.status === BookingStatus.CANCELLED
        case "all":
          return true // Show all bookings
        default:
          return true
      }
    })
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, "dd/MM HH:mm")
    } catch (error) {
      return dateTimeString
    }
  }

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsEditModalOpen(true)
  }

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsViewModalOpen(true)
  }

  const handleSaveBooking = async (updatedBooking: Booking) => {
    try {
      // In a real app, this would call an API to update the booking
      console.log(`Updating booking ${updatedBooking.id}`, updatedBooking)

      // Update local state - ensure metadata.options is properly handled as array
      setBookings((prev) =>
        prev.map((booking) => {
          if (booking.id === updatedBooking.id) {
            const updated = { ...updatedBooking }
            // Ensure options is always an array if it exists
            if (updated.metadata?.options && !Array.isArray(updated.metadata.options)) {
              updated.metadata.options = [updated.metadata.options]
            }
            return updated
          }
          return booking
        }),
      )

      toast({
        title: t("dashboard.bookingUpdated") || "Booking Updated",
        description: t("dashboard.bookingUpdatedDescription") || "Your booking has been updated.",
      })

      setIsEditModalOpen(false)
    } catch (error) {
      console.error("Error updating booking:", error)
      toast({
        title: "Error",
        description: "Failed to update booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Helper function to get service option status for a specific service
  const getServiceOptionStatus = (booking: Booking, serviceId?: string) => {
    if (!booking?.metadata?.options || !Array.isArray(booking.metadata.options)) return null

    if (serviceId) {
      const serviceOption = booking.metadata.options.find(
        (option: any) => option.service?.id === serviceId || option.serviceId === serviceId,
      )
      return serviceOption?.status || null
    }

    // If no specific service ID, return the first cancelled/rejected status found
    const cancelledOption = booking.metadata.options.find(
      (option: any) => option.status === "cancelled" || option.status === "rejected",
    )
    return cancelledOption?.status || null
  }

  const renderBookingCard = (booking: Booking) => {
    const venue = booking.venue
    const hasServiceIssues = hasCancelledServices(booking)
    const serviceIssueStatus = getServiceOptionStatus(booking)

    return (
      <Card key={booking.id} className="overflow-hidden">
        <div className="border-l-4 border-primary">
          <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 p-4">
            <div>
              <CardTitle className="text-base sm:text-lg">{venue?.name?.[language] || "Venue"}</CardTitle>
              <div className="flex items-center gap-2">
              <img src={formatImageUrl(venue?.media[0]?.url)} alt={venue?.name?.[language] || "Venue"} className="w-10 h-10 rounded-full" />
              <span className="text-xs sm:text-sm">{t(`venueBook.${booking.eventType}`)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(booking.status as BookingStatus)}
              {hasServiceIssues && (
                <Badge variant="outline" className="border-red-500 text-red-500 text-xs sm:text-sm">
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  {serviceIssueStatus === "rejected" ? "Service Rejected" : "Service Issues"}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid gap-2">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDateTime(`${booking.startDate}T${booking.startTime}`)}</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                <span>
                  {booking.numberOfGuests} {t("common.guests") || "guests"}
                </span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>
                  {venue?.address?.city}, {venue?.address?.country}
                </span>
              </div>
              <div className="flex items-center text-xs sm:text-sm">
                <CreditCard className="mr-2 h-4 w-4" />
                <span className="mr-2 font-medium">${booking.totalAmount}</span>
                <span className="text-xs text-muted-foreground">(Service Fee: ${booking.serviceFee})</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 justify-between">
              <div className="w-full sm:w-auto">
                {booking.id && (
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    <FileText className="mr-1 h-3 w-3" />
                    {booking.id.slice(0, 8)}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button size="sm" className="flex-1 sm:flex-none" onClick={() => handleViewBooking(booking)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {t("dashboard.viewDetails") || "View Details"}
                </Button>
                {(booking.status === "pending" || booking.status === "confirmed") && (
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => handleEditBooking(booking)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("dashboard.modifyBooking") || "Modify Booking"}
                  </Button>
                )}
                {booking.status === "pending" && (
                  <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => openCancelDialog(booking.id)}>
                    {t("dashboard.cancel") || "Cancel"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  const renderEmptyState = (tabType: string) => {
    const emptyStateConfig = {
      upcoming: {
        icon: Calendar,
        title: t("dashboard.noUpcomingBookings") || "No upcoming bookings",
        description:
          t("dashboard.noUpcomingBookingsDescription") ||
          "It looks like you don't have any upcoming bookings. Start exploring our venues to book your next event.",
        showBookButton: true,
      },
      past: {
        icon: Clock,
        title: t("dashboard.noPastBookings") || "No past bookings",
        description: t("dashboard.noPastBookingsDescription") || "You don't have any past bookings yet.",
        showBookButton: false,
      },
      cancelled: {
        icon: AlertTriangle,
        title: t("dashboard.noCancelledBookings") || "No cancelled bookings",
        description: t("dashboard.noCancelledBookingsDescription") || "You don't have any cancelled bookings.",
        showBookButton: false,
      },
      all: {
        icon: FileText,
        title: t("dashboard.noBookings") || "No bookings",
        description:
          t("dashboard.noBookingsDescription") ||
          "You don't have any bookings yet. Start exploring our venues to book your first event.",
        showBookButton: true,
      },
    }

    const config = emptyStateConfig[tabType as keyof typeof emptyStateConfig] || emptyStateConfig.all
    const IconComponent = config.icon

    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <IconComponent className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h3 className="mb-2 text-xl font-semibold">{config.title}</h3>
          <p className="mb-4 max-w-md text-muted-foreground">{config.description}</p>
          {config.showBookButton && (
            <Button asChild>
              <Link to="/venues">
                <CalendarPlus className="mr-2 h-4 w-4" />
                {t("dashboard.bookNow") || "Book Now"}
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="mb-6 flex flex-col space-y-2">
      <h1 className="text-3xl font-bold">{t("dashboard.myBookings") || "My Bookings"}</h1>
      <p className="text-muted-foreground">{t("dashboard.viewAndManageBookings") || "View and manage your bookings"}</p>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">{t("dashboard.upcoming") || "Upcoming"}</TabsTrigger>
          <TabsTrigger value="past">{t("dashboard.past") || "Past"}</TabsTrigger>
          <TabsTrigger value="cancelled">{t("dashboard.cancelled") || "Cancelled"}</TabsTrigger>
          <TabsTrigger value="all">{t("dashboard.all") || "All"}</TabsTrigger>
        </TabsList>

        {["upcoming", "past", "cancelled", "all"].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-6">
            {loadingBookings ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">{t("common.loading") || "Loading..."}</p>
                </CardContent>
              </Card>
            ) : (
              (() => {
                const tabBookings = getBookingsForTab(tabValue)
                return tabBookings.length === 0 ? renderEmptyState(tabValue) : tabBookings.map(renderBookingCard)
              })()
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Booking Modal */}
      {selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveBooking}
        />
      )}

      {/* View Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  )
}
