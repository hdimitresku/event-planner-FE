"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Edit, Plus, Search, MapPin, Users, DollarSign, Eye, Trash, Star } from "lucide-react"
import { VenueNewModal } from "./venue-new"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import * as venueService from "../../services/venueService"
import { type Venue, VenueType, VenueAmenity } from "../../models/venue"
import { PricingType } from "../../models/common"
import { toast } from "../../components/ui/use-toast"

export default function BusinessVenuesPage() {
  const { t } = useLanguage()
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    name: { en: "", sq: "" },
    description: { en: "", sq: "" },
    location: { en: "", sq: "" },
    type: VenueType.OTHER,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    amenities: [] as VenueAmenity[],
    capacity: {
      min: 0,
      max: 0,
      recommended: 0,
    },
    price: {
      amount: 0,
      currency: "USD",
      type: PricingType.HOURLY,
    },
  })

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    setLoading(true)
    try {
      // Get all venues
      // For each venue summary, get the full venue details
      const venueDetails = await venueService.getVenueByOwner()
      
      setVenues(venueDetails.filter((v): v is Venue => v !== null))
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast({
        title: "Error",
        description: "Failed to load venues. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter venues based on search query and status
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.name.sq.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.sq.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && venue.isActive) ||
      (filterStatus === "inactive" && !venue.isActive)

    return matchesSearch && matchesStatus
  })

  const handleViewVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setIsViewModalOpen(true)
  }

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    // Initialize form with venue data
    setEditForm({
      name: { ...venue.name },
      description: { ...venue.description },
      location: {
        en: `${venue.address.city}, ${venue.address.state}`,
        sq: `${venue.address.city}, ${venue.address.state}`,
      },
      type: venue.type,
      address: { ...venue.address },
      amenities: [...venue.amenities],
      capacity: { ...venue.capacity },
      price: { ...venue.price },
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteVenue = async (venueId: string) => {
    if (window.confirm(t("business.venues.confirmDelete") || "Are you sure you want to delete this venue?")) {
      try {
        const result = await venueService.deleteVenue(venueId)
        if (result.success) {
          toast({
            title: "Success",
            description: "Venue deleted successfully",
          })
          fetchVenues() // Refresh the venues list
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete venue",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting venue:", error)
        toast({
          title: "Error",
          description: "Failed to delete venue. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedVenue) return

    try {
      const result = await venueService.updateVenue(selectedVenue.id, editForm)
      if (result.success) {
        toast({
          title: "Success",
          description: "Venue updated successfully",
        })
        setIsEditModalOpen(false)
        fetchVenues() // Refresh the venues list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update venue",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating venue:", error)
      toast({
        title: "Error",
        description: "Failed to update venue. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleAmenity = (amenity: VenueAmenity) => {
    setEditForm((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const amenityOptions = Object.values(VenueAmenity).map((amenity) => ({
    value: amenity,
    label: t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace("_", " "),
  }))

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("business.venues.title") || "My Venues"}</h1>
          <p className="text-muted-foreground">
            {t("business.venues.subtitle") || "Manage your venues and availability"}
          </p>
        </div>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => setIsAddVenueModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("business.venues.addVenue") || "Add Venue"}
        </Button>
      </div>

      {/* Venue New Modal */}
      <VenueNewModal
        isOpen={isAddVenueModalOpen}
        onClose={() => setIsAddVenueModalOpen(false)}
        onSuccess={() => {
          setIsAddVenueModalOpen(false)
          fetchVenues()
        }}
      />

      {/* View Venue Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedVenue?.name.en}</DialogTitle>
          </DialogHeader>

          {selectedVenue && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p>
                  {selectedVenue.address.street}, {selectedVenue.address.city}, {selectedVenue.address.state}{" "}
                  {selectedVenue.address.zipCode}, {selectedVenue.address.country}
                </p>
              </div>

              <div>
                <h3 className="font-medium">{t("business.common.description")}</h3>
                <p className="text-muted-foreground">{selectedVenue.description.en}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{t("venueBook.guestCapacity")}</h3>
                    <p>
                      {selectedVenue.capacity.min} - {selectedVenue.capacity.max} {t("venueBook.guests")}
                      (Recommended: {selectedVenue.capacity.recommended})
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{t("business.common.price")}</h3>
                    <p>
                      {selectedVenue.price.currency} {selectedVenue.price.amount} ({t(`venues.filters.priceType.${selectedVenue.price.type}`)})
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("venueDetail.operatingHours")}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(selectedVenue.dayAvailability || {}).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}:</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("venueDetail.amenities")}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary">
                      {t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedVenue.metadata?.blockedDates && selectedVenue.metadata.blockedDates.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">{t("business.venues.blockedDates")}</h3>
                  <div className="space-y-1">
                    {selectedVenue.metadata.blockedDates.map((blocked, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        {new Date(blocked.startDate).toLocaleDateString()} -{" "}
                        {new Date(blocked.endDate).toLocaleDateString()}
                        {blocked.isConfirmed && (
                          <Badge variant="destructive" className="ml-2">
                            Confirmed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedVenue.reviews && selectedVenue.reviews.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">{t("business.venues.reviews")}</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedVenue.reviews.map((review) => (
                      <div key={review.id} className="border rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          {review.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Venue Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("business.venues.editVenue")}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name-en">{t("business.common.name")} (English)</Label>
              <Input
                id="name-en"
                value={editForm.name.en}
                onChange={(e) => setEditForm({ ...editForm, name: { ...editForm.name, en: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name-sq">{t("business.common.name")} (Albanian)</Label>
              <Input
                id="name-sq"
                value={editForm.name.sq}
                onChange={(e) => setEditForm({ ...editForm, name: { ...editForm.name, sq: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description-en">{t("business.common.description")} (English)</Label>
              <Textarea
                id="description-en"
                value={editForm.description.en}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: { ...editForm.description, en: e.target.value } })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description-sq">{t("business.common.description")} (Albanian)</Label>
              <Textarea
                id="description-sq"
                value={editForm.description.sq}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: { ...editForm.description, sq: e.target.value } })
                }
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="venue-type">{t("business.common.type")}</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as VenueType })}
              >
                <SelectTrigger id="venue-type">
                  <SelectValue placeholder={t("business.common.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VenueType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`business.venueTypes.${type}`) || type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="price">{t("business.common.price")}</Label>
                <Input
                  id="price"
                  type="number"
                  value={editForm.price.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: { ...editForm.price, amount: Number.parseInt(e.target.value) } })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="price-type">{t("venues.filters.priceType")}</Label>
                <Select
                  value={editForm.price.type}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, price: { ...editForm.price, type: value as PricingType } })
                  }
                >
                  <SelectTrigger id="price-type">
                    <SelectValue placeholder={t("business.venues.selectPriceType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PricingType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`venues.filters.priceType.${type}`) || type.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="capacity-min">{t("business.venueNew.minCapacity")}</Label>
                <Input
                  id="capacity-min"
                  type="number"
                  value={editForm.capacity.min}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      capacity: { ...editForm.capacity, min: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="capacity-max">{t("business.venueNew.maxCapacity")}</Label>
                <Input
                  id="capacity-max"
                  type="number"
                  value={editForm.capacity.max}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      capacity: { ...editForm.capacity, max: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="capacity-recommended">{t("business.venueNew.recommendedCapacity")}</Label>
                <Input
                  id="capacity-recommended"
                  type="number"
                  value={editForm.capacity.recommended}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      capacity: { ...editForm.capacity, recommended: Number.parseInt(e.target.value) },
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label>{t("venueDetail.amenities")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map((amenity) => (
                  <div key={amenity.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`amenity-${amenity.value}`}
                      checked={editForm.amenities.includes(amenity.value)}
                      onCheckedChange={() => handleToggleAmenity(amenity.value)}
                    />
                    <label
                      htmlFor={`amenity-${amenity.value}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {amenity.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSaveEdit}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("business.common.search") || "Search..."}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder={t("business.common.status") || "Status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("business.common.all") || "All"}</SelectItem>
                <SelectItem value="active">{t("business.venues.active") || "Active"}</SelectItem>
                <SelectItem value="inactive">{t("business.venues.inactive") || "Inactive"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="text-center my-10">
            <p>{t("common.loading") || "Loading..."}</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center my-10">
            <p>{t("business.venues.noVenues") || "No venues found"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={venue.media?.[0]?.url || "/placeholder.svg?height=200&width=300&text=Venue"}
                    alt={venue.name.en}
                    className="h-full w-full object-cover"
                  />
                  <Badge
                    className={`absolute right-2 top-2 ${
                      venue.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400"
                    }`}
                  >
                    {venue.isActive
                      ? t("business.venues.active") || "Active"
                      : t("business.venues.inactive") || "Inactive"}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold tracking-tight">{venue.name.en}</h3>
                  <p className="text-muted-foreground line-clamp-2 mt-1">{venue.description.en}</p>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>
                      {venue.address.street}, {venue.address.city}, {venue.address.state}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {t(`business.venueTypes.${venue.type}`) || venue.type.replace("_", " ")}
                    </Badge>
                    <Badge variant="outline">
                      {venue.price.currency} {venue.price.amount} ({t(`venues.filters.priceType.${venue.price.type}`)})
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{venue.capacity.max}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleViewVenue(venue)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">{t("business.common.view")}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEditVenue(venue)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t("business.common.edit")}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteVenue(venue.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">{t("business.common.delete")}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BusinessLayout>
  )
}