"use client"

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "../../components/dashboard/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { useLanguage } from "../../context/language-context"
import { useFavorites } from "../../context/favorites-context"
import { Link } from "react-router-dom"
import { Heart, MapPin, Star, Users, Trash, Music, Camera, Utensils, PartyPopper } from "lucide-react"
import * as venueService from "../../services/venueService"
import * as serviceService from "../../services/serviceService"
import * as userService from "../../services/userService"
import { VenueSummary } from "../../models/venue"
import { ServiceSummary } from "../../models/service"
import { PricingType } from "../../models/common"
import { User as UserModel } from "../../models/user"

export default function FavoritesPage() {
  const { t, language } = useLanguage()
  const { favorites, toggleFavorite, clearFavorites } = useFavorites()
  const [venues, setVenues] = useState<VenueSummary[]>([])
  const [services, setServices] = useState<ServiceSummary[]>([])
  const [activeTab, setActiveTab] = useState("venues")
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<UserModel | null>(null)

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      const user = await userService.getUserById("user3")
      setCurrentUser(user)
    }
    
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true)
      try {
        // Fetch all favorited venues
        const favoriteVenues: VenueSummary[] = []
        // Fetch all favorited services
        const favoriteServices: ServiceSummary[] = []

        // Process venues
        for (const id of favorites) {
          try {
            const venueData = await venueService.getVenueById(id)
            if (venueData) {
              // Convert Venue to VenueSummary format if needed
              const venueSummary: VenueSummary = {
                id: venueData.id,
                name: venueData.name,
                location: venueData.location || { en: "", sq: "" },
                type: venueData.type,
                price: venueData.price || { amount: 0, type: PricingType.FIXED, currency: "USD" },
                amenities: venueData.amenities || [],
                mainImage: venueData.media?.[0]?.url || "/placeholder.svg",
                rating: venueData.rating || { average: 0, count: 0 },
              }
              favoriteVenues.push(venueSummary)
              continue
            }
            
            const serviceData = await serviceService.getServiceById(id)
            if (serviceData) {
              // Convert Service to ServiceSummary format if needed
              const serviceSummary: ServiceSummary = {
                id: serviceData.id,
                name: serviceData.name,
                type: serviceData.type,
                mainImage: serviceData.media?.[0]?.url || "/placeholder.svg",
                rating: serviceData.rating || { average: 0, count: 0 },
                basePrice: serviceData.options?.[0]?.price || { amount: 0, type: PricingType.FIXED, currency: "USD" },
                optionsCount: serviceData.options?.length || 0
              }
              favoriteServices.push(serviceSummary)
            }
          } catch (error) {
            console.error(`Error fetching item with ID ${id}:`, error)
          }
        }

        setVenues(favoriteVenues)
        setServices(favoriteServices)
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [favorites])

  // Get price display based on price type and language
  const getVenuePriceDisplay = (venue: VenueSummary) => {
    const formatPrice = (price: number) => `$${price}`
    
    switch (venue.price.type) {
      case PricingType.HOURLY:
        return `${formatPrice(venue.price.amount)}/${t("business.serviceNew.hourly")}`
      case PricingType.PER_PERSON:
        return `${formatPrice(venue.price.amount)}/${t("business.serviceNew.perPerson")}`
      case PricingType.FIXED:
        return formatPrice(venue.price.amount)
      case PricingType.CUSTOM:
        return t("business.serviceNew.flatFee")
      default:
        return formatPrice(venue.price.amount)
    }
  }

  // Get price display for services
  const getServicePriceDisplay = (service: ServiceSummary) => {
    const formatPrice = (price: number) => `$${price}`
    
    switch (service.basePrice.type) {
      case PricingType.HOURLY:
        return `${formatPrice(service.basePrice.amount)}/${t("business.serviceNew.hourly")}`
      case PricingType.PER_PERSON:
        return `${formatPrice(service.basePrice.amount)}/${t("business.serviceNew.perPerson")}`
      case PricingType.FIXED:
        return formatPrice(service.basePrice.amount)
      case PricingType.CUSTOM:
        return t("business.serviceNew.flatFee")
      default:
        return formatPrice(service.basePrice.amount)
    }
  }

  // Get service icon based on type
  const getServiceIcon = (type: string) => {
    switch (type) {
      case "catering":
        return <Utensils className="h-5 w-5" />
      case "music":
        return <Music className="h-5 w-5" />
      case "photography":
        return <Camera className="h-5 w-5" />
      case "entertainment":
        return <PartyPopper className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  return (
    <DashboardLayout currentUser={currentUser}>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.favorites") || "My Favorites"}</h1>
            <p className="text-muted-foreground">
              {t("favorites.description") || "Manage your favorites venues and services"}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearFavorites} className="text-destructive hover:bg-destructive/10">
              <Trash className="mr-2 h-4 w-4" />
              {t("favorites.clearAll") || "Clear All"}
            </Button>
          )}
        </div>

        <Tabs defaultValue="venues" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="venues">
              {t("favorites.venues") || "Venues"} ({venues.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              {t("favorites.services") || "Services"} ({services.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues" className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <p>{t("common.loading") || "Loading..."}</p>
              </div>
            ) : venues.length === 0 ? (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Heart className="h-16 w-16 text-muted stroke-[1.5px] mb-4" />
                  <h3 className="text-xl font-medium">
                    {t("favorites.noVenues") || "You haven't saved any venues yet"}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    {t("favorites.noVenuesDescription") || "Browse venues and click the heart icon to save them to your favorites"}
                  </p>
                  <Button asChild className="mt-6">
                    <Link to="/venues">{t("favorites.browseVenues") || "Browse Venues"}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {venues.map((venue) => (
                  <Card key={venue.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={venue.mainImage || "/placeholder.svg"}
                        alt={venue.name[language]}
                        className="h-[200px] w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                        onClick={() => toggleFavorite(venue.id, venue.name[language])}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="sr-only">{t("venues.removeFromFavorites") || "Remove from favorites"}</span>
                      </Button>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg font-semibold">
                        <Link to={`/venues/${venue.id}`} className="hover:text-primary transition-colors">
                          {venue.name[language]}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {venue.location[language]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">
                            {venue.rating?.average || 0} ({venue.rating?.count || 0} {t("business.bookings.reviews")})
                          </span>
                        </div>
                        <span className="font-medium text-primary">{getVenuePriceDisplay(venue)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button asChild className="w-full">
                        <Link to={`/venues/${venue.id}`}>{t("favorites.viewDetails") || "View Details"}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <p>{t("common.loading") || "Loading..."}</p>
              </div>
            ) : services.length === 0 ? (
              <Card className="bg-muted/40">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Heart className="h-16 w-16 text-muted stroke-[1.5px] mb-4" />
                  <h3 className="text-xl font-medium">
                    {t("favorites.noServices") || "You haven't saved any services yet"}
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    {t("favorites.noServicesDescription") || "Browse services and click the heart icon to save them to your favorites"}
                  </p>
                  <Button asChild className="mt-6">
                    <Link to="/services">{t("favorites.browseServices") || "Browse Services"}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={service.mainImage || "/placeholder.svg"}
                        alt={service.name[language]}
                        className="h-[200px] w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 text-red-500 hover:bg-white hover:text-red-600"
                        onClick={() => toggleFavorite(service.id, service.name[language])}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="sr-only">{t("venues.removeFromFavorites") || "Remove from favorites"}</span>
                      </Button>
                      <Badge className="absolute top-2 left-2">
                        {t(`services.types.${service.type.toLowerCase()}`) || service.type}
                      </Badge>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="mb-2 flex items-center text-xs text-muted-foreground">
                        {getServiceIcon(service.type.toLowerCase())}
                        <span className="ml-1">{t(`services.types.${service.type.toLowerCase()}`) || service.type}</span>
                      </div>
                      <CardTitle className="text-lg font-semibold">
                        <Link to={`/services/${service.id}`} className="hover:text-primary transition-colors">
                          {service.name[language]}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">
                            {service.rating?.average || 0} ({service.rating?.count || 0} {t("business.bookings.reviews")})
                          </span>
                        </div>
                        <span className="font-medium text-primary">{getServicePriceDisplay(service)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <Button asChild className="w-full">
                        <Link to={`/services/${service.id}`}>{t("favorites.viewDetails") || "View Details"}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 