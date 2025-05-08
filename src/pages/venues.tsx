"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Slider } from "../components/ui/slider"
import { Checkbox } from "../components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Badge } from "../components/ui/badge"
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Filter,
  Star,
  Wifi,
  ParkingMeterIcon as Parking,
  Music,
  Utensils,
  Tv,
  Heart,
  Clock,
  User,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

// Define price type interface
type PriceType = "hourly" | "perPerson" | "fixed" | "custom"

// Define venue interface with price type
interface Venue {
  id: number
  name: {
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
}

export default function VenuesPage() {
  const { t, language } = useLanguage()
  const [priceRange, setPriceRange] = useState<number[]>([250])
  const [venueTypes, setVenueTypes] = useState<Record<string, boolean>>({
    "Meeting Room": false,
    "Party Venue": false,
    "Photography Studio": false,
    "Wedding Venue": false,
    "Outdoor Space": false,
  })
  const [priceTypes, setPriceTypes] = useState<Record<PriceType, boolean>>({
    hourly: false,
    perPerson: false,
    fixed: false,
    custom: false,
  })
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    WiFi: false,
    Parking: false,
    "Sound System": false,
    Kitchen: false,
    "AV Equipment": false,
  })
  const [searchParams, setSearchParams] = useState({
    location: "",
    date: "",
    guests: "",
  })

  // This would normally be fetched from an API with language parameter
  const allVenues: Venue[] = [
    {
      id: 1,
      name: {
        en: "Stunning Loft Space",
        sq: "Hapësirë Loft Mahnitëse",
      },
      location: {
        en: "Manhattan, NY",
        sq: "Manhattan, NY",
      },
      rating: 4.9,
      reviews: 24,
      price: 150,
      priceType: "hourly",
      type: "Party Venue",
      amenities: ["WiFi", "Sound System"],
    },
    {
      id: 2,
      name: {
        en: "Rooftop Garden",
        sq: "Kopshti në Çati",
      },
      location: {
        en: "Brooklyn, NY",
        sq: "Brooklyn, NY",
      },
      rating: 4.7,
      reviews: 18,
      price: 200,
      priceType: "perPerson",
      type: "Outdoor Space",
      amenities: ["WiFi", "Kitchen"],
    },
    {
      id: 3,
      name: {
        en: "Modern Gallery",
        sq: "Galeri Moderne",
      },
      location: {
        en: "Chelsea, NY",
        sq: "Chelsea, NY",
      },
      rating: 4.8,
      reviews: 32,
      price: 300,
      priceType: "fixed",
      type: "Photography Studio",
      amenities: ["WiFi", "AV Equipment"],
    },
    {
      id: 4,
      name: {
        en: "Penthouse Lounge",
        sq: "Sallon Penthouse",
      },
      location: {
        en: "Soho, NY",
        sq: "Soho, NY",
      },
      rating: 4.6,
      reviews: 14,
      price: 250,
      priceType: "hourly",
      type: "Party Venue",
      amenities: ["WiFi", "Sound System", "Kitchen"],
    },
    {
      id: 5,
      name: {
        en: "Historic Ballroom",
        sq: "Sallë Vallëzimi Historike",
      },
      location: {
        en: "Upper East Side, NY",
        sq: "Upper East Side, NY",
      },
      rating: 4.8,
      reviews: 28,
      price: 350,
      priceType: "perPerson",
      type: "Wedding Venue",
      amenities: ["WiFi", "Sound System", "Kitchen", "AV Equipment"],
    },
    {
      id: 6,
      name: {
        en: "Art Studio",
        sq: "Studio Arti",
      },
      location: {
        en: "Tribeca, NY",
        sq: "Tribeca, NY",
      },
      rating: 4.5,
      reviews: 16,
      price: 180,
      priceType: "custom",
      type: "Photography Studio",
      amenities: ["WiFi", "AV Equipment"],
    },
    {
      id: 7,
      name: {
        en: "Waterfront Venue",
        sq: "Ambient Buzë Ujit",
      },
      location: {
        en: "Williamsburg, NY",
        sq: "Williamsburg, NY",
      },
      rating: 4.7,
      reviews: 22,
      price: 280,
      priceType: "fixed",
      type: "Wedding Venue",
      amenities: ["WiFi", "Parking", "Sound System"],
    },
    {
      id: 8,
      name: {
        en: "Terrace Space",
        sq: "Hapësirë Tarrace",
      },
      location: {
        en: "Midtown, NY",
        sq: "Midtown, NY",
      },
      rating: 4.4,
      reviews: 12,
      price: 120,
      priceType: "hourly",
      type: "Outdoor Space",
      amenities: ["WiFi", "Parking"],
    },
    {
      id: 9,
      name: {
        en: "Luxury Lounge",
        sq: "Sallon Luksoz",
      },
      location: {
        en: "Queens, NY",
        sq: "Queens, NY",
      },
      rating: 4.9,
      reviews: 30,
      price: 220,
      priceType: "perPerson",
      type: "Meeting Room",
      amenities: ["WiFi", "AV Equipment", "Kitchen"],
    },
  ]

  // Filter venues based on selected filters
  const filteredVenues = allVenues.filter((venue) => {
    // Price filter
    if (venue.price > priceRange[0]) return false

    // Venue type filter
    const selectedTypes = Object.entries(venueTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type)
    if (selectedTypes.length > 0 && !selectedTypes.includes(venue.type)) return false

    // Price type filter
    const selectedPriceTypes = Object.entries(priceTypes)
      .filter(([_, selected]) => selected)
      .map(([type]) => type as PriceType)
    if (selectedPriceTypes.length > 0 && !selectedPriceTypes.includes(venue.priceType)) return false

    // Amenities filter
    const selectedAmenities = Object.entries(amenities)
      .filter(([_, selected]) => selected)
      .map(([amenity]) => amenity)
    if (selectedAmenities.length > 0 && !selectedAmenities.every((amenity) => venue.amenities.includes(amenity)))
      return false

    // Search filters
    if (searchParams.location && !venue.location[language].toLowerCase().includes(searchParams.location.toLowerCase()))
      return false

    return true
  })

  const handleVenueTypeChange = (type: string, checked: boolean) => {
    setVenueTypes((prev) => ({ ...prev, [type]: checked }))
  }

  const handlePriceTypeChange = (type: PriceType, checked: boolean) => {
    setPriceTypes((prev) => ({ ...prev, [type]: checked }))
  }

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setAmenities((prev) => ({ ...prev, [amenity]: checked }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const selectedDate = searchParams.date ? new Date(searchParams.date) : "";


  const handleDateChange = (date: Date) => {
    handleSearchChange({
      target: {
        name: "date",
        value: date ? format(date, "yyyy-MM-dd") : "",
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };


  const handleSearch = () => {
    // In a real app, this would trigger an API call with the search parameters
    console.log("Searching with params:", searchParams)
  }

  const clearAllFilters = () => {
    setPriceRange([250])
    setVenueTypes({
      "Meeting Room": false,
      "Party Venue": false,
      "Photography Studio": false,
      "Wedding Venue": false,
      "Outdoor Space": false,
    })
    setPriceTypes({
      hourly: false,
      perPerson: false,
      fixed: false,
      custom: false,
    })
    setAmenities({
      WiFi: false,
      Parking: false,
      "Sound System": false,
      Kitchen: false,
      "AV Equipment": false,
    })
    setSearchParams({
      location: "",
      date: "",
      guests: "",
    })
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

  return (
    <div className="container px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <div className="inline-flex items-center px-3 py-1 text-sm font-medium text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/40 rounded-full mb-2">
          <span>{t("venues.discover") || "Discover"}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-50 mb-2">
          {t("venues.heading") || "Find Your Perfect Venue"}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          {t("venues.subheading") || "Browse our curated selection of unique venues for your next event"}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6" >
          <div className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
            <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-50 mb-5 flex items-center">
              <Search className="mr-2 h-5 w-5 text-sky-500 dark:text-sky-400" />
              {t("venues.searchBar.title") || "Search"}
            </h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="location">
                  {t("venues.searchBar.location") || "Location"}
                </label>
                <div className="rounded-lg border border-transparent transition-all hover:border-primary hover:shadow-sm flex items-center gap-2 border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                  <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="location"
                    name="location"
                    value={searchParams.location}
                    onChange={handleSearchChange}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    placeholder={t("venues.searchBar.locationPlaceholder") || "City, neighborhood, or address"}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="date">
                  {t("venues.searchBar.date") || "Date"}
                </label>
                <div className="rounded-lg border border-transparent transition-all hover:border-primary hover:shadow-sm flex items-center gap-2 border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                  <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="date"
                    name="date"
                    value={searchParams.date}
                    onChange={handleSearchChange}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    type="date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="guests">
                  {t("venues.searchBar.guests") || "Guests"}
                </label>
                <div className="rounded-lg border border-transparent transition-all hover:border-primary hover:shadow-sm flex items-center gap-2 border rounded-md p-3 bg-gray-50 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-sky-400 transition-all">
                  <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="guests"
                    name="guests"
                    value={searchParams.guests}
                    onChange={handleSearchChange}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    type="number"
                    placeholder={t("venues.searchBar.guestsPlaceholder") || "Number of guests"}
                  />
                </div>
              </div>
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white shadow-sm" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" /> {t("venues.searchBar.button") || "Search"}
              </Button>
            </div>
          </div>
          <div className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-50 flex items-center">
                <Filter className="mr-2 h-5 w-5 text-sky-500 dark:text-sky-400" />
                {t("venues.filters.title") || "Filters"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300"
                onClick={clearAllFilters}
              >
                {t("venues.filters.clearAll") || "Clear All"}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.filters.priceRange") || "Price Range"}
                </h3>
                <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="py-2" />
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="font-medium">$0</div>
                  <div className="font-medium text-sky-500 dark:text-sky-400">${priceRange[0]}</div>
                  <div className="font-medium">$500</div>
                </div>
              </div>

              {/* Price Type Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.filters.priceType") || "Price Type"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-hourly"
                      checked={priceTypes.hourly}
                      onCheckedChange={(checked) => handlePriceTypeChange("hourly", checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-hourly"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <Clock className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.pricing.hourly")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-perPerson"
                      checked={priceTypes.perPerson}
                      onCheckedChange={(checked) => handlePriceTypeChange("perPerson", checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-perPerson"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.pricing.perPerson")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-fixed"
                      checked={priceTypes.fixed}
                      onCheckedChange={(checked) => handlePriceTypeChange("fixed", checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-fixed"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.pricing.fixed")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-custom"
                      checked={priceTypes.custom}
                      onCheckedChange={(checked) => handlePriceTypeChange("custom", checked === true)}
                      className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                    />
                    <label
                      htmlFor="price-type-custom"
                      className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                    >
                      <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {t("business.pricing.custom")}
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.venueType") || "Venue Type"}
                </h3>
                <div className="space-y-3">
                  {Object.keys(venueTypes).map((type) => {
                    // Map venue types to keys for business.venueTypes translations
                    const typeKey =
                      type === "Meeting Room"
                        ? "other"
                        : type === "Party Venue"
                          ? "ballroom"
                          : type === "Photography Studio"
                            ? "loft"
                            : type === "Wedding Venue"
                              ? "ballroom"
                              : type === "Outdoor Space"
                                ? "garden"
                                : "other"

                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={venueTypes[type]}
                          onCheckedChange={(checked) => handleVenueTypeChange(type, checked === true)}
                          className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                        >
                          {t(`business.venueTypes.${typeKey}`)}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("venues.amenities") || "Amenities"}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: t("venues.amenities.wifi") || "WiFi", icon: Wifi, key: "WiFi" },
                    { label: t("venues.amenities.parking") || "Parking", icon: Parking, key: "Parking" },
                    { label: t("venues.amenities.soundSystem") || "Sound System", icon: Music, key: "Sound System" },
                    { label: t("venues.amenities.kitchen") || "Kitchen", icon: Utensils, key: "Kitchen" },
                    { label: t("venues.amenities.avEquipment") || "AV Equipment", icon: Tv, key: "AV Equipment" },
                  ].map((amenity) => (
                    <div key={amenity.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.key}`}
                        checked={amenities[amenity.key]}
                        onCheckedChange={(checked) => handleAmenityChange(amenity.key, checked === true)}
                        className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 border-2 group-hover:border-sky-400 transition-all duration-200 scale-100 group-hover:scale-110"
                      />
                      <label
                        htmlFor={`amenity-${amenity.key}`}
                        className="flex items-center text-sm font-medium leading-none text-gray-700 dark:text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hover:text-sky-600 dark:hover:text-sky-400 transition-colors duration-200 cursor-pointer group"
                      >
                        <amenity.icon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white shadow-sm">
                <Filter className="mr-2 h-4 w-4" /> {t("venues.filters.applyFilters") || "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="card-hover bg-background rounded-lg overflow-hidden shadow-soft space-y-0 flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
            <h1 className="text-xl font-bold  text-gray-800 dark:text-gray-50">
              {t("venues.title") || "Venues in New York"}
            </h1>
            <div className="rounded-md bg-background border border-muted shadow-sm hover:border-primary hover:ring-1 hover:ring-primary"
>
              <Select defaultValue="recommended">
                <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700/50">
                  <SelectValue placeholder={t("venues.sortBy") || "Sort by"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">{t("venues.sort.recommended") || "Recommended"}</SelectItem>
                  <SelectItem value="price-low">{t("venues.sort.priceLowToHigh") || "Price: Low to High"}</SelectItem>
                  <SelectItem value="price-high">{t("venues.sort.priceHighToLow") || "Price: High to Low"}</SelectItem>
                  <SelectItem value="rating">{t("venues.sort.topRated") || "Top Rated"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
            {filteredVenues.map((venue) => (
              <Link to={`/venues/${venue.id}`} key={venue.id} className="group">
                <div className="space-y-3 bg-white dark:bg-slate-800 rounded-xl overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-sof shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                  <div className="relative overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=300&width=400&text=Venue ${venue.id}`}
                      alt={venue.name[language]}
                      className="h-[200px] w-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    <Badge className={`absolute top-2 left-2 ${getPriceTypeBadge(venue.priceType).bgColor}`}>
                      {getPriceTypeBadge(venue.priceType).text}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">{t("venues.addToFavorites") || "Add to favorites"}</span>
                    </Button>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-50 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                      {venue.name[language]}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                      <span>{venue.location[language]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {venue.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({venue.reviews} {t("venues.reviews") || "reviews"})
                      </span>
                    </div>
                    <p className="font-medium text-sky-500 dark:text-sky-400">{getPriceDisplay(venue)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filteredVenues.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="h-16 w-16 mx-auto rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-sky-500 dark:text-sky-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-50">
                {t("venues.noResults") || "No venues found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {t("venues.tryAdjusting") || "Try adjusting your filters or search criteria"}
              </p>
              <Button
                variant="outline"
                className="mt-4 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                onClick={clearAllFilters}
              >
                {t("venues.filters.clearAll") || "Clear all filters"}
              </Button>
            </div>
          )}
          {filteredVenues.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                disabled
                className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                <span className="sr-only">{t("venues.previousPage") || "Previous page"}</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-sky-500 bg-sky-500 text-white" disabled>
                1
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                2
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                3
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                4
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                5
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-sky-500 text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20"
              >
                <span className="sr-only">{t("venues.nextPage") || "Next page"}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
