"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Edit, Plus, Search, MapPin, Users, DollarSign, Eye, Trash, Star, AlertTriangle } from "lucide-react"
import { VenueNewModal } from "./venue-new"
import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Calendar } from "../../components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { format, isAfter, isBefore, isSameDay, addDays } from "date-fns"
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
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("details")
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [blockedDates, setBlockedDates] = useState<{ startDate: string; endDate: string; isConfirmed: boolean }[]>([])
  const [blockingMode, setBlockingMode] = useState<"block" | "unblock">("block")
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false)

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

  const fetchVenues = async () => {
    try {
      setLoading(true)
      setError(null)
      // Get all venues
      // For each venue summary, get the full venue details
      const venueDetails = await venueService.getVenueByOwner()

      setVenues(venueDetails.filter((v): v is Venue => v !== null))
    } catch (error: any) {
      console.error("Error fetching venues:", error)
      setError(error.message || "Failed to load venues")
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to load venues. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVenues()
  }, [])

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
    setBlockedDates(venue.metadata?.blockedDates || [])
    setSelectedDates([])
    setActiveTab("details")
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

  // Format image URL to handle relative paths
  const formatImageUrl = (url: string) => {
    if (!url) return "/placeholder.svg"

    // If it's already an absolute URL, return it as is
    if (url.startsWith("http")) return url

    // If it's a relative path, prepend the API URL
    const apiUrl = import.meta.env.VITE_API_IMAGE_URL || process.env.REACT_APP_API_IMAGE_URL || ""
    return `${apiUrl}/${url.replace(/\\/g, "/")}`
  }

  const handleDeleteVenue = async (venueId: string) => {
    if (window.confirm(t("business.venues.confirmDelete") || "Are you sure you want to delete this venue?")) {
      try {
        const result = await venueService.deleteVenue(venueId)
        if (result.success) {
          toast({
            title: t("common.success") || "Success",
            description: t("business.venues.venueDeleted") || "Venue deleted successfully",
          })
          fetchVenues() // Refresh the venues list
        } else {
          throw new Error(result.error || "Failed to delete venue")
        }
      } catch (error: any) {
        console.error("Error deleting venue:", error)
        toast({
          title: t("common.error") || "Error",
          description: error.message || "Failed to delete venue. Please try again.",
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
          title: t("common.success") || "Success",
          description: t("business.venues.venueUpdated") || "Venue updated successfully",
        })
        setIsEditModalOpen(false)
        fetchVenues() // Refresh the venues list
      } else {
        throw new Error(result.error || "Failed to update venue")
      }
    } catch (error: any) {
      console.error("Error updating venue:", error)
      toast({
        title: t("common.error") || "Error",
        description: error.message || "Failed to update venue. Please try again.",
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

  if (error) {
    return (
      <BusinessLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t("common.error") || "Error"}</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchVenues}>{t("common.retry") || "Try Again"}</Button>
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
        }}
      />

      {/* View Venue Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedVenue?.name.en}</DialogTitle>
          </DialogHeader>

          {selectedVenue && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">{t("business.venues.details") || "Details"}</TabsTrigger>
                <TabsTrigger value="availability">{t("business.venues.availability") || "Availability"}</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 py-4">
                {/* Hero Image */}
                {selectedVenue.media && selectedVenue.media.length > 0 && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <img
                      src={formatImageUrl(selectedVenue.media[0].url) || "/placeholder.svg"}
                      alt={selectedVenue.name.en}
                      className="w-full h-full object-cover"
                    />
                    <Badge
                      className={`absolute top-4 right-4 ${
                        selectedVenue.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400"
                      }`}
                    >
                      {selectedVenue.isActive
                        ? t("business.venues.active") || "Active"
                        : t("business.venues.inactive") || "Inactive"}
                    </Badge>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t("business.common.description")}</h3>
                      <p className="text-muted-foreground">{selectedVenue.description.en}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t("venueDetail.location")}</h3>
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

                      <div>
                        <h3 className="text-lg font-semibold mb-2">{t("business.common.type")}</h3>
                        <Badge variant="outline" className="text-sm">
                          {t(`business.venueTypes.${selectedVenue.type}`) || selectedVenue.type.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t("venueDetail.capacity")}</h3>
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

                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t("business.common.pricing")}</h3>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {selectedVenue.price.currency} {selectedVenue.price.amount}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {t(`venues.filters.priceType.${selectedVenue.price.type}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Reviews Summary */}
                    {selectedVenue.reviews && selectedVenue.reviews.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{t("venueDetail.reviews")}</h3>
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
                </div>

                {/* Operating Hours */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("venueDetail.operatingHours")}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(selectedVenue.dayAvailability || {}).map(([day, hours]) => (
                      <div key={day} className="flex flex-col p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="capitalize font-medium text-sm">{day}</span>
                        <span className="text-xs text-muted-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">{t("venueDetail.amenities")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="text-sm">
                        {t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Blocked Dates */}
                {selectedVenue.metadata?.blockedDates && selectedVenue.metadata.blockedDates.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("business.venues.blockedDates")}</h3>
                    <div className="space-y-2">
                      {selectedVenue.metadata.blockedDates.map((blocked, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {new Date(blocked.startDate).toLocaleDateString()} -{" "}
                              {new Date(blocked.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          {blocked.isConfirmed && (
                            <Badge variant="destructive">{t("business.venues.confirmed") || "Confirmed"}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Reviews */}
                {selectedVenue.reviews && selectedVenue.reviews.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("venueDetail.recentReviews")}</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedVenue.reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
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
                                  {t("venueDetail.verified") || "Verified"}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Images */}
                {selectedVenue.media && selectedVenue.media.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">{t("venueDetail.gallery")}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedVenue.media.slice(1, 9).map((media, index) => (
                        <div key={media.id} className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={formatImageUrl(media.url) || "/placeholder.svg"}
                            alt={`${selectedVenue.name.en} - Image ${index + 2}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                            // If in block mode, don't allow selecting already blocked dates
                            // If in unblock mode, only allow selecting blocked dates
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

                        <div>
                          <h4 className="font-medium mb-2">{t("business.venues.currentlyBlocked")}</h4>
                          {blockedDates.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              {t("business.venues.noBlockedDates") || "No dates are currently blocked"}
                            </p>
                          ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                              {blockedDates.map((blocked, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-md"
                                >
                                  <span>
                                    {new Date(blocked.startDate).toLocaleDateString()} -{" "}
                                    {new Date(blocked.endDate).toLocaleDateString()}
                                  </span>
                                  {blocked.isConfirmed && (
                                    <Badge variant="outline" className="text-xs">
                                      {t("business.venues.confirmed") || "Confirmed"}
                                    </Badge>
                                  )}
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
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
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
                    src={formatImageUrl(venue.media?.[0]?.url || "")}
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
