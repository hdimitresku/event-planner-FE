"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useLanguage } from "../../context/language-context"
import { BusinessLayout } from "../../components/business/layout"
import { ServiceNewModal } from "./service-new"

interface ServiceOption {
  id: string
  name: string
  description: string
  price: number
  pricingType: string
}

export default function ServicesManagementPage() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [options, setOptions] = useState<ServiceOption[]>([])
  const [showOptions, setShowOptions] = useState(false)

  // Sample services data
  const services = [
    {
      id: 1,
      name: "Premium Catering Service",
      category: "catering",
      description: "Full-service catering for events of all sizes with customizable menus.",
      priceType: "perPerson",
      price: 45,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Catering",
      icon: Utensils,
      featured: true,
      popular: true,
    },
    {
      id: 2,
      name: "Professional DJ Services",
      category: "music",
      description: "Experienced DJs with professional equipment for any event type.",
      priceType: "hourly",
      price: 120,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=DJ",
      icon: Music,
      featured: true,
      popular: false,
    },
    {
      id: 3,
      name: "Event Photography",
      category: "photography",
      description: "Professional photography services to capture your special moments.",
      priceType: "fixed",
      price: 500,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Photography",
      icon: Camera,
      featured: false,
      popular: true,
    },
    {
      id: 4,
      name: "Luxury Transportation",
      category: "transportation",
      description: "Premium transportation services for guests and VIPs.",
      priceType: "fixed",
      price: 350,
      status: "inactive",
      image: "/placeholder.svg?height=200&width=300&text=Transportation",
      icon: Car,
      featured: false,
      popular: false,
    },
    {
      id: 5,
      name: "Event Decoration",
      category: "decoration",
      description: "Custom decoration services to transform your venue.",
      priceType: "fixed",
      price: 800,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Decoration",
      icon: Palette,
      featured: true,
      popular: true,
    },
    {
      id: 6,
      name: "Event Videography",
      category: "videography",
      description: "Professional video services to document your event.",
      priceType: "hourly",
      price: 150,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Videography",
      icon: Video,
      featured: false,
      popular: false,
    },
    {
      id: 7,
      name: "Security Personnel",
      category: "security",
      description: "Professional security staff for event safety.",
      priceType: "hourly",
      price: 35,
      status: "inactive",
      image: "/placeholder.svg?height=200&width=300&text=Security",
      icon: Shield,
      featured: false,
      popular: false,
    },
    {
      id: 8,
      name: "Event Staff",
      category: "staffing",
      description: "Professional event staff including servers, bartenders, and hosts.",
      priceType: "perPerson",
      price: 25,
      status: "active",
      image: "/placeholder.svg?height=200&width=300&text=Staffing",
      icon: Users,
      featured: false,
      popular: true,
    },
  ]

  // Filter services based on search query, categories, price types, and statuses
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(service.category)

    const matchesPriceType = selectedPriceTypes.length === 0 || selectedPriceTypes.includes(service.priceType)

    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(service.status)

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && service.status === "active") ||
      (activeTab === "inactive" && service.status === "inactive") ||
      (activeTab === "featured" && service.featured) ||
      (activeTab === "popular" && service.popular)

    return matchesSearch && matchesCategory && matchesPriceType && matchesStatus && matchesTab
  })

  // Get icon component based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "catering":
        return Utensils
      case "music":
        return Music
      case "decoration":
        return Palette
      case "photography":
        return Camera
      case "videography":
        return Video
      case "transportation":
        return Car
      case "security":
        return Shield
      case "staffing":
        return Users
      default:
        return Utensils
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

  const handleViewService = (service: any) => {
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

  const handleEditService = (service: any) => {
    setSelectedService(service)
    // Initialize options from service data if available
    if (service.options) {
      setOptions(
        service.options.map((opt: any) => ({
          id: opt.id || crypto.randomUUID(),
          name: opt.name,
          description: opt.description || "",
          price: opt.price,
          pricingType: opt.pricingType || "fixed",
        })),
      )
    } else {
      setOptions([])
    }
    setIsEditModalOpen(true)
  }

  return (
    <BusinessLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("business.services.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("business.services.subtitle")}</p>
        </div>
        <Button onClick={() => setIsAddServiceModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t("business.services.addService")}
        </Button>
      </div>

      {/* Service New Modal */}
      <ServiceNewModal isOpen={isAddServiceModalOpen} onClose={() => setIsAddServiceModalOpen(false)} />

      {/* View Service Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px] custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedService?.name}</DialogTitle>
            <DialogDescription>{t("business.services.viewServiceDetails")}</DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedService.image || "/placeholder.svg"}
                  alt={selectedService.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedService.icon && <selectedService.icon className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{t("business.common.category")}</h3>
                    <p>{t(`business.categories.${selectedService.category}`)}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">{t("business.common.description")}</h3>
                  <p className="text-muted-foreground">{selectedService.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">{t("business.common.price")}</h3>
                    <p>{getPriceDisplay(selectedService.priceType, selectedService.price)}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">{t("business.common.status")}</h3>
                    <Badge
                      className={
                        selectedService.status === "active"
                          ? "bg-emerald-500/90 dark:bg-emerald-600/90"
                          : "bg-muted-foreground hover:bg-muted-foreground/80"
                      }
                    >
                      {t(`business.common.status.${selectedService.status}`)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured" checked={selectedService.featured} disabled />
                    <label
                      htmlFor="featured"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("business.common.featured")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="popular" checked={selectedService.popular} disabled />
                    <label
                      htmlFor="popular"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("business.common.popular")}
                    </label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  {t("business.common.close")}
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false)
                    handleEditService(selectedService)
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

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{t("business.services.editService")}</DialogTitle>
            <DialogDescription>{t("business.services.editServiceDescription")}</DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              <div className="aspect-video overflow-hidden rounded-lg relative group">
                <img
                  src={selectedService.image || "/placeholder.svg"}
                  alt={selectedService.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button variant="secondary" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    {t("business.common.changeImage")}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("business.common.name")}</Label>
                    <Input id="name" defaultValue={selectedService.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t("business.common.description")}</Label>
                    <Textarea id="description" defaultValue={selectedService.description} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{t("business.serviceNew.serviceOptions")}</label>
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowOptions(!showOptions)}>
                      {showOptions ? t("business.common.hide") : t("business.common.show")}
                    </Button>
                  </div>

                  {showOptions && (
                    <div className="space-y-4">
                      {options.map((option) => (
                        <div key={option.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              {t("business.serviceNew.option")} #{options.indexOf(option) + 1}
                            </h4>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(option.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t("business.common.name")}*</label>
                              <Input
                                value={option.name}
                                onChange={(e) => updateOption(option.id, "name", e.target.value)}
                                placeholder={t("business.serviceNew.optionNamePlaceholder")}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">{t("business.serviceNew.pricingType")}*</label>
                              <select
                                value={option.pricingType}
                                onChange={(e) => updateOption(option.id, "pricingType", e.target.value)}
                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                              >
                                <option value="fixed">{t("business.pricing.fixed")}</option>
                                <option value="hourly">{t("business.pricing.hourly")}</option>
                                <option value="perPerson">{t("business.pricing.perPerson")}</option>
                                <option value="custom">{t("business.pricing.custom")}</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("business.common.description")}</label>
                            <textarea
                              value={option.description}
                              onChange={(e) => updateOption(option.id, "description", e.target.value)}
                              rows={2}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              placeholder={t("business.serviceNew.optionDescriptionPlaceholder")}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">{t("business.common.price")}*</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={option.price}
                                onChange={(e) => updateOption(option.id, "price", Number.parseFloat(e.target.value))}
                                className="pl-7"
                                placeholder="0.00"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" onClick={addOption} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {t("business.serviceNew.addOption")}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">{t("business.common.status")}</Label>
                    <Select defaultValue={selectedService.status}>
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
                    <Label htmlFor="category">{t("business.common.category")}</Label>
                    <Select defaultValue={selectedService.category}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder={t("business.common.selectCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="catering">{t("business.categories.catering")}</SelectItem>
                        <SelectItem value="music">{t("business.categories.music")}</SelectItem>
                        <SelectItem value="decoration">{t("business.categories.decoration")}</SelectItem>
                        <SelectItem value="photography">{t("business.categories.photography")}</SelectItem>
                        <SelectItem value="videography">{t("business.categories.videography")}</SelectItem>
                        <SelectItem value="transportation">{t("business.categories.transportation")}</SelectItem>
                        <SelectItem value="security">{t("business.categories.security")}</SelectItem>
                        <SelectItem value="staffing">{t("business.categories.staffing")}</SelectItem>
                        <SelectItem value="entertainment">{t("business.categories.entertainment")}</SelectItem>
                        <SelectItem value="other">{t("business.categories.other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="featured-edit" defaultChecked={selectedService.featured} />
                    <label htmlFor="featured-edit" className="text-sm font-medium leading-none cursor-pointer">
                      {t("business.common.featured")}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="popular-edit" defaultChecked={selectedService.popular} />
                    <label htmlFor="popular-edit" className="text-sm font-medium leading-none cursor-pointer">
                      {t("business.common.popular")}
                    </label>
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
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${service.status === "active" ? "bg-emerald-500/90 dark:bg-emerald-600/90" : "bg-muted-foreground hover:bg-muted-foreground/80"}`}
                        >
                          {t(`business.common.status.${service.status}`)}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <service.icon className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{t(`business.categories.${service.category}`)}</Badge>
                          <span className="font-medium">{getPriceDisplay(service.priceType, service.price)}</span>
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
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">{t("business.common.noItems")}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              {/* Same structure as "all" tab but filtered for active services */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${service.status === "active" ? "bg-emerald-500/90 dark:bg-emerald-600/90" : "bg-muted-foreground hover:bg-muted-foreground/80"}`}
                        >
                          {t(`business.common.status.${service.status}`)}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <service.icon className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{t(`business.categories.${service.category}`)}</Badge>
                          <span className="font-medium">{getPriceDisplay(service.priceType, service.price)}</span>
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
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">{t("business.common.noItems")}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="inactive" className="mt-6">
              {/* Same structure for inactive services */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="overflow-hidden space-y-3 card-hover bg-background rounded-lg overflow-hidden shadow-soft"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          className="object-cover w-full h-full"
                        />
                        <Badge
                          className={`absolute top-2 right-2 ${service.status === "active" ? "bg-emerald-500/90 dark:bg-emerald-600/90" : "bg-muted-foreground hover:bg-muted-foreground/80"}`}
                        >
                          {t(`business.common.status.${service.status}`)}
                        </Badge>
                      </div>
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <service.icon className="h-4 w-4 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">{service.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{t(`business.categories.${service.category}`)}</Badge>
                          <span className="font-medium">{getPriceDisplay(service.priceType, service.price)}</span>
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
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium">{t("business.common.noItems")}</h3>
                    <p className="text-muted-foreground mt-1">{t("business.common.noItems")}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </BusinessLayout>
  )
}
