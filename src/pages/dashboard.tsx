"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Calendar, Clock, MapPin, Star, Bell, Settings, BookOpen, Heart, ChevronRight, AlertCircle, LayoutDashboard, BookPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")

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
    },
    {
      id: "2",
      venue: "Garden Terrace",
      date: "2023-07-20",
      time: "12:00 - 16:00",
      location: "456 Park Ave, New York, NY",
      image: "/placeholder.svg?height=100&width=200",
      status: "pending",
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

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-2">
            <LayoutDashboard className="h-10 w-10 mr-0" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-50">
            {t("dashboard.welcome", { name: user?.name }) || `Welcome, ${user?.name}`}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {t("dashboard.manageBookings") || "Manage your bookings and account settings"}
          </p>
        </div>
        <Button size="sm" variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20" >
          <Link to="/venues">{t("dashboard.bookVenue") || "Book a Venue"} </Link>
          <BookPlus className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <CardContent className="p-6 flex items-center justify-center h-32">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("business.bookings.total") || "Total Bookings"}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <CardContent className="p-6 flex items-center justify-center h-32">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("business.bookings.upcoming") || "Upcoming Events"}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <CardContent className="p-6 flex items-center justify-center h-32">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Heart className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t("business.bookings.favorites") || "Saved Venues"}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
          <CardContent className="p-6 flex items-center justify-center h-32">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Star className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("business.bookings.reviews") || "Your Reviews"}
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-50">1</p>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="upcoming" className="text-muted-foreground hover:text-foreground transition-colors hover-underline data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md">
            {t("dashboard.upcomingBookings") || "Upcoming Bookings"}
          </TabsTrigger>
          <TabsTrigger value="past" className="text-muted-foreground hover:text-foreground transition-colors hover-underline data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md">
            {t("dashboard.pastBookings") || "Past Bookings"}
          </TabsTrigger>
          <TabsTrigger value="favorites" className="text-muted-foreground hover:text-foreground transition-colors hover-underline data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md">
            {t("dashboard.favorites") || "Favorites"}
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-muted-foreground hover:text-foreground transition-colors hover-underline  data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-800 dark:data-[state=active]:text-gray-50 data-[state=active]:shadow-sm rounded-md">
            {t("dashboard.settings") || "Settings"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <Card
                key={booking.id}
                className="overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="h-48 w-full md:h-auto md:w-48 relative">
                    <img
                      src={booking.image || "/placeholder.svg"}
                      alt={booking.venue}
                      className="h-full w-full object-cover"
                    />
                    <Badge className={`absolute top-2 right-2 ${booking.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400'
                      }`}>
                      {booking.status === 'confirmed'
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
                      <Button size="sm" variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20" asChild>
                        <Link to={`/bookings/${booking.id}`}>{t("dashboard.viewDetails") || "View Details"}</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                        {t("dashboard.modifyBooking") || "Modify Booking"}
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
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
              className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
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
                    <Button size="sm" variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20" asChild>
                      <Link to={`/bookings/${booking.id}`}>{t("dashboard.viewDetails") || "View Details"}</Link>
                    </Button>
                    <Button size="sm" variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                      {t("dashboard.leaveReview") || "Leave a Review"}
                    </Button>
                    <Button size="sm" variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20">
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
                <Card key={venue.id} className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft overflow-hidden bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
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
                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">{venue.rating}</span>
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
            <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-gray-800 dark:text-gray-50">{t("dashboard.accountSettings") || "Account Settings"}</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {t("dashboard.accountSettingsDesc") || "Manage your account information and preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard.name") || "Name"}</label>
                    <Input value={user?.name || ""} readOnly className="bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("dashboard.email") || "Email"}</label>
                    <Input value={user?.email || ""} readOnly className="bg-gray-50 dark:bg-slate-700/50 border-gray-200 dark:border-gray-700" />
                  </div>
                </div>
                <Button className="bg-sky-500 hover:bg-sky-600 text-white shadow-sm mt-2">
                  {t("dashboard.updateProfile") || "Update Profile"}
                </Button>
              </CardContent>
            </Card>

            <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-gray-800 dark:text-gray-50">{t("dashboard.notificationSettings") || "Notification Settings"}</CardTitle>
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

            <Card className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-gray-800 dark:text-gray-50">{t("dashboard.dangerZone") || "Danger Zone"}</CardTitle>
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
