"use client"

import { useState } from "react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { EditBookingModal } from "../../components/business/edit-booking-modal"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import {
  Activity,
  Calendar,
  Clock,
  CreditCard,
  DollarSign,
  Users,
  User,
  MapPin,
  Mail,
  Phone,
  Check,
  X,
  PencilLine,
  AlertTriangle,
} from "lucide-react"
import { toast } from "../../components/ui/use-toast"

export default function BusinessDashboardPage() {
  const { t } = useLanguage()
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  // Mock data for recent bookings
  const recentBookings = [
    {
      id: "1",
      customer: {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
      },
      venue: "Grand Ballroom",
      date: "2025-06-15",
      time: "18:00 - 22:00",
      guests: 150,
      status: "confirmed",
      total: 2500,
      notes: "Wedding reception. Requires stage setup for band and dance floor.",
      services: ["Catering", "DJ", "Photography"],
    },
    {
      id: "2",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "+1 (555) 987-6543",
      },
      venue: "Garden Terrace",
      date: "2025-06-20",
      time: "12:00 - 16:00",
      guests: 80,
      status: "pending",
      total: 1200,
      notes: "Corporate luncheon. Requires projector and screen.",
      services: ["Catering", "AV Equipment"],
    },
    {
      id: "3",
      customer: {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+1 (555) 456-7890",
      },
      venue: "Skyline Loft",
      date: "2025-06-25",
      time: "19:00 - 23:00",
      guests: 100,
      status: "confirmed",
      total: 1800,
      notes: "Birthday celebration. Requires special lighting setup.",
      services: ["Catering", "DJ", "Decoration"],
    },
  ]

  // Add upcoming bookings data
  const upcomingBookings = [
    {
      id: "4",
      customer: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1 (555) 234-5678",
      },
      venue: "Rooftop Lounge",
      date: "2025-07-10",
      time: "19:00 - 23:00",
      guests: 50,
      status: "confirmed",
      total: 1200,
      notes: "Anniversary celebration.",
      services: ["Catering", "DJ"],
    },
    {
      id: "5",
      customer: {
        name: "Robert Wilson",
        email: "robert.wilson@example.com",
        phone: "+1 (555) 345-6789",
      },
      venue: "Grand Ballroom",
      date: "2025-07-15",
      time: "10:00 - 16:00",
      guests: 200,
      status: "confirmed",
      total: 3500,
      notes: "Corporate conference. Requires multiple breakout rooms.",
      services: ["Catering", "AV Equipment", "Staffing"],
    },
    {
      id: "6",
      customer: {
        name: "Jennifer Thompson",
        email: "jennifer.thompson@example.com",
        phone: "+1 (555) 456-7890",
      },
      venue: "Garden Terrace",
      date: "2025-07-20",
      time: "17:00 - 21:00",
      guests: 75,
      status: "pending",
      total: 1500,
      notes: "Graduation party.",
      services: ["Catering", "Photography"],
    },
  ]

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

  const handleApproveBooking = (bookingId: string) => {
    // In a real app, this would update the booking status in the database
    console.log(`Approving booking ${bookingId}`)
    toast({
      title: t("business.bookings.bookingApproved") || "Booking Approved",
      description: t("business.bookings.bookingApprovedDescription") || "The booking has been approved.",
      variant: "default",
    })
    setIsViewModalOpen(false)
  }

  const handleDeclineBooking = (bookingId: string) => {
    // In a real app, this would update the booking status in the database
    console.log(`Declining booking ${bookingId}`)
    toast({
      title: t("business.bookings.bookingDeclined") || "Booking Declined",
      description: t("business.bookings.bookingDeclinedDescription") || "The booking has been declined.",
      variant: "default",
    })
    setIsViewModalOpen(false)
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
        <h1 className="text-3xl font-bold tracking-tight">{t("business.dashboard.title") || "Dashboard"}</h1>
        <p className="text-muted-foreground">
          {t("business.dashboard.subtitle") || "Overview of your business performance"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.dashboard.totalRevenue") || "Total Revenue"}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("business.dashboard.bookings") || "Bookings"}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.dashboard.averageBookingValue") || "Average Booking Value"}
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground">
              +4.2% {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("business.dashboard.occupancyRate") || "Occupancy Rate"}
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+72.5%</div>
            <p className="text-xs text-muted-foreground">
              +10.1% {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Booking Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("business.bookings.bookingDetails") || "Booking Details"}
            </DialogTitle>
            <DialogDescription>
              {t("business.bookings.viewBookingDetails") || "View the details of this booking"}
            </DialogDescription>
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

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium">{t("business.bookings.customerInformation") || "Customer Information"}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.customer.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.customer.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.customer.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 font-medium">{t("business.bookings.eventDetails") || "Event Details"}</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{selectedBooking.venue}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {selectedBooking.guests} {t("business.bookings.guests") || "guests"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>${selectedBooking.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("business.bookings.services") || "Services"}</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBooking.services.map((service: string) => (
                      <Badge key={service} variant="success">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div>
                    <h4 className="font-medium">{t("business.bookings.notes") || "Notes"}</h4>
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
                    <Button onClick={() => setIsViewModalOpen(false)}>
                      {t("business.common.close") || "Close"}
                    </Button>
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
              {t("business.bookings.cancelBookingConfirmation") || "Are you sure you want to cancel this booking? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              {t("business.common.cancel") || "Cancel"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelBooking}
            >
              {t("business.bookings.confirmCancel") || "Yes, Cancel Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{t("business.dashboard.overview") || "Overview"}</TabsTrigger>
            <TabsTrigger value="upcoming">{t("business.dashboard.upcomingBookings") || "Upcoming Bookings"}</TabsTrigger>
            <TabsTrigger value="analytics">{t("business.dashboard.analytics") || "Analytics"}</TabsTrigger>
            <TabsTrigger value="reports">{t("business.dashboard.reports") || "Reports"}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("business.dashboard.recentBookings") || "Recent Bookings"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{booking.venue}</p>
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
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span className="mr-3">{booking.date}</span>
                            <Clock className="mr-1 h-4 w-4" />
                            <span className="mr-3">{booking.time}</span>
                            <Users className="mr-1 h-4 w-4" />
                            <span>
                              {booking.guests} {t("business.bookings.guests") || "guests"}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" onClick={() => handleViewBooking(booking)}>
                            {t("business.common.view") || "View"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="ghost" className="w-full" asChild>
                  <a href="/business/bookings">
                    {t("business.dashboard.viewAll") || "View all bookings"}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("business.dashboard.upcomingBookings") || "Upcoming Bookings"}</CardTitle>
                <CardDescription>
                  {t("business.dashboard.upcomingBookingsDesc") || "View and manage your upcoming bookings"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingBookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                      <div className="border-l-4 border-primary p-0">
                        <CardHeader className="grid grid-cols-[1fr_auto] items-start gap-4 p-4 pb-0">
                          <div>
                            <CardTitle className="flex items-center">
                              {booking.venue}
                              <Badge className={`ml-2 ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status === "confirmed"
                                  ? t("business.bookings.confirmed") || "Confirmed"
                                  : t("business.bookings.pending") || "Pending"}
                              </Badge>
                            </CardTitle>
                            <CardDescription>
                              {booking.customer.name} - {booking.customer.email}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${booking.total}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.guests} {t("business.bookings.guests") || "guests"}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex flex-wrap items-center text-sm gap-x-4 gap-y-2">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>{booking.date}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span>{booking.venue}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-4 bg-muted/50">
                          <div className="flex gap-2 flex-wrap">
                            {booking.services.map((service) => (
                              <Badge key={service} variant="outline">
                                {service}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditBooking(booking)}
                            >
                              <PencilLine className="mr-1.5 h-3.5 w-3.5" />
                              {t("business.common.edit") || "Edit"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleViewBooking(booking)}
                            >
                              {t("business.common.view") || "View"}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => openCancelDialog(booking.id)}
                            >
                              {t("business.common.cancel") || "Cancel"}
                            </Button>
                          </div>
                        </CardFooter>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="ghost" className="w-full" asChild>
                  <a href="/business/bookings">
                    {t("business.dashboard.viewAll") || "View all bookings"}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("business.dashboard.analytics") || "Analytics"}</CardTitle>
                <CardDescription>
                  {t("business.dashboard.analyticsDescription") || "View your business performance metrics"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">
                  {t("business.dashboard.analyticsPlaceholder") || "Analytics charts will be displayed here"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("business.dashboard.reports") || "Reports"}</CardTitle>
                <CardDescription>
                  {t("business.dashboard.reportsDescription") || "View and generate reports"}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                <p className="text-muted-foreground">
                  {t("business.dashboard.reportsPlaceholder") || "Reports will be displayed here"}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  )
}
