"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Calendar } from "../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { format, addHours } from "date-fns"
import {
  CalendarIcon,
  Clock,
  Users,
  Info,
  ArrowRight,
  Utensils,
  Music,
  Sparkles,
  Check,
  ChevronDown,
} from "lucide-react"
import { useLanguage } from "../context/language-context"
import { cn } from "../components/ui/utils"

export default function VenueBookPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, language } = useLanguage()

  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addHours(new Date(), 3))
  const [guests, setGuests] = useState(50)
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({})

  // This would normally be fetched from an API with language parameter
  const venue = {
    id,
    name: {
      en: "Stunning Loft Space with City Views",
      sq: "Hapësirë Loft Mahnitëse me Pamje nga Qyteti",
    },
    location: {
      en: "SoHo, New York",
      sq: "SoHo, New York",
    },
    price: 150,
    capacity: {
      min: 10,
      max: 100,
    },
  }

  const services = {
    catering: {
      options: ["fullService", "buffet", "cocktailHour"],
      prices: { fullService: 45, buffet: 30, cocktailHour: 20 },
      icon: Utensils,
    },
    music: {
      options: ["dj", "liveMusic"],
      prices: { dj: 100, liveMusic: 250 },
      icon: Music,
    },
    decoration: {
      options: ["fullDecoration", "basicDecoration", "customTheme"],
      prices: { fullDecoration: 300, basicDecoration: 150, customTheme: 200 },
      icon: Sparkles,
    },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the booking data to an API
    navigate(`/venues/${id}/checkout`)
  }

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0
    return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)))
  }

  const calculateTotal = () => {
    const duration = calculateDuration()
    const basePrice = venue.price * duration
    const serviceFee = Math.round(basePrice * 0.15)

    // Calculate additional services cost
    let servicesCost = 0
    Object.entries(selectedServices).forEach(([service, option]) => {
      if (option && services[service as keyof typeof services]) {
        servicesCost +=
            services[service as keyof typeof services].prices[
                option as keyof (typeof services)[keyof typeof services]["prices"]
                ] || 0
      }
    })

    return {
      basePrice,
      serviceFee,
      servicesCost,
      total: basePrice + serviceFee + servicesCost,
    }
  }

  const toggleService = (service: string, option: string) => {
    setSelectedServices((prev) => {
      const newServices = { ...prev }
      if (newServices[service] === option) {
        delete newServices[service]
      } else {
        newServices[service] = option
      }
      return newServices
    })
  }

  const { basePrice, serviceFee, servicesCost, total } = calculateTotal()
  const duration = calculateDuration()

  return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold md:text-3xl mb-2">{t("venueBook.title")}</h1>
            <p className="text-muted-foreground">{t("venueBook.subtitle", { venue: venue.name[language] })}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="venue-card p-6 space-y-5">
                <h2 className="text-xl font-semibold">{t("venueBook.eventDetails")}</h2>

                <div className="space-y-3">
                  <label className="text-sm font-medium" htmlFor="event-type">
                    {t("venueBook.eventType")}
                  </label>
                  <div className="relative">
                    <select
                        id="event-type"
                        className="w-full p-3 pr-10 border rounded-md bg-background appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                    >
                      <option value="">{t("venueBook.selectEventType")}</option>
                      <option value="corporate">{t("venueBook.corporate")}</option>
                      <option value="wedding">{t("venueBook.wedding")}</option>
                      <option value="birthday">{t("venueBook.birthday")}</option>
                      <option value="photoshoot">{t("venueBook.photoshoot")}</option>
                      <option value="other">{t("venueBook.other")}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">{t("venueBook.dateRange")}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">{t("venueBook.from")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="date-picker-trigger">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                              {startDate ? (
                                  <span>
                                {format(startDate, "PPP")} {format(startDate, "p")}
                              </span>
                              ) : (
                                  <span>{t("venueBook.startDateTime")}</span>
                              )}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 border-b">
                            <h3 className="font-medium">{t("venueBook.selectDateRange")}</h3>
                          </div>
                          <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={setStartDate}
                              initialFocus
                              className="rounded-t-none"
                          />
                          <div className="p-3 border-t">
                            <label className="text-sm font-medium block mb-2">{t("venueBook.startTime")}</label>
                            <Input
                                type="time"
                                value={startDate ? format(startDate, "HH:mm") : "10:00"}
                                onChange={(e) => {
                                  if (startDate && e.target.value) {
                                    const [hours, minutes] = e.target.value.split(":").map(Number)
                                    const newDate = new Date(startDate)
                                    newDate.setHours(hours, minutes)
                                    setStartDate(newDate)
                                  }
                                }}
                                className="w-full"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">{t("venueBook.to")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="date-picker-trigger">
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {endDate ? (
                                  <span>
                                {format(endDate, "PPP")} {format(endDate, "p")}
                              </span>
                              ) : (
                                  <span>{t("venueBook.endDateTime")}</span>
                              )}
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <div className="p-3 border-b">
                            <h3 className="font-medium">{t("venueBook.selectDateRange")}</h3>
                          </div>
                          <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={setEndDate}
                              initialFocus
                              className="rounded-t-none"
                          />
                          <div className="p-3 border-t">
                            <label className="text-sm font-medium block mb-2">{t("venueBook.endTime")}</label>
                            <Input
                                type="time"
                                value={endDate ? format(endDate, "HH:mm") : "13:00"}
                                onChange={(e) => {
                                  if (endDate && e.target.value) {
                                    const [hours, minutes] = e.target.value.split(":").map(Number)
                                    const newDate = new Date(endDate)
                                    newDate.setHours(hours, minutes)
                                    setEndDate(newDate)
                                  }
                                }}
                                className="w-full"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {duration > 0 && (
                        <span>
                      {t("venueBook.duration")}: {duration} {t("venueBook.hours")}
                    </span>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">{t("venueBook.guests")}</label>
                  <div className="flex items-center border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors">
                    <Users className="ml-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="number"
                        min={venue.capacity.min}
                        max={venue.capacity.max}
                        value={guests}
                        onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("venueBook.guestCapacity", { min: venue.capacity.min, max: venue.capacity.max })}
                  </p>
                </div>
              </div>

              {/* Services Section */}
              <div className="venue-card p-6 space-y-5">
                <div>
                  <h2 className="text-xl font-semibold">{t("venueBook.services")}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{t("venueBook.servicesSubtitle")}</p>
                </div>

                {/* Catering Service */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Utensils className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <h3 className="font-medium">{t("venueBook.catering")}</h3>
                        <p className="text-xs text-muted-foreground">{t("venueBook.cateringDescription")}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {selectedServices.catering ? (
                          <span className="text-primary">
                        +${services.catering.prices[selectedServices.catering as keyof typeof services.catering.prices]}
                      </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {services.catering.options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={cn(
                                "service-option flex flex-col items-center justify-center p-3 h-24",
                                selectedServices.catering === option ? "selected" : "",
                            )}
                            onClick={() => toggleService("catering", option)}
                        >
                          {selectedServices.catering === option && (
                              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                          )}
                          <span className="font-medium text-sm">{t(`venueBook.${option}`)}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                        ${services.catering.prices[option as keyof typeof services.catering.prices]}
                      </span>
                        </button>
                    ))}
                  </div>
                </div>

                {/* Music Service */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Music className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <h3 className="font-medium">{t("venueBook.music")}</h3>
                        <p className="text-xs text-muted-foreground">{t("venueBook.musicDescription")}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {selectedServices.music ? (
                          <span className="text-primary">
                        +${services.music.prices[selectedServices.music as keyof typeof services.music.prices]}
                      </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {services.music.options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={cn(
                                "service-option flex flex-col items-center justify-center p-3 h-24",
                                selectedServices.music === option ? "selected" : "",
                            )}
                            onClick={() => toggleService("music", option)}
                        >
                          {selectedServices.music === option && (
                              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                          )}
                          <span className="font-medium text-sm">{t(`venueBook.${option}`)}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                        ${services.music.prices[option as keyof typeof services.music.prices]}
                      </span>
                        </button>
                    ))}
                  </div>
                </div>

                {/* Decoration Service */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Sparkles className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <h3 className="font-medium">{t("venueBook.decoration")}</h3>
                        <p className="text-xs text-muted-foreground">{t("venueBook.decorationDescription")}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {selectedServices.decoration ? (
                          <span className="text-primary">
                        +$
                            {
                              services.decoration.prices[
                                  selectedServices.decoration as keyof typeof services.decoration.prices
                                  ]
                            }
                      </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {services.decoration.options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            className={cn(
                                "service-option flex flex-col items-center justify-center p-3 h-24",
                                selectedServices.decoration === option ? "selected" : "",
                            )}
                            onClick={() => toggleService("decoration", option)}
                        >
                          {selectedServices.decoration === option && (
                              <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                          )}
                          <span className="font-medium text-sm">{t(`venueBook.${option}`)}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                        ${services.decoration.prices[option as keyof typeof services.decoration.prices]}
                      </span>
                        </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="venue-card p-6 space-y-5">
                <h2 className="text-xl font-semibold">{t("venueBook.contactDetails")}</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="first-name">
                      {t("venueBook.firstName")}
                    </label>
                    <Input
                        id="first-name"
                        className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="last-name">
                      {t("venueBook.lastName")}
                    </label>
                    <Input
                        id="last-name"
                        className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    {t("venueBook.email")}
                  </label>
                  <Input
                      id="email"
                      type="email"
                      className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    {t("venueBook.phone")}
                  </label>
                  <Input
                      id="phone"
                      type="tel"
                      className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                  />
                </div>
              </div>

              <div className="venue-card p-6 space-y-5">
                <h2 className="text-xl font-semibold">{t("venueBook.additionalInfo")}</h2>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="special-requests">
                    {t("venueBook.specialRequests")}
                  </label>
                  <Textarea
                      id="special-requests"
                      placeholder={t("venueBook.specialRequestsPlaceholder")}
                      className="min-h-[100px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </form>

            <div className="space-y-6">
              <div className="sticky top-6 venue-card p-6 space-y-5">
                <h2 className="text-xl font-semibold">{t("venueBook.summary")}</h2>

                <div className="space-y-3">
                  <h3 className="font-medium">{venue.name[language]}</h3>
                  <p className="text-sm text-muted-foreground">{venue.location[language]}</p>

                  <div className="flex items-center text-sm pt-2">
                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{startDate ? format(startDate, "PPP") : t("venueBook.date")}</span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                    {startDate ? format(startDate, "p") : ""} - {endDate ? format(endDate, "p") : ""}
                      {duration > 0 && ` (${duration} ${t("venueBook.hours")})`}
                  </span>
                  </div>

                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                    {guests} {t("venueBook.guests")}
                  </span>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4 space-y-2">
                  <div className="flex justify-between">
                  <span>
                    {t("venueBook.venueRental")} ({duration} {t("venueBook.hours")})
                  </span>
                    <span>${basePrice}</span>
                  </div>

                  {/* Services summary */}
                  {Object.entries(selectedServices).map(([service, option]) => (
                      <div key={service} className="flex justify-between text-sm">
                    <span>
                      {t(`venueBook.${service}`)} ({t(`venueBook.${option}`)})
                    </span>
                        <span>
                      $
                          {
                            services[service as keyof typeof services].prices[
                                option as keyof (typeof services)[keyof typeof services]["prices"]
                                ]
                          }
                    </span>
                      </div>
                  ))}

                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span>{t("venueBook.serviceFee")}</span>
                      <div className="relative ml-1 group">
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                          {t("venueBook.serviceFeeInfo")}
                        </div>
                      </div>
                    </div>
                    <span>${serviceFee}</span>
                  </div>

                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>{t("venueBook.total")}</span>
                    <span>${total}</span>
                  </div>
                </div>

                <Button className="w-full cta-button mt-4" onClick={handleSubmit}>
                  {t("venueBook.continueToPayment")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">{t("venueBook.cancellationPolicy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
