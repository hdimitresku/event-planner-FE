"use client"

import { useState } from "react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import {
  Building,
  Calendar,
  DollarSign,
  Users,
  User,
  MapPin,
  Clock,
  CalendarDays,
  Phone,
  Mail,
  Check,
  X,
} from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Separator } from "../../components/ui/separator"

export default function BusinessDashboardPage() {
  const { t } = useLanguage()
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

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

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsViewModalOpen(true)
  }

  const handleApproveBooking = (bookingId: string) => {
    // In a real app, this would update the booking status in the database
    console.log(`Approving booking ${bookingId}`)
    setIsViewModalOpen(false)
  }

  const handleDeclineBooking = (bookingId: string) => {
    // In a real app, this would update the booking status in the database
    console.log(`Declining booking ${bookingId}`)
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
            <CardTitle className="text-sm font-medium">{t("business.dashboard.venues") || "Venues"}</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 {t("business.dashboard.fromLastMonth") || "from last month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("business.dashboard.customers") || "Customers"}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 {t("business.dashboard.fromLastMonth") || "from last month"}
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

              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">{t("business.bookings.customer") || "Customer"}</h4>
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
                    <h4 className="font-medium">{t("business.bookings.venue") || "Venue"}</h4>
                    <p>{selectedBooking.venue}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.date") || "Date"}</h4>
                      <p>{selectedBooking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.time") || "Time"}</h4>
                      <p>{selectedBooking.time}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.guests") || "Guests"}</h4>
                      <p>
                        {selectedBooking.guests} {t("business.bookings.people") || "people"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">{t("business.bookings.total") || "Total"}</h4>
                      <p>${selectedBooking.total.toFixed(2)}</p>
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
                  <Button onClick={() => setIsViewModalOpen(false)}>{t("business.common.close") || "Close"}</Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{t("business.dashboard.overview") || "Overview"}</TabsTrigger>
            <TabsTrigger value="analytics">{t("business.dashboard.analytics") || "Analytics"}</TabsTrigger>
            <TabsTrigger value="reports">{t("business.dashboard.reports") || "Reports"}</TabsTrigger>
            <TabsTrigger value="notifications">{t("business.dashboard.notifications") || "Notifications"}</TabsTrigger>
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
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {booking.date} • {booking.time}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">${booking.total.toFixed(2)}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="transition-all hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleViewBooking(booking)}
                            >
                              {t("business.common.view") || "View"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BusinessLayout>
  )
}
