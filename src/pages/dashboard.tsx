"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Bell,
  Settings,
  BookOpen,
  Heart,
  AlertCircle,
  LayoutDashboard,
  BookPlus,
  User,
  CreditCard,
  DollarSign,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Textarea } from "../components/ui/textarea"

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")
  const navigate = useNavigate()

  // State for modals
  const [viewBookingId, setViewBookingId] = useState<string | null>(null)
  const [editBookingId, setEditBookingId] = useState<string | null>(null)
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")

  // Mock data
  const upcomingBookings = [
    {
      id: "1",
      venue: "Grand Ballroom",
      date: "2023-06-15",
      time: "18:00 - 22:00",
      location: "123 Main St, New York, NY",
      image: "/placeholder.svg?height=100&width=200",
      status: "confirmed",
      price: 1200,
      guests: 100,
      services: ["Catering", "DJ Services", "Decoration"],
      specialRequests: "Please arrange tables in a U-shape configuration.",
      contactPerson: "John Smith",
      contactEmail: "john@example.com",
      contactPhone: "+1 (555) 123-4567",
    },
    {
      id: "2",
      venue: "Garden Terrace",
      date: "2023-07-20",
      time: "12:00 - 16:00",
      location: "456 Park Ave, New York, NY",
      image: "/placeholder.svg?height=100&width=200",
      status: "pending",
      price: 800,
      guests: 50,
      services: ["Catering", "Photography"],
      specialRequests: "Vegetarian menu options required.",
      contactPerson: "Jane Doe",
      contactEmail: "jane@example.com",
      contactPhone: "+1 (555) 987-6543",
    },
  ]

  const pastBookings = [
    {
      id: "3",
      venue: "Skyline Loft",
      date: "2023-03-10",
      time: "19:00 - 23:00",
      location: "789 Broadway, New York, NY",
      image: "/placeholder.svg?height=100&width=200",
      status: "completed",
      price: 950,
      guests: 75,
      services: ["Full Service Package", "Valet Parking"],
      specialRequests: "None",
      contactPerson: "Robert Johnson",
      contactEmail: "robert@example.com",
      contactPhone: "+1 (555) 456-7890",
      hasReview: false,
    },
  ]

  const favoriteVenues = [
    {
      id: "1",
      name: "Luxury Penthouse",
      location: "Manhattan, NY",
      price: 350,
      rating: 4.9,
      image: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "2",
      name: "Rooftop Garden",
      location: "Brooklyn, NY",
      price: 250,
      rating: 4.7,
      image: "/placeholder.svg?height=100&width=200",
    },
  ]

  // Find the booking by ID
  const findBookingById = (id: string) => {
    return [...upcomingBookings, ...pastBookings].find((booking) => booking.id === id)
  }

  // Handle view booking
  const handleViewBooking = (id: string) => {
    setViewBookingId(id)
  }

  // Handle edit booking
  const handleEditBooking = (id: string) => {
    setEditBookingId(id)
  }

  // Handle leave review
  const handleLeaveReview = (id: string) => {
    setReviewBookingId(id)
    setReviewRating(5)
    setReviewComment("")
  }

  // Handle submit review
  const handleSubmitReview = () => {
    // Here you would submit the review to your backend
    console.log(`Submitting review for booking ${reviewBookingId}: ${reviewRating} stars, "${reviewComment}"`)

    // Update the booking to show it has a review
    pastBookings.forEach((booking) => {
      if (booking.id === reviewBookingId) {
        booking.hasReview = true
      }
    })

    // Close the review modal
    setReviewBookingId(null)

    // Show success message (in a real app)
    alert("Thank you for your review!")
  }

  // Handle cancel booking
  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      // Here you would call your API to cancel the booking
      console.log(`Cancelling booking ${id}`)
      alert("Booking cancelled successfully")
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-2">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            <span>{t("dashboard.welcome.greeting") || "Welcome back"}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-50">
            {t("dashboard.welcome", { name: user?.name }) || `Welcome, ${user?.name}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t("dashboard.manageBookings") || "Manage your bookings and account settings"}
          </p>
        </div>
        <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm" asChild>
          <Link to="/venues">
            {t("dashboard.bookVenue") || "Book a Venue"}
            <BookPlus className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dashboard.stats.totalBookings") || "Total Bookings"}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dashboard.stats.upcoming") || "Upcoming Events"}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center">
                <Heart className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dashboard.stats.favorites") || "Saved Venues"}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Star className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("dashboard.stats.reviews") || "Your Reviews"}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger
            value="upcoming"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md"
          >
            {t("dashboard.upcomingBookings") || "Upcoming Bookings"}
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md"
          >
            {t("dashboard.pastBookings") || "Past Bookings"}
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md"
          >
            {t("dashboard.favorites") || "Favorites"}
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md"
          >
            {t("dashboard.settings") || "Settings"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <Card
                key={booking.id}
                className="overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 w-full md:h-auto md:w-48 relative">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.venue}
                      className="h-full w-full object-cover"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${
                        booking.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
                      }`}
                    >
                      {booking.status === "confirmed"
                        ? t("dashboard.status.confirmed") || "Confirmed"
                        : t("dashboard.status.pending") || "Pending"}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{booking.venue}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                        onClick={() => handleViewBooking(booking.id)}
                      >
                        {t("dashboard.viewDetails") || "View Details"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        onClick={() => handleEditBooking(booking.id)}
                      >
                        {t("dashboard.modifyBooking") || "Modify Booking"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        {t("dashboard.cancelBooking") || "Cancel Booking"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 py-12">
              <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              </div>
              <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                {t("dashboard.noUpcomingBookings") || "You don't have any upcoming bookings"}
              </p>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm" asChild>
                <Link to="/venues">{t("dashboard.bookNow") || "Book Now"}</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastBookings.map((booking) => (
            <Card
              key={booking.id}
              className="overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                <div className="h-48 w-full md:h-auto md:w-48 relative">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.venue}
                    className="h-full w-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400">
                    {t("dashboard.status.completed") || "Completed"}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">{booking.venue}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                      onClick={() => handleViewBooking(booking.id)}
                    >
                      {t("dashboard.viewDetails") || "View Details"}
                    </Button>
                    {!booking.hasReview && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                        onClick={() => handleLeaveReview(booking.id)}
                      >
                        {t("dashboard.leaveReview") || "Leave a Review"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                    >
                      {t("dashboard.bookAgain") || "Book Again"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="favorites">
          {favoriteVenues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteVenues.map((venue) => (
                <Card
                  key={venue.id}
                  className="overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={venue.image || "/placeholder.svg"}
                      alt={venue.name}
                      className="h-48 w-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      <span className="sr-only">Remove from favorites</span>
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-50">{venue.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      <span>{venue.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {venue.rating}
                        </span>
                      </div>
                      <span className="font-medium text-sky-500 dark:text-sky-400">${venue.price}/hr</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm w-full" asChild>
                      <Link to={`/venues/${venue.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800/50 py-12">
              <div className="h-16 w-16 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              </div>
              <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                {t("dashboard.noFavorites") || "You haven't saved any favorites yet"}
              </p>
              <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm" asChild>
                <Link to="/venues">{t("dashboard.exploreVenues") || "Explore Venues"}</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-gray-800 dark:text-gray-50">
                    {t("dashboard.accountSettings") || "Account Settings"}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("dashboard.accountSettingsDesc") || "Manage your account information and preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("dashboard.name") || "Name"}
                    </label>
                    <Input
                      value={user?.name || ""}
                      readOnly
                      className="bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("dashboard.email") || "Email"}
                    </label>
                    <Input
                      value={user?.email || ""}
                      readOnly
                      className="bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
                <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm mt-2">
                  {t("dashboard.updateProfile") || "Update Profile"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-gray-800 dark:text-gray-50">
                    {t("dashboard.notificationSettings") || "Notification Settings"}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("dashboard.notificationSettingsDesc") || "Control how you receive notifications"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="email-notifications" defaultChecked />
                    <label
                      htmlFor="email-notifications"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("dashboard.emailNotifications") || "Email Notifications"}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sms-notifications" />
                    <label
                      htmlFor="sms-notifications"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("dashboard.smsNotifications") || "SMS Notifications"}
                    </label>
                  </div>
                </div>
                <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm mt-2">
                  {t("dashboard.saveSettings") || "Save Settings"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-gray-800 dark:text-gray-50">
                    {t("dashboard.dangerZone") || "Danger Zone"}
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("dashboard.dangerZoneDesc") || "Actions that can't be undone"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
                  {t("dashboard.deleteAccount") || "Delete Account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Booking Modal */}
      {viewBookingId && (
        <Dialog open={!!viewBookingId} onOpenChange={() => setViewBookingId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Booking Details</DialogTitle>
              <DialogDescription>View the details of your booking</DialogDescription>
            </DialogHeader>

            {(() => {
              const booking = findBookingById(viewBookingId)
              if (!booking) return null

              return (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.venue}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-50">{booking.venue}</h3>
                        <Badge
                          className={`mt-2 ${
                            booking.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
                              : booking.status === "pending"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? "Confirmed"
                            : booking.status === "pending"
                              ? "Pending"
                              : "Completed"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Date: {booking.date}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Time: {booking.time}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Location: {booking.location}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Guests: {booking.guests}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CreditCard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Payment: {booking.status === "confirmed" ? "Paid" : "Pending"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">Total: ${booking.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Services Included</h4>
                    <div className="flex flex-wrap gap-2">
                      {booking.services.map((service, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {booking.specialRequests && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Special Requests</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">{booking.specialRequests}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{booking.contactPerson}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MessageSquare className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{booking.contactEmail}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">{booking.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            <DialogFooter className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setViewBookingId(null)}>
                Close
              </Button>
              {findBookingById(viewBookingId)?.status === "confirmed" && (
                <Button className="bg-sky-500 hover:bg-sky-600 text-white">View Invoice</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Booking Modal */}
      {editBookingId && (
        <Dialog open={!!editBookingId} onOpenChange={() => setEditBookingId(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Modify Booking</DialogTitle>
              <DialogDescription>Make changes to your booking details</DialogDescription>
            </DialogHeader>

            {(() => {
              const booking = findBookingById(editBookingId)
              if (!booking) return null

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">{booking.venue}</h3>
                    <Badge
                      className={`${
                        booking.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
                      }`}
                    >
                      {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                      <Input
                        type="date"
                        defaultValue={booking.date}
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                      <Input
                        type="text"
                        defaultValue={booking.time}
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of Guests</label>
                      <Input
                        type="number"
                        defaultValue={booking.guests}
                        min="1"
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</label>
                      <Input
                        type="tel"
                        defaultValue={booking.contactPhone}
                        className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Requests</label>
                    <Textarea
                      defaultValue={booking.specialRequests}
                      className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Services</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "Catering",
                        "DJ Services",
                        "Decoration",
                        "Photography",
                        "Valet Parking",
                        "Full Service Package",
                      ].map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox id={`service-${service}`} defaultChecked={booking.services.includes(service)} />
                          <label htmlFor={`service-${service}`} className="text-sm text-gray-700 dark:text-gray-300">
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })()}

            <DialogFooter className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setEditBookingId(null)}>
                Cancel
              </Button>
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white"
                onClick={() => {
                  // Here you would save the changes
                  alert("Booking updated successfully!")
                  setEditBookingId(null)
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Leave Review Modal */}
      {reviewBookingId && (
        <Dialog open={!!reviewBookingId} onOpenChange={() => setReviewBookingId(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Leave a Review</DialogTitle>
              <DialogDescription>Share your experience with this venue</DialogDescription>
            </DialogHeader>

            {(() => {
              const booking = findBookingById(reviewBookingId)
              if (!booking) return null

              return (
                <div className="space-y-4 py-2">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-50">{booking.venue}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{booking.date}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-8 w-8 ${
                              star <= reviewRating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Review</label>
                    <Textarea
                      placeholder="Share your experience with this venue..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700 min-h-[120px]"
                    />
                  </div>
                </div>
              )
            })()}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setReviewBookingId(null)}>
                Cancel
              </Button>
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white"
                onClick={handleSubmitReview}
                disabled={!reviewComment.trim()}
              >
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Import the Input component since it's used in the settings tab
function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

// Phone icon component
function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
