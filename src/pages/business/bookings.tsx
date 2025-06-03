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

export default function BusinessBookingsPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  const [venues, setVenues] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Calculate venue price based on pricing type
  const calculateVenuePrice = (booking: any) => {
    if (!booking.venuePrice) return 0

    const basePrice = booking.venuePrice.amount || 0
    const priceType = booking.venuePrice.type || "FIXED"

    let calculatedPrice = basePrice
    if (priceType === "PER_PERSON" || priceType === "PERPERSON") {
      calculatedPrice = basePrice * booking.numberOfGuests
    } else if (priceType === "PER_HOUR" || priceType === "PERHOUR") {
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
    if (!priceType) return "Fixed Rate"

    const type = priceType.toUpperCase()
    if (type === "PER_PERSON" || type === "PERPERSON") {
      return "Per Person"
    } else if (type === "PER_HOUR" || type === "PERHOUR") {
      return "Per Hour"
    }
    return "Fixed Rate"
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
            const venuePrice = venue.pricing || { amount: 0, type: "FIXED" }

            // Create booking with venue information
            const enhancedBooking = {
              ...booking,
              venueName: venue.name,
              image: formatImageUrl(venue.media?.[0]?.url || "/placeholder.svg?height=80&width=80&text=Venue"),
              venueId: venue.id,
              venuePrice: venuePrice,
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

        console.log("allBookings", allBookings)
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

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startDate).getUTCDate()
    const today = new Date().getUTCDate()

    if (activeTab === "upcoming") {
      return bookingDate >= today && (booking.status === "confirmed" || booking.status === "pending")
    } else if (activeTab === "completed") {
      return booking.status === "completed"
    } else if (activeTab === "cancelled") {
      return booking.status === "cancelled"
    }

    return true
  })
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
    console.log(`Updating booking ${updatedBooking.id}`, updatedBooking)

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
    console.log(`Cancelling booking ${bookingToCancel}`)

    toast({
      title: t("business.bookings.bookingCancelled") || "Booking Cancelled",
      description: t("business.bookings.bookingCancelledDescription") || "The booking has been cancelled.",
      variant: "default",
    })

    setIsCancelModalOpen(false)
    setBookingToCancel(null)
  }

  const handleApproveBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingVenueStatus(bookingId, "confirmed")
      // Refresh venues data
      const venueDetails = await venueService.getVenueByOwner()
      setVenues(venueDetails)
      setIsViewModalOpen(false)
      toast({
        title: "Booking Approved",
        description: "The booking has been successfully approved.",
      })
    } catch (error) {
      console.error("Error approving booking:", error)
      toast({
        title: "Error",
        description: "Failed to approve booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingVenueStatus(bookingId, "cancelled")
      // Refresh venues data
      const venueDetails = await venueService.getVenueByOwner()
      setVenues(venueDetails)
      setIsViewModalOpen(false)
      toast({
        title: "Booking Declined",
        description: "The booking has been declined.",
      })
    } catch (error) {
      console.error("Error declining booking:", error)
      toast({
        title: "Error",
        description: "Failed to decline booking. Please try again.",
        variant: "destructive",
      })
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

  return (
    <BusinessLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("business.bookings.title") || "Venue Bookings"}</h1>
        <p className="text-muted-foreground">{t("business.bookings.subtitle") || "Manage your venue bookings"}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("business.bookings.searchBookings") || "Search bookings..."} className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary">
            <Calendar className="mr-2 h-4 w-4" />
            {t("business.bookings.filterByDate") || "Filter by Date"}
          </Button>
          <Button variant="outline" className="transition-all hover:bg-primary/10 hover:text-primary">
            <Clock className="mr-2 h-4 w-4" />
            {t("business.bookings.export") || "Export"}
          </Button>
        </div>
      </div>

      {/* Venues Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t("business.bookings.venuesOverview") || "Bookings by Venue"}</h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg p-4 h-32" />
            ))}
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
                        {selectedBooking.startDate}{" "}
                        {selectedBooking.endDate !== selectedBooking.startDate && `- ${selectedBooking.endDate}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.time")}</h4>
                      <p>
                        {selectedBooking.startTime} - {selectedBooking.endTime}
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
                              <span>Calculation:</span>
                              <span>
                                ${basePrice.toFixed(2)} × {selectedBooking.numberOfGuests} guests
                              </span>
                            </div>
                          )
                        } else if (priceType === "PER_HOUR" || priceType === "PERHOUR") {
                          const startTime = new Date(`2000-01-01 ${selectedBooking.startTime}`)
                          const endTime = new Date(`2000-01-01 ${selectedBooking.endTime}`)
                          const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
                          return (
                            <div className="flex justify-between">
                              <span>Calculation:</span>
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

                    <Separator />

                    {/* Total Booking Amount */}
                    <div className="flex justify-between font-bold">
                      <span>{t("business.bookings.totalBookingAmount") || "Total Booking Amount"}</span>
                      <span>${Number.parseFloat(selectedBooking.totalAmount).toFixed(2)}</span>
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
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-12 bg-secondary/30 rounded-lg">
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? "No upcoming bookings at the moment"
                    : activeTab === "completed"
                      ? "No completed bookings yet"
                      : activeTab === "cancelled"
                        ? "No cancelled bookings"
                        : "No bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.venueName[language] || booking.venueName.en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{booking.eventType || "Event"}</h3>
                        <div className="text-sm text-muted-foreground">
                          {booking.venueName[language] || booking.venueName.en}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <div className="flex items-center text-xs">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            <User className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.customer.name}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.numberOfGuests} guests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end justify-between">
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-semibold">${Number.parseFloat(booking.totalAmount).toFixed(2)}</div>
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveBooking(booking.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              {t("business.bookings.approve") || "Approve"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineBooking(booking.id)}
                            >
                              <X className="mr-1 h-3 w-3" />
                              {t("business.bookings.decline") || "Decline"}
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
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-12 bg-secondary/30 rounded-lg">
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? "No upcoming bookings at the moment"
                    : activeTab === "completed"
                      ? "No completed bookings yet"
                      : activeTab === "cancelled"
                        ? "No cancelled bookings"
                        : "No bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.venueName[language] || booking.venueName.en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{booking.eventType || "Event"}</h3>
                        <div className="text-sm text-muted-foreground">
                          {booking.venueName[language] || booking.venueName.en}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <div className="flex items-center text-xs">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            <User className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.customer.name}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.numberOfGuests} guests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end justify-between">
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-semibold">${Number.parseFloat(booking.totalAmount).toFixed(2)}</div>
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveBooking(booking.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              {t("business.bookings.approve") || "Approve"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineBooking(booking.id)}
                            >
                              <X className="mr-1 h-3 w-3" />
                              {t("business.bookings.decline") || "Decline"}
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
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-12 bg-secondary/30 rounded-lg">
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? "No upcoming bookings at the moment"
                    : activeTab === "completed"
                      ? "No completed bookings yet"
                      : activeTab === "cancelled"
                        ? "No cancelled bookings"
                        : "No bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.venueName[language] || booking.venueName.en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{booking.eventType || "Event"}</h3>
                        <div className="text-sm text-muted-foreground">
                          {booking.venueName[language] || booking.venueName.en}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <div className="flex items-center text-xs">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            <User className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.customer.name}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.numberOfGuests} guests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end justify-between">
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-semibold">${Number.parseFloat(booking.totalAmount).toFixed(2)}</div>
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveBooking(booking.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              {t("business.bookings.approve") || "Approve"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineBooking(booking.id)}
                            >
                              <X className="mr-1 h-3 w-3" />
                              {t("business.bookings.decline") || "Decline"}
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
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="text-center py-12 bg-secondary/30 rounded-lg">
                <h3 className="text-lg font-medium">No bookings found</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? "No upcoming bookings at the moment"
                    : activeTab === "completed"
                      ? "No completed bookings yet"
                      : activeTab === "cancelled"
                        ? "No cancelled bookings"
                        : "No bookings available"}
                </p>
              </div>
            )}
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                <div className="p-4">
                  <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <div className="flex items-start gap-4">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={booking.image || "/placeholder.svg"}
                          alt={booking.venueName[language] || booking.venueName.en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid gap-1">
                        <h3 className="font-semibold">{booking.eventType || "Event"}</h3>
                        <div className="text-sm text-muted-foreground">
                          {booking.venueName[language] || booking.venueName.en}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <div className="flex items-center text-xs">
                            <Calendar className="mr-1 h-3.5 w-3.5" />
                            <span>{new Date(booking.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Clock className="mr-1 h-3.5 w-3.5" />
                            <span>
                              {booking.startTime} - {booking.endTime}
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            <User className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.customer.name}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            <Users className="mr-1 h-3.5 w-3.5" />
                            <span>{booking.numberOfGuests} guests</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end justify-between">
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-semibold">${Number.parseFloat(booking.totalAmount).toFixed(2)}</div>
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                              onClick={() => handleApproveBooking(booking.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              {t("business.bookings.approve") || "Approve"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeclineBooking(booking.id)}
                            >
                              <X className="mr-1 h-3 w-3" />
                              {t("business.bookings.decline") || "Decline"}
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
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </BusinessLayout>
  )
}
