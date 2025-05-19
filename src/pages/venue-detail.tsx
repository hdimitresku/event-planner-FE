"use client"

import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Calendar } from "../components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Progress } from "../components/ui/progress"
import { useLanguage } from "../context/language-context"
import { cn } from "../lib/utils"
import {
  MapPin,
  Star,
  Users,
  Clock,
  CalendarIcon,
  Wifi,
  ParkingMeterIcon as Parking,
  Music,
  Utensils,
  Tv,
  Heart,
  Share2,
  MessageSquare,
  ChevronRight,
  Info,
  CheckCircle2,
  DollarSign,
  User,
  Settings,
  Lightbulb,
  ShieldCheck,
  PartyPopper,
  Car,
  Camera,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Input } from "../components/ui/input"
import { format } from "date-fns"
import { addHours } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { useFavorites } from "../context/favorites-context"
import { ServiceType } from "../models/service"
import * as serviceService from "../services/serviceService"

// Define price type interface
type PriceType = "hourly" | "perPerson" | "fixed" | "custom"

// Define venue interface with price type
interface Venue {
  id: string
  name: {
    en: string
    sq: string
  }
  description: {
    en: string
    sq: string
  }
  location: {
    en: string
    sq: string
  }
  rating: number
  reviews: number
  price: number
  priceType: PriceType
  type: string
  amenities: string[]
  capacity: {
    min: number
    max: number
  }
  images: string[]
  host: {
    name: string
    image: string
    responseRate: number
    responseTime: string
    joined: string
  }
  availability: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  features: string[]
  reviewsList: {
    id: number
    user: {
      name: string
      image: string
    }
    rating: number
    date: string
    comment: string
  }[]
  services: {
    [key: string]: {
      options: string[]
      prices: Record<string, number>
      icon: React.ElementType
    }
  }
}

