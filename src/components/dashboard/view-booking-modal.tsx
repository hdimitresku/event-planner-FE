"use client"

import { useLanguage } from "../../context/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { Clock, Calendar, MapPin, CreditCard, Users, FileText, MessageSquare } from "lucide-react"
import { Booking, BookingStatus } from "../../models/booking"
import { format } from "date-fns"

interface ViewBookingModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

export function ViewBookingModal({ booking, isOpen, onClose }: ViewBookingModalProps) {
  const { t, language } = useLanguage()

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return dateTimeString
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("dashboard.bookingDetails") || "Booking Details"}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.bookingDetailsDescription") || "View the details of your booking"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Venue Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{booking.venue.name[language]}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              <span>
                {booking.venue.address.street}, {booking.venue.address.city}, {booking.venue.address.country}
              </span>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{t("dashboard.startDate") || "Start Date"}</span>
                </div>
                <p>{formatDateTime(`${booking.startDate}T${booking.startTime}`)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{t("dashboard.endDate") || "End Date"}</span>
                </div>
                <p>{formatDateTime(`${booking.endDate}T${booking.endTime}`)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{t("dashboard.startTime") || "Start Time"}</span>
                </div>
                <p>{booking.startTime}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{t("dashboard.endTime") || "End Time"}</span>
                </div>
                <p>{booking.endTime}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>{t("dashboard.guests") || "Number of Guests"}</span>
              </div>
              <p>{booking.numberOfGuests}</p>
            </div>

            {booking.specialRequests && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>{t("dashboard.specialRequests") || "Special Requests"}</span>
                </div>
                <p className="text-sm">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("dashboard.paymentDetails") || "Payment Details"}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.totalAmount") || "Total Amount"}</span>
                <span className="font-medium">${booking.totalAmount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t("dashboard.serviceFee") || "Service Fee"}</span>
                <span className="text-sm">${booking.serviceFee}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("dashboard.bookingStatus") || "Booking Status"}</span>
              {getStatusBadge(booking.status as BookingStatus)}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="mr-2 h-4 w-4" />
              <span>{t("dashboard.bookingId") || "Booking ID"}: {booking.id}</span>
            </div>
          </div>

          <DialogHeader>
            <Button variant="outline" onClick={onClose} className="w-full">
              {t("common.close") || "Close"}
            </Button>
          </DialogHeader>
        </div>
      </DialogContent>
    </Dialog>
  )
}
