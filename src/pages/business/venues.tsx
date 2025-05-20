"use client"

import { Link } from "react-router-dom"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Plus, Search } from "lucide-react"
import { VenueNewModal } from "./venue-new"
import { useState } from "react"

export default function BusinessVenuesPage() {
  const { t } = useLanguage()
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false)

  // Mock data
  const venues = [
    {
      id: "1",
      name: "Grand Ballroom",
      location: "123 Main St, New York, NY",
      capacity: 300,
      pricePerHour: 500,
      image: "/placeholder.svg?height=100&width=200",
      status: "active",
    },
    {
      id: "2",
      name: "Garden Terrace",
      location: "456 Park Ave, New York, NY",
      capacity: 150,
      pricePerHour: 300,
      image: "/placeholder.svg?height=100&width=200",
      status: "active",
    },
<<<<<<< Updated upstream
    {
      id: "3",
      name: "Skyline Loft",
      location: "789 Broadway, New York, NY",
      capacity: 200,
      pricePerHour: 400,
      image: "/placeholder.svg?height=100&width=200",
      status: "inactive",
    },
  ]
=======
    price: {
      amount: 0,
      currency: "USD",
      type: PricingType.HOURLY
    }
  })

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    setLoading(true)
    try {
      // Get all venues
      const result = await venueService.getVenues()
      // For each venue summary, get the full venue details
      const venueDetails = await Promise.all(
        result.venues.map(async (venue) => {
          const details = await venueService.getVenueById(venue.id)
          return details
        })
      )
      setVenues(venueDetails.filter((v): v is Venue => v !== null))
    } catch (error) {
      console.error("Error fetching venues:", error)
      toast({
        title: "Error",
        description: "Failed to load venues. Please try again.",
        variant: "destructive"
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
      (venue.location?.en?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (venue.location?.sq?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      venue.description.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.sq.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && venue.active) || 
      (filterStatus === "inactive" && !venue.active)

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
        en: venue.location?.en || "",
        sq: venue.location?.sq || ""
      },
      type: venue.type,
      address: { ...venue.address },
      amenities: [...venue.amenities],
      capacity: { ...venue.capacity },
      price: { ...venue.price }
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
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error deleting venue:", error)
        toast({
          title: "Error",
          description: "Failed to delete venue. Please try again.",
          variant: "destructive"
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
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating venue:", error)
      toast({
        title: "Error",
        description: "Failed to update venue. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleToggleAmenity = (amenity: VenueAmenity) => {
    setEditForm(prev => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const amenityOptions = Object.values(VenueAmenity).map(amenity => ({
    value: amenity,
    label: t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace('_', ' ')
  }))
>>>>>>> Stashed changes

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
<<<<<<< Updated upstream
          <h1 className="text-3xl font-bold tracking-tight">{t("business.venues.title") || "My Venues"}</h1>
          <p className="text-gray-500">{t("business.venues.subtitle") || "Manage your venues and availability"}</p>
=======
          <h1 className="text-3xl font-bold tracking-tight">{t("business.venues.title")}</h1>
          <p className="text-muted-foreground">
            {t("business.venues.subtitle")}
          </p>
>>>>>>> Stashed changes
        </div>
        <Button 
          size="sm" 
          className="bg-accent hover:bg-accent/90 text-white"
          onClick={() => setIsAddVenueModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("business.venues.addVenue")}
        </Button>
      </div>

      {/* Venue New Modal */}
      <VenueNewModal 
        isOpen={isAddVenueModalOpen} 
        onClose={() => setIsAddVenueModalOpen(false)} 
      />

<<<<<<< Updated upstream
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder={t("business.venues.searchVenues") || "Search venues..."} className="pl-8" />
=======
      {/* View Venue Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedVenue?.name.en}</DialogTitle>
            <DialogDescription>{t("business.venues.viewVenueDetails")}</DialogDescription>
          </DialogHeader>

          {selectedVenue && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedVenue.media?.[0]?.url || "/placeholder.svg"}
                  alt={selectedVenue.name.en}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p>{selectedVenue.location?.en || ""}</p>
                </div>

                <div>
                  <h3 className="font-medium">{t("business.common.description")}</h3>
                  <p className="text-muted-foreground">{selectedVenue.description.en}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{t("business.venues.capacity")}</h3>
                      <p>
                        {selectedVenue.capacity.max} {t("business.venues.people")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{t("business.pricing.type")}</h3>
                      <p>
                        ${selectedVenue.price.amount}/{t(`business.pricing.${selectedVenue.price.type}`)}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedVenue.availability && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">{t("business.venues.availableHours")}</h3>
                        <p>{selectedVenue.availability.startTime} - {selectedVenue.availability.endTime}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-medium mb-2">{t("business.venues.amenities")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {t(`venues.amenities.${amenity}`)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Venue Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("business.venues.editVenue")}</DialogTitle>
            <DialogDescription>{t("business.venues.editVenueDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name-en">{t("business.venues.name")} (English)</Label>
              <Input
                id="name-en"
                value={editForm.name.en}
                onChange={(e) => setEditForm({ ...editForm, name: { ...editForm.name, en: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name-sq">{t("business.venues.name")} (Albanian)</Label>
              <Input
                id="name-sq"
                value={editForm.name.sq}
                onChange={(e) => setEditForm({ ...editForm, name: { ...editForm.name, sq: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description-en">{t("business.venues.description")} (English)</Label>
              <Textarea
                id="description-en"
                value={editForm.description.en}
                onChange={(e) => setEditForm({ ...editForm, description: { ...editForm.description, en: e.target.value } })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description-sq">{t("business.venues.description")} (Albanian)</Label>
              <Textarea
                id="description-sq"
                value={editForm.description.sq}
                onChange={(e) => setEditForm({ ...editForm, description: { ...editForm.description, sq: e.target.value } })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="venue-type">{t("business.venues.type")}</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as VenueType })}
              >
                <SelectTrigger id="venue-type">
                  <SelectValue placeholder={t("business.venues.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VenueType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`business.venueTypes.${type}`)}
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
                  onChange={(e) => setEditForm({ ...editForm, price: { ...editForm.price, amount: parseInt(e.target.value) } })}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="price-type">{t("business.pricing.type")}</Label>
                <Select
                  value={editForm.price.type}
                  onValueChange={(value) => setEditForm({ ...editForm, price: { ...editForm.price, type: value as PricingType } })}
                >
                  <SelectTrigger id="price-type">
                    <SelectValue placeholder={t("business.venues.selectPriceType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PricingType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {t(`business.pricing.${type}`) || type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="capacity-min">{t("business.venues.minCapacity")}</Label>
                <Input
                  id="capacity-min"
                  type="number"
                  value={editForm.capacity.min}
                  onChange={(e) => setEditForm({ ...editForm, capacity: { ...editForm.capacity, min: parseInt(e.target.value) } })}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="capacity-max">{t("business.venues.maxCapacity")}</Label>
                <Input
                  id="capacity-max"
                  type="number"
                  value={editForm.capacity.max}
                  onChange={(e) => setEditForm({ ...editForm, capacity: { ...editForm.capacity, max: parseInt(e.target.value) } })}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="capacity-recommended">{t("business.venues.recommendedCapacity")}</Label>
                <Input
                  id="capacity-recommended"
                  type="number"
                  value={editForm.capacity.recommended}
                  onChange={(e) => setEditForm({ ...editForm, capacity: { ...editForm.capacity, recommended: parseInt(e.target.value) } })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label>{t("business.venues.amenities")}</Label>
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
                <SelectItem value="all">{t("common.all")}</SelectItem>
                <SelectItem value="active">{t("business.common.status.active")}</SelectItem>
                <SelectItem value="inactive">{t("business.common.status.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
>>>>>>> Stashed changes
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <option value="all">{t("business.venues.allVenues") || "All Venues"}</option>
          <option value="active">{t("business.venues.activeVenues") || "Active Venues"}</option>
          <option value="inactive">{t("business.venues.inactiveVenues") || "Inactive Venues"}</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
          >
            <div className="aspect-video w-full overflow-hidden">
              <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-bold">{venue.name}</h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    venue.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {venue.status === "active"
                    ? t("business.venues.active") || "Active"
                    : t("business.venues.inactive") || "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500">{venue.location}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span>
                  {t("business.venues.capacity") || "Capacity"}: {venue.capacity}
                </span>
                <span className="font-medium">
                  ${venue.pricePerHour}/{t("business.venues.hour") || "hr"}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link to={`/business/venues/${venue.id}`}>{t("business.venues.edit") || "Edit"}</Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  {t("business.venues.availability") || "Availability"}
                </Button>
              </div>
            </div>
          </div>
<<<<<<< Updated upstream
        ))}
=======
        ) : filteredVenues.length === 0 ? (
          <div className="text-center my-10">
            <p>{t("business.venues.noVenues")}</p>
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
                      venue.active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400"
                    }`}
                  >
                    {venue.active ? t("business.common.status.active") : t("business.common.status.inactive")}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold tracking-tight">{venue.name.en}</h3>
                  <p className="text-muted-foreground line-clamp-2 mt-1">{venue.description.en}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">{t(`business.venueTypes.${venue.type}`)}</Badge>
                    <Badge variant="outline">
                      ${venue.price.amount}/{t(`business.pricing.${venue.price.type}`)}
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
>>>>>>> Stashed changes
      </div>
    </BusinessLayout>
  )
}
