// Replace the entire file with this implementation that uses your existing React/Vite setup

"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../context/language-context"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Upload } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { VenueAmenity, VenueType } from "../../models/venue"
import { PricingType } from "../../models/common"
import { toast } from "../../components/ui/use-toast"
import { createVenue } from "../../services/venueService"

interface VenueNewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function VenueNewModal({ isOpen, onClose, onSuccess }: VenueNewModalProps) {
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [venueForm, setVenueForm] = useState({
    name: {
      en: "",
      sq: "",
    },
    description: {
      en: "",
      sq: "",
    },
    type: VenueType.OTHER,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
      location: {},
    },
    amenities: [] as VenueAmenity[],
    capacity: {
      min: 10,
      max: 100,
      recommended: 50,
    },
    price: {
      amount: 0,
      currency: "USD",
      type: PricingType.HOURLY,
    },
    dayAvailability: {
      monday: "9:00 AM - 10:00 PM",
      tuesday: "9:00 AM - 10:00 PM",
      wednesday: "9:00 AM - 10:00 PM",
      thursday: "9:00 AM - 10:00 PM",
      friday: "9:00 AM - 12:00 AM",
      saturday: "10:00 AM - 12:00 AM",
      sunday: "10:00 AM - 10:00 PM",
    },
  })

  // State for image uploads
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData for multipart/form-data submission
      const formData = new FormData()

      // Prepare venue data
      const venueData = {
        name: venueForm.name,
        description: venueForm.description,
        type: venueForm.type,
        amenities: venueForm.amenities,
        address: {
          street: venueForm.address.street,
          city: venueForm.address.city,
          state: venueForm.address.state,
          zipCode: venueForm.address.zipCode,
          country: venueForm.address.country,
          location: {},
        },
        capacity: venueForm.capacity,
        price: venueForm.price,
        dayAvailability: venueForm.dayAvailability,
      }


      // Add JSON data
      formData.append("data", JSON.stringify(venueData))

      // Add images
      selectedImages.forEach((image) => {
        formData.append("images", image)
      })

      // Make API request
      const response = await createVenue(formData)

      if (response.success) {
        toast({
          title: "Success",
          description: "Venue created successfully",
        })

        // Reset form
        setVenueForm({
          name: { en: "", sq: "" },
          description: { en: "", sq: "" },
          type: VenueType.OTHER,
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "USA",
            location: {},
          },
          amenities: [],
          capacity: {
            min: 10,
            max: 100,
            recommended: 50,
          },
          price: {
            amount: 0,
            currency: "USD",
            type: PricingType.HOURLY,
          },
          dayAvailability: {
            monday: "9:00 AM - 10:00 PM",
            tuesday: "9:00 AM - 10:00 PM",
            wednesday: "9:00 AM - 10:00 PM",
            thursday: "9:00 AM - 10:00 PM",
            friday: "9:00 AM - 12:00 AM",
            saturday: "10:00 AM - 12:00 AM",
            sunday: "10:00 AM - 10:00 PM",
          },
        })

        // Reset images
        setSelectedImages([])
        setImagePreviews([])

        if (onSuccess) {
          onSuccess()
        } else {
          onClose()
        }
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.message || "Failed to create venue",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating venue:", error)
      toast({
        title: "Error",
        description: "Failed to create venue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleAmenity = (amenity: VenueAmenity) => {
    setVenueForm((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity]
      return { ...prev, amenities }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setSelectedImages((prev) => [...prev, ...files])

    // Create image previews
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const goToNextTab = () => {
    if (activeTab === "details") setActiveTab("photos")
    else if (activeTab === "photos") setActiveTab("pricing")
    else if (activeTab === "pricing") setActiveTab("amenities")
  }

  const goToPrevTab = () => {
    if (activeTab === "amenities") setActiveTab("pricing")
    else if (activeTab === "pricing") setActiveTab("photos")
    else if (activeTab === "photos") setActiveTab("details")
  }

  const amenityOptions = Object.values(VenueAmenity).map((amenity) => ({
    value: amenity,
    label: t(`venues.amenities.${amenity.toLowerCase()}`) || amenity.replace("_", " "),
  }))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("business.venueNew.title")}</DialogTitle>
          <DialogDescription>{t("business.venueNew.subtitle")}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="details">{t("business.venueNew.details")}</TabsTrigger>
            <TabsTrigger value="photos">{t("business.venueNew.photos")}</TabsTrigger>
            <TabsTrigger value="pricing">{t("business.venueNew.pricing")}</TabsTrigger>
            <TabsTrigger value="amenities">{t("business.venueNew.amenities")}</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name-en">{t("business.common.name")}* (English)</Label>
                    <Input
                      id="name-en"
                      value={venueForm.name.en}
                      onChange={(e) => setVenueForm({ ...venueForm, name: { ...venueForm.name, en: e.target.value } })}
                      placeholder={t("business.venueNew.venueNamePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-sq">{t("business.common.name")}* (Albanian)</Label>
                    <Input
                      id="name-sq"
                      value={venueForm.name.sq}
                      onChange={(e) => setVenueForm({ ...venueForm, name: { ...venueForm.name, sq: e.target.value } })}
                      placeholder={t("business.venueNew.venueNamePlaceholder")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">{t("business.common.type")}*</Label>
                  <Select
                    value={venueForm.type}
                    onValueChange={(value) => setVenueForm({ ...venueForm, type: value as VenueType })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("business.common.selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(VenueType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`venues.types.${type.toLowerCase()}`) || type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="description-en">{t("business.common.description")}* (English)</Label>
                    <Textarea
                      id="description-en"
                      value={venueForm.description.en}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, description: { ...venueForm.description, en: e.target.value } })
                      }
                      placeholder={t("business.venueNew.descriptionPlaceholder")}
                      rows={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description-sq">{t("business.common.description")}* (Albanian)</Label>
                    <Textarea
                      id="description-sq"
                      value={venueForm.description.sq}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, description: { ...venueForm.description, sq: e.target.value } })
                      }
                      placeholder={t("business.venueNew.descriptionPlaceholder")}
                      rows={5}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">{t("business.common.address")}*</Label>
                  <Input
                    id="street"
                    value={venueForm.address.street}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, address: { ...venueForm.address, street: e.target.value } })
                    }
                    placeholder={t("business.venueNew.addressPlaceholder")}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("business.common.city")}*</Label>
                    <Input
                      id="city"
                      value={venueForm.address.city}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, address: { ...venueForm.address, city: e.target.value } })
                      }
                      placeholder={t("business.venueNew.cityPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">{t("business.common.state")}*</Label>
                    <Input
                      id="state"
                      value={venueForm.address.state}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, address: { ...venueForm.address, state: e.target.value } })
                      }
                      placeholder={t("business.venueNew.statePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">{t("business.common.zip")}*</Label>
                    <Input
                      id="zip"
                      value={venueForm.address.zipCode}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, address: { ...venueForm.address, zipCode: e.target.value } })
                      }
                      placeholder={t("business.venueNew.zipPlaceholder")}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">{t("business.venueNew.location")}*</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Manhattan, NY"
                    onChange={(e) => {
                      // Just store the location as a string, we'll handle it in the API call
                      const location = e.target.value
                      setVenueForm({
                        ...venueForm,
                        address: {
                          ...venueForm.address,
                          location: { location },
                        },
                      })
                    }}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="capacity-min">{t("business.venueNew.minCapacity")}*</Label>
                    <Input
                      id="capacity-min"
                      type="number"
                      min="1"
                      value={venueForm.capacity.min}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          capacity: { ...venueForm.capacity, min: Number.parseInt(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity-max">{t("business.venueNew.maxCapacity")}*</Label>
                    <Input
                      id="capacity-max"
                      type="number"
                      min="1"
                      value={venueForm.capacity.max}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          capacity: { ...venueForm.capacity, max: Number.parseInt(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity-recommended">{t("business.venueNew.recommendedCapacity")}*</Label>
                    <Input
                      id="capacity-recommended"
                      type="number"
                      min="1"
                      value={venueForm.capacity.recommended}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          capacity: { ...venueForm.capacity, recommended: Number.parseInt(e.target.value) },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={goToNextTab}>
                  {t("business.common.next")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("business.venueNew.mainPhoto")}</Label>
                  <div
                    className="flex h-64 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600"
                    onClick={() => document.getElementById("image-upload")?.click()}
                  >
                    <div className="flex flex-col items-center space-y-2 p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-sm font-medium">{t("business.common.dragPhotos")}</div>
                      <p className="text-xs text-gray-500">{t("business.common.photoRequirements")}</p>
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPrevTab}>
                  {t("business.common.previous")}
                </Button>
                <Button type="button" onClick={goToNextTab}>
                  {t("business.common.next")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">{t("business.common.price")}*</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        id="basePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        value={venueForm.price.amount}
                        onChange={(e) =>
                          setVenueForm({
                            ...venueForm,
                            price: { ...venueForm.price, amount: Number.parseFloat(e.target.value) },
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricingType">{t("business.serviceNew.pricingType")}*</Label>
                    <Select
                      value={venueForm.price.type}
                      onValueChange={(value) =>
                        setVenueForm({ ...venueForm, price: { ...venueForm.price, type: value as PricingType } })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("business.common.selectPriceType")} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PricingType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`common.${type.toLowerCase()}`) || type.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPrevTab}>
                  {t("business.common.previous")}
                </Button>
                <Button type="button" onClick={goToNextTab}>
                  {t("business.common.next")}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity.value}`}
                        checked={venueForm.amenities.includes(amenity.value)}
                        onCheckedChange={() => handleToggleAmenity(amenity.value)}
                      />
                      <Label htmlFor={`amenity-${amenity.value}`} className="text-sm">
                        {amenity.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={goToPrevTab}>
                  {t("business.common.previous")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("business.common.creating") : t("business.common.createVenue")}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default function BusinessVenueNewPage() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    navigate("/business/venues")
  }

  return <VenueNewModal isOpen={isOpen} onClose={handleClose} />
}
