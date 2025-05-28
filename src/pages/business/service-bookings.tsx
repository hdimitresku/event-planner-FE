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
  MapPin,
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

// Helper function to get the appropriate icon based on service type
const getServiceIcon = (type: string, iconName: string) => {
  if (iconName === "Car") return <Car className="h-8 w-8 text-primary" />
  if (iconName === "Utensils") return <Utensils className="h-8 w-8 text-primary" />
  if (iconName === "Music") return <Music className="h-8 w-8 text-primary" />
  if (iconName === "Palette") return <Palette className="h-8 w-8 text-primary" />

  // Default icons based on type if no specific icon is provided
  switch (type) {
    case "transportation":
      return <Car className="h-8 w-8 text-primary" />
    case "catering":
      return <Utensils className="h-8 w-8 text-primary" />
    case "music":
      return <Music className="h-8 w-8 text-primary" />
    case "decoration":
      return <Palette className="h-8 w-8 text-primary" />
    default:
      return <Utensils className="h-8 w-8 text-primary" />
  }
}

// Helper function to calculate service price for this specific service only
const calculateServicePrice = (booking: any) => {
  if (!booking.serviceOptions || booking.serviceOptions.length === 0) {
    return 0
  }

  // Filter service options to only include the current service
  const currentServiceOptions = booking.serviceOptions.filter((option: any) => option.service?.id === booking.serviceId)

  let serviceTotal = 0
  currentServiceOptions.forEach((option: any) => {
    if (option.price?.type === "perPerson") {
      serviceTotal += option.price.amount * booking.numberOfGuests
    } else {
      serviceTotal += option.price?.amount || 0
    }
  })

  return serviceTotal
}

