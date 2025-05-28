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
import { ServiceOption } from "@/models/service"

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

  // Fetch venues and their bookings
  useEffect(() => {
    const fetchVenuesAndBookings = async () => {
      try {
        setLoading(true)
        const venueDetails = await venueService.getVenueByOwner()
        setVenues(venueDetails)
        const allBookings = venueDetails.flatMap((venue: any) =>
          venue.bookings.map((booking: any) => ({
            ...booking,
            venueName: venue.name,
            venueId: venue.id,
            customer: {
              name: `${booking.metadata?.contactDetails?.firstName || ""} ${booking.metadata?.contactDetails?.lastName || ""}`.trim(),
              email: booking.metadata?.contactDetails?.email || "",
              phone: booking.metadata?.contactDetails?.phone || "",
            },
          })),
        )
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

  // Extract all bookings from venues
  const allBookings = venues.flatMap((venue) =>
    venue.bookings.map((booking: any) => ({
      ...booking,
      venueName: venue.name,
      venueId: venue.id,
      customer: {
        name: `${booking.metadata?.contactDetails?.firstName || ""} ${booking.metadata?.contactDetails?.lastName || ""}`.trim(),
        email: booking.metadata?.contactDetails?.email || "",
        phone: booking.metadata?.contactDetails?.phone || "",
      },
    })),
  )

  const filteredBookings = allBookings.filter((booking) => {
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
      await bookingService.updateBookingStatus(bookingId, "confirmed")
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
      await bookingService.updateBookingStatus(bookingId, "cancelled")
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
        <h1 className="text-3xl font-bold tracking-tight">{t("business.bookings.title") || "Bookings"}</h1>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t("business.bookings.bookingDetails")}</DialogTitle>
            <DialogDescription>{t("business.bookings.viewBookingDetails")}</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{selectedBooking.venue}</h3>
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
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {selectedBooking.customer.phone}
                      </span>
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
                      <p>{selectedBooking.startDate} - {selectedBooking.endDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.time")}</h4>
                      <p>{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.guests")}</h4>
                      <p>
                        {selectedBooking.guests} {t("business.bookings.people")}
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

                <div>
                  <h4 className="font-medium mb-2">{t("business.bookings.services")}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.serviceOptions.map((service: ServiceOption) => (
                      <Badge key={service.id} variant="success">
                        {service.name[language] || service.name.en}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="font-medium">{t("business.bookings.notes")}</h4>
                    <p className="text-muted-foreground">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                {selectedBooking.status === "pending" ? (
                  <div className="flex w-full gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeclineBooking(selectedBooking.id)}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t("business.bookings.decline") || "Decline"}
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-500/90 dark:bg-emerald-600/90 hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70"
                      onClick={() => handleApproveBooking(selectedBooking.id)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {t("business.bookings.approve") || "Approve"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {selectedBooking.status !== "completed" && selectedBooking.status !== "cancelled" ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsViewModalOpen(false)
                          handleEditBooking(selectedBooking)
                        }}
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        {t("business.common.edit") || "Edit"}
                      </Button>
                    ) : null}
                    <Button onClick={() => setIsViewModalOpen(false)}>{t("business.common.close") || "Close"}</Button>
                  </div>
                )}
              </DialogFooter>
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
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted text-left dark:bg-slate-700">
                    <th className="px-4 py-3 font-medium">{t("business.bookings.customer") || "Customer"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.venue") || "Venue"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.date") || "Date"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.time") || "Time"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.guests") || "Guests"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.status") || "Status"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.total") || "Total"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.actions") || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {error && (
                    <div className="text-center py-8 text-destructive">
                      <p>{error}</p>
                      <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                        Retry
                      </Button>
                    </div>
                  )}

                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">{booking.customer.name}</td>
                      <td className="px-4 py-3">{booking.venueName[language] || booking.venueName.en}</td>
                      <td className="px-4 py-3">{booking.startDate}</td>
                      <td className="px-4 py-3">
                        {booking.startTime} - {booking.endTime}
                      </td>
                      <td className="px-4 py-3">{booking.numberOfGuests}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">${Number.parseFloat(booking.totalAmount).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleViewBooking(booking)}
                          >
                            {t("business.common.view") || "View"}
                          </Button>

                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-green-600 hover:bg-green-50"
                                onClick={() => handleApproveBooking(booking.id)}
                              >
                                <Check className="mr-1 h-3 w-3" />
                                {t("business.bookings.approve") || "Approve"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeclineBooking(booking.id)}
                              >
                                <X className="mr-1 h-3 w-3" />
                                {t("business.bookings.decline") || "Decline"}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted text-left dark:bg-slate-700">
                    <th className="px-4 py-3 font-medium">{t("business.bookings.customer") || "Customer"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.venue") || "Venue"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.date") || "Date"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.time") || "Time"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.guests") || "Guests"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.status") || "Status"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.total") || "Total"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.actions") || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="px-4 py-3">{booking.customer.name}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {t("business.bookings.completed") || "Completed"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">${booking.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewBooking(booking)}
                        >
                          {t("business.bookings.view") || "View"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted text-left dark:bg-slate-700">
                    <th className="px-4 py-3 font-medium">{t("business.bookings.customer") || "Customer"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.venue") || "Venue"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.date") || "Date"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.time") || "Time"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.guests") || "Guests"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.status") || "Status"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.total") || "Total"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.actions") || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="px-4 py-3">{booking.customer.name}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">${booking.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewBooking(booking)}
                        >
                          {t("business.bookings.view") || "View"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted text-left dark:bg-slate-700">
                    <th className="px-4 py-3 font-medium">{t("business.bookings.customer") || "Customer"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.venue") || "Venue"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.date") || "Date"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.time") || "Time"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.guests") || "Guests"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.status") || "Status"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.total") || "Total"}</th>
                    <th className="px-4 py-3 font-medium">{t("business.bookings.actions") || "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b">
                      <td className="px-4 py-3">{booking.customer.name}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">${Number.parseFloat(booking.totalAmount).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="transition-all hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleViewBooking(booking)}
                          >
                            {t("business.common.view") || "View"}
                          </Button>

                          {(booking.status === "confirmed" || booking.status === "pending") && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2"
                                onClick={() => handleEditBooking(booking)}
                              >
                                <PencilLine className="mr-1.5 h-3.5 w-3.5" />
                                {t("business.common.edit") || "Edit"}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => openCancelDialog(booking.id)}
                              >
                                {t("business.common.cancel") || "Cancel"}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </BusinessLayout>
  )
}
