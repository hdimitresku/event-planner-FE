"use client"

import React from "react"

import { buttonVariants } from "@/components/ui/button"

import type { FormEvent } from "react"

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
  Lightbulb,
  ShieldCheck,
  PartyPopper,
  Car,
  Camera,
  Video,
  User,
  Briefcase,
  HelpCircle,
} from "lucide-react"
import { useLanguage } from "../context/language-context"
import { cn } from "../components/ui/utils"

interface PriceInfo {
  price: number;
  pricingType: string;
}

interface OptionsInfo {
  optionName: string,
  optionJsonKey: string,
}

interface ServiceData {
  options: OptionsInfo[];
  prices: Record<string, PriceInfo>;
  icon: React.ElementType;
}

interface Services {
  [key: string]: ServiceData;
}

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

  const services: Services = {
    catering: {
      options: [
        { optionName: "Full Service", optionJsonKey: "fullService" },
        { optionName: "Buffet", optionJsonKey: "buffet" },
        { optionName: "Cocktail Hour", optionJsonKey: "cocktailHour" }
      ],
      prices: {
        fullService: { price: 45, pricingType: "fixed" },
        buffet: { price: 30, pricingType: "fixed" },
        cocktailHour: { price: 20, pricingType: "fixed" }
      },
      icon: Utensils,
    },
    music: {
      options: [
        { optionName: "DJ", optionJsonKey: "dj" },
        { optionName: "Live Music", optionJsonKey: "liveMusic" }
      ],
      prices: {
        dj: { price: 100, pricingType: "fixed" },
        liveMusic: { price: 250, pricingType: "fixed" }
      },
      icon: Music,
    },
    decoration: {
      options: [
        { optionName: "Full Decoration", optionJsonKey: "fullDecoration" },
        { optionName: "Basic Decoration", optionJsonKey: "basicDecoration" },
        { optionName: "Custom Theme", optionJsonKey: "customTheme" }
      ],
      prices: {
        fullDecoration: { price: 300, pricingType: "fixed" },
        basicDecoration: { price: 150, pricingType: "fixed" },
        customTheme: { price: 200, pricingType: "fixed" }
      },
      icon: Sparkles,
    },
    photography: {
      options: [
        { optionName: "Basic Package", optionJsonKey: "basicPackage" },
        { optionName: "Full Day Coverage", optionJsonKey: "fullDayCoverage" },
        { optionName: "Photo Booth", optionJsonKey: "photoBooth" }
      ],
      prices: {
        basicPackage: { price: 200, pricingType: "fixed" },
        fullDayCoverage: { price: 500, pricingType: "fixed" },
        photoBooth: { price: 150, pricingType: "fixed" }
      },
      icon: Camera,
    },
    videography: {
      options: [
        { optionName: "Highlight Reel", optionJsonKey: "highlightReel" },
        { optionName: "Full Event", optionJsonKey: "fullEvent" }
      ],
      prices: {
        highlightReel: { price: 300, pricingType: "fixed" },
        fullEvent: { price: 600, pricingType: "fixed" }
      },
      icon: Video,
    },
    transportation: {
      options: [
        { optionName: "Limousine", optionJsonKey: "limousine" },
        { optionName: "Shuttle Bus", optionJsonKey: "shuttleBus" },
        { optionName: "Car Rental", optionJsonKey: "carRental" }
      ],
      prices: {
        limousine: { price: 400, pricingType: "fixed" },
        shuttleBus: { price: 300, pricingType: "fixed" },
        carRental: { price: 100, pricingType: "fixed" }
      },
      icon: Car,
    },
    security: {
      options: [
        { optionName: "Basic Security", optionJsonKey: "basicSecurity" },
        { optionName: "Full Event Security", optionJsonKey: "fullEventSecurity" }
      ],
      prices: {
        basicSecurity: { price: 100, pricingType: "fixed" },
        fullEventSecurity: { price: 300, pricingType: "fixed" }
      },
      icon: ShieldCheck,
    },
    staffing: {
      options: [
        { optionName: "Wait Staff", optionJsonKey: "waitStaff" },
        { optionName: "Bartenders", optionJsonKey: "bartenders" },
        { optionName: "Coat Check", optionJsonKey: "coatCheck" }
      ],
      prices: {
        waitStaff: { price: 80, pricingType: "fixed" },
        bartenders: { price: 90, pricingType: "fixed" },
        coatCheck: { price: 40, pricingType: "fixed" }
      },
      icon: User,
    },
    entertainment: {
      options: [
        { optionName: "Magician", optionJsonKey: "magician" },
        { optionName: "Dancer", optionJsonKey: "dancer" },
        { optionName: "Fire Show", optionJsonKey: "fireShow" }
      ],
      prices: {
        magician: { price: 250, pricingType: "fixed" },
        dancer: { price: 200, pricingType: "fixed" },
        fireShow: { price: 350, pricingType: "fixed" }
      },
      icon: PartyPopper,
    },
    other: {
      options: [
        { optionName: "Custom Request", optionJsonKey: "customRequest" }
      ],
      prices: {
        customRequest: { price: 0, pricingType: "fixed" }
      },
      icon: HelpCircle,
    },
  }

  const handleSubmit = (e: FormEvent) => {
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
        const priceInfo = services[service as keyof typeof services].prices[
          option as keyof (typeof services)[keyof typeof services]["prices"]
        ]
        servicesCost += priceInfo.price
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

  // Custom calendar component with fixed days of the week
  const CustomCalendar = ({ selected, onSelect, ...props }: any) => {
    return (
      <div className="calendar-wrapper">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-2 relative items-center",
            caption_label: "text-base font-semibold text-foreground",
            nav: "space-x-2 flex items-center",
            nav_button: cn(
              buttonVariants({ variant: "outline" }),
              "h-8 w-8 bg-white/80 dark:bg-card/80 backdrop-blur-sm p-0 rounded-md border border-border hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary transition-all duration-200",
            ),
            nav_button_previous: "absolute left-2",
            nav_button_next: "absolute right-2",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full mt-2",
            head_cell:
              "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem] flex-1 flex items-center justify-center",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            ),
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent/50 text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...props.classNames,
          }}
          {...props}
        />
      </div>
    )
  }

  // Custom scrollbar styling
  const scrollbarStyles = `
  .services-container::-webkit-scrollbar {
    width: 6px;
  }
  .services-container::-webkit-scrollbar-track {
    background: transparent;
  }
  .services-container::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  .services-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
  .dark .services-container::-webkit-scrollbar-thumb {
    background-color: rgba(100, 116, 139, 0.5);
  }
  .dark .services-container::-webkit-scrollbar-thumb:hover {
    background-color: rgba(100, 116, 139, 0.7);
  }
`

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold md:text-3xl mb-2">{t("venueBook.title")}</h1>
            <p className="text-muted-foreground">{t("venueBook.subtitle", { venue: venue.name[language] })}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-semibold">{t("venueBook.eventDetails")}</h2>

                <div className="space-y-3">
                  <label className="text-sm font-medium" htmlFor="event-type">
                    {t("venueBook.eventType")}
                  </label>
                  <div className="relative">
                    <select
                      id="event-type"
                      className="hover:border-primary hover:shadow-sm w-full p-3 pr-10 border rounded-md bg-background appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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

                <div className="space-y-4">
                  <label className="text-sm font-semibold text-foreground">{t("venueBook.dateRange")}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">{t("venueBook.from")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="
                            date-picker-trigger w-full h-12 px-4 py-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm 
                            border border-input rounded-lg text-foreground font-medium 
                            hover:bg-white dark:hover:bg-card/90 hover:border-primary 
                            focus:ring-2 focus:ring-primary focus:ring-offset-2 
                            transition-all duration-200
                          "
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                                {startDate ? (
                                  <span>
                                    {format(startDate, "PPP")} {format(startDate, "p")}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">{t("venueBook.startDateTime")}</span>
                                )}
                              </div>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white/90 dark:bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-lg"
                          align="start"
                        >
                          <div className="p-4 border-b border-border">
                            <h3 className="text-base font-semibold text-foreground">
                              {t("venueBook.selectDateRange")}
                            </h3>
                          </div>
                          <CustomCalendar selected={startDate} onSelect={setStartDate} className="rounded-t-none" />
                          <div className="p-4 border-t border-border">
                            <label className="text-sm font-semibold text-foreground block mb-2">
                              {t("venueBook.startTime")}
                            </label>
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
                              className="
                              input-field w-full h-12 px-4 py-3 bg-white dark:bg-card 
                              border border-input rounded-lg text-foreground font-medium 
                              hover:border-primary focus:ring-2 focus:ring-primary focus:border-primary 
                              transition-all duration-200
                            "
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* End Date Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">{t("venueBook.to")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="
                            date-picker-trigger w-full h-12 px-4 py-3 bg-white/80 dark:bg-card/80 backdrop-blur-sm 
                            border border-input rounded-lg text-foreground font-medium 
                            hover:bg-white dark:hover:bg-card/90 hover:border-primary 
                            focus:ring-2 focus:ring-primary focus:ring-offset-2 
                            transition-all duration-200
                          "
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                                {endDate ? (
                                  <span>
                                    {format(endDate, "PPP")} {format(endDate, "p")}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">{t("venueBook.endDateTime")}</span>
                                )}
                              </div>
                            </div>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0 bg-white/90 dark:bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-lg"
                          align="start"
                        >
                          <div className="p-4 border-b border-border">
                            <h3 className="text-base font-semibold text-foreground">
                              {t("venueBook.selectDateRange")}
                            </h3>
                          </div>
                          <CustomCalendar selected={endDate} onSelect={setEndDate} className="rounded-t-none" />
                          <div className="p-4 border-t border-border">
                            <label className="text-sm font-semibold text-foreground block mb-2">
                              {t("venueBook.endTime")}
                            </label>
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
                              className="
                              input-field w-full h-12 px-4 py-3 bg-white dark:bg-card 
                              border border-input rounded-lg text-foreground font-medium 
                              hover:border-primary focus:ring-2 focus:ring-primary focus:border-primary 
                              transition-all duration-200
                            "
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {duration > 0 && (
                      <span>
                        {t("venueBook.duration")}: {duration} {t("venueBook.hours")}
                      </span>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">{t("venueBook.guests")}</label>
                  <div className="flex items-center border rounded-md bg-background overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-colors  hover:border-primary hover:shadow-sm">
                    <Users className="ml-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={venue.capacity.min}
                      max={venue.capacity.max}
                      value={guests}
                      onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("venueBook.guestCapacity", { min: venue.capacity.min, max: venue.capacity.max })}
                  </p>
                </div>
              </div>

              {/* Services Section */}
              <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div>
                  <h2 className="text-xl font-semibold">{t("venueBook.services")}</h2>
                  <p className="text-muted-foreground text-sm mt-1">{t("venueBook.servicesSubtitle")}</p>
                </div>

                {/* Scrollable Services Container */}
                <div className="services-container h-[400px] overflow-y-auto pr-2 space-y-6">
                  {/* Render each service dynamically */}
                  {Object.entries(services).map(([serviceKey, serviceData]) => (
                    <div key={serviceKey} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {React.createElement(serviceData.icon, { className: "h-5 w-5 text-primary mr-2" })}
                          <div>
                            <h3 className="font-medium">{t(`venueBook.${serviceKey}`)}</h3>
                            <p className="text-xs text-muted-foreground">{t(`venueBook.${serviceKey}Description`)}</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {selectedServices[serviceKey] ? (
                            <span className="text-primary">
                              +${serviceData.prices[selectedServices[serviceKey] as keyof typeof serviceData.prices].price}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className={`grid grid-cols-${serviceData.options.length <= 2 ? "2" : "3"} gap-2`}>
                        {serviceData.options.map((option) => {
                          const priceInfo = serviceData.prices[option.optionJsonKey];
                          return (
                            <button
                              key={option.optionJsonKey}
                              type="button"
                              className={cn(
                                "service-option flex flex-col items-center justify-center p-3 h-24 relative rounded-lg border-2 border-transparent hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-200",
                                selectedServices[serviceKey] === option.optionJsonKey
                                  ? "bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800"
                                  : "bg-gray-400/10 dark:bg-slate-800/50 hover:bg-gray-100 dark:hover:bg-slate-700/70",
                              )}
                              onClick={() => toggleService(serviceKey, option.optionJsonKey)}
                            >
                              {selectedServices[serviceKey] === option.optionJsonKey && (
                                <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                              )}
                              <span className="font-medium text-sm">{option.optionName}</span>
                              <div className="flex flex-col items-center mt-1">
                                <span className="text-xs text-muted-foreground">
                                  ${priceInfo.price}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {t(`business.pricing.${priceInfo.pricingType}`)}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <h2 className="text-xl font-semibold">{t("venueBook.contactDetails")}</h2>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 ">
                    <label className="text-sm font-medium" htmlFor="first-name">
                      {t("venueBook.firstName")}
                    </label>
                    <Input
                      id="first-name"
                      className="hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="last-name">
                      {t("venueBook.lastName")}
                    </label>
                    <Input
                      id="last-name"
                      className="hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                    className="hover:border-primary hover:shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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

              <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
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
              <div className="sticky top-6 venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
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
                  {Object.entries(selectedServices).map(([service, optionKey]) => {
                    const priceInfo = services[service as keyof typeof services].prices[optionKey];
                    const option = services[service as keyof typeof services].options.find(opt => opt.optionJsonKey === optionKey);
                    return (
                      <div key={service} className="flex justify-between text-sm">
                        <span>
                          {t(`venueBook.${service}`)} ({option?.optionName})
                          <span className="text-xs text-muted-foreground ml-1">
                            ({t(`business.pricing.${priceInfo.pricingType}`)})
                          </span>
                        </span>
                        <span>${priceInfo.price}</span>
                      </div>
                    );
                  })}

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

                <Button
                  className="w-full cta-button mt-4 bg-sky-500 hover:bg-sky-600 hover:translate-y-[-2px] transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={handleSubmit}
                >
                  {t("venueBook.continueToPayment")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">{t("venueBook.cancellationPolicy")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
