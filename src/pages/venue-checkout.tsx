"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Calendar, Clock, Users, CreditCard, Lock, ArrowRight } from "lucide-react"
import { useLanguage } from "../context/language-context"

export default function VenueCheckoutPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, language } = useLanguage()

  const [loading, setLoading] = useState(false)

  // This would normally be fetched from an API with language parameter
  const booking = {
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
    basePrice: 300,
    serviceFee: 45,
    total: 345,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      navigate(`/venues/${id}/confirmation`)
    }, 1500)
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl mb-2">{t("checkout.title") || "Payment"}</h1>
          <p className="text-muted-foreground">
            {t("checkout.subtitle") || "Complete your booking by providing payment details"}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_350px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4 p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">{t("checkout.paymentMethod") || "Payment Method"}</h2>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">{t("checkout.creditCard") || "Credit Card"}</span>
                </div>
                <div className="flex gap-2">
                  <img src="/placeholder.svg?height=24&width=36&text=Visa" alt="Visa" className="h-6" />
                  <img src="/placeholder.svg?height=24&width=36&text=MC" alt="Mastercard" className="h-6" />
                  <img src="/placeholder.svg?height=24&width=36&text=Amex" alt="American Express" className="h-6" />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="card-name">
                    {t("checkout.nameOnCard") || "Name on Card"}
                  </label>
                  <Input id="card-name" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="card-number">
                    {t("checkout.cardNumber") || "Card Number"}
                  </label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="expiry">
                      {t("checkout.expiry") || "Expiry Date"}
                    </label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="cvc">
                      {t("checkout.cvc") || "CVC"}
                    </label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">{t("checkout.billingAddress") || "Billing Address"}</h2>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="first-name">
                      {t("checkout.firstName") || "First Name"}
                    </label>
                    <Input id="first-name" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="last-name">
                      {t("checkout.lastName") || "Last Name"}
                    </label>
                    <Input id="last-name" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="address">
                    {t("checkout.address") || "Address"}
                  </label>
                  <Input id="address" required />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="city">
                      {t("checkout.city") || "City"}
                    </label>
                    <Input id="city" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="zip">
                      {t("checkout.zip") || "ZIP / Postal Code"}
                    </label>
                    <Input id="zip" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="country">
                    {t("checkout.country") || "Country"}
                  </label>
                  <select id="country" className="w-full p-2 border rounded-md bg-background" required>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="AL">Albania</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="terms" required />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("checkout.termsAgree") || "I agree to the terms and conditions"}
                </label>
                <p className="text-sm text-muted-foreground">
                  {t("checkout.termsDescription") ||
                    "By checking this box, you agree to our Terms of Service and Privacy Policy."}
                </p>
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("checkout.processing") || "Processing..."}
                </span>
              ) : (
                <span className="flex items-center">
                  {t("checkout.completeBooking") || "Complete Booking"} <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>

            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Lock className="h-4 w-4 mr-2" />
              {t("checkout.securePayment") || "Secure payment processing"}
            </div>
          </form>

          <div className="space-y-6">
            <div className="sticky top-6 space-y-4 p-6 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">{t("checkout.bookingSummary") || "Booking Summary"}</h2>

              <div className="space-y-2">
                <h3 className="font-medium">{booking.venue.name[language]}</h3>
                <p className="text-sm text-muted-foreground">{booking.venue.location[language]}</p>

                <div className="flex items-center text-sm pt-2">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{booking.date}</span>
                </div>

                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.time} ({booking.duration} {t("checkout.hours") || "hours"})
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {booking.guests} {t("checkout.guests") || "guests"}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>
                    {t("checkout.venueRental") || "Venue rental"} ({booking.duration} {t("checkout.hours") || "hours"})
                  </span>
                  <span>${booking.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout.serviceFee") || "Service fee"}</span>
                  <span>${booking.serviceFee}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>{t("checkout.total") || "Total"}</span>
                  <span>${booking.total}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                {t("checkout.cancellationPolicy") || "Free cancellation up to 48 hours before the event"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
