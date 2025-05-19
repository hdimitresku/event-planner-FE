"use client"

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/dashboard/layout"
import { EditBookingModal } from "../../components/dashboard/edit-booking-modal"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Separator } from "../../components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Link } from "react-router-dom"
import {
  Clock,
  Calendar,
  MapPin,
  User,
  Users,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  CalendarPlus,
  Star,
  Package,
  Building,
  Mail,
  MessageCircle,
  ChevronRight,
  Heart,
  Clock10,
  LogOut,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useLanguage } from "../../context/language-context"
import * as bookingService from "../../services/bookingService"
import * as venueService from "../../services/venueService"
import * as userService from "../../services/userService"
import { Booking, BookingStatus, PaymentStatus } from "../../models/booking"
import { Venue } from "../../models/venue"
import { User as UserModel } from "../../models/user"
import { format } from "date-fns"
import { toast } from "../../components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

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
      const result = await bookingService.getBookings({ userId: currentUser?.id })
      setBookings(result.bookings)
      
      // Fetch venue details for each booking
      const venueIds = [...new Set(result.bookings.map(booking => booking.venueId))]
      const venueDetails: Record<string, Venue | null> = {}
      
      await Promise.all(
        venueIds.map(async (venueId) => {
          const venue = await venueService.getVenueById(venueId)
          venueDetails[venueId] = venue
        })
      )
      
      setVenues(venueDetails)
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load bookings. Please try again.",
        variant: "destructive"
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
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status } 
            : booking
        )
      )
      
      toast({
        title: status === BookingStatus.CANCELLED 
          ? t("dashboard.bookingCancelled") || "Booking Cancelled"
          : t("dashboard.bookingUpdated") || "Booking Updated",
        description: status === BookingStatus.CANCELLED
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
        variant: "destructive"
      })
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

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const now = new Date()
    const bookingDate = new Date(booking.startDateTime)
    
    if (activeTab === "upcoming") {
      return bookingDate >= now && 
        (booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING)
    } else if (activeTab === "past") {
      return bookingDate < now || booking.status === BookingStatus.COMPLETED
    } else if (activeTab === "cancelled") {
      return booking.status === BookingStatus.CANCELLED
    }
    
    return true
  })

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, "MMM d, yyyy 'at' h:mm a")
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

  const handleSaveBooking = (updatedBooking: Booking) => {
    // In a real app, this would call an API to update the booking
    console.log(`Updating booking ${updatedBooking.id}`, updatedBooking)
    
    // Update local state
    setBookings(prev => 
      prev.map(booking => 
        booking.id === updatedBooking.id 
          ? updatedBooking 
          : booking
      )
    )
    
    toast({
      title: t("dashboard.bookingUpdated") || "Booking Updated",
      description: t("dashboard.bookingUpdatedDescription") || "Your booking has been updated.",
    })
    
    setIsEditModalOpen(false)
  }

  return (
    <DashboardLayout currentUser={currentUser}>
      <div className="mb-6 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">{t("dashboard.myBookings") || "My Bookings"}</h1>
        <p className="text-muted-foreground">{t("dashboard.viewAndManageBookings") || "View and manage your bookings"}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">{t("dashboard.upcoming") || "Upcoming"}</TabsTrigger>
          <TabsTrigger value="past">{t("dashboard.past") || "Past"}</TabsTrigger>
          <TabsTrigger value="cancelled">{t("dashboard.cancelled") || "Cancelled"}</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {loadingBookings ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">{t("common.loading") || "Loading..."}</p>
              </CardContent>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Calendar className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-semibold">{t("dashboard.noUpcomingBookings") || "No upcoming bookings"}</h3>
                <p className="mb-4 max-w-md text-muted-foreground">
                  {t("dashboard.noUpcomingBookingsDescription") || "It looks like you don't have any upcoming bookings. Start exploring our venues to book your next event."}
                </p>
                <Button asChild>
                  <Link to="/venues">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    {t("dashboard.bookNow") || "Book Now"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const venue = venues[booking.venueId]
              
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="border-l-4 border-primary">
                    <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 p-4">
                      <div>
                        <CardTitle>{venue?.name?.[language] || "Venue"}</CardTitle>
                        <CardDescription>
                          {formatDateTime(booking.startDateTime)}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(booking.status)}
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="grid gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{formatDateTime(booking.startDateTime)}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{booking.duration} {t("common.hours") || "hours"}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-2 h-4 w-4" />
                          <span>{venue?.location?.[language] || "Unknown location"}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span className="mr-2 font-medium">${booking.costs.totalAmount}</span>
                          {getPaymentStatusBadge(booking.paymentStatus)}
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
                        <div>
                          {booking.confirmationCode && (
                            <Badge variant="outline" className="mr-2">
                              <FileText className="mr-1 h-3 w-3" />
                              {booking.confirmationCode}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleViewBooking(booking)}
                          >
                            {t("dashboard.viewDetails") || "View Details"}
                          </Button>
                          {(booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditBooking(booking)}
                            >
                              {t("dashboard.modifyBooking") || "Modify Booking"}
                            </Button>
                          )}
                          {booking.status === BookingStatus.PENDING && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openCancelDialog(booking.id)}
                            >
                              {t("dashboard.cancel") || "Cancel"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {loadingBookings ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">{t("common.loading") || "Loading..."}</p>
              </CardContent>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Calendar className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-semibold">{t("dashboard.noPastBookings") || "No past bookings"}</h3>
                <p className="mb-4 max-w-md text-muted-foreground">
                  {t("dashboard.noPastBookingsDescription") || "Your past bookings will appear here."}
                </p>
                <Button asChild>
                  <Link to="/venues">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    {t("dashboard.bookNow") || "Book Now"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const venue = venues[booking.venueId]
              
              return (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{venue?.name?.[language] || "Venue"}</CardTitle>
                        <CardDescription>
                          {formatDateTime(booking.startDateTime)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{formatDateTime(booking.startDateTime)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{booking.duration} {t("common.hours") || "hours"}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{venue?.location?.[language] || "Unknown location"}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span className="mr-2 font-medium">${booking.costs.totalAmount}</span>
                        {getPaymentStatusBadge(booking.paymentStatus)}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Button 
                        size="sm"
                        onClick={() => handleViewBooking(booking)}
                      >
                        {t("dashboard.viewDetails") || "View Details"}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/venues/${booking.venueId}`}>
                          {t("dashboard.bookAgain") || "Book Again"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {loadingBookings ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">{t("common.loading") || "Loading..."}</p>
              </CardContent>
            </Card>
          ) : filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <XCircle className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-semibold">{t("dashboard.noCancelledBookings") || "No cancelled bookings"}</h3>
                <p className="mb-4 max-w-md text-muted-foreground">
                  {t("dashboard.noCancelledBookingsDescription") || "You don't have any cancelled bookings."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => {
              const venue = venues[booking.venueId]
              
              return (
                <Card key={booking.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{venue?.name?.[language] || "Venue"}</CardTitle>
                        <CardDescription>
                          {formatDateTime(booking.startDateTime)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{formatDateTime(booking.startDateTime)}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span>{venue?.location?.[language] || "Unknown location"}</span>
                      </div>
                      {booking.cancellationReason && (
                        <div className="mt-2 text-sm">
                          <p className="font-medium">{t("dashboard.cancellationReason") || "Cancellation reason"}:</p>
                          <p className="text-muted-foreground">{booking.cancellationReason}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => handleViewBooking(booking)}
                      >
                        {t("dashboard.viewDetails") || "View Details"}
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/venues/${booking.venueId}`}>
                          {t("dashboard.bookAgain") || "Book Again"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("dashboard.cancelBooking") || "Cancel Booking"}
            </DialogTitle>
            <DialogDescription>
              {t("dashboard.cancelBookingConfirmation") || "Are you sure you want to cancel this booking? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => bookingToCancel && updateBookingStatus(bookingToCancel, BookingStatus.CANCELLED)}
            >
              {t("dashboard.confirmCancel") || "Yes, Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Booking Modal */}
      {isEditModalOpen && selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveBooking}
        />
      )}

      {/* View Booking Details Dialog */}
      {selectedBooking && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {t("dashboard.bookingDetails") || "Booking Details"}
              </DialogTitle>
              <DialogDescription>
                {t("dashboard.viewBookingDetails") || "View the details of your booking"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{venues[selectedBooking.venueId]?.name?.[language] || "Venue"}</h3>
                {getStatusBadge(selectedBooking.status)}
              </div>
              
              <Separator />
              
              <div className="grid gap-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{formatDateTime(selectedBooking.startDateTime)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{selectedBooking.duration} {t("common.hours") || "hours"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{venues[selectedBooking.venueId]?.location?.[language] || "Unknown location"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{selectedBooking.guestCount} {t("common.guests") || "guests"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="mr-2 font-medium">${selectedBooking.costs.totalAmount}</span>
                  {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                </div>
                
                {selectedBooking.confirmationCode && (
                  <div className="flex items-center text-sm mt-2">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Confirmation: {selectedBooking.confirmationCode}</span>
                  </div>
                )}
                
                {selectedBooking.specialRequests && (
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-1">{t("dashboard.specialRequests") || "Special Requests"}</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex justify-end gap-2 pt-4">
              {(selectedBooking.status === BookingStatus.CONFIRMED || selectedBooking.status === BookingStatus.PENDING) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditBooking(selectedBooking)
                  }}
                >
                  {t("dashboard.modifyBooking") || "Modify Booking"}
                </Button>
              )}
              <Button onClick={() => setIsViewModalOpen(false)}>
                {t("common.close") || "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  )
}
