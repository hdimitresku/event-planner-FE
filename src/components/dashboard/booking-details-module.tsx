"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Separator } from "../../components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  AlertTriangle,
  DollarSign,
  Utensils,
  Music,
  Sparkles,
  Camera,
  Video,
  Car,
  ShieldCheck,
  PartyPopper,
  Lightbulb,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { useLanguage } from "../../context/language-context"
import { useCurrency } from "../../context/currency-context"
import { type Booking, BookingStatus, PaymentStatus } from "../../models/booking"
import * as serviceService from "../../services/serviceService"

interface BookingDetailsModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

interface CancelledService {
  id: string
  serviceId: string
  optionId: string
  name?: string
  icon?: string
  optionName?: string
  price?: {
    type: string
    amount: number
    currency: string
  }
  rejectionReason: string
  loading: boolean
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  const { t, language } = useLanguage()
  const { formatPrice } = useCurrency()
  const [cancelledServices, setCancelledServices] = useState<CancelledService[]>([])
  const [loadingServices, setLoadingServices] = useState(false)

  useEffect(() => {
    if (isOpen && booking) {
      // Reset cancelled services when opening a new booking
      setCancelledServices([])
      setLoadingServices(false)
      fetchCancelledServiceDetails()
    }
  }, [isOpen, booking]) // Updated dependency array to use booking directly

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCancelledServices([])
      setLoadingServices(false)
    }
  }, [isOpen])

  const fetchCancelledServiceDetails = async () => {
    if (!booking?.metadata?.options) {
      setCancelledServices([])
      return
    }

    try {
      setLoadingServices(true)

      // Check if metadata.options contains cancelled services
      const options = booking.metadata.options

      // Handle both array and object formats
      const optionsArray = Array.isArray(options) ? options : [options]

      const cancelledServicesData: CancelledService[] = []

      for (const option of optionsArray) {
        if (option.status === "cancelled") {
          // Add to cancelled services with loading state
          const cancelledService: CancelledService = {
            id: option.id,
            serviceId: option.serviceId,
            optionId: option.id,
            rejectionReason: option.rejectionReason || "No reason provided",
            loading: true,
          }
          cancelledServicesData.push(cancelledService)

          // Fetch service details
          const service = await serviceService.getServiceById(option.serviceId)
          const serviceOption = await serviceService.getServiceOptionById(option.serviceId, option.id)
          // Update cancelled service with fetched details
          if (service) {
            cancelledService.name = service.name?.[language] || service.name?.en || "Unknown Service"
            cancelledService.icon = service.icon
          }

          if (serviceOption) {
            cancelledService.optionName =
              serviceOption.option.name?.[language] || serviceOption.option.name?.en || "Unknown Option"
            cancelledService.price = serviceOption.option.price
          }

          cancelledService.loading = false
        }
      }
      setCancelledServices(cancelledServicesData)
    } catch (error) {
      console.error("Error fetching cancelled service details:", error)
      setCancelledServices([])
    } finally {
      setLoadingServices(false)
    }
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

  // Get service icon for service options
  const getServiceOptionIcon = (serviceOption: any) => {
    // Try to find the service icon from the service options data
    // This would typically come from the service data, but for now we'll use a mapping
    const serviceTypeIcons: Record<string, React.ElementType> = {
      catering: Utensils,
      music: Music,
      decoration: Sparkles,
      photography: Camera,
      videography: Video,
      transportation: Car,
      security: ShieldCheck,
      entertainment: PartyPopper,
      lighting: Lightbulb,
    }

    // Try to match by service option name or type
    const optionName = (serviceOption.name?.[language] || serviceOption.name?.en || "").toLowerCase()

    for (const [key, IconComponent] of Object.entries(serviceTypeIcons)) {
      if (optionName.includes(key)) {
        return IconComponent
      }
    }

    return Info
  }

  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"

    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) return url

    // If it's a relative path, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

  // Calculate venue price based on pricing type
  const calculateVenuePrice = () => {
    if (!booking.venue?.price.amount) return 0

    const pricing = booking.venue.price
    const numberOfGuests = booking.numberOfGuests || 1

    switch (pricing.type) {
      case "perPerson":
        return pricing.amount * numberOfGuests
      case "hourly":
        // Calculate hours between start and end time
        const startTime = new Date(`2000-01-01T${booking.startTime}`)
        const endTime = new Date(`2000-01-01T${booking.endTime}`)
        const hours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))
        return pricing.amount * hours
      case "fixed":
      default:
        return pricing.amount
    }
  }

  // Calculate service options total
  const calculateServiceOptionsTotal = () => {
    if (!booking.serviceOptions || booking.serviceOptions.length === 0) return 0

    let total = 0
    booking.serviceOptions.forEach((option: any) => {
      if (option.price && booking.metadata?.options?.find((o) => o.id === option.id)?.status !== "cancelled") {
        if (option.price.type === "perPerson") {
          total += option.price.amount * (booking.numberOfGuests || 1)
        } else {
          total += option.price.amount
        }
      }
    })

    return total
  }

  // Calculate total booking price
  const calculateTotalPrice = () => {
    const venuePrice = calculateVenuePrice()
    const serviceOptionsTotal = calculateServiceOptionsTotal()
    const serviceFee = Number.parseFloat(booking.serviceFee?.toString() || "0")
    const discount = Number.parseFloat(booking.discount?.toString() || "0")

    return venuePrice + serviceOptionsTotal + serviceFee - discount
  }

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return (
          <Badge className="bg-emerald-500/90 dark:bg-emerald-600/90 text-white hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70">
            {t("bookings.status.confirmed") || "Confirmed"}
          </Badge>
        )
      case BookingStatus.PENDING:
        return (
          <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">
            {t("bookings.status.pending") || "Pending"}
          </Badge>
        )
      case BookingStatus.COMPLETED:
        return (
          <Badge className="bg-info text-info-foreground hover:bg-info/80">
            {t("bookings.status.completed") || "Completed"}
          </Badge>
        )
      case BookingStatus.CANCELLED:
        return (
          <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/80">
            {t("bookings.status.cancelled") || "Cancelled"}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.PAID:
        return (
          <Badge className="bg-emerald-500/90 dark:bg-emerald-600/90 text-white hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70">
            {t("bookings.paymentStatus.paid") || "Paid"}
          </Badge>
        )
      case PaymentStatus.PARTIALLY_PAID:
        return (
          <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">
            {t("bookings.paymentStatus.partiallyPaid") || "Partially Paid"}
          </Badge>
        )
      case PaymentStatus.PENDING:
        return (
          <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">
            {t("bookings.paymentStatus.pending") || "Pending"}
          </Badge>
        )
      case PaymentStatus.REFUNDED:
        return (
          <Badge className="bg-muted text-muted-foreground">{t("bookings.paymentStatus.refunded") || "Refunded"}</Badge>
        )
      case PaymentStatus.FAILED:
        return (
          <Badge className="bg-destructive text-destructive-foreground hover:bg-destructive/80">
            {t("bookings.paymentStatus.failed") || "Failed"}
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, "dd/MM")
    } catch (error) {
      return dateTimeString
    }
  }

  const formatTime = (timeString: string) => {
    try {
      return timeString.slice(0, 5)
    } catch (error) {
      return timeString
    }
  }

  console.log(booking.startTime)
  console.log(booking.endTime)

  if (!booking) return null

  const venue = booking.venue
  const venuePrice = calculateVenuePrice()
  const serviceOptionsTotal = calculateServiceOptionsTotal()
  const totalPrice = calculateTotalPrice()

  const getVenueTypeBadge = (type: string) => {
    return {
      text: t(`business.venueTypes.${type.toLowerCase()}`) || type,
      bgColor: "bg-primary dark:bg-secondary text-white hover:bg-primary/90 dark:hover:bg-secondary/90",
    }
  }

  const getEventTypeBadge = (type: string) => {
    return {
      text: t(`venueBook.${type.toLowerCase()}`) || type,
      bgColor: "bg-primary dark:bg-secondary text-white hover:bg-primary/90 dark:hover:bg-secondary/90",
    }
  }

  const getPriceTypeBadge = (priceType: string) => {
    switch (priceType.toLowerCase()) {
      case "perperson":
      case "per_person":
        return {
          text: t("business.pricing.perPerson") || "Per Person",
          bgColor: "bg-primary dark:bg-secondary text-white hover:bg-primary/90 dark:hover:bg-secondary/90",
        }
      case "hourly":
      case "perhour":
      case "per_hour":
        return {
          text: t("business.pricing.perHour") || "Per Hour",
          bgColor: "bg-primary dark:bg-secondary text-white hover:bg-primary/90 dark:hover:bg-secondary/90",
        }
      case "fixed":
      default:
        return {
          text: t("business.pricing.fixed") || "Fixed",
          bgColor: "bg-primary dark:bg-secondary text-white hover:bg-primary/90 dark:hover:bg-secondary/90",
        }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("dashboard.bookingDetails") || "Booking Details"}</DialogTitle>
        </DialogHeader>

        {/* Cancelled Services Alert - Only show if there are cancelled services */}
        {cancelledServices.length > 0 && (
          <Alert className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("dashboard.cancelledServices") || "Cancelled Services"}</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-3">
                {cancelledServices.map((service) => {
                  // Get the icon component for the service
                  const IconComponent = getIconByName(service.icon || "Info")

                  return (
                    <div
                      key={service.id}
                      className="rounded-md bg-destructive/10 dark:bg-destructive/20 p-3 border border-destructive/50"
                    >
                      <div className="flex items-center">
                        {/* Icon Container */}
                        <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mr-3">
                          <IconComponent className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                        </div>
                        {/* Service Name */}
                        <div className="font-medium text-foreground dark:text-muted-foreground">
                          {service.name || "Service"}
                        </div>
                      </div>
                      {service.optionName && (
                        <div className="text-sm text-foreground dark:text-muted-foreground/80">
                          {service.optionName}
                        </div>
                      )}
                      {service.price && (
                        <div className="mt-1 text-sm text-foreground dark:text-muted-foreground/80">
                          {formatPrice(service.price.amount, service.price.currency)} ({service.price.type})
                        </div>
                      )}
                      <div className="mt-2 rounded-sm p-2 text-sm border border-destructive/50">
                        <span className="font-medium text-foreground dark:text-muted-foreground">
                          {t("dashboard.reason")}:{" "}
                        </span>
                        <span className="text-foreground dark:text-muted-foreground">{service.rejectionReason}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading indicator for services */}
        {loadingServices && (
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span className="ml-2">Loading service details...</span>
          </div>
        )}

        <div className="grid gap-6">
          {/* Booking Status */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{t("dashboard.bookingId") || "Booking ID"}</h3>
              <p className="text-sm text-muted-foreground">{booking.id}</p>
            </div>
            <div className="flex items-center gap-2">{getStatusBadge(booking.status as BookingStatus)}</div>
          </div>

          <Separator />

          {/* Venue Details */}
          <div>
            <h3 className="mb-2 text-lg font-medium">{t("dashboard.venueDetails") || "Venue Details"}</h3>
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-md">
                  <img
                    src={formatImageUrl(venue?.media?.[0]?.url) || "/placeholder.svg?height=64&width=64"}
                    alt={venue?.name?.[language] || "Venue"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-medium">{venue?.name?.[language] || "Venue"}</h4>
                    <Badge className={`${getVenueTypeBadge(venue?.type || "").bgColor}`}>
                      {getVenueTypeBadge(venue?.type || "").text}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriceTypeBadge(venue?.price?.type || "fixed").bgColor}`}>
                      {getPriceTypeBadge(venue?.price?.type || "fixed").text}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(venue?.price?.amount || 0, venue?.price?.currency || "USD")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{formatDateTime(`${booking.startDate}`) + " - " + formatDateTime(`${booking.endDate}`)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {venue?.address?.street}, {venue?.address?.city}, {venue?.address?.country}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <PartyPopper className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <span>{t("dashboard.eventType") || "Event Type"}:</span>
                    <Badge className={`${getEventTypeBadge(booking.eventType || "").bgColor}`}>
                      {getEventTypeBadge(booking.eventType || "").text}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div>
            <h3 className="mb-2 text-lg font-medium">{t("dashboard.customerDetails") || "Customer Details"}</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>
                    {booking.metadata?.contactDetails?.firstName?.charAt(0) ||
                      booking.metadata?.contactDetails?.email?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">
                    {booking.metadata?.contactDetails?.firstName}{" "}
                    {booking.metadata?.contactDetails?.lastName || "Customer"}
                  </h4>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{booking.metadata?.contactDetails?.email || "N/A"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{booking.metadata?.contactDetails?.phone || "N/A"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.numberOfGuests} {t("common.guests") || "guests"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Options */}
          {booking.serviceOptions && booking.serviceOptions.length > 0 && (
            <div>
              <h3 className="mb-2 text-lg font-medium">{t("dashboard.serviceOptions") || "Service Options"}</h3>
              <div className="rounded-lg border p-4">
                <div className="space-y-3">
                  {booking.serviceOptions.map((option: any, index: number) => {
                    const IconComponent = getIconByName(option.service?.icon)

                    // Get the status from booking metadata if available
                    const getOptionStatus = () => {
                      if (booking?.metadata?.options) {
                        const options = Array.isArray(booking.metadata.options)
                          ? booking.metadata.options
                          : [booking.metadata.options]
                        const matchingOption = options.find(
                          (opt) => opt.id === option.id || opt.serviceId === option.service?.id,
                        )
                        return matchingOption?.status || null
                      }
                      return null
                    }

                    const optionStatus = getOptionStatus()

                    const getOptionStatusBadge = (status: string | null) => {
                      if (!status) return null

                      switch (status) {
                        case "accepted":
                        case "confirmed":
                          return (
                            <Badge className="bg-green-500/90 dark:bg-green-600/90 text-white text-xs">
                              <CheckCircle className="mr-1 h-2.5 w-2.5" />
                              Approved
                            </Badge>
                          )
                        case "rejected":
                        case "cancelled":
                          return (
                            <Badge className="bg-red-500/90 dark:bg-red-600/90 text-white text-xs">
                              <XCircle className="mr-1 h-2.5 w-2.5" />
                              Cancelled
                            </Badge>
                          )
                        case "pending":
                          return (
                            <Badge className="bg-orange-500/90 dark:bg-orange-600/90 text-white text-xs">
                              <AlertTriangle className="mr-1 h-2.5 w-2.5" />
                              Pending
                            </Badge>
                          )
                        default:
                          return null
                      }
                    }

                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {/* Icon Container */}
                          <div className="h-8 w-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mr-3">
                            <IconComponent className="h-4 w-4 text-sky-500 dark:text-sky-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">
                                {option.name?.[language] || option.name?.en || "Service Option"}
                              </div>
                              {getOptionStatusBadge(optionStatus)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getPriceTypeBadge(option.price?.type || "fixed").bgColor}`}>
                                {getPriceTypeBadge(option.price?.type || "fixed").text}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {option.price?.type === "perPerson"
                                  ? `${formatPrice(option.price.amount, option.price.currency)} × ${booking.numberOfGuests} guests`
                                  : formatPrice(option.price?.amount || 0, option.price?.currency || "USD")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatPrice(
                            option.price?.type === "perPerson"
                              ? option.price.amount * (booking.numberOfGuests || 1)
                              : option.price?.amount || 0,
                            option.price?.currency || "USD"
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div>
            <h3 className="mb-2 text-lg font-medium">{t("dashboard.paymentDetails") || "Payment Details"}</h3>
            <div className="rounded-lg border p-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center">
                    <DollarSign className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                    {t("dashboard.venuePrice") || "Venue Price"}
                  </span>
                  <span className="font-medium">{formatPrice(venuePrice, venue?.price?.currency || "USD")}</span>
                </div>

                {serviceOptionsTotal > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("dashboard.serviceOptions") || "Service Options"}</span>
                    <span className="font-medium">{formatPrice(serviceOptionsTotal, venue?.price?.currency || "USD")}</span>
                  </div>
                )}

                {booking.serviceFee && Number.parseFloat(booking.serviceFee.toString()) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("dashboard.serviceFee") || "Service Fee"}</span>
                    <span className="font-medium">
                      {formatPrice(Number.parseFloat(booking.serviceFee.toString()), venue?.price?.currency || "USD")}
                    </span>
                  </div>
                )}

                {booking.discount && Number.parseFloat(booking.discount.toString()) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("dashboard.discount") || "Discount"}</span>
                    <span className="font-medium text-emerald-600">
                      -{formatPrice(Number.parseFloat(booking.discount.toString()), venue?.price?.currency || "USD")}
                    </span>
                  </div>
                )}

                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t("dashboard.total") || "Total"}</span>
                  <span className="text-lg font-bold">{formatPrice(totalPrice, venue?.price?.currency || "USD")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div>
              <h3 className="mb-2 text-lg font-medium">{t("dashboard.specialRequests") || "Special Requests"}</h3>
              <div className="rounded-lg border p-4">
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.close") || "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
