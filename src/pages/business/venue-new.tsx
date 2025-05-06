"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../context/language-context"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Upload } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

interface VenueNewModalProps {
  isOpen: boolean
  onClose: () => void
}

export function VenueNewModal({ isOpen, onClose }: VenueNewModalProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("business.venueNew.title")}</DialogTitle>
          <DialogDescription>{t("business.venueNew.subtitle")}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
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
                    <label htmlFor="name" className="text-sm font-medium">
                      {t("business.common.name")}*
                    </label>
                    <Input
                      id="name"
                      placeholder={t("business.venueNew.venueNamePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      {t("business.common.type")}*
                    </label>
                    <select
                      id="type"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">{t("business.common.selectType")}</option>
                      <option value="ballroom">{t("business.venueTypes.ballroom")}</option>
                      <option value="garden">{t("business.venueTypes.garden")}</option>
                      <option value="rooftop">{t("business.venueTypes.rooftop")}</option>
                      <option value="loft">{t("business.venueTypes.loft")}</option>
                      <option value="hotel">{t("business.venueTypes.hotel")}</option>
                      <option value="restaurant">{t("business.venueTypes.restaurant")}</option>
                      <option value="other">{t("business.venueTypes.other")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    {t("business.common.description")}*
                  </label>
                  <textarea
                    id="description"
                    rows={5}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder={t("business.venueNew.descriptionPlaceholder")}
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    {t("business.common.address")}*
                  </label>
                  <Input
                    id="address"
                    placeholder={t("business.venueNew.addressPlaceholder")}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium">
                      {t("business.common.city")}*
                    </label>
                    <Input id="city" placeholder={t("business.venueNew.cityPlaceholder")} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-sm font-medium">
                      {t("business.common.state")}*
                    </label>
                    <Input
                      id="state"
                      placeholder={t("business.venueNew.statePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-sm font-medium">
                      {t("business.common.zip")}*
                    </label>
                    <Input id="zip" placeholder={t("business.venueNew.zipPlaceholder")} required />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="capacity" className="text-sm font-medium">
                      {t("business.common.capacity")}*
                    </label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      placeholder={t("business.venueNew.capacityPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="size" className="text-sm font-medium">
                      {t("business.venueNew.size")}
                    </label>
                    <Input
                      id="size"
                      type="number"
                      min="1"
                      placeholder={t("business.venueNew.sizePlaceholder")}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("business.venueNew.mainPhoto")}</label>
                  <div className="flex h-64 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400">
                    <div className="flex flex-col items-center space-y-2 p-4 text-center">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div className="text-sm font-medium">
                        {t("business.common.dragPhotos")}
                      </div>
                      <p className="text-xs text-gray-500">
                        {t("business.common.photoRequirements")}
                      </p>
                      <input type="file" className="hidden" accept="image/*" multiple />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="basePrice" className="text-sm font-medium">
                      {t("business.common.price")}*
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                      <Input
                        id="basePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-7"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pricingType" className="text-sm font-medium">
                      {t("business.serviceNew.pricingType")}*
                    </label>
                    <select
                      id="pricingType"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="hourly">{t("business.pricing.hourly")}</option>
                      <option value="perPerson">{t("business.pricing.perPerson")}</option>
                      <option value="fixed">{t("business.pricing.fixed")}</option>
                      <option value="perDay">{t("business.pricing.perDay")}</option>
                    </select>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Simplified amenities list for demo purposes */}
                  {["WiFi", "Parking", "Kitchen", "Sound System", "Projector", "Chairs", "Tables", "Catering", "Bathroom"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={`amenity-${amenity}`} className="text-sm">
                        {t(`venues.amenities.${amenity.toLowerCase().replace(/\s+/g, "")}`) || amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("business.common.cancel")}
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
                    {t("business.common.saving")}
                  </span>
                ) : (
                  t("business.venueNew.saveVenue")
                )}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

// Keep the page component for direct navigation (fallback)
export default function BusinessVenueNewPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <VenueNewModal 
      isOpen={true} 
      onClose={() => navigate("/business/venues")} 
    />
  )
}
