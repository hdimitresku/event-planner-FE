"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
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
import { Calendar } from "../../components/ui/calendar"
import {
  Search,
  Plus,
  Filter,
  Edit,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Trash,
  Loader2,
  AlertCircle,
  CheckCircle,
  Star,
  Building,
  Home,
  TreePine,
  Utensils,
  Music,
  Camera,
  Palette,
} from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { VenueNewModal } from "./venue-new"
import { format, isAfter, isBefore, isSameDay, addDays } from "date-fns"
import * as venueService from "../../services/venueService"
import { type Venue, VenueType, VenueAmenity } from "../../models/venue"
import { PricingType, type Address } from "../../models/common"
import { toast } from "../../components/ui/use-toast"
import { LoadingSpinner } from "../../components/ui/loading-spinner"
import { AddressAutocomplete } from "../../components/address-autocomplete"
import { json } from "stream/consumers"

interface EditForm {
  name: {
    en: string;
    sq: string;
  };
  description: {
    en: string;
    sq: string;
  };
  type: VenueType;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    location?: {
      latitude: number;
      longitude: number;
    };
  };
  amenities: VenueAmenity[];
  capacity: {
    min: number;
    max: number;
    recommended: number;
  };
  price: {
    amount: number;
    currency: string;
    type: PricingType;
  };
}

