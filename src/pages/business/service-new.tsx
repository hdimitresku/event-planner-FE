"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "../../context/language-context"
import { useCurrency, type Currency } from "../../context/currency-context"
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
    type: PricingType
    currency: Currency
  }
  images: string[]
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
  "monday": "12:00 AM - 11:59 PM",
  "tuesday": "12:00 AM - 11:59 PM",
  "wednesday": "12:00 AM - 11:59 PM",
  "thursday": "12:00 AM - 11:59 PM",
  "friday": "12:00 AM - 11:59 PM",
  "saturday": "12:00 AM - 11:59 PM",
  "sunday": "12:00 AM - 11:59 PM"
}

export function ServiceNewModal({ isOpen, onClose, onServiceCreated }: ServiceNewModalProps) {
  const { t } = useLanguage()
  const { formatPrice, convertPrice, currency } = useCurrency()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [formData, setFormData] = useState<ServiceFormData>({
    name: { en: "", sq: "" },
    description: { en: "", sq: "" },
    type: ServiceType.CATERING,
    venueTypes: [] as VenueType[],
    dayAvailability: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    options: [
      {
        name: { en: "", sq: "" },
        description: { en: "", sq: "" },
        price: {
          amount: 0,
          type: PricingType.FIXED,
          currency: "USD" as Currency,
        },
        images: [] as string[],
      },
    ],
  })

  // Add these new state variables after the existing useState declarations
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [fieldTouched, setFieldTouched] = useState<{ [key: string]: boolean }>({})

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return
    const newFiles = Array.from(files)
    setSelectedImages((prev: File[]) => [...prev, ...newFiles])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev: File[]) => prev.filter((_, i: number) => i !== index))
  }

  // Log FormData contents
  for (const option of formData.options) {
  }

  const addOption = () => {
    setFormData((prev: ServiceFormData) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          name: { en: "", sq: "" },
          description: { en: "", sq: "" },
          price: {
            amount: 0,
            type: PricingType.FIXED,
            currency: "USD" as Currency,
          },
          images: [] as string[],
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
    setFormData((prev: ServiceFormData) => {
      const newOptions = [...prev.options]
      const option = { ...newOptions[index] }
      
      if (field.includes(".")) {
        const [parent, child] = field.split(".")
        if (parent === "price") {
          option.price = {
            ...option.price,
            [child]: value,
          }
        } else if (parent === "name" || parent === "description") {
          option[parent] = {
            ...option[parent],
            [child]: value,
          }
        }
      } else {
        option[field as keyof ServiceOption] = value
      }
      
      newOptions[index] = option
      return { ...prev, options: newOptions }
    })
  }

  // Replace the existing validateForm function with this enhanced version
  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // Validate service name
    if (!formData.name.en.trim()) {
      errors["name.en"] = "English name is required"
    }
    if (!formData.name.sq.trim()) {
      errors["name.sq"] = "Albanian name is required"
    }

    // Validate description
    if (!formData.description.en.trim()) {
      errors["description.en"] = "English description is required"
    }
    if (!formData.description.sq.trim()) {
      errors["description.sq"] = "Albanian description is required"
    }

    // Validate venue types
    if (formData.venueTypes.length === 0) {
      errors["venueTypes"] = "Please select at least one venue type"
    }

    // Validate each option
    formData.options.forEach((option, index) => {
      if (!option.name.en.trim()) {
        errors[`option.${index}.name.en`] = "English option name is required"
      }
      if (!option.name.sq.trim()) {
        errors[`option.${index}.name.sq`] = "Albanian option name is required"
      }
      if (option.price.amount === undefined) {
        errors[`option.${index}.price`] = "Price must be entered"
      }
    })

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add field validation helper function
  const validateField = (fieldName: string, value: any) => {
    const errors = { ...fieldErrors }

    switch (fieldName) {
      case "name.en":
        if (!value?.trim()) {
          errors[fieldName] = "English name is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "name.sq":
        if (!value?.trim()) {
          errors[fieldName] = "Albanian name is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "description.en":
        if (!value?.trim()) {
          errors[fieldName] = "English description is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "description.sq":
        if (!value?.trim()) {
          errors[fieldName] = "Albanian description is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "venueTypes":
        if (!value || value.length === 0) {
          errors[fieldName] = "Please select at least one venue type"
        } else {
          delete errors[fieldName]
        }
        break
    }

    setFieldErrors(errors)
  }

  // Add field touch handler
  const handleFieldTouch = (fieldName: string) => {
    setFieldTouched((prev) => ({ ...prev, [fieldName]: true }))
  }

  // Add error display component
  const FieldError = ({ error }: { error?: string }) => {
    if (!error) return null
    return (
        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
    )
  }

  const handleVenueTypeChange = (venueType: VenueType, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      venueTypes: checked ? [...prev.venueTypes, venueType] : prev.venueTypes.filter((type) => type !== venueType),
    }))
  }

  // Update the handleSubmit function to include validation
  // Find the handleSubmit function and modify it:
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return
    }

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

      // Call API to create service
      await createService(submitData)

      toast({
        title: "Success",
        description: `Service "${formData.name.en}" created successfully`,
      })

      // Reset form
      setFormData({
        name: { en: "", sq: "" },
        description: { en: "", sq: "" },
        type: ServiceType.CATERING,
        venueTypes: [],
        dayAvailability: { ...defaultAvailability },
        options: [
          {
            name: { en: "", sq: "" },
            description: { en: "", sq: "" },
            price: {
              amount: 0,
              type: PricingType.FIXED,
              currency: "USD" as Currency,
            },
            images: [],
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
                {/* Update the service name inputs to include validation styling and error handling */}
                {/* Replace the existing name input sections with: */}
                <div className="space-y-2">
                  <Label htmlFor="name-en" className="flex items-center gap-1">
                    Service Name (English)*
                    {fieldTouched["name.en"] && !fieldErrors["name.en"] && (
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                    )}
                  </Label>
                  <Input
                      id="name-en"
                      value={formData.name.en}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: { ...prev.name, en: e.target.value } }))
                        validateField("name.en", e.target.value)
                      }}
                      onBlur={() => handleFieldTouch("name.en")}
                      placeholder="Enter service name in English"
                      className={`${fieldErrors["name.en"] ? "border-red-500 focus:border-red-500" : fieldTouched["name.en"] && !fieldErrors["name.en"] ? "border-green-500" : ""}`}
                      required
                  />
                  <FieldError error={fieldTouched["name.en"] ? fieldErrors["name.en"] : undefined} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-sq" className="flex items-center gap-1">
                    Service Name (Albanian)*
                    {fieldTouched["name.sq"] && !fieldErrors["name.sq"] && (
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                    )}
                  </Label>
                  <Input
                      id="name-sq"
                      value={formData.name.sq}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: { ...prev.name, sq: e.target.value } }))
                        validateField("name.sq", e.target.value)
                      }}
                      onBlur={() => handleFieldTouch("name.sq")}
                      placeholder="Enter service name in Albanian"
                      className={`${fieldErrors["name.sq"] ? "border-red-500 focus:border-red-500" : fieldTouched["name.sq"] && !fieldErrors["name.sq"] ? "border-green-500" : ""}`}
                      required
                  />
                  <FieldError error={fieldTouched["name.sq"] ? fieldErrors["name.sq"] : undefined} />
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
                {/* Update the description textareas with validation styling */}
                {/* Replace the existing description sections with: */}
                <div className="space-y-2">
                  <Label htmlFor="description-en" className="flex items-center gap-1">
                    Description (English)*
                    {fieldTouched["description.en"] && !fieldErrors["description.en"] && (
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                    )}
                  </Label>
                  <Textarea
                      id="description-en"
                      value={formData.description.en}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: { ...prev.description, en: e.target.value } }))
                        validateField("description.en", e.target.value)
                      }}
                      onBlur={() => handleFieldTouch("description.en")}
                      placeholder="Describe your service in English"
                      rows={3}
                      className={`${fieldErrors["description.en"] ? "border-red-500 focus:border-red-500" : fieldTouched["description.en"] && !fieldErrors["description.en"] ? "border-green-500" : ""}`}
                      required
                  />
                  <FieldError error={fieldTouched["description.en"] ? fieldErrors["description.en"] : undefined} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description-sq" className="flex items-center gap-1">
                    Description (Albanian)*
                    {fieldTouched["description.sq"] && !fieldErrors["description.sq"] && (
                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                    )}
                  </Label>
                  <Textarea
                      id="description-sq"
                      value={formData.description.sq}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: { ...prev.description, sq: e.target.value } }))
                        validateField("description.sq", e.target.value)
                      }}
                      onBlur={() => handleFieldTouch("description.sq")}
                      placeholder="Describe your service in Albanian"
                      rows={3}
                      className={`${fieldErrors["description.sq"] ? "border-red-500 focus:border-red-500" : fieldTouched["description.sq"] && !fieldErrors["description.sq"] ? "border-green-500" : ""}`}
                      required
                  />
                  <FieldError error={fieldTouched["description.sq"] ? fieldErrors["description.sq"] : undefined} />
                </div>
              </div>
            </div>

            {/* Venue Types */}
            {/* Add validation styling to the venue types section */}
            {/* Replace the venue types section with: */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Available for Venue Types</h3>
                {fieldTouched["venueTypes"] && !fieldErrors["venueTypes"] && (
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                      />
                    </svg>
                )}
              </div>
              <div
                  className={`grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg border ${fieldErrors["venueTypes"] ? "border-red-500 bg-red-50" : fieldTouched["venueTypes"] && !fieldErrors["venueTypes"] ? "border-green-500 bg-green-50" : "border-gray-200"}`}
              >
                {Object.values(VenueType).map((venueType) => (
                    <div key={venueType} className="flex items-center space-x-2">
                      <Checkbox
                          id={`venue-${venueType}`}
                          checked={formData.venueTypes.includes(venueType)}
                          onCheckedChange={(checked) => {
                            handleVenueTypeChange(venueType, checked === true)
                            handleFieldTouch("venueTypes")
                            validateField(
                                "venueTypes",
                                checked === true
                                    ? [...formData.venueTypes, venueType]
                                    : formData.venueTypes.filter((t) => t !== venueType),
                            )
                          }}
                      />
                      <Label htmlFor={`venue-${venueType}`} className="text-sm">
                        {venueType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Label>
                    </div>
                ))}
              </div>
              <FieldError error={fieldTouched["venueTypes"] ? fieldErrors["venueTypes"] : undefined} />
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

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor={`price-${index}`}>{t("business.common.price")} (USD)</Label>
                          <p className="text-xs text-muted-foreground">
                            {t("business.serviceNew.priceExplanation") || "All prices should be entered in USD for consistency. The converted price in your selected currency will be shown below."}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                            <Input
                              id={`price-${index}`}
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={option.price.amount || ""}
                              onChange={(e) => updateOption(index, "price.amount", e.target.value ? Number(e.target.value) : undefined)}
                              className="pl-8"
                            />
                          </div>
                          <Select
                            value={option.price.type}
                            onValueChange={(value) => updateOption(index, "price.type", value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder={t("business.services.selectPriceType")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hourly">{t("business.pricing.hourly")}</SelectItem>
                              <SelectItem value="perPerson">{t("business.pricing.perPerson")}</SelectItem>
                              <SelectItem value="fixed">{t("business.pricing.fixed")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {currency !== "USD" && option.price.amount && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <span className="font-medium">{t("business.serviceNew.convertedPrice") || "Converted price"}:</span>{" "}
                              {formatPrice(convertPrice(option.price.amount, "USD" as Currency), currency)} {t(`business.pricing.${option.price.type}`)}
                            </p>
                          </div>
                        )}
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
                        onChange={(e) => handleImageUpload(e.target.files)}
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
                      {t("business.common.creating") || "Creating..."}
                </span>
                ) : (
                    t("business.serviceNew.createService") || "Create Service"
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
