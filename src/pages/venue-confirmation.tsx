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
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold md:text-3xl mb-2">{t("confirmation.title") || "Booking Confirmed!"}</h1>
          <p className="text-muted-foreground">
            {t("confirmation.subtitle", { id: booking.id }) ||
              `Your booking (${booking.id}) has been confirmed. A confirmation email has been sent to your email address.`}
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t("confirmation.bookingDetails") || "Booking Details"}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-2" />
                  {t("confirmation.download") || "Download"}
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Share className="h-4 w-4 mr-2" />
                  {t("confirmation.share") || "Share"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("confirmation.bookingId") || "Booking ID"}</p>
                <p className="font-medium">{booking.id}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t("confirmation.bookingDate") || "Booking Date"}</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{booking.venue.name[language]}</h3>
                <div className="flex items-center text-sm mt-1">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>{booking.venue.location[language]}</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start">
                  <Calendar className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("confirmation.date") || "Date"}</p>
                    <p className="text-sm text-muted-foreground">{booking.date}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("confirmation.time") || "Time"}</p>
                    <p className="text-sm text-muted-foreground">{booking.time}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("confirmation.guests") || "Guests"}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.guests} {t("confirmation.people") || "people"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div>
              <h3 className="font-semibold mb-2">{t("confirmation.contactInfo") || "Contact Information"}</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("confirmation.name") || "Name"}</p>
                  <p className="font-medium">{booking.contact.name}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("confirmation.email") || "Email"}</p>
                  <p className="font-medium">{booking.contact.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{t("confirmation.phone") || "Phone"}</p>
                  <p className="font-medium">{booking.contact.phone}</p>
                </div>
              </div>
            </div>

            <div className="border-t my-4"></div>

            <div>
              <h3 className="font-semibold mb-2">{t("confirmation.paymentSummary") || "Payment Summary"}</h3>
              <div className="flex justify-between font-medium">
                <span>{t("confirmation.total") || "Total Paid"}</span>
                <span>${booking.total}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("confirmation.paymentMethod") || "Paid with Credit Card ending in 4242"}
              </p>
            </div>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">{t("confirmation.whatNext") || "What's Next?"}</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3 shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium">{t("confirmation.checkEmail") || "Check Your Email"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("confirmation.emailDetails") ||
                      "We've sent a confirmation email with all the details of your booking."}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3 shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium">{t("confirmation.saveCalendar") || "Save to Calendar"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("confirmation.calendarDetails") || "Add this event to your calendar so you don't forget."}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="h-8">
                      Google
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      iCal
                    </Button>
                    <Button variant="outline" size="sm" className="h-8">
                      Outlook
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3 shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium">{t("confirmation.contactVenue") || "Contact the Venue"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("confirmation.venueDetails") ||
                      "If you have any specific questions about the venue, feel free to contact them directly."}
                  </p>
                  <Button variant="link" className="h-8 px-0 text-primary">
                    {t("confirmation.contactButton") || "Contact Information"} <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link to="/dashboard">{t("confirmation.viewBookings") || "View My Bookings"}</Link>
            </Button>
            <Button asChild>
              <Link to="/">{t("confirmation.backToHome") || "Back to Home"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
