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
import { AddressAutocomplete } from "../../components/address-autocomplete"

interface VenueNewModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface VenueForm {
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
  dayAvailability: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export function VenueNewModal({ isOpen, onClose, onSuccess }: VenueNewModalProps) {
  const { t, language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [venueForm, setVenueForm] = useState<VenueForm>({
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
      country: "",
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

  // State for image uploads
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Add these new state variables after the existing useState declarations
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
  const [fieldTouched, setFieldTouched] = useState<{ [key: string]: boolean }>({})
  const [currentTabValid, setCurrentTabValid] = useState<{ [key: string]: boolean }>({
    details: false,
    photos: true, // Photos are optional
    pricing: false,
    amenities: true, // Amenities are optional
  })

  // Replace the existing validateForm function with this enhanced version
  const validateForm = () => {
    const errors: { [key: string]: string } = {}

    // Validate venue name
    if (!venueForm.name.en.trim()) {
      errors["name.en"] = "English name is required"
    }
    if (!venueForm.name.sq.trim()) {
      errors["name.sq"] = "Albanian name is required"
    }

    // Validate description
    if (!venueForm.description.en.trim()) {
      errors["description.en"] = "English description is required"
    }
    if (!venueForm.description.sq.trim()) {
      errors["description.sq"] = "Albanian description is required"
    }

    // Validate address
    if (!venueForm.address.street.trim()) {
      errors["address.street"] = "Street address is required"
    }
    if (!venueForm.address.city.trim()) {
      errors["address.city"] = "City is required"
    }
    if (!venueForm.address.state.trim()) {
      errors["address.state"] = "State is required"
    }
    if (!venueForm.address.zipCode.trim()) {
      errors["address.zipCode"] = "ZIP code is required"
    }

    // Validate capacity
    if (venueForm.capacity.min <= 0) {
      errors["capacity.min"] = "Minimum capacity must be greater than 0"
    }
    if (venueForm.capacity.max <= 0) {
      errors["capacity.max"] = "Maximum capacity must be greater than 0"
    }
    if (venueForm.capacity.recommended <= 0) {
      errors["capacity.recommended"] = "Recommended capacity must be greater than 0"
    }
    if (venueForm.capacity.min > venueForm.capacity.max) {
      errors["capacity.min"] = "Minimum capacity cannot be greater than maximum"
      errors["capacity.max"] = "Maximum capacity cannot be less than minimum"
    }
    if (venueForm.capacity.recommended > venueForm.capacity.max) {
      errors["capacity.recommended"] = "Recommended capacity cannot be greater than maximum"
    }

    // Validate pricing
    if (venueForm.price.amount <= 0) {
      errors["price.amount"] = "Price must be greater than 0"
    }

    setFieldErrors(errors)

    // Update tab validity
    const tabValidity = {
      details: ![
        "name.en",
        "name.sq",
        "description.en",
        "description.sq",
        "address.street",
        "address.city",
        "address.state",
        "address.zipCode",
        "capacity.min",
        "capacity.max",
        "capacity.recommended",
      ].some((field) => errors[field]),
      photos: true, // Always valid since photos are optional
      pricing: !errors["price.amount"],
      amenities: true, // Always valid since amenities are optional
    }
    setCurrentTabValid(tabValidity)

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
      case "address.street":
        if (!value?.trim()) {
          errors[fieldName] = "Street address is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "address.city":
        if (!value?.trim()) {
          errors[fieldName] = "City is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "address.state":
        if (!value?.trim()) {
          errors[fieldName] = "State is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "address.zipCode":
        if (!value?.trim()) {
          errors[fieldName] = "ZIP code is required"
        } else {
          delete errors[fieldName]
        }
        break
      case "capacity.min":
        if (!value || value <= 0) {
          errors[fieldName] = "Minimum capacity must be greater than 0"
        } else if (value > venueForm.capacity.max) {
          errors[fieldName] = "Minimum capacity cannot be greater than maximum"
        } else {
          delete errors[fieldName]
        }
        break
      case "capacity.max":
        if (!value || value <= 0) {
          errors[fieldName] = "Maximum capacity must be greater than 0"
        } else if (value < venueForm.capacity.min) {
          errors[fieldName] = "Maximum capacity cannot be less than minimum"
        } else {
          delete errors[fieldName]
        }
        break
      case "capacity.recommended":
        if (!value || value <= 0) {
          errors[fieldName] = "Recommended capacity must be greater than 0"
        } else if (value > venueForm.capacity.max) {
          errors[fieldName] = "Recommended capacity cannot be greater than maximum"
        } else {
          delete errors[fieldName]
        }
        break
      case "price.amount":
        if (!value || value <= 0) {
          errors[fieldName] = "Price must be greater than 0"
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

  // Add form validation function after the removeImage function

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
          description: `Venue "${venueForm.name.en}" created successfully`,
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

  // Update the TabsList to show validation status
  // Replace the existing TabsList with:
  return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("business.venueNew.title")}</DialogTitle>
            <DialogDescription>{t("business.venueNew.subtitle")}</DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full justify-start">
              <TabsTrigger value="details" className="flex items-center gap-2">
                {t("business.venueNew.details")}
                {currentTabValid.details ? (
                    <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                      />
                    </svg>
                ) : (
                    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                      />
                    </svg>
                )}
              </TabsTrigger>
              <TabsTrigger value="photos" className="flex items-center gap-2">
                {t("business.venueNew.photos")}
                <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                  />
                </svg>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                {t("business.venueNew.pricing")}
                {currentTabValid.pricing ? (
                    <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                      />
                    </svg>
                ) : (
                    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                      />
                    </svg>
                )}
              </TabsTrigger>
              <TabsTrigger value="amenities" className="flex items-center gap-2">
                {t("business.venueNew.amenities")}
                <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                  />
                </svg>
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Update all form inputs to include validation styling and error handling
                  // Replace the venue name inputs with: */}
                    <div className="space-y-2">
                      <Label htmlFor="name-en" className="flex items-center gap-1">
                        {t("business.common.name")}* (English)
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
                          value={venueForm.name.en}
                          onChange={(e) => {
                            setVenueForm({ ...venueForm, name: { ...venueForm.name, en: e.target.value } })
                            validateField("name.en", e.target.value)
                          }}
                          onBlur={() => handleFieldTouch("name.en")}
                          placeholder={t("business.venueNew.venueNamePlaceholder")}
                          className={`${fieldErrors["name.en"] ? "border-red-500 focus:border-red-500" : fieldTouched["name.en"] && !fieldErrors["name.en"] ? "border-green-500" : ""}`}
                          required
                      />
                      <FieldError error={fieldTouched["name.en"] ? fieldErrors["name.en"] : undefined} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-sq" className="flex items-center gap-1">
                        {t("business.common.name")}* (Albanian)
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
                          value={venueForm.name.sq}
                          onChange={(e) => {
                            setVenueForm({ ...venueForm, name: { ...venueForm.name, sq: e.target.value } })
                            validateField("name.sq", e.target.value)
                          }}
                          onBlur={() => handleFieldTouch("name.sq")}
                          placeholder={t("business.venueNew.venueNamePlaceholder")}
                          className={`${fieldErrors["name.sq"] ? "border-red-500 focus:border-red-500" : fieldTouched["name.sq"] && !fieldErrors["name.sq"] ? "border-green-500" : ""}`}
                          required
                      />
                      <FieldError error={fieldTouched["name.sq"] ? fieldErrors["name.sq"] : undefined} />
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
                              {t(`business.venueTypes.${type}`) || type.replace("_", " ")}
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
                    <AddressAutocomplete
                      onAddressSelect={(address) => {
                        setVenueForm({
                          ...venueForm,
                          address: {
                            street: address.street || "",
                            city: address.city || "",
                            state: address.state || "",
                            zipCode: address.zipCode || "",
                            country: address.country || "",
                          }
                        })
                      }}
                      defaultAddress={{
                        street: venueForm.address.street,
                        city: venueForm.address.city,
                        state: venueForm.address.state,
                        zipCode: venueForm.address.zipCode,
                        country: venueForm.address.country,
                      }}
                      disabled={false}
                      key={`${venueForm.address.street}-${venueForm.address.city}-${venueForm.address.state}-${venueForm.address.zipCode}-${venueForm.address.country}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street" className="flex items-center gap-2">
                        {t("business.common.street")}
                      </Label>
                    <Input
                        id="street"
                        name="street"
                        value={venueForm.address.street || ""}
                        onChange={(e) => {
                          const newStreet = e.target.value;
                          setVenueForm(prev => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              street: newStreet
                            }
                          }));
                        }}
                        placeholder={t("business.venueNew.addressPlaceholder")}
                        required
                    />
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t("business.common.city")}</Label>
                      <Input
                          id="city"
                        name="city"
                        value={venueForm.address.city || ""}
                        onChange={(e) => {
                          const newCity = e.target.value;
                          setVenueForm(prev => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              city: newCity
                            }
                          }));
                        }}
                          placeholder={t("business.venueNew.cityPlaceholder")}
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">{t("business.common.state")}</Label>
                      <Input
                          id="state"
                        name="state"
                        value={venueForm.address.state || ""}
                        onChange={(e) => {
                          const newState = e.target.value;
                          setVenueForm(prev => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              state: newState
                            }
                          }));
                        }}
                          placeholder={t("business.venueNew.statePlaceholder")}
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">{t("profile.zipCode") || "ZIP/Postal Code"}</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={venueForm.address.zipCode || ""}
                        onChange={(e) => {
                          const newZipCode = e.target.value;
                          setVenueForm(prev => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              zipCode: newZipCode
                            }
                          }));
                        }}
                          placeholder={t("business.venueNew.zipPlaceholder")}
                          required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">{t("profile.country") || "Country"}</Label>
                      <Input
                          id="country"
                        name="country"
                        value={venueForm.address.country || ""}
                        onChange={(e) => {
                          const newCountry = e.target.value;
                          setVenueForm(prev => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              country: newCountry
                            }
                          }));
                        }}
                          placeholder={t("business.venueNew.countryPlaceholder")}
                          required
                      />
                    </div>
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
                    {/* Add validation to the price input in the pricing tab
                  // Replace the price input with: */}
                    <div className="space-y-2">
                      <Label htmlFor="basePrice" className="flex items-center gap-1">
                        {t("business.common.price")}*
                        {fieldTouched["price.amount"] && !fieldErrors["price.amount"] && (
                            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                              />
                            </svg>
                        )}
                      </Label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                        <Input
                            id="basePrice"
                            type="number"
                            min="0"
                            step="0.01"
                            className={`pl-7 ${fieldErrors["price.amount"] ? "border-red-500 focus:border-red-500" : fieldTouched["price.amount"] && !fieldErrors["price.amount"] ? "border-green-500" : ""}`}
                            placeholder="0.00"
                            value={venueForm.price.amount}
                            onChange={(e) => {
                              const value = Number.parseFloat(e.target.value)
                              setVenueForm({
                                ...venueForm,
                                price: { ...venueForm.price, amount: value },
                              })
                              validateField("price.amount", value)
                            }}
                            onBlur={() => handleFieldTouch("price.amount")}
                            required
                        />
                      </div>
                      <FieldError error={fieldTouched["price.amount"] ? fieldErrors["price.amount"] : undefined} />
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
                                {t(`business.pricing.${type}`) || type.replace("_", " ")}
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
                  {/* Update the Create Venue button in the amenities tab to show a better loading state
                  Find the button in the amenities tab and replace it: */}
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
                        t("business.common.createVenue") || "Create Venue"
                    )}
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
