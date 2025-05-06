"use client"

import type React from "react"

import { Checkbox } from "@/components/ui/checkbox"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/auth-context"
import { useLanguage } from "../context/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"

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
    },
    {
      id: "2",
      venue: "Garden Terrace",
      date: "2023-07-20",
      time: "12:00 - 16:00",
      location: "456 Park Ave, New York, NY",
      image: "/placeholder.svg?height=100&width=200",
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
    },
  ]

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("dashboard.welcome", { name: user?.name }) || `Welcome, ${user?.name}`}
          </h1>
          <p className="text-gray-500">
            {t("dashboard.manageBookings") || "Manage your bookings and account settings"}
          </p>
        </div>
        <Button asChild>
          <Link to="/venues">{t("dashboard.bookVenue") || "Book a Venue"}</Link>
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">{t("dashboard.upcomingBookings") || "Upcoming Bookings"}</TabsTrigger>
          <TabsTrigger value="past">{t("dashboard.pastBookings") || "Past Bookings"}</TabsTrigger>
          <TabsTrigger value="favorites">{t("dashboard.favorites") || "Favorites"}</TabsTrigger>
          <TabsTrigger value="settings">{t("dashboard.settings") || "Settings"}</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm md:flex-row"
              >
                <div className="h-48 w-full md:h-auto md:w-48">
                  <img
                    src={booking.image || "/placeholder.svg"}
                    alt={booking.venue}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{booking.venue}</h3>
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="mr-2 h-4 w-4" />
                        {booking.date}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-2 h-4 w-4" />
                        {booking.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4" />
                        {booking.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/bookings/${booking.id}`}>{t("dashboard.viewDetails") || "View Details"}</Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      {t("dashboard.modifyBooking") || "Modify Booking"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                      {t("dashboard.cancelBooking") || "Cancel Booking"}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
              <p className="mb-4 text-lg text-gray-500">
                {t("dashboard.noUpcomingBookings") || "You don't have any upcoming bookings"}
              </p>
              <Button asChild>
                <Link to="/venues">{t("dashboard.bookNow") || "Book Now"}</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {pastBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm md:flex-row"
            >
              <div className="h-48 w-full md:h-auto md:w-48">
                <img
                  src={booking.image || "/placeholder.svg"}
                  alt={booking.venue}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold">{booking.venue}</h3>
                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      {booking.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      {booking.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-2 h-4 w-4" />
                      {booking.location}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/bookings/${booking.id}`}>{t("dashboard.viewDetails") || "View Details"}</Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    {t("dashboard.leaveReview") || "Leave a Review"}
                  </Button>
                  <Button size="sm" variant="outline">
                    {t("dashboard.bookAgain") || "Book Again"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="favorites">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
            <p className="mb-4 text-lg text-gray-500">
              {t("dashboard.noFavorites") || "You haven't saved any favorites yet"}
            </p>
            <Button asChild>
              <Link to="/venues">{t("dashboard.exploreVenues") || "Explore Venues"}</Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">{t("dashboard.accountSettings") || "Account Settings"}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("dashboard.name") || "Name"}</label>
                  <Input value={user?.name || ""} readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("dashboard.email") || "Email"}</label>
                  <Input value={user?.email || ""} readOnly />
                </div>
              </div>
              <Button className="mt-4">{t("dashboard.updateProfile") || "Update Profile"}</Button>
            </div>
            <div>
              <h3 className="text-lg font-medium">{t("dashboard.notificationSettings") || "Notification Settings"}</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notifications" defaultChecked />
                  <label
                    htmlFor="email-notifications"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("dashboard.emailNotifications") || "Email Notifications"}
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sms-notifications" />
                  <label
                    htmlFor="sms-notifications"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t("dashboard.smsNotifications") || "SMS Notifications"}
                  </label>
                </div>
              </div>
              <Button className="mt-4">{t("dashboard.saveSettings") || "Save Settings"}</Button>
            </div>
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
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
