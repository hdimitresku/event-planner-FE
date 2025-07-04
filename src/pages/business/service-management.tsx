"use client"

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
import {
  Search,
  Plus,
  Filter,
  Edit,
  Eye,
  Utensils,
  Music,
  Palette,
  Camera,
  Video,
  Car,
  Shield,
  Users,
  Upload,
  X,
  DollarSign,
  Trash,
} from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { ServiceNewModal } from "./service-new"
import * as serviceService from "../../services/serviceService"
import { Service, ServiceType } from "../../models/service"
import { PricingType } from "../../models/common"
import { toast } from "../../components/ui/use-toast"
import { Link } from "react-router-dom"

interface ServiceOption {
  id: string
  name: string
  description: string
  price: number
  pricingType: string
}

export default function ServicesManagementPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [options, setOptions] = useState<ServiceOption[]>([])
  const [showOptions, setShowOptions] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    name: { en: "", sq: "" },
    description: { en: "", sq: "" },
    type: ServiceType.OTHER,
    options: [
      {
        id: "opt1",
        name: { en: "", sq: "" },
        description: { en: "", sq: "" },
        price: {
          amount: 0,
          currency: "USD",
          type: PricingType.FIXED
        },
        popular: false
      }
    ],
    featured: false,
    active: true
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setLoading(true)
    try {
      // We'll need to get service summaries and then the full details for each
      const result = await serviceService.getServices()
      // For each service summary, get the full service details
      const serviceDetails = await Promise.all(
        result.map(async (service) => {
          const details = await serviceService.getServiceById(service.id)
          return details
        })
      )
      setServices(serviceDetails.filter((s): s is Service => s !== null))
    } catch (error) {
      console.error("Error fetching services:", error)
      toast({
        title: "Error",
        description: "Failed to load services. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter services based on search query, categories, price types, and statuses
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description[language].toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.type.toLowerCase())

    const matchesPriceType = selectedPriceTypes.length === 0 || 
      (service.options.length > 0 && 
       selectedPriceTypes.includes(service.options[0].price.type.toLowerCase()))

    const matchesStatus = selectedStatuses.length === 0 || 
      selectedStatuses.includes(service.isActive ? "active" : "inactive")

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && service.isActive) || 
      (activeTab === "inactive" && !service.isActive) ||
      (activeTab === "featured" && service.featured) ||
      (activeTab === "popular" && service.options.some(option => option.popular))

    return matchesSearch && matchesCategory && matchesPriceType && matchesStatus && matchesTab
  })

  // Get icon component based on category
  const getServiceTypeIcon = (type: ServiceType) => {
    switch (type) {
      case ServiceType.CATERING:
        return "🍽️"
      case ServiceType.MUSIC:
        return "🎵"
      case ServiceType.PHOTOGRAPHY:
        return "📸"
      case ServiceType.ENTERTAINMENT:
        return "🎭"
      case ServiceType.DECORATION:
        return "🎨"
      default:
        return "🔧"
    }
  }

  // Get price display based on price type
  const getPriceDisplay = (priceType: string, price: number) => {
    switch (priceType) {
      case "hourly":
        return `$${price}/${t("business.pricing.hourly")}`
      case "perPerson":
        return `$${price}/${t("business.pricing.perPerson")}`
      case "fixed":
        return `$${price} ${t("business.pricing.fixed")}`
      default:
        return `$${price}`
    }
  }

  const handleViewService = (service: Service) => {
    setSelectedService(service)
    setIsViewModalOpen(true)
  }

  const addOption = () => {
    const newOption: ServiceOption = {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      price: 0,
      pricingType: "fixed",
    }
    setOptions([...options, newOption])
  }

  const removeOption = (id: string) => {
    setOptions(options.filter((option) => option.id !== id))
  }

  const updateOption = (id: string, field: keyof ServiceOption, value: string | number) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, [field]: value } : option)))
  }

  const handleEditService = (service: Service) => {
    setSelectedService(service)
    // Initialize form with service data
    setEditForm({
      name: { ...service.name },
      description: { ...service.description },
      type: service.type,
      options: service.options.map(option => ({
        id: option.id,
        name: { ...option.name },
        description: { ...option.description },
        price: { ...option.price },
        popular: option.popular || false
      })),
      featured: service.featured || false,
      active: service.isActive
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm(t("business.services.confirmDelete") || "Are you sure you want to delete this service?")) {
      try {
        const result = await serviceService.deleteService(serviceId)
        if (result.success) {
          toast({
            title: "Success",
            description: "Service deleted successfully",
          })
          fetchServices() // Refresh the services list
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete service",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error("Error deleting service:", error)
        toast({
          title: "Error",
          description: "Failed to delete service. Please try again.",
          variant: "destructive"
        })
      }
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedService) return
    
    try {
      const result = await serviceService.updateService(selectedService.id, editForm)
      if (result.success) {
        toast({
          title: "Success",
          description: "Service updated successfully",
        })
        setIsEditModalOpen(false)
        fetchServices() // Refresh the services list
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update service",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error updating service:", error)
      toast({
        title: "Error",
        description: "Failed to update service. Please try again.",
        variant: "destructive"
      })
    }
  }

  const addOptionToForm = () => {
    setEditForm(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: `opt${prev.options.length + 1}`,
          name: { en: "", sq: "" },
          description: { en: "", sq: "" },
          price: {
            amount: 0,
            currency: "USD",
            type: PricingType.FIXED
          },
          popular: false
        }
      ]
    }))
  }

  const removeOptionFromForm = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const updateOptionField = (index: number, field: string, value: any) => {
    setEditForm(prev => {
      const newOptions = [...prev.options]
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        newOptions[index] = {
          ...newOptions[index],
          [parent]: {
            ...newOptions[index][parent as keyof typeof newOptions[typeof index]] as any,
            [child]: value
          }
        }
      } else {
        newOptions[index] = {
          ...newOptions[index],
          [field]: value
        }
      }
      return { ...prev, options: newOptions }
    })
  }

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("business.services.title") || "My Services"}</h1>
          <p className="text-muted-foreground">
            {t("business.services.subtitle") || "Manage your services and pricing options"}
          </p>
        </div>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white"
          asChild
        >
          <Link to="/business/service-new">
            <Plus className="mr-2 h-4 w-4" />
            {t("business.services.addService") || "Add Service"}
          </Link>
        </Button>
      </div>

      {/* Service New Modal */}
      <ServiceNewModal isOpen={isAddServiceModalOpen} onClose={() => setIsAddServiceModalOpen(false)} />

      {/* View Service Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] custom-scrollbar max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedService?.name[language]}</DialogTitle>
            <DialogDescription>{t("business.services.viewServiceDetails")}</DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedService.media?.[0]?.url || "/placeholder.svg"}
                  alt={selectedService.name[language]}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid gap-4 py-4">
                <div>
                  <h3 className="font-medium">{t("business.common.description")}</h3>
                  <p className="text-muted-foreground">{selectedService.description[language]}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("business.services.serviceType")}</h3>
                  <Badge>
                    {getServiceTypeIcon(selectedService.type)} {t(`business.serviceNew.${selectedService.type.toLowerCase()}`) || selectedService.type}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-medium mb-2">{t("business.services.options")}</h3>
                  <div className="space-y-4">
                    {selectedService.options.map((option) => (
                      <Card key={option.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{option.name[language]}</h4>
                          {option.popular && (
                            <Badge className="bg-amber-500">{t("business.services.popular")}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{option.description[language]}</p>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{option.price.amount}</span>
                          <span className="text-muted-foreground ml-1">
                            / {t(`common.${option.price.type.toLowerCase()}`)}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("business.services.editService")}</DialogTitle>
            <DialogDescription>{t("business.services.editServiceDescription")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name-en">{t("business.services.name")} (English)</Label>
              <Input
                id="name-en"
                value={editForm.name.en}
                onChange={(e) => setEditForm({ ...editForm, name: { ...editForm.name, en: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name-sq">{t("business.services.name")} (Albanian)</Label>
              <Input
                id="name-sq"
                value={editForm.name.sq}
                onChange={(e) => setEditForm({ ...editForm, name: { ...editForm.name, sq: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description-en">{t("business.services.description")} (English)</Label>
              <Textarea
                id="description-en"
                value={editForm.description.en}
                onChange={(e) => setEditForm({ ...editForm, description: { ...editForm.description, en: e.target.value } })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description-sq">{t("business.services.description")} (Albanian)</Label>
              <Textarea
                id="description-sq"
                value={editForm.description.sq}
                onChange={(e) => setEditForm({ ...editForm, description: { ...editForm.description, sq: e.target.value } })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="service-type">{t("business.services.type")}</Label>
              <Select
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value as ServiceType })}
              >
                <SelectTrigger id="service-type">
                  <SelectValue placeholder={t("business.services.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ServiceType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(`business.serviceNew.${type.toLowerCase()}`) || type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={editForm.featured}
                onCheckedChange={(checked) => setEditForm({ ...editForm, featured: checked === true })}
              />
              <Label htmlFor="featured">{t("business.services.featured")}</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={editForm.active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, active: checked === true })}
              />
              <Label htmlFor="active">{t("business.venues.active")}</Label>
            </div>

            <div className="mt-4">
              <Label className="mb-2 block">{t("business.services.pricingOptions")}</Label>
              
              {editForm.options.map((option, index) => (
                <Card key={index} className="mb-4 p-4">
                  <div className="flex justify-between mb-4">
                    <h4 className="font-medium">Option {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOptionFromForm(index)}
                      disabled={editForm.options.length === 1}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`option-name-en-${index}`}>{t("business.services.optionName")} (EN)</Label>
                        <Input
                          id={`option-name-en-${index}`}
                          value={option.name.en}
                          onChange={(e) => updateOptionField(index, 'name.en', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`option-name-sq-${index}`}>{t("business.services.optionName")} (SQ)</Label>
                        <Input
                          id={`option-name-sq-${index}`}
                          value={option.name.sq}
                          onChange={(e) => updateOptionField(index, 'name.sq', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor={`option-desc-en-${index}`}>{t("business.services.optionDescription")} (EN)</Label>
                      <Textarea
                        id={`option-desc-en-${index}`}
                        value={option.description.en}
                        onChange={(e) => updateOptionField(index, 'description.en', e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`option-desc-sq-${index}`}>{t("business.services.optionDescription")} (SQ)</Label>
                      <Textarea
                        id={`option-desc-sq-${index}`}
                        value={option.description.sq}
                        onChange={(e) => updateOptionField(index, 'description.sq', e.target.value)}
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`option-price-${index}`}>{t("business.services.price")}</Label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                          <Input
                            id={`option-price-${index}`}
                            type="number"
                            value={option.price.amount}
                            onChange={(e) => updateOptionField(index, 'price.amount', parseFloat(e.target.value))}
                            className="pl-7"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`option-price-type-${index}`}>{t("business.services.priceType")}</Label>
                        <Select
                          value={option.price.type}
                          onValueChange={(value) => updateOptionField(index, 'price.type', value)}
                        >
                          <SelectTrigger id={`option-price-type-${index}`}>
                            <SelectValue placeholder={t("business.services.selectPriceType")} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(PricingType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {t(`common.${type.toLowerCase()}`) || type.replace('_', ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-popular-${index}`}
                        checked={option.popular}
                        onCheckedChange={(checked) => updateOptionField(index, 'popular', checked === true)}
                      />
                      <Label htmlFor={`option-popular-${index}`}>{t("business.services.markAsPopular")}</Label>
                    </div>
                  </div>
                </Card>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addOptionToForm}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("business.services.addOption")}
              </Button>
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

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("business.services.searchServices")}
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
                <h3 className="font-medium mb-2">{t("business.common.category")}</h3>
                <div className="space-y-2">
                  {[
                    "catering",
                    "music",
                    "decoration",
                    "photography",
                    "videography",
                    "transportation",
                    "security",
                    "staffing",
                  ].map((category) => (
                    <div key={category} className="flex items-center space-x-2 group">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCategories([...selectedCategories, category])
                          } else {
                            setSelectedCategories(selectedCategories.filter((c) => c !== category))
                          }
                        }}
                        className="transition-all duration-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary group-hover:border-primary"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm cursor-pointer transition-colors group-hover:text-primary"
                      >
                        {t(`business.categories.${category}`)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">{t("business.common.price")}</h3>
                <div className="space-y-2">
                  {["fixed", "hourly", "perPerson"].map((priceType) => (
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

        {/* Services List */}
        <div className="space-y-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 h-10">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">{t("business.common.status.active")}</TabsTrigger>
              <TabsTrigger value="inactive">{t("business.common.status.inactive")}</TabsTrigger>
              <TabsTrigger value="featured">{t("business.common.featured")}</TabsTrigger>
              <TabsTrigger value="popular">{t("business.common.popular")}</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="text-center my-10">
                    <p>{t("common.loading") || "Loading..."}</p>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">{t("business.common.noItems")}</p>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={service.media?.[0]?.url || "/placeholder.svg"}
                          alt={service.name[language]}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${service.isActive ? "bg-emerald-500/90 dark:bg-emerald-600/90" : "bg-muted-foreground hover:bg-muted-foreground/80"}`}
                        >
                          {service.isActive ? t("business.venues.active") || "Active" : t("business.venues.inactive") || "Inactive"}
                        </Badge>
                        {service.featured && (
                          <Badge
                            className="absolute left-2 top-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400"
                          >
                            {t("business.services.featured") || "Featured"}
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getServiceTypeIcon(service.type)}
                          </div>
                          <CardTitle className="text-lg">{service.name[language]}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">{service.description[language]}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{t(`business.categories.${service.type.toLowerCase()}`)}</Badge>
                          <span className="font-medium">
                            {getPriceDisplay(
                              service.options.length > 0 ? service.options[0].price.type.toLowerCase() : 'fixed',
                              service.options.length > 0 ? service.options[0].price.amount : 0
                            )}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("business.common.edit")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewService(service)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("business.common.view")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t("business.common.delete")}</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              {/* Same structure as "all" tab but filtered for active services */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="text-center my-10">
                    <p>{t("common.loading") || "Loading..."}</p>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">{t("business.common.noItems")}</p>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={service.media?.[0]?.url || "/placeholder.svg"}
                          alt={service.name[language]}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${service.isActive ? "bg-emerald-500/90 dark:bg-emerald-600/90" : "bg-muted-foreground hover:bg-muted-foreground/80"}`}
                        >
                          {service.isActive ? t("business.venues.active") || "Active" : t("business.venues.inactive") || "Inactive"}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getServiceTypeIcon(service.type)}
                          </div>
                          <CardTitle className="text-lg">{service.name[language]}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">{service.description[language]}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{t(`business.categories.${service.type.toLowerCase()}`)}</Badge>
                          <span className="font-medium">
                            {getPriceDisplay(
                              service.options.length > 0 ? service.options[0].price.type.toLowerCase() : 'fixed',
                              service.options.length > 0 ? service.options[0].price.amount : 0
                            )}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("business.common.edit")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewService(service)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("business.common.view")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t("business.common.delete")}</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="inactive" className="mt-6">
              {/* Same structure for inactive services */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div className="text-center my-10">
                    <p>{t("common.loading") || "Loading..."}</p>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">{t("business.common.noItems")}</p>
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={service.media?.[0]?.url || "/placeholder.svg"}
                          alt={service.name[language]}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${service.isActive ? "bg-emerald-500/90 dark:bg-emerald-600/90" : "bg-muted-foreground hover:bg-muted-foreground/80"}`}
                        >
                          {service.isActive ? t("business.venues.active") || "Active" : t("business.venues.inactive") || "Inactive"}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            {getServiceTypeIcon(service.type)}
                          </div>
                          <CardTitle className="text-lg">{service.name[language]}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">{service.description[language]}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{t(`business.categories.${service.type.toLowerCase()}`)}</Badge>
                          <span className="font-medium">
                            {getPriceDisplay(
                              service.options.length > 0 ? service.options[0].price.type.toLowerCase() : 'fixed',
                              service.options.length > 0 ? service.options[0].price.amount : 0
                            )}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("business.common.edit")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 transition-all hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleViewService(service)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("business.common.view")}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash className="h-4 w-4" />
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
