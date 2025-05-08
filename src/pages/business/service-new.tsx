"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLanguage } from "../../context/language-context"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Upload, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"

interface ServiceNewModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ServiceOption {
  id: string
  name: string
  description: string
  price: number
  pricingType: string
}

export function ServiceNewModal({ isOpen, onClose }: ServiceNewModalProps) {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [options, setOptions] = useState<ServiceOption[]>([])
  const [showOptions, setShowOptions] = useState(false)

  const addOption = () => {
    const newOption: ServiceOption = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      price: 0,
      pricingType: "flat"
    }
    setOptions([...options, newOption])
  }

  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id))
  }

  const updateOption = (id: string, field: keyof ServiceOption, value: string | number) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, [field]: value } : option
    ))
  }

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("business.serviceNew.title")}</DialogTitle>
          <DialogDescription>{t("business.serviceNew.subtitle")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  {t("business.common.name")}*
                </label>
                <Input
                  id="name"
                  placeholder={t("business.serviceNew.serviceNamePlaceholder")}
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
                  <option value="catering">{t("business.categories.catering")}</option>
                  <option value="music">{t("business.categories.music")}</option>
                  <option value="decoration">{t("business.categories.decoration")}</option>
                  <option value="photography">{t("business.categories.photography")}</option>
                  <option value="videography">{t("business.categories.videography")}</option>
                  <option value="transportation">{t("business.categories.transportation")}</option>
                  <option value="security">{t("business.categories.security")}</option>
                  <option value="staffing">{t("business.categories.staffing")}</option>
                  <option value="entertainment">{t("business.categories.entertainment")}</option>
                  <option value="other">{t("business.categories.other")}</option>
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
                placeholder={t("business.serviceNew.descriptionPlaceholder")}
                required
              ></textarea>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t("business.serviceNew.serviceOptions")}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  {showOptions ? t("business.common.hide") : t("business.common.show")}
                </Button>
              </div>

              {showOptions && (
                <div className="space-y-4">
                  {options.map((option) => (
                    <div key={option.id} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{t("business.serviceNew.option")} #{options.indexOf(option) + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(option.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t("business.common.name")}*
                          </label>
                          <Input
                            value={option.name}
                            onChange={(e) => updateOption(option.id, "name", e.target.value)}
                            placeholder={t("business.serviceNew.optionNamePlaceholder")}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t("business.serviceNew.pricingType")}*
                          </label>
                          <select
                            value={option.pricingType}
                            onChange={(e) => updateOption(option.id, "pricingType", e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                          >
                            <option value="flat">{t("business.pricing.fixed")}</option>
                            <option value="hourly">{t("business.pricing.hourly")}</option>
                            <option value="person">{t("business.pricing.perPerson")}</option>
                            <option value="custom">{t("business.pricing.custom")}</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("business.common.description")}
                        </label>
                        <textarea
                          value={option.description}
                          onChange={(e) => updateOption(option.id, "description", e.target.value)}
                          rows={2}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder={t("business.serviceNew.optionDescriptionPlaceholder")}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("business.common.price")}*
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={option.price}
                            onChange={(e) => updateOption(option.id, "price", parseFloat(e.target.value))}
                            className="pl-7"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("business.serviceNew.addOption")}
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("business.serviceNew.serviceImage")}</label>
              <div className="flex h-64 cursor-pointer items-center justify-center rounded-md border border-dashed border-gray-300 hover:border-gray-400">
                <div className="flex flex-col items-center space-y-2 p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <div className="text-sm font-medium">
                    {t("business.common.dragPhotos")}
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("business.common.photoRequirements")}
                  </p>
                  <input type="file" className="hidden" accept="image/*" />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("business.common.saving")}
                </span>
              ) : (
                t("business.serviceNew.saveService")
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
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    navigate("/business/services")
  }

  return (
    <ServiceNewModal 
      isOpen={true} 
      onClose={() => navigate("/business/services")} 
    />
  )
}