export default function ServiceBookingsPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  const [services, setServices] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch service bookings
  useEffect(() => {
    const fetchServiceBookings = async () => {
      try {
        setLoading(true)
        const serviceData = await bookingService.getServiceBookings()
        console.log("serviceData", serviceData)

        // Store the services
        setServices(serviceData)

        // Extract all bookings from all services
        const allBookings: any[] = []
        serviceData.forEach((service: any) => {
          if (service.bookings && service.bookings.length > 0) {
            service.bookings.forEach((booking: any) => {
              // Enhance booking with service information
              allBookings.push({
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
              })
            })
          }
        })

        setBookings(allBookings)
      } catch (err) {
        setError("Failed to fetch service bookings")
        console.error("Error fetching service bookings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    // First apply search filter if any
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const customerName = booking.customer?.name?.toLowerCase() || ""
      const serviceName = (booking.serviceName?.[language] || booking.serviceName?.en || "").toLowerCase()
      const bookingId = booking.id?.toLowerCase() || ""

      if (
        !customerName.includes(searchLower) &&
        !serviceName.includes(searchLower) &&
        !bookingId.includes(searchLower)
      ) {
        return false
      }
    }

    // Then apply tab filter
    const bookingDate = new Date(booking.startDate)
    const today = new Date()

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
    console.log(`Updating service booking ${updatedBooking.id}`, updatedBooking)

    toast({
      title: t("business.bookings.bookingUpdated") || "Booking Updated",
      description:
        t("business.bookings.bookingUpdatedDescription") || "The service booking has been successfully updated.",
      variant: "default",
    })

    setIsEditModalOpen(false)
  }

  const openCancelDialog = (bookingId: string) => {
    setBookingToCancel(bookingId)
    setIsCancelModalOpen(true)
  }

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return

    try {
      await bookingService.updateBookingVenueStatus(bookingToCancel, "cancelled")

      // Update local state
      setBookings(
        bookings.map((booking) => (booking.id === bookingToCancel ? { ...booking, status: "cancelled" } : booking)),
      )

      toast({
        title: t("business.bookings.bookingCancelled") || "Booking Cancelled",
        description: t("business.bookings.bookingCancelledDescription") || "The service booking has been cancelled.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelModalOpen(false)
      setBookingToCancel(null)
    }
  }

  const handleApproveBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingVenueStatus(bookingId, "confirmed")

      // Update local state
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "confirmed" } : booking)))

      setIsViewModalOpen(false)
      toast({
        title: "Service Booking Approved",
        description: "The service booking has been successfully approved.",
      })
    } catch (error) {
      console.error("Error approving service booking:", error)
      toast({
        title: "Error",
        description: "Failed to approve service booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeclineBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingVenueStatus(bookingId, "cancelled")

      // Update local state
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))

      setIsViewModalOpen(false)
      toast({
        title: "Service Booking Declined",
        description: "The service booking has been declined.",
      })
    } catch (error) {
      console.error("Error declining service booking:", error)
      toast({
        title: "Error",
        description: "Failed to decline service booking. Please try again.",
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

      {/* Services Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("business.serviceBookings.servicesOverview") || "Bookings by Service"}
        </h2>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg p-4 h-32" />
            ))}
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
              {t("business.serviceBookings.cancelBooking") || "Cancel Service Booking"}
            </DialogTitle>
            <DialogDescription>
              {t("business.serviceBookings.cancelBookingConfirmation") ||
                "Are you sure you want to cancel this service booking? This action cannot be undone."}
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
              {t("business.serviceBookings.confirmCancel") || "Yes, Cancel Booking"}
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
                <h3 className="text-lg font-medium">No service bookings found</h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? "No upcoming service bookings at the moment"
                    : activeTab === "completed"
                      ? "No completed service bookings yet"
                      : activeTab === "cancelled"
                        ? "No cancelled service bookings"
                        : "No service bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              return (
                <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center">
                          {getServiceIcon(booking.serviceType, booking.serviceIcon)}
                        </div>
                        <div className="grid gap-1">
                          <h3 className="font-semibold">{booking.serviceName[language] || booking.serviceName.en}</h3>
                          <div className="text-sm text-muted-foreground">{booking.eventType || "Service Booking"}</div>
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
                          <div className="font-semibold">${servicePrice.toFixed(2)}</div>
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
              )
            })}
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
                <h3 className="text-lg font-medium">No service bookings found</h3>
                <p className="text-muted-foreground mt-2">No completed service bookings yet</p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              return (
                <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center">
                          {getServiceIcon(booking.serviceType, booking.serviceIcon)}
                        </div>
                        <div className="grid gap-1">
                          <h3 className="font-semibold">{booking.serviceName[language] || booking.serviceName.en}</h3>
                          <div className="text-sm text-muted-foreground">{booking.eventType || "Service Booking"}</div>
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
                          <div className="font-semibold">${servicePrice.toFixed(2)}</div>
                          <Badge className={getStatusBadgeClass(booking.status)}>
                            {t("business.bookings.completed") || "Completed"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                            {t("business.common.view") || "View"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
                <h3 className="text-lg font-medium">No service bookings found</h3>
                <p className="text-muted-foreground mt-2">No cancelled service bookings</p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              return (
                <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center">
                          {getServiceIcon(booking.serviceType, booking.serviceIcon)}
                        </div>
                        <div className="grid gap-1">
                          <h3 className="font-semibold">{booking.serviceName[language] || booking.serviceName.en}</h3>
                          <div className="text-sm text-muted-foreground">{booking.eventType || "Service Booking"}</div>
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
                          <div className="font-semibold">${servicePrice.toFixed(2)}</div>
                          <Badge className={getStatusBadgeClass(booking.status)}>
                            {t("business.bookings.cancelled") || "Cancelled"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewBooking(booking)}>
                            {t("business.common.view") || "View"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
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
                <h3 className="text-lg font-medium">No service bookings found</h3>
                <p className="text-muted-foreground mt-2">No service bookings available</p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              return (
                <div key={booking.id} className="bg-background border rounded-lg shadow-sm">
                  <div className="p-4">
                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                      <div className="flex items-start gap-4">
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-primary/10 flex items-center justify-center">
                          {getServiceIcon(booking.serviceType, booking.serviceIcon)}
                        </div>
                        <div className="grid gap-1">
                          <h3 className="font-semibold">{booking.serviceName[language] || booking.serviceName.en}</h3>
                          <div className="text-sm text-muted-foreground">{booking.eventType || "Service Booking"}</div>
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
                          <div className="font-semibold">${servicePrice.toFixed(2)}</div>
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
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </BusinessLayout>
  )
}
