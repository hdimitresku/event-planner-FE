"use client"

import { useState } from "react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Calendar, Check, Clock, Search, X } from "lucide-react"

export default function BusinessBookingsPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("upcoming")

  // Mock data
  const bookings = [
    {
      id: "1",
      customer: "John Smith",
      venue: "Grand Ballroom",
      date: "2023-06-15",
      time: "18:00 - 22:00",
      guests: 150,
      status: "confirmed",
      total: 2500,
    },
    {
      id: "2",
      customer: "Sarah Johnson",
      venue: "Garden Terrace",
      date: "2023-06-20",
      time: "12:00 - 16:00",
      guests: 80,
      status: "pending",
      total: 1200,
    },
    {
      id: "3",
      customer: "Michael Brown",
      venue: "Skyline Loft",
      date: "2023-06-25",
      time: "19:00 - 23:00",
      guests: 100,
      status: "confirmed",
      total: 1800,
    },
    {
      id: "4",
      customer: "Emily Davis",
      venue: "Grand Ballroom",
      date: "2023-05-10",
      time: "17:00 - 21:00",
      guests: 200,
      status: "completed",
      total: 3000,
    },
    {
      id: "5",
      customer: "David Wilson",
      venue: "Garden Terrace",
      date: "2023-05-05",
      time: "13:00 - 17:00",
      guests: 60,
      status: "cancelled",
      total: 900,
    },
  ]

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date)
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

  return (
    <BusinessLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("business.bookings.title") || "Bookings"}</h1>
        <p className="text-gray-500">{t("business.bookings.subtitle") || "Manage your venue bookings"}</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder={t("business.bookings.searchBookings") || "Search bookings..."} className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {t("business.bookings.filterByDate") || "Filter by Date"}
          </Button>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            {t("business.bookings.export") || "Export"}
          </Button>
        </div>
      </div>

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
                  <tr className="border-b bg-gray-50 text-left">
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
                      <td className="px-4 py-3">{booking.customer}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </span>
                      </td>
                      <td className="px-4 py-3">${booking.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            {t("business.bookings.view") || "View"}
                          </Button>
                          {booking.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" className="text-green-600">
                                <Check className="mr-1 h-3 w-3" />
                                {t("business.bookings.approve") || "Approve"}
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
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
                  <tr className="border-b bg-gray-50 text-left">
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
                      <td className="px-4 py-3">{booking.customer}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "completed" ? "bg-blue-100 text-blue-800" : ""
                          }`}
                        >
                          {t("business.bookings.completed") || "Completed"}
                        </span>
                      </td>
                      <td className="px-4 py-3">${booking.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline">
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
                  <tr className="border-b bg-gray-50 text-left">
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
                      <td className="px-4 py-3">{booking.customer}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                          {t("business.bookings.cancelled") || "Cancelled"}
                        </span>
                      </td>
                      <td className="px-4 py-3">${booking.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline">
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
                  <tr className="border-b bg-gray-50 text-left">
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
                      <td className="px-4 py-3">{booking.customer}</td>
                      <td className="px-4 py-3">{booking.venue}</td>
                      <td className="px-4 py-3">{booking.date}</td>
                      <td className="px-4 py-3">{booking.time}</td>
                      <td className="px-4 py-3">{booking.guests}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status === "confirmed"
                            ? t("business.bookings.confirmed") || "Confirmed"
                            : booking.status === "pending"
                              ? t("business.bookings.pending") || "Pending"
                              : booking.status === "completed"
                                ? t("business.bookings.completed") || "Completed"
                                : t("business.bookings.cancelled") || "Cancelled"}
                        </span>
                      </td>
                      <td className="px-4 py-3">${booking.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline">
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
      </Tabs>
    </BusinessLayout>
  )
}
