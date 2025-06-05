"use client"

import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Calendar, Clock, Users, MapPin, CheckCircle, Download, Share, ArrowRight } from "lucide-react"
import { useLanguage } from "../context/language-context"

export default function VenueConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const { t, language } = useLanguage()

  // This would normally be fetched from an API with language parameter
  const booking = {
    id: "BK-" + Math.floor(100000 + Math.random() * 900000),
    venue: {
      id,
      name: {
        en: "Stunning Loft Space with City Views",
        sq: "Hapësirë Loft Mahnitëse me Pamje nga Qyteti",
      },
      location: {
        en: "SoHo, New York",
        sq: "SoHo, New York",
      },
    },
    date: "May 15, 2023",
    time: "10:00 AM - 12:00 PM",
    duration: 2,
    guests: 50,
    total: 345,
    contact: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-emerald-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 mb-4 shadow-lg">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold md:text-3xl mb-2 text-gray-900 dark:text-gray-50">{t("confirmation.title") || "Booking Confirmed!"}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("confirmation.subtitle", { id: booking.id }) ||
                `Your booking (${booking.id}) has been confirmed. A confirmation email has been sent to your email address.`}
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 border border-gray-200/80 dark:border-slate-700 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{t("confirmation.bookingDetails") || "Booking Details"}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                    <Download className="h-4 w-4 mr-2" />
                    {t("confirmation.download") || "Download"}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                    <Share className="h-4 w-4 mr-2" />
                    {t("confirmation.share") || "Share"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("confirmation.bookingId") || "Booking ID"}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-50">{booking.id}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t("confirmation.bookingDate") || "Booking Date"}</p>
                  <p className="font-medium text-gray-900 dark:text-gray-50">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50">{booking.venue.name[language]}</h3>
                  <div className="flex items-center text-sm mt-1">
                    <MapPin className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{booking.venue.location[language]}</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start">
                    <Calendar className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-50">{t("confirmation.date") || "Date"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-50">{t("confirmation.time") || "Time"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="mr-2 h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-50">{t("confirmation.guests") || "Guests"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.guests} {t("confirmation.people") || "people"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-50">{t("confirmation.contactInfo") || "Contact Information"}</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("confirmation.name") || "Name"}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{booking.contact.name}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("confirmation.email") || "Email"}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{booking.contact.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("confirmation.phone") || "Phone"}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-50">{booking.contact.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-50">{t("confirmation.paymentSummary") || "Payment Summary"}</h3>
                <div className="flex justify-between font-medium text-gray-900 dark:text-gray-50">
                  <span>{t("confirmation.total") || "Total Paid"}</span>
                  <span>${booking.total}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {t("confirmation.paymentMethod") || "Paid with Credit Card ending in 4242"}
                </p>
              </div>
            </div>

            <div className="p-6 border border-gray-200/80 dark:border-slate-700 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-50">{t("confirmation.whatNext") || "What's Next?"}</h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 mr-3 shrink-0 font-medium">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">{t("confirmation.checkEmail") || "Check Your Email"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("confirmation.emailDetails") ||
                        "We've sent a confirmation email with all the details of your booking."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 mr-3 shrink-0 font-medium">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">{t("confirmation.saveCalendar") || "Save to Calendar"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("confirmation.calendarDetails") || "Add this event to your calendar so you don't forget."}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-8 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                        Google
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                        iCal
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                        Outlook
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-100 to-sky-50 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 mr-3 shrink-0 font-medium">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-50">{t("confirmation.contactVenue") || "Contact the Venue"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t("confirmation.venueDetails") ||
                        "If you have any specific questions about the venue, feel free to contact them directly."}
                    </p>
                    <Button variant="link" className="h-8 px-0 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">
                      {t("confirmation.contactButton") || "Contact Information"} <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                <Link to="/dashboard">{t("confirmation.viewBookings") || "View My Bookings"}</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200">
                <Link to="/">{t("confirmation.backToHome") || "Back to Home"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