export default function BusinessVenuesPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVenueTypes, setSelectedVenueTypes] = useState<string[]>([])
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedCapacityRanges, setSelectedCapacityRanges] = useState<string[]>([])
  const [isAddVenueModalOpen, setIsAddVenueModalOpen] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [viewActiveTab, setViewActiveTab] = useState("details")
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [blockedDates, setBlockedDates] = useState<{ startDate: string; endDate: string; isConfirmed: boolean }[]>([])
  const [blockingMode, setBlockingMode] = useState<"block" | "unblock">("block")
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false)

  const [editForm, setEditForm] = useState<EditForm>({
    name: { en: "", sq: "" },
    description: { en: "", sq: "" },
    type: VenueType.OTHER,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      location: undefined
    },
    amenities: [],
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

  const [originalEditForm, setOriginalEditForm] = useState<EditForm>({
    name: { en: "", sq: "" },
    description: { en: "", sq: "" },
    type: VenueType.OTHER,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      location: undefined
    },
    amenities: [],
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
    setError(null)
    try {
      const venueDetails = await venueService.getVenueByOwner()
      setVenues(venueDetails.filter((v): v is Venue => v !== null))

      if (venueDetails.length === 0) {
        toast({
          title: t("business.venues.noVenuesFound") || "No Venues Found",
          description:
              t("business.venues.noVenuesDescription") ||
              "You haven't created any venues yet. Create your first venue to get started.",
        })
      }
    } catch (error: any) {
      console.error("Error fetching venues:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to load venues. Please try again."
      setError(errorMessage)
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Format image URL to handle relative paths
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"

    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) return url

    // If it's a relative path, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

  // Filter venues based on search query, types, price types, statuses, and capacity
  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
        venue.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.country.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesVenueType = selectedVenueTypes.length === 0 || selectedVenueTypes.includes(venue.type.toLowerCase())

    const matchesPriceType =
        selectedPriceTypes.length === 0 || selectedPriceTypes.includes(venue.price.type.toLowerCase())

    const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(venue.isActive ? "active" : "inactive")

    const matchesCapacity =
        selectedCapacityRanges.length === 0 ||
        selectedCapacityRanges.some((range) => {
          const maxCapacity = venue.capacity.max
          switch (range) {
            case "small":
              return maxCapacity <= 50
            case "medium":
              return maxCapacity > 50 && maxCapacity <= 200
            case "large":
              return maxCapacity > 200 && maxCapacity <= 500
            case "xlarge":
              return maxCapacity > 500
            default:
              return true
          }
        })

    const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && venue.isActive) ||
        (activeTab === "inactive" && !venue.isActive) ||
        (activeTab === "featured" && venue.featured) ||
        (activeTab === "popular" && venue.reviews && venue.reviews.length > 5)

    return matchesSearch && matchesVenueType && matchesPriceType && matchesStatus && matchesCapacity && matchesTab
  })

  const venueTypeIcons: Record<string, React.ElementType> = {
    RESTAURANT: Utensils,
    HOTEL: Building,
    CONFERENCE_HALL: Building,
    WEDDING_HALL: Home,
    OUTDOOR_SPACE: TreePine,
    ENTERTAINMENT: Music,
    STUDIO: Camera,
    GALLERY: Palette,
    OTHER: Building,
  }

  const getVenueTypeIcon = (type: string) => {
    const SelectedIcon = venueTypeIcons[type] || Building
    return <SelectedIcon className="h-6 w-6 text-primary" />
  }

  // Get price display based on price type
  const getPriceDisplay = (venue: Venue) => {
    const price = venue.price.amount
    const currency = venue.price.currency
    const type = venue.price.type.toLowerCase()

    switch (type) {
      case "hourly":
        return `${currency} ${price}/${t("business.pricing.hourly") || "hr"}`
      case "daily":
        return `${currency} ${price}/${t("business.pricing.daily") || "day"}`
      case "fixed":
        return `${currency} ${price} ${t("business.pricing.fixed") || "fixed"}`
      default:
        return `${currency} ${price}`
    }
  }

  const handleViewVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    setBlockedDates(venue.metadata?.blockedDates || [])
    setSelectedDates([])
    setViewActiveTab("details")
    setIsViewModalOpen(true)
  }

  const handleEditVenue = (venue: Venue) => {
    setSelectedVenue(venue)
    const newEditForm: EditForm = {
      name: { ...venue.name },
      description: { ...venue.description },
      type: venue.type,
      address: {
        street: venue.address.street,
        city: venue.address.city,
        state: venue.address.state,
        zipCode: venue.address.zipCode,
        country: venue.address.country,
        location: venue.address.location ? {
          latitude: venue.address.location.lat,
          longitude: venue.address.location.lng
        } : undefined
      },
      amenities: [...venue.amenities],
      capacity: {
        min: venue.capacity.minimum,
        max: venue.capacity.maximum,
        recommended: venue.capacity.recommended
      },
      price: { ...venue.price },
    }
    setEditForm(newEditForm)
    setOriginalEditForm(newEditForm)
    setIsEditModalOpen(true)
  }

  const handleDeleteVenue = async (venueId: string) => {
    if (window.confirm(t("business.venues.confirmDelete") || "Are you sure you want to delete this venue?")) {
      setIsDeleting(venueId)
      try {
        const result = await venueService.deleteVenue(venueId)
        if (result.success) {
          toast({
            title: t("common.success") || "Success",
            description: t("business.venues.venueDeleted") || "Venue deleted successfully",
            icon: <CheckCircle className="h-4 w-4" />,
          })
          fetchVenues() // Refresh the venues list
        } else {
          throw new Error(result.error || "Failed to delete venue")
        }
      } catch (error: any) {
        console.error("Error deleting venue:", error)
        const errorMessage =
            error.response?.data?.message || error.message || "Failed to delete venue. Please try again."
        toast({
          title: t("common.error") || "Error",
          description: errorMessage,
          variant: "destructive",
          icon: <AlertCircle className="h-4 w-4" />,
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  const hasFormChanges = () => {
    return JSON.stringify(editForm) !== JSON.stringify(originalEditForm)
  }

  const handleSaveEdit = async () => {
    if (!selectedVenue) return

    // Check if there are any changes
    if (!hasFormChanges()) {
      toast({
        title: t("common.info") || "No Changes",
        description:
            t("business.venues.noChangesDetected") ||
            "No changes were detected. Please modify the venue details before saving.",
        variant: "default",
      })
      return
    }

    setIsSaving(true)
    try {
      let formData = new FormData()
      formData.append("data", JSON.stringify(editForm))
      const result = await venueService.updateVenue(selectedVenue.id, formData)
      if (result.success) {
        toast({
          title: t("common.success") || "Success",
          description: t("business.venues.venueUpdated") || "Venue updated successfully",
          icon: <CheckCircle className="h-4 w-4" />,
        })
        setIsEditModalOpen(false)
        fetchVenues() // Refresh the venues list

        // Show confirmation message
        setTimeout(() => {
          toast({
            title: t("business.venues.updateConfirmed") || "Update Confirmed",
            description: `${selectedVenue.name[language]} has been updated and changes are now live.`,
            icon: <CheckCircle className="h-4 w-4" />,
          })
        }, 500)
      } else {
        throw new Error(result.error || "Failed to update venue")
      }
    } catch (error: any) {
      console.error("Error updating venue:", error)
      const errorMessage = error.response?.data?.message || error.message || "Failed to update venue. Please try again."
      toast({
        title: t("common.error") || "Error",
        description: errorMessage,
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />,
      })
    } finally {
      setIsSaving(false)
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

  // Calendar date selection handlers
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    setSelectedDates((prev) => {
      // Check if date is already selected
      const isSelected = prev.some((d) => isSameDay(d, date))

      if (isSelected) {
        // Remove date if already selected
        return prev.filter((d) => !isSameDay(d, date))
      } else {
        // Add date if not selected
        return [...prev, date]
      }
    })
  }

  const handleBlockDates = async () => {
    if (!selectedVenue || selectedDates.length === 0) return

    try {
      setIsUpdatingAvailability(true)

      // Sort selected dates
      const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())

      // Group consecutive dates into ranges
      const dateRanges: { startDate: Date; endDate: Date }[] = []
      let currentRange: { startDate: Date; endDate: Date } | null = null

      sortedDates.forEach((date) => {
        if (!currentRange) {
          currentRange = { startDate: date, endDate: date }
        } else {
          // Check if this date is consecutive to the current range
          const nextExpectedDate = addDays(currentRange.endDate, 1)
          if (isSameDay(date, nextExpectedDate)) {
            currentRange.endDate = date
          } else {
            // This date is not consecutive, start a new range
            dateRanges.push(currentRange)
            currentRange = { startDate: date, endDate: date }
          }
        }
      })

      // Add the last range if it exists
      if (currentRange) {
        dateRanges.push(currentRange)
      }

      // Update blocked dates based on mode
      let updatedBlockedDates = [...blockedDates]

      if (blockingMode === "block") {
        // Add new blocked date ranges
        const newBlockedDates = dateRanges.map((range) => ({
          startDate: format(range.startDate, "yyyy-MM-dd"),
          endDate: format(range.endDate, "yyyy-MM-dd"),
          isConfirmed: true,
        }))

        updatedBlockedDates = [...updatedBlockedDates, ...newBlockedDates]
      } else {
        // Remove dates from blocked ranges
        const selectedDatesSet = new Set(selectedDates.map((d) => format(d, "yyyy-MM-dd")))

        // Process each blocked date range
        updatedBlockedDates = updatedBlockedDates.flatMap((blockedRange) => {
          const start = new Date(blockedRange.startDate)
          const end = new Date(blockedRange.endDate)

          // Check if any selected date falls within this range
          let hasOverlap = false
          let currentDate = new Date(start)

          while (!isAfter(currentDate, end)) {
            if (selectedDatesSet.has(format(currentDate, "yyyy-MM-dd"))) {
              hasOverlap = true
              break
            }
            currentDate = addDays(currentDate, 1)
          }

          if (!hasOverlap) {
            // No overlap, keep the range as is
            return [blockedRange]
          }

          // Handle overlap by potentially splitting the range
          const newRanges: { startDate: string; endDate: string; isConfirmed: boolean }[] = []
          let rangeStart: Date | null = null

          currentDate = new Date(start)
          while (!isAfter(currentDate, end)) {
            const dateStr = format(currentDate, "yyyy-MM-dd")

            if (!selectedDatesSet.has(dateStr)) {
              // This date should remain blocked
              if (!rangeStart) {
                rangeStart = new Date(currentDate)
              }
            } else {
              // This date should be unblocked
              if (rangeStart) {
                // End the current range
                newRanges.push({
                  startDate: format(rangeStart, "yyyy-MM-dd"),
                  endDate: format(addDays(currentDate, -1), "yyyy-MM-dd"),
                  isConfirmed: blockedRange.isConfirmed,
                })
                rangeStart = null
              }
            }

            currentDate = addDays(currentDate, 1)
          }

          // Handle the last range if it exists
          if (rangeStart) {
            newRanges.push({
              startDate: format(rangeStart, "yyyy-MM-dd"),
              endDate: format(end, "yyyy-MM-dd"),
              isConfirmed: blockedRange.isConfirmed,
            })
          }

          return newRanges
        })
      }

      // Update venue with new blocked dates
      const venueUpdate = {
        metadata: {
          ...selectedVenue.metadata,
          blockedDates: updatedBlockedDates,
        },
      }

      const result = await venueService.updateVenue(selectedVenue.id, venueUpdate)

      if (result.success) {
        setBlockedDates(updatedBlockedDates)
        setSelectedDates([])
        toast({
          title: t("common.success") || "Success",
          description:
              blockingMode === "block"
                  ? t("business.venues.datesBlocked") || "Dates blocked successfully"
                  : t("business.venues.datesUnblocked") || "Dates unblocked successfully",
        })
        fetchVenues() // Refresh venues to get updated data
      } else {
        throw new Error(result.error || "Failed to update venue availability")
      }
    } catch (error: any) {
      console.error("Error updating venue availability:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to update venue availability. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingAvailability(false)
    }
  }

  // Check if a date is in the blocked dates
  const isDateBlocked = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return blockedDates.some((blocked) => {
      const start = new Date(blocked.startDate)
      const end = new Date(blocked.endDate)
      return !isBefore(date, start) && !isAfter(date, end)
    })
  }

  const amenityOptions = Object.values(VenueAmenity).map((amenity) => ({
    value: amenity,
    label: t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace("_", " "),
  }))

  const handleRetry = () => {
    fetchVenues()
  }

  const handleAddressSelect = (address: Address) => {
    setEditForm(prev => ({
      ...prev,
      address: {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zipCode: address.zipCode || "",
        country: address.country || "",
        location: address.location ? {
          latitude: address.location.lat,
          longitude: address.location.lng
        } : undefined
      }
    }))
  }

  // Add this new function to handle individual field changes
  const handleAddressFieldChange = (field: keyof typeof editForm.address, value: string) => {
    setEditForm(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  if (error) {
    return (
        <BusinessLayout>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t("common.error") || "Error"}</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRetry}>{t("common.retry") || "Try Again"}</Button>
            </div>
          </div>
        </BusinessLayout>
    )
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
        <VenueNewModal
            isOpen={isAddVenueModalOpen}
            onClose={() => setIsAddVenueModalOpen(false)}
            onSuccess={() => {
              setIsAddVenueModalOpen(false)
              fetchVenues()
              toast({
                title: t("common.success") || "Success",
                description: t("business.venues.venueCreated") || "Venue created successfully",
                icon: <CheckCircle className="h-4 w-4" />,
              })
            }}
        />

        {/* View Venue Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedVenue?.name[language]}</DialogTitle>
              <DialogDescription>{t("business.venues.viewVenueDetails")}</DialogDescription>
            </DialogHeader>

            {selectedVenue && (
                <Tabs value={viewActiveTab} onValueChange={setViewActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="details">{t("business.venues.details") || "Details"}</TabsTrigger>
                    <TabsTrigger value="availability">{t("business.venues.availability") || "Availability"}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 py-4">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img
                          src={formatImageUrl(selectedVenue.media?.[0]?.url || "")}
                          alt={selectedVenue.name[language]}
                          className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="grid gap-4 py-4">
                      <div>
                        <h3 className="font-medium">{t("business.common.description")}</h3>
                        <p className="text-muted-foreground">{selectedVenue.description[language]}</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">{t("business.venues.venueType")}</h3>
                        <Badge className="bg-secondary text-secondary-foreground">
                          {getVenueTypeIcon(selectedVenue.type)}{" "}
                          {t(`business.venueTypes.${selectedVenue.type.toLowerCase()}`) || selectedVenue.type}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h3 className="font-medium mb-2">{t("venueDetail.location")}</h3>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">{selectedVenue.address.street}</p>
                              <p className="text-muted-foreground">
                                {selectedVenue.address.city}, {selectedVenue.address.state} {selectedVenue.address.zipCode}
                              </p>
                              <p className="text-muted-foreground">{selectedVenue.address.country}</p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">{t("venueDetail.capacity")}</h3>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {selectedVenue.capacity.min} - {selectedVenue.capacity.max} {t("venueBook.guests")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t("venueDetail.recommended")}: {selectedVenue.capacity.recommended}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">{t("business.common.pricing")}</h3>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{getPriceDisplay(selectedVenue)}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {t(`business.pricing.${selectedVenue.price.type}`) || selectedVenue.price.type}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3">{t("venueDetail.amenities")}</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedVenue.amenities.map((amenity) => (
                              <Badge key={amenity} variant="secondary" className="text-sm">
                                {t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace("_", " ")}
                              </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Reviews Summary */}
                      {selectedVenue.reviews && selectedVenue.reviews.length > 0 && (
                          <div>
                            <h3 className="font-medium mb-2">{t("venueDetail.reviews")}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i <
                                            Math.round(
                                                selectedVenue.reviews.reduce((sum, r) => sum + r.rating, 0) /
                                                selectedVenue.reviews.length,
                                            )
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                              </div>
                              <span className="font-medium">
                          {(
                              selectedVenue.reviews.reduce((sum, r) => sum + r.rating, 0) / selectedVenue.reviews.length
                          ).toFixed(1)}
                        </span>
                              <span className="text-muted-foreground">({selectedVenue.reviews.length} reviews)</span>
                            </div>
                          </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="availability" className="space-y-6 py-4">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{t("business.venues.manageAvailability")}</h3>
                        <div className="flex items-center space-x-2">
                          <Button
                              variant={blockingMode === "block" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setBlockingMode("block")}
                          >
                            {t("business.venues.blockDates") || "Block Dates"}
                          </Button>
                          <Button
                              variant={blockingMode === "unblock" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setBlockingMode("unblock")}
                          >
                            {t("business.venues.unblockDates") || "Unblock Dates"}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-4">
                          {blockingMode === "block"
                              ? t("business.venues.blockDatesHelp") || "Select dates to mark as unavailable"
                              : t("business.venues.unblockDatesHelp") || "Select blocked dates to make them available again"}
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex-1">
                            <Calendar
                                mode="multiple"
                                selected={selectedDates}
                                onSelect={(date) => handleDateSelect(date)}
                                className="rounded-md border"
                                modifiers={{
                                  blocked: (date) => isDateBlocked(date),
                                  selected: (date) => selectedDates.some((d) => isSameDay(d, date)),
                                }}
                                modifiersClassNames={{
                                  blocked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                                  selected: "bg-primary text-primary-foreground",
                                }}
                                disabled={(date) => {
                                  return blockingMode === "block" ? isDateBlocked(date) : !isDateBlocked(date)
                                }}
                            />
                          </div>

                          <div className="flex-1 space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">{t("business.venues.selectedDates")}</h4>
                              {selectedDates.length === 0 ? (
                                  <p className="text-sm text-muted-foreground">
                                    {t("business.venues.noDatesSelected") || "No dates selected"}
                                  </p>
                              ) : (
                                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                    {selectedDates
                                        .sort((a, b) => a.getTime() - b.getTime())
                                        .map((date, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                                            >
                                              <span>{format(date, "PPP")}</span>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleDateSelect(date)}
                                                  className="h-6 w-6 p-0"
                                              >
                                                &times;
                                              </Button>
                                            </div>
                                        ))}
                                  </div>
                              )}
                            </div>

                            <Button
                                onClick={handleBlockDates}
                                disabled={selectedDates.length === 0 || isUpdatingAvailability}
                                className="w-full"
                            >
                              {isUpdatingAvailability ? (
                                  <span className="flex items-center">
                              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    {t("common.processing") || "Processing..."}
                            </span>
                              ) : blockingMode === "block" ? (
                                  t("business.venues.confirmBlock") || "Block Selected Dates"
                              ) : (
                                  t("business.venues.confirmUnblock") || "Unblock Selected Dates"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <AddressAutocomplete
                    onAddressSelect={handleAddressSelect}
                    defaultAddress={{
                      street: editForm.address.street,
                      city: editForm.address.city,
                      state: editForm.address.state,
                      zipCode: editForm.address.zipCode,
                      country: editForm.address.country,
                      location: editForm.address.location ? {
                        lat: editForm.address.location.latitude,
                        lng: editForm.address.location.longitude
                      } : undefined
                    }}
                    disabled={false}
                    key={`${editForm.address.street}-${editForm.address.city}-${editForm.address.state}-${editForm.address.zipCode}-${editForm.address.country}`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">{t("business.common.street")}</Label>
                    <Input
                      id="street"
                      name="street"
                      value={editForm.address.street || ""}
                      onChange={(e) => handleAddressFieldChange("street", e.target.value)}
                      placeholder={t("business.venueNew.addressPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("business.common.city")}</Label>
                    <Input
                      id="city"
                      name="city"
                      value={editForm.address.city || ""}
                      onChange={(e) => handleAddressFieldChange("city", e.target.value)}
                      placeholder={t("business.venueNew.cityPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t("business.common.state")}</Label>
                    <Input
                      id="state"
                      name="state"
                      value={editForm.address.state || ""}
                      onChange={(e) => handleAddressFieldChange("state", e.target.value)}
                      placeholder={t("business.venueNew.statePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">{t("profile.zipCode") || "ZIP/Postal Code"}</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={editForm.address.zipCode || ""}
                      onChange={(e) => handleAddressFieldChange("zipCode", e.target.value)}
                      placeholder={t("business.venueNew.zipPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">{t("profile.country") || "Country"}</Label>
                    <Input
                      id="country"
                      name="country"
                      value={editForm.address.country || ""}
                      onChange={(e) => handleAddressFieldChange("country", e.target.value)}
                      placeholder={t("business.venueNew.countryPlaceholder")}
                      required
                    />
                  </div>
                </div>
              </div>

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
                    onChange={(e) =>
                        setEditForm({ ...editForm, description: { ...editForm.description, en: e.target.value } })
                    }
                    rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description-sq">{t("business.venues.description")} (Albanian)</Label>
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
                          {t(`business.venueTypes.${type.toLowerCase()}`) || type.replace("_", " ")}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price">{t("business.venues.price")}</Label>
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
                  <Label htmlFor="price-type">{t("business.venues.priceType")}</Label>
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
                            {t(`business.pricing.${type}`) || type.replace("_", " ")}
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
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSaving}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving || !hasFormChanges()}>
                {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("common.saving") || "Saving..."}
                    </>
                ) : !hasFormChanges() ? (
                    t("common.noChanges") || "No Changes"
                ) : (
                    t("common.save")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  type="search"
                  placeholder={t("business.venues.searchVenues")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {t("business.common.filter")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">{t("business.venues.venueType")}</h3>
                  <div className="space-y-2">
                    {[
                      "ballroom",
                      "garden",
                      "rooftop",
                      "loft",
                      "hotel",
                      "restaurant",
                      "meetingRoom",
                      "weddingVenue",
                      "outdoorSpace",
                      "photographyStudio",
                      "partyVenue",
                      "other"
                    ].map((type) => (
                        <div key={type} className="flex items-center space-x-2 group">
                          <Checkbox
                              id={`venue-type-${type}`}
                              checked={selectedVenueTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedVenueTypes([...selectedVenueTypes, type])
                                } else {
                                  setSelectedVenueTypes(selectedVenueTypes.filter((t) => t !== type))
                                }
                              }}
                              className="transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary group-hover:border-primary"
                          />
                          <label
                              htmlFor={`venue-type-${type}`}
                              className="text-sm cursor-pointer transition-colors group-hover:text-primary"
                          >
                            {t(`business.venueTypes.${type}`)}
                          </label>
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("business.venues.capacity")}</h3>
                  <div className="space-y-2">
                    {[
                      { key: "small", label: "Small (≤50)", value: "small" },
                      { key: "medium", label: "Medium (51-200)", value: "medium" },
                      { key: "large", label: "Large (201-500)", value: "large" },
                      { key: "xlarge", label: "Extra Large (500+)", value: "xlarge" },
                    ].map((capacity) => (
                        <div key={capacity.value} className="flex items-center space-x-2 group">
                          <Checkbox
                              id={`capacity-${capacity.value}`}
                              checked={selectedCapacityRanges.includes(capacity.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCapacityRanges([...selectedCapacityRanges, capacity.value])
                                } else {
                                  setSelectedCapacityRanges(selectedCapacityRanges.filter((c) => c !== capacity.value))
                                }
                              }}
                              className="transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary group-hover:border-primary"
                          />
                          <label
                              htmlFor={`capacity-${capacity.value}`}
                              className="text-sm cursor-pointer transition-colors group-hover:text-primary"
                          >
                            {capacity.label}
                          </label>
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("business.common.price")}</h3>
                  <div className="space-y-2">
                    {["hourly", "daily", "fixed"].map((priceType) => (
                        <div key={priceType} className="flex items-center space-x-2 group">
                          <Checkbox
                              id={`price-${priceType}`}
                              checked={selectedPriceTypes.includes(priceType)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPriceTypes([...selectedPriceTypes, priceType])
                                } else {
                                  setSelectedPriceTypes(selectedPriceTypes.filter((p) => p !== priceType))
                                }
                              }}
                              className="transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary group-hover:border-primary"
                          />
                          <label
                              htmlFor={`price-${priceType}`}
                              className="text-sm cursor-pointer transition-colors group-hover:text-primary"
                          >
                            {t(`business.pricing.${priceType}`)}
                          </label>
                        </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("business.common.status")}</h3>
                  <div className="space-y-2">
                    {["active", "inactive"].map((status) => (
                        <div key={status} className="flex items-center space-x-2 group">
                          <Checkbox
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedStatuses([...selectedStatuses, status])
                                } else {
                                  setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                                }
                              }}
                              className="transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary group-hover:border-primary"
                          />
                          <label
                              htmlFor={`status-${status}`}
                              className="text-sm cursor-pointer transition-colors group-hover:text-primary"
                          >
                            {t(`business.common.status.${status}`)}
                          </label>
                        </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Venues List */}
          <div className="space-y-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 h-10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">{t("business.common.status.active")}</TabsTrigger>
                <TabsTrigger value="inactive">{t("business.common.status.inactive")}</TabsTrigger>
                <TabsTrigger value="featured">{t("business.common.featured")}</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                      <div className="col-span-full flex justify-center py-8">
                        <LoadingSpinner size="lg" text={t("common.loading") || "Loading venues..."} />
                      </div>
                  ) : filteredVenues.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium">{t("business.venues.noVenuesFound") || "No venues found"}</h3>
                        <p className="text-muted-foreground mt-1">
                          {searchQuery ||
                          selectedVenueTypes.length > 0 ||
                          selectedPriceTypes.length > 0 ||
                          selectedStatuses.length > 0 ||
                          selectedCapacityRanges.length > 0
                              ? t("business.venues.adjustFilters") || "Try adjusting your filters"
                              : t("business.venues.createFirstVenue") || "Create your first venue to get started"}
                        </p>
                      </div>
                  ) : (
                      filteredVenues.map((venue) => (
                          <Card
                              key={venue.id}
                              className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                          >
                            <div className="aspect-video relative">
                              <img
                                  src={formatImageUrl(venue.media?.[0]?.url || "")}
                                  alt={venue.name[language]}
                                  className="object-cover w-full h-full"
                              />
                              <Badge
                                  className={`absolute top-2 right-2 ${
                                      venue.isActive
                                          ? "bg-emerald-500/90 dark:bg-emerald-600/90"
                                          : "bg-muted-foreground hover:bg-muted-foreground/80"
                                  }`}
                              >
                                {venue.isActive
                                    ? t("business.venues.active") || "Active"
                                    : t("business.venues.inactive") || "Inactive"}
                              </Badge>
                              {venue.featured && (
                                  <Badge className="absolute left-2 top-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400">
                                    {t("business.venues.featured") || "Featured"}
                                  </Badge>
                              )}
                            </div>
                            <CardHeader className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  {getVenueTypeIcon(venue.type)}
                                </div>
                                <CardTitle className="text-lg">{venue.name[language]}</CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2 mt-2">{venue.description[language]}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">{t(`business.venueTypes.${venue.type}`)}</Badge>
                                <div className="text-right">
                                  <span className="font-medium">{getPriceDisplay(venue)}</span>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {t(`business.pricing.${venue.price.type}`) || venue.price.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                              {venue.address.city}, {venue.address.state}
                            </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>
                              {venue.capacity.min}-{venue.capacity.max} guests
                            </span>
                                </div>

                                {venue.reviews && venue.reviews.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${
                                                    i <
                                                    Math.round(
                                                        venue.reviews.reduce((sum, r) => sum + r.rating, 0) / venue.reviews.length,
                                                    )
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                      </div>
                                      <span className="text-muted-foreground">({venue.reviews.length})</span>
                                    </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEditVenue(venue)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("business.common.edit")}
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleViewVenue(venue)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {t("business.common.view")}
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteVenue(venue.id)}
                                  disabled={isDeleting === venue.id}
                              >
                                {isDeleting === venue.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash className="h-4 w-4" />
                                )}
                                <span className="sr-only">{t("business.common.delete")}</span>
                              </Button>
                            </CardFooter>
                          </Card>
                      ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="active" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                      <div className="col-span-full flex justify-center py-8">
                        <LoadingSpinner size="lg" text={t("common.loading") || "Loading..."} />
                      </div>
                  ) : filteredVenues.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium">{t("business.venues.noActiveVenues") || "No active venues"}</h3>
                        <p className="text-muted-foreground mt-1">
                          {t("business.venues.activateVenues") || "Activate some venues to see them here"}
                        </p>
                      </div>
                  ) : (
                      filteredVenues.map((venue) => (
                          <Card
                              key={venue.id}
                              className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                          >
                            <div className="aspect-video relative">
                              <img
                                  src={formatImageUrl(venue.media?.[0]?.url || "")}
                                  alt={venue.name[language]}
                                  className="object-cover w-full h-full"
                              />
                              <Badge
                                  className={`absolute top-2 right-2 ${
                                      venue.isActive
                                          ? "bg-emerald-500/90 dark:bg-emerald-600/90"
                                          : "bg-muted-foreground hover:bg-muted-foreground/80"
                                  }`}
                              >
                                {venue.isActive
                                    ? t("business.venues.active") || "Active"
                                    : t("business.venues.inactive") || "Inactive"}
                              </Badge>
                            </div>
                            <CardHeader className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  {getVenueTypeIcon(venue.type)}
                                </div>
                                <CardTitle className="text-lg">{venue.name[language]}</CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2 mt-2">{venue.description[language]}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">{t(`business.venueTypes.${venue.type}`)}</Badge>
                                <div className="text-right">
                                  <span className="font-medium">{getPriceDisplay(venue)}</span>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {t(`venues.filters.priceType.${venue.price.type}`) || venue.price.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                              {venue.address.city}, {venue.address.state}
                            </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>
                              {venue.capacity.min}-{venue.capacity.max} guests
                            </span>
                                </div>

                                {venue.reviews && venue.reviews.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${
                                                    i <
                                                    Math.round(
                                                        venue.reviews.reduce((sum, r) => sum + r.rating, 0) / venue.reviews.length,
                                                    )
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                      </div>
                                      <span className="text-muted-foreground">({venue.reviews.length})</span>
                                    </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEditVenue(venue)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("business.common.edit")}
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleViewVenue(venue)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {t("business.common.view")}
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteVenue(venue.id)}
                                  disabled={isDeleting === venue.id}
                              >
                                {isDeleting === venue.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash className="h-4 w-4" />
                                )}
                                <span className="sr-only">{t("business.common.delete")}</span>
                              </Button>
                            </CardFooter>
                          </Card>
                      ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="inactive" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                      <div className="col-span-full flex justify-center py-8">
                        <LoadingSpinner size="lg" text={t("common.loading") || "Loading..."} />
                      </div>
                  ) : filteredVenues.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium">{t("business.venues.noInactiveVenues") || "No inactive venues"}</h3>
                        <p className="text-muted-foreground mt-1">
                          {t("business.venues.allVenuesActive") || "All your venues are currently active"}
                        </p>
                      </div>
                  ) : (
                      filteredVenues.map((venue) => (
                          <Card
                              key={venue.id}
                              className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                          >
                            <div className="aspect-video relative">
                              <img
                                  src={formatImageUrl(venue.media?.[0]?.url || "")}
                                  alt={venue.name[language]}
                                  className="object-cover w-full h-full"
                              />
                              <Badge
                                  className={`absolute top-2 right-2 ${
                                      venue.isActive
                                          ? "bg-emerald-500/90 dark:bg-emerald-600/90"
                                          : "bg-muted-foreground hover:bg-muted-foreground/80"
                                  }`}
                              >
                                {venue.isActive
                                    ? t("business.venues.active") || "Active"
                                    : t("business.venues.inactive") || "Inactive"}
                              </Badge>
                            </div>
                            <CardHeader className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  {getVenueTypeIcon(venue.type)}
                                </div>
                                <CardTitle className="text-lg">{venue.name[language]}</CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2 mt-2">{venue.description[language]}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">{t(`business.venueTypes.${venue.type}`)}</Badge>
                                <div className="text-right">
                                  <span className="font-medium">{getPriceDisplay(venue)}</span>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {t(`venues.filters.priceType.${venue.price.type}`) || venue.price.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                              {venue.address.city}, {venue.address.state}
                            </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>
                              {venue.capacity.min}-{venue.capacity.max} guests
                            </span>
                                </div>

                                {venue.reviews && venue.reviews.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${
                                                    i <
                                                    Math.round(
                                                        venue.reviews.reduce((sum, r) => sum + r.rating, 0) / venue.reviews.length,
                                                    )
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                      </div>
                                      <span className="text-muted-foreground">({venue.reviews.length})</span>
                                    </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEditVenue(venue)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("business.common.edit")}
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleViewVenue(venue)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {t("business.common.view")}
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteVenue(venue.id)}
                                  disabled={isDeleting === venue.id}
                              >
                                {isDeleting === venue.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash className="h-4 w-4" />
                                )}
                                <span className="sr-only">{t("business.common.delete")}</span>
                              </Button>
                            </CardFooter>
                          </Card>
                      ))
                  )}
                </div>
              </TabsContent>
              <TabsContent value="featured" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                      <div className="col-span-full flex justify-center py-8">
                        <LoadingSpinner size="lg" text={t("common.loading") || "Loading..."} />
                      </div>
                  ) : filteredVenues.length === 0 ? (
                      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-muted p-3 mb-4">
                          <Search className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium">{t("business.venues.noFeaturedVenues") || "No featured venues"}</h3>
                        <p className="text-muted-foreground mt-1">
                          {t("business.venues.markVenuesFeatured") || "Mark some venues as featured to see them here"}
                        </p>
                      </div>
                  ) : (
                      filteredVenues.map((venue) => (
                          <Card
                              key={venue.id}
                              className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                          >
                            <div className="aspect-video relative">
                              <img
                                  src={formatImageUrl(venue.media?.[0]?.url || "")}
                                  alt={venue.name[language]}
                                  className="object-cover w-full h-full"
                              />
                              <Badge
                                  className={`absolute top-2 right-2 ${
                                      venue.isActive
                                          ? "bg-emerald-500/90 dark:bg-emerald-600/90"
                                          : "bg-muted-foreground hover:bg-muted-foreground/80"
                                  }`}
                              >
                                {venue.isActive
                                    ? t("business.venues.active") || "Active"
                                    : t("business.venues.inactive") || "Inactive"}
                              </Badge>
                              {venue.featured && (
                                  <Badge className="absolute left-2 top-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400">
                                    {t("business.venues.featured") || "Featured"}
                                  </Badge>
                              )}
                            </div>
                            <CardHeader className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  {getVenueTypeIcon(venue.type)}
                                </div>
                                <CardTitle className="text-lg">{venue.name[language]}</CardTitle>
                              </div>
                              <CardDescription className="line-clamp-2 mt-2">{venue.description[language]}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <div className="flex items-center justify-between mb-3">
                                <Badge variant="outline">{t(`business.venueTypes.${venue.type}`)}</Badge>
                                <div className="text-right">
                                  <span className="font-medium">{getPriceDisplay(venue)}</span>
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {t(`venues.filters.priceType.${venue.price.type}`) || venue.price.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                              {venue.address.city}, {venue.address.state}
                            </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  <span>
                              {venue.capacity.min}-{venue.capacity.max} guests
                            </span>
                                </div>

                                {venue.reviews && venue.reviews.length > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-3 w-3 ${
                                                    i <
                                                    Math.round(
                                                        venue.reviews.reduce((sum, r) => sum + r.rating, 0) / venue.reviews.length,
                                                    )
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                      </div>
                                      <span className="text-muted-foreground">({venue.reviews.length})</span>
                                    </div>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex gap-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleEditVenue(venue)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                {t("business.common.edit")}
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleViewVenue(venue)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                {t("business.common.view")}
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteVenue(venue.id)}
                                  disabled={isDeleting === venue.id}
                              >
                                {isDeleting === venue.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Trash className="h-4 w-4" />
                                )}
                                <span className="sr-only">{t("business.common.delete")}</span>
                              </Button>
                            </CardFooter>
                          </Card>
                      ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </BusinessLayout>
  )
}
