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
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold md:text-3xl mb-2 text-gray-900 dark:text-gray-50">{t("checkout.title") || "Payment"}</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("checkout.subtitle") || "Complete your booking by providing payment details"}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4 p-6 border border-gray-200/80 dark:border-slate-700 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{t("checkout.paymentMethod") || "Payment Method"}</h2>

                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-gray-50">{t("checkout.creditCard") || "Credit Card"}</span>
                  </div>
                  <div className="flex gap-2">
                    <img src="/placeholder.svg?height=24&width=36&text=Visa" alt="Visa" className="h-6" />
                    <img src="/placeholder.svg?height=24&width=36&text=MC" alt="Mastercard" className="h-6" />
                    <img src="/placeholder.svg?height=24&width=36&text=Amex" alt="American Express" className="h-6" />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="card-name">
                      {t("checkout.nameOnCard") || "Name on Card"}
                    </label>
                    <Input 
                      id="card-name" 
                      required 
                      className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="card-number">
                      {t("checkout.cardNumber") || "Card Number"}
                    </label>
                    <Input 
                      id="card-number" 
                      placeholder="1234 5678 9012 3456" 
                      required 
                      className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="expiry">
                        {t("checkout.expiry") || "Expiry Date"}
                      </label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                        required 
                        className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="cvc">
                        {t("checkout.cvc") || "CVC"}
                      </label>
                      <Input 
                        id="cvc" 
                        placeholder="123" 
                        required 
                        className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6 border border-gray-200/80 dark:border-slate-700 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{t("checkout.billingAddress") || "Billing Address"}</h2>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="first-name">
                        {t("checkout.firstName") || "First Name"}
                      </label>
                      <Input 
                        id="first-name" 
                        required 
                        className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="last-name">
                        {t("checkout.lastName") || "Last Name"}
                      </label>
                      <Input 
                        id="last-name" 
                        required 
                        className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="address">
                      {t("checkout.address") || "Address"}
                    </label>
                    <Input 
                      id="address" 
                      required 
                      className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="city">
                        {t("checkout.city") || "City"}
                      </label>
                      <Input 
                        id="city" 
                        required 
                        className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="zip">
                        {t("checkout.zip") || "ZIP / Postal Code"}
                      </label>
                      <Input 
                        id="zip" 
                        required 
                        className="border-gray-200 dark:border-slate-600 bg-gray-50/80 dark:bg-slate-700/50 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="country">
                      {t("checkout.country") || "Country"}
                    </label>
                    <select 
                      id="country" 
                      className="w-full p-2 border border-gray-200 dark:border-slate-600 rounded-md bg-gray-50/80 dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-400 focus:border-sky-300 dark:focus:border-sky-500 transition-all" 
                      required
                    >
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
                <Checkbox id="terms" required className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 border-gray-300 dark:border-gray-600" />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                  >
                    {t("checkout.termsAgree") || "I agree to the terms and conditions"}
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("checkout.termsDescription") ||
                      "By checking this box, you agree to our Terms of Service and Privacy Policy."}
                  </p>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/30 transition-all duration-200" 
                type="submit" 
                disabled={loading}
              >
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

              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <Lock className="h-4 w-4 mr-2" />
                {t("checkout.securePayment") || "Secure payment processing"}
              </div>
            </form>

            <div className="space-y-6">
              <div className="sticky top-6 space-y-4 p-6 border border-gray-200/80 dark:border-slate-700 rounded-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-lg">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">{t("checkout.bookingSummary") || "Booking Summary"}</h2>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-50">{booking.venue.name[language]}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{booking.venue.location[language]}</p>

                  <div className="flex items-center text-sm pt-2">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{booking.date}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {booking.time} ({booking.duration} {t("checkout.hours") || "hours"})
                    </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {booking.guests} {t("checkout.guests") || "guests"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-2">
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>
                      {t("checkout.venueRental") || "Venue rental"} ({booking.duration} {t("checkout.hours") || "hours"})
                    </span>
                    <span>${booking.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>{t("checkout.serviceFee") || "Service fee"}</span>
                    <span>${booking.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-50">
                    <span>{t("checkout.total") || "Total"}</span>
                    <span>${booking.total}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
                  {t("checkout.cancellationPolicy") || "Free cancellation up to 48 hours before the event"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
