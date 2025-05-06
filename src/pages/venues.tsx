"use client"

import type React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { Link } from "react-router-dom"
import { useLanguage } from "../context/language-context"
import { Label } from "../components/ui/label"
import { RadioGroupItem } from "../components/ui/radio-group"

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
          bgColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        }
      case "perPerson":
        return {
          text: t("business.pricing.perPerson"),
          bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        }
      case "fixed":
        return {
          text: t("business.pricing.fixed"),
          bgColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        }
      case "custom":
        return {
          text: t("business.pricing.custom"),
          bgColor: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        }
      default:
        return {
          text: "",
          bgColor: "",
        }
    }
  }

  return (
    <div className="container px-4 md:px-8 py-8">
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <div className="bg-background rounded-lg border shadow-soft p-6">
            <h2 className="font-semibold text-lg mb-5">{t("venues.searchBar.title") || "Search"}</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="location">
                  {t("venues.searchBar.location") || "Location"}
                </label>
                <div className="flex items-center gap-2 border rounded-md p-3 bg-secondary">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
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
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="date">
                  {t("venues.searchBar.date") || "Date"}
                </label>
                <div className="flex items-center gap-2 border rounded-md p-3 bg-secondary">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
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
                <label className="text-sm font-medium" htmlFor="guests">
                  {t("venues.searchBar.guests") || "Guests"}
                </label>
                <div className="flex items-center gap-2 border rounded-md p-3 bg-secondary">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="guests"
                    name="guests"
                    value={searchParams.guests}
                    onChange={handleSearchChange}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    type="number"
                    placeholder={t("venues.searchBar.guestsPlaceholder") || "Number of guests"}
                  />
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-white" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" /> {t("venues.searchBar.button") || "Search"}
              </Button>
            </div>
          </div>
          <div className="bg-background rounded-lg border shadow-soft p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">{t("venues.filters.title") || "Filters"}</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-primary hover:text-primary/80"
                onClick={clearAllFilters}
              >
                {t("venues.filters.clearAll") || "Clear All"}
              </Button>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t("venues.filters.priceRange") || "Price Range"}</h3>
                <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="py-2" />
                <div className="flex items-center justify-between">
                  <div className="font-medium">$0</div>
                  <div className="font-medium">${priceRange[0]}</div>
                  <div className="font-medium">$500</div>
                </div>
              </div>

              {/* Price Type Filter */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t("venues.filters.priceType") || "Price Type"}</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-hourly"
                      checked={priceTypes.hourly}
                      onCheckedChange={(checked) => handlePriceTypeChange("hourly", checked === true)}
                    />
                    <label htmlFor="price-type-hourly" className="flex items-center text-sm font-medium leading-none">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("business.pricing.hourly")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-perPerson"
                      checked={priceTypes.perPerson}
                      onCheckedChange={(checked) => handlePriceTypeChange("perPerson", checked === true)}
                    />
                    <label
                      htmlFor="price-type-perPerson"
                      className="flex items-center text-sm font-medium leading-none"
                    >
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("business.pricing.perPerson")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-fixed"
                      checked={priceTypes.fixed}
                      onCheckedChange={(checked) => handlePriceTypeChange("fixed", checked === true)}
                    />
                    <label htmlFor="price-type-fixed" className="flex items-center text-sm font-medium leading-none">
                      <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("business.pricing.fixed")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="price-type-custom"
                      checked={priceTypes.custom}
                      onCheckedChange={(checked) => handlePriceTypeChange("custom", checked === true)}
                    />
                    <label htmlFor="price-type-custom" className="flex items-center text-sm font-medium leading-none">
                      <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                      {t("business.pricing.custom")}
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t("venues.venueType") || "Venue Type"}</h3>
                <div className="space-y-3">
                  {Object.keys(venueTypes).map((type) => {
                    // Map venue types to keys for business.venueTypes translations
                    const typeKey = type === "Meeting Room" ? "other" :
                                  type === "Party Venue" ? "ballroom" :
                                  type === "Photography Studio" ? "loft" :
                                  type === "Wedding Venue" ? "ballroom" :
                                  type === "Outdoor Space" ? "garden" :
                                  "other";
                                  
                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={venueTypes[type]}
                          onCheckedChange={(checked) => handleVenueTypeChange(type, checked === true)}
                        />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t(`business.venueTypes.${typeKey}`)}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t("venues.amenities") || "Amenities"}</h3>
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
                      />
                      <label
                        htmlFor={`amenity-${amenity.key}`}
                        className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        <amenity.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <Filter className="mr-2 h-4 w-4" /> {t("venues.filters.applyFilters") || "Apply Filters"}
              </Button>
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("venues.title") || "Venues in New York"}</h1>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px]">
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <Link to={`/venues/${venue.id}`} key={venue.id} className="group">
                <div className="space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft">
                  <div className="relative overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=300&width=400&text=Venue ${venue.id}`}
                      alt={venue.name[language]}
                      className="h-[200px] w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className={getPriceTypeBadge(venue.priceType).bgColor}>
                      {getPriceTypeBadge(venue.priceType).text}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-accent hover:bg-white hover:text-accent/80"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">{t("venues.addToFavorites") || "Add to favorites"}</span>
                    </Button>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="font-semibold text-lg">{venue.name[language]}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      <span>{venue.location[language]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="ml-1 text-sm font-medium">{venue.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({venue.reviews} {t("venues.reviews") || "reviews"})
                      </span>
                    </div>
                    <p className="font-medium text-primary">{getPriceDisplay(venue)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filteredVenues.length === 0 && (
            <div className="text-center py-12 bg-secondary/30 rounded-lg">
              <h3 className="text-lg font-medium">{t("venues.noResults") || "No venues found"}</h3>
              <p className="text-muted-foreground mt-2">
                {t("venues.tryAdjusting") || "Try adjusting your filters or search criteria"}
              </p>
              <Button
                variant="outline"
                className="mt-4 border-primary text-primary hover:bg-primary/10"
                onClick={clearAllFilters}
              >
                {t("venues.clearFilters") || "Clear all filters"}
              </Button>
            </div>
          )}
          {filteredVenues.length > 0 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                disabled
                className="border-primary text-primary hover:bg-primary/10"
              >
                <span className="sr-only">{t("venues.previousPage") || "Previous page"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-primary bg-primary text-white" disabled>
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                3
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                4
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 border-primary text-primary hover:bg-primary/10">
                5
              </Button>
              <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary/10">
                <span className="sr-only">{t("venues.nextPage") || "Next page"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
