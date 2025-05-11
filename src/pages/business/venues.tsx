"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Edit, Plus, Search, MapPin, Users, Clock, DollarSign, Eye } from "lucide-react"
import { VenueNewModal } from "./venue-new"
import { useState } from "react"
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

export default function BusinessVenuesPage() {
  const { t } = useLanguage()
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const venues = [
    {
      id: "1",
      name: "Grand Ballroom",
      description: "An elegant ballroom with crystal chandeliers and marble floors, perfect for weddings and galas.",
      location: "123 Main St, New York, NY",
      capacity: 300,
      pricePerHour: 500,
      image: "/placeholder.svg?height=200&width=300&text=Grand+Ballroom",
      status: "active",
      amenities: ["WiFi", "Catering Kitchen", "Sound System", "Stage", "Parking"],
      availableHours: "9:00 AM - 12:00 AM",
      minimumHours: 4,
    },
    {
      id: "2",
      name: "Garden Terrace",
      description: "A beautiful outdoor terrace with lush gardens and a fountain, ideal for daytime events.",
      location: "456 Park Ave, New York, NY",
      capacity: 150,
      pricePerHour: 300,
      image: "/placeholder.svg?height=200&width=300&text=Garden+Terrace",
      status: "active",
      amenities: ["WiFi", "Outdoor Lighting", "Covered Area", "Parking"],
      availableHours: "10:00 AM - 10:00 PM",
      minimumHours: 3,
    },
    {
      id: "3",
      name: "Skyline Loft",
      description: "A modern loft space with floor-to-ceiling windows offering panoramic city views.",
      location: "789 Broadway, New York, NY",
      capacity: 200,
      pricePerHour: 400,
      image: "/placeholder.svg?height=200&width=300&text=Skyline+Loft",
      status: "inactive",
      amenities: ["WiFi", "Bar Area", "Sound System", "Elevator Access", "Rooftop Access"],
      availableHours: "11:00 AM - 2:00 AM",
      minimumHours: 5,
    },
  ]

  // Filter venues based on search query and status
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || venue.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleViewVenue = (venue: any) => {
    setSelectedVenue(venue)
    setIsViewModalOpen(true)
  }

  const handleEditVenue = (venue: any) => {
    setSelectedVenue(venue)
    setIsEditModalOpen(true)
  }

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
      <VenueNewModal isOpen={isAddVenueModalOpen} onClose={() => setIsAddVenueModalOpen(false)} />

      {/* View Venue Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedVenue?.name}</DialogTitle>
            <DialogDescription>{t("business.venues.viewVenueDetails")}</DialogDescription>
          </DialogHeader>

          {selectedVenue && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedVenue.image || "/placeholder.svg"}
                  alt={selectedVenue.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p>{selectedVenue.location}</p>
                </div>

                <div>
                  <h3 className="font-medium">{t("business.common.description")}</h3>
                  <p className="text-muted-foreground">{selectedVenue.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{t("business.venues.capacity")}</h3>
                      <p>
                        {selectedVenue.capacity} {t("business.venues.people")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{t("business.venues.price")}</h3>
                      <p>
                        ${selectedVenue.pricePerHour}/{t("business.venues.hour")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{t("business.venues.availableHours")}</h3>
                      <p>{selectedVenue.availableHours}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{t("business.venues.minimumHours")}</h3>
                      <p>
                        {selectedVenue.minimumHours} {t("business.venues.hours")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("business.venues.amenities")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((amenity: string) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">{t("business.common.status")}</h3>
                  <Badge
                    className={
                      selectedVenue.status === "active"
                        ? "bg-emerald-500/90 dark:bg-emerald-600/90 hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70"
                        : "bg-muted-foreground hover:bg-muted-foreground/80"
                    }
                  >
                    {t(`business.common.status.${selectedVenue.status}`)}
                  </Badge>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  {t("business.common.close")}
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditVenue(selectedVenue)
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {t("business.common.edit")}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Venue Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t("business.venues.editVenue")}</DialogTitle>
            <DialogDescription>{t("business.venues.editVenueDescription")}</DialogDescription>
          </DialogHeader>

          {selectedVenue && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg relative group">
                <img
                  src={selectedVenue.image || "/placeholder.svg"}
                  alt={selectedVenue.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="secondary" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    {t("business.common.changeImage")}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("business.common.name")}</Label>
                    <Input id="name" defaultValue={selectedVenue.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t("business.common.description")}</Label>
                    <Textarea id="description" defaultValue={selectedVenue.description} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t("business.common.location")}</Label>
                    <Input id="location" defaultValue={selectedVenue.location} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">{t("business.venues.capacity")}</Label>
                    <Input id="capacity" type="number" defaultValue={selectedVenue.capacity} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">{t("business.venues.pricePerHour")}</Label>
                    <Input id="pricePerHour" type="number" defaultValue={selectedVenue.pricePerHour} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableHours">{t("business.venues.availableHours")}</Label>
                    <Input id="availableHours" defaultValue={selectedVenue.availableHours} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumHours">{t("business.venues.minimumHours")}</Label>
                    <Input id="minimumHours" type="number" defaultValue={selectedVenue.minimumHours} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">{t("business.common.status")}</Label>
                  <Select defaultValue={selectedVenue.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder={t("business.common.selectStatus")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("business.common.status.active")}</SelectItem>
                      <SelectItem value="inactive">{t("business.common.status.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("business.venues.amenities")}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "WiFi",
                      "Catering Kitchen",
                      "Sound System",
                      "Stage",
                      "Parking",
                      "Outdoor Lighting",
                      "Covered Area",
                      "Bar Area",
                      "Elevator Access",
                      "Rooftop Access",
                    ].map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          defaultChecked={selectedVenue.amenities.includes(amenity)}
                          className="transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary hover:border-primary"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  {t("business.common.cancel")}
                </Button>
                <Button onClick={() => setIsEditModalOpen(false)}>{t("business.common.saveChanges")}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("business.venues.searchVenues") || "Search venues..."}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("business.venues.allVenues") || "All Venues"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("business.venues.allVenues") || "All Venues"}</SelectItem>
            <SelectItem value="active">{t("business.venues.activeVenues") || "Active Venues"}</SelectItem>
            <SelectItem value="inactive">{t("business.venues.inactiveVenues") || "Inactive Venues"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredVenues.length > 0 ? (
          filteredVenues.map((venue) => (
            <Card
              key={venue.id}
              className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft transition-all duration-300 hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-bold">{venue.name}</h3>
                  <Badge
                    className={`${
                      venue.status === "active"
                        ? "bg-emerald-500/90 dark:bg-emerald-600/90 hover:bg-emerald-500/70 dark:hover:bg-emerald-600/70"
                        : "bg-muted-foreground hover:bg-muted-foreground/80"
                    }`}
                  >
                    {venue.status === "active"
                      ? t("business.venues.active") || "Active"
                      : t("business.venues.inactive") || "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{venue.description}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {venue.location}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {venue.capacity}
                  </span>
                  <span className="font-medium">
                    ${venue.pricePerHour}/{t("business.venues.hour") || "hr"}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                    onClick={() => handleEditVenue(venue)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t("business.venues.edit") || "Edit"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                    onClick={() => handleViewVenue(venue)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t("business.venues.view") || "View"}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium">{t("business.common.noItems")}</h3>
            <p className="text-muted-foreground mt-1">{t("business.common.noItemsDescription")}</p>
          </div>
        )}
      </div>
    </BusinessLayout>
  )
}
