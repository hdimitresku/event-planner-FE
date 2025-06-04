"use client"

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
  MapPin,
  CheckCircle,
  XCircle,
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

  const [services, setServices] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

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
    const bookingDate = new Date(booking.startDate).toISOString().split("T")[0]
    const today = new Date().toISOString().split("T")[0]
    const serviceStatus = getServiceStatus(booking)

    if (activeTab === "upcoming") {
      if (booking.status != BookingStatus.CONFIRMED && booking.status != BookingStatus.PENDING) {
        return false
      }
      if (bookingDate < today) {
        return false
      }
      return true
    } else if (activeTab === "completed") {
      return booking.status === BookingStatus.COMPLETED
    } else if (activeTab === "cancelled") {
      // Show all bookings with cancelled/rejected services, regardless of overall booking status
      return serviceStatus === "rejected" || serviceStatus === "cancelled"
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
                      onClick={() => handleApproveBooking(selectedBooking)}
                    >
                      <Check className="mr-1 h-4 w-4" />
                      {t("business.bookings.approve") || "Accept Service"}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => openDeclineDialog(selectedBooking)}
                    >
                      <X className="mr-1 h-4 w-4" />
                      {t("business.bookings.decline") || "Reject Service"}
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

      {/* Decline Booking Dialog with Reason */}
      <Dialog open={isDeclineModalOpen} onOpenChange={setIsDeclineModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("business.serviceBookings.declineBooking") || "Decline Service Booking"}
            </DialogTitle>
            <DialogDescription>
              {t("business.serviceBookings.declineBookingDescription") ||
                "Please provide a reason for declining this booking. This will be shared with the customer."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Rejection Reason</h4>
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
            <Button variant="outline" onClick={() => setIsDeclineModalOpen(false)}>
              {t("business.common.cancel") || "Cancel"}
            </Button>
            <Button variant="destructive" onClick={handleDeclineBooking} disabled={!rejectionReason.trim()}>
              {t("business.serviceBookings.confirmDecline") || "Decline Booking"}
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
                <h3 className="text-lg font-medium">
                  {t("business.serviceBookings.noBookingsFound") || "No service bookings found"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? t("business.serviceBookings.noUpcomingBookings") || "No upcoming service bookings at the moment"
                    : activeTab === "completed"
                      ? t("business.serviceBookings.noCompletedBookings") || "No completed service bookings yet"
                      : activeTab === "cancelled"
                        ? t("business.serviceBookings.noCancelledBookings") || "No cancelled service bookings"
                        : t("business.serviceBookings.noBookingsAvailable") || "No service bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              const serviceStatus = getServiceStatus(booking)
              const hasServiceOptions =
                booking?.metadata?.options &&
                Array.isArray(booking.metadata.options) &&
                booking.metadata.options.some(
                  (option: any) =>
                    (option.service?.id === booking.serviceId || option.serviceId === booking.serviceId) &&
                    option.status,
                )

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
                          <div className="text-sm text-muted-foreground">
                            {t(`venueBook.${booking.eventType}`) || "Service Booking"}
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
                          <div className="font-semibold">${servicePrice.serviceTotal.toFixed(2)}</div>
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
                        </div>
                        <div className="flex gap-2">
                          {!hasServiceOptions && booking.status !== "cancelled" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handleApproveBooking(booking)}
                              >
                                <Check className="mr-1 h-3 w-3" />
                                {t("business.bookings.approve") || "Accept"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => openDeclineDialog(booking)}
                              >
                                <X className="mr-1 h-3 w-3" />
                                {t("business.bookings.decline") || "Reject"}
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
                <h3 className="text-lg font-medium">
                  {t("business.serviceBookings.noBookingsFound") || "No service bookings found"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? t("business.serviceBookings.noUpcomingBookings") || "No upcoming service bookings at the moment"
                    : activeTab === "completed"
                      ? t("business.serviceBookings.noCompletedBookings") || "No completed service bookings yet"
                      : activeTab === "cancelled"
                        ? t("business.serviceBookings.noCancelledBookings") || "No cancelled service bookings"
                        : t("business.serviceBookings.noBookingsAvailable") || "No service bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              const serviceStatus = getServiceStatus(booking)

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
                          <div className="font-semibold">${servicePrice.serviceTotal.toFixed(2)}</div>
                          <div className="flex gap-2">
                            <Badge className={getStatusBadgeClass(booking.status)}>
                              {t("business.bookings.completed") || "Completed"}
                            </Badge>
                            {getServiceStatusBadge(serviceStatus)}
                          </div>
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
                <h3 className="text-lg font-medium">
                  {t("business.serviceBookings.noBookingsFound") || "No service bookings found"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? t("business.serviceBookings.noUpcomingBookings") || "No upcoming service bookings at the moment"
                    : activeTab === "completed"
                      ? t("business.serviceBookings.noCompletedBookings") || "No completed service bookings yet"
                      : activeTab === "cancelled"
                        ? t("business.serviceBookings.noCancelledBookings") || "No cancelled service bookings"
                        : t("business.serviceBookings.noBookingsAvailable") || "No service bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              const serviceStatus = getServiceStatus(booking)

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
                          <div className="font-semibold">${servicePrice.serviceTotal.toFixed(2)}</div>
                          <div className="flex gap-2">
                            <Badge className={getStatusBadgeClass(booking.status)}>
                              {booking.status === "cancelled"
                                ? t("business.bookings.cancelled") || "Cancelled"
                                : booking.status === "confirmed"
                                  ? t("business.bookings.confirmed") || "Confirmed"
                                  : booking.status === "pending"
                                    ? t("business.bookings.pending") || "Pending"
                                    : booking.status === "completed"
                                      ? t("business.bookings.completed") || "Completed"
                                      : t("business.bookings.cancelled") || "Cancelled"}
                            </Badge>
                            {getServiceStatusBadge(serviceStatus)}
                          </div>
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
                <h3 className="text-lg font-medium">
                  {t("business.serviceBookings.noBookingsFound") || "No service bookings found"}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {activeTab === "upcoming"
                    ? t("business.serviceBookings.noUpcomingBookings") || "No upcoming service bookings at the moment"
                    : activeTab === "completed"
                      ? t("business.serviceBookings.noCompletedBookings") || "No completed service bookings yet"
                      : activeTab === "cancelled"
                        ? t("business.serviceBookings.noCancelledBookings") || "No cancelled service bookings"
                        : t("business.serviceBookings.noBookingsAvailable") || "No service bookings available"}
                </p>
              </div>
            )}
            {filteredBookings.map((booking) => {
              const servicePrice = calculateServicePrice(booking)
              const serviceStatus = getServiceStatus(booking)
              const hasServiceOptions =
                booking?.metadata?.options &&
                Array.isArray(booking.metadata.options) &&
                booking.metadata.options.some(
                  (option: any) =>
                    (option.service?.id === booking.serviceId || option.serviceId === booking.serviceId) &&
                    option.status,
                )

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
                          <div className="font-semibold">${servicePrice.serviceTotal.toFixed(2)}</div>
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
                        </div>
                        <div className="flex gap-2">
                          {!hasServiceOptions && booking.status !== "cancelled" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handleApproveBooking(booking)}
                              >
                                <Check className="mr-1 h-3 w-3" />
                                {t("business.bookings.approve") || "Accept"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => openDeclineDialog(booking)}
                              >
                                <X className="mr-1 h-3 w-3" />
                                {t("business.bookings.decline") || "Reject"}
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