export default function VenueDetailPage() {
  const { t, language } = useLanguage()
  const { isFavorite, toggleFavorite } = useFavorites()
  const { id } = useParams<{ id: string }>()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addHours(new Date(), 3))
  const [activeTab, setActiveTab] = useState("overview")
  const [guests, setGuests] = useState<number | undefined>(undefined)
  const [availableServiceTypes, setAvailableServiceTypes] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(false)

  // This would normally be fetched from an API with language parameter
  const venue: Venue = {
    id: id || "1",
    name: {
      en: "Stunning Loft Space with City Views",
      sq: "Hapësirë Loft Mahnitëse me Pamje nga Qyteti",
    },
    description: {
      en: "This stunning loft space offers breathtaking views of the city skyline. With floor-to-ceiling windows, exposed brick walls, and modern amenities, it's perfect for photoshoots, corporate events, and intimate gatherings. The open floor plan allows for flexible arrangements, and the natural light makes it ideal for daytime events.",
      sq: "Kjo hapësirë mahnitëse loft ofron pamje mahnitëse të horizontit të qytetit. Me dritare nga dyshemeja në tavan, mure me tulla të ekspozuara dhe pajisje moderne, është perfekte për fotografi, evente korporative dhe mbledhje intime. Plani i hapur i dyshemesë lejon aranzhime fleksibël dhe drita natyrale e bën atë ideale për ngjarje gjatë ditës.",
    },
    location: {
      en: "SoHo, New York",
      sq: "SoHo, New York",
    },
    rating: 4.9,
    reviews: 24,
    price: 150,
    priceType: "hourly",
    type: "Party Venue",
    amenities: ["WiFi", "Sound System", "Kitchen", "AV Equipment", "Parking"],
    capacity: {
      min: 10,
      max: 100,
    },
    images: [
      "/placeholder.svg?height=600&width=800&text=Venue Interior",
      "/placeholder.svg?height=600&width=800&text=Venue Exterior",
      "/placeholder.svg?height=600&width=800&text=Venue Setup",
      "/placeholder.svg?height=600&width=800&text=Venue Details",
      "/placeholder.svg?height=600&width=800&text=Venue Amenities",
    ],
    host: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=100&width=100&text=SJ",
      responseRate: 98,
      responseTime: "within an hour",
      joined: "January 2020",
    },
    availability: {
      monday: "9:00 AM - 10:00 PM",
      tuesday: "9:00 AM - 10:00 PM",
      wednesday: "9:00 AM - 10:00 PM",
      thursday: "9:00 AM - 10:00 PM",
      friday: "9:00 AM - 12:00 AM",
      saturday: "10:00 AM - 12:00 AM",
      sunday: "10:00 AM - 10:00 PM",
    },
    features: [
      "3,000 sq ft open space",
      "Floor-to-ceiling windows",
      "Exposed brick walls",
      "Hardwood floors",
      "Elevator access",
      "Heating and air conditioning",
      "Restrooms",
      "Coat check area",
    ],
    reviewsList: [
      {
        id: 1,
        user: {
          name: "Michael T.",
          image: "/placeholder.svg?height=50&width=50&text=MT",
        },
        rating: 5,
        date: "March 2023",
        comment:
          "Amazing venue! The natural light was perfect for our photoshoot. The host was very accommodating and helped us set up everything we needed.",
      },
      {
        id: 2,
        user: {
          name: "Jessica L.",
          image: "/placeholder.svg?height=50&width=50&text=JL",
        },
        rating: 5,
        date: "February 2023",
        comment:
          "We hosted our company's holiday party here and it was a hit! The space is beautiful and the views are incredible. Highly recommend!",
      },
      {
        id: 3,
        user: {
          name: "David R.",
          image: "/placeholder.svg?height=50&width=50&text=DR",
        },
        rating: 4,
        date: "January 2023",
        comment:
          "Great venue for our product launch. The only issue was limited parking, but the space itself was perfect. Would book again.",
      },
    ],
    services: {
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
      photography: {
        options: ["basicPackage", "fullDayCoverage", "photoBooth"],
        prices: { basicPackage: 200, fullDayCoverage: 500, photoBooth: 150 },
        icon: Camera,
      },
      transportation: {
        options: ["limousine", "shuttleBus", "carRental"],
        prices: { limousine: 400, shuttleBus: 300, carRental: 100 },
        icon: Car,
      },
      entertainment: {
        options: ["magician", "dancer", "fireShow"],
        prices: { magician: 250, dancer: 200, fireShow: 350 },
        icon: PartyPopper,
      },
      security: {
        options: ["basicSecurity", "fullEventSecurity"],
        prices: { basicSecurity: 100, fullEventSecurity: 300 },
        icon: ShieldCheck,
      },
      lighting: {
        options: ["ambient", "dynamic", "custom"],
        prices: { ambient: 100, dynamic: 200, custom: 300 },
        icon: Lightbulb,
      },
    },
  }

  // Get price display based on price type and language
  const getPriceDisplay = (venue: Venue) => {
    const price = venue.price
    switch (venue.priceType) {
      case "hourly":
        return `$${price}/${t("business.pricing.hourly")}`
      case "perPerson":
        return `$${price}/${t("business.pricing.perPerson")}`
      case "fixed":
        return `$${price}`
      case "custom":
        return t("business.pricing.custom")
      default:
        return `$${price}`
    }
  }

  // Get badge color and text for price type
  const getPriceTypeBadge = (priceType: PriceType) => {
    switch (priceType) {
      case "hourly":
        return {
          text: t("business.pricing.hourly"),
          bgColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-400",
        }
      case "perPerson":
        return {
          text: t("business.pricing.perPerson"),
          bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-400",
        }
      case "fixed":
        return {
          text: t("business.pricing.fixed"),
          bgColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
        }
      case "custom":
        return {
          text: t("business.pricing.custom"),
          bgColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
        }
      default:
        return {
          text: "",
          bgColor: "",
        }
    }
  }

  // Get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-4 w-4 mr-2" />
      case "Parking":
        return <Parking className="h-4 w-4 mr-2" />
      case "Sound System":
        return <Music className="h-4 w-4 mr-2" />
      case "Kitchen":
        return <Utensils className="h-4 w-4 mr-2" />
      case "AV Equipment":
        return <Tv className="h-4 w-4 mr-2" />
      default:
        return <CheckCircle2 className="h-4 w-4 mr-2" />
    }
  }

  // Get icon for price type
  const getPriceTypeIcon = (priceType: PriceType) => {
    switch (priceType) {
      case "hourly":
        return <Clock className="h-4 w-4 mr-2" />
      case "perPerson":
        return <User className="h-4 w-4 mr-2" />
      case "fixed":
        return <DollarSign className="h-4 w-4 mr-2" />
      case "custom":
        return <Settings className="h-4 w-4 mr-2" />
      default:
        return <DollarSign className="h-4 w-4 mr-2" />
    }
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

  // Calculate duration between start and end date
  const calculateDuration = () => {
    if (!selectedDate || !endDate) return 0
    return Math.max(1, Math.ceil((endDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60)))
  }

  // Add this effect to fetch available service types 
  useEffect(() => {
    const fetchServiceTypes = async () => {
      setLoading(true)
      try {
        // For now we're hardcoding the venue type as a placeholder, in a real app you'd get it from the venue
        const result = await serviceService.getServicesByVenueType(venue.type as any)
        setAvailableServiceTypes(result.serviceTypes)
      } catch (error) {
        console.error('Error fetching service types:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceTypes()
  }, [venue.type])

  // Get service icon based on service type
  const getServiceTypeIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.CATERING:
        return <Utensils className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.MUSIC:
        return <Music className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.DECORATION:
        return <Sparkles className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.PHOTOGRAPHY:
        return <Camera className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.ENTERTAINMENT:
        return <PartyPopper className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.VIDEOGRAPHY:
        return <Tv className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.TRANSPORTATION:
        return <Car className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.SECURITY:
        return <ShieldCheck className="h-5 w-5 text-sky-500 mr-2" />
      case ServiceType.STAFFING:
        return <User className="h-5 w-5 text-sky-500 mr-2" />
      default:
        return <Info className="h-5 w-5 text-sky-500 mr-2" />
    }
  }

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link to="/venues" className="hover:text-foreground transition-colors">
              {t("venues.title")}
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">{venue.name[language]}</span>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <Carousel className="w-full">
              <CarouselContent>
                {venue.images.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/1">
                    <div className="p-1">
                      <div className="overflow-hidden rounded-xl">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${venue.name[language]} - Image ${index + 1}`}
                          className="w-full h-[400px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <div className="space-y-8">
              {/* Venue Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Badge className={getPriceTypeBadge(venue.priceType).bgColor}>
                      {getPriceTypeBadge(venue.priceType).text}
                    </Badge>
                    <h1 className="text-3xl font-bold mt-2">{venue.name[language]}</h1>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-full ${isFavorite(id || '') ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'}`}
                      onClick={() => toggleFavorite(id || '', venue?.name[language] || '')}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite(id || '') ? 'fill-current' : ''}`} />
                      <span className="sr-only">{t("venues.addToFavorites")}</span>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="h-5 w-5 text-muted-foreground" />
                      <span className="sr-only">{t("venues.share")}</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{venue.location[language]}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>
                      <strong>{venue.rating}</strong> ({venue.reviews} {t("venues.reviews")})
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {venue.capacity.min}-{venue.capacity.max} {t("venues.guests")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {getPriceTypeIcon(venue.priceType)}
                    <span className="font-medium text-sky-500 dark:text-sky-400">{getPriceDisplay(venue)}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">{t("venueDetail.overview")}</TabsTrigger>
                  <TabsTrigger value="amenities">{t("venues.amenities")}</TabsTrigger>
                  <TabsTrigger value="availability">{t("venueDetail.availability")}</TabsTrigger>
                  <TabsTrigger value="reviews">{t("venueDetail.reviews")}</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-semibold">{t("venueDetail.about")}</h2>
                  </div>

                  <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-semibold">{t("venueDetail.services")}</h2>
                    
                    {loading ? (
                      <div className="flex justify-center p-4">
                        <p className="text-muted-foreground">{t("common.loading")}</p>
                      </div>
                    ) : availableServiceTypes.length === 0 ? (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">{t("venueDetail.noServices")}</p>
                      </div>
                    ) : (
                      <div className="services-container max-h-[400px] overflow-y-auto pr-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {availableServiceTypes.map((serviceType) => (
                          <div key={serviceType} className="space-y-2 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <div className="flex items-center">
                              {getServiceTypeIcon(serviceType)}
                              <h3 className="font-medium">{t(`venueBook.${serviceType.toLowerCase()}`)}</h3>
                            </div>
                           
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-semibold">{t("venueDetail.host")}</h2>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={venue.host.image || "/placeholder.svg"} alt={venue.host.name} />
                        <AvatarFallback>
                          {venue.host.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-medium">{venue.host.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>{t("venueDetail.hostSince", { date: venue.host.joined })}</p>
                          <p>
                            {t("venueDetail.responseRate")}: {venue.host.responseRate}%
                          </p>
                          <p>
                            {t("venueDetail.responseTime")}: {venue.host.responseTime}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t("venueDetail.contactHost")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Amenities Tab */}
                <TabsContent value="amenities" className="space-y-6">
                  <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-semibold">{t("venueDetail.amenities")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {venue.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                          {getAmenityIcon(amenity)}
                          <span>{t(`venues.amenities.${amenity.toLowerCase().replace(" ", "")}`) || amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Availability Tab */}
                <TabsContent value="availability" className="space-y-6">
                  <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <h2 className="text-xl font-semibold">{t("venueDetail.availability")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="font-medium">{t("venueDetail.operatingHours")}</h3>
                        <div className="space-y-2">
                          {Object.entries(venue.availability).map(([day, hours]) => (
                            <div key={day} className="flex justify-between text-sm py-2 border-b last:border-0">
                              <span className="capitalize">{t(`venueDetail.days.${day}`)}</span>
                              <span>{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-medium">{t("venueDetail.availabilityCalendar")}</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-3">{t("venueDetail.availabilityInfo")}</p>
                            <Calendar
                              mode="single"
                              selected={new Date()}
                              className="rounded-md border"
                              modifiers={{
                                available: (date) => {
                                  const today = new Date()
                                  today.setHours(0, 0, 0, 0)
                                  const unavailableDates = [
                                    new Date(2025, 4, 13),
                                    new Date(2025, 4, 14),
                                    new Date(2025, 4, 17),
                                    new Date(2025, 4, 18),
                                    new Date(2025, 4, 19),
                                    new Date(2025, 4, 23),
                                    new Date(2025, 4, 24),
                                  ]
                                  return date >= today && !unavailableDates.some(d => 
                                    d.getDate() === date.getDate() && 
                                    d.getMonth() === date.getMonth() && 
                                    d.getFullYear() === date.getFullYear()
                                  )
                                },
                                unavailable: [
                                  new Date(2025, 4, 13),
                                  new Date(2025, 4, 14),
                                  new Date(2025, 4, 17),
                                  new Date(2025, 4, 18),
                                  new Date(2025, 4, 19),
                                  new Date(2025, 4, 23),
                                  new Date(2025, 4, 24),
                                ],
                              }}
                              modifiersClassNames={{
                                available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                                unavailable:
                                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 line-through",
                              }}
                            />
                            <div className="flex items-center justify-center mt-4 space-x-4 text-sm">
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500 mr-2"></div>
                                <span>{t("venueDetail.available")}</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500 mr-2"></div>
                                <span>{t("venueDetail.unavailable")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <div className="venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">
                        {t("venueDetail.reviews")} ({venue.reviews})
                      </h2>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium text-lg">{venue.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-3">
                        <h3 className="font-medium">{t("venueDetail.ratingBreakdown")}</h3>
                        {[
                          { label: t("venueDetail.location"), value: 4.8 },
                          { label: t("venueDetail.cleanliness"), value: 5.0 },
                          { label: t("venueDetail.accuracy"), value: 4.9 },
                          { label: t("venueDetail.value"), value: 4.7 },
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <span className="text-sm min-w-[100px]">{item.label}</span>
                            <Progress value={(item.value / 5) * 100} className="h-2" />
                            <span className="text-sm font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {venue.reviewsList.map((review) => (
                        <div key={review.id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.user.image || "/placeholder.svg"} alt={review.user.name} />
                              <AvatarFallback>
                                {review.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <h4 className="font-medium">{review.user.name}</h4>
                                <span className="mx-2">•</span>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700",
                                    )}
                                  />
                                ))}
                              </div>
                              <p className="text-muted-foreground mt-2">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Card */}
            <div className="space-y-6">
              <div className="sticky top-6 venue-card p-6 space-y-5 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getPriceTypeIcon(venue.priceType)}
                      <span className="font-medium text-xl text-sky-500 dark:text-sky-400">
                        {getPriceDisplay(venue)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">
                        {venue.rating} ({venue.reviews})
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {venue.priceType === "hourly"
                      ? t("venueDetail.pricePerHour")
                      : venue.priceType === "perPerson"
                        ? t("venueDetail.pricePerPerson")
                        : t("venueDetail.priceTotal")}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">{t("venueDetail.bookingDetails")}</h3>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">{t("venueDetail.startDateTime")}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-dashed">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP p")
                          ) : (
                            <span>{t("venueDetail.pickStartDateTime")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        <div className="p-3 border-t border-border">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("venueDetail.time")}</label>
                            <Input
                              type="time"
                              value={selectedDate ? format(selectedDate, "HH:mm") : "10:00"}
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [hours, minutes] = e.target.value.split(":").map(Number)
                                  const newDate = new Date(selectedDate || new Date())
                                  newDate.setHours(hours, minutes)
                                  setSelectedDate(newDate)
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">{t("venueDetail.endDateTime")}</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal border-dashed">
                          <Clock className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP p") : <span>{t("venueDetail.pickEndDateTime")}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                        <div className="p-3 border-t border-border">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("venueDetail.time")}</label>
                            <Input
                              type="time"
                              value={endDate ? format(endDate, "HH:mm") : "13:00"}
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [hours, minutes] = e.target.value.split(":").map(Number)
                                  const newDate = new Date(endDate || new Date())
                                  newDate.setHours(hours, minutes)
                                  setEndDate(newDate)
                                }
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">{t("venueDetail.guests")}</label>
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <Users className="ml-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min={venue.capacity.min}
                        max={venue.capacity.max}
                        value={guests || venue.capacity.min}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("venueBook.guestCapacity", { min: venue.capacity.min, max: venue.capacity.max })}
                    </p>
                  </div>

                  {selectedDate && endDate && (
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {t("venueDetail.duration")}: {calculateDuration()} {t("venueBook.hours")}
                      </p>
                      <p className="font-medium text-foreground mt-1">
                        {t("venueDetail.estimatedCost")}: ${venue.price * calculateDuration()}
                      </p>
                    </div>
                  )}
                </div>

                <Link
                  to={`/venues/${venue.id}/book`}
                  state={{
                    startDate: selectedDate,
                    endDate: endDate,
                    guests: guests || venue.capacity.min,
                    duration: calculateDuration(),
                  }}
                >
                  <Button
                    className="w-full cta-button mt-4 bg-sky-500 hover:bg-sky-600 hover:translate-y-[-2px] transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={!selectedDate || !endDate}
                  >
                    {t("venueDetail.bookNow")}
                  </Button>
                </Link>

                <div className="flex items-center justify-center text-sm text-muted-foreground mt-4">
                  <Info className="h-4 w-4 mr-2" />
                  <span>{t("venueDetail.noCharge")}</span>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t("venueDetail.contactHost")}
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
                <h3 className="font-medium mb-3">{t("venueDetail.similarVenues")}</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Link
                      key={i}
                      to={`/venues/${i + 10}`}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <img
                        src={`/placeholder.svg?height=60&width=60&text=Venue ${i}`}
                        alt={`Similar Venue ${i}`}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {language === "en" ? `Similar Venue ${i}` : `Ambient i Ngjashëm ${i}`}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          ${venue.price - 20 + i * 10}/{t("business.pricing.hourly")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
