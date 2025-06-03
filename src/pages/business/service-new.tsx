"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "../../context/language-context"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Upload, Plus, X, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { ServiceType } from "../../models/service"
import { VenueType } from "../../models/venue"
import { PricingType } from "../../models/common"
import { toast } from "../../components/ui/use-toast"
import { createService } from "@/services/serviceService"

interface ServiceNewModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceCreated?: () => void
}

interface ServiceOption {
  name: { en: string; sq: string }
  description: { en: string; sq: string }
  price: {
    amount: number
    currency: string
    type: PricingType
  }
}

interface ServiceFormData {
  name: { en: string; sq: string }
  description: { en: string; sq: string }
  type: ServiceType
  venueTypes: VenueType[]
  dayAvailability: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  options: ServiceOption[]
}

const defaultAvailability = {
  monday: "9:00 AM - 10:00 PM",
  tuesday: "9:00 AM - 10:00 PM",
  wednesday: "9:00 AM - 10:00 PM",
  thursday: "9:00 AM - 10:00 PM",
  friday: "9:00 AM - 12:00 AM",
  saturday: "10:00 AM - 12:00 AM",
  sunday: "10:00 AM - 10:00 PM",
}

export function ServiceNewModal({ isOpen, onClose, onServiceCreated }: ServiceNewModalProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [formData, setFormData] = useState<ServiceFormData>({
    name: { en: "", sq: "" },
    description: { en: "", sq: "" },
    type: ServiceType.OTHER,
    venueTypes: [],
    dayAvailability: { ...defaultAvailability },
    options: [
      {
        name: { en: "", sq: "" },
        description: { en: "", sq: "" },
        price: {
          amount: 0,
          currency: "USD",
          type: PricingType.FIXED,
        },
      },
    ],
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages((prev) => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

// Log FormData contents
console.log("FormData contents:");
for (const option of formData.options) {
  console.log(`${option.name.en}:`, option.name.sq);
}

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          name: { en: "", sq: "" },
          description: { en: "", sq: "" },
          price: {
            amount: 0,
            currency: "USD",
            type: PricingType.FIXED,
          },
        },
      ],
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 1) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }))
    }
  }

  const updateOption = (index: number, field: string, value: any) => {
    setFormData((prev) => {
      const newOptions = [...prev.options]
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        newOptions[index] = {
          ...newOptions[index],
          [parent]: {
            ...newOptions[index][parent as keyof ServiceOption],
            [child]: value,
          },
        }
      } else {
        newOptions[index] = {
          ...newOptions[index],
          [field]: value,
        }
      }
      return { ...prev, options: newOptions }
    })
  }

  const handleVenueTypeChange = (venueType: VenueType, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      venueTypes: checked ? [...prev.venueTypes, venueType] : prev.venueTypes.filter((type) => type !== venueType),
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData for multipart/form-data request
      const submitData = new FormData()

      // Add the service data as JSON string
      submitData.append("data", JSON.stringify(formData))

      // Add images
      selectedImages.forEach((image) => {
        submitData.append("images", image)
      })



      // Reset form
      setFormData({
        name: { en: "", sq: "" },
        description: { en: "", sq: "" },
        type: ServiceType.OTHER,
        venueTypes: [],
        dayAvailability: { ...defaultAvailability },
        options: [
          {
            name: { en: "", sq: "" },
            description: { en: "", sq: "" },
            price: {
              amount: 0,
              currency: "USD",
              type: PricingType.FIXED,
            },
          },
        ],
      })
      setSelectedImages([])

      // Call the callback to refresh the services list
      if (onServiceCreated) {
        onServiceCreated()
      }

      onClose()
    } catch (error: any) {
      console.error("Error creating service:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create service. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("business.serviceNew.title") || "Create New Service"}</DialogTitle>
          <DialogDescription>
            {t("business.serviceNew.subtitle") || "Add a new service to your business"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name-en">Service Name (English)*</Label>
                <Input
                  id="name-en"
                  value={formData.name.en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: { ...prev.name, en: e.target.value } }))}
                  placeholder="Enter service name in English"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name-sq">Service Name (Albanian)*</Label>
                <Input
                  id="name-sq"
                  value={formData.name.sq}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: { ...prev.name, sq: e.target.value } }))}
                  placeholder="Enter service name in Albanian"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Service Type*</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as ServiceType }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`business.serviceNew.${type.toLowerCase()}`) || type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="description-en">Description (English)*</Label>
                <Textarea
                  id="description-en"
                  value={formData.description.en}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: { ...prev.description, en: e.target.value } }))
                  }
                  placeholder="Describe your service in English"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description-sq">Description (Albanian)*</Label>
                <Textarea
                  id="description-sq"
                  value={formData.description.sq}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: { ...prev.description, sq: e.target.value } }))
                  }
                  placeholder="Describe your service in Albanian"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Venue Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Available for Venue Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.values(VenueType).map((venueType) => (
                <div key={venueType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`venue-${venueType}`}
                    checked={formData.venueTypes.includes(venueType)}
                    onCheckedChange={(checked) => handleVenueTypeChange(venueType, checked === true)}
                  />
                  <Label htmlFor={`venue-${venueType}`} className="text-sm">
                    {venueType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Service Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Service Options</h3>
              <Button type="button" variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            {formData.options.map((option, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Option {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      disabled={formData.options.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Option Name (English)*</Label>
                      <Input
                        value={option.name.en}
                        onChange={(e) => updateOption(index, "name.en", e.target.value)}
                        placeholder="Option name in English"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Option Name (Albanian)*</Label>
                      <Input
                        value={option.name.sq}
                        onChange={(e) => updateOption(index, "name.sq", e.target.value)}
                        placeholder="Option name in Albanian"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label>Description (English)</Label>
                      <Textarea
                        value={option.description.en}
                        onChange={(e) => updateOption(index, "description.en", e.target.value)}
                        placeholder="Option description in English"
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (Albanian)</Label>
                      <Textarea
                        value={option.description.sq}
                        onChange={(e) => updateOption(index, "description.sq", e.target.value)}
                        placeholder="Option description in Albanian"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Price*</Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                          $
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={option.price.amount}
                          onChange={(e) => updateOption(index, "price.amount", Number.parseFloat(e.target.value) || 0)}
                          className="pl-7"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pricing Type*</Label>
                      <Select
                        value={option.price.type}
                        onValueChange={(value) => updateOption(index, "price.type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select pricing type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PricingType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service Images</h3>

            <div className="space-y-4">
              <div className="flex h-32 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400">
                <label htmlFor="images" className="flex flex-col items-center space-y-2 p-4 text-center cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm font-medium">Upload Service Images</div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-1">
                  <svg
                    className="animate-spin h-4 w-4 mr-1"
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
                  Creating...
                </span>
              ) : (
                "Create Service"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Keep the page component for direct navigation (fallback)
export default function BusinessServiceNewPage() {
  const { t } = useLanguage()

  return <ServiceNewModal isOpen={true} onClose={() => window.history.back()} />
}
